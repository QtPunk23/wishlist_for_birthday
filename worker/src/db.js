/**
 * D1 Database operations for the birthday wishlist app.
 * All functions expect the D1 database instance to be passed in.
 */

/**
 * Initialize the database schema.
 * @param {D1Database} db - D1 database instance
 */
export async function initDatabase(db) {
  await db.exec(`
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
  `)
}

/**
 * Check if the gifts table is empty.
 * @param {D1Database} db
 * @returns {Promise<boolean>}
 */
export async function isDatabaseEmpty(db) {
  const result = await db.prepare('SELECT COUNT(*) as count FROM gifts').first()
  return result.count === 0
}

/**
 * Get all gifts for guests (without claimed_by name).
 * @param {D1Database} db
 * @returns {Promise<Array>}
 */
export async function getGiftsForGuests(db) {
  const { results } = await db.prepare(
    'SELECT id, name, description, url, category, claimed_by FROM gifts'
  ).all()

  return results.map(g => ({
    id: g.id,
    name: g.name,
    description: g.description,
    url: g.url,
    category: g.category,
    status: g.claimed_by ? 'claimed' : 'available',
  }))
}

/**
 * Get all gifts with full claim info (for admin).
 * @param {D1Database} db
 * @returns {Promise<Array>}
 */
export async function getGiftsForAdmin(db) {
  const { results } = await db.prepare('SELECT * FROM gifts').all()
  return results
}

/**
 * Get a single gift by ID (guest view - no claimed_by name).
 * @param {D1Database} db
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getGiftById(db, id) {
  const gift = await db.prepare(
    'SELECT id, name, description, url, category, claimed_by FROM gifts WHERE id = ?'
  ).bind(id).first()

  if (!gift) return null

  return {
    id: gift.id,
    name: gift.name,
    description: gift.description,
    url: gift.url,
    category: gift.category,
    status: gift.claimed_by ? 'claimed' : 'available',
  }
}

/**
 * Add a new gift.
 * @param {D1Database} db
 * @param {Object} gift - { id, name, description, url, category }
 * @returns {Promise<Object>}
 */
export async function addGift(db, { id, name, description, url, category }) {
  await db.prepare(
    'INSERT INTO gifts (id, name, description, url, category) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, name, description, url, category).run()

  return { id, name, description, url, category }
}

/**
 * Delete a gift by ID.
 * @param {D1Database} db
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteGift(db, id) {
  await db.prepare('DELETE FROM gifts WHERE id = ?').bind(id).run()
}

/**
 * Claim a gift.
 * @param {D1Database} db
 * @param {string} giftId
 * @param {string} guestName
 * @returns {Promise<Object>} - { success: boolean, error?: string }
 */
export async function claimGift(db, giftId, guestName) {
  const gift = await db.prepare('SELECT * FROM gifts WHERE id = ?').bind(giftId).first()

  if (!gift) {
    return { success: false, error: 'Gift not found' }
  }

  if (gift.status === 'claimed') {
    return { success: false, error: 'Gift already claimed' }
  }

  const claimedAt = new Date().toISOString()
  await db.prepare(
    'UPDATE gifts SET status = ?, claimed_by = ?, claimed_at = ? WHERE id = ?'
  ).bind('claimed', guestName, claimedAt, giftId).run()

  return { success: true, message: 'Gift claimed!' }
}

/**
 * Unclaim a gift.
 * @param {D1Database} db
 * @param {string} giftId
 * @param {string} guestName
 * @returns {Promise<Object>} - { success: boolean, error?: string }
 */
export async function unclaimGift(db, giftId, guestName) {
  const gift = await db.prepare('SELECT * FROM gifts WHERE id = ?').bind(giftId).first()

  if (!gift || gift.claimed_by !== guestName) {
    return { success: false, error: 'Not authorized' }
  }

  await db.prepare(
    'UPDATE gifts SET status = ?, claimed_by = ?, claimed_at = ? WHERE id = ?'
  ).bind('available', null, null, giftId).run()

  return { success: true }
}
