import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface AppShellProps {
  children: ReactNode;
  onLogout: () => void;
}

export default function AppShell({ children, onLogout }: AppShellProps) {
  return (
    <div className="app-root dashboard">
      <header className="app-header">
        <div>
          <h1>Haushaltsheld</h1>
          <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            Organisiere Aufgaben, Punkte und Wünsche
          </p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          🚪 Logout
        </button>
      </header>

      <nav className="app-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          📝 Aufgaben
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          📈 Statistiken
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          🎁 Wunschliste
        </NavLink>
        <NavLink to="/members" className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          👥 Mitglieder
        </NavLink>
      </nav>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}
