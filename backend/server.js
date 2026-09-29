import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDatabase, seedDatabase } from './db/database.js'
import giftsRouter from './routes/gifts.js'
import claimsRouter from './routes/claims.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Disable caching for all responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  next()
})

// Initialize database
await initDatabase()

// Always seed on startup to ensure fresh data
console.log('Seeding database...')
await seedDatabase()

// API Routes
app.use('/api/gifts', giftsRouter)
app.use('/api/claims', claimsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Seed endpoint (manual trigger)
app.post('/api/seed', async (req, res) => {
  await seedDatabase()
  res.json({ success: true, message: 'Database seeded' })
})

// Serve static files from frontend/dist
const frontendDist = join(__dirname, '..', 'frontend', 'dist')
const adminDist = join(__dirname, '..', 'admin', 'dist')

app.use(express.static(frontendDist))

// Admin routes - serve admin SPA
app.get('/admin', (req, res) => {
  res.sendFile(join(adminDist, 'index.html'))
})

// Frontend SPA fallback - must be after API routes
app.get('*', (req, res) => {
  res.sendFile(join(frontendDist, 'index.html'))
})

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Frontend: http://localhost:${PORT}/`)
  console.log(`Admin: http://localhost:${PORT}/admin`)
  console.log(`API: http://localhost:${PORT}/api`)
})
