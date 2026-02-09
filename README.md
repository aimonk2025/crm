# SimpleCRM

A simple, self-hosted customer memory system for small businesses.

## Tech Stack

<p align="center">
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://supabase.com">
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
</p>

Built with Next.js 16.1, React 19, Supabase, and Tailwind CSS.

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

## Integrating Your Website Forms

Connect your existing website forms to SimpleCRM to automatically capture leads.

### API Endpoint

```
POST https://your-crm-domain.com/api/leads
Content-Type: application/json

{
  "name": "John Doe",           // Required
  "phone": "+91999999999",      // Required
  "email": "john@example.com",  // Optional
  "message": "I need help..."   // Optional
}
```

### Response

| Status | Response |
|--------|----------|
| 200 | `{ "success": true }` |
| 409 | `{ "error": "This phone number is already registered" }` |
| 400 | `{ "error": "Invalid form data" }` |

---

### React / Next.js Integration

Add this to your existing contact form:

```jsx
async function handleSubmit(e) {
  e.preventDefault();

  const response = await fetch('https://your-crm-domain.com/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    }),
  });

  if (response.ok) {
    // Show success message
  }
}
```

### HTML / Vanilla JavaScript Integration

```html
<form id="contact-form">
  <input type="text" name="name" required>
  <input type="tel" name="phone" required>
  <input type="email" name="email">
  <textarea name="message"></textarea>
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  await fetch('https://your-crm-domain.com/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      message: form.message.value,
    }),
  });

  alert('Thank you! We will contact you soon.');
});
</script>
```

---

### Using Claude Code to Integrate

If you're using **Claude Code** or **Cursor**, simply tell it:

> "Connect my contact form to SimpleCRM. The API endpoint is `https://my-crm.vercel.app/api/leads` and it needs name, phone, email, and message fields."

Claude Code will:
1. Find your existing form component
2. Add the API call to your form handler
3. Handle success/error states

**Example prompt:**
```
I have a contact form in src/components/ContactForm.tsx.
Connect it to my SimpleCRM at https://my-crm.vercel.app/api/leads.
The form already has name, phone, email, and message fields.
Add loading state and success/error handling.
```

---

### What Happens When a Lead is Submitted?

1. A new **customer** is created with status "New"
2. Source is automatically set to "website"
3. If a message is provided, it's saved as a **note**
4. The lead appears in your CRM dashboard immediately

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

## Tech Stack Details

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1 (App Router, Turbopack) |
| **Frontend** | React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **State** | TanStack Query |
| **Forms** | React Hook Form + Zod |
| **Deployment** | Vercel, Railway, or self-hosted |

## Documentation

Visit `/docs` in the app for detailed documentation on:
- Installation and setup
- Database schema
- Environment variables
- Feature guides

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**Important:** Send pull requests to the `dev` branch, not `main`.

### Branch Protection

This repository has branch protection configured:

- **`main` branch** - Protected branch, requires pull requests from collaborators
  - Only the repository owner can push directly
  - No force pushes allowed
  - Branch cannot be deleted

- **`dev` branch** - Default development branch
  - All feature development happens here
  - Pull requests from `dev` to `main` for releases

**Workflow for contributors:**
1. Fork the repository
2. Create a feature branch from `dev`
3. Submit a pull request to `dev` (not `main`)
4. After review, changes will be merged to `dev`
5. Repository owner periodically merges `dev` to `main` for releases

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Open an issue for bug reports or feature requests
- Star the repo if you find it useful

---

Made with care for small businesses.
