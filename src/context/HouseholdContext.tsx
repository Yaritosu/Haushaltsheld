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

      // Fetch user's household membership
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

      // Fetch household details
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
