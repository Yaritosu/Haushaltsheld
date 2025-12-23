import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUPABASE_CONFIGURED, supabase } from "../lib/supabaseClient";
import { useHousehold } from "../context/HouseholdContext";
import AppShell from "../components/AppShell";
import { useTasks } from "../context/TasksContext";
import { useWishlist } from "../context/WishlistContext";
import { useAchievements } from "../context/AchievementsContext";
import { ACHIEVEMENTS } from "../data/achievements";
import {
  BanknotesIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  CheckIcon,
  KeyIcon,
  LockClosedIcon,
  TrophyIcon,
  ChartPieIcon,
  CalendarDaysIcon,
  LinkIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";

type Props = { onLogout: () => void };

export default function Dashboard({ onLogout }: Props) {
  const navigate = useNavigate();
  const { household, membership, loading, refetch } = useHousehold();
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);

  // Punktesystem Anzeige (berechnet aus Aufgaben)
  const {
    myTasks,
    myActiveTasks,
    currentUserId,
    isDoneForNow,
    isDueNow,
    toggleDone,
    getBalance,
    getEarned,
    getSpent,
  } = useTasks();
  const currentPoints = getBalance(currentUserId);
  const earnedPoints = getEarned(currentUserId);
  const spentPoints = getSpent(currentUserId);
  const { items, redeem } = useWishlist();
  const myWishes = useMemo(
    () =>
      items.filter(
        (i) => i.status === "assigned" && i.assignedTo === currentUserId
      ),
    [items, currentUserId]
  );
  const openWishes = useMemo(
    () => items.filter((i) => i.status === "open"),
    [items]
  );
  const { unlockedAchievements } = useAchievements();
  const recentAchievements = useMemo(() => {
    return unlockedAchievements
      .slice()
      .sort((a, b) => b.unlockedAt - a.unlockedAt)
      .slice(0, 3)
      .map((ua) => ACHIEVEMENTS.find((a) => a.id === ua.id))
      .filter(Boolean);
  }, [unlockedAchievements]);

  const [selectedGoalId, setSelectedGoalId] = useState<string>("");

  useEffect(() => {
    if (myWishes.length > 0 && !selectedGoalId) {
      setSelectedGoalId(myWishes[0].id);
    }
  }, [myWishes, selectedGoalId]);

  useEffect(() => {
    if (!loading && !household && SUPABASE_CONFIGURED) {
      navigate("/onboarding");
    }
  }, [loading, household, navigate]);

  if (loading) {
    return (
      <div className="app-root dashboard">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <p>Lade Haushalt…</p>
        </div>
      </div>
    );
  }

  if (!household) {
    return null; // redirecting to onboarding
  }
  const isAdmin = membership?.role === "admin";

  const selectedWish = myWishes.find((w) => w.id === selectedGoalId);
  const goalPoints = selectedWish?.points ?? 0;
  const progressPercent =
    goalPoints > 0 ? Math.min((currentPoints / goalPoints) * 100, 100) : 0;
  const canRedeem = selectedWish && currentPoints >= goalPoints;

  const handleRedeem = () => {
    if (!selectedWish || !canRedeem) return;
    const success = redeem(selectedWish.id, currentUserId);
    if (success) {
      alert(
        `Wunsch "${selectedWish.title}" eingelöst! ${goalPoints} P wurden abgezogen.`
      );
      setSelectedGoalId("");
    } else {
      alert("Einlösen fehlgeschlagen. Prüfe deinen Punktestand.");
    }
  };

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        {/* Punktestand Card */}
        <div className="dashboard-card points-card">
          <div className="card-icon">
            <BanknotesIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Punktestand</h3>
          <div className="points-display">
            <div className="points-big">
              {currentPoints}
              <span className="points-label">P</span>
            </div>
            <div className="points-breakdown">
              <div className="points-line">
                <span>Verdient:</span>{" "}
                <span className="earned">{earnedPoints} P</span>
              </div>
              <div className="points-line">
                <span>Ausgegeben:</span>{" "}
                <span className="spent">{spentPoints} P</span>
              </div>
            </div>
          </div>
          <button
            className="card-action-btn"
            onClick={() => navigate("/members")}
          >
            <BanknotesIcon
              style={{
                width: 18,
                height: 18,
                verticalAlign: "text-bottom",
                marginRight: 8,
              }}
            />
            Punkte senden
          </button>
          <button
            className="card-action-btn secondary"
            onClick={() => navigate("/stats")}
          >
            <ArrowTrendingUpIcon
              style={{
                width: 18,
                height: 18,
                verticalAlign: "text-bottom",
                marginRight: 8,
              }}
            />
            Statistiken
          </button>
        </div>

        {/* Wunschzettel/Ziel Card */}
        <div className="dashboard-card wishlist-card">
          <div className="card-icon">
            <GiftIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Wunschzettel</h3>
          {myWishes.length === 0 && (
            <div className="muted" style={{ marginTop: "1rem" }}>
              Keine Wünsche zugeordnet. Wähle einen Wunsch im Wunschliste-Tab.
            </div>
          )}
          {myWishes.length > 0 && (
            <>
              <div className="goal-selector">
                <label
                  htmlFor="goal-select"
                  className="muted"
                  style={{
                    fontSize: "0.9rem",
                    marginBottom: "8px",
                    display: "block",
                  }}
                >
                  Aktuelles Ziel
                </label>
                <select
                  id="goal-select"
                  className="goal-dropdown"
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                >
                  {myWishes.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.points} P)
                    </option>
                  ))}
                </select>
              </div>
              <div className="goal-progress">
                <div className="progress-text">
                  <span>
                    {currentPoints} / {goalPoints} P
                  </span>
                  <span>
                    noch{" "}
                    {goalPoints - currentPoints > 0
                      ? goalPoints - currentPoints
                      : 0}{" "}
                    P
                  </span>
                </div>
                <div className="donut-container">
                  <svg
                    className="donut-svg"
                    viewBox="0 0 180 180"
                    style={{ width: 180, height: 180 }}
                  >
                    <circle
                      className="donut-bg"
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="20"
                    />
                    <circle
                      className="donut-progress"
                      cx="90"
                      cy="90"
                      r="70"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="20"
                      strokeDasharray={`${(progressPercent / 100) * 440} 440`}
                      strokeLinecap="round"
                      transform="rotate(-90 90 90)"
                      style={{
                        backdropFilter: "blur(8px)",
                        filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                        transition: "stroke-dasharray 0.5s ease",
                      }}
                    />
                    <text
                      x="90"
                      y="90"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        fill: "white",
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      }}
                    >
                      {Math.round(progressPercent)}%
                    </text>
                  </svg>
                </div>
              </div>
              <button
                className="card-action-btn"
                onClick={handleRedeem}
                disabled={!canRedeem}
                style={{
                  background: canRedeem
                    ? "linear-gradient(135deg, #6be76b, #4fc44f)"
                    : "rgba(255,255,255,0.15)",
                  color: canRedeem ? "#fff" : "var(--muted)",
                  fontWeight: canRedeem ? 900 : 700,
                  cursor: canRedeem ? "pointer" : "not-allowed",
                  boxShadow: canRedeem
                    ? "0 4px 16px rgba(107, 231, 107, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <CheckIcon
                  style={{
                    width: 18,
                    height: 18,
                    verticalAlign: "text-bottom",
                    marginRight: 8,
                  }}
                />
                {canRedeem
                  ? "Einlösen"
                  : `Noch ${goalPoints - currentPoints} P fehlen`}
              </button>
            </>
          )}
          <button
            className="card-action-btn secondary"
            onClick={() => navigate("/wishlist")}
            style={{ marginTop: "0.5rem" }}
          >
            <ArrowPathIcon
              style={{
                width: 18,
                height: 18,
                verticalAlign: "text-bottom",
                marginRight: 8,
              }}
            />
            Wunschliste verwalten
          </button>
        </div>

        {/* Aufgaben Card */}
        <div className="dashboard-card tasks-card">
          <div className="card-header-with-btn">
            <div>
              <div className="card-icon">
                <ClipboardDocumentListIcon style={{ width: 28, height: 28 }} />
              </div>
              <h3>Aufgaben</h3>
            </div>
            <button
              className="small-add-btn"
              onClick={() => navigate("/tasks")}
            >
              <ClipboardDocumentListIcon
                style={{
                  width: 16,
                  height: 16,
                  verticalAlign: "text-bottom",
                  marginRight: 6,
                }}
              />
              Zu meinen Aufgaben
            </button>
          </div>
          <div className="task-list">
            {myActiveTasks.slice(0, 4).map((t) => {
              const done = isDoneForNow(t, currentUserId);
              const due = isDueNow(t);
              return (
                <div
                  key={t.id}
                  className="task-item"
                  style={{
                    opacity: done ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      className="task-title"
                      style={{
                        textDecoration: done ? "line-through" : "none",
                        fontWeight: 600,
                      }}
                    >
                      {t.title}
                    </div>
                    <div
                      className="task-meta muted"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {t.points} P {due ? "" : "· (nicht fällig)"}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleDone(t.id)}
                    disabled={false}
                    style={{
                      background: done
                        ? "rgba(107, 231, 107, 0.3)"
                        : due
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255, 165, 0, 0.15)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      opacity: due ? 1 : 0.7,
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon
                      style={{ width: 18, height: 18, color: "white" }}
                    />
                  </button>
                </div>
              );
            })}
            {myActiveTasks.length === 0 && (
              <div className="task-item">
                <div className="task-title">Keine Aufgaben zugewiesen</div>
                <div className="task-meta muted">
                  Weise dir Aufgaben im Aufgaben-Tab zu.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistik Card */}
        <div className="dashboard-card stats-card">
          <div className="card-icon">
            <ChartPieIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Statistiken</h3>
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.8,
                    marginBottom: "0.25rem",
                  }}
                >
                  Aufgaben erledigt
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {myTasks.filter((t) => isDoneForNow(t, currentUserId)).length}
                </div>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.8,
                    marginBottom: "0.25rem",
                  }}
                >
                  Verdiente Punkte
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#6be76b",
                  }}
                >
                  {earnedPoints} P
                </div>
              </div>
            </div>
          </div>
          <button
            className="card-action-btn secondary"
            onClick={() => navigate("/stats")}
            style={{ marginTop: "1rem" }}
          >
            <ChartPieIcon
              style={{
                width: 18,
                height: 18,
                verticalAlign: "text-bottom",
                marginRight: 8,
              }}
            />
            Detaillierte Statistiken
          </button>
        </div>

        {/* Kalender Card */}
        <div className="dashboard-card calendar-card">
          <div className="card-icon">
            <CalendarDaysIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Kalender</h3>
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                padding: "1rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.8,
                  marginBottom: "0.5rem",
                }}
              >
                Heute fällig
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {myTasks.filter((t) => isDueNow(t)).length}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  opacity: 0.7,
                  marginTop: "0.25rem",
                }}
              >
                Aufgaben
              </div>
            </div>
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "0.9rem",
                opacity: 0.8,
              }}
            >
              📅 Termine & Fälligkeiten im Kalender ansehen
            </div>
          </div>
          <button
            className="card-action-btn secondary"
            onClick={() => navigate("/calendar")}
            style={{ marginTop: "1rem" }}
          >
            <CalendarDaysIcon
              style={{
                width: 18,
                height: 18,
                verticalAlign: "text-bottom",
                marginRight: 8,
              }}
            />
            Zum Kalender
          </button>
        </div>

        {/* Achievements Card */}
        <div className="dashboard-card achievements-card">
          <div className="card-header-with-btn">
            <div>
              <div className="card-icon">
                <TrophyIcon style={{ width: 28, height: 28 }} />
              </div>
              <h3>Auszeichnungen</h3>
            </div>
            <button
              className="small-add-btn"
              onClick={() => navigate("/achievements")}
            >
              <TrophyIcon
                style={{
                  width: 16,
                  height: 16,
                  verticalAlign: "text-bottom",
                  marginRight: 6,
                }}
              />
              Alle ansehen
            </button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "rgba(255, 215, 0, 0.15)",
                borderRadius: "8px",
                border: "1px solid rgba(255, 215, 0, 0.3)",
              }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                {unlockedAchievements.length} / {ACHIEVEMENTS.length}
              </span>
              <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                freigeschaltet
              </span>
            </div>

            {recentAchievements.length === 0 ? (
              <div
                className="muted"
                style={{ textAlign: "center", padding: "1rem" }}
              >
                Erledige Aufgaben, um Auszeichnungen freizuschalten! 🏆
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {recentAchievements.map((ach) => (
                  <div
                    key={ach?.id}
                    style={{
                      padding: "0.75rem",
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(184, 134, 11, 0.2))",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 215, 0, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "rgba(255, 215, 0, 0.3)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      🏆
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                        {ach?.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                        {ach?.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="admin-section">
          <button
            onClick={() => {
              if (household?.invite_code) {
                // Nutze SITE_URL aus env oder fallback auf window.location.origin
                const baseUrl =
                  import.meta.env.VITE_SITE_URL || window.location.origin;
                const link = `${baseUrl}/invite/${household.invite_code}`;
                navigator.clipboard.writeText(link).then(() => {
                  setInviteLinkCopied(true);
                  setTimeout(() => setInviteLinkCopied(false), 2000);
                });
              }
            }}
            className="admin-toggle-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {inviteLinkCopied ? (
              <>
                <CheckIcon style={{ width: 18, height: 18 }} />
                Link kopiert!
              </>
            ) : (
              <>
                <LinkIcon style={{ width: 18, height: 18 }} />
                Einladungslink kopieren
              </>
            )}
          </button>
        </div>
      )}
    </AppShell>
  );
}
