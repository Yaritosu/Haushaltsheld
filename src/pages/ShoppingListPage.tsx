import AppShell from "../components/AppShell";
import {
  ShoppingCartIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useHousehold } from "../context/HouseholdContext";

interface Item {
  id: string;
  title: string;
  done: boolean;
}
const LS_KEY = "hh_shopping_v1";

type Props = { onLogout: () => void };

export default function ShoppingListPage({ onLogout }: Props) {
  const { membership } = useHousehold();
  const isAdmin = membership?.role === "admin";

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [title, setTitle] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setItems((prev) => [
      {
        id: "s" + Math.random().toString(36).slice(2, 9),
        title: title.trim(),
        done: false,
      },
      ...prev,
    ]);
    setTitle("");
  };
  const toggle = (id: string) => {
    if (!isAdmin) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );
  };
  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <AppShell onLogout={onLogout}>
      <div
        className="dashboard-card"
        style={{ maxWidth: 900, margin: "0 auto" }}
      >
        <div className="card-icon">
          <ShoppingCartIcon style={{ width: 28, height: 28 }} />
        </div>
        <h3>Einkaufsliste</h3>
        <p className="muted">
          Alle können hinzufügen. Nur Admin kann als erledigt markieren.
        </p>

        <form
          onSubmit={add}
          className="task-form"
          style={{ marginTop: "1rem" }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Neues Item"
          />
          <button type="submit">Hinzufügen</button>
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              className="task-item"
              style={{ alignItems: "center" }}
            >
              <div
                className="task-title"
                style={{ textDecoration: it.done ? "line-through" : "none" }}
              >
                {it.title}
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  className="nav-btn"
                  onClick={() => remove(it.id)}
                  title="Löschen"
                >
                  <TrashIcon
                    style={{
                      width: 18,
                      height: 18,
                      verticalAlign: "text-bottom",
                      marginRight: 6,
                    }}
                  />
                  Löschen
                </button>
                <button
                  className="nav-btn"
                  onClick={() => toggle(it.id)}
                  disabled={!isAdmin}
                  title={isAdmin ? "Als erledigt markieren" : "Nur Admin"}
                >
                  <CheckIcon
                    style={{
                      width: 18,
                      height: 18,
                      verticalAlign: "text-bottom",
                      marginRight: 6,
                    }}
                  />
                  {it.done ? "Rückgängig" : "Erledigt"}
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="task-item">
              <div className="muted">Liste ist leer</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
