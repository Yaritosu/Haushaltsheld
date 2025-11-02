# Datenbank-Setup für Haushaltsheld

## Schritt 1: SQL-Schema in Supabase ausführen

1. Öffne dein Supabase-Projekt: https://supabase.com/dashboard
2. Gehe zu **SQL Editor** (linke Sidebar)
3. Klicke auf **+ New query**
4. Kopiere den Inhalt von `supabase-schema.sql` und füge ihn ein
5. Klicke **Run** (oder Strg+Enter)

Das erstellt:
- `households` (Haushalte mit eindeutigem Einladungscode)
- `profiles` (Benutzerprofile, automatisch erstellt bei Sign-up)
- `household_members` (Zuordnung User ↔ Haushalt mit Admin/Member-Rolle)
- Row Level Security Policies (nur Mitglieder sehen ihre Daten)
- Funktionen für:
  - `generate_invite_code()` – Generiert eindeutige 8-stellige Codes
  - `create_household_with_admin()` – Erstellt Haushalt und macht User zum Admin
  - `join_household_by_code()` – User tritt via Code einem Haushalt bei
  - `get_my_household()` – Liefert Haushalt + Rolle des aktuellen Users in einem Call

## Schritt 2: Testen

Nach dem Ausführen des SQL-Skripts kannst du:
- Dich neu registrieren auf https://haushaltsheld.vercel.app/login
- Beim ersten Login wirst du zu **/onboarding** geleitet
- Wähle: **Neuen Haushalt gründen** oder **Bestehendem beitreten**

### Haushalt gründen
- Gib einen Namen ein (z. B. „Familie Müller")
- Du wirst automatisch Admin
- Im Dashboard → **Einladungscode** zeigt deinen Code
- Teile den Code mit anderen Haushaltsmitgliedern

### Haushalt beitreten
- Gib den 8-stelligen Code ein, den du vom Admin bekommen hast
- Du wirst als „Member" hinzugefügt
- Ab jetzt siehst du beim Login automatisch diesen Haushalt

## Schema-Übersicht

### households
| Spalte       | Typ         | Beschreibung                     |
|--------------|-------------|----------------------------------|
| id           | UUID        | Primary Key                      |
| name         | TEXT        | Haushaltsname                    |
| invite_code  | TEXT UNIQUE | 8-stelliger Einladungscode       |
| created_at   | TIMESTAMPTZ | Erstellungszeitpunkt             |
| created_by   | UUID        | Gründer (User-ID), kann NULL sein|

### profiles
| Spalte       | Typ         | Beschreibung                     |
|--------------|-------------|----------------------------------|
| id           | UUID        | Primary Key = auth.users.id      |
| email        | TEXT        | E-Mail-Adresse                   |
| display_name | TEXT        | Anzeigename (optional)           |
| created_at   | TIMESTAMPTZ | Erstellungszeitpunkt             |

### household_members
| Spalte       | Typ         | Beschreibung                         |
|--------------|-------------|--------------------------------------|
| id           | UUID        | Primary Key                          |
| household_id | UUID        | FK → households.id                   |
| user_id      | UUID        | FK → auth.users.id                   |
| role         | TEXT        | 'admin' oder 'member'                |
| joined_at    | TIMESTAMPTZ | Beitrittszeitpunkt                   |

- **UNIQUE(household_id, user_id)** – Ein User kann nur einmal pro Haushalt sein

Optional (empfohlen): Einzigartigkeit pro Benutzer über alle Haushalte:
- **UNIQUE(user_id)** – Ein User kann nur in genau einem Haushalt sein

## Row Level Security (RLS)

Alle Tabellen haben RLS aktiviert. Das bedeutet:
- Users sehen nur Daten ihres eigenen Haushalts
- Admins können Einladungscodes sehen und Members verwalten
- Normale Members können andere Members sehen, aber nicht entfernen

### Wichtig: Nicht-rekursive SELECT-Policy auf `household_members`
Um Situationen direkt nach dem Beitritt/Erstellen zu vermeiden, in denen wegen RLS noch keine Daten sichtbar sind, ersetzen wir eine evtl. vorhandene rekursive Policy durch eine einfache Selbst-Policy:

1) Öffne Supabase → SQL Editor → New Query
2) Führe `scripts/sql/01_rls_household_members_select_replace.sql` aus
  - Diese löscht ggf. eine alte Policy namens „Members can view household members” und legt „Users can view own memberships” an

### RPC `get_my_household()` erstellen/aktualisieren
Das Frontend lädt Haushalt + Rolle des aktuellen Users in einem Aufruf (robuster unter RLS):

1) Öffne Supabase → SQL Editor → New Query
2) Führe `scripts/sql/02_function_get_my_household.sql` aus

### (Optional) Eindeutigkeit: „ein User, ein Haushalt“ erzwingen
Wenn du möchtest, dass jeder User genau einem Haushalt angehört:

1) Versuche die Constraint anzulegen:
  - Führe `scripts/sql/03_unique_user_single_household.sql` aus
2) Falls ein Fehler wegen doppelter Einträge auftritt:
  - Führe `scripts/sql/99_dedupe_household_members_by_user.sql` aus (behält den neuesten Eintrag pro User)
  - Führe danach erneut `scripts/sql/03_unique_user_single_household.sql` aus

## Nächste Schritte

- [ ] Mitgliederverwaltung im Dashboard (Admin: Members entfernen, Rollen ändern)
- [ ] Haushalt verlassen (Member kann selbst austreten)
- [ ] Haushalt löschen (Admin)
- [ ] Profilname/Avatar bearbeiten
- [ ] Weitere Features: Aufgaben, Einkaufslisten, Budget pro Haushalt
