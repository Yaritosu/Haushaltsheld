import React, { useMemo } from "react";
import { ACHIEVEMENTS } from "../data/achievements";
import { useAchievements } from "../context/AchievementsContext";
import AppShell from "../components/AppShell";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  CheckBadgeIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  BoltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  PresentationChartLineIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  GiftIcon,
  HeartIcon,
  HandRaisedIcon,
  UserGroupIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  LightBulbIcon,
  SunIcon,
  ClockIcon,
  MoonIcon,
  HomeModernIcon,
  CakeIcon,
  BookOpenIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UsersIcon,
  ChevronUpIcon,
  ChevronDoubleUpIcon,
  ArrowUpIcon,
  ArrowUpCircleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

// Icon map
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckCircleIcon,
  CheckBadgeIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  BoltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  PresentationChartLineIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  GiftIcon,
  HeartIcon,
  HandRaisedIcon,
  UserGroupIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  LightBulbIcon,
  SunIcon,
  ClockIcon,
  MoonIcon,
  HomeModernIcon,
  CakeIcon,
  BookOpenIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  UsersIcon,
  ChevronUpIcon,
  ChevronDoubleUpIcon,
  ArrowUpIcon,
  ArrowUpCircleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  LockClosedIcon,
};

interface AchievementsPageProps {
  onLogout: () => void;
}

export default function AchievementsPage({ onLogout }: AchievementsPageProps) {
  const { isUnlocked, getProgress } = useAchievements();
  const navigate = useNavigate();

  // Group achievements by category
  const grouped = useMemo(() => {
    const groups: Record<string, typeof ACHIEVEMENTS> = {
      Aufgaben: [],
      Punkte: [],
      Streaks: [],
      Wünsche: [],
      Sozial: [],
      Besonders: [],
    };

    ACHIEVEMENTS.forEach((ach) => {
      const { type } = ach.requirement;
      if (type === "tasks_completed") groups["Aufgaben"].push(ach);
      else if (type === "points_earned") groups["Punkte"].push(ach);
      else if (type === "task_streak") groups["Streaks"].push(ach);
      else if (type === "wishes_redeemed") groups["Wünsche"].push(ach);
      else if (
        type === "single_task_count" ||
        type === "points_transferred" ||
        type === "login_streak"
      )
        groups["Sozial"].push(ach);
      else groups["Besonders"].push(ach);
    });

    return groups;
  }, []);

  const unlockedCount = ACHIEVEMENTS.filter((a) => isUnlocked(a.id)).length;

  return (
    <AppShell onLogout={onLogout}>
      <div style={{ padding: "2rem", color: "white" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            🏆 Auszeichnungen
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => navigate("/achievement-stats")}
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📊 Statistiken
            </button>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {unlockedCount} / {ACHIEVEMENTS.length}
              </span>
              <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>
                freigeschaltet
              </span>
            </div>
          </div>
        </div>

        {Object.entries(grouped).map(([category, achievements]) => (
          <div key={category} style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                borderBottom: "2px solid rgba(255,255,255,0.2)",
                paddingBottom: "0.5rem",
              }}
            >
              {category}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {achievements.map((ach) => {
                const unlocked = isUnlocked(ach.id);
                const { current, target } = getProgress(ach);
                const progress = Math.min(100, (current / target) * 100);
                const IconComp = ICON_MAP[ach.icon] || LockClosedIcon;

                return (
                  <div
                    key={ach.id}
                    className="dashboard-card"
                    style={{
                      background: unlocked
                        ? "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(184, 134, 11, 0.2))"
                        : "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(12px)",
                      border: unlocked
                        ? "2px solid rgba(255, 215, 0, 0.5)"
                        : "1px solid rgba(255,255,255,0.15)",
                      borderRadius: "12px",
                      padding: "1rem",
                      position: "relative",
                      transition: "all 0.3s ease",
                      opacity: unlocked ? 1 : 0.6,
                      cursor: "default",
                      minHeight: "auto",
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: unlocked
                          ? "rgba(255, 215, 0, 0.3)"
                          : "rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "0.5rem",
                        margin: "0 auto 0.5rem",
                        color: unlocked ? "#FFD700" : "white",
                        fontSize: "24px",
                      }}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "bold",
                        marginBottom: "0.35rem",
                        textAlign: "center",
                      }}
                    >
                      {ach.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.8rem",
                        opacity: 0.8,
                        marginBottom: "0.5rem",
                        textAlign: "center",
                        minHeight: "2.4rem",
                      }}
                    >
                      {ach.description}
                    </p>

                    {/* Progress Bar */}
                    {!unlocked && (
                      <div>
                        <div
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "6px",
                            height: "6px",
                            overflow: "hidden",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(90deg, var(--bronze-light), var(--bronze))",
                              height: "100%",
                              width: `${progress}%`,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            opacity: 0.7,
                            textAlign: "center",
                          }}
                        >
                          {current} / {target}
                        </p>
                      </div>
                    )}

                    {/* Unlocked Badge */}
                    {unlocked && (
                      <div
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.5rem",
                          background: "rgba(255, 215, 0, 0.9)",
                          color: "#000",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
