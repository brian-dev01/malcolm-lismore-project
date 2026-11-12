# Malcolm Lismore Photography — Full-Stack Application

**Unit 10: Web Design & Development | BTEC Higher National**  
**Student:** B P K Kulasuriya (E193540)

A full-stack photographer portfolio and assignment audit dashboard built with React, Node.js/Express, and Supabase.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + TypeScript + Vite        |
| Styling    | Tailwind CSS 3.4 (custom theme)     |
| Backend    | Node.js + Express + TypeScript      |
| Database   | Supabase (PostgreSQL + RLS)         |
| Validation | Zod                                 |
| Icons      | Lucide React                        |

## Features

### Photographer Website
- Hero landing page with featured work and testimonials
- Filterable portfolio gallery with lightbox
- Service packages with pricing
- Contact form with validation
- Booking system
- SEO-optimised meta tags

### Assignment Audit Dashboard
- Real-time criterion status tracking (LO1–LO4)
- Blocker identification with visual indicators
- Interactive status updates (dropdown per criterion)
- Fix activity log
- Completion rate progress bars
- Verdict banner with dynamic colouring

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** → choose a name and region
3. Wait for the project to provision (~2 minutes)

### 2. Run the Database Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql` and paste it
4. Click **Run** — this creates all 9 tables, RLS policies, indexes, and seed data

### 3. Get Your API Keys

1. Go to **Settings → API** in Supabase Dashboard
2. Copy the **Project URL** and both keys:
   - `anon` (public) key → for the client
   - `service_role` (secret) key → for the server

### 4. Configure Environment Variables

```bash
# From the project root
cp .env.example server/.env
cp .env.example client/.env
```

Edit `server/.env`:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Edit `client/.env`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key
```

### 5. Install Dependencies

From the project root, install all project dependencies:

```bash
npm run install:all
```

### 6. Start Development Servers

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
The backend Swagger UI is available at `http://localhost:5001/api-docs` (or `http://localhost:<PORT>/api-docs` if `PORT` is set).

---

## Project Structure

```
malcolm-lismore-project/
├── supabase/
│   └── schema.sql          # Database schema + seed data
├── server/
│   ├── src/
│   │   ├── index.ts         # Express entry point
│   │   ├── supabase.ts      # Supabase client singleton
│   │   └── routes/
│   │       ├── portfolio.ts # Portfolio + categories API
│   │       ├── services.ts  # Services + testimonials API
│   │       ├── contact.ts   # Contact + bookings API
│   │       └── audit.ts     # Audit dashboard API
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── src/
│   │   ├── main.tsx         # React entry
│   │   ├── App.tsx          # Routes
│   │   ├── index.css        # Tailwind + custom classes
│   │   ├── types/index.ts   # TypeScript interfaces
│   │   ├── lib/supabase.ts  # Frontend Supabase client
│   │   ├── hooks/useApi.ts  # Generic data-fetching hook
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx
│   │   │       └── Footer.tsx
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Portfolio.tsx
│   │       ├── Services.tsx
│   │       ├── About.tsx
│   │       ├── Contact.tsx
│   │       └── Dashboard.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── .env.example
└── README.md
```

## Design Patterns Used

- **Repository Pattern** — Supabase client abstraction
- **Observer Pattern** — React state via `useApi` hook
- **Container/Presentational** — Dashboard page architecture
- **Modular Router** — Express route separation
- **Singleton** — Supabase client instances
- **Strategy Pattern** — Icon mapping in Services

## API Endpoints

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | /api/portfolio            | List portfolio images            |
| GET    | /api/portfolio/featured   | Featured images only             |
| GET    | /api/categories           | Image categories                 |
| GET    | /api/services             | Active services                  |
| GET    | /api/testimonials         | Approved testimonials            |
| GET    | /api/settings             | Site configuration               |
| POST   | /api/contact              | Submit contact form              |
| POST   | /api/bookings             | Create a booking                 |
| GET    | /api/audit/criteria       | Audit criteria (?lo=LO3)         |
| GET    | /api/audit/summary        | Aggregated audit stats           |
| PATCH  | /api/audit/criteria/:id   | Update criterion status          |
| GET    | /api/audit/log            | Recent fix activity              |
| GET    | /health                   | Server health check              |

---

Built for BTEC HN Unit 10 — Web Design & Development Assessment
