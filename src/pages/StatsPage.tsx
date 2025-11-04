import AppShell from '../components/AppShell';

type Props = { onLogout: () => void };

export default function StatsPage({ onLogout }: Props) {
  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📈</div>
          <h3>Statistiken</h3>
          <p className="muted">Hier kommen deine Auswertungen hin:</p>
          <ul className="muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            <li>Punkteverlauf über Zeit</li>
            <li>Erledigte Aufgaben</li>
            <li>Ranking der Haushaltsmitglieder</li>
            <li>Aktivitätshistorie</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
