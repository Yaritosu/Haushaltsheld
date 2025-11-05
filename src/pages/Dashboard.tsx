import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'
import { useHousehold } from '../context/HouseholdContext'
import AppShell from '../components/AppShell'
import { useTasks } from '../context/TasksContext'
import {
  BanknotesIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  CheckIcon,
  KeyIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'

type Props = { onLogout: () => void }

export default function Dashboard({ onLogout }: Props) {
  const navigate = useNavigate()
  const { household, membership, loading, refetch } = useHousehold()
  const [showInviteCode, setShowInviteCode] = useState(false)
  
  // Punktesystem Anzeige (berechnet aus Aufgaben)
  const { myTasks, currentUserId } = useTasks()
  const earnedPoints = useMemo(() => myTasks.reduce((sum, t) => sum + (t.doneBy?.[currentUserId] ? t.points : 0), 0), [myTasks, currentUserId])
  const currentPoints = earnedPoints
  const spentPoints = 0
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
    <AppShell onLogout={onLogout}>
        <div className="dashboard-grid">
          {/* Punktestand Card */}
          <div className="dashboard-card points-card">
            <div className="card-icon"><BanknotesIcon style={{ width: 28, height: 28 }} /></div>
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
            <button className="card-action-btn">
              <BanknotesIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
              Punkte senden
            </button>
            <button className="card-action-btn secondary" onClick={() => navigate('/stats')}>
              <ArrowTrendingUpIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
              Statistiken
            </button>
          </div>

          {/* Wunschzettel/Ziel Card */}
          <div className="dashboard-card wishlist-card">
            <div className="card-icon"><GiftIcon style={{ width: 28, height: 28 }} /></div>
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
              <div className="donut-container">
                <svg className="donut-svg" viewBox="0 0 180 180" style={{ width: 180, height: 180 }}>
                  <circle
                    className="donut-bg"
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="20"
                  />
                  <circle
                    className="donut-progress"
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="20"
                    strokeDasharray={`${(progressPercent / 100) * 440} 440`}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                    style={{
                      backdropFilter: 'blur(8px)',
                      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))',
                      transition: 'stroke-dasharray 0.5s ease',
                    }}
                  />
                  <text
                    x="90"
                    y="90"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      fill: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {Math.round(progressPercent)}%
                  </text>
                </svg>
              </div>
            </div>
            <button className="card-action-btn" onClick={() => navigate('/wishlist')}>
              <ArrowPathIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
              Wechseln
            </button>
          </div>

          {/* Aufgaben Card */}
          <div className="dashboard-card tasks-card">
            <div className="card-header-with-btn">
              <div>
                <div className="card-icon"><ClipboardDocumentListIcon style={{ width: 28, height: 28 }} /></div>
                <h3>Aufgaben</h3>
              </div>
              <button className="small-add-btn" onClick={() => navigate('/tasks')}>
                <ClipboardDocumentListIcon style={{ width: 16, height: 16, verticalAlign: 'text-bottom', marginRight: 6 }} />
                Zu meinen Aufgaben
              </button>
            </div>
            <div className="task-list">
              {myTasks.slice(0, 4).map(t => (
                <div key={t.id} className="task-item">
                  <div style={{ width: 20, height: 20 }} />
                  <div style={{ flex: 1 }}>
                    <div className="task-title">{t.title}</div>
                    <div className="task-meta muted">{t.points} P</div>
                  </div>
                  <div className="muted" style={{ fontWeight: 600 }}>{t.doneBy?.[currentUserId] ? '✔' : ''}</div>
                </div>
              ))}
              {myTasks.length === 0 && (
                <div className="task-item">
                  <div className="task-title">Keine Aufgaben zugewiesen</div>
                  <div className="task-meta muted">Weise dir Aufgaben im Aufgaben-Tab zu.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="admin-section">
            <button onClick={() => setShowInviteCode(!showInviteCode)} className="admin-toggle-btn">
              {showInviteCode ? (
                <>
                  <LockClosedIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
                  Code verbergen
                </>
              ) : (
                <>
                  <KeyIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
                  Einladungscode anzeigen
                </>
              )}
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
    </AppShell>
  )
}
