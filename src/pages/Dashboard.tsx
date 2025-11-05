import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'
import { useHousehold } from '../context/HouseholdContext'
import AppShell from '../components/AppShell'
import { useTasks } from '../context/TasksContext'
import { useWishlist } from '../context/WishlistContext'
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
  const { myTasks, currentUserId, isDoneForNow, getBalance, getEarned, getSpent } = useTasks()
  const currentPoints = getBalance(currentUserId)
  const earnedPoints = getEarned(currentUserId)
  const spentPoints = getSpent(currentUserId)
  const { items, redeem } = useWishlist()
  const myWishes = useMemo(() => items.filter(i => i.status === 'assigned' && i.assignedTo === currentUserId), [items, currentUserId])
  const openWishes = useMemo(() => items.filter(i => i.status === 'open'), [items])
  
  const [selectedGoalId, setSelectedGoalId] = useState<string>('')

  useEffect(() => {
    if (myWishes.length > 0 && !selectedGoalId) {
      setSelectedGoalId(myWishes[0].id)
    }
  }, [myWishes, selectedGoalId])

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

  const selectedWish = myWishes.find(w => w.id === selectedGoalId)
  const goalPoints = selectedWish?.points ?? 0
  const progressPercent = goalPoints > 0 ? Math.min((currentPoints / goalPoints) * 100, 100) : 0
  const canRedeem = selectedWish && currentPoints >= goalPoints

  const handleRedeem = () => {
    if (!selectedWish || !canRedeem) return
    const success = redeem(selectedWish.id, currentUserId)
    if (success) {
      alert(`Wunsch "${selectedWish.title}" eingelöst! ${goalPoints} P wurden abgezogen.`)
      setSelectedGoalId('')
    } else {
      alert('Einlösen fehlgeschlagen. Prüfe deinen Punktestand.')
    }
  }

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
            <button className="card-action-btn" onClick={() => navigate('/members')}>
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
            {myWishes.length === 0 && (
              <div className="muted" style={{ marginTop: '1rem' }}>
                Keine Wünsche zugeordnet. Wähle einen Wunsch im Wunschliste-Tab.
              </div>
            )}
            {myWishes.length > 0 && (
              <>
                <div className="goal-selector">
                  <label htmlFor="goal-select" className="muted" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                    Aktuelles Ziel
                  </label>
                  <select 
                    id="goal-select"
                    className="goal-dropdown"
                    value={selectedGoalId}
                    onChange={(e) => setSelectedGoalId(e.target.value)}
                  >
                    {myWishes.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title} ({w.points} P)
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
                <button 
                  className="card-action-btn"
                  onClick={handleRedeem}
                  disabled={!canRedeem}
                  style={{
                    background: canRedeem ? 'linear-gradient(135deg, #6be76b, #4fc44f)' : 'rgba(255,255,255,0.15)',
                    color: canRedeem ? '#fff' : 'var(--muted)',
                    fontWeight: canRedeem ? 900 : 700,
                    cursor: canRedeem ? 'pointer' : 'not-allowed',
                    boxShadow: canRedeem ? '0 4px 16px rgba(107, 231, 107, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CheckIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
                  {canRedeem ? 'Einlösen' : `Noch ${goalPoints - currentPoints} P fehlen`}
                </button>
              </>
            )}
            <button className="card-action-btn secondary" onClick={() => navigate('/wishlist')} style={{ marginTop: '0.5rem' }}>
              <ArrowPathIcon style={{ width: 18, height: 18, verticalAlign: 'text-bottom', marginRight: 8 }} />
              Wunschliste verwalten
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
                  <div className="muted" style={{ fontWeight: 600 }}>{isDoneForNow(t, currentUserId) ? '✔' : ''}</div>
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
