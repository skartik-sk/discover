-- Create project_likes table
CREATE TABLE IF NOT EXISTS project_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id) -- One like per user per project
);

-- Add likes count column to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON project_likes(user_id);

-- Create function to increment project likes atomically
CREATE OR REPLACE FUNCTION increment_project_likes(project_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE projects
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = project_uuid
  RETURNING likes INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to decrement project likes atomically
CREATE OR REPLACE FUNCTION decrement_project_likes(project_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE projects
  SET likes = GREATEST(COALESCE(likes, 0) - 1, 0)
  WHERE id = project_uuid
  RETURNING likes INTO new_count;

  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to toggle like (add or remove)
CREATE OR REPLACE FUNCTION toggle_project_like(
  project_uuid UUID,
  user_uuid UUID
)
RETURNS TABLE(liked BOOLEAN, like_count INTEGER) AS $$
DECLARE
  existing_like UUID;
  current_count INTEGER;
  is_liked BOOLEAN;
BEGIN
  -- Check if like already exists
  SELECT id INTO existing_like
  FROM project_likes
  WHERE project_id = project_uuid AND user_id = user_uuid;

  IF existing_like IS NOT NULL THEN
    -- Unlike: Remove the like
    DELETE FROM project_likes WHERE id = existing_like;

    -- Decrement count
    UPDATE projects
    SET likes = GREATEST(COALESCE(likes, 0) - 1, 0)
    WHERE id = project_uuid
    RETURNING likes INTO current_count;

    is_liked := false;
  ELSE
    -- Like: Add the like
    INSERT INTO project_likes (project_id, user_id)
    VALUES (project_uuid, user_uuid);

    -- Increment count
    UPDATE projects
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = project_uuid
    RETURNING likes INTO current_count;

    is_liked := true;
  END IF;

  RETURN QUERY SELECT is_liked, current_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user has liked a project
CREATE OR REPLACE FUNCTION user_has_liked_project(
  project_uuid UUID,
  user_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  has_liked BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM project_likes
    WHERE project_id = project_uuid AND user_id = user_uuid
  ) INTO has_liked;

  RETURN has_liked;
END;
$$ LANGUAGE plpgsql;

-- Sync existing likes count (in case of data inconsistency)
UPDATE projects p
SET likes = (
  SELECT COUNT(*)
  FROM project_likes pl
  WHERE pl.project_id = p.id
);

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_project_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_project_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_project_like(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_liked_project(UUID, UUID) TO authenticated;

-- Grant permissions on table
GRANT SELECT, INSERT, DELETE ON project_likes TO authenticated;
