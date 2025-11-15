import AppShell from "../components/AppShell";
import {
  SparklesIcon,
  ArrowPathIcon,
  ShareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import {
  FAMILY_ACTIVITIES,
  type FamilyActivity,
} from "../data/familyActivities";

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
    if (filteredActivities.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredActivities.length);
    setCurrentActivity(filteredActivities[randomIndex]);
  };

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

          {/* Generator Button */}
          <button
            onClick={generateRandomActivity}
            className="card-action-btn"
            style={{
              fontSize: "1.1rem",
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #ff6b6b, #ff8e53)",
              fontWeight: "bold",
              marginBottom: "1.5rem",
            }}
          >
            <ArrowPathIcon
              style={{
                width: 20,
                height: 20,
                verticalAlign: "text-bottom",
                marginRight: 8,
              }}
            />
            Neue Aktivität vorschlagen! ({filteredActivities.length} verfügbar)
          </button>

          {/* Current Activity Display */}
          {currentActivity && (
            <div
              style={{
                padding: "1.5rem",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                border: "2px solid rgba(255,255,255,0.2)",
                marginBottom: "1rem",
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
                      fontSize: "1.3rem",
                      color: "#fff",
                    }}
                  >
                    {currentActivity.title}
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
                </div>
              </div>

              <p style={{ margin: "0 0 1rem 0", lineHeight: "1.5" }}>
                {currentActivity.description}
              </p>

              {currentActivity.materials && (
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Material:</strong> {currentActivity.materials}
                </div>
              )}

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
      </div>
    </AppShell>
  );
}
