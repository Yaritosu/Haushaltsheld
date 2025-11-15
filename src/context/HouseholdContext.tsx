import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabaseClient";
import type { Household, HouseholdMember } from "../types/household";

interface HouseholdContextType {
  household: Household | null;
  membership: HouseholdMember | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const HouseholdContext = createContext<HouseholdContextType>({
  household: null,
  membership: null,
  loading: true,
  error: null,
  refetch: async () => {},
});

export const useHousehold = () => useContext(HouseholdContext);

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [household, setHousehold] = useState<Household | null>(null);
  const [membership, setMembership] = useState<HouseholdMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refreshTimer = useRef<number | null>(null);

  const scheduleTokenRefresh = async () => {
    if (!SUPABASE_CONFIGURED || !supabase) return;
    try {
      const sessionResp = await supabase.auth.getSession();
      const expSec = sessionResp.data.session?.expires_at;
      if (!expSec) return;
      const msUntilExpiry = expSec * 1000 - Date.now();
      const msUntilRefresh = Math.max(15_000, msUntilExpiry - 60_000); // 1 Minute vor Ablauf
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(async () => {
        try {
          await supabase!.auth.refreshSession();
        } catch (e) {
          console.warn("Session refresh failed", e);
        } finally {
          scheduleTokenRefresh(); // erneut planen
        }
      }, msUntilRefresh);
    } catch (e) {
      console.warn("scheduleTokenRefresh failed", e);
    }
  };

  const fetchHousehold = async () => {
    setError(null);

    if (!SUPABASE_CONFIGURED || !supabase) {
      setLoading(false);
      return;
    }

    const withRetry = async <T,>(
      fn: () => Promise<T>,
      attempts = 2
    ): Promise<T> => {
      try {
        return await fn();
      } catch (err: any) {
        if (attempts <= 0) throw err;
        const msg = String(err?.message || err);
        // Bei abgelaufenen Tokens einmal refreshen und wiederholen
        if (
          msg.includes("JWT") ||
          msg.includes("token") ||
          msg.includes("expired")
        ) {
          try {
            await supabase!.auth.refreshSession();
          } catch {}
        }
        await new Promise((res) => setTimeout(res, 300 * (3 - attempts)));
        return withRetry(fn, attempts - 1);
      }
    };

    try {
      const {
        data: { user },
        error: userError,
      } = await withRetry(
        () => supabase!.auth.getUser() as unknown as Promise<any>
      );
      if (userError) {
        console.error("Auth error:", userError);
        setError("Authentifizierungsfehler");
        setHousehold(null);
        setMembership(null);
        setLoading(false);
        return;
      }
      if (!user) {
        setHousehold(null);
        setMembership(null);
        setLoading(false);
        return;
      }

      // Try to get household in one RPC call (more robust under RLS)
      const { data: rpcData, error: rpcError } = await withRetry(
        () => supabase!.rpc("get_my_household") as unknown as Promise<any>
      );

      if (!rpcError && rpcData) {
        if (rpcData.length > 0) {
          const row = rpcData[0];
          setHousehold({
            id: row.household_id,
            name: row.household_name,
            invite_code: row.invite_code,
            created_at: "",
            created_by: null,
          });
          setMembership({
            id: "unknown",
            household_id: row.household_id,
            user_id: user.id,
            role: row.role,
            joined_at: "",
          });
          setLoading(false);
          return;
        }
      }

      // Fallback: separate selects
      const { data: memberData, error: memberError } = await withRetry(
        () =>
          supabase!
            .from("household_members")
            .select("*")
            .eq("user_id", user.id)
            .single() as unknown as Promise<any>
      );

      if (memberError || !memberData) {
        setHousehold(null);
        setMembership(null);
        setLoading(false);
        return;
      }

      setMembership(memberData);

      const { data: householdData, error: householdError } = await withRetry(
        () =>
          supabase!
            .from("households")
            .select("*")
            .eq("id", memberData.household_id)
            .single() as unknown as Promise<any>
      );

      if (householdError || !householdData) {
        setHousehold(null);
        if (householdError) {
          console.error("Household fetch error:", householdError);
          setError("Fehler beim Laden des Haushalts");
        }
      } else {
        setHousehold(householdData);
      }
    } catch (err) {
      console.error("Error fetching household:", err);
      setError("Unerwarteter Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHousehold();
    scheduleTokenRefresh();
    if (!SUPABASE_CONFIGURED || !supabase) return;
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, _session) => {
        // bei Session-Änderungen Timer neu planen
        scheduleTokenRefresh();
      }
    );
    return () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // Realtime updates für Household Changes (optional)
  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !supabase || !household) return;

    const channel = supabase
      .channel("household_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "households",
          filter: `id=eq.${household.id}`,
        },
        () => {
          console.log("Household updated, refetching...");
          fetchHousehold();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "household_members",
          filter: `household_id=eq.${household.id}`,
        },
        () => {
          console.log("Member changed, refetching...");
          fetchHousehold();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [household?.id]);

  return (
    <HouseholdContext.Provider
      value={{ household, membership, loading, error, refetch: fetchHousehold }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}
