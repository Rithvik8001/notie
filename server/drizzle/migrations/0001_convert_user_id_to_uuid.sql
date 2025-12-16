-- Migration: Convert users.id from serial (integer) to uuid
-- This migration handles the conversion of existing integer IDs to UUIDs

-- Step 1: Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Drop foreign key constraint on notes table (if it exists)
ALTER TABLE IF EXISTS notes DROP CONSTRAINT IF EXISTS notes_user_id_users_id_fk;

-- Step 3: Add temporary UUID column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_new UUID DEFAULT gen_random_uuid();

-- Step 4: Generate UUIDs for existing users (if any)
-- This keeps existing users but gives them new UUIDs
UPDATE users SET id_new = gen_random_uuid() WHERE id_new IS NULL;

-- Step 5: Update notes table to use new UUIDs
-- Create a mapping from old integer IDs to new UUIDs
UPDATE notes 
SET user_id = (
  SELECT id_new::text 
  FROM users 
  WHERE users.id::text = notes.user_id::text
)
WHERE EXISTS (
  SELECT 1 FROM users WHERE users.id::text = notes.user_id::text
);

-- Step 6: Drop old integer column
ALTER TABLE users DROP COLUMN IF EXISTS id;

-- Step 7: Rename new UUID column to id
ALTER TABLE users RENAME COLUMN id_new TO id;

-- Step 8: Set id as primary key
ALTER TABLE users ADD PRIMARY KEY (id);

-- Step 9: Change notes.user_id column type to UUID
ALTER TABLE notes 
ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

-- Step 10: Recreate foreign key constraint
ALTER TABLE notes 
ADD CONSTRAINT notes_user_id_users_id_fk 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Step 11: Set default for users.id to generate UUIDs automatically
ALTER TABLE users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();
