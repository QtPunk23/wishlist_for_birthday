import { Router } from 'express'
import { claimGift, unclaimGift } from '../db/database.js'

const router = Router()

// Claim a gift
router.post('/', async (req, res) => {
  const { giftId, guestName } = req.body

  if (!giftId || !guestName) {
    return res.status(400).json({ error: 'giftId and guestName are required' })
  }

  try {
    const gift = await claimGift(giftId, guestName)
    if (!gift) {
      return res.status(400).json({ error: 'Gift is already claimed or not found' })
    }
    res.json({ success: true, gift })
  } catch (error) {
    console.error('Error claiming gift:', error)
    res.status(500).json({ error: 'Failed to claim gift' })
  }
})

// Unclaim a gift
router.delete('/:giftId', async (req, res) => {
  const { guestName } = req.body
  const { giftId } = req.params

  if (!guestName) {
    return res.status(400).json({ error: 'guestName is required' })
  }

  try {
    const gift = await unclaimGift(giftId, guestName)
    if (!gift) {
      return res.status(403).json({ error: 'You have not claimed this gift' })
    }
    res.json({ success: true, gift })
  } catch (error) {
    console.error('Error unclaiming gift:', error)
    res.status(500).json({ error: 'Failed to unclaim gift' })
  }
})

export default router
