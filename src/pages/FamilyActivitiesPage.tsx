import AppShell from "../components/AppShell";
import {
  SparklesIcon,
  ArrowPathIcon,
  ShareIcon,
  HeartIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  FAMILY_ACTIVITIES,
  type FamilyActivity,
} from "../data/familyActivities";
import { useActivityLog } from "../context/ActivityLogContext";

type Props = { onLogout: () => void };

const LS_FAVORITES_KEY = "hh_family_favorites_v1";

export default function FamilyActivitiesPage({ onLogout }: Props) {
  const [currentActivity, setCurrentActivity] = useState<FamilyActivity | null>(
    null
  );
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(LS_FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [filterCategory, setFilterCategory] = useState<string>("Alle");
  const [filterSeason, setFilterSeason] = useState<string>("Alle");
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningActivities, setSpinningActivities] = useState<FamilyActivity[]>([]);
  const spinIntervalRef = useRef<number>();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedActivityForLog, setSelectedActivityForLog] = useState<FamilyActivity | null>(null);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");

  const { 
    addLogEntry, 
    getRecentActivities, 
    hasCompletedActivity, 
    getCompletionCount,
    getActivitiesCount 
  } = useActivityLog();

  const categories = [
    "Alle",
    ...Array.from(new Set(FAMILY_ACTIVITIES.map((a) => a.category))),
  ];
  const seasons = [
    "Alle",
    ...Array.from(
      new Set(FAMILY_ACTIVITIES.map((a) => a.season || "Ganzjährig"))
    ),
  ];

  const filteredActivities = useMemo(() => {
    return FAMILY_ACTIVITIES.filter((activity) => {
      const categoryMatch =
        filterCategory === "Alle" || activity.category === filterCategory;
      const seasonMatch =
        filterSeason === "Alle" ||
        activity.season === filterSeason ||
        activity.season === "Ganzjährig";
      return categoryMatch && seasonMatch;
    });
  }, [filterCategory, filterSeason]);

  const generateRandomActivity = () => {
    if (filteredActivities.length === 0 || isSpinning) return;
    
    setIsSpinning(true);
    setCurrentActivity(null);
    
    // Spielautomat-Animation: 50 schnelle Wechsel über 3 Sekunden
    let spinCount = 0;
    const maxSpins = 50;
    const spinDuration = 3000; // 3 Sekunden
    const spinInterval = spinDuration / maxSpins;
    
    spinIntervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * filteredActivities.length);
      const activity = filteredActivities[randomIndex];
      setSpinningActivities([activity]);
      
      spinCount++;
      
      if (spinCount >= maxSpins) {
        clearInterval(spinIntervalRef.current);
        setIsSpinning(false);
        setCurrentActivity(activity);
        setSpinningActivities([]);
        
        // Sound-Effekt (wenn möglich)
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgCkC96Oy7ZRUJUaXh6K1YERFKouKvaxkKVKPj6bFaEg9CmN2jeSYXMYDL8t2SRQsTWL/v4n0pBim3yOLeyuLONQgzqNPm5YhOBgm/1vHH9+CziaGXpZ2Rn2kOCWi57eOuVhYJUqXi6bFaEg9CmN2keSYWMYDM8tyQRAsQW77n4H8pBig');
          audio.play().catch(() => {}); // Ignoriere Fehler wenn Sound nicht funktioniert
        } catch (e) {
          // Ignoriere Fehler
        }
      }
    }, spinInterval);
  };
  
  // Cleanup bei Component Unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  const toggleFavorite = (activityId: string) => {
    const newFavorites = favorites.includes(activityId)
      ? favorites.filter((id) => id !== activityId)
      : [...favorites, activityId];
    setFavorites(newFavorites);
    localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const shareActivity = (activity: FamilyActivity) => {
    if (navigator.share) {
      navigator.share({
        title: `Familienaktivität: ${activity.title}`,
        text: `${activity.description}\n\nDauer: ${
          activity.duration
        }\nMaterial: ${activity.materials || "Nichts besonderes"}`,
        url: activity.link,
      });
    } else {
      // Fallback: Copy to clipboard
      const text = `${activity.title}\n\n${activity.description}\n\nDauer: ${
        activity.duration
      }\nMaterial: ${activity.materials || "Nichts besonderes"}${
        activity.link ? "\n\nMehr Info: " + activity.link : ""
      }`;
      navigator.clipboard.writeText(text);
      alert("Aktivität in Zwischenablage kopiert!");
    }
  };

  const markAsCompleted = (activity: FamilyActivity) => {
    setSelectedActivityForLog(activity);
    setShowCompletionModal(true);
    setRating(5);
    setNotes("");
    setDuration("");
  };

  const saveActivityLog = () => {
    if (!selectedActivityForLog) return;
    
    const durationNum = duration ? parseInt(duration) : undefined;
    addLogEntry(selectedActivityForLog, rating, notes, durationNum);
    
    setShowCompletionModal(false);
    setSelectedActivityForLog(null);
    alert(`🎉 "${selectedActivityForLog.title}" wurde zu deinem Activity-Log hinzugefügt!`);
  };

  const recentActivities = getRecentActivities(5);

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        {/* Generator Card */}
        <div
          className="dashboard-card"
          style={{ gridColumn: "1 / -1", maxWidth: "900px", margin: "0 auto" }}
        >
          <div className="card-icon">
            <SparklesIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Familien-Aktivitäts-Generator</h3>
          <p className="muted">
            Über {FAMILY_ACTIVITIES.length} kostenlose Ideen für gemeinsame
            Familienzeit!
          </p>

          {/* Filter */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: "150px" }}>
              <label
                className="muted"
                style={{
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Kategorie:
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ minWidth: "150px" }}>
              <label
                className="muted"
                style={{
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  display: "block",
                }}
              >
                Saison:
              </label>
              <select
                value={filterSeason}
                onChange={(e) => setFilterSeason(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                }}
              >
                {seasons.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Spielautomat Generator */}
          <div
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
              borderRadius: "15px",
              padding: "2rem",
              marginBottom: "2rem",
              border: "3px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                gap: "1rem",
              }}
            >
              <SparklesIcon style={{ width: 32, height: 32, color: "#fff" }} />
              <h2 style={{ margin: 0, color: "#fff", fontSize: "1.5rem" }}>
                🎰 FAMILIEN-AKTIVITÄTS-SPIELAUTOMAT 🎰
              </h2>
              <SparklesIcon style={{ width: 32, height: 32, color: "#fff" }} />
            </div>
            
            {/* Spielautomat-Display */}
            <div
              style={{
                background: "#000",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                border: "3px solid #333",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isSpinning ? (
                <div
                  style={{
                    color: "#00ff00",
                    fontSize: "1.2rem",
                    fontFamily: "monospace",
                    textAlign: "center",
                    animation: "blink 0.5s infinite",
                  }}
                >
                  {spinningActivities.length > 0 ? (
                    <div
                      style={{
                        transform: "scale(1.1)",
                        transition: "transform 0.1s",
                      }}
                    >
                      🎲 {spinningActivities[0].title}
                      <br />
                      <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                        {spinningActivities[0].category} • {spinningActivities[0].duration}
                      </span>
                    </div>
                  ) : (
                    "🎰 SPINNING... 🎰"
                  )}
                </div>
              ) : currentActivity ? (
                <div style={{ color: "#00ff00", textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>
                    🏆 {currentActivity.title}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                    {currentActivity.category} • {currentActivity.duration}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    color: "#666",
                    fontSize: "1.1rem",
                    textAlign: "center",
                  }}
                >
                  ★ Bereit für eine neue Aktivität? ★
                  <br />
                  <span style={{ fontSize: "0.9rem" }}>
                    Drücke den Knopf und lass dich überraschen!
                  </span>
                </div>
              )}
            </div>

            {/* Spielautomat-Hebel/Button */}
            <button
              onClick={generateRandomActivity}
              disabled={isSpinning || filteredActivities.length === 0}
              style={{
                fontSize: "1.2rem",
                padding: "1rem 3rem",
                background: isSpinning 
                  ? "linear-gradient(135deg, #666, #888)"
                  : "linear-gradient(135deg, #ffd700, #ffed4a)",
                color: "#000",
                fontWeight: "bold",
                border: "3px solid rgba(0,0,0,0.2)",
                borderRadius: "50px",
                cursor: isSpinning ? "not-allowed" : "pointer",
                transform: isSpinning ? "scale(0.95)" : "scale(1)",
                transition: "all 0.2s",
                boxShadow: isSpinning 
                  ? "inset 0 4px 8px rgba(0,0,0,0.3)" 
                  : "0 4px 15px rgba(255,215,0,0.5)",
                display: "block",
                margin: "0 auto",
              }}
            >
              {isSpinning ? (
                <>
                  <ArrowPathIcon
                    style={{
                      width: 24,
                      height: 24,
                      verticalAlign: "text-bottom",
                      marginRight: 10,
                      animation: "spin 0.5s linear infinite",
                    }}
                  />
                  SPINNING...
                </>
              ) : (
                <>
                  <PlayIcon
                    style={{
                      width: 24,
                      height: 24,
                      verticalAlign: "text-bottom",
                      marginRight: 10,
                    }}
                  />
                  AKTIVITÄT GENERIEREN!
                </>
              )}
            </button>
            
            <div
              style={{
                textAlign: "center",
                marginTop: "1rem",
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.9rem",
              }}
            >
              💫 {filteredActivities.length} Aktivitäten verfügbar 💫
            </div>
          </div>

          {/* Current Activity Display - Erweitert */}
          {currentActivity && (
            <div
              style={{
                padding: "2rem",
                background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
                borderRadius: "15px",
                border: "2px solid rgba(255, 215, 0, 0.3)",
                marginBottom: "2rem",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                animation: "glow 2s ease-in-out infinite alternate",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.5rem",
                      color: "#ffd700",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                      fontWeight: "bold",
                    }}
                  >
                    🎉 {currentActivity.title} 🎉
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {currentActivity.category}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        background: "rgba(107, 231, 107, 0.3)",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {currentActivity.duration}
                    </span>
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      {currentActivity.ageGroup}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => toggleFavorite(currentActivity.id)}
                    style={{
                      background: favorites.includes(currentActivity.id)
                        ? "rgba(255, 107, 107, 0.3)"
                        : "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <HeartIcon
                      style={{
                        width: 18,
                        height: 18,
                        fill: favorites.includes(currentActivity.id)
                          ? "#ff6b6b"
                          : "none",
                      }}
                    />
                  </button>
                  <button
                    onClick={() => shareActivity(currentActivity)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <ShareIcon style={{ width: 18, height: 18 }} />
                  </button>
                  <button
                    onClick={() => markAsCompleted(currentActivity)}
                    style={{
                      background: "rgba(107, 231, 107, 0.3)",
                      border: "1px solid rgba(107, 231, 107, 0.5)",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: "#6be76b",
                    }}
                  >
                    ✓
                  </button>
                </div>
              </div>

              <p style={{ 
                margin: "0 0 1.5rem 0", 
                lineHeight: "1.6", 
                fontSize: "1.1rem",
                background: "rgba(0,0,0,0.3)",
                padding: "1rem",
                borderRadius: "8px",
                borderLeft: "4px solid #ffd700"
              }}>
                {currentActivity.description}
              </p>

              {currentActivity.materials && (
                <div style={{ 
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  background: "rgba(107, 231, 107, 0.1)",
                  borderRadius: "8px",
                  border: "1px solid rgba(107, 231, 107, 0.3)"
                }}>
                  <strong style={{ color: "#6be76b" }}>🛠️ Material benötigt:</strong>
                  <br />
                  <span style={{ fontSize: "1.05rem" }}>{currentActivity.materials}</span>
                </div>
              )}
              
              {/* Zusätzliche Details */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                <div style={{ 
                  padding: "0.75rem",
                  background: "rgba(255, 107, 107, 0.1)",
                  borderRadius: "6px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>⏰ Dauer</div>
                  <div style={{ fontWeight: "bold", color: "#ff6b6b" }}>{currentActivity.duration}</div>
                </div>
                <div style={{ 
                  padding: "0.75rem",
                  background: "rgba(107, 170, 255, 0.1)",
                  borderRadius: "6px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>👶 Altersgruppe</div>
                  <div style={{ fontWeight: "bold", color: "#6baaff" }}>{currentActivity.ageGroup}</div>
                </div>
                {currentActivity.season && (
                  <div style={{ 
                    padding: "0.75rem",
                    background: "rgba(255, 193, 7, 0.1)",
                    borderRadius: "6px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>🌍 Saison</div>
                    <div style={{ fontWeight: "bold", color: "#ffc107" }}>{currentActivity.season}</div>
                  </div>
                )}
              </div>

              {currentActivity.link && (
                <a
                  href={currentActivity.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#6be76b",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  📖 Anleitung & mehr Infos →
                </a>
              )}
            </div>
          )}

          {!currentActivity && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                border: "2px dashed rgba(255,255,255,0.3)",
              }}
            >
              <SparklesIcon
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto 1rem",
                  opacity: 0.5,
                }}
              />
              <p className="muted">
                Klicke auf "Neue Aktivität vorschlagen!" um eine zufällige
                Familienaktivität zu erhalten.
              </p>
            </div>
          )}
        </div>

        {/* Favoriten Card */}
        {favorites.length > 0 && (
          <div
            className="dashboard-card"
            style={{
              gridColumn: "1 / -1",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <div className="card-icon">
              <HeartIcon style={{ width: 28, height: 28 }} />
            </div>
            <h3>Deine Favoriten ({favorites.length})</h3>
            <div style={{ marginTop: "1rem" }}>
              {favorites.map((favId) => {
                const activity = FAMILY_ACTIVITIES.find((a) => a.id === favId);
                if (!activity) return null;
                return (
                  <div
                    key={favId}
                    className="task-item"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div className="task-title">{activity.title}</div>
                      <div className="task-meta muted">
                        {activity.category} • {activity.duration}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => setCurrentActivity(activity)}
                        className="nav-btn"
                      >
                        Auswählen
                      </button>
                      <button
                        onClick={() => toggleFavorite(favId)}
                        className="nav-btn secondary"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity-Log Card */}
        <div
          className="dashboard-card"
          style={{
            gridColumn: "1 / -1",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <div className="card-icon">
            <SparklesIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>📊 Activity-Log ({getActivitiesCount()} Aktivitäten abgeschlossen)</h3>
          <p className="muted">Deine letzten Familienaktivitäten</p>
          
          {recentActivities.length > 0 ? (
            <div style={{ marginTop: "1rem" }}>
              {recentActivities.map((entry) => (
                <div
                  key={entry.id}
                  className="task-item"
                  style={{ 
                    marginBottom: "0.75rem",
                    background: hasCompletedActivity(entry.activityId) ? "rgba(107, 231, 107, 0.1)" : undefined
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div className="task-title">
                      {entry.activityTitle}
                      {getCompletionCount(entry.activityId) > 1 && (
                        <span style={{ 
                          fontSize: "0.8rem", 
                          opacity: 0.7,
                          marginLeft: "0.5rem"
                        }}>
                          ({getCompletionCount(entry.activityId)}x gemacht)
                        </span>
                      )}
                    </div>
                    <div className="task-meta muted">
                      {new Date(entry.completedAt).toLocaleDateString("de-DE")} 
                      {entry.rating && (
                        <span style={{ marginLeft: "1rem" }}>
                          {"⭐".repeat(entry.rating)}
                        </span>
                      )}
                      {entry.duration && (
                        <span style={{ marginLeft: "1rem" }}>
                          ⏱️ {entry.duration} Min
                        </span>
                      )}
                    </div>
                    {entry.notes && (
                      <div style={{ 
                        fontSize: "0.9rem", 
                        fontStyle: "italic",
                        marginTop: "0.25rem",
                        opacity: 0.8
                      }}>
                        "{entry.notes}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
                marginTop: "1rem",
              }}
            >
              <p className="muted">
                Noch keine Aktivitäten abgeschlossen. 
                <br />Probiere eine Aktivität aus und markiere sie als erledigt! 🎯
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && selectedActivityForLog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="dashboard-card"
            style={{
              maxWidth: "500px",
              margin: "2rem",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h3>🎉 Aktivität abgeschlossen!</h3>
            <p><strong>{selectedActivityForLog.title}</strong></p>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Bewertung:
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: star <= rating ? "#ffd700" : "#666",
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Tatsächliche Dauer (Minuten):
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="z.B. 45"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Notizen (optional):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Wie war die Aktivität? Was könnte man beim nächsten Mal besser machen?"
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={saveActivityLog}
                className="card-action-btn"
                style={{ flex: 1 }}
              >
                Speichern
              </button>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="card-action-btn secondary"
                style={{ flex: 1 }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
