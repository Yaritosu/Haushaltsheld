import AppShell from "../components/AppShell";
import {
  ClipboardDocumentListIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import {
  useTasks,
  ALL_AREAS,
  RECURRENCE_LABEL,
  RECURRENCE_ORDER,
  type Area,
  type Recurrence,
  type Task,
} from "../context/TasksContext";
import { useHousehold } from "../context/HouseholdContext";

type Props = { onLogout: () => void };

export default function TasksPage({ onLogout }: Props) {
  const {
    tasks,
    setTasks,
    currentUserId,
    myActiveTasks,
    addTask,
    assignToMe,
    unassign,
    toggleDone,
    isDoneForNow,
    isDueNow,
  } = useTasks();
  const { membership } = useHousehold();
  const isAdmin = membership?.role === "admin";
  const [view, setView] = useState<"me" | "all">("me");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState<number>(10);
  const [area, setArea] = useState<Area>("Wohnzimmer");
  const [recurrence, setRecurrence] = useState<Recurrence>("woechentlich");
  const [assignMe, setAssignMe] = useState<boolean>(true);

  const filtered = useMemo(() => {
    return view === "me"
      ? myActiveTasks  // Nur aktive Tasks in "Meine Aufgaben"
      : tasks;         // Alle Tasks in "Alle Aufgaben" 
  }, [myActiveTasks, tasks, view]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const a of ALL_AREAS) map[a] = [];
    for (const t of filtered) {
      map[t.area] = map[t.area] || [];
      map[t.area].push(t);
    }
    for (const a of ALL_AREAS) {
      map[a]?.sort((x, y) => {
        const r =
          RECURRENCE_ORDER.indexOf(x.recurrence) -
          RECURRENCE_ORDER.indexOf(y.recurrence);
        if (r !== 0) return r;
        return x.title.localeCompare(y.title);
      });
    }
    return map;
  }, [filtered]);

  const handleCreate = () => {
    if (!title.trim()) return;
    if (editingId) {
      // update existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: title.trim(), points, area, recurrence }
            : t
        )
      );
      setEditingId(null);
    } else {
      addTask({
        title: title.trim(),
        points,
        area,
        recurrence,
        assignee: assignMe ? currentUserId : undefined,
      });
    }
    setTitle("");
    setPoints(10);
    setArea("Wohnzimmer");
    setRecurrence("woechentlich");
    setAssignMe(true);
    setShowForm(false);
  };

  const handleEdit = (t: Task) => {
    setTitle(t.title);
    setPoints(t.points);
    setArea(t.area);
    setRecurrence(t.recurrence);
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = (taskId: string) => {
    if (!confirm("Aufgabe wirklich löschen?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleComplete = (taskId: string) => {
    if (
      !confirm(
        "Aufgabe endgültig als abgeschlossen markieren (einmalig/sonder)?"
      )
    )
      return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleAssignToOther = (taskId: string) => {
    const userId = prompt("User-ID eingeben (Admin-Zuweisung):");
    if (!userId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: userId } : t))
    );
  };

  return (
    <AppShell onLogout={onLogout}>
      <div
        className="dashboard-card"
        style={{ maxWidth: 1000, margin: "0 auto" }}
      >
        <div className="card-icon">
          <ClipboardDocumentListIcon style={{ width: 28, height: 28 }} />
        </div>
        <h3>Aufgaben</h3>
        <p className="muted">
          Weise Aufgaben Bereichen zu, lege Punkte & Wiederholung fest und ordne
          sie Personen zu.
        </p>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button
            className={`card-action-btn${view === "me" ? "" : " secondary"}`}
            onClick={() => setView("me")}
          >
            Meine Aufgaben
          </button>
          <button
            className={`card-action-btn${view === "all" ? "" : " secondary"}`}
            onClick={() => setView("all")}
          >
            Alle Aufgaben
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="card-action-btn"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? "Abbrechen" : "Neue Aufgabe"}
          </button>
        </div>

        {showForm && (
          <div
            className="task-item"
            style={{
              marginTop: "1rem",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                gap: "0.5rem",
                width: "100%",
              }}
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titel"
              />
              <input
                type="number"
                min={0}
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value || "0", 10))}
                placeholder="Punkte"
              />
              <select
                className="goal-dropdown"
                value={area}
                onChange={(e) => setArea(e.target.value as Area)}
              >
                {ALL_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <select
                className="goal-dropdown"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
              >
                {RECURRENCE_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {RECURRENCE_LABEL[r]}
                  </option>
                ))}
              </select>
            </div>
            {!editingId && (
              <label
                className="muted"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <input
                  type="checkbox"
                  checked={assignMe}
                  onChange={(e) => setAssignMe(e.target.checked)}
                />
                Mir zuordnen
              </label>
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="card-action-btn" onClick={handleCreate}>
                {editingId ? "Aktualisieren" : "Speichern"}
              </button>
              <button
                className="card-action-btn secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {ALL_AREAS.map((areaName) => {
            const list = grouped[areaName] || [];
            if (!list.length) return null;
            return (
              <div key={areaName}>
                <div
                  className="muted"
                  style={{ fontWeight: 700, marginBottom: "0.5rem" }}
                >
                  {areaName}
                </div>
                <div className="task-list">
                  {list.map((t) => {
                    const done = isDoneForNow(t, currentUserId);
                    const due = isDueNow(t);
                    return (
                      <div
                        key={t.id}
                        className="task-item"
                        style={{ opacity: done ? 0.7 : 1, flexWrap: "wrap" }}
                      >
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <div
                            className="task-title"
                            style={{
                              textDecoration: done ? "line-through" : "none",
                            }}
                          >
                            {t.title}
                          </div>
                          <div className="task-meta muted">
                            {t.points} P · {RECURRENCE_LABEL[t.recurrence]}{" "}
                            {t.assignee
                              ? `· ${
                                  t.assignee === currentUserId
                                    ? "Du"
                                    : "Mitglied"
                                }`
                              : ""}{" "}
                            {due ? "" : "· (nicht fällig)"}
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="task-check-btn"
                            onClick={() => toggleDone(t.id)}
                            disabled={false}
                            title={
                              done
                                ? "Als unerledigt markieren"
                                : due 
                                ? "Als erledigt markieren"
                                : "Als erledigt markieren (nicht fällig)"
                            }
                            style={{
                              background: done
                                ? "rgba(107, 231, 107, 0.3)"
                                : due
                                ? "rgba(255,255,255,0.15)"
                                : "rgba(255, 165, 0, 0.15)",
                              opacity: due ? 1 : 0.7,
                              cursor: "pointer",
                            }}
                          >
                            <CheckIcon style={{ width: 16, height: 16 }} />
                          </button>
                          {(t.recurrence === "einmalig" ||
                            t.recurrence === "sonder") && (
                            <button
                              className="task-check-btn"
                              onClick={() => handleComplete(t.id)}
                              title="Als abgeschlossen markieren (löschen)"
                            >
                              <CheckIcon style={{ width: 16, height: 16 }} />
                            </button>
                          )}
                          <button
                            className="task-check-btn"
                            onClick={() => handleEdit(t)}
                            title="Bearbeiten"
                          >
                            <PencilIcon style={{ width: 16, height: 16 }} />
                          </button>
                          {isAdmin && (
                            <button
                              className="task-check-btn"
                              onClick={() => handleAssignToOther(t.id)}
                              title="Anderen zuweisen (Admin)"
                            >
                              <UserPlusIcon style={{ width: 16, height: 16 }} />
                            </button>
                          )}
                          <button
                            className="task-check-btn"
                            onClick={() => handleDelete(t.id)}
                            title="Löschen"
                            style={{ background: "rgba(255,100,100,0.2)" }}
                          >
                            <TrashIcon style={{ width: 16, height: 16 }} />
                          </button>
                          {t.assignee === currentUserId ? (
                            <button
                              className="card-action-btn secondary"
                              style={{
                                width: "auto",
                                padding: "0.4rem 0.75rem",
                              }}
                              onClick={() => unassign(t.id)}
                            >
                              Zuweisung entfernen
                            </button>
                          ) : (
                            !t.assignee && (
                              <button
                                className="task-check-btn"
                                onClick={() => assignToMe(t.id)}
                              >
                                Mir zuordnen
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
