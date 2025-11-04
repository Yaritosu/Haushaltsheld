import AppShell from '../components/AppShell';

type Props = { onLogout: () => void };

export default function MembersPage({ onLogout }: Props) {
  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <h3>Mitglieder</h3>
          <p className="muted">Verwalte die Mitglieder deines Haushalts.</p>
          <p className="muted" style={{ fontSize: '0.95rem', marginTop: '1rem' }}>
            Hier kannst du später Mitglieder hinzufügen, entfernen und Rollen ändern.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
