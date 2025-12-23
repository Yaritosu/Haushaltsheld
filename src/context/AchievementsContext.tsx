import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ACHIEVEMENTS, Achievement } from "../data/achievements";
import { useTasks } from "./TasksContext";
import { useWishlist } from "./WishlistContext";

const LS_ACHIEVEMENTS_KEY = "hh_achievements_v1";
const LS_REGISTRATION_KEY = "hh_registration_date";

// Track first login date
const getRegistrationDate = (): number => {
  const stored = localStorage.getItem(LS_REGISTRATION_KEY);
  if (stored) return parseInt(stored, 10);
  const now = Date.now();
  localStorage.setItem(LS_REGISTRATION_KEY, String(now));
  return now;
};

type UnlockedAchievement = {
  id: string;
  unlockedAt: number;
};

type AchievementsContextType = {
  unlockedAchievements: UnlockedAchievement[];
  unlocked: string[];
  checkAndUnlock: () => void;
  isUnlocked: (id: string) => boolean;
  getProgress: (achievement: Achievement) => {
    current: number;
    target: number;
  };
};

const AchievementsContext = createContext<AchievementsContextType | null>(null);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    UnlockedAchievement[]
  >([]);
  const { completions, currentUserId, getEarned, tasks, addAdjustment } =
    useTasks();
  const { items } = useWishlist();
  const registrationDate = getRegistrationDate();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LS_ACHIEVEMENTS_KEY);
    if (stored) {
      try {
        setUnlockedAchievements(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse achievements", e);
      }
    }
  }, []);

  // Save to localStorage whenever unlocked changes
  useEffect(() => {
    localStorage.setItem(
      LS_ACHIEVEMENTS_KEY,
      JSON.stringify(unlockedAchievements)
    );
  }, [unlockedAchievements]);

  const isUnlocked = (id: string) =>
    unlockedAchievements.some((a) => a.id === id);

  const getProgress = (
    achievement: Achievement
  ): { current: number; target: number } => {
    const { type, target, taskId } = achievement.requirement;
    let current = 0;
    // Consider only my completions since (re)set registration date
    const myAllCompletions = completions.filter(
      (c) => c.userId === currentUserId && c.ts >= registrationDate
    );

    switch (type) {
      case "tasks_completed":
        current = myAllCompletions
          .filter((c) => c.delta > 0)
          .filter(
            (c) =>
              !(
                c.taskId.startsWith("bonus:") ||
                c.taskId.startsWith("adjust:") ||
                c.taskId.startsWith("transfer:")
              )
          ).length;
        break;
      case "points_earned": {
        // Count only real task points, exclude bonuses/adjustments/transfers
        const earnedFromTasks = myAllCompletions
          .filter((c) => c.delta > 0)
          .filter((c) => c.taskId.startsWith("t"))
          .reduce((sum, c) => sum + c.points, 0);
        current = earnedFromTasks;
        break;
      }
      case "task_streak": {
        // Calculate longest streak of consecutive days with real task completions
        const dates = myAllCompletions
          .filter((c) => c.delta > 0)
          .filter(
            (c) =>
              !(
                c.taskId.startsWith("bonus:") ||
                c.taskId.startsWith("adjust:") ||
                c.taskId.startsWith("transfer:")
              )
          )
          .map((c) => new Date(c.ts).toDateString());
        const uniqueDates = Array.from(new Set(dates)).sort();

        let maxStreak = 0;
        let currentStreak = 0;
        let prevDate: Date | null = null;

        for (const dateStr of uniqueDates) {
          const date = new Date(dateStr);
          if (prevDate) {
            const diff =
              (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }
          maxStreak = Math.max(maxStreak, currentStreak);
          prevDate = date;
        }
        current = maxStreak;
        break;
      }
      case "single_task_count": {
        // Count completions for a single REAL task (any task, find max)
        const taskCounts = new Map<string, number>();
        myAllCompletions
          .filter((c) => c.delta > 0)
          .filter(
            (c) =>
              !(
                c.taskId.startsWith("bonus:") ||
                c.taskId.startsWith("adjust:") ||
                c.taskId.startsWith("transfer:")
              )
          )
          .forEach((c) => {
            taskCounts.set(c.taskId, (taskCounts.get(c.taskId) || 0) + 1);
          });
        current = Math.max(0, ...Array.from(taskCounts.values()));
        break;
      }
      case "wishes_redeemed": {
        current = items.filter(
          (i) => i.status === "redeemed" && i.assignedTo === currentUserId
        ).length;
        break;
      }
      case "points_transferred": {
        // Sum of points the user has transferred away
        current = myAllCompletions
          .filter((c) => c.delta < 0 && c.taskId.startsWith("transfer:from"))
          .reduce((sum, c) => sum + c.points, 0);
        break;
      }
      case "special": {
        // Custom logic based on achievement ID
        const myCompletions = myAllCompletions.filter(
          (c) => c.delta > 0 && c.taskId.startsWith("t")
        );

        // Time-based achievements
        if (achievement.id === "special_early_bird") {
          current = myCompletions.filter(
            (c) => new Date(c.ts).getHours() < 6
          ).length;
        } else if (achievement.id === "special_night_owl") {
          current = myCompletions.filter(
            (c) => new Date(c.ts).getHours() >= 22
          ).length;
        } else if (achievement.id === "special_weekend_warrior") {
          const weekend = myCompletions.filter((c) => {
            const day = new Date(c.ts).getDay();
            return day === 0 || day === 6;
          });
          current = weekend.length;
        }

        // Perfect day (all due tasks completed on same day)
        else if (achievement.id === "special_perfect_day") {
          const byDay = new Map<string, Set<string>>();
          myCompletions.forEach((c) => {
            const dayStr = new Date(c.ts).toDateString();
            if (!byDay.has(dayStr)) byDay.set(dayStr, new Set());
            byDay.get(dayStr)!.add(c.taskId);
          });
          // Check if any day has all assigned tasks completed
          for (const [day, taskIds] of byDay) {
            const myTasksAtThatTime = tasks.filter(
              (t) => t.assignee === currentUserId
            );
            if (
              taskIds.size >= myTasksAtThatTime.length &&
              myTasksAtThatTime.length > 0
            ) {
              current = 1;
              break;
            }
          }
        }

        // First achievements
        else if (achievement.id === "special_first_login") {
          current = 1; // Already registered
        } else if (achievement.id === "special_first_task") {
          current = tasks.length > 0 ? 1 : 0;
        } else if (achievement.id === "special_first_wish") {
          current = items.length > 0 ? 1 : 0;
        }

        // Team player
        else if (achievement.id === "special_team_player") {
          const transfers = completions.filter(
            (c) =>
              c.userId === currentUserId && c.taskId.startsWith("transfer:to")
          );
          current = transfers.length;
        }

        // Area-specific achievements
        else if (achievement.id === "creative_1") {
          // Saubermann - alle Putz-Aufgaben in einem Monat
          const cleaningAreas = ["Küche", "Bad", "Wohnzimmer", "Flur"];
          const thisMonth = new Date().toISOString().slice(0, 7);
          const monthCompletions = myCompletions.filter(
            (c) => new Date(c.ts).toISOString().slice(0, 7) === thisMonth
          );
          const uniqueCleaningTasks = new Set(
            monthCompletions
              .map((c) => tasks.find((t) => t.id === c.taskId))
              .filter((t) => t && cleaningAreas.includes(t.area))
              .map((t) => t!.id)
          );
          current = uniqueCleaningTasks.size >= 5 ? 1 : 0;
        } else if (achievement.id === "creative_2") {
          // Gärtner
          current = myCompletions.filter((c) => {
            const t = tasks.find((task) => task.id === c.taskId);
            return t && t.area === "Garten";
          }).length;
        } else if (achievement.id === "creative_3") {
          // Koch
          current = myCompletions.filter((c) => {
            const t = tasks.find((task) => task.id === c.taskId);
            return t && t.area === "Küche";
          }).length;
        }

        // Speed achievements
        else if (achievement.id === "creative_7") {
          // Schnellschuss - Aufgabe in unter 1 Minute
          // Simplified: if any task was completed, count as 1
          current = myCompletions.length > 0 ? 1 : 0;
        } else if (achievement.id === "creative_8") {
          // Multitasker - 5 Aufgaben an einem Tag
          const byDay = new Map<string, number>();
          myCompletions.forEach((c) => {
            const dayStr = new Date(c.ts).toDateString();
            byDay.set(dayStr, (byDay.get(dayStr) || 0) + 1);
          });
          current = Math.max(0, ...Array.from(byDay.values()));
        } else if (achievement.id === "fun_5") {
          // Speed-Runner - 10 Aufgaben in 1 Stunde
          const sorted = myCompletions.slice().sort((a, b) => a.ts - b.ts);
          let maxInHour = 0;
          for (let i = 0; i < sorted.length; i++) {
            const start = sorted[i].ts;
            const end = start + 3600000; // 1 hour
            const count = sorted.filter(
              (c) => c.ts >= start && c.ts <= end
            ).length;
            maxInHour = Math.max(maxInHour, count);
          }
          current = maxInHour;
        }

        // Time-of-day achievements
        else if (achievement.id === "fun_6") {
          // Nacht-Schicht - 50 Aufgaben nach 20 Uhr
          current = myCompletions.filter(
            (c) => new Date(c.ts).getHours() >= 20
          ).length;
        } else if (achievement.id === "fun_7") {
          // Morgen-Mensch - 50 Aufgaben vor 8 Uhr
          current = myCompletions.filter(
            (c) => new Date(c.ts).getHours() < 8
          ).length;
        } else if (achievement.id === "fun_8") {
          // Wochenend-Held - 100 Aufgaben am Wochenende
          current = myCompletions.filter((c) => {
            const day = new Date(c.ts).getDay();
            return day === 0 || day === 6;
          }).length;
        }

        // Registration time-based
        else if (achievement.id === "time_1") {
          // 1 Woche dabei
          const daysSince = Math.floor(
            (Date.now() - registrationDate) / (1000 * 60 * 60 * 24)
          );
          current = daysSince;
        } else if (
          achievement.id === "time_2" ||
          achievement.id === "time_3" ||
          achievement.id === "time_4" ||
          achievement.id === "time_5"
        ) {
          const daysSince = Math.floor(
            (Date.now() - registrationDate) / (1000 * 60 * 60 * 24)
          );
          current = daysSince;
        }

        // Level-based (based on earned points)
        else if (achievement.id.startsWith("level_")) {
          // Level counts only real task-earned points
          const earnedFromTasks = myAllCompletions
            .filter((c) => c.delta > 0 && c.taskId.startsWith("t"))
            .reduce((sum, c) => sum + c.points, 0);
          const level = Math.floor(earnedFromTasks / 100); // 100 task-points = 1 level
          current = level;
        }

        // Points milestones
        else if (achievement.id === "fun_1") {
          // Glückspilz - genau 777 Punkte
          // Balance based on all completions (but if you prefer task-only, adjust similarly)
          const balance =
            getEarned(currentUserId) -
            myAllCompletions
              .filter((c) => c.delta < 0)
              .reduce((s, c) => s + c.points, 0);
          current = balance === 777 ? 777 : 0;
        } else if (achievement.id === "fun_3") {
          // Sparsam - 1000 Punkte ohne ausgeben
          const spent = myAllCompletions
            .filter((c) => c.delta < 0)
            .reduce((s, c) => s + c.points, 0);
          const balance = getEarned(currentUserId) - spent;
          current = spent === 0 && balance >= 1000 ? 1000 : 0;
        } else if (achievement.id === "fun_4") {
          // Verschwender - 1000 Punkte ausgegeben
          const spent = myAllCompletions
            .filter((c) => c.delta < 0 && c.taskId.startsWith("adjust:redeem"))
            .reduce((s, c) => s + c.points, 0);
          current = spent;
        }

        // Community achievements
        else if (achievement.id === "creative_10") {
          // Sozial - 5 verschiedenen Mitgliedern Punkte geschenkt
          const recipients = new Set(
            myAllCompletions
              .filter((c) => c.taskId.startsWith("transfer:to"))
              .map((c) => c.taskId.split(":")[2])
          );
          current = recipients.size;
        }

        // Organizer achievements
        else if (achievement.id === "creative_4") {
          // Organisator - 5 Termine im Kalender
          const events = JSON.parse(
            localStorage.getItem("hh_calendar_events_v1") || "[]"
          );
          current = events.length;
        } else if (achievement.id === "creative_5") {
          // Rezept-Sammler - 10 Rezepte
          const recipes = JSON.parse(
            localStorage.getItem("hh_recipes_v1") || "[]"
          );
          current = recipes.length;
        } else if (achievement.id === "creative_6") {
          // Einkaufs-Profi - 20 Einkaufslisten-Einträge
          const recipes = JSON.parse(
            localStorage.getItem("hh_recipes_v1") || "[]"
          );
          const totalIngredients = recipes.reduce(
            (sum: number, r: any) => sum + (r.ingredients?.length || 0),
            0
          );
          current = totalIngredients;
        }

        // Discipline
        else if (achievement.id === "creative_9") {
          // Disziplin - Nie eine Aufgabe übersprungen (30 Tage)
          const daysSince = Math.floor(
            (Date.now() - registrationDate) / (1000 * 60 * 60 * 24)
          );
          current = daysSince >= 30 ? 30 : 0; // Simplified
        }

        // Community builder
        else if (
          achievement.id === "social_1" ||
          achievement.id === "social_2" ||
          achievement.id === "social_3"
        ) {
          // Simplified: count as 0 for now (would need household member tracking)
          current = 0;
        } else if (achievement.id === "social_4") {
          // Admin-Helfer
          // Count admin adjustments
          const adminActions = completions.filter(
            (c) =>
              c.userId === currentUserId &&
              (c.taskId.startsWith("bonus:") ||
                c.taskId.startsWith("adjust:admin"))
          );
          current = adminActions.length;
        }

        // Leaderboard achievements
        else if (achievement.id === "fun_9" || achievement.id === "fun_10") {
          // Would need global leaderboard - simplified
          current = 0;
        }

        // Perfect week
        else if (achievement.id === "fun_2") {
          // Perfektionist - 100% in einer Woche
          // Simplified: count as 0 (complex to calculate)
          current = 0;
        }

        break;
      }
      default:
        current = 0;
    }

    return { current, target };
  };

  const checkAndUnlock = () => {
    const newUnlocks: UnlockedAchievement[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (isUnlocked(achievement.id)) continue;

      const { current, target } = getProgress(achievement);
      if (current >= target) {
        newUnlocks.push({ id: achievement.id, unlockedAt: Date.now() });
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...newUnlocks]);

      // Award bonus points and show toast notification
      newUnlocks.forEach((unlock) => {
        const ach = ACHIEVEMENTS.find((a) => a.id === unlock.id);
        if (ach) {
          // Determine reward based on achievement type
          const isSpecial = ach.requirement.type === "special";
          const bonusPoints = isSpecial ? 50 : 10;

          // Award points
          if (currentUserId && addAdjustment) {
            addAdjustment(currentUserId, bonusPoints, `achievement:${ach.id}`);
          }

          showAchievementToast(ach.title, ach.description, bonusPoints);
        }
      });
      console.log("🏆 Neue Auszeichnungen freigeschaltet:", newUnlocks.length);
    }
  };

  // Toast queue for staggered notifications
  let toastQueue: { title: string; description: string; bonusPoints: number }[] = [];
  let isProcessingQueue = false;

  const processToastQueue = () => {
    if (isProcessingQueue || toastQueue.length === 0) return;
    
    isProcessingQueue = true;
    const { title, description, bonusPoints } = toastQueue.shift()!;
    
    showSingleToast(title, description, bonusPoints);
    
    // Process next toast after 3.5 seconds (toast duration + small gap)
    setTimeout(() => {
      isProcessingQueue = false;
      processToastQueue();
    }, 3500);
  };

  const showAchievementToast = (
    title: string,
    description: string,
    bonusPoints: number
  ) => {
    // Add to queue instead of showing immediately
    toastQueue.push({ title, description, bonusPoints });
    processToastQueue();
  };

  const showSingleToast = (
    title: string,
    description: string,
    bonusPoints: number
  ) => {
    // Create toast element
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(184, 134, 11, 0.95));
      color: #000;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 215, 0, 0.5);
      z-index: 10000;
      font-weight: bold;
      animation: slideIn 0.3s ease-out, slideOut 0.3s ease-in 2.7s;
      max-width: 350px;
      border: 2px solid rgba(255, 215, 0, 0.8);
    `;
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <div style="font-size: 2rem;">🏆</div>
        <div style="flex: 1;">
          <div style="font-size: 1.1rem; margin-bottom: 0.25rem;">${title}</div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.25rem;">${description}</div>
          <div style="font-size: 0.9rem; font-weight: bold; color: #006400;">+${bonusPoints} Bonuspunkte!</div>
        </div>
      </div>
    `;

    // Add animation keyframes
    if (!document.getElementById("achievement-toast-styles")) {
      const style = document.createElement("style");
      style.id = "achievement-toast-styles";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Remove after animation
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Auto-check on relevant state changes
  useEffect(() => {
    checkAndUnlock();
  }, [completions, items, currentUserId]);

  const unlocked = unlockedAchievements.map((a) => a.id);

  return (
    <AchievementsContext.Provider
      value={{
        unlockedAchievements,
        unlocked,
        checkAndUnlock,
        isUnlocked,
        getProgress,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext);
  if (!ctx)
    throw new Error("useAchievements must be used within AchievementsProvider");
  return ctx;
}
