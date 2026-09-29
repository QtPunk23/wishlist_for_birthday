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

// API Routes
app.use('/api/gifts', giftsRouter)
app.use('/api/claims', claimsRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Seed endpoint (manual trigger)
app.post('/api/seed', (req, res) => {
  seedDatabase()
  res.json({ success: true, message: 'Database seeded' })
})

// Serve static files from frontend/dist
const frontendDist = join(__dirname, '..', 'frontend', 'dist')

app.use(express.static(frontendDist))

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

// Start server first, then initialize database
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`)
  console.log(`Frontend: http://0.0.0.0:${PORT}/`)
  console.log(`API: http://0.0.0.0:${PORT}/api`)

  try {
    console.log('Initializing database...')
    initDatabase()
    console.log('Database initialized')

    console.log('Seeding database...')
    seedDatabase()
    console.log('Database seeded')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
})
