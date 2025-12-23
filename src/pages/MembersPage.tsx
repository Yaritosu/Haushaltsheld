import AppShell from "../components/AppShell";
import {
  UsersIcon,
  PaperAirplaneIcon,
  BanknotesIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { useHousehold } from "../context/HouseholdContext";
import { SUPABASE_CONFIGURED, supabase } from "../lib/supabaseClient";
import { useTasks } from "../context/TasksContext";

type Props = { onLogout: () => void };

export default function MembersPage({ onLogout }: Props) {
  const { household, membership } = useHousehold();
  const { currentUserId, transferPoints, addAdjustment, completions } =
    useTasks();
  const [members, setMembers] = useState<
    Array<{
      id: string;
      role: string;
      email?: string | null;
      name?: string | null;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const isAdmin = membership?.role === "admin";

  // Memoized balances computed in one pass over completions (faster for viele Mitglieder)
  const balancesByUser = useMemo(() => {
    const regRaw = localStorage.getItem("hh_registration_date");
    const cutoff = regRaw ? parseInt(regRaw, 10) : 0;
    const earned: Record<string, number> = {};
    const spent: Record<string, number> = {};
    for (const c of completions) {
      if (c.ts < cutoff) continue;
      if (c.delta > 0) {
        earned[c.userId] = (earned[c.userId] || 0) + c.points;
      } else if (c.delta < 0) {
        spent[c.userId] = (spent[c.userId] || 0) + c.points;
      }
    }
    const map: Record<string, number> = {};
    const userIds = new Set<string>([...members.map((m) => m.id)]);
    for (const uid of userIds) {
      map[uid] = (earned[uid] || 0) - (spent[uid] || 0);
    }
    return map;
  }, [completions, members]);

  const handleTransfer = (toUserId: string) => {
    const amount = prompt("Wie viele Punkte senden?");
    if (!amount) return;
    const pts = parseInt(amount, 10);
    if (isNaN(pts) || pts <= 0) {
      alert("Ungültige Punktzahl");
      return;
    }
    const balance = balancesByUser[currentUserId] ?? 0;
    if (pts > balance) {
      alert("Nicht genug Punkte");
      return;
    }
    transferPoints(currentUserId, toUserId, pts, "transfer");
    alert(`${pts} Punkte gesendet!`);
  };

  const handleGift = (toUserId: string) => {
    const amount = prompt("Wie viele Punkte schenken (Admin)?");
    if (!amount) return;
    const pts = parseInt(amount, 10);
    if (isNaN(pts) || pts <= 0) {
      alert("Ungültige Punktzahl");
      return;
    }
    addAdjustment(toUserId, pts, "admin-gift");
    alert(`${pts} Punkte geschenkt!`);
  };

  useEffect(() => {
    const load = async () => {
      if (!SUPABASE_CONFIGURED || !supabase || !household) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("household_members")
          .select("id, role, user_id, profiles!inner(id, email, display_name)")
          .eq("household_id", household.id);
        if (!error && data) {
          // @ts-ignore
          setMembers(
            data.map((m: any) => ({
              id: m.user_id,
              role: m.role,
              email: m.profiles?.email ?? null,
              name: m.profiles?.display_name ?? null,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [household]);

  const copyInviteLink = () => {
    if (!household?.invite_code) return;
    const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const link = `${baseUrl}/invite/${household.invite_code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyInviteCode = () => {
    if (!household?.invite_code) return;
    navigator.clipboard.writeText(household.invite_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        {/* Einladungscode (für Admins) */}
        {isAdmin && household?.invite_code && SUPABASE_CONFIGURED && (
          <div className="dashboard-card">
            <div className="card-icon">
              <LinkIcon style={{ width: 28, height: 28 }} />
            </div>
            <h3>Einladungscode</h3>
            <p className="muted">
              Teile diesen Code oder Link, um neue Mitglieder einzuladen.
            </p>
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "1rem",
                  borderRadius: "8px",
                  textAlign: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    marginBottom: "0.25rem",
                    opacity: 0.7,
                  }}
                >
                  Code:
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    letterSpacing: "0.1em",
                    fontFamily: "monospace",
                  }}
                >
                  {household.invite_code}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={copyInviteCode}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    minWidth: "140px",
                  }}
                >
                  {copied ? (
                    <>
                      <CheckIcon style={{ width: 18, height: 18 }} />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon
                        style={{ width: 18, height: 18 }}
                      />
                      Code kopieren
                    </>
                  )}
                </button>
                <button
                  onClick={copyInviteLink}
                  className="primary"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    minWidth: "140px",
                  }}
                >
                  {copied ? (
                    <>
                      <CheckIcon style={{ width: 18, height: 18 }} />
                      Kopiert!
                    </>
                  ) : (
                    <>
                      <LinkIcon style={{ width: 18, height: 18 }} />
                      Link kopieren
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-card">
          <div className="card-icon">
            <UsersIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Mitglieder</h3>
          {!SUPABASE_CONFIGURED && (
            <p className="muted">
              Supabase ist nicht konfiguriert. Mitgliederverwaltung ist lokal
              deaktiviert.
            </p>
          )}
          {SUPABASE_CONFIGURED && (
            <div style={{ marginTop: "1rem" }}>
              <div className="task-list">
                {members.slice(0, pageSize).map((m) => (
                  <div key={m.id} className="task-item">
                    <div>
                      <div className="task-title">
                        {m.name || m.email || m.id.slice(0, 8)}
                      </div>
                      <div className="task-meta muted">
                        Kontostand: {balancesByUser[m.id] ?? 0} P
                      </div>
                    </div>
                    <div
                      className="muted"
                      style={{ marginLeft: "auto", display: "flex", gap: 8 }}
                    >
                      <button
                        className="nav-btn"
                        onClick={() => {
                          const val = prompt("Wie viele Punkte senden?", "100");
                          if (!val) return;
                          const p = parseInt(val, 10);
                          if (isNaN(p) || p <= 0) return;
                          transferPoints(currentUserId, m.id, p, "send");
                        }}
                      >
                        Senden
                      </button>
                      {membership?.role === "admin" && (
                        <button
                          className="nav-btn"
                          onClick={() => {
                            const val = prompt(
                              "Wie viele Punkte schenken?",
                              "100"
                            );
                            if (!val) return;
                            const p = parseInt(val, 10);
                            if (isNaN(p) || p <= 0) return;
                            addAdjustment(m.id, p, "gift");
                          }}
                        >
                          Schenken
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {members.length > pageSize && (
                  <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                    <button
                      className="nav-btn"
                      onClick={() => setPageSize((ps) => ps + 30)}
                    >
                      Mehr laden… ({pageSize}/{members.length})
                    </button>
                  </div>
                )}
                {!loading && members.length === 0 && (
                  <div className="task-item">
                    <div className="muted">Keine Mitglieder gefunden</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
