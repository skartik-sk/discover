-- Migration to fix column naming inconsistency
-- This handles both cases: if the column is user_id or creator_id

-- First, check if we need to rename user_id to creator_id
DO $$
BEGIN
    -- Check if user_id exists and creator_id doesn't
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'projects'
        AND column_name = 'user_id'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'projects'
        AND column_name = 'creator_id'
    ) THEN
        -- Rename user_id to creator_id
        ALTER TABLE projects RENAME COLUMN user_id TO creator_id;

        -- Update index names
        ALTER INDEX IF EXISTS idx_projects_user_id RENAME TO idx_projects_creator_id;
        ALTER INDEX IF EXISTS idx_projects_user_slug RENAME TO idx_projects_creator_slug;
    END IF;

    -- If creator_id already exists, we're good
    -- If neither exists, the table structure is broken and needs manual intervention
END $$;

-- Ensure the creator_id column has the right constraints
DO $$
BEGIN
    -- Add foreign key if it doesn't exist
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'projects_creator_id_fkey'
        AND table_name = 'projects'
    ) THEN
        ALTER TABLE projects
        ADD CONSTRAINT projects_creator_id_fkey
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Recreate indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
CREATE INDEX IF NOT EXISTS idx_projects_creator_slug ON projects(creator_id, slug);

-- Update RLS policies to use creator_id
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Recreate policies with creator_id
CREATE POLICY "Creators can insert own projects" ON projects
FOR INSERT
WITH CHECK (creator_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Creators can update own projects" ON projects
FOR UPDATE
USING (creator_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));

CREATE POLICY "Creators can delete own projects" ON projects
FOR DELETE
USING (creator_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
