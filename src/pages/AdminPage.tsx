import AppShell from '../components/AppShell';
import { Cog6ToothIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useState } from 'react'
import { useHousehold } from '../context/HouseholdContext'
import { ALL_AREAS, type Area } from '../context/TasksContext'

type Props = { onLogout: () => void };

export default function AdminPage({ onLogout }: Props) {
  const { membership } = useHousehold()
  const [areas, setAreas] = useState<string[]>([...ALL_AREAS])
  const [newArea, setNewArea] = useState('')
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const isAdmin = membership?.role === 'admin'

  const handleAdd = () => {
    if (!newArea.trim()) return
    setAreas(prev => [...prev, newArea.trim()])
    setNewArea('')
  }

  const handleDelete = (idx: number) => {
    if (!confirm('Bereich wirklich löschen?')) return
    setAreas(prev => prev.filter((_, i) => i !== idx))
  }

  const handleEdit = (idx: number) => {
    setEditingIdx(idx)
    setEditValue(areas[idx])
  }

  const handleSaveEdit = () => {
    if (editingIdx === null) return
    setAreas(prev => prev.map((a, i) => i === editingIdx ? editValue : a))
    setEditingIdx(null)
    setEditValue('')
  }

  if (!isAdmin) {
    return (
      <AppShell onLogout={onLogout}>
        <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
          <h3>Keine Berechtigung</h3>
          <p className="muted">Nur Admins können auf diese Seite zugreifen.</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-icon"><Cog6ToothIcon style={{ width: 28, height: 28 }} /></div>
        <h3>Admin-Einstellungen</h3>
        <p className="muted">Verwalte Bereiche/Kategorien für Aufgaben.</p>

        <div style={{ marginTop: '1.5rem' }}>
          <h4>Bereiche</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input 
              value={newArea} 
              onChange={e => setNewArea(e.target.value)} 
              placeholder="Neuer Bereich (z.B. Garage)" 
              style={{ flex: 1 }}
            />
            <button className="card-action-btn" onClick={handleAdd}>
              <PlusIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 6 }} />
              Hinzufügen
            </button>
          </div>

          <div className="task-list" style={{ marginTop: '1rem' }}>
            {areas.map((area, idx) => (
              <div key={idx} className="task-item" style={{ alignItems: 'center' }}>
                {editingIdx === idx ? (
                  <>
                    <input 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)} 
                      style={{ flex: 1 }}
                    />
                    <button className="nav-btn" onClick={handleSaveEdit}>Speichern</button>
                    <button className="nav-btn secondary" onClick={() => setEditingIdx(null)}>Abbrechen</button>
                  </>
                ) : (
                  <>
                    <div className="task-title" style={{ flex: 1 }}>{area}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="task-check-btn" onClick={() => handleEdit(idx)} title="Bearbeiten">
                        <PencilIcon style={{ width: 16, height: 16 }} />
                      </button>
                      <button className="task-check-btn" onClick={() => handleDelete(idx)} title="Löschen" style={{ background: 'rgba(255,100,100,0.2)' }}>
                        <TrashIcon style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="muted" style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
            Hinweis: Änderungen werden nur lokal gespeichert. Für persistente Bereiche später Supabase-Integration nötig.
          </div>
        </div>
      </div>
    </AppShell>
  );
}
