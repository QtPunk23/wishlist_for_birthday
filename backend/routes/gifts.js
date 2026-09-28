import { Router } from 'express'
import { nanoid } from 'nanoid'
import db from '../db/database.js'

const router = Router()

// Get all gifts (for guests - status only, no claimed_by name)
router.get('/', (req, res) => {
  const gifts = db.prepare('SELECT id, name, description, url, category, claimed_by FROM gifts').all()
  const result = gifts.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description,
    url: g.url,
    category: g.category,
    status: g.claimed_by ? 'claimed' : 'available',
  }))
  res.json(result)
})

// Get all gifts with claim info (for admin)
router.get('/admin', (req, res) => {
  const gifts = db.prepare('SELECT * FROM gifts').all()
  res.json(gifts)
})

// Get a single gift by ID
router.get('/:id', (req, res) => {
  const gift = db.prepare('SELECT id, name, description, url, category, claimed_by FROM gifts WHERE id = ?').get(req.params.id)

  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' })
  }

  res.json({
    id: gift.id,
    name: gift.name,
    description: gift.description,
    url: gift.url,
    category: gift.category,
    status: gift.claimed_by ? 'claimed' : 'available',
  })
})

// Add new gift (admin only)
router.post('/', (req, res) => {
  const { name, description, url, category } = req.body
  const id = nanoid()

  db.prepare('INSERT INTO gifts (id, name, description, url, category) VALUES (?, ?, ?, ?, ?)')
    .run(id, name, description, url, category)

  res.status(201).json({ id, name, description, url, category })
})

// Delete gift (admin only)
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM gifts WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

export default router
