import AppShell from '../components/AppShell';

type Props = { onLogout: () => void };

export default function TasksPage({ onLogout }: Props) {
  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-icon">📝</div>
        <h3>Aufgaben</h3>
        <p className="muted">Hier siehst du alle Aufgaben deines Haushalts.</p>
        
        <div className="task-list" style={{ marginTop: '1.5rem' }}>
          <div className="task-item">
            <input type="checkbox" id="t1" />
            <label htmlFor="t1">
              <div className="task-title">Fenster Putzen</div>
              <div className="task-meta muted">50 P · Ingo</div>
            </label>
            <button className="task-check-btn">✓</button>
          </div>
          <div className="task-item">
            <input type="checkbox" id="t2" />
            <label htmlFor="t2">
              <div className="task-title">Saugen</div>
              <div className="task-meta muted">30 P</div>
            </label>
            <button className="task-check-btn">✓</button>
          </div>
          <div className="task-item">
            <input type="checkbox" id="t3" />
            <label htmlFor="t3">
              <div className="task-title">Boden waschen</div>
              <div className="task-meta muted">40 P</div>
            </label>
            <button className="task-check-btn">✓</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
