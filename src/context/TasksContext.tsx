import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient'

export type Area = 'Wohnzimmer' | 'Küche' | 'Flur' | 'Schlafzimmer' | 'Bad' | 'Garten' | 'Garage' | 'Balkon' | 'Keller' | 'Arbeitszimmer' | 'Esszimmer'
export const ALL_AREAS: Area[] = ['Wohnzimmer','Küche','Flur','Schlafzimmer','Bad','Garten','Garage','Balkon','Keller','Arbeitszimmer','Esszimmer']

export type Recurrence = 'taeglich' | 'woechentlich' | 'monatlich' | 'jaehrlich' | 'einmalig' | 'sonder'
export const RECURRENCE_ORDER: Recurrence[] = ['taeglich','woechentlich','monatlich','jaehrlich','einmalig','sonder']
export const RECURRENCE_LABEL: Record<Recurrence, string> = {
  taeglich: 'Täglich',
  woechentlich: 'Wöchentlich',
  monatlich: 'Monatlich',
  jaehrlich: 'Jährlich',
  einmalig: 'Einmalig',
  sonder: 'Sonder'
}

export type Task = {
  id: string
  title: string
  points: number
  area: Area
  recurrence: Recurrence
  assignee?: string // user id
  // per-user last completion timestamp (ms since epoch)
  doneBy?: Record<string, number>
  // optional schedule parameters (used for jaehrlich customization later)
  yearlyMonth?: number // 1-12, default 6
  yearlyDay?: number   // 1-31, default 1
  weeklyDay?: number   // 0-6 (Mon=0)
  monthlyDay?: number  // 1-31
}

const LS_TASKS_KEY = 'hh_tasks_v2'
const LS_USER_KEY = 'hh_user_id'
const LS_LOG_KEY = 'hh_task_log_v1'

function getLocalUserId(): string {
  const existing = localStorage.getItem(LS_USER_KEY)
  if (existing) return existing
  const id = 'local-' + Math.random().toString(36).slice(2, 10)
  localStorage.setItem(LS_USER_KEY, id)
  return id
}

async function getSupabaseUserId(): Promise<string | null> {
  if (!SUPABASE_CONFIGURED || !supabase) return null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

interface TasksContextType {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  currentUserId: string
  myTasks: Task[]
  addTask: (t: Omit<Task, 'id' | 'doneBy'>) => void
  assignToMe: (taskId: string) => void
  unassign: (taskId: string) => void
  toggleDone: (taskId: string) => void
  isDoneForNow: (t: Task, userId?: string, now?: Date) => boolean
  isDueNow: (t: Task, now?: Date) => boolean
  completions: Array<{ taskId: string; userId: string; ts: number; points: number; delta: 1 | -1 }>
  clearAll: () => void
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(LS_TASKS_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    // seed with sample tasks
    const seed: Task[] = [
      { id: 't1', title: 'Fenster putzen', points: 50, area: 'Wohnzimmer', recurrence: 'woechentlich', weeklyDay: 0 },
      { id: 't2', title: 'Saugen', points: 30, area: 'Flur', recurrence: 'taeglich' },
      { id: 't3', title: 'Boden wischen', points: 40, area: 'Küche', recurrence: 'woechentlich', weeklyDay: 2 },
      { id: 't4', title: 'Gras mähen', points: 80, area: 'Garten', recurrence: 'monatlich', monthlyDay: 1 },
    ]
    return seed
  })
  const [currentUserId, setCurrentUserId] = useState<string>(getLocalUserId())

  useEffect(() => {
    // try to use supabase user id if available
    getSupabaseUserId().then(id => {
      if (id) setCurrentUserId(id)
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  const [completions, setCompletions] = useState<Array<{ taskId: string; userId: string; ts: number; points: number; delta: 1 | -1 }>>(() => {
    try {
      const raw = localStorage.getItem(LS_LOG_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return []
  })

  useEffect(() => {
    localStorage.setItem(LS_LOG_KEY, JSON.stringify(completions))
  }, [completions])

  const myTasks = useMemo(() => tasks.filter(t => t.assignee === currentUserId), [tasks, currentUserId])

  const weekStart = (d: Date) => {
    const dt = new Date(d)
    const day = (dt.getDay() + 6) % 7 // Monday=0
    dt.setHours(0,0,0,0)
    dt.setDate(dt.getDate() - day)
    return dt.getTime()
  }

  const isDoneForNow = (t: Task, userId = currentUserId, nowDate = new Date()): boolean => {
    const ts = t.doneBy?.[userId]
    if (!ts) return false
    const done = new Date(ts)
    const now = new Date(nowDate)
    switch (t.recurrence) {
      case 'taeglich': {
        return done.getFullYear() === now.getFullYear() && done.getMonth() === now.getMonth() && done.getDate() === now.getDate()
      }
      case 'woechentlich': {
        const wd = t.weeklyDay ?? 0
        const sameWeek = weekStart(done) === weekStart(now)
        const isToday = ((now.getDay() + 6) % 7) === wd
        return sameWeek && isToday
      }
      case 'monatlich': {
        const day = t.monthlyDay ?? 1
        const sameMonth = done.getFullYear() === now.getFullYear() && done.getMonth() === now.getMonth()
        const isToday = now.getDate() === day
        return sameMonth && isToday
      }
      case 'jaehrlich': {
        const m = (t.yearlyMonth ?? 6) - 1
        const d = t.yearlyDay ?? 1
        const sameYear = done.getFullYear() === now.getFullYear()
        const isToday = now.getMonth() === m && now.getDate() === d
        return sameYear && isToday
      }
      case 'einmalig':
      case 'sonder':
      default:
        return true
    }
  }

  const isDueNow = (t: Task, nowDate = new Date()): boolean => {
    const now = new Date(nowDate)
    switch (t.recurrence) {
      case 'taeglich':
        return true
      case 'woechentlich': {
        const wd = t.weeklyDay ?? 0
        return ((now.getDay() + 6) % 7) === wd
      }
      case 'monatlich': {
        const day = t.monthlyDay ?? 1
        return now.getDate() === day
      }
      case 'jaehrlich': {
        const m = (t.yearlyMonth ?? 6) - 1
        const d = t.yearlyDay ?? 1
        return now.getMonth() === m && now.getDate() === d
      }
      case 'einmalig':
      case 'sonder':
      default:
        return true
    }
  }

  const addTask = (t: Omit<Task, 'id' | 'doneBy'>) => {
    setTasks(prev => [...prev, { ...t, id: 't' + Math.random().toString(36).slice(2, 9) }])
  }
  const assignToMe = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignee: currentUserId } : t))
  }
  const unassign = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignee: undefined } : t))
  }
  const toggleDone = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const doneBy = { ...(t.doneBy || {}) }
      if (isDoneForNow(t)) {
        // mark as not done for current period
        delete doneBy[currentUserId]
        setCompletions(log => [...log, { taskId, userId: currentUserId, ts: Date.now(), points: -t.points, delta: -1 }])
      } else {
        doneBy[currentUserId] = Date.now()
        setCompletions(log => [...log, { taskId, userId: currentUserId, ts: doneBy[currentUserId], points: t.points, delta: 1 }])
      }
      return { ...t, doneBy }
    }))
  }
  const clearAll = () => setTasks([])

  const value: TasksContextType = { tasks, setTasks, currentUserId, myTasks, addTask, assignToMe, unassign, toggleDone, isDoneForNow, isDueNow, completions, clearAll }
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
