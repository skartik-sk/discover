# Web3 Showcase Platform 🚀

A modern, feature-rich platform for discovering and showcasing Web3 projects. Built with Next.js 15, TypeScript, Tailwind CSS, and powered by Supabase.

## ✨ Features

### 🎯 Core Functionality
- **Project Discovery**: Browse and search through Web3 projects across different categories
- **Project Submission**: Submit your own Web3 projects to get discovered
- **User Authentication**: Secure authentication system with NextAuth.js
- **Dashboard**: Personal dashboard to track your projects and statistics
- **Category Browsing**: Explore projects organized by categories (DeFi, NFT, Gaming, DAO, etc.)
- **Tag System**: Organize projects with customizable tags

### 🎨 Design & UX
- **Modern UI**: Beautiful, responsive design using Tailwind CSS and Radix UI components
- **Dark/Light Theme**: Custom theme support with smooth transitions
- **Animations**: Subtle animations and micro-interactions for better user experience
- **Accessibility**: Built with accessibility in mind using semantic HTML and ARIA labels
- **Mobile Responsive**: Fully responsive design that works on all devices

### 🛠 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Server Components**: Leveraging Next.js 15 App Router and Server Components
- **Database**: PostgreSQL with Supabase for real-time data
- **File Uploads**: Support for project logos and assets
- **SEO Optimized**: Built-in SEO optimization with meta tags and structured data
- **Performance**: Optimized build with Turbopack and lazy loading

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **NextAuth.js** - Authentication solution
- **Prisma** - Database ORM (via Supabase client)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundler and dev server

## 📦 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── categories/        # Category pages
│   ├── dashboard/         # User dashboard
│   ├── projects/          # Project pages
│   └── ...
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   └── ...
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client configuration
│   ├── auth.ts           # Authentication utilities
│   └── ...
└── types/                # TypeScript type definitions
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/web3-showcase.git
cd web3-showcase
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: OAuth Providers (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Web3 Wallet Configuration
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

#### Getting Environment Variables:
1. **Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Navigate to Settings > API to get your URL and keys
2. **NextAuth.js**:
   - Generate a secret: `openssl rand -base64 32`
3. **OAuth Providers**:
   - Create OAuth apps in respective provider dashboards

### 4. Database Setup
1. Run the Supabase migrations in the `supabase/` directory:
   - Navigate to your Supabase project > SQL Editor
   - Run the SQL files in order:
     - `001_initial_schema.sql`
     - `users_table.sql` (if separate)

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Key Features Explained

### Project Submission
Users can submit their Web3 projects with:
- Project title and description
- Logo/image uploads
- Website and GitHub links
- Category selection
- Custom tags
- Featured project options

### User Dashboard
Personal dashboard showing:
- Submitted projects
- View statistics
- Project engagement metrics
- Profile management

### Categories & Discovery
Browse projects by categories:
- DeFi (Decentralized Finance)
- NFT (Non-Fungible Tokens)
- Gaming
- DAO (Decentralized Autonomous Organizations)
- Infrastructure
- Education
- And more...

### Authentication System
Secure authentication with:
- Email/password login
- OAuth provider support (Google, GitHub, etc.)
- Session management
- Protected routes

## 🔧 Configuration

### Database Schema
The application uses the following main tables:
- `projects` - Project information and metadata
- `users` - User profiles and authentication data
- `categories` - Project categories
- `project_tags` - Tag relationships for projects
- `project_views` - Analytics tracking

### Customization
- **Theme**: Modify Tailwind CSS configuration in `tailwind.config.js`
- **Components**: Extend UI components in `src/components/ui/`
- **API**: Add new API routes in `src/app/api/`
- **Database**: Update schema via Supabase migrations

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with build command `npm run build`
- **Railway**: Full-stack deployment with database
- **DigitalOcean App Platform**: Container-based deployment

### Environment Variables for Production
Ensure all environment variables are set in your hosting platform:
- Supabase URL and keys
- NextAuth.js URL and secret
- Any OAuth provider credentials
- Next.js build settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic HTML and accessibility standards
- Write meaningful commit messages
- Test your changes before submitting PRs
- Follow the existing code style and patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Join our community discussions

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [Documentation](./docs/)
- [API Reference](./docs/api.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)
- UI components by [Radix UI](https://www.radix-ui.com/)

---

**Built with ❤️ for the Web3 community**