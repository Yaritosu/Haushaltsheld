import AppShell from "../components/AppShell";
import {
  Cog6ToothIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useHousehold } from "../context/HouseholdContext";
import { ALL_AREAS, type Area } from "../context/TasksContext";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabaseClient";

type Props = { onLogout: () => void };

export default function AdminPage({ onLogout }: Props) {
  const { household, membership } = useHousehold();
  const [areas, setAreas] = useState<string[]>([...ALL_AREAS]);
  const [newArea, setNewArea] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState("");

  const isAdmin = membership?.role === "admin";

  const handleAdd = () => {
    if (!newArea.trim()) return;
    setAreas((prev) => [...prev, newArea.trim()]);
    setNewArea("");
  };

  const handleDelete = (idx: number) => {
    if (!confirm("Bereich wirklich löschen?")) return;
    setAreas((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditValue(areas[idx]);
  };

  const handleSaveEdit = () => {
    if (editingIdx === null) return;
    setAreas((prev) => prev.map((a, i) => (i === editingIdx ? editValue : a)));
    setEditingIdx(null);
    setEditValue("");
  };

  const handleReset = async () => {
    if (resetConfirmation !== "RESET") {
      alert('Bitte gib genau "RESET" ein, um fortzufahren.');
      return;
    }

    // 1. Versuche zuerst einen vollständigen Remote-Purge (Supabase Tabellen), damit
    //    Echtzeit-Sync nicht alte Punkte / Aufgaben sofort wieder einspielt.
    if (SUPABASE_CONFIGURED && supabase && membership?.role === "admin") {
      if (household?.id) {
        // Wir löschen nur was wahrscheinlich existiert; Fehler werden geloggt aber nicht blockierend
        const tablesToClear = [
          { name: "task_log", householdField: "household_id" },
          { name: "tasks", householdField: "household_id" },
          { name: "wishlist", householdField: "household_id" },
          // Weitere Tabellen wie calendar / recipes könnten ergänzt werden wenn serverseitig vorhanden
        ];
        for (const tbl of tablesToClear) {
          try {
            const { error } = await supabase
              .from(tbl.name)
              .delete()
              .eq(tbl.householdField, household.id);
            if (error)
              console.warn(
                `Fehler beim Löschen aus ${tbl.name}:`,
                error.message
              );
            else
              console.log(
                `Tabelle ${tbl.name} für Haushalt ${household.id} geleert.`
              );
          } catch (e) {
            console.warn(`Exception beim Löschen aus ${tbl.name}:`, e);
          }
        }
      } else {
        console.warn(
          "Keine household.id verfügbar – Remote-Purge übersprungen."
        );
      }
    } else {
      console.log(
        "Supabase nicht konfiguriert oder kein Admin – nur lokaler Reset."
      );
    }

    // 2. Reset ALLE LocalStorage Keys (inkl. Einkaufsliste, Punktestand, Achievements)
    const keysToReset = [
      "hh_tasks_v2", // Aufgaben
      "hh_task_log_v1", // Punktestand & Statistiken
      "hh_wishlist_v1", // Wunschliste
      "hh_calendar_events_v1", // Kalender
      "hh_recipes_v1", // Rezepte
      "hh_mealplan_v1", // Essensplan
      "hh_achievements_v1", // Auszeichnungen
      "hh_registration_date", // Registrierungsdatum
      "hh_shopping_list_v1", // Einkaufsliste
      "hh_user_id", // Lokale User-ID (damit Punktelogik komplett neu startet)
    ];

    keysToReset.forEach((key) => {
      localStorage.removeItem(key);
    });

    alert("✅ Alle Daten wurden zurückgesetzt! Die Seite wird neu geladen...");
    setShowResetDialog(false);
    setResetConfirmation("");

    // Seite neu laden, damit alle Contexts neu initialisiert werden
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  if (!isAdmin) {
    return (
      <AppShell onLogout={onLogout}>
        <div
          className="dashboard-card"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <h3>Keine Berechtigung</h3>
          <p className="muted">Nur Admins können auf diese Seite zugreifen.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell onLogout={onLogout}>
      <div
        className="dashboard-card"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        <div className="card-icon">
          <Cog6ToothIcon style={{ width: 28, height: 28 }} />
        </div>
        <h3>Admin-Einstellungen</h3>
        <p className="muted">Verwalte Bereiche/Kategorien für Aufgaben.</p>

        <div style={{ marginTop: "1.5rem" }}>
          <h4>Bereiche</h4>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <input
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="Neuer Bereich (z.B. Garage)"
              style={{ flex: 1 }}
            />
            <button className="card-action-btn" onClick={handleAdd}>
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

          <div className="task-list" style={{ marginTop: "1rem" }}>
            {areas.map((area, idx) => (
              <div
                key={idx}
                className="task-item"
                style={{ alignItems: "center" }}
              >
                {editingIdx === idx ? (
                  <>
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button className="nav-btn" onClick={handleSaveEdit}>
                      Speichern
                    </button>
                    <button
                      className="nav-btn secondary"
                      onClick={() => setEditingIdx(null)}
                    >
                      Abbrechen
                    </button>
                  </>
                ) : (
                  <>
                    <div className="task-title" style={{ flex: 1 }}>
                      {area}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="task-check-btn"
                        onClick={() => handleEdit(idx)}
                        title="Bearbeiten"
                      >
                        <PencilIcon style={{ width: 16, height: 16 }} />
                      </button>
                      <button
                        className="task-check-btn"
                        onClick={() => handleDelete(idx)}
                        title="Löschen"
                        style={{ background: "rgba(255,100,100,0.2)" }}
                      >
                        <TrashIcon style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div
            className="muted"
            style={{ marginTop: "1rem", fontSize: "0.85rem" }}
          >
            Hinweis: Änderungen werden nur lokal gespeichert. Für persistente
            Bereiche später Supabase-Integration nötig.
          </div>
        </div>

        {/* Gefahrenzone - Reset */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "2px solid rgba(255,100,100,0.3)",
          }}
        >
          <h4
            style={{
              color: "#ff6b6b",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <ExclamationTriangleIcon style={{ width: 24, height: 24 }} />
            Gefahrenzone
          </h4>
          <p className="muted" style={{ marginTop: "0.5rem" }}>
            Diese Aktion löscht ALLE Daten: Aufgaben, Punkte, Statistiken,
            Wunschliste, Achievements, Kalender, Rezepte.
          </p>
          <button
            onClick={() => setShowResetDialog(true)}
            style={{
              marginTop: "1rem",
              background: "rgba(255,100,100,0.2)",
              border: "2px solid rgba(255,100,100,0.5)",
              color: "#ff6b6b",
              fontWeight: "bold",
            }}
          >
            <TrashIcon
              style={{
                width: 18,
                height: 18,
                verticalAlign: "text-bottom",
                marginRight: 6,
              }}
            />
            Alle Daten zurücksetzen
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div className="card" style={{ maxWidth: 500, width: "100%" }}>
            <h3 style={{ color: "#ff6b6b", marginBottom: "1rem" }}>
              ⚠️ Alle Daten zurücksetzen?
            </h3>
            <p style={{ marginBottom: "1rem" }}>
              Diese Aktion kann <strong>NICHT</strong> rückgängig gemacht
              werden!
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              Folgende Daten werden gelöscht:
            </p>
            <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.5rem" }}>
              <li>Alle Aufgaben</li>
              <li>Alle Punkte & Statistiken</li>
              <li>Wunschliste</li>
              <li>Achievements & Fortschritt</li>
              <li>Kalendereinträge</li>
              <li>Rezepte & Essensplan</li>
            </ul>
            <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>
              Gib zur Bestätigung das Wort{" "}
              <span
                style={{
                  color: "#ff6b6b",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                }}
              >
                RESET
              </span>{" "}
              ein:
            </p>
            <input
              type="text"
              value={resetConfirmation}
              onChange={(e) => setResetConfirmation(e.target.value)}
              placeholder="RESET"
              style={{
                marginBottom: "1rem",
                fontFamily: "monospace",
                fontSize: "1.1rem",
                textAlign: "center",
                fontWeight: "bold",
              }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  setShowResetDialog(false);
                  setResetConfirmation("");
                }}
                style={{ flex: 1 }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleReset}
                disabled={resetConfirmation !== "RESET"}
                style={{
                  flex: 1,
                  background:
                    resetConfirmation === "RESET"
                      ? "rgba(255,100,100,0.3)"
                      : "rgba(100,100,100,0.2)",
                  border: "2px solid rgba(255,100,100,0.5)",
                  color:
                    resetConfirmation === "RESET"
                      ? "#ff6b6b"
                      : "rgba(255,255,255,0.4)",
                  fontWeight: "bold",
                  cursor:
                    resetConfirmation === "RESET" ? "pointer" : "not-allowed",
                }}
              >
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
