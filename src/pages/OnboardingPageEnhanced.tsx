import { useState } from "react";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useHousehold } from "../context/HouseholdContext";
import {
  CheckCircleIcon,
  HomeModernIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function OnboardingPageEnhanced() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<"create" | "join" | null>(null);
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refetch } = useHousehold();

  const createHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdName.trim()) {
      setError("Bitte gib einen Haushaltsnamen ein.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (!SUPABASE_CONFIGURED || !supabase)
        throw new Error("Supabase nicht konfiguriert");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht eingeloggt");

      const { error: rpcError } = await supabase.rpc(
        "create_household_with_admin",
        {
          household_name: householdName,
          user_id: user.id,
        }
      );

      if (rpcError) throw rpcError;

      setStep(3);
      await refetch();
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen des Haushalts");
      setLoading(false);
    }
  };

  const joinHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError("Bitte gib einen Einladungscode ein.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (!SUPABASE_CONFIGURED || !supabase)
        throw new Error("Supabase nicht konfiguriert");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Nicht eingeloggt");

      const { error: rpcError } = await supabase.rpc("join_household_by_code", {
        code: inviteCode.toUpperCase(),
        user_id: user.id,
      });

      if (rpcError) {
        if (rpcError.message.includes("Invalid invite code")) {
          throw new Error("Ungültiger Einladungscode");
        }
        if (rpcError.message.includes("Already a member")) {
          throw new Error("Du bist bereits Mitglied dieses Haushalts");
        }
        throw rpcError;
      }

      setStep(3);
      await refetch();
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message || "Fehler beim Beitreten");
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          style={{
            width: s <= step ? "60px" : "40px",
            height: "4px",
            background:
              s <= step ? "var(--bronze-light)" : "rgba(255,255,255,0.2)",
            borderRadius: "2px",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );

  return (
    <div
      className="app-root login-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div
        className="card"
        style={{ maxWidth: 520, width: "100%", margin: "1rem" }}
      >
        {renderProgressBar()}

        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          {step === 1 && "👋 Willkommen!"}
          {step === 2 &&
            (mode === "create"
              ? "🏠 Haushalt gründen"
              : "🤝 Haushalt beitreten")}
          {step === 3 && "🎉 Geschafft!"}
        </h2>

        <p
          className="muted"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          {step === 1 && "Lass uns deinen Haushalt einrichten"}
          {step === 2 && mode === "create" && "Erstelle einen neuen Haushalt"}
          {step === 2 &&
            mode === "join" &&
            "Tritt einem bestehenden Haushalt bei"}
          {step === 3 && "Alles bereit! Du wirst weitergeleitet..."}
        </p>

        {/* Step 1: Auswahl */}
        {step === 1 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <button
              className="primary"
              onClick={() => {
                setMode("create");
                setStep(2);
              }}
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                textAlign: "left",
              }}
            >
              <HomeModernIcon
                style={{ width: 32, height: 32, flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  Neuen Haushalt gründen
                </div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Erstelle einen neuen Haushalt und lade Mitglieder ein
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setMode("join");
                setStep(2);
              }}
              style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                textAlign: "left",
                background: "rgba(255,255,255,0.1)",
              }}
            >
              <UserGroupIcon style={{ width: 32, height: 32, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                  Bestehendem Haushalt beitreten
                </div>
                <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Nutze einen Einladungscode von deinem Admin
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Form */}
        {step === 2 && mode === "create" && (
          <form
            className="form"
            onSubmit={createHousehold}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Haushaltsname
              </label>
              <input
                type="text"
                placeholder="z.B. Familie Müller, WG Hauptstraße"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                required
                autoFocus
              />
              <div
                style={{
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  opacity: 0.7,
                }}
              >
                Du wirst automatisch als Admin hinzugefügt.
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMode(null);
                  setError("");
                }}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Zurück
              </button>
              <button
                className="primary"
                type="submit"
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? "Erstelle..." : "Haushalt erstellen"}
              </button>
            </div>
          </form>
        )}

        {step === 2 && mode === "join" && (
          <form
            className="form"
            onSubmit={joinHousehold}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Einladungscode
              </label>
              <input
                type="text"
                placeholder="8-stelliger Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={8}
                required
                autoFocus
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                }}
              />
              <div
                style={{
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  opacity: 0.7,
                }}
              >
                Du erhältst den Code vom Haushalt-Admin.
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setMode(null);
                  setError("");
                }}
                disabled={loading}
                style={{ flex: 1 }}
              >
                Zurück
              </button>
              <button
                className="primary"
                type="submit"
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? "Trete bei..." : "Beitreten"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <CheckCircleIcon
              style={{
                width: 80,
                height: 80,
                margin: "0 auto 1rem",
                color: "#6be76b",
                animation: "scaleIn 0.3s ease-out",
              }}
            />
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              {mode === "create"
                ? "Haushalt erfolgreich erstellt!"
                : "Erfolgreich beigetreten!"}
            </p>
            <p className="muted">Du wirst zum Dashboard weitergeleitet...</p>
          </div>
        )}

        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}
