import { Router } from 'express'
import db from '../db/database.js'

const router = Router()

// Claim a gift
router.post('/', (req, res) => {
  const { giftId, guestName } = req.body

  const gift = db.prepare('SELECT * FROM gifts WHERE id = ?').get(giftId)

  if (!gift) {
    return res.status(404).json({ error: 'Gift not found' })
  }

  if (gift.status === 'claimed') {
    return res.status(400).json({ error: 'Gift already claimed' })
  }

  db.prepare('UPDATE gifts SET status = ?, claimed_by = ?, claimed_at = ? WHERE id = ?')
    .run('claimed', guestName, new Date().toISOString(), giftId)

  res.json({ success: true, message: 'Gift claimed!' })
})

// Unclaim a gift (guest can unclaim their own)
router.delete('/:giftId', (req, res) => {
  const { giftId } = req.params
  const { guestName } = req.body

  const gift = db.prepare('SELECT * FROM gifts WHERE id = ?').get(giftId)

  if (!gift || gift.claimed_by !== guestName) {
    return res.status(403).json({ error: 'Not authorized' })
  }

  db.prepare('UPDATE gifts SET status = ?, claimed_by = ?, claimed_at = ? WHERE id = ?')
    .run('available', null, null, giftId)

  res.json({ success: true })
})

export default router
