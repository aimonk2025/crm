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
   git clone https://github.com/aimonk2025/simple-crm.git
   cd simple-crm
   pnpm install
   ```

2. **Set up Supabase** (see detailed instructions below)

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) and create an account.

---

## Supabase Setup (Step-by-Step)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **New Project**
3. Enter a project name (e.g., "simplecrm")
4. Set a strong database password (save this!)
5. Select a region close to you
6. Click **Create new project** and wait for it to be ready

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Project Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy these values:

| Key | Where to find it | What it's for |
|-----|------------------|---------------|
| **Project URL** | Under "Project URL" | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon/public key** | Under "Project API keys" | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role key** | Under "Project API keys" (click reveal) | `SUPABASE_SERVICE_ROLE_KEY` |

> **Note:** The `service_role` key is secret - never expose it in client-side code!

### Step 3: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Run each migration file **in order**:

**Migration 1: Core Tables**
- Open `supabase/migrations/001_initial_schema.sql` from this repo
- Copy the entire contents
- Paste into SQL Editor and click **Run**

**Migration 2: Row Level Security (RLS)**
- Open `supabase/migrations/002_rls_policies.sql`
- Copy, paste, and **Run**

**Migration 3: Timeline Triggers**
- Open `supabase/migrations/003_timeline_triggers.sql`
- Copy, paste, and **Run**

**Migration 4: Tags & Custom Fields**
- Open `supabase/migrations/004_free_enhancements.sql`
- Copy, paste, and **Run**

> **Tip:** You can also run `supabase/complete_schema.sql` which contains all migrations in one file.

### Step 4: Enable Email Authentication

1. Go to **Authentication** in the left sidebar
2. Click **Providers**
3. Make sure **Email** is enabled (it should be by default)
4. (Optional) Configure SMTP for production email delivery under **SMTP Settings**

### Step 5: Configure Environment Variables

Create `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values from Step 2.

### Step 6: Verify Setup

1. Start the dev server: `pnpm dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click **Register** and create an account
4. If you can log in successfully, Supabase is configured correctly!

---

## Database Schema

SimpleCRM creates these tables:

| Table | Purpose |
|-------|---------|
| `customers` | Customer records with name, phone, email, status |
| `notes` | Text notes attached to customers |
| `payments` | Payment records with amount, date, mode |
| `follow_ups` | Scheduled follow-up reminders |
| `timeline_events` | Activity history for each customer |
| `tags` | User-defined colored tags |
| `customer_tags` | Links customers to tags (many-to-many) |
| `custom_fields` | User-defined field definitions |
| `custom_field_values` | Field values for each customer |

All tables have **Row Level Security (RLS)** enabled - users can only access their own data.

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

### Other Platforms

SimpleCRM works on any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- Self-hosted with Docker

---

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

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Important:** Send pull requests to the `dev` branch, not `main`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Open an issue for bug reports or feature requests
- Star the repo if you find it useful

---

Made with care for small businesses.
