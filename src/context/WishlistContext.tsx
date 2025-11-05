import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useHousehold } from './HouseholdContext'
import { useTasks } from './TasksContext'

export type WishlistStatus = 'pending' | 'approved' | 'rejected' | 'redeemed'
export type WishlistItem = {
  id: string
  title: string
  points: number
  createdBy: string
  status: WishlistStatus
  createdAt: number
  decidedAt?: number
}

const LS_WISHLIST_KEY = 'hh_wishlist_v1'

interface WishlistContextType {
  items: WishlistItem[]
  myItems: WishlistItem[]
  addItem: (title: string, points: number, createdBy?: string) => void
  approve: (id: string, awardNow?: boolean) => void
  reject: (id: string) => void
  markRedeemed: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { membership } = useHousehold()
  const { currentUserId, addBonus } = useTasks()
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_WISHLIST_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return []
  })

  useEffect(() => {
    localStorage.setItem(LS_WISHLIST_KEY, JSON.stringify(items))
  }, [items])

  const myItems = useMemo(() => items.filter(i => i.createdBy === currentUserId), [items, currentUserId])

  const addItem = (title: string, points: number, createdBy = currentUserId) => {
    const it: WishlistItem = {
      id: 'w' + Math.random().toString(36).slice(2, 9),
      title,
      points,
      createdBy,
      status: 'pending',
      createdAt: Date.now(),
    }
    setItems(prev => [it, ...prev])
  }
  const approve = (id: string, awardNow = false) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved', decidedAt: Date.now() } : i))
    if (awardNow) {
      const it = items.find(i => i.id === id)
      if (it) addBonus(it.createdBy, it.points, `wishlist:${it.title}`)
    }
  }
  const reject = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected', decidedAt: Date.now() } : i))
  const markRedeemed = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'redeemed' } : i))

  const value: WishlistContextType = { items, myItems, addItem, approve, reject, markRedeemed }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
