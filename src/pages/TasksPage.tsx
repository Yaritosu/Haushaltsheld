import AppShell from '../components/AppShell';
import { ClipboardDocumentListIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

 type Props = { onLogout: () => void };

 type Task = {
   id: string
   title: string
   points: number
   assignee?: string
   done: boolean
 }

 const LS_TASKS_KEY = 'hh_tasks'
 const LS_POINTS_KEY = 'hh_points'

 export default function TasksPage({ onLogout }: Props) {
   const [tasks, setTasks] = useState<Task[]>(() => {
     try {
       const raw = localStorage.getItem(LS_TASKS_KEY)
       if (raw) return JSON.parse(raw)
     } catch {}
     return [
       { id: 't1', title: 'Fenster Putzen', points: 50, assignee: 'Ingo', done: false },
       { id: 't2', title: 'Saugen', points: 30, done: false },
       { id: 't3', title: 'Boden waschen', points: 40, done: false },
     ]
   })
   const [points, setPoints] = useState<number>(() => {
     const raw = localStorage.getItem(LS_POINTS_KEY)
     return raw ? parseInt(raw, 10) || 0 : 0
   })

   useEffect(() => {
     localStorage.setItem(LS_TASKS_KEY, JSON.stringify(tasks))
   }, [tasks])

   useEffect(() => {
     localStorage.setItem(LS_POINTS_KEY, String(points))
   }, [points])

   const toggleTask = (taskId: string) => {
     setTasks(prev => prev.map(t => {
       if (t.id !== taskId) return t
       // flip the state and adjust points accordingly
       const nowDone = !t.done
       setPoints(p => p + (nowDone ? t.points : -t.points))
       return { ...t, done: nowDone }
     }))
   }

   return (
     <AppShell onLogout={onLogout}>
       <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
         <div className="card-icon"><ClipboardDocumentListIcon style={{ width: 28, height: 28 }} /></div>
         <h3>Aufgaben</h3>
         <p className="muted">Hier siehst du alle Aufgaben deines Haushalts.</p>

         <div className="task-list" style={{ marginTop: '1.5rem' }}>
           {tasks.map((t) => (
             <div key={t.id} className="task-item" style={{ opacity: t.done ? 0.7 : 1 }}>
               <input type="checkbox" id={t.id} checked={t.done} onChange={() => toggleTask(t.id)} />
               <label htmlFor={t.id}>
                 <div className="task-title" style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</div>
                 <div className="task-meta muted">{t.points} P{t.assignee ? ` · ${t.assignee}` : ''}</div>
               </label>
               <button className="task-check-btn" aria-label="Aufgabe abhaken" onClick={() => toggleTask(t.id)}>
                 <CheckIcon style={{ width: 18, height: 18 }} />
               </button>
             </div>
           ))}
         </div>

         <div style={{ marginTop: '1rem' }} className="muted">Gesammelte Punkte aus Aufgaben: <strong style={{ color: '#fff' }}>{points} P</strong></div>
       </div>
     </AppShell>
   );
 }
