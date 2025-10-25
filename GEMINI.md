# Project: Web3 Showcase Platform

## Project Overview

This project is a modern, feature-rich platform for discovering and showcasing Web3 projects. It is built with Next.js 15, TypeScript, and Tailwind CSS, with Supabase as the backend and database. The platform allows users to browse, search, and submit Web3 projects, manage their projects through a personal dashboard, and explore projects by category.

## Key Technologies

*   **Framework:** Next.js 15 (with App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with Radix UI for headless components
*   **Backend & Database:** Supabase (PostgreSQL)
*   **Authentication:** NextAuth.js
*   **Linting:** ESLint
*   **Package Manager:** npm

## Project Structure

The project follows a standard Next.js App Router structure:

*   `src/app/`: Contains the application's pages and API routes.
    *   `src/app/api/`: API routes for handling backend logic.
    *   `src/app/(auth)/`: Authentication-related pages.
    *   `src/app/dashboard/`: User dashboard.
    *   `src/app/projects/`: Pages for displaying and submitting projects.
*   `src/components/`: Reusable React components.
    *   `src/components/ui/`: Base UI components from Radix UI.
*   `src/lib/`: Utility functions and libraries, including Supabase client configuration (`supabase.ts`) and NextAuth.js setup (`auth.ts`).
*   `supabase/`: Contains the database schema (`schema.sql`) and migrations.

## Building and Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the necessary environment variables for Supabase and NextAuth.js. Refer to the `README.md` for a complete list of required variables.

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

### 5. Start the Production Server

```bash
npm run start
```

### 6. Lint the Code

```bash
npm run lint
```

## Development Conventions

*   **TypeScript:** The entire codebase is written in TypeScript, ensuring type safety.
*   **ESLint:** Code linting is enforced using ESLint.
*   **Component-based Architecture:** The frontend is built using a component-based architecture with reusable components in `src/components/`.
*   **Database:** The database schema is managed through SQL files in the `supabase/` directory. The main tables are `users`, `projects`, `categories`, and `project_tags`.
*   **Authentication:** Authentication is handled by NextAuth.js, with custom session and user types defined in `src/lib/auth.ts`.
*   **Environment Variables:** All secret keys and environment-specific configurations are managed through a `.env.local` file.
