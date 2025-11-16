import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { FamilyActivity } from "../data/familyActivities";

export type ActivityLogEntry = {
  id: string;
  activityId: string;
  activityTitle: string;
  completedAt: number; // timestamp
  completedBy: string; // user id
  rating?: number; // 1-5 stars
  notes?: string;
  duration?: number; // actual duration in minutes
  participants?: string[]; // array of user ids who participated
  photos?: string[]; // base64 encoded photos (optional)
};

type ActivityLogContextType = {
  logEntries: ActivityLogEntry[];
  addLogEntry: (activity: FamilyActivity, rating?: number, notes?: string, duration?: number, participants?: string[]) => void;
  getActivitiesCount: () => number;
  getActivitiesByCategory: () => Record<string, number>;
  getRecentActivities: (limit?: number) => ActivityLogEntry[];
  hasCompletedActivity: (activityId: string) => boolean;
  getCompletionCount: (activityId: string) => number;
  updateLogEntry: (entryId: string, updates: Partial<ActivityLogEntry>) => void;
  removeLogEntry: (entryId: string) => void;
  getTotalTimeSpent: () => number; // in minutes
  getFavoriteCategories: () => string[];
  getActivityStreak: () => number; // days with activities
};

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

const LS_ACTIVITY_LOG_KEY = "hh_activity_log_v1";

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [logEntries, setLogEntries] = useState<ActivityLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LS_ACTIVITY_LOG_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever logEntries change
  useEffect(() => {
    localStorage.setItem(LS_ACTIVITY_LOG_KEY, JSON.stringify(logEntries));
  }, [logEntries]);

  const addLogEntry = (
    activity: FamilyActivity,
    rating?: number,
    notes?: string,
    duration?: number,
    participants?: string[]
  ) => {
    const newEntry: ActivityLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      activityId: activity.id,
      activityTitle: activity.title,
      completedAt: Date.now(),
      completedBy: "current_user", // TODO: Get from actual user context
      rating,
      notes,
      duration,
      participants: participants || ["current_user"],
    };

    setLogEntries(prev => [newEntry, ...prev]);
  };

  const getActivitiesCount = () => {
    return logEntries.length;
  };

  const getActivitiesByCategory = () => {
    const categoryCount: Record<string, number> = {};
    logEntries.forEach(entry => {
      // We'd need to look up the activity to get its category
      // For now, we'll extract it from common patterns or store it in log entry
      const category = "Various"; // TODO: Improve this
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    return categoryCount;
  };

  const getRecentActivities = (limit = 10) => {
    return logEntries
      .sort((a, b) => b.completedAt - a.completedAt)
      .slice(0, limit);
  };

  const hasCompletedActivity = (activityId: string) => {
    return logEntries.some(entry => entry.activityId === activityId);
  };

  const getCompletionCount = (activityId: string) => {
    return logEntries.filter(entry => entry.activityId === activityId).length;
  };

  const updateLogEntry = (entryId: string, updates: Partial<ActivityLogEntry>) => {
    setLogEntries(prev =>
      prev.map(entry =>
        entry.id === entryId
          ? { ...entry, ...updates }
          : entry
      )
    );
  };

  const removeLogEntry = (entryId: string) => {
    setLogEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const getTotalTimeSpent = () => {
    return logEntries.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0);
  };

  const getFavoriteCategories = () => {
    const categoryCount = getActivitiesByCategory();
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .map(([category]) => category);
  };

  const getActivityStreak = () => {
    if (logEntries.length === 0) return 0;

    const sortedEntries = logEntries
      .sort((a, b) => b.completedAt - a.completedAt);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.completedAt);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  };

  return (
    <ActivityLogContext.Provider
      value={{
        logEntries,
        addLogEntry,
        getActivitiesCount,
        getActivitiesByCategory,
        getRecentActivities,
        hasCompletedActivity,
        getCompletionCount,
        updateLogEntry,
        removeLogEntry,
        getTotalTimeSpent,
        getFavoriteCategories,
        getActivityStreak,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error("useActivityLog must be used within an ActivityLogProvider");
  }
  return context;
}