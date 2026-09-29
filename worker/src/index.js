import {
  initDatabase,
  isDatabaseEmpty,
  getGiftsForGuests,
  getGiftsForAdmin,
  getGiftById,
  addGift,
  deleteGift,
  claimGift,
  unclaimGift,
} from './db.js'
import { seedDatabase } from './seed.js'

/**
 * CORS headers for all responses.
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

/**
 * Create a JSON response with CORS headers.
 */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

/**
 * Create an error response.
 */
function error(message, status = 400) {
  return json({ error: message }, status)
}

/**
 * Handle CORS preflight requests.
 */
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

/**
 * Parse URL pathname.
 */
function getPathname(url) {
  return new URL(url).pathname
}

/**
 * Main worker export.
 */
export default {
  async fetch(request, env, ctx) {
    const pathname = getPathname(request.url)
    const method = request.method

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions()
    }

    // Initialize database schema
    await initDatabase(env.DB)

    // Auto-seed on first request if database is empty
    if (await isDatabaseEmpty(env.DB)) {
      await seedDatabase(env.DB)
    }

    // API Routes
    if (pathname.startsWith('/api/')) {
      return handleApi(request, env, pathname, method)
    }

    // All other routes: serve static files via Assets
    // This includes:
    // - Frontend SPA (from frontend/dist)
    // - Admin SPA (from frontend/dist/admin, copied during build)
    return env.ASSETS.fetch(request)
  },
}

/**
 * Handle API routes.
 */
async function handleApi(request, env, pathname, method) {
  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    return json({ status: 'ok', timestamp: new Date().toISOString() })
  }

  // Seed endpoint
  if (pathname === '/api/seed' && method === 'POST') {
    const count = await seedDatabase(env.DB)
    return json({ success: true, message: 'Database seeded', count })
  }

  // Gift routes
  if (pathname.startsWith('/api/gifts')) {
    return handleGifts(request, env, pathname, method)
  }

  // Claim routes
  if (pathname.startsWith('/api/claims')) {
    return handleClaims(request, env, pathname, method)
  }

  return error('Not found', 404)
}

/**
 * Handle gift-related routes.
 */
async function handleGifts(request, env, pathname, method) {
  // GET /api/gifts - list all gifts (guest view)
  if (pathname === '/api/gifts' && method === 'GET') {
    const gifts = await getGiftsForGuests(env.DB)
    return json(gifts)
  }

  // GET /api/gifts/admin - list all gifts with claim info
  if (pathname === '/api/gifts/admin' && method === 'GET') {
    const gifts = await getGiftsForAdmin(env.DB)
    return json(gifts)
  }

  // POST /api/gifts - add a new gift
  if (pathname === '/api/gifts' && method === 'POST') {
    const body = await request.json()
    const { name, description, url, category } = body

    if (!name) {
      return error('Name is required')
    }

    const id = crypto.randomUUID()
    const gift = await addGift(env.DB, { id, name, description, url, category })
    return json(gift, 201)
  }

  // GET /api/gifts/:id - get single gift
  const giftMatch = pathname.match(/^\/api\/gifts\/([^/]+)$/)
  if (giftMatch && method === 'GET') {
    const id = giftMatch[1]
    const gift = await getGiftById(env.DB, id)

    if (!gift) {
      return error('Gift not found', 404)
    }

    return json(gift)
  }

  // DELETE /api/gifts/:id - delete gift
  if (giftMatch && method === 'DELETE') {
    const id = giftMatch[1]
    await deleteGift(env.DB, id)
    return json({ success: true })
  }

  return error('Not found', 404)
}

/**
 * Handle claim-related routes.
 */
async function handleClaims(request, env, pathname, method) {
  // POST /api/claims - claim a gift
  if (pathname === '/api/claims' && method === 'POST') {
    const body = await request.json()
    const { giftId, guestName } = body

    if (!giftId || !guestName) {
      return error('giftId and guestName are required')
    }

    const result = await claimGift(env.DB, giftId, guestName)

    if (!result.success) {
      return error(result.error, result.error === 'Gift not found' ? 404 : 400)
    }

    return json(result)
  }

  // DELETE /api/claims/:giftId - unclaim a gift
  const claimMatch = pathname.match(/^\/api\/claims\/([^/]+)$/)
  if (claimMatch && method === 'DELETE') {
    const giftId = claimMatch[1]
    const body = await request.json()
    const { guestName } = body

    if (!guestName) {
      return error('guestName is required')
    }

    const result = await unclaimGift(env.DB, giftId, guestName)

    if (!result.success) {
      return error(result.error, 403)
    }

    return json(result)
  }

  return error('Not found', 404)
}
