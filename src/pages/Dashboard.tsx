import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'
import { useHousehold } from '../context/HouseholdContext'

type Props = { onLogout: () => void }

export default function Dashboard({ onLogout }: Props) {
  const navigate = useNavigate()
  const { household, membership, loading, refetch } = useHousehold()
  const [showInviteCode, setShowInviteCode] = useState(false)
  
  // Punktesystem State (später aus DB laden)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [spentPoints, setSpentPoints] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState<string>('PS5 (5000 P)')

  // Mock-Ziele (später aus DB/Wunschzettel laden)
  const availableGoals = [
    'PS5 (5000 P)',
    'Nintendo Switch (3000 P)',
    'Neues Fahrrad (2000 P)',
    'Laptop (6000 P)',
    'Kopfhörer (800 P)',
  ]

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

  // Parse Punkte aus dem ausgewählten Ziel
  const goalPointsMatch = selectedGoal.match(/\((\d+)\s*P\)/)
  const goalPoints = goalPointsMatch ? parseInt(goalPointsMatch[1], 10) : 5000
  const progressPercent = Math.min((currentPoints / goalPoints) * 100, 100)

  return (
    <div className="app-root dashboard">
      <header className="app-header">
        <div>
          <h1>Haushaltsheld</h1>
          <p className="muted" style={{ margin: 0 }}>
            Angemeldet als: <strong>Admin</strong> · 👥 Mitglieder · 🔒 Admin · 🔑 Passwort ändern · 🚪 Logout
          </p>
        </div>
      </header>

      <nav className="app-nav">
        <button className="nav-btn active">📊 Dashboard</button>
        <button className="nav-btn">📝 Aufgaben</button>
        <button className="nav-btn">📈 Statistiken</button>
        <button className="nav-btn">🎁 Wunschliste</button>
        <button className="nav-btn">👥 Mitglieder</button>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Punktestand Card */}
          <div className="dashboard-card points-card">
            <div className="card-icon">💰</div>
            <h3>Punktestand</h3>
            <div className="points-display">
              <div className="points-big">{currentPoints}<span className="points-label">P</span></div>
              <div className="points-breakdown">
                <div className="points-line">
                  <span>Verdient:</span> <span className="earned">{earnedPoints} P</span>
                </div>
                <div className="points-line">
                  <span>Ausgegeben:</span> <span className="spent">{spentPoints} P</span>
                </div>
              </div>
            </div>
            <button className="card-action-btn">💵 Punkte senden</button>
            <button className="card-action-btn secondary">📊 Statistiken</button>
          </div>

          {/* Wunschzettel/Ziel Card */}
          <div className="dashboard-card wishlist-card">
            <div className="card-icon">🎁</div>
            <h3>Wunschzettel</h3>
            <div className="goal-selector">
              <label htmlFor="goal-select" className="muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                Aktuelles Ziel
              </label>
              <select 
                id="goal-select"
                className="goal-dropdown"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
              >
                {availableGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>
            <div className="goal-progress">
              <div className="progress-text">
                <span>{currentPoints} / {goalPoints} P</span>
                <span>noch {goalPoints - currentPoints > 0 ? goalPoints - currentPoints : 0} P</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
                  <span className="progress-percent">{Math.round(progressPercent)}%</span>
                </div>
              </div>
            </div>
            <button className="card-action-btn">🔄 Wechseln</button>
          </div>

          {/* Aufgaben Card */}
          <div className="dashboard-card tasks-card">
            <div className="card-header-with-btn">
              <div>
                <div className="card-icon">📝</div>
                <h3>Aufgaben</h3>
              </div>
              <button className="small-add-btn">➕ Zu meinen Aufgaben</button>
            </div>
            <div className="task-list">
              <div className="task-item">
                <input type="checkbox" id="task1" />
                <label htmlFor="task1">
                  <div className="task-title">Fenster Putzen</div>
                  <div className="task-meta muted">Ingo</div>
                </label>
                <button className="task-check-btn">✓</button>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task2" />
                <label htmlFor="task2">
                  <div className="task-title">Saugen</div>
                  <div className="task-meta muted"></div>
                </label>
                <button className="task-check-btn">✓</button>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task3" />
                <label htmlFor="task3">
                  <div className="task-title">Boden waschen</div>
                  <div className="task-meta muted">Keine Anfrage</div>
                </label>
                <button className="task-check-btn">✓</button>
              </div>
              <div className="task-item">
                <input type="checkbox" id="task4" />
                <label htmlFor="task4">
                  <div className="task-title">Renovierung abschließen</div>
                  <div className="task-meta muted">Sofiel/Amelie</div>
                </label>
                <button className="task-check-btn">✓</button>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-section">
            <button onClick={() => setShowInviteCode(!showInviteCode)} className="admin-toggle-btn">
              {showInviteCode ? '🔒 Code verbergen' : '🔑 Einladungscode anzeigen'}
            </button>
            {showInviteCode && (
              <div className="invite-code-display">
                <p className="muted">Einladungscode für {household.name}:</p>
                <div className="invite-code">{household.invite_code}</div>
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  Teile diesen Code, damit andere Mitglieder beitreten können.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
