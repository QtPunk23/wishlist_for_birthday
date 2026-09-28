# 🚀 Render Deployment Guide

This guide walks you through deploying the Birthday Wishlist app as a single service on Render.

## Architecture

After deployment, a single Render web service will serve:
- **Frontend** (guest app) at `https://your-app.onrender.com/`
- **Admin** (birthday girl's panel) at `https://your-app.onrender.com/admin`
- **API** at `https://your-app.onrender.com/api`

## Prerequisites

- A [Render](https://render.com) account (free tier works)
- Your code pushed to a GitHub/GitLab repository
- Node.js 20+ (for local testing)

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Prepare for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/birthday-wishlist.git
git push -u origin main
```

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `birthday-wishlist` |
| **Environment** | `Node` |
| **Build Command** | `cd backend && npm install && npm run build` |
| **Start Command** | `cd backend && npm start` |
| **Plan** | `Free` |

5. Click **Create Web Service**

### 3. How It Works

The `render.yaml` blueprint file in the repo root can also be used for infrastructure-as-code deployment:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your repository
4. Render will automatically detect `render.yaml` and configure everything

### 4. Verify Deployment

Once deployed, check these URLs:

| URL | Expected Result |
|-----|-----------------|
| `https://your-app.onrender.com/` | Frontend loads (guest view) |
| `https://your-app.onrender.com/admin` | Admin panel loads |
| `https://your-app.onrender.com/api/health` | `{"status":"ok","timestamp":"..."}` |
| `https://your-app.onrender.com/api/gifts` | List of gifts (JSON) |

## What Happens Automatically

1. **Build phase**: Render runs `cd backend && npm install && npm run build`
   - Installs backend dependencies
   - Builds frontend (`cd ../frontend && npm install && npm run build`)
   - Builds admin (`cd ../admin && npm install && npm run build`)
2. **Start phase**: Render runs `cd backend && npm start`
   - Server starts on the port Render provides (via `PORT` env var)
   - Database is initialized automatically
   - If the database is empty, seed data is inserted automatically
   - Static files are served from `frontend/dist` and `admin/dist`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port (Render sets this automatically) |
| `NODE_VERSION` | `20.11.0` | Node.js version (set in render.yaml) |

## Troubleshooting

### Build fails
- Make sure `render.yaml` is in the repo root
- Check that all `package.json` files are committed
- Verify Node.js version compatibility

### Database not seeding
- The server auto-seeds on startup if the `gifts` table is empty
- You can manually trigger seeding via `POST /api/seed`

### Static files not loading
- Ensure the build command completed successfully
- Check that `frontend/dist/index.html` and `admin/dist/index.html` exist

### Port issues
- Always use `process.env.PORT` — Render assigns a dynamic port
- Never hardcode the port in production

## Local Production Test

Test the production setup locally before deploying:

```bash
# From the backend directory
cd backend
npm install
npm run build
npm start
```

Then open http://localhost:3000 (frontend) and http://localhost:3000/admin (admin).
