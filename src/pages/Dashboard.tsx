type Props = { onLogout: () => void };

import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

export default function Dashboard({ onLogout }: Props) {
  return (
    <div className="app-root dashboard">
      <header className="app-header">
        <h1>Haushaltsheld</h1>
        <div className="header-actions">
          <button
            className="logout-btn"
            onClick={async () => {
              if (SUPABASE_CONFIGURED && supabase) {
                await supabase.auth.signOut()
              }
              onLogout()
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main className="container">
        <section className="grid">
          <div className="card">
            <h2>Übersicht</h2>
            <p className="muted">Willkommen zurück! Hier findest du bald deine wichtigsten Elemente.</p>
          </div>
          <div className="card">
            <h2>Aufgaben</h2>
            <p className="muted">Putzplan & To‑dos – demnächst hier.</p>
          </div>
          <div className="card">
            <h2>Einkauf</h2>
            <p className="muted">Einkaufslisten auf einen Blick.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
