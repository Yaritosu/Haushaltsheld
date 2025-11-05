import AppShell from '../components/AppShell';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import { useMemo } from 'react'
import { useTasks } from '../context/TasksContext'
import { useHousehold } from '../context/HouseholdContext'

type Props = { onLogout: () => void };

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}`
}

function lastNMonthsLabels(n: number) {
  const labels: string[] = []
  const now = new Date()
  for (let i = n-1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(monthKey(d))
  }
  return labels
}

export default function StatsPage({ onLogout }: Props) {
  const { completions, currentUserId } = useTasks()
  const { membership } = useHousehold()
  const labels = useMemo(() => lastNMonthsLabels(6), [])

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {}
    for (const l of labels) map[l] = 0
    for (const c of completions) {
      if (c.delta < 0) continue // count only positive completions
      const d = new Date(c.ts)
      const key = monthKey(d)
      if (map[key] !== undefined) map[key] += c.points
    }
    return map
  }, [completions, labels])

  const leaderboard = useMemo(() => {
    const map: Record<string, number> = {}
    for (const c of completions) {
      if (c.delta < 0) continue
      map[c.userId] = (map[c.userId] || 0) + c.points
    }
    const items = Object.entries(map).map(([userId, pts]) => ({ userId, pts }))
    items.sort((a,b) => b.pts - a.pts)
    return items
  }, [completions])

  const maxVal = Math.max(1, ...Object.values(byMonth))
  const chartWidth = 520, chartHeight = 180, barGap = 12
  const barWidth = Math.floor((chartWidth - (labels.length+1)*barGap) / labels.length)

  const fmtMonth = (key: string) => {
    const [y,m] = key.split('-')
    return `${m}.${y}`
  }

  const nameFor = (uid: string) => uid === currentUserId ? 'Du' : 'Mitglied'

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon"><ChartPieIcon style={{ width: 28, height: 28 }} /></div>
          <h3>Statistiken</h3>
          <p className="muted">Punkte aus erledigten Aufgaben (nur positive Abschlüsse)</p>

          {/* Bar Chart */}
          <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: chartWidth, height: chartHeight }}>
              {labels.map((label, i) => {
                const val = byMonth[label]
                const h = Math.round((val / maxVal) * (chartHeight - 40))
                const x = barGap + i*(barWidth + barGap)
                const y = chartHeight - 20 - h
                return (
                  <g key={label}>
                    <rect x={x} y={y} width={barWidth} height={h} fill="rgba(255,255,255,0.2)" rx={6} />
                    <text x={x + barWidth/2} y={chartHeight - 6} textAnchor="middle" fontSize="10" fill="#fff">{fmtMonth(label)}</text>
                    <text x={x + barWidth/2} y={y - 6} textAnchor="middle" fontSize="12" fill="#fff">{val}</text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Leaderboard */}
          <div style={{ marginTop: '1rem' }}>
            <div className="muted" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Leaderboard (Punkte gesamt)</div>
            <div className="task-list">
              {leaderboard.map(entry => (
                <div key={entry.userId} className="task-item">
                  <div className="task-title">{nameFor(entry.userId)}</div>
                  <div className="muted" style={{ marginLeft: 'auto' }}>{entry.pts} P</div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="task-item"><div className="muted">Noch keine Daten</div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
