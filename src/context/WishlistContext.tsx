import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useHousehold } from './HouseholdContext'
import { useTasks } from './TasksContext'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient'

export type WishlistStatus = 'open' | 'assigned' | 'redeemed' | 'rejected'
export type WishlistItem = {
  id: string
  title: string
  points: number
  createdBy: string
  status: WishlistStatus
  createdAt: number
  decidedAt?: number
  assignedTo?: string | null
}

const LS_WISHLIST_KEY = 'hh_wishlist_v1'

interface WishlistContextType {
  items: WishlistItem[]
  myItems: WishlistItem[]
  setItems: React.Dispatch<React.SetStateAction<WishlistItem[]>>
  addItem: (title: string, points: number, createdBy?: string) => void
  assignTo: (id: string, userId: string) => void
  unassign: (id: string) => void
  redeem: (id: string, userId: string) => boolean
  reject: (id: string) => void
  deleteItem: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { membership } = useHousehold()
  const { currentUserId, getBalance, addAdjustment } = useTasks()
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_WISHLIST_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return []
  })

  useEffect(() => {
    localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(items))
    // Broadcast to other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: LS_WISHLIST_KEY,
      newValue: JSON.stringify(items)
    }))
  }, [items])

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LS_WISHLIST_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue))
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Supabase Realtime sync
  useEffect(() => {
    if (!SUPABASE_CONFIGURED || !supabase || !currentUserId) return

    const channel = supabase
      .channel('wishlist_realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wishlist'
      }, (payload) => {
        console.log('Realtime wishlist change:', payload)
        if (payload.eventType === 'INSERT') {
          const newItem = payload.new as any
          setItems(prev => {
            if (prev.find(i => i.id === newItem.id)) return prev
            return [{
              id: newItem.id,
              title: newItem.title,
              points: newItem.points,
              createdBy: newItem.created_by,
              status: newItem.status,
              createdAt: new Date(newItem.created_at).getTime(),
              decidedAt: newItem.decided_at ? new Date(newItem.decided_at).getTime() : undefined,
              assignedTo: newItem.assigned_to
            }, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as any
          setItems(prev => prev.map(i => i.id === updated.id ? {
            ...i,
            title: updated.title,
            points: updated.points,
            status: updated.status,
            decidedAt: updated.decided_at ? new Date(updated.decided_at).getTime() : i.decidedAt,
            assignedTo: updated.assigned_to
          } : i))
        } else if (payload.eventType === 'DELETE') {
          const deleted = payload.old as any
          setItems(prev => prev.filter(i => i.id !== deleted.id))
        }
      })
      .subscribe((status) => {
        console.log('Wishlist realtime status:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId])

  const myItems = useMemo(() => items.filter(i => i.createdBy === currentUserId), [items, currentUserId])

  const addItem = (title: string, points: number, createdBy = currentUserId) => {
    const it: WishlistItem = {
      id: 'w' + Math.random().toString(36).slice(2, 9),
      title,
      points,
      createdBy,
      status: 'open',
      createdAt: Date.now(),
      assignedTo: null,
    }
    setItems(prev => [it, ...prev])
  }
  const assignTo = (id: string, userId: string) => {
    setItems(prev => prev.map(i => (i.id === id && i.status === 'open') ? { ...i, status: 'assigned', assignedTo: userId } : i))
  }
  const unassign = (id: string) => {
    setItems(prev => prev.map(i => (i.id === id && i.status === 'assigned') ? { ...i, status: 'open', assignedTo: null } : i))
  }
  const redeem = (id: string, userId: string) => {
    const it = items.find(i => i.id === id)
    if (!it) return false
    if (it.status !== 'assigned' || it.assignedTo !== userId) return false
    const bal = getBalance(userId)
    if (bal < it.points) return false
    // deduct and mark redeemed
    addAdjustment(userId, -it.points, `redeem:${it.title}`)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'redeemed', decidedAt: Date.now() } : i))
    return true
  }
  const reject = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected', decidedAt: Date.now() } : i))
  const deleteItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const value: WishlistContextType = { items, myItems, setItems, addItem, assignTo, unassign, redeem, reject, deleteItem }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
