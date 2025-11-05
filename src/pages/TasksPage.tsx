import AppShell from '../components/AppShell';
import { ClipboardDocumentListIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import { useTasks, ALL_AREAS, RECURRENCE_LABEL, RECURRENCE_ORDER, type Area, type Recurrence } from '../context/TasksContext'

 type Props = { onLogout: () => void };

 export default function TasksPage({ onLogout }: Props) {
   const { tasks, currentUserId, addTask, assignToMe, unassign, toggleDone } = useTasks()
   const [view, setView] = useState<'me' | 'all'>('me')
   const [showForm, setShowForm] = useState(false)
   const [title, setTitle] = useState('')
   const [points, setPoints] = useState<number>(10)
   const [area, setArea] = useState<Area>('Wohnzimmer')
   const [recurrence, setRecurrence] = useState<Recurrence>('woechentlich')
   const [assignMe, setAssignMe] = useState<boolean>(true)

   const filtered = useMemo(() => {
     return view === 'me' ? tasks.filter(t => t.assignee === currentUserId) : tasks
   }, [tasks, view, currentUserId])

   const grouped = useMemo(() => {
     const map: Record<string, typeof filtered> = {}
     for (const a of ALL_AREAS) map[a] = []
     for (const t of filtered) {
       map[t.area] = map[t.area] || []
       map[t.area].push(t)
     }
     for (const a of ALL_AREAS) {
       map[a]?.sort((x, y) => {
         const r = RECURRENCE_ORDER.indexOf(x.recurrence) - RECURRENCE_ORDER.indexOf(y.recurrence)
         if (r !== 0) return r
         return x.title.localeCompare(y.title)
       })
     }
     return map
   }, [filtered])

   const handleCreate = () => {
     if (!title.trim()) return
     addTask({ title: title.trim(), points, area, recurrence, assignee: assignMe ? currentUserId : undefined })
     setTitle('')
     setPoints(10)
     setArea('Wohnzimmer')
     setRecurrence('woechentlich')
     setAssignMe(true)
     setShowForm(false)
   }

   return (
     <AppShell onLogout={onLogout}>
       <div className="dashboard-card" style={{ maxWidth: 1000, margin: '0 auto' }}>
         <div className="card-icon"><ClipboardDocumentListIcon style={{ width: 28, height: 28 }} /></div>
         <h3>Aufgaben</h3>
         <p className="muted">Weise Aufgaben Bereichen zu, lege Punkte & Wiederholung fest und ordne sie Personen zu.</p>

         <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
           <button className={`card-action-btn${view==='me' ? '' : ' secondary'}`} onClick={() => setView('me')}>Meine Aufgaben</button>
           <button className={`card-action-btn${view==='all' ? '' : ' secondary'}`} onClick={() => setView('all')}>Alle Aufgaben</button>
           <div style={{ flex: 1 }} />
           <button className="card-action-btn" onClick={() => setShowForm(s => !s)}>{showForm ? 'Abbrechen' : 'Neue Aufgabe'}</button>
         </div>

         {showForm && (
           <div className="task-item" style={{ marginTop: '1rem' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '0.5rem', width: '100%' }}>
               <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titel" />
               <input type="number" min={0} value={points} onChange={e => setPoints(parseInt(e.target.value || '0', 10))} placeholder="Punkte" />
               <select className="goal-dropdown" value={area} onChange={e => setArea(e.target.value as Area)}>
                 {ALL_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
               </select>
               <select className="goal-dropdown" value={recurrence} onChange={e => setRecurrence(e.target.value as Recurrence)}>
                 {RECURRENCE_ORDER.map(r => <option key={r} value={r}>{RECURRENCE_LABEL[r]}</option>)}
               </select>
               <label className="muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <input type="checkbox" checked={assignMe} onChange={e => setAssignMe(e.target.checked)} />
                 Mir zuordnen
               </label>
             </div>
             <button className="task-check-btn" style={{ marginLeft: 'auto' }} onClick={handleCreate}>Speichern</button>
           </div>
         )}

         <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           {ALL_AREAS.map(areaName => {
             const list = grouped[areaName] || []
             if (!list.length) return null
             return (
               <div key={areaName}>
                 <div className="muted" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{areaName}</div>
                 <div className="task-list">
                   {list.map(t => {
                     const done = !!t.doneBy?.[currentUserId]
                     return (
                       <div key={t.id} className="task-item" style={{ opacity: done ? 0.7 : 1 }}>
                         <input type="checkbox" id={t.id} checked={done} onChange={() => toggleDone(t.id)} />
                         <label htmlFor={t.id}>
                           <div className="task-title" style={{ textDecoration: done ? 'line-through' : 'none' }}>{t.title}</div>
                           <div className="task-meta muted">{t.points} P · {RECURRENCE_LABEL[t.recurrence]} {t.assignee ? '· Zugeordnet' : ''}</div>
                         </label>
                         {t.assignee === currentUserId ? (
                           <button className="card-action-btn secondary" style={{ width: 'auto' }} onClick={() => unassign(t.id)}>Zuweisung entfernen</button>
                         ) : (
                           <button className="task-check-btn" onClick={() => assignToMe(t.id)}>Mir zuordnen</button>
                         )}
                       </div>
                     )
                   })}
                 </div>
               </div>
             )
           })}
         </div>
       </div>
     </AppShell>
   );
 }
