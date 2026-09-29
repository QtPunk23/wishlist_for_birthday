import { Router } from 'express'
import { getAllGifts, getGiftById, seedDatabase } from '../db/database.js'

const router = Router()

// Get all gifts
router.get('/', (req, res) => {
  try {
    const gifts = getAllGifts()
    res.json(gifts)
  } catch (error) {
    console.error('Error fetching gifts:', error)
    res.status(500).json({ error: 'Failed to fetch gifts' })
  }
})

// Get gift by ID
router.get('/:id', (req, res) => {
  try {
    const gift = getGiftById(req.params.id)
    if (!gift) {
      return res.status(404).json({ error: 'Gift not found' })
    }
    res.json(gift)
  } catch (error) {
    console.error('Error fetching gift:', error)
    res.status(500).json({ error: 'Failed to fetch gift' })
  }
})

// Seed database
router.post('/seed', (req, res) => {
  try {
    seedDatabase()
    res.json({ success: true, message: 'Database seeded' })
  } catch (error) {
    console.error('Error seeding database:', error)
    res.status(500).json({ error: 'Failed to seed database' })
  }
})

export default router
