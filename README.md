# SimpleCRM

A simple, self-hosted customer memory system for small businesses.

Built with Next.js 16, React 19, Supabase, and Tailwind CSS.

## Features

- **Customer Management** - Track customers with status, notes, and complete history
- **Tags & Labels** - Organize customers with custom color-coded tags
- **Custom Fields** - Add custom fields to capture business-specific data
- **Follow-ups** - Schedule and track follow-up tasks with reminders
- **Payment Tracking** - Record payments and track totals per customer
- **Public Lead Form** - Embed a form on your website to capture leads
- **Dashboard** - Get an overview of your business at a glance
- **Data Export** - Export your customer data to CSV anytime
- **Mobile Friendly** - Works great on phones and tablets
- **Self-Hosted** - Your data stays on your own infrastructure

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/simplecrm.git
   cd simplecrm
   pnpm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the migration files from `supabase/migrations/` in the SQL Editor
   - Enable Email authentication in Authentication > Providers

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) and create an account.

## Database Setup

Run these migration files in order in your Supabase SQL Editor:

1. `supabase/migrations/001_initial_schema.sql` - Core tables
2. `supabase/migrations/002_timeline_fix.sql` - Timeline improvements
3. `supabase/migrations/003_form_token.sql` - Lead form token
4. `supabase/migrations/004_free_enhancements.sql` - Tags and custom fields

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in project settings
4. Deploy

### Other Platforms

SimpleCRM works on any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- Self-hosted with Docker

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod

## Documentation

Visit `/docs` in the app for detailed documentation on:
- Installation and setup
- Database schema
- Environment variables
- Feature guides

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Open an issue for bug reports or feature requests
- Star the repo if you find it useful

---

Made with care for small businesses.
