import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient'
import type { Household, HouseholdMember } from '../types/household'

interface HouseholdContextType {
  household: Household | null
  membership: HouseholdMember | null
  loading: boolean
  refetch: () => Promise<void>
}

const HouseholdContext = createContext<HouseholdContextType>({
  household: null,
  membership: null,
  loading: true,
  refetch: async () => {},
})

export const useHousehold = () => useContext(HouseholdContext)

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const [household, setHousehold] = useState<Household | null>(null)
  const [membership, setMembership] = useState<HouseholdMember | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHousehold = async () => {
    if (!SUPABASE_CONFIGURED || !supabase) {
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setHousehold(null)
        setMembership(null)
        setLoading(false)
        return
      }

      // Try to get household in one RPC call (more robust under RLS)
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_my_household')

      if (!rpcError && rpcData) {
        if (rpcData.length > 0) {
          const row = rpcData[0]
          setHousehold({ id: row.household_id, name: row.household_name, invite_code: row.invite_code, created_at: '', created_by: null })
          setMembership({ id: 'unknown', household_id: row.household_id, user_id: user.id, role: row.role, joined_at: '' })
          setLoading(false)
          return
        }
      }

      // Fallback: separate selects
      const { data: memberData, error: memberError } = await supabase
        .from('household_members')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (memberError || !memberData) {
        setHousehold(null)
        setMembership(null)
        setLoading(false)
        return
      }

      setMembership(memberData)

      const { data: householdData, error: householdError } = await supabase
        .from('households')
        .select('*')
        .eq('id', memberData.household_id)
        .single()

      if (householdError || !householdData) {
        setHousehold(null)
      } else {
        setHousehold(householdData)
      }
    } catch (err) {
      console.error('Error fetching household:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHousehold()
  }, [])

  return (
    <HouseholdContext.Provider value={{ household, membership, loading, refetch: fetchHousehold }}>
      {children}
    </HouseholdContext.Provider>
  )
}
