-- Migration: Add increment_project_views RPC function
-- Date: 2025-01-26
-- Description: Atomic increment function for project views

-- Drop function if it exists (for re-running migration)
DROP FUNCTION IF EXISTS increment_project_views(UUID);

-- Create the function to atomically increment project views
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_view_count INTEGER;
BEGIN
  -- Atomically increment the views column and return the new value
  UPDATE projects
  SET views = COALESCE(views, 0) + 1,
      updated_at = NOW()
  WHERE id = project_id
  RETURNING views INTO new_view_count;

  -- Return the new view count
  RETURN new_view_count;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION increment_project_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_project_views(UUID) TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION increment_project_views(UUID) IS 'Atomically increments the view count for a project and returns the new count';
