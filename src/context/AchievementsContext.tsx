import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ACHIEVEMENTS, Achievement } from '../data/achievements'
import { useTasks } from './TasksContext'

const LS_ACHIEVEMENTS_KEY = 'hh_achievements_v1'

type UnlockedAchievement = {
  id: string
  unlockedAt: number
}

type AchievementsContextType = {
  unlockedAchievements: UnlockedAchievement[]
  checkAndUnlock: () => void
  isUnlocked: (id: string) => boolean
  getProgress: (achievement: Achievement) => { current: number; target: number }
}

const AchievementsContext = createContext<AchievementsContextType | null>(null)

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([])
  const { completions, balance } = useTasks()

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LS_ACHIEVEMENTS_KEY)
    if (stored) {
      try {
        setUnlockedAchievements(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse achievements', e)
      }
    }
  }, [])

  // Save to localStorage whenever unlocked changes
  useEffect(() => {
    localStorage.setItem(LS_ACHIEVEMENTS_KEY, JSON.stringify(unlockedAchievements))
  }, [unlockedAchievements])

  const isUnlocked = (id: string) => unlockedAchievements.some(a => a.id === id)

  const getProgress = (achievement: Achievement): { current: number; target: number } => {
    const { type, target, taskId } = achievement.requirement
    let current = 0

    switch (type) {
      case 'tasks_completed':
        current = completions.filter(c => c.doneAt).length
        break
      case 'points_earned':
        // Total earned = balance + spent
        // We need to track total earned separately. For now, approximate:
        current = balance.earned || 0
        break
      case 'task_streak': {
        // Calculate longest streak of consecutive days with completions
        const dates = completions
          .filter(c => c.doneAt)
          .map(c => new Date(c.doneAt).toDateString())
        const uniqueDates = Array.from(new Set(dates)).sort()

        let maxStreak = 0
        let currentStreak = 0
        let prevDate: Date | null = null

        for (const dateStr of uniqueDates) {
          const date = new Date(dateStr)
          if (prevDate) {
            const diff = (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
            if (diff === 1) {
              currentStreak++
            } else {
              currentStreak = 1
            }
          } else {
            currentStreak = 1
          }
          maxStreak = Math.max(maxStreak, currentStreak)
          prevDate = date
        }
        current = maxStreak
        break
      }
      case 'single_task_count': {
        // Count completions for a single task (any task, find max)
        const taskCounts = new Map<string, number>()
        completions.filter(c => c.doneAt).forEach(c => {
          taskCounts.set(c.taskId, (taskCounts.get(c.taskId) || 0) + 1)
        })
        current = Math.max(0, ...Array.from(taskCounts.values()))
        break
      }
      case 'wishes_redeemed': {
        // Would need WishlistContext integration
        // For now, placeholder
        current = 0
        break
      }
      case 'points_transferred': {
        // Would need transfer tracking
        current = 0
        break
      }
      case 'special':
        // Special achievements need custom logic
        current = 0
        break
      default:
        current = 0
    }

    return { current, target }
  }

  const checkAndUnlock = () => {
    const newUnlocks: UnlockedAchievement[] = []

    for (const achievement of ACHIEVEMENTS) {
      if (isUnlocked(achievement.id)) continue

      const { current, target } = getProgress(achievement)
      if (current >= target) {
        newUnlocks.push({ id: achievement.id, unlockedAt: Date.now() })
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newUnlocks])
      // Optional: Show toast notification
      console.log('🏆 Neue Auszeichnungen freigeschaltet:', newUnlocks.length)
    }
  }

  // Auto-check on completions change
  useEffect(() => {
    checkAndUnlock()
  }, [completions, balance])

  return (
    <AchievementsContext.Provider value={{ unlockedAchievements, checkAndUnlock, isUnlocked, getProgress }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements must be used within AchievementsProvider')
  return ctx
}
