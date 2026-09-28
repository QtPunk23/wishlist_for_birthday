import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDatabase, default as db } from './db/database.js'
import { seed } from './seed.js'
import giftsRouter from './routes/gifts.js'
import claimsRouter from './routes/claims.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize database
initDatabase()

// Auto-seed if database is empty
const giftCount = db.prepare('SELECT COUNT(*) as count FROM gifts').get()
if (giftCount.count === 0) {
  console.log('Database is empty, seeding...')
  seed()
}

// API Routes
app.use('/api/gifts', giftsRouter)
app.use('/api/claims', claimsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Seed endpoint (manual trigger)
app.post('/api/seed', (req, res) => {
  seed()
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
