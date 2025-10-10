-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id VARCHAR(255) UNIQUE, -- From NextAuth (Google, etc.)
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  username VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  wallet_address VARCHAR(255) UNIQUE, -- For wallet connections
  role VARCHAR(20) DEFAULT 'tester', -- 'tester', 'submitter', 'admin'
  bio TEXT,
  website VARCHAR(500),
  twitter VARCHAR(100),
  github VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (only basic info)
CREATE POLICY "Users basic info is viewable by everyone" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth_id = current_setting('app.current_user_id', true));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);