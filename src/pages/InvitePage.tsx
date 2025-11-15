import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SUPABASE_CONFIGURED, supabase } from "../lib/supabaseClient";
import { useHousehold } from "../context/HouseholdContext";

export default function InvitePage() {
  const { code: rawCode } = useParams<{ code: string }>();
  const code = (rawCode || "").toUpperCase();
  const navigate = useNavigate();
  const { refetch } = useHousehold();
  const [status, setStatus] = useState<
    "idle" | "joining" | "done" | "error" | "needs-login"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!code || code.length < 6) {
        setStatus("error");
        setMessage("Ungültiger Einladungscode.");
        return;
      }

      if (!SUPABASE_CONFIGURED || !supabase) {
        setStatus("error");
        setMessage(
          "Supabase ist nicht konfiguriert. Einladungen sind deaktiviert."
        );
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Speichere Code und leite zum Login weiter
        localStorage.setItem("hh_pending_invite", code);
        setStatus("needs-login");
        setMessage("Bitte melde dich an, um der Einladung beizutreten…");
        navigate(`/login?invite=1`, { replace: true });
        return;
      }

      try {
        setStatus("joining");
        const { error } = await supabase.rpc("join_household_by_code", {
          code,
          user_id: user.id,
        });
        if (error) {
          if (String(error.message).includes("Already a member")) {
            setStatus("done");
            setMessage("Du bist bereits Mitglied. Weiter zum Dashboard…");
            await refetch();
            setTimeout(() => navigate("/dashboard", { replace: true }), 800);
            return;
          }
          throw error;
        }
        setStatus("done");
        setMessage("Einladung angenommen! Weiter zum Dashboard…");
        await refetch();
        setTimeout(() => navigate("/dashboard", { replace: true }), 800);
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.message || "Konnte der Einladung nicht beitreten");
      } finally {
        localStorage.removeItem("hh_pending_invite");
      }
    };
    run();
  }, [code]);

  return (
    <div
      className="app-root login-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ maxWidth: 520, width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>Einladung</h2>
        <p className="muted" style={{ textAlign: "center" }}>
          Code: <strong>{code}</strong>
        </p>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          {status === "joining" && <div>Trete dem Haushalt bei…</div>}
          {status === "needs-login" && <div>{message}</div>}
          {status === "done" && <div>{message}</div>}
          {status === "error" && (
            <>
              <div className="form-error" style={{ display: "inline-block" }}>
                {message}
              </div>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => navigate("/login")}>Zum Login</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
