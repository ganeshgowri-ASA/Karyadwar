# Karyadwar - Manufacturing Intranet Portal

## Project Overview
This is a Manufacturing Intranet Portal clone (Sanskrit: Karyadwar = Work Gateway).
Replicating Reliance MFG Portal with Next.js 14+ App Router, Vercel deployment, Railway PostgreSQL.

## Tech Stack
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL (Railway)
- Auth: NextAuth.js (credentials + domain ID)
- ORM: Prisma
- Deployment: Vercel (auto-deploy from main)

## Branch Strategy
- main: production (Vercel auto-deploys)
- develop: integration branch
- feature/*: individual feature branches -> PR to develop

## Key Commands
- npm run dev: Start development server
- npx prisma migrate dev: Run database migrations
- npx prisma studio: Open Prisma Studio
- npm run build: Production build
- npm run lint: Run ESLint

## Database
- Railway PostgreSQL - connection string in .env as DATABASE_URL
- Tables: users, sites, applications, favorites, announcements, emergency_numbers, carousel_images, ticker_items, employee_events, approval_settings, admin_access

## Architecture Notes
- 3-column layout: Left sidebar (apps), Center (carousel), Right (announcements/events)
- Multi-site support: 12+ manufacturing sites with site-specific content
- A-Z indexed application lists with search/filter
- Accordion sidebar with My Favorites, Enterprise Apps, Local Apps
- Role-based admin panel with 7 admin functions
- SSO-style auth with UID token propagation
- Ticker/marquee for announcements
- Birthday/Long Service employee cards with pagination

## Feature Branches & Session Plan
1. feature/database-schema - Prisma schema, migrations, seed data
2. feature/auth-system - NextAuth, login, session management
3. feature/navigation - Top nav, site selector, admin dropdown
4. feature/applications-sidebar - Accordion, A-Z filter, search, favorites
5. feature/carousel - Image slider with admin management
6. feature/announcements - Ticker, announcement CRUD
7. feature/employee-events - Birthday/Long Service cards
8. feature/emergency-numbers - Emergency contacts page
9. feature/user-settings - Profile, password change
10. feature/admin-panel - All admin CRUD operations
11. feature/responsive-design - Mobile/tablet responsive layout
