import AppShell from '../components/AppShell';
import { ClipboardDocumentListIcon, CheckIcon } from '@heroicons/react/24/outline'

type Props = { onLogout: () => void };

export default function TasksPage({ onLogout }: Props) {
  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-icon"><ClipboardDocumentListIcon style={{ width: 28, height: 28 }} /></div>
        <h3>Aufgaben</h3>
        <p className="muted">Hier siehst du alle Aufgaben deines Haushalts.</p>
        
        <div className="task-list" style={{ marginTop: '1.5rem' }}>
          <div className="task-item">
            <input type="checkbox" id="t1" />
            <label htmlFor="t1">
              <div className="task-title">Fenster Putzen</div>
              <div className="task-meta muted">50 P · Ingo</div>
            </label>
            <button className="task-check-btn" aria-label="Aufgabe abhaken"><CheckIcon style={{ width: 18, height: 18 }} /></button>
          </div>
          <div className="task-item">
            <input type="checkbox" id="t2" />
            <label htmlFor="t2">
              <div className="task-title">Saugen</div>
              <div className="task-meta muted">30 P</div>
            </label>
            <button className="task-check-btn" aria-label="Aufgabe abhaken"><CheckIcon style={{ width: 18, height: 18 }} /></button>
          </div>
          <div className="task-item">
            <input type="checkbox" id="t3" />
            <label htmlFor="t3">
              <div className="task-title">Boden waschen</div>
              <div className="task-meta muted">40 P</div>
            </label>
            <button className="task-check-btn" aria-label="Aufgabe abhaken"><CheckIcon style={{ width: 18, height: 18 }} /></button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
