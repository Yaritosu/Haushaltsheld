-- Create or replace RPC to fetch the current user's household and role in one call
-- Frontend expects: household_id, household_name, invite_code, role

CREATE OR REPLACE FUNCTION public.get_my_household()
RETURNS TABLE (
  household_id UUID,
  household_name TEXT,
  invite_code TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT h.id, h.name, h.invite_code, m.role
  FROM household_members m
  JOIN households h ON h.id = m.household_id
  WHERE m.user_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;