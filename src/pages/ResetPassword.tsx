import { useEffect, useState } from 'react'
import { SUPABASE_CONFIGURED, supabase, SITE_URL } from '../lib/supabaseClient'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [canUpdate, setCanUpdate] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!SUPABASE_CONFIGURED || !supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted) setCanUpdate(!!session)
    })()
    return () => { mounted = false }
  }, [])

  const requestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      if (!SUPABASE_CONFIGURED || !supabase) {
        setError('Supabase ist nicht konfiguriert. Bitte später erneut versuchen.')
        return
      }
  const redirectTo = (SITE_URL || window.location.origin) + '/reset'
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (resetErr) throw resetErr
      setMessage('Wenn die E-Mail existiert, wurde ein Reset-Link versendet.')
    } catch (err: any) {
      setError(err.message ?? 'Fehler beim Anfordern des Reset-Links')
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      if (newPassword.length < 6) throw new Error('Passwort zu kurz (min. 6 Zeichen).')
      if (newPassword !== confirm) throw new Error('Passwörter stimmen nicht überein.')
      if (!SUPABASE_CONFIGURED || !supabase) throw new Error('Supabase nicht konfiguriert.')
      const { error: updErr } = await supabase.auth.updateUser({ password: newPassword })
      if (updErr) throw updErr
      setMessage('Passwort aktualisiert. Du kannst dich jetzt einloggen.')
    } catch (err: any) {
      setError(err.message ?? 'Fehler beim Aktualisieren des Passworts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root login-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Passwort zurücksetzen</h2>
        {message && <div style={{ textAlign: 'center', marginBottom: 8 }}>{message}</div>}
        {error && <div className="form-error" style={{ marginBottom: 8 }}>{error}</div>}

        {!canUpdate ? (
          <form className="form" onSubmit={requestReset}>
            <input type="email" placeholder="Deine E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button className="primary" type="submit" disabled={loading}>{loading ? 'Sende…' : 'Reset-Link senden'}</button>
          </form>
        ) : (
          <form className="form" onSubmit={updatePassword}>
            <input type="password" placeholder="Neues Passwort" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <input type="password" placeholder="Passwort bestätigen" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            <button className="primary" type="submit" disabled={loading}>{loading ? 'Speichere…' : 'Passwort speichern'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
