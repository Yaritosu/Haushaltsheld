import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'
import { useHousehold } from '../context/HouseholdContext'

type Props = { onLogout: () => void }

export default function Dashboard({ onLogout }: Props) {
  const navigate = useNavigate()
  const { household, membership, loading, refetch } = useHousehold()
  const [showInviteCode, setShowInviteCode] = useState(false)

  useEffect(() => {
    if (!loading && !household && SUPABASE_CONFIGURED) {
      navigate('/onboarding')
    }
  }, [loading, household, navigate])

  if (loading) {
    return (
      <div className="app-root dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <p>Lade Haushalt…</p>
        </div>
      </div>
    )
  }

  if (!household) {
    return null // redirecting to onboarding
  }
  const isAdmin = membership?.role === 'admin'

  return (
    <div className="app-root dashboard">
      <header className="app-header">
        <div>
          <h1>Haushaltsheld</h1>
          <p className="muted" style={{ margin: 0 }}>
            {household.name} {isAdmin && '(Admin)'}
          </p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button onClick={() => setShowInviteCode(!showInviteCode)}>
              {showInviteCode ? 'Code verbergen' : 'Einladungscode'}
            </button>
          )}
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

      {showInviteCode && isAdmin && (
        <div className="card" style={{ margin: '16px auto', maxWidth: 600, textAlign: 'center' }}>
          <h3>Einladungscode für {household.name}</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em', margin: '12px 0' }}>
            {household.invite_code}
          </p>
          <p className="muted">Teile diesen Code mit Haushaltsmitgliedern, damit sie beitreten können.</p>
        </div>
      )}

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
  )
}
