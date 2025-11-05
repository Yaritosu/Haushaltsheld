import AppShell from '../components/AppShell';
import { GiftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../context/WishlistContext'
import { useState, useMemo } from 'react'
import { useHousehold } from '../context/HouseholdContext'
import { useTasks } from '../context/TasksContext'

type Props = { onLogout: () => void };

export default function WishlistPage({ onLogout }: Props) {
  const { items, setItems, addItem, assignTo, unassign, redeem, reject, deleteItem } = useWishlist()
  const { membership } = useHousehold()
  const { currentUserId, getBalance } = useTasks()
  const [title, setTitle] = useState('')
  const [points, setPoints] = useState(500)
  const [editingId, setEditingId] = useState<string | null>(null)

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || points <= 0) return
    if (editingId) {
      // Update existing
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, title: title.trim(), points } : i))
      setEditingId(null)
    } else {
      addItem(title.trim(), points)
    }
    setTitle('')
    setPoints(500)
  }

  const handleEdit = (id: string, t: string, p: number) => {
    setTitle(t)
    setPoints(p)
    setEditingId(id)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Wunsch wirklich löschen?')) return
    deleteItem(id)
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

        <form onSubmit={onAdd} className="task-form" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Wunsch (z.B. PS5)" style={{ flex: 2 }} />
          <input type="number" min={1} value={points} onChange={e => setPoints(parseInt(e.target.value || '0'))} placeholder="Punkte" style={{ flex: 1 }} />
          <button type="submit">{editingId ? 'Aktualisieren' : 'Hinzufügen'}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={() => { setEditingId(null); setTitle(''); setPoints(500); }}>Abbrechen</button>
          )}
        </form>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {visibleItems.map((it) => {
            const mineAssigned = it.status === 'assigned' && it.assignedTo === currentUserId
            const canRedeem = mineAssigned && balance >= it.points
            const isMine = it.createdBy === currentUserId
            return (
              <div key={it.id} className="task-item" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div className="task-title">{it.title}</div>
                  <div className="task-meta muted">{it.points} P • {it.status}{it.assignedTo && it.status !== 'redeemed' ? ` • zugeordnet` : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                  {isMine && it.status === 'open' && (
                    <>
                      <button className="task-check-btn" onClick={() => handleEdit(it.id, it.title, it.points)} title="Bearbeiten">
                        <PencilIcon style={{ width: 16, height: 16 }} />
                      </button>
                      <button className="task-check-btn" onClick={() => handleDelete(it.id)} title="Löschen" style={{ background: 'rgba(255,100,100,0.2)' }}>
                        <TrashIcon style={{ width: 16, height: 16 }} />
                      </button>
                    </>
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
