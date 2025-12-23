import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabaseClient";

export type Area =
  | "Wohnzimmer"
  | "Küche"
  | "Flur"
  | "Schlafzimmer"
  | "Bad"
  | "Garten"
  | "Garage"
  | "Balkon"
  | "Keller"
  | "Arbeitszimmer"
  | "Esszimmer";
export const ALL_AREAS: Area[] = [
  "Wohnzimmer",
  "Küche",
  "Flur",
  "Schlafzimmer",
  "Bad",
  "Garten",
  "Garage",
  "Balkon",
  "Keller",
  "Arbeitszimmer",
  "Esszimmer",
];

export type Recurrence =
  | "taeglich"
  | "woechentlich"
  | "monatlich"
  | "jaehrlich"
  | "einmalig"
  | "sonder";
export const RECURRENCE_ORDER: Recurrence[] = [
  "taeglich",
  "woechentlich",
  "monatlich",
  "jaehrlich",
  "einmalig",
  "sonder",
];
export const RECURRENCE_LABEL: Record<Recurrence, string> = {
  taeglich: "Täglich",
  woechentlich: "Wöchentlich",
  monatlich: "Monatlich",
  jaehrlich: "Jährlich",
  einmalig: "Einmalig",
  sonder: "Sonder",
};

export type Task = {
  id: string;
  title: string;
  points: number;
  area: Area;
  recurrence: Recurrence;
  assignee?: string; // user id
  // per-user last completion timestamp (ms since epoch)
  doneBy?: Record<string, number>;
  // optional schedule parameters (used for jaehrlich customization later)
  yearlyMonth?: number; // 1-12, default 6
  yearlyDay?: number; // 1-31, default 1
  weeklyDay?: number; // 0-6 (Mon=0)
  monthlyDay?: number; // 1-31
};

const LS_TASKS_KEY = "hh_tasks_v2";
const LS_USER_KEY = "hh_user_id";
const LS_LOG_KEY = "hh_task_log_v1";
const LS_REGISTRATION_KEY = "hh_registration_date";

function getRegistrationDate(): number {
  try {
    const raw = localStorage.getItem(LS_REGISTRATION_KEY);
    if (raw) return parseInt(raw, 10);
  } catch {}
  const now = Date.now();
  try {
    localStorage.setItem(LS_REGISTRATION_KEY, String(now));
  } catch {}
  return now;
}

function getLocalUserId(): string {
  const existing = localStorage.getItem(LS_USER_KEY);
  if (existing) return existing;
  const id = "local-" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem(LS_USER_KEY, id);
  return id;
}

async function getSupabaseUserId(): Promise<string | null> {
  if (!SUPABASE_CONFIGURED || !supabase) return null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  } catch {
    return null;
  }
}

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  currentUserId: string;
  myTasks: Task[];
  myActiveTasks: Task[];
  addTask: (t: Omit<Task, "id" | "doneBy">) => void;
  assignToMe: (taskId: string) => void;
  unassign: (taskId: string) => void;
  toggleDone: (taskId: string) => void;
  isDoneForNow: (t: Task, userId?: string, now?: Date) => boolean;
  isDueNow: (t: Task, now?: Date) => boolean;
  completions: Array<{
    taskId: string;
    userId: string;
    ts: number;
    points: number;
    delta: 1 | -1;
  }>;
  addBonus: (userId: string, points: number, note?: string) => void;
  addAdjustment: (userId: string, points: number, note?: string) => void;
  transferPoints: (
    fromUserId: string,
    toUserId: string,
    points: number,
    note?: string
  ) => void;
  getBalance: (userId?: string) => number;
  getEarned: (userId?: string) => number;
  getSpent: (userId?: string) => number;
  clearAll: () => void;
  resetAllData: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(LS_TASKS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    // Leerer Start - keine Demo-Aufgaben
    return [];
  });
  const [currentUserId, setCurrentUserId] = useState<string>(getLocalUserId());

  useEffect(() => {
    // try to use supabase user id if available
    getSupabaseUserId().then((id) => {
      if (id) setCurrentUserId(id);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_TASKS_KEY, JSON.stringify(tasks));
    // Broadcast to other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: LS_TASKS_KEY,
        newValue: JSON.stringify(tasks),
      })
    );
  }, [tasks]);

  const [completions, setCompletions] = useState<
    Array<{
      taskId: string;
      userId: string;
      ts: number;
      points: number;
      delta: 1 | -1;
    }>
  >(() => {
    try {
      const raw = localStorage.getItem(LS_LOG_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [registrationDate] = useState<number>(getRegistrationDate());

  useEffect(() => {
    localStorage.setItem(LS_LOG_KEY, JSON.stringify(completions));
    // Broadcast to other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: LS_LOG_KEY,
        newValue: JSON.stringify(completions),
      })
    );
  }, [completions]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LS_TASKS_KEY && e.newValue) {
        try {
          setTasks(JSON.parse(e.newValue));
        } catch {}
      } else if (e.key === LS_LOG_KEY && e.newValue) {
        try {
          setCompletions(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Supabase Realtime sync for multi-device support
  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !supabase || !currentUserId) return;

    const channel = supabase
      .channel("household_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        (payload) => {
          console.log("Realtime task change:", payload);
          if (payload.eventType === "INSERT") {
            const newTask = payload.new as any;
            setTasks((prev) => {
              if (prev.find((t) => t.id === newTask.id)) return prev;
              return [
                ...prev,
                {
                  id: newTask.id,
                  title: newTask.title,
                  points: newTask.points,
                  area: newTask.area,
                  recurrence: newTask.recurrence,
                  assignee: newTask.assignee,
                  doneBy: newTask.done_by || {},
                },
              ];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as any;
            setTasks((prev) =>
              prev.map((t) =>
                t.id === updated.id
                  ? {
                      ...t,
                      title: updated.title,
                      points: updated.points,
                      area: updated.area,
                      recurrence: updated.recurrence,
                      assignee: updated.assignee,
                      doneBy: updated.done_by || t.doneBy,
                    }
                  : t
              )
            );
          } else if (payload.eventType === "DELETE") {
            const deleted = payload.old as any;
            setTasks((prev) => prev.filter((t) => t.id !== deleted.id));
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_log",
        },
        (payload) => {
          console.log("Realtime completion:", payload);
          const log = payload.new as any;
          setCompletions((prev) => {
            if (
              prev.find(
                (c) =>
                  c.taskId === log.task_id &&
                  c.userId === log.user_id &&
                  c.ts === new Date(log.completed_at).getTime()
              )
            ) {
              return prev;
            }
            return [
              ...prev,
              {
                taskId: log.task_id,
                userId: log.user_id,
                ts: new Date(log.completed_at).getTime(),
                points: log.points_earned,
                delta: 1,
              },
            ];
          });
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      channel.unsubscribe();
    };
  }, [currentUserId]);

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignee === currentUserId),
    [tasks, currentUserId]
  );

  const weekStart = (d: Date) => {
    const dt = new Date(d);
    const day = (dt.getDay() + 6) % 7; // Monday=0
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() - day);
    return dt.getTime();
  };

  const isDoneForNow = (
    t: Task,
    userId = currentUserId,
    nowDate = new Date()
  ): boolean => {
    const ts = t.doneBy?.[userId];
    if (!ts) return false;
    const done = new Date(ts);
    const now = new Date(nowDate);
    
    switch (t.recurrence) {
      case "taeglich": {
        // Erledigt wenn am selben Tag gemacht
        return (
          done.getFullYear() === now.getFullYear() &&
          done.getMonth() === now.getMonth() &&
          done.getDate() === now.getDate()
        );
      }
      case "woechentlich": {
        // Erledigt wenn in derselben Woche gemacht (egal an welchem Tag)
        return weekStart(done) === weekStart(now);
      }
      case "monatlich": {
        // Erledigt wenn im selben Monat gemacht
        return (
          done.getFullYear() === now.getFullYear() &&
          done.getMonth() === now.getMonth()
        );
      }
      case "jaehrlich": {
        // Erledigt wenn im selben Jahr gemacht
        return done.getFullYear() === now.getFullYear();
      }
      case "einmalig":
      case "sonder":
      default:
        // Einmalige Tasks bleiben für immer erledigt
        return true;
    }
  };

  const isDueNow = (t: Task, nowDate = new Date()): boolean => {
    const now = new Date(nowDate);
    switch (t.recurrence) {
      case "taeglich":
        return true;
      case "woechentlich": {
        const wd = t.weeklyDay ?? 0;
        return (now.getDay() + 6) % 7 === wd;
      }
      case "monatlich": {
        const day = t.monthlyDay ?? 1;
        return now.getDate() === day;
      }
      case "jaehrlich": {
        const m = (t.yearlyMonth ?? 6) - 1;
        const d = t.yearlyDay ?? 1;
        return now.getMonth() === m && now.getDate() === d;
      }
      case "einmalig":
      case "sonder":
      default:
        return true;
    }
  };

  const addTask = (t: Omit<Task, "id" | "doneBy">) => {
    setTasks((prev) => [
      ...prev,
      { ...t, id: "t" + Math.random().toString(36).slice(2, 9) },
    ]);
  };
  const assignToMe = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: currentUserId } : t))
    );
  };
  const unassign = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: undefined } : t))
    );
  };
  const toggleDone = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const doneBy = { ...(t.doneBy || {}) };
        if (isDoneForNow(t, currentUserId)) {
          // mark as not done for current period
          delete doneBy[currentUserId];
          setCompletions((log) => [
            ...log,
            {
              taskId,
              userId: currentUserId,
              ts: Date.now(),
              points: -t.points,
              delta: -1,
            },
          ]);
        } else {
          doneBy[currentUserId] = Date.now();
          setCompletions((log) => [
            ...log,
            {
              taskId,
              userId: currentUserId,
              ts: doneBy[currentUserId],
              points: t.points,
              delta: 1,
            },
          ]);
        }
        return { ...t, doneBy };
      })
    );
  };
  const addBonus = (userId: string, points: number, note?: string) => {
    const id = `bonus:${note ?? "approval"}`;
    setCompletions((log) => [
      ...log,
      { taskId: id, userId, ts: Date.now(), points, delta: 1 },
    ]);
  };
  const addAdjustment = (userId: string, points: number, note?: string) => {
    // points can be positive or negative; delta reflects sign for consistency
    const id = `adjust:${note ?? ""}`;
    const delta: 1 | -1 = points >= 0 ? 1 : -1;
    setCompletions((log) => [
      ...log,
      { taskId: id, userId, ts: Date.now(), points: Math.abs(points), delta },
    ]);
  };
  const transferPoints = (
    fromUserId: string,
    toUserId: string,
    points: number,
    note?: string
  ) => {
    const p = Math.max(0, Math.floor(points));
    const ts = Date.now();
    setCompletions((log) => [
      ...log,
      {
        taskId: `transfer:to:${toUserId}:${note ?? ""}`,
        userId: toUserId,
        ts,
        points: p,
        delta: 1,
      },
      {
        taskId: `transfer:from:${fromUserId}:${note ?? ""}`,
        userId: fromUserId,
        ts,
        points: p,
        delta: -1,
      },
    ]);
  };

  const getEarned = (userId = currentUserId) =>
    completions
      .filter(
        (c) => c.userId === userId && c.ts >= registrationDate && c.delta > 0
      )
      .reduce((s, c) => s + c.points, 0);
  const getSpent = (userId = currentUserId) =>
    completions
      .filter(
        (c) => c.userId === userId && c.ts >= registrationDate && c.delta < 0
      )
      .reduce((s, c) => s + c.points, 0);
  const getBalance = (userId = currentUserId) =>
    getEarned(userId) - getSpent(userId);
  
  // Aktive Tasks für Dashboard/Zuweisungen (ausblenden wenn bereits erledigt)
  const myActiveTasks = useMemo(
    () => myTasks.filter((t) => !isDoneForNow(t, currentUserId)),
    [myTasks, currentUserId]
  );

  const clearAll = () => setTasks([]);
  const resetAllData = () => {
    setTasks([]);
    setCompletions([]);
    try {
      localStorage.removeItem(LS_TASKS_KEY);
      localStorage.removeItem(LS_LOG_KEY);
      // Broadcast to other tabs so they also clear
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: LS_TASKS_KEY,
          newValue: JSON.stringify([]),
        })
      );
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: LS_LOG_KEY,
          newValue: JSON.stringify([]),
        })
      );
    } catch {}
  };

  const value: TasksContextType = {
    tasks,
    setTasks,
    currentUserId,
    myTasks,
    myActiveTasks,
    addTask,
    assignToMe,
    unassign,
    toggleDone,
    isDoneForNow,
    isDueNow,
    completions,
    addBonus,
    addAdjustment,
    transferPoints,
    getBalance,
    getEarned,
    getSpent,
    clearAll,
    resetAllData,
  };
  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
