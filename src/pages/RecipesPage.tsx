import AppShell from "../components/AppShell";
import {
  CakeIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

type Props = { onLogout: () => void };

type Recipe = {
  id: string;
  name: string;
  ingredients: string[]; // "2x Ei, 500g Mehl"
  instructions: string;
};

type MealPlan = {
  day: string; // Mon-Sun or date
  recipeId?: string;
  recipeName?: string;
};

const LS_RECIPES_KEY = "hh_recipes_v1";
const LS_MEALPLAN_KEY = "hh_mealplan_v1";

export default function RecipesPage({ onLogout }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const raw = localStorage.getItem(LS_RECIPES_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [mealPlan, setMealPlan] = useState<MealPlan[]>(() => {
    try {
      const raw = localStorage.getItem(LS_MEALPLAN_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
      "Sonntag",
    ].map((d) => ({ day: d }));
  });

  const [newName, setNewName] = useState("");
  const [newIngredients, setNewIngredients] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddRecipe = () => {
    if (!newName.trim()) return;
    const recipe: Recipe = {
      id: "r" + Math.random().toString(36).slice(2, 9),
      name: newName.trim(),
      ingredients: newIngredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: newInstructions.trim(),
    };
    if (editingId) {
      const updated = recipes.map((r) => (r.id === editingId ? recipe : r));
      setRecipes(updated);
      localStorage.setItem(LS_RECIPES_KEY, JSON.stringify(updated));
      setEditingId(null);
    } else {
      const updated = [...recipes, recipe];
      setRecipes(updated);
      localStorage.setItem(LS_RECIPES_KEY, JSON.stringify(updated));
    }
    setNewName("");
    setNewIngredients("");
    setNewInstructions("");
  };

  const handleDeleteRecipe = (id: string) => {
    if (!confirm("Rezept wirklich löschen?")) return;
    const updated = recipes.filter((r) => r.id !== id);
    setRecipes(updated);
    localStorage.setItem(LS_RECIPES_KEY, JSON.stringify(updated));
  };

  const handleEditRecipe = (r: Recipe) => {
    setNewName(r.name);
    setNewIngredients(r.ingredients.join(", "));
    setNewInstructions(r.instructions);
    setEditingId(r.id);
  };

  const handleAssignMeal = (day: string, recipeId: string) => {
    const r = recipes.find((rec) => rec.id === recipeId);
    const updated = mealPlan.map((m) =>
      m.day === day ? { day, recipeId, recipeName: r?.name } : m
    );
    setMealPlan(updated);
    localStorage.setItem(LS_MEALPLAN_KEY, JSON.stringify(updated));
  };

  const generateShoppingList = () => {
    const items: string[] = [];
    for (const meal of mealPlan) {
      if (meal.recipeId) {
        const r = recipes.find((rec) => rec.id === meal.recipeId);
        if (r) items.push(...r.ingredients);
      }
    }
    return items;
  };

  const shoppingList = generateShoppingList();

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        {/* Rezepte */}
        <div className="dashboard-card">
          <div className="card-icon">
            <CakeIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Rezepte</h3>
          <p className="muted">Verwalte deine Lieblingsrezepte</p>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Rezeptname"
            />
            <input
              value={newIngredients}
              onChange={(e) => setNewIngredients(e.target.value)}
              placeholder="Zutaten (Komma-getrennt)"
            />
            <textarea
              value={newInstructions}
              onChange={(e) => setNewInstructions(e.target.value)}
              placeholder="Anleitung"
              rows={3}
              style={{
                padding: "0.6rem 0.8rem",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.22)",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "white",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="card-action-btn" onClick={handleAddRecipe}>
                <PlusIcon
                  style={{
                    width: 18,
                    height: 18,
                    verticalAlign: "text-bottom",
                    marginRight: 6,
                  }}
                />
                {editingId ? "Aktualisieren" : "Hinzufügen"}
              </button>
              {editingId && (
                <button
                  className="card-action-btn secondary"
                  onClick={() => {
                    setEditingId(null);
                    setNewName("");
                    setNewIngredients("");
                    setNewInstructions("");
                  }}
                >
                  Abbrechen
                </button>
              )}
            </div>
          </div>

          <div className="task-list" style={{ marginTop: "1rem" }}>
            {recipes.map((r) => (
              <div
                key={r.id}
                className="task-item"
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <div className="task-title" style={{ flex: 1 }}>
                    {r.name}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="task-check-btn"
                      onClick={() => handleEditRecipe(r)}
                      title="Bearbeiten"
                    >
                      <PencilIcon style={{ width: 16, height: 16 }} />
                    </button>
                    <button
                      className="task-check-btn"
                      onClick={() => handleDeleteRecipe(r.id)}
                      title="Löschen"
                      style={{ background: "rgba(255,100,100,0.2)" }}
                    >
                      <TrashIcon style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
                <div
                  className="muted"
                  style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}
                >
                  <strong>Zutaten:</strong> {r.ingredients.join(", ")}
                </div>
              </div>
            ))}
            {recipes.length === 0 && (
              <div className="task-item">
                <div className="muted">Noch keine Rezepte</div>
              </div>
            )}
          </div>
        </div>

        {/* Essensplan */}
        <div className="dashboard-card">
          <div className="card-icon">
            <ShoppingCartIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Wochenplan</h3>
          <p className="muted">Plane deine Mahlzeiten für die Woche</p>

          <div className="task-list" style={{ marginTop: "1rem" }}>
            {mealPlan.map((m) => (
              <div
                key={m.day}
                className="task-item"
                style={{ alignItems: "center" }}
              >
                <div style={{ flex: 1 }}>
                  <div className="task-title">{m.day}</div>
                  <div className="task-meta muted">
                    {m.recipeName || "Noch kein Rezept"}
                  </div>
                </div>
                <select
                  className="goal-dropdown"
                  value={m.recipeId || ""}
                  onChange={(e) => handleAssignMeal(m.day, e.target.value)}
                  style={{ width: "auto", minWidth: 150 }}
                >
                  <option value="">Kein Rezept</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Einkaufsliste */}
        <div className="dashboard-card">
          <div className="card-icon">
            <ShoppingCartIcon style={{ width: 28, height: 28 }} />
          </div>
          <h3>Einkaufsliste</h3>
          <p className="muted">Automatisch aus dem Wochenplan generiert</p>

          <div className="task-list" style={{ marginTop: "1rem" }}>
            {shoppingList.map((item, idx) => (
              <div key={idx} className="task-item">
                <div className="task-title">{item}</div>
              </div>
            ))}
            {shoppingList.length === 0 && (
              <div className="task-item">
                <div className="muted">Keine Einträge (Plane Mahlzeiten)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
