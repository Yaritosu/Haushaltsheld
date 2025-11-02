-- Haushaltsheld Database Schema
-- Execute this in Supabase SQL Editor

-- 1. Households table
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Household members (junction table)
CREATE TABLE IF NOT EXISTS household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(household_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_household_members_household ON household_members(household_id);
CREATE INDEX IF NOT EXISTS idx_household_members_user ON household_members(user_id);
CREATE INDEX IF NOT EXISTS idx_households_invite_code ON households(invite_code);

-- Row Level Security (RLS)
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Households: members can view their household
CREATE POLICY "Members can view their household"
  ON households FOR SELECT
  USING (
    id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their household"
  ON households FOR UPDATE
  USING (
    id IN (
      SELECT household_id FROM household_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can create household"
  ON households FOR INSERT
  WITH CHECK (true);

-- Household members: members can view members of their household
CREATE POLICY "Members can view household members"
  ON household_members FOR SELECT
  USING (
    household_id IN (
      SELECT household_id FROM household_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage household members"
  ON household_members FOR ALL
  USING (
    household_id IN (
      SELECT household_id FROM household_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can join household"
  ON household_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Function: Generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM households WHERE invite_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Create household and make user admin
CREATE OR REPLACE FUNCTION create_household_with_admin(
  household_name TEXT,
  user_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_household_id UUID;
  new_invite_code TEXT;
BEGIN
  new_invite_code := generate_invite_code();
  
  INSERT INTO households (name, invite_code, created_by)
  VALUES (household_name, new_invite_code, user_id)
  RETURNING id INTO new_household_id;
  
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (new_household_id, user_id, 'admin');
  
  RETURN new_household_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Join household via invite code
CREATE OR REPLACE FUNCTION join_household_by_code(
  code TEXT,
  user_id UUID
)
RETURNS UUID AS $$
DECLARE
  target_household_id UUID;
BEGIN
  SELECT id INTO target_household_id
  FROM households
  WHERE invite_code = UPPER(code);
  
  IF target_household_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;
  
  -- Check if already member
  IF EXISTS (
    SELECT 1 FROM household_members 
    WHERE household_id = target_household_id AND user_id = join_household_by_code.user_id
  ) THEN
    RAISE EXCEPTION 'Already a member of this household';
  END IF;
  
  INSERT INTO household_members (household_id, user_id, role)
  VALUES (target_household_id, user_id, 'member');
  
  RETURN target_household_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
