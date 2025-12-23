import AppShell from "../components/AppShell";
import {
  ChartPieIcon,
  CheckCircleIcon,
  TrophyIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { useTasks } from "../context/TasksContext";
import { useHousehold } from "../context/HouseholdContext";
import { useWishlist } from "../context/WishlistContext";
import { useAchievements } from "../context/AchievementsContext";

type Props = { onLogout: () => void };

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function lastNMonthsLabels(n: number) {
  const labels: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(monthKey(d));
  }
  return labels;
}

export default function StatsPage({ onLogout }: Props) {
  const { completions, currentUserId, tasks } = useTasks();
  const { membership } = useHousehold();
  const { items: wishlistItems } = useWishlist();
  const { unlocked } = useAchievements();
  const labels = useMemo(() => lastNMonthsLabels(6), []);
  // Registration cutoff so alte Daten (vor Reset) nicht mitgezählt werden
  const [registrationDate] = useState<number>(() => {
    const raw = localStorage.getItem("hh_registration_date");
    return raw ? parseInt(raw, 10) : Date.now();
  });
  const recentCompletions = useMemo(
    () => completions.filter((c) => c.ts >= registrationDate),
    [completions, registrationDate]
  );

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of labels) map[l] = 0;
    for (const c of recentCompletions) {
      if (c.delta < 0) continue; // count only positive completions
      const d = new Date(c.ts);
      const key = monthKey(d);
      if (map[key] !== undefined) map[key] += c.points;
    }
    return map;
  }, [recentCompletions, labels]);

  const leaderboard = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of recentCompletions) {
      if (c.delta < 0) continue;
      map[c.userId] = (map[c.userId] || 0) + c.points;
    }
    const items = Object.entries(map).map(([userId, pts]) => ({ userId, pts }));
    items.sort((a, b) => b.pts - a.pts);
    return items;
  }, [recentCompletions]);

  // Aufgabenhäufigkeit (nur task completions)
  const taskCompletionCount = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of recentCompletions) {
      if (c.delta > 0 && c.taskId.startsWith("t")) {
        map[c.taskId] = (map[c.taskId] || 0) + 1;
      }
    }
    const list = Object.entries(map).map(([taskId, count]) => {
      const task = tasks.find((t) => t.id === taskId);
      return { taskId, title: task?.title ?? taskId, count };
    });
    list.sort((a, b) => b.count - a.count);
    return list.slice(0, 5);
  }, [recentCompletions, tasks]);

  // Erledigte Aufgaben (unique tasks)
  const uniqueTasksCompleted = useMemo(() => {
    const set = new Set<string>();
    for (const c of recentCompletions) {
      if (c.delta > 0 && c.taskId.startsWith("t")) set.add(c.taskId);
    }
    return set.size;
  }, [recentCompletions]);

  // Eingelöste Wünsche
  const redeemedWishes = useMemo(
    () => wishlistItems.filter((w) => w.status === "redeemed"),
    [wishlistItems]
  );

  // Achievement Bonus Points
  const achievementBonusPoints = useMemo(() => {
    let total = 0;
    for (const c of recentCompletions) {
      // Achievement rewards are recorded as adjustments with prefix adjust:achievement:
      if (c.taskId.startsWith("adjust:achievement:")) {
        total += c.points;
      }
    }
    return total;
  }, [recentCompletions]);

  const maxVal = Math.max(1, ...Object.values(byMonth));
  const chartWidth = 520,
    chartHeight = 180,
    barGap = 12;
  const barWidth = Math.floor(
    (chartWidth - (labels.length + 1) * barGap) / labels.length
  );

  const fmtMonth = (key: string) => {
    const [y, m] = key.split("-");
    return `${m}.${y}`;
  };

  const nameFor = (uid: string) => (uid === currentUserId ? "Du" : "Mitglied");

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        {/* Punkte pro Monat */}
        <div className="dashboard-card">
          <div className="card-icon">
            <CalendarDaysIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Punkte pro Monat</h3>
          <p className="muted">Verdiente Punkte über die letzten 6 Monate</p>
          <div
            style={{
              overflowX: "auto",
              paddingBottom: "0.5rem",
              marginTop: "1rem",
            }}
          >
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              style={{ width: chartWidth, height: chartHeight }}
            >
              {labels.map((label, i) => {
                const val = byMonth[label];
                const h = Math.round((val / maxVal) * (chartHeight - 40));
                const x = barGap + i * (barWidth + barGap);
                const y = chartHeight - 20 - h;
                return (
                  <g key={label}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={h}
                      fill="rgba(255,255,255,0.2)"
                      rx={6}
                    />
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#fff"
                    >
                      {fmtMonth(label)}
                    </text>
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#fff"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="dashboard-card">
          <div className="card-icon">
            <TrophyIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Leaderboard</h3>
          <p className="muted">Gesamtpunkte aller Mitglieder</p>
          <div className="task-list" style={{ marginTop: "1rem" }}>
            {leaderboard.map((entry, idx) => (
              <div key={entry.userId} className="task-item">
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: "1.2rem",
                    color:
                      idx === 0
                        ? "#ffd700"
                        : idx === 1
                        ? "#c0c0c0"
                        : idx === 2
                        ? "#cd7f32"
                        : "#fff",
                    width: 32,
                  }}
                >
                  {idx + 1}
                </div>
                <div className="task-title">{nameFor(entry.userId)}</div>
                <div
                  className="muted"
                  style={{ marginLeft: "auto", fontWeight: 700 }}
                >
                  {entry.pts} P
                </div>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <div className="task-item">
                <div className="muted">Noch keine Daten</div>
              </div>
            )}
          </div>
        </div>

        {/* Aufgaben-Häufigkeit */}
        <div className="dashboard-card">
          <div className="card-icon">
            <ClipboardDocumentCheckIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Top 5 Aufgaben</h3>
          <p className="muted">Häufigste abgeschlossene Aufgaben</p>
          <div className="task-list" style={{ marginTop: "1rem" }}>
            {taskCompletionCount.map((t) => (
              <div key={t.taskId} className="task-item">
                <div className="task-title">{t.title}</div>
                <div className="muted" style={{ marginLeft: "auto" }}>
                  {t.count}x
                </div>
              </div>
            ))}
            {taskCompletionCount.length === 0 && (
              <div className="task-item">
                <div className="muted">Noch keine Aufgaben erledigt</div>
              </div>
            )}
          </div>
        </div>

        {/* Erledigte Aufgaben */}
        <div className="dashboard-card">
          <div className="card-icon">
            <CheckCircleIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Erledigte Aufgaben</h3>
          <p className="muted">Anzahl verschiedener erledigter Aufgaben</p>
          <div
            className="points-big"
            style={{ margin: "1.5rem 0", textAlign: "center" }}
          >
            {uniqueTasksCompleted}
          </div>
        </div>

        {/* Eingelöste Wünsche */}
        <div className="dashboard-card">
          <div className="card-icon">
            <ChartPieIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Eingelöste Wünsche</h3>
          <p className="muted">Liste aller eingelösten Wünsche</p>
          <div className="task-list" style={{ marginTop: "1rem" }}>
            {redeemedWishes.map((w) => (
              <div key={w.id} className="task-item">
                <div className="task-title">{w.title}</div>
                <div className="muted" style={{ marginLeft: "auto" }}>
                  {w.points} P
                </div>
              </div>
            ))}
            {redeemedWishes.length === 0 && (
              <div className="task-item">
                <div className="muted">Noch keine Wünsche eingelöst</div>
              </div>
            )}
          </div>
        </div>

        {/* User-Vergleich */}
        <div className="dashboard-card">
          <div className="card-icon">
            <TrophyIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Dein Platz</h3>
          <p className="muted">Deine Position im Ranking</p>
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            {leaderboard.findIndex((e) => e.userId === currentUserId) >= 0 ? (
              <>
                <div className="points-big" style={{ margin: "1rem 0" }}>
                  #
                  {leaderboard.findIndex((e) => e.userId === currentUserId) + 1}
                </div>
                <div className="muted">von {leaderboard.length}</div>
              </>
            ) : (
              <div className="muted">Noch keine Daten</div>
            )}
          </div>
        </div>

        {/* Achievement Rewards */}
        <div className="dashboard-card">
          <div className="card-icon">
            <SparklesIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Achievement-Belohnungen</h3>
          <p className="muted">Bonuspunkte durch Auszeichnungen</p>
          <div style={{ marginTop: "1rem" }}>
            <div
              className="points-big"
              style={{ margin: "1rem 0", textAlign: "center" }}
            >
              {achievementBonusPoints}
            </div>
            <div
              className="muted"
              style={{ textAlign: "center", marginBottom: "0.5rem" }}
            >
              Bonuspunkte verdient
            </div>
            <div
              className="muted"
              style={{ textAlign: "center", fontSize: "0.9rem" }}
            >
              {unlocked.length} Achievements × 10-50 Punkte
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
