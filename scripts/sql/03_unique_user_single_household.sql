-- Optional: Enforce that a user can belong to only ONE household (unique on user_id)
-- Safe/idempotent: creates the constraint only if it doesn't exist yet.

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_user_single_household'
      AND conrelid = 'household_members'::regclass
  ) THEN
    ALTER TABLE household_members
      ADD CONSTRAINT unique_user_single_household UNIQUE (user_id);
  END IF;
END $$;