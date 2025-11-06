import { useState, useEffect } from 'react'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { SUPABASE_CONFIGURED, supabase, SITE_URL } from '../lib/supabaseClient'

type Props = { onAuthSuccess?: () => void }

export default function LoginPageEnhanced({ onAuthSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [pendingInvite, setPendingInvite] = useState<string | null>(null)
  
  // Validation states
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null)

  useEffect(() => {
    const p = localStorage.getItem('hh_pending_invite')
    if (p) setPendingInvite(p)
  }, [])

  // Email validation
  useEffect(() => {
    if (!email) {
      setEmailValid(null)
      return
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    setEmailValid(valid)
  }, [email])

  // Password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(null)
      return
    }
    if (password.length < 6) setPasswordStrength('weak')
    else if (password.length < 10) setPasswordStrength('medium')
    else setPasswordStrength('strong')
  }, [password])

  // Password match
  useEffect(() => {
    if (mode === 'signup' && confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(null)
    }
  }, [password, confirmPassword, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validierung
    if (!emailValid) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.')
      return
    }
    if (mode === 'signup' && passwordStrength === 'weak') {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }
    if (mode === 'signup' && !passwordsMatch) {
      setError('Passwörter stimmen nicht überein.')
      return
    }

    setLoading(true)
    try {
      if (SUPABASE_CONFIGURED && supabase) {
        if (mode === 'login') {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
          if (signInError) throw signInError
          setSuccess('Erfolgreich angemeldet!')
        } else {
          const { data, error: signUpError } = await supabase.auth.signUp({ 
            email, 
            password,
            options: { data: { email } }
          })
          if (signUpError) throw signUpError
          if (!data.session) {
            setSuccess('Registrierung erfolgreich! Bitte bestätige deine E-Mail.')
            setPendingEmail(email)
            setLoading(false)
            return
          }
        }
      } else {
        // Mock flow
        await new Promise((r) => setTimeout(r, 500))
        if (mode === 'signup') {
          setSuccess('Mock-Registrierung erfolgreich. Du wirst eingeloggt...')
          await new Promise((r) => setTimeout(r, 800))
        }
      }
      onAuthSuccess?.()
    } catch (err: any) {
      const msg = String(err?.message || '')
      if (/invalid login credentials/i.test(msg)) {
        setError('Ungültige Zugangsdaten oder E-Mail noch nicht bestätigt.')
      } else if (/email not confirmed/i.test(msg)) {
        setError('Bitte bestätige zuerst deine E-Mail.')
      } else if (/already registered/i.test(msg) || /already exists/i.test(msg)) {
        setError('Diese E-Mail ist bereits registriert. Versuche dich anzumelden.')
      } else {
        setError(msg || 'Ein Fehler ist aufgetreten')
      }
    } finally {
      setLoading(false)
    }
  }

  const resendConfirmation = async () => {
    if (!pendingEmail || !SUPABASE_CONFIGURED || !supabase) return
    setError(''); setSuccess('')
    try {
      await supabase.auth.resend({ 
        type: 'signup', 
        email: pendingEmail, 
        options: { emailRedirectTo: (SITE_URL || window.location.origin) + '/login' } 
      })
      setSuccess('Bestätigungs-E-Mail erneut gesendet.')
    } catch (err: any) {
      setError(err?.message || 'Fehler beim Senden der E-Mail')
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="app-root login-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ maxWidth: 460, width: '100%', margin: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>🏠 Haushaltsheld</h2>
        <p className="muted" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          Deine smarte Haushalts-App
        </p>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          borderBottom: '2px solid rgba(255,255,255,0.1)'
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: mode === 'login' ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--bronze-light)' : '2px solid transparent',
              color: mode === 'login' ? 'white' : 'rgba(255,255,255,0.6)',
              fontWeight: mode === 'login' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '-2px'
            }}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: mode === 'signup' ? 'rgba(255,255,255,0.15)' : 'transparent',
              border: 'none',
              borderBottom: mode === 'signup' ? '2px solid var(--bronze-light)' : '2px solid transparent',
              color: mode === 'signup' ? 'white' : 'rgba(255,255,255,0.6)',
              fontWeight: mode === 'signup' ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '-2px'
            }}
          >
            Registrieren
          </button>
        </div>

        {/* Pending Invite Hinweis */}
        {pendingInvite && (
          <div style={{
            background: 'rgba(107, 231, 107, 0.15)',
            border: '1px solid rgba(107, 231, 107, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            🎉 Du wurdest eingeladen! Code: <strong>{pendingInvite}</strong>
            <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.8 }}>
              Nach dem Login trittst du automatisch bei.
            </div>
          </div>
        )}

        <form className="form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              E-Mail-Adresse
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="deine@email.de" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{
                  width: '100%',
                  paddingRight: emailValid !== null ? '2.5rem' : '1rem'
                }}
              />
              {emailValid !== null && (
                <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
                  {emailValid ? (
                    <CheckCircleIcon style={{ width: 20, height: 20, color: '#6be76b' }} />
                  ) : (
                    <XCircleIcon style={{ width: 20, height: 20, color: '#ff6b6b' }} />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
              Passwort {mode === 'signup' && '(mind. 6 Zeichen)'}
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? (
                  <EyeSlashIcon style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.6)' }} />
                ) : (
                  <EyeIcon style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.6)' }} />
                )}
              </button>
            </div>
            {mode === 'signup' && passwordStrength && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                Stärke: <span style={{ 
                  color: passwordStrength === 'weak' ? '#ff6b6b' : passwordStrength === 'medium' ? '#ffa500' : '#6be76b',
                  fontWeight: 'bold'
                }}>
                  {passwordStrength === 'weak' ? 'Schwach' : passwordStrength === 'medium' ? 'Mittel' : 'Stark'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                Passwort bestätigen
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  style={{
                    width: '100%',
                    paddingRight: passwordsMatch !== null ? '2.5rem' : '1rem'
                  }}
                />
                {passwordsMatch !== null && (
                  <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
                    {passwordsMatch ? (
                      <CheckCircleIcon style={{ width: 20, height: 20, color: '#6be76b' }} />
                    ) : (
                      <XCircleIcon style={{ width: 20, height: 20, color: '#ff6b6b' }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="form-error" style={{ textAlign: 'center' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ 
              textAlign: 'center', 
              color: '#6be76b', 
              background: 'rgba(107, 231, 107, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              {success}
              {mode === 'signup' && pendingEmail && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={resendConfirmation}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Bestätigungs-E-Mail erneut senden
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button 
            className="primary" 
            type="submit" 
            disabled={loading || (mode === 'signup' && (!emailValid || !passwordsMatch))}
            style={{
              opacity: (loading || (mode === 'signup' && (!emailValid || !passwordsMatch))) ? 0.5 : 1,
              cursor: (loading || (mode === 'signup' && (!emailValid || !passwordsMatch))) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ 
                  width: 16, 
                  height: 16, 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite'
                }} />
                {mode === 'login' ? 'Anmelden...' : 'Registrieren...'}
              </span>
            ) : (
              mode === 'login' ? '🔓 Anmelden' : '🎉 Registrieren'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {mode === 'login' && (
            <div style={{ marginBottom: '0.75rem' }}>
              <a href="/reset" className="muted" style={{ textDecoration: 'underline' }}>
                Passwort vergessen?
              </a>
            </div>
          )}
          <button 
            type="button" 
            onClick={switchMode}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--bronze-light)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {mode === 'login' ? 'Noch kein Account? Jetzt registrieren' : 'Bereits registriert? Anmelden'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
