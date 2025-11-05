import AppShell from '../components/AppShell';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react'
import { useHousehold } from '../context/HouseholdContext'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabaseClient'

type Props = { onLogout: () => void };

export default function MembersPage({ onLogout }: Props) {
  const { household, membership } = useHousehold()
  const [members, setMembers] = useState<Array<{ id: string; role: string; email?: string | null; name?: string | null }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!SUPABASE_CONFIGURED || !supabase || !household) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('household_members')
          .select('id, role, user_id, profiles!inner(id, email, display_name)')
          .eq('household_id', household.id)
        if (!error && data) {
          // @ts-ignore
          setMembers(data.map((m: any) => ({ id: m.user_id, role: m.role, email: m.profiles?.email ?? null, name: m.profiles?.display_name ?? null })))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [household])

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon"><UsersIcon style={{ width: 28, height: 28 }} /></div>
          <h3>Mitglieder</h3>
          {!SUPABASE_CONFIGURED && (
            <p className="muted">Supabase ist nicht konfiguriert. Mitgliederverwaltung ist lokal deaktiviert.</p>
          )}
          {SUPABASE_CONFIGURED && (
            <div style={{ marginTop: '1rem' }}>
              <div className="task-list">
                {members.map(m => (
                  <div key={m.id} className="task-item">
                    <div className="task-title">{m.name || m.email || m.id.slice(0,8)}</div>
                    <div className="muted" style={{ marginLeft: 'auto' }}>{m.role}</div>
                  </div>
                ))}
                {!loading && members.length === 0 && (
                  <div className="task-item"><div className="muted">Keine Mitglieder gefunden</div></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
