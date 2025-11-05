import AppShell from '../components/AppShell';
import { GiftIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../context/WishlistContext'
import { useState, useMemo } from 'react'
import { useHousehold } from '../context/HouseholdContext'
import { useTasks } from '../context/TasksContext'

type Props = { onLogout: () => void };

export default function WishlistPage({ onLogout }: Props) {
  const { items, addItem, assignTo, unassign, redeem } = useWishlist()
  const { membership } = useHousehold()
  const { currentUserId, getBalance } = useTasks()
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState(500)

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || points <= 0) return
    addItem(title.trim(), points)
    setTitle('')
    setPoints(500)
  }

  const isAdmin = membership?.role === 'admin'
  const balance = getBalance(currentUserId)
  const visibleItems = useMemo(() => items.filter(i => i.status !== 'redeemed'), [items])

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-icon"><GiftIcon style={{ width: 28, height: 28 }} /></div>
        <h3>Wunschliste</h3>
        <p className="muted">Mitglieder können Wünsche anlegen. Admins können freigeben und Punkte vergeben.</p>

        <form onSubmit={onAdd} className="task-form" style={{ marginTop: '1rem' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Wunsch (z.B. PS5)" />
          <input type="number" min={1} value={points} onChange={e => setPoints(parseInt(e.target.value || '0'))} placeholder="Punkte" />
          <button type="submit">Hinzufügen</button>
        </form>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {visibleItems.map((it) => {
            const mineAssigned = it.status === 'assigned' && it.assignedTo === currentUserId
            const canRedeem = mineAssigned && balance >= it.points
            return (
              <div key={it.id} className="task-item" style={{ alignItems: 'center' }}>
                <div>
                  <div className="task-title">{it.title}</div>
                  <div className="task-meta muted">{it.points} P • {it.status}{it.assignedTo && it.status !== 'redeemed' ? ` • zugeordnet` : ''}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  {it.status === 'open' && (
                    <button className="nav-btn" onClick={() => assignTo(it.id, currentUserId)}>
                      Ich will das
                    </button>
                  )}
                  {it.status === 'assigned' && it.assignedTo === currentUserId && (
                    <>
                      <button className="nav-btn" onClick={() => unassign(it.id)}>
                        Abgeben
                      </button>
                      <button className="nav-btn" disabled={!canRedeem} onClick={() => redeem(it.id, currentUserId)} title={canRedeem ? 'Einlösen' : 'Nicht genug Punkte'}>
                        Einlösen
                      </button>
                    </>
                  )}
                  {it.status === 'assigned' && it.assignedTo !== currentUserId && (
                    <button className="nav-btn" disabled>Schon vergeben</button>
                  )}
                </div>
              </div>
            )
          })}
          {visibleItems.length === 0 && (
            <div className="task-item"><div className="muted">Noch keine Wünsche</div></div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
