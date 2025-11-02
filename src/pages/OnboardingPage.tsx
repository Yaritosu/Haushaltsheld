import { useState } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useHousehold } from '../context/HouseholdContext'

export default function OnboardingPage() {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [householdName, setHouseholdName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { refetch } = useHousehold()

  const createHousehold = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!householdName.trim()) {
      setError('Bitte gib einen Haushaltsnamen ein.')
      return
    }
    setError('')
    setLoading(true)

    try {
      if (!SUPABASE_CONFIGURED || !supabase) throw new Error('Supabase nicht konfiguriert')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nicht eingeloggt')

      const { error: rpcError } = await supabase.rpc('create_household_with_admin', {
        household_name: householdName,
        user_id: user.id,
      })

      if (rpcError) throw rpcError

      // Reload household context before navigating
      await refetch()
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Fehler beim Erstellen des Haushalts')
    } finally {
      setLoading(false)
    }
  }

  const joinHousehold = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteCode.trim()) {
      setError('Bitte gib einen Einladungscode ein.')
      return
    }
    setError('')
    setLoading(true)

    try {
      if (!SUPABASE_CONFIGURED || !supabase) throw new Error('Supabase nicht konfiguriert')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Nicht eingeloggt')

      const { error: rpcError } = await supabase.rpc('join_household_by_code', {
        code: inviteCode.toUpperCase(),
        user_id: user.id,
      })

      if (rpcError) {
        if (rpcError.message.includes('Invalid invite code')) {
          throw new Error('Ungültiger Einladungscode')
        }
        if (rpcError.message.includes('Already a member')) {
          throw new Error('Du bist bereits Mitglied dieses Haushalts')
        }
        throw rpcError
      }

      // Reload household context before navigating
      await refetch()
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Fehler beim Beitreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-root login-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Willkommen bei Haushaltsheld!</h2>

        {mode === 'choose' && (
          <>
            <p className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>
              Möchtest du einen neuen Haushalt gründen oder einem bestehenden beitreten?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="primary" onClick={() => setMode('create')}>
                Neuen Haushalt gründen
              </button>
              <button onClick={() => setMode('join')}>Bestehendem Haushalt beitreten</button>
            </div>
          </>
        )}

        {mode === 'create' && (
          <>
            <p className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>
              Erstelle einen neuen Haushalt. Du wirst automatisch als Admin hinzugefügt.
            </p>
            <form className="form" onSubmit={createHousehold}>
              <input
                type="text"
                placeholder="Haushaltsname (z. B. Familie Müller)"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                required
              />
              {error && <div className="form-error">{error}</div>}
              <button className="primary" type="submit" disabled={loading}>
                {loading ? 'Erstelle…' : 'Haushalt erstellen'}
              </button>
              <button type="button" onClick={() => setMode('choose')} disabled={loading}>
                Zurück
              </button>
            </form>
          </>
        )}

        {mode === 'join' && (
          <>
            <p className="muted" style={{ textAlign: 'center', marginBottom: 16 }}>
              Gib den Einladungscode ein, den du vom Admin erhalten hast.
            </p>
            <form className="form" onSubmit={joinHousehold}>
              <input
                type="text"
                placeholder="Einladungscode (8 Zeichen)"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={8}
                required
              />
              {error && <div className="form-error">{error}</div>}
              <button className="primary" type="submit" disabled={loading}>
                {loading ? 'Trete bei…' : 'Haushalt beitreten'}
              </button>
              <button type="button" onClick={() => setMode('choose')} disabled={loading}>
                Zurück
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
