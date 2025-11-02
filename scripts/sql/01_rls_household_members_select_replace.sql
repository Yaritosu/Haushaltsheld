-- Replace recursive household_members SELECT policy with a non-recursive, self-membership policy
-- Safe/idempotent: drops old policy by name if it exists, creates new one only if missing.

-- Ensure RLS is enabled
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;

-- Drop old recursive policy if present
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'household_members'
      AND policyname = 'Members can view household members'
  ) THEN
    EXECUTE 'DROP POLICY "Members can view household members" ON household_members';
  END IF;
END $$;

-- Create new self-membership SELECT policy if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = current_schema()
      AND tablename = 'household_members'
      AND policyname = 'Users can view own memberships'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view own memberships" ON household_members FOR SELECT USING (user_id = auth.uid())';
  END IF;
END $$;