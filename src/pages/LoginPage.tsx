import { useState } from 'react'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

type Props = { onAuthSuccess?: () => void }

export default function LoginPage({ onAuthSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (SUPABASE_CONFIGURED && supabase) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        // mock login success
        await new Promise((r) => setTimeout(r, 400))
      }
      onAuthSuccess?.()
    } catch (err: any) {
      setError(err.message ?? 'Fehler beim Login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root login-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Haushaltsheld</h2>
        <p className="muted" style={{ textAlign: 'center' }}>Melde dich an</p>
        <form className="form" onSubmit={handleSubmit}>
          <input type="email" placeholder="E-Mail Adresse" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="form-error">{error}</div>}
          <button className="primary" type="submit" disabled={loading}>{loading ? 'Lade…' : 'Anmelden'}</button>
        </form>
      </div>
    </div>
  )
}
