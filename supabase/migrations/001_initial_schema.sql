-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('tester', 'creator', 'admin');
CREATE TYPE project_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'featured');
CREATE TYPE project_category AS ENUM ('defi', 'nft', 'gaming', 'infrastructure', 'dao', 'education', 'other');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    role user_role DEFAULT 'tester',
    wallet_address VARCHAR(42),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name project_category UNIQUE NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    discord_url TEXT,
    twitter_url TEXT,
    telegram_url TEXT,
    category_id UUID REFERENCES categories(id),
    creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status project_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    featured_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[], -- array of tags
    tech_stack TEXT[], -- array of technologies used
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_tested BOOLEAN DEFAULT FALSE,
    test_feedback TEXT,
    status review_status DEFAULT 'approved',
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- NFT Rewards table
CREATE TABLE nft_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    token_id BIGINT,
    contract_address VARCHAR(42) NOT NULL,
    chain_id INTEGER DEFAULT 1, -- Ethereum mainnet
    transaction_hash VARCHAR(66) UNIQUE,
    minted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project testers tracking
CREATE TABLE project_testers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    feedback_received BOOLEAN DEFAULT FALSE,
    UNIQUE(project_id, user_id)
);

-- Project views tracking
CREATE TABLE project_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_projects_creator_id ON projects(creator_id);
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_reviews_project_id ON reviews(project_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_nft_rewards_user_id ON nft_rewards(user_id);
CREATE INDEX idx_nft_rewards_project_id ON nft_rewards(project_id);
CREATE INDEX idx_project_testers_project_id ON project_testers(project_id);
CREATE INDEX idx_project_testers_user_id ON project_testers(user_id);
CREATE INDEX idx_project_views_project_id ON project_views(project_id);
CREATE INDEX idx_project_views_viewed_at ON project_views(viewed_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE nft_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_testers ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_views ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth_id = auth.jwt() ->> 'sub');
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth_id = auth.jwt() ->> 'sub');

-- Projects table policies
CREATE POLICY "Anyone can view approved projects" ON projects FOR SELECT USING (status = 'approved');
CREATE POLICY "Creators can view own projects" ON projects FOR SELECT USING (creator_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Creators can insert own projects" ON projects FOR INSERT WITH CHECK (creator_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Creators can update own projects" ON projects FOR UPDATE USING (creator_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Admins can manage all projects" ON projects FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.jwt() ->> 'sub' AND role = 'admin')
);

-- Reviews table policies
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (user_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.jwt() ->> 'sub' AND role = 'admin')
);

-- NFT rewards table policies
CREATE POLICY "Users can view own NFT rewards" ON nft_rewards FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Admins can manage all NFT rewards" ON nft_rewards FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.jwt() ->> 'sub' AND role = 'admin')
);

-- Project testers table policies
CREATE POLICY "Users can view own testing records" ON project_testers FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Users can insert testing records" ON project_testers FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.jwt() ->> 'sub'));
CREATE POLICY "Admins can manage all testing records" ON project_testers FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.jwt() ->> 'sub' AND role = 'admin')
);

-- Project views table policies
CREATE POLICY "Anyone can insert project views" ON project_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view project views" ON project_views FOR SELECT USING (true);

-- Insert default categories
INSERT INTO categories (name, display_name, description, icon, color) VALUES
('defi', 'DeFi', 'Decentralized Finance protocols and platforms', 'trending-up', '#10B981'),
('nft', 'NFTs', 'Non-Fungible Token projects and marketplaces', 'image', '#8B5CF6'),
('gaming', 'Gaming', 'Blockchain gaming and metaverse projects', 'gamepad-2', '#EF4444'),
('infrastructure', 'Infrastructure', 'Blockchain infrastructure and developer tools', 'layers', '#3B82F6'),
('dao', 'DAO', 'Decentralized Autonomous Organizations', 'users', '#F59E0B'),
('education', 'Education', 'Web3 education and learning platforms', 'book-open', '#EC4899'),
('other', 'Other', 'Other Web3 projects and tools', 'more-horizontal', '#6B7280');