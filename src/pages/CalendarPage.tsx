import AppShell from "../components/AppShell";
import {
  CalendarDaysIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo } from "react";
import { useTasks } from "../context/TasksContext";

type Props = { onLogout: () => void };

type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "task" | "appointment";
};

const LS_EVENTS_KEY = "hh_calendar_events_v1";

export default function CalendarPage({ onLogout }: Props) {
  const { tasks, isDueNow } = useTasks();
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const raw = localStorage.getItem(LS_EVENTS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const handleAddEvent = () => {
    if (!newTitle.trim() || !newDate) return;
    const ev: Event = {
      id: "e" + Math.random().toString(36).slice(2, 9),
      title: newTitle.trim(),
      date: newDate,
      type: "appointment",
    };
    const updated = [...events, ev];
    setEvents(updated);
    localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(updated));
    setNewTitle("");
    setNewDate("");
  };

  const handleDelete = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(updated));
  };

  const [year, month] = viewDate.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const e of events) {
      map[e.date] = map[e.date] || [];
      map[e.date].push(e);
    }
    // Add due tasks
    for (const t of tasks) {
      if (isDueNow(t, today)) {
        map[todayStr] = map[todayStr] || [];
        map[todayStr].push({
          id: `t-${t.id}`,
          title: t.title,
          date: todayStr,
          type: "task",
        });
      }
    }
    return map;
  }, [events, tasks, isDueNow, today, todayStr]);

  const weeks: Array<Array<number | null>> = [];
  let week: Array<number | null> = [];
  const startOffset = (firstDay + 6) % 7; // Monday=0
  for (let i = 0; i < startOffset; i++) week.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)]);

  const monthName = new Date(year, month - 1, 1).toLocaleString("de-DE", {
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell onLogout={onLogout}>
      <div
        className="dashboard-card"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <div className="card-icon">
          <CalendarDaysIcon style={{ width: 28, height: 28 }} />
        </div>
        <h3>Kalender</h3>
        <p className="muted">Fällige Aufgaben und Termine auf einen Blick.</p>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          <button
            className="nav-btn"
            onClick={() => {
              let m = month - 1,
                y = year;
              if (m < 1) {
                m = 12;
                y--;
              }
              setViewDate(`${y}-${String(m).padStart(2, "0")}`);
            }}
          >
            ◀
          </button>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {monthName}
          </div>
          <button
            className="nav-btn"
            onClick={() => {
              let m = month + 1,
                y = year;
              if (m > 12) {
                m = 1;
                y++;
              }
              setViewDate(`${y}-${String(m).padStart(2, "0")}`);
            }}
          >
            ▶
          </button>
        </div>

        <div
          style={{
            marginTop: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "0.5rem",
          }}
        >
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
            <div
              key={d}
              className="muted"
              style={{ textAlign: "center", fontWeight: 700 }}
            >
              {d}
            </div>
          ))}
          {weeks.flat().map((day, idx) => {
            const dateStr = day
              ? `${year}-${String(month).padStart(2, "0")}-${String(
                  day
                ).padStart(2, "0")}`
              : "";
            const evs = dateStr ? eventsByDate[dateStr] || [] : [];
            const isToday = dateStr === todayStr;
            return (
              <div
                key={idx}
                style={{
                  minHeight: 80,
                  padding: "0.5rem",
                  background: day
                    ? isToday
                      ? "rgba(107, 231, 107, 0.15)"
                      : "rgba(255,255,255,0.05)"
                    : "transparent",
                  borderRadius: 8,
                  border: isToday
                    ? "2px solid rgba(107, 231, 107, 0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {day && (
                  <>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: isToday ? "#6be76b" : "#fff",
                      }}
                    >
                      {day}
                    </div>
                    {evs.map((ev) => (
                      <div
                        key={ev.id}
                        className="muted"
                        style={{
                          fontSize: "0.75rem",
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.type === "task" ? "📋" : "📅"} {ev.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h4>Termin hinzufügen</h4>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Titel (z.B. Arzttermin)"
              style={{ flex: 2 }}
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="card-action-btn" onClick={handleAddEvent}>
              <PlusIcon
                style={{
                  width: 18,
                  height: 18,
                  verticalAlign: "text-bottom",
                  marginRight: 6,
                }}
              />
              Hinzufügen
            </button>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <h4>Alle Termine</h4>
          <div className="task-list" style={{ marginTop: "0.75rem" }}>
            {events.map((ev) => (
              <div key={ev.id} className="task-item">
                <div style={{ flex: 1 }}>
                  <div className="task-title">{ev.title}</div>
                  <div className="task-meta muted">{ev.date}</div>
                </div>
                <button
                  className="task-check-btn"
                  onClick={() => handleDelete(ev.id)}
                  title="Löschen"
                  style={{ background: "rgba(255,100,100,0.2)" }}
                >
                  <TrashIcon style={{ width: 16, height: 16 }} />
                </button>
              </div>
            ))}
            {events.length === 0 && (
              <div className="task-item">
                <div className="muted">Noch keine Termine</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
