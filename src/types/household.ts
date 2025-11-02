// Household types and utilities
export interface Household {
  id: string
  name: string
  invite_code: string
  created_at: string
  created_by: string | null
}

export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  created_at: string
}

export interface HouseholdMember {
  id: string
  household_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
}

export interface HouseholdWithMembers extends Household {
  members?: (HouseholdMember & { profile?: Profile })[]
}
