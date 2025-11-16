import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPageEnhanced from "./pages/LoginPageEnhanced";
import Dashboard from "./pages/Dashboard";
import OnboardingPageEnhanced from "./pages/OnboardingPageEnhanced";
import { SUPABASE_CONFIGURED, supabase } from "./lib/supabaseClient";
import ResetPassword from "./pages/ResetPassword";
import { HouseholdProvider } from "./context/HouseholdContext";
import { TasksProvider } from "./context/TasksContext";
import TasksPage from "./pages/TasksPage";
import StatsPage from "./pages/StatsPage";
import WishlistPage from "./pages/WishlistPage";
import MembersPage from "./pages/MembersPage";
import { WishlistProvider } from "./context/WishlistContext";
import ShoppingListPage from "./pages/ShoppingListPage";
import AdminPage from "./pages/AdminPage";
import CalendarPage from "./pages/CalendarPage";
import RecipesPage from "./pages/RecipesPage";
import AchievementsPage from "./pages/AchievementsPage";
import { AchievementsProvider } from "./context/AchievementsContext";
import { ActivityLogProvider } from "./context/ActivityLogContext";
import { AchievementStatsPage } from "./pages/AchievementStatsPage";
import InvitePage from "./pages/InvitePage";
import FamilyActivitiesPage from "./pages/FamilyActivitiesPage";

// Very simple mock auth using localStorage
const AUTH_KEY = "hh_auth";
const getIsAuthed = () => localStorage.getItem(AUTH_KEY) === "1";

export default function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>(getIsAuthed());
  const navigate = useNavigate();

  useEffect(() => {
    // keep state in sync with storage changes (multi-tab safety)
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) setIsAuthed(getIsAuthed());
    };
    window.addEventListener("storage", onStorage);

    // if Supabase is configured, bind to auth state
    let unsubscribe: (() => void) | undefined;
    if (SUPABASE_CONFIGURED && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthed(true);
          localStorage.setItem(AUTH_KEY, "1");
          // Pending invite? Route zur Invite-Seite
          const pending = localStorage.getItem("hh_pending_invite");
          if (pending) navigate(`/invite/${pending}`, { replace: true });
        }
      });
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        const authed = !!session;
        setIsAuthed(authed);
        if (authed) localStorage.setItem(AUTH_KEY, "1");
        else localStorage.removeItem(AUTH_KEY);

        if (authed) {
          const pending = localStorage.getItem("hh_pending_invite");
          if (pending) navigate(`/invite/${pending}`, { replace: true });
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, "1");
    setIsAuthed(true);
  };
  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthed(false);
  };

  return (
    <HouseholdProvider>
      <TasksProvider>
        <WishlistProvider>
          <AchievementsProvider>
            <ActivityLogProvider>
              <Routes>
              <Route
                path="/"
                element={
                  isAuthed ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isAuthed ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <LoginPageEnhanced onAuthSuccess={handleLogin} />
                  )
                }
              />
              <Route path="/reset" element={<ResetPassword />} />
              <Route
                path="/onboarding"
                element={
                  isAuthed ? (
                    <OnboardingPageEnhanced />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/dashboard"
                element={
                  isAuthed ? (
                    <Dashboard onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/tasks"
                element={
                  isAuthed ? (
                    <TasksPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/stats"
                element={
                  isAuthed ? (
                    <StatsPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/wishlist"
                element={
                  isAuthed ? (
                    <WishlistPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/shopping"
                element={
                  isAuthed ? (
                    <ShoppingListPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/members"
                element={
                  isAuthed ? (
                    <MembersPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/admin"
                element={
                  isAuthed ? (
                    <AdminPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/calendar"
                element={
                  isAuthed ? (
                    <CalendarPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/recipes"
                element={
                  isAuthed ? (
                    <RecipesPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/achievements"
                element={
                  isAuthed ? (
                    <AchievementsPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/achievement-stats"
                element={
                  isAuthed ? (
                    <AchievementStatsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/family-activities"
                element={
                  isAuthed ? (
                    <FamilyActivitiesPage onLogout={handleLogout} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/invite/:code" element={<InvitePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ActivityLogProvider>
          </AchievementsProvider>
        </WishlistProvider>
      </TasksProvider>
    </HouseholdProvider>
  );
}
