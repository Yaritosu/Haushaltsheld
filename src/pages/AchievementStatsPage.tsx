import React, { useMemo } from "react";
import { useAchievements } from "../context/AchievementsContext";
import { ACHIEVEMENTS } from "../data/achievements";
import {
  TrophyIcon,
  ChartBarIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

export function AchievementStatsPage() {
  const { unlocked, getProgress } = useAchievements();

  // Group achievements by category
  const categories = useMemo(() => {
    const groups: Record<string, typeof ACHIEVEMENTS> = {};
    ACHIEVEMENTS.forEach((ach) => {
      const category = ach.type;
      if (!groups[category]) groups[category] = [];
      groups[category].push(ach);
    });
    return groups;
  }, []);

  // Calculate stats
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = unlocked.length;
  const percentage = Math.round((unlockedCount / totalAchievements) * 100);

  // Find next unlockable achievements (progress > 0 but not unlocked)
  const nextUnlockable = useMemo(() => {
    const candidates: Array<{
      id: string;
      title: string;
      progress: number;
      target: number;
      icon: string;
    }> = [];
    ACHIEVEMENTS.forEach((ach) => {
      if (unlocked.includes(ach.id)) return;
      const prog = getProgress(ach);
      if (prog.current > 0 && prog.current < prog.max) {
        candidates.push({
          id: ach.id,
          title: ach.title,
          progress: prog.current,
          target: prog.max,
          icon: ach.icon,
        });
      }
    });
    // Sort by completion percentage descending
    return candidates
      .sort((a, b) => b.progress / b.target - a.progress / a.target)
      .slice(0, 5);
  }, [unlocked, getProgress]);

  const categoryLabels: Record<string, string> = {
    tasks_completed: "Aufgaben",
    points_earned: "Punkte",
    task_streak: "Serien",
    single_task_count: "Wiederholungen",
    wishes_redeemed: "Wünsche",
    points_transferred: "Transfers",
    special: "Besonders",
  };

  return (
    <div className="page-container">
      <h1 className="page-title">
        <ChartBarIcon className="icon" style={{ width: 32, height: 32 }} />
        Achievement-Statistiken
      </h1>

      {/* Overall Progress */}
      <div className="dashboard-card" style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <TrophyIcon className="icon" style={{ width: 24, height: 24 }} />
          Gesamtfortschritt
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background:
                "linear-gradient(135deg, var(--bronze-dark), var(--bronze-light))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {percentage}%
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                color: "var(--bronze-darker)",
              }}
            >
              {unlockedCount} von {totalAchievements} Achievements
              freigeschaltet
            </div>
            <div
              style={{
                width: "100%",
                height: "24px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, var(--bronze-dark), var(--bronze-light))",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Next Unlockable */}
      {nextUnlockable.length > 0 && (
        <div className="dashboard-card" style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <LockClosedIcon
              className="icon"
              style={{ width: 24, height: 24 }}
            />
            Nächste erreichbare Achievements
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {nextUnlockable.map((n) => {
              const IconComponent = require("@heroicons/react/24/outline")[
                n.icon
              ];
              const percent = Math.round((n.progress / n.target) * 100);
              return (
                <div
                  key={n.id}
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="icon"
                      style={{ width: 32, height: 32, flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {n.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "12px",
                          background: "rgba(255,255,255,0.3)",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background:
                              "linear-gradient(90deg, var(--bronze-dark), var(--bronze-light))",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--bronze-darker)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.progress} / {n.target}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="dashboard-card">
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>
          Fortschritt nach Kategorie
        </h2>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {Object.entries(categories).map(([cat, achs]) => {
            const unlockedInCat = achs.filter((a) =>
              unlocked.includes(a.id)
            ).length;
            const totalInCat = achs.length;
            const catPercent = Math.round((unlockedInCat / totalInCat) * 100);
            return (
              <div key={cat}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: "1rem" }}>
                    {categoryLabels[cat] || cat}
                  </span>
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--bronze-darker)",
                    }}
                  >
                    {unlockedInCat} / {totalInCat}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "16px",
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${catPercent}%`,
                      height: "100%",
                      background:
                        "linear-gradient(90deg, var(--bronze-dark), var(--bronze-light))",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
