import AppShell from '../components/AppShell';
import { GiftIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../context/WishlistContext'
import { useState } from 'react'
import { useHousehold } from '../context/HouseholdContext'
import { useTasks } from '../context/TasksContext'

type Props = { onLogout: () => void };

export default function WishlistPage({ onLogout }: Props) {
  const { items, addItem, approve, reject } = useWishlist()
  const { membership } = useHousehold()
  const { currentUserId } = useTasks()
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
          {items.map((it) => (
            <div key={it.id} className="task-item" style={{ alignItems: 'center' }}>
              <div>
                <div className="task-title">{it.title}</div>
                <div className="task-meta muted">{it.points} P • {it.status === 'pending' ? 'ausstehend' : it.status}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                {isAdmin && it.status === 'pending' && (
                  <>
                    <button className="nav-btn" onClick={() => approve(it.id, true)} title="Freigeben & Punkte gutschreiben">
                      <CheckCircleIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 6 }} /> Freigeben
                    </button>
                    <button className="nav-btn" onClick={() => reject(it.id)} title="Ablehnen">
                      <XMarkIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 6 }} /> Ablehnen
                    </button>
                  </>
                )}
                {!isAdmin && it.createdBy === currentUserId && it.status === 'pending' && (
                  <div className="muted">Wartet auf Freigabe…</div>
                )}
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="task-item"><div className="muted">Noch keine Wünsche</div></div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
