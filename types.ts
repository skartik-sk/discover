import type { Id } from './convex/_generated/dataModel';

export enum ProjectCategory {
  DeFi = 'DeFi',
  NFT = 'NFT',
  Gaming = 'Gaming',
  DAO = 'DAO',
  Infrastructure = 'Infrastructure',
  Social = 'Social',
  AI = 'AI'
}

export type Chain = 'Ethereum' | 'Solana' | 'Polygon' | 'Arbitrum' | 'Base' | 'Avalanche' | 'Optimism';

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface ProjectStats {
  tvl?: string;
  users: string;
  transactions: string;
  growth: number;
}

export interface TokenInfo {
  symbol: string;
  address: string;
  price: string;
  marketCap: string;
  change24h: number;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  avatar: string;
  category: string;
  date: string;
  likes: number;
  comments: number;
  commentsList: Comment[];
  coverImage?: string;
  readTime?: string;
}

// Mock Project type for static data in constants.ts
export interface MockProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  category: ProjectCategory | string;
  tags: string[];
  stats: ProjectStats;
  rating: number;
  reviewCount: number;
  verified: boolean;
  team: TeamMember[];
  launchDate: string;
  chain: Chain | string;
  featured?: boolean;
  upvotes: number;
  screenshots: string[];
  tokenInfo?: TokenInfo;
  reviews: Review[];
  auditUrl?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  github?: string;
}

// Convex Project type that matches the schema
export interface Project {
  _id: Id<"projects">;
  _creationTime: number;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  coverImage: string;
  category: string;
  tags: string[];
  chain: string;
  launchDate: string;
  verified: boolean;
  featured?: boolean;
  
  // Stats
  tvl?: string;
  users: string;
  transactions: string;
  growth: number;
  
  // Token info (optional)
  tokenSymbol?: string;
  tokenAddress?: string;
  tokenPrice?: string;
  tokenMarketCap?: string;
  tokenChange24h?: number;
  
  // Links
  website?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  auditUrl?: string;
  
  // Owner
  ownerWallet: string;
  
  // Aggregated counts
  upvoteCount: number;
  reviewCount: number;
  averageRating: number;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
  
  // Storage IDs (optional)
  logoStorageId?: Id<"_storage">;
  coverImageStorageId?: Id<"_storage">;
}

// Convex ForumPost type that matches the schema
export interface ConvexForumPost {
  _id: Id<"forumPosts">;
  _creationTime: number;
  title: string;
  excerpt: string;
  content: string;
  authorWallet: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  coverImage?: string;
  coverImageStorageId?: Id<"_storage">;
  readTime?: string;
  createdAt: number;
  likeCount: number;
  commentCount: number;
}

export interface User {
  address: string;
  isConnected: boolean;
  balance: string;
}

export type ViewState = 'home' | 'search' | 'details' | 'submit' | 'governance' | 'blog' | 'docs' | 'brand' | 'profile';
