import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import { SUPABASE_CONFIGURED, supabase } from './lib/supabaseClient'

// Very simple mock auth using localStorage
const AUTH_KEY = 'hh_auth'
const getIsAuthed = () => localStorage.getItem(AUTH_KEY) === '1'

export default function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>(getIsAuthed())

  useEffect(() => {
    // keep state in sync with storage changes (multi-tab safety)
    const onStorage = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) setIsAuthed(getIsAuthed())
    }
    window.addEventListener('storage', onStorage)

    // if Supabase is configured, bind to auth state
    let unsubscribe: (() => void) | undefined
    if (SUPABASE_CONFIGURED && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsAuthed(true)
          localStorage.setItem(AUTH_KEY, '1')
        }
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const authed = !!session
        setIsAuthed(authed)
        if (authed) localStorage.setItem(AUTH_KEY, '1')
        else localStorage.removeItem(AUTH_KEY)
      })
      unsubscribe = () => subscription.unsubscribe()
    }

    return () => {
      window.removeEventListener('storage', onStorage)
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, '1')
    setIsAuthed(true)
  }
  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthed(false)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthed ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={isAuthed ? <Navigate to="/dashboard" replace /> : <LoginPage onAuthSuccess={handleLogin} />} />
      <Route path="/dashboard" element={isAuthed ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
