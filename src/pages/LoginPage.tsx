import { useState, useEffect } from "react";
import { SUPABASE_CONFIGURED, supabase, SITE_URL } from "../lib/supabaseClient";

type Props = { onAuthSuccess?: () => void };

export default function LoginPage({ onAuthSuccess }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  // Pending invite Hinweis
  const [pendingInvite, setPendingInvite] = useState<string | null>(null);
  useEffect(() => {
    const p = localStorage.getItem("hh_pending_invite");
    if (p) setPendingInvite(p);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (SUPABASE_CONFIGURED && supabase) {
        if (isLogin) {
          const { error: signInError } = await supabase.auth.signInWithPassword(
            { email, password }
          );
          if (signInError) throw signInError;
        } else {
          // Signup ohne emailRedirectTo (verhindert Redirect-Probleme)
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                email: email,
              },
            },
          });
          if (signUpError) throw signUpError;
          // Wenn Email-Bestätigung aktiv ist, gibt es keine Session.
          if (!data.session) {
            setInfo(
              "Registrierung erfolgreich. Bitte bestätige deine E‑Mail und melde dich danach an."
            );
            setPendingEmail(email);
            setLoading(false);
            return;
          }
        }
      } else {
        // mock flow (Supabase nicht konfiguriert)
        await new Promise((r) => setTimeout(r, 400));
        if (!isLogin) {
          // Bei Registrierung ohne Supabase: Zeige Erfolg, dann automatisch einloggen
          setInfo(
            "Mock-Registrierung erfolgreich. Du wirst jetzt eingeloggt..."
          );
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      onAuthSuccess?.();
    } catch (err: any) {
      const msg = String(err?.message || "");
      if (/invalid login credentials/i.test(msg)) {
        setError(
          "Anmeldung fehlgeschlagen: Ungültige Zugangsdaten oder E‑Mail noch nicht bestätigt."
        );
      } else if (/email not confirmed/i.test(msg)) {
        setError("Bitte bestätige zuerst deine E‑Mail (prüfe dein Postfach).");
      } else {
        setError(msg || "Fehler beim Login");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    if (!pendingEmail || !SUPABASE_CONFIGURED || !supabase) return;
    setError("");
    setInfo("");
    try {
      await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
        options: {
          emailRedirectTo: (SITE_URL || window.location.origin) + "/login",
        },
      });
      setInfo("Bestätigungs‑E‑Mail wurde erneut gesendet.");
    } catch (err: any) {
      setError(err?.message || "Konnte Bestätigungs‑E‑Mail nicht senden");
    }
  };

  return (
    <div
      className="app-root login-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card" style={{ maxWidth: 420, width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>Haushaltsheld</h2>
        <p className="muted" style={{ textAlign: "center" }}>
          {isLogin ? "Melde dich an" : "Erstelle einen Account"}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-Mail Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="form-error">{error}</div>}
          {!error && info && (
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              {info}
              {isLogin === false && pendingEmail && (
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={resendConfirmation}>
                    Bestätigungs‑E‑Mail erneut senden
                  </button>
                </div>
              )}
            </div>
          )}
          {pendingInvite && isLogin && (
            <div
              style={{
                textAlign: "center",
                marginBottom: 8,
                fontSize: "0.85rem",
                opacity: 0.8,
              }}
            >
              Du wurdest eingeladen. Nach erfolgreichem Login trittst du
              automatisch bei. Code: <strong>{pendingInvite}</strong>
            </div>
          )}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Lade…" : isLogin ? "Anmelden" : "Registrieren"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Noch kein Account? Jetzt registrieren"
              : "Bereits registriert? Anmelden"}
          </button>
          {isLogin && (
            <div style={{ marginTop: 8 }}>
              <a href="/reset" className="muted">
                Passwort vergessen?
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
