# Birthday Wishlist - Cloudflare Workers Deployment

This guide explains how to deploy the birthday wishlist app using Cloudflare Workers + D1.

## Architecture

- **Cloudflare Worker**: Handles API routes and serves static files
- **D1 Database**: SQLite-compatible database for gift data
- **Frontend**: React SPA served from the worker's assets
- **Admin**: React SPA served from `/admin` path

## Prerequisites

1. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) installed and authenticated
2. Node.js 18+ installed
3. A Cloudflare account

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Create D1 Database

```bash
cd worker
npx wrangler d1 create birthday-wishlist
```

This will output a database ID. Update `wrangler.toml` with your database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "birthday-wishlist"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 3. Build Frontend and Admin

```bash
npm run build
```

This builds both frontend and admin, then copies admin into `frontend/dist/admin/`.

### 4. Deploy

```bash
npm run deploy
```

Or directly:

```bash
cd worker
npx wrangler deploy
```

## Local Development

### Start the Worker locally

```bash
cd worker
npx wrangler dev
```

The worker will be available at `http://localhost:8787`.

### Start frontend dev server (optional)

```bash
cd frontend
npm run dev
```

### Start admin dev server (optional)

```bash
cd admin
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/gifts` | List all gifts (guest view - no claimed_by) |
| GET | `/api/gifts/admin` | List all gifts with claim info |
| GET | `/api/gifts/:id` | Get single gift |
| POST | `/api/gifts` | Add new gift |
| DELETE | `/api/gifts/:id` | Delete gift |
| POST | `/api/claims` | Claim a gift |
| DELETE | `/api/claims/:giftId` | Unclaim a gift |
| POST | `/api/seed` | Seed database |

## Project Structure

```
birthday-wishlist/
├── backend/              # Legacy Express backend (for reference)
├── frontend/             # React frontend (Vite)
│   └── dist/            # Build output (served by worker)
│       └── admin/       # Admin SPA (copied here during build)
├── admin/               # React admin (Vite)
│   └── dist/            # Build output
├── worker/              # Cloudflare Worker
│   ├── src/
│   │   ├── index.js     # Main worker (fetch handler)
│   │   ├── db.js        # D1 database operations
│   │   └── seed.js      # Seed data
│   ├── wrangler.toml    # Worker configuration
│   └── package.json
├── scripts/
│   └── copy-admin.js    # Copies admin/dist to frontend/dist/admin
└── package.json
```

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS gifts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  category TEXT,
  status TEXT DEFAULT 'available',
  claimed_by TEXT,
  claimed_at TEXT
)
```

## Environment Variables

The worker uses the following environment variables (set in `wrangler.toml`):

- `ENVIRONMENT`: Environment name (default: `production`)

## CORS

The worker handles CORS preflight requests and includes appropriate headers on all responses. By default, all origins are allowed (`*`). To restrict origins, update the `corsHeaders` in `src/index.js`.

## Auto-Seeding

The worker automatically seeds the database on the first request if the `gifts` table is empty. You can also manually trigger seeding via `POST /api/seed`.

## Updating the Database ID

After creating your D1 database, you need to update the `database_id` in `wrangler.toml`. You can find your database ID in the Cloudflare dashboard or from the output of `wrangler d1 create`.

## Troubleshooting

### Worker fails to deploy

- Make sure you're logged in: `npx wrangler login`
- Check that your `wrangler.toml` is valid
- Verify your D1 database ID is correct

### Static files not loading

- Run `npm run build` to build frontend and admin
- Check that `frontend/dist/admin/` exists after build
- Verify the `assets` directory in `wrangler.toml` points to `../frontend/dist`

### Database errors

- Check that the D1 binding is correctly configured in `wrangler.toml`
- Verify the database exists in your Cloudflare dashboard
- Run `npx wrangler d1 execute birthday-wishlist --local --command "SELECT * FROM gifts"` to test
