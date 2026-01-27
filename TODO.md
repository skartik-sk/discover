# DISCOVER - Web3 Showcase Platform Implementation TODO

## Project Info
- **Convex URL**: https://courteous-jaguar-161.convex.cloud
- **AppKit Project ID**: 2b47d373840058d795b3a338738d0fe4
- **Target**: Full Convex backend integration with AppKit wallet authentication

---

## Phase 1: Setup & Dependencies ⏳
- [ ] Install dependencies (convex, appkit, wagmi, viem, tanstack-query, image-compression)
- [ ] Initialize Convex project
- [ ] Configure environment variables (.env.local)
- [ ] Update package.json scripts

## Phase 2: Database Schema 📊
- [ ] Create convex/schema.ts with all tables
  - [ ] users table
  - [ ] projects table
  - [ ] teamMembers table
  - [ ] screenshots table
  - [ ] upvotes table
  - [ ] reviews table
  - [ ] forumPosts table
  - [ ] postLikes table
  - [ ] comments table
  - [ ] commentLikes table
  - [ ] subscriptions table
- [ ] Add indexes for efficient queries
- [ ] Add rate-limiting fields

## Phase 3: Convex Backend Functions 🔧

### convex/users.ts
- [ ] getByWallet - Get user by wallet address
- [ ] createOrUpdate - Upsert user on connect
- [ ] updateProfile - Update display name/avatar
- [ ] getStats - Get user stats (projects, reviews, upvotes)

### convex/projects.ts
- [ ] list - Get all projects with filtering
- [ ] get - Get single project by ID
- [ ] create - Create new project (owner only)
- [ ] update - Update project (owner only)
- [ ] toggleUpvote - Upvote/un-upvote project
- [ ] hasUpvoted - Check if user has upvoted
- [ ] getFeatured - Get featured projects
- [ ] getByCategory - Filter by category
- [ ] getUserProjects - Get projects by owner wallet

### convex/forum.ts
- [ ] listPosts - Get all forum posts
- [ ] getPost - Get single post with comments
- [ ] createPost - Create new post (rate limited)
- [ ] togglePostLike - Like/unlike post
- [ ] addComment - Add comment to post (rate limited)
- [ ] toggleCommentLike - Like/unlike comment
- [ ] getUserPosts - Get posts by user

### convex/reviews.ts
- [ ] getForProject - Get all reviews for project
- [ ] add - Add new review (1 per project per user)
- [ ] update - Update own review
- [ ] delete - Delete own review
- [ ] getUserReviews - Get reviews by user

### convex/files.ts
- [ ] generateUploadUrl - Get URL for file upload
- [ ] saveFileReference - Save file storage ID
- [ ] getUrl - Get URL for stored file

### convex/subscriptions.ts
- [ ] subscribe - Add email to newsletter
- [ ] unsubscribe - Remove email
- [ ] checkSubscription - Check if email exists

## Phase 4: Seed Data 🌱
- [ ] Create convex/seed.ts
- [ ] Add 10 real Web3 projects:
  - [ ] Uniswap (DeFi)
  - [ ] Aave (DeFi)
  - [ ] OpenSea (NFT)
  - [ ] Lens Protocol (Social)
  - [ ] Chainlink (Infrastructure)
  - [ ] The Graph (Infrastructure)
  - [ ] Arbitrum One (Infrastructure)
  - [ ] Base (Infrastructure)
  - [ ] Axie Infinity (Gaming)
  - [ ] MakerDAO (DAO)
- [ ] Add sample forum posts
- [ ] Add sample reviews
- [ ] Run seed function

## Phase 5: Wallet Authentication (AppKit) 🔐
- [ ] Create src/lib/wagmi.ts - Wagmi config with AppKit
- [ ] Create src/lib/convex.ts - Convex client setup
- [ ] Create src/hooks/useAuth.ts - Wallet auth hook
- [ ] Update Navbar.tsx with AppKit connect button
- [ ] Add wallet address display
- [ ] Add disconnect functionality

## Phase 6: Page Integration 📄

### index.tsx
- [ ] Add ConvexProvider
- [ ] Add WagmiProvider
- [ ] Add QueryClientProvider
- [ ] Wrap App with all providers

### App.tsx
- [ ] Update routing to support profile page
- [ ] Change selectedProject to use ID instead of object

### Home.tsx
- [ ] Replace MOCK_PROJECTS with useQuery(api.projects.list)
- [ ] Update featured projects logic
- [ ] Add real-time upvote updates

### SearchProjects.tsx
- [ ] Use Convex query with filters
- [ ] Implement category filtering
- [ ] Implement chain filtering
- [ ] Implement search functionality

### ProjectDetails.tsx
- [ ] Use useQuery(api.projects.get) for project data
- [ ] Implement real upvote mutation
- [ ] Display real reviews
- [ ] Add review submission
- [ ] Show similar projects
- [ ] Add edit button (owner only)

### SubmitProject.tsx
- [ ] Check wallet connection before submit
- [ ] Implement file upload for logo/cover
- [ ] Implement screenshot uploads
- [ ] Use mutation to create project
- [ ] Add image compression (< 1MB)
- [ ] Add success/error handling
- [ ] Redirect after successful submission

### Forum.tsx
- [ ] Use Convex queries for posts
- [ ] Implement post creation (wallet required)
- [ ] Implement comment addition (wallet required)
- [ ] Add like/unlike functionality
- [ ] Implement rate limiting (1-2 posts per wallet)
- [ ] Show user's posts in profile

### ProfilePage.tsx (NEW)
- [ ] Create new profile page component
- [ ] Display wallet address & stats
- [ ] Show user's submitted projects
- [ ] Show user's reviews
- [ ] Show user's upvoted projects
- [ ] Add edit profile modal
- [ ] Add avatar upload

## Phase 7: Component Updates 🎨

### Navbar.tsx
- [ ] Replace mock wallet with AppKit button
- [ ] Add profile link when connected
- [ ] Show wallet address (truncated)

### ProjectCard.tsx
- [ ] Handle Convex data types
- [ ] Update prop types for IDs

### TopLaunches.tsx
- [ ] Use useQuery(api.projects.getFeatured)
- [ ] Update to use real data

### WeeklyDigest.tsx
- [ ] Use useMutation(api.subscriptions.subscribe)
- [ ] Add success/error messages
- [ ] Validate email format

### WriteReviewModal.tsx
- [ ] Check wallet connection
- [ ] Use useMutation(api.reviews.add)
- [ ] Add success feedback
- [ ] Close modal after submission

### ImageUpload.tsx (NEW)
- [ ] Create reusable image upload component
- [ ] Add image compression
- [ ] Validate file size (< 1MB after compression)
- [ ] Show preview
- [ ] Handle multiple images for screenshots

## Phase 8: Rate Limiting & Validation 🛡️
- [ ] Forum post limit: 2 per wallet per day
- [ ] Comment limit: 5 per wallet per day
- [ ] Review limit: 1 per project per wallet
- [ ] Image size validation: < 1MB after compression
- [ ] Input validation for all forms
- [ ] Error messages for rate limits

## Phase 9: Testing & Cleanup 🧪
- [ ] Test wallet connection/disconnection
- [ ] Test project creation/editing
- [ ] Test upvoting
- [ ] Test reviews
- [ ] Test forum posts/comments
- [ ] Test file uploads
- [ ] Test rate limiting
- [ ] Remove constants.ts mock data
- [ ] Test real-time updates
- [ ] Error handling for all mutations
- [ ] Loading states for all queries

## Phase 10: Final Polish ✨
- [ ] Update PLAN.md with completion status
- [ ] Add README instructions for running the app
- [ ] Document environment variables needed
- [ ] Test full user flow end-to-end
- [ ] Verify all features work on production Convex deployment

---

## Notes
- Use `bun` for all package management and scripts
- Images stored in Convex File Storage
- Auto-compress images before upload
- Show error if image still > 1MB after compression
- Projects visible immediately after submission
- Owner can edit all project fields (must be same wallet)
- No moderation for forum, but rate limiting applied
- Real-time: upvotes & comments
- Non-real-time: new projects (appear after refresh)

## Environment Variables Needed
```env
VITE_CONVEX_URL=https://courteous-jaguar-161.convex.cloud
VITE_WALLETCONNECT_PROJECT_ID=2b47d373840058d795b3a338738d0fe4
```
