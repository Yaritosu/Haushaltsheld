import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  GiftIcon,
  UsersIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  CakeIcon,
  TrophyIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

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
          <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            Organisiere Aufgaben, Punkte und Wünsche
          </p>
        </div>
        <button onClick={onLogout} className="logout-btn" aria-label="Logout">
          <ArrowRightOnRectangleIcon
            style={{
              width: 20,
              height: 20,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Logout
        </button>
      </header>

      <nav className="app-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <ChartBarSquareIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Dashboard
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <ClipboardDocumentListIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Aufgaben
        </NavLink>
        <NavLink
          to="/stats"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <ChartPieIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Statistiken
        </NavLink>
        <NavLink
          to="/wishlist"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <GiftIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Wunschliste
        </NavLink>
        <NavLink
          to="/shopping"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <ShoppingCartIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Einkauf
        </NavLink>
        <NavLink
          to="/members"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <UsersIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Mitglieder
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <CalendarDaysIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Kalender
        </NavLink>
        <NavLink
          to="/recipes"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <CakeIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Rezepte
        </NavLink>
        <NavLink
          to="/achievements"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <TrophyIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Auszeichnungen
        </NavLink>
        <NavLink
          to="/family-activities"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <SparklesIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Aktivitäten
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => `nav-btn ${isActive ? "active" : ""}`}
        >
          <Cog6ToothIcon
            style={{
              width: 18,
              height: 18,
              verticalAlign: "text-bottom",
              marginRight: 6,
            }}
          />
          Admin
        </NavLink>
      </nav>

      <main className="dashboard-main">{children}</main>
    </div>
  );
}
