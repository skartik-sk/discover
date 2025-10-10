-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(50),
  gradient VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL, -- For URL-friendly project names
  description TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(500),
  github_url VARCHAR(500),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Project owner
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, slug) -- Ensure unique project names per user
);

-- Project tags junction table
CREATE TABLE IF NOT EXISTS project_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, tag_name)
);

-- Project reviews table
CREATE TABLE IF NOT EXISTS project_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id VARCHAR(100), -- Can be updated later when auth is implemented
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_tested BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id) -- One review per user per project
);

-- Project testers table
CREATE TABLE IF NOT EXISTS project_testers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id VARCHAR(100), -- Can be updated later when auth is implemented
  tested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Insert initial categories
INSERT INTO categories (slug, name, description, icon, color, gradient, sort_order) VALUES
('defi', 'DeFi', 'Decentralized Finance protocols and platforms revolutionizing traditional financial services.', '📊', 'green', 'from-green-500 to-emerald-600', 1),
('nft', 'NFTs', 'Non-Fungible Token projects, marketplaces, and digital collectibles platforms.', '🎨', 'purple', 'from-purple-500 to-pink-600', 2),
('gaming', 'Gaming', 'Blockchain gaming, metaverse projects, and play-to-earn ecosystems.', '🎮', 'red', 'from-red-500 to-orange-600', 3),
('infrastructure', 'Infrastructure', 'Core blockchain infrastructure, developer tools, and middleware solutions.', '⚙️', 'blue', 'from-blue-500 to-cyan-600', 4),
('dao', 'DAO', 'Decentralized Autonomous Organizations and governance platforms.', '🏛️', 'yellow', 'from-yellow-500 to-amber-600', 5),
('education', 'Education', 'Web3 learning platforms, educational resources, and developer training.', '📚', 'pink', 'from-pink-500 to-rose-600', 6),
('other', 'Other', 'Other innovative Web3 projects and emerging technologies.', '🚀', 'gray', 'from-gray-500 to-slate-600', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert a demo user first
INSERT INTO users (auth_id, email, display_name, username, role) VALUES
('demo-user-id', 'demo@example.com', 'Demo User', 'demo', 'submitter')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects for each category (with slugs and user_id)
INSERT INTO projects (title, slug, description, logo_url, category_id, user_id, is_featured) VALUES
('DeFi Protocol X', 'defi-protocol-x', 'Revolutionary decentralized lending protocol with zero slippage and advanced yield optimization.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'defi'), (SELECT id FROM users WHERE username = 'demo'), true),
('Yield Optimizer Pro', 'yield-optimizer-pro', 'Automated yield farming strategy optimizer with AI-powered recommendations.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'defi'), (SELECT id FROM users WHERE username = 'demo'), false),
('Cross-chain DEX', 'cross-chain-dex', 'Multi-chain decentralized exchange with seamless asset swapping and low fees.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'defi'), (SELECT id FROM users WHERE username = 'demo'), true),
('NFT Marketplace Pro', 'nft-marketplace-pro', 'Next-generation NFT marketplace with advanced analytics and creator tools.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'nft'), (SELECT id FROM users WHERE username = 'demo'), true),
('Generative Art Platform', 'generative-art-platform', 'AI-powered generative art NFT platform with customizable algorithms.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'nft'), (SELECT id FROM users WHERE username = 'demo'), false),
('NFT Gaming Assets', 'nft-gaming-assets', 'Cross-chain NFT marketplace specialized in gaming assets and virtual items.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'nft'), (SELECT id FROM users WHERE username = 'demo'), false),
('Gaming Metaverse', 'gaming-metaverse', 'Immersive Web3 gaming experience with play-to-earn mechanics and stunning graphics.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'gaming'), (SELECT id FROM users WHERE username = 'demo'), true),
('Battle Arena', 'battle-arena', 'Competitive multiplayer battle arena with blockchain-based rewards and tournaments.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'gaming'), (SELECT id FROM users WHERE username = 'demo'), true),
('Strategy Game', 'strategy-game', 'Turn-based strategy game with NFT assets and decentralized governance.', '/api/placeholder/48/48', (SELECT id FROM categories WHERE slug = 'gaming'), (SELECT id FROM users WHERE username = 'demo'), false)
ON CONFLICT DO NOTHING;

-- Insert tags for projects (using separate INSERT statements for clarity)
INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Innovation'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'DeFi Protocol X'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'DeFi'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'DeFi Protocol X'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Lending'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'DeFi Protocol X'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Yield'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'Yield Optimizer Pro'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Automated'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'Yield Optimizer Pro'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'AI'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'Yield Optimizer Pro'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'DEX'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'Cross-chain DEX'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Cross-chain'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'Cross-chain DEX'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Low Fees'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'defi' AND p.title = 'Cross-chain DEX'
ON CONFLICT (project_id, tag_name) DO NOTHING;

-- NFT Project Tags
INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Marketplace'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'NFT Marketplace Pro'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Analytics'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'NFT Marketplace Pro'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Creator Tools'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'NFT Marketplace Pro'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Generative Art'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'Generative Art Platform'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'AI'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'Generative Art Platform'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Creative'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'Generative Art Platform'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Gaming'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'NFT Gaming Assets'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Assets'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'NFT Gaming Assets'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Cross-chain'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'nft' AND p.title = 'NFT Gaming Assets'
ON CONFLICT (project_id, tag_name) DO NOTHING;

-- Gaming Project Tags
INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Gaming'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Gaming Metaverse'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Metaverse'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Gaming Metaverse'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'P2E'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Gaming Metaverse'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Competitive'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Battle Arena'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Tournaments'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Battle Arena'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Rewards'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Battle Arena'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Strategy'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Strategy Game'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'Turn-based'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Strategy Game'
ON CONFLICT (project_id, tag_name) DO NOTHING;

INSERT INTO project_tags (project_id, tag_name)
SELECT p.id, 'NFT'
FROM projects p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'gaming' AND p.title = 'Strategy Game'
ON CONFLICT (project_id, tag_name) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_testers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (is_active = true);
CREATE POLICY "Project tags are viewable by everyone" ON project_tags FOR SELECT USING (true);
CREATE POLICY "Project reviews are viewable by everyone" ON project_reviews FOR SELECT USING (true);
CREATE POLICY "Project testers are viewable by everyone" ON project_testers FOR SELECT USING (true);
CREATE POLICY "Users basic info is viewable by everyone" ON users FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth_id = current_setting('app.current_user_id', true));

-- Users can insert their own projects
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth_id() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth_id() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth_id() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_user_slug ON projects(user_id, slug);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tags_tag_name ON project_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_project_reviews_project_id ON project_reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_project_testers_project_id ON project_testers(project_id);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);