-- Fix duplicate memberships per user_id by keeping the most recent joined_at
-- Run this BEFORE creating the unique_user_single_household constraint if it fails due to duplicates.

WITH ranked AS (
  SELECT id,
         user_id,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY joined_at DESC, id DESC) AS rn
  FROM household_members
)
DELETE FROM household_members hm
USING ranked r
WHERE hm.id = r.id
  AND r.rn > 1;