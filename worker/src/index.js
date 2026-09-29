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
import { getFrontendHTML, getAdminHTML } from './static.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
    },
  })
}

function error(message, status = 400) {
  return json({ error: message }, status)
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

function getPathname(url) {
  return new URL(url).pathname
}

export default {
  async fetch(request, env, ctx) {
    const pathname = getPathname(request.url)
    const method = request.method

    if (method === 'OPTIONS') {
      return handleOptions()
    }

    await initDatabase(env.DB)

    if (await isDatabaseEmpty(env.DB)) {
      await seedDatabase(env.DB)
    }

    if (pathname.startsWith('/api/')) {
      return handleApi(request, env, pathname, method)
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      return getAdminHTML()
    }

    if (pathname === '/' || pathname === '/index.html') {
      return getFrontendHTML()
    }

    // Serve static assets from assets binding
    return env.ASSETS.fetch(request)
  },
}

async function handleApi(request, env, pathname, method) {
  if (pathname === '/api/health' && method === 'GET') {
    return json({ status: 'ok', timestamp: new Date().toISOString() })
  }

  if (pathname === '/api/seed' && method === 'POST') {
    const count = await seedDatabase(env.DB)
    return json({ success: true, message: 'Database seeded', count })
  }

  if (pathname.startsWith('/api/gifts')) {
    return handleGifts(request, env, pathname, method)
  }

  if (pathname.startsWith('/api/claims')) {
    return handleClaims(request, env, pathname, method)
  }

  return error('Not found', 404)
}

async function handleGifts(request, env, pathname, method) {
  if (pathname === '/api/gifts' && method === 'GET') {
    const gifts = await getGiftsForGuests(env.DB)
    return json(gifts)
  }

  if (pathname === '/api/gifts/admin' && method === 'GET') {
    const gifts = await getGiftsForAdmin(env.DB)
    return json(gifts)
  }

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

  const giftMatch = pathname.match(/^\/api\/gifts\/([^/]+)$/)
  if (giftMatch && method === 'GET') {
    const id = giftMatch[1]
    const gift = await getGiftById(env.DB, id)

    if (!gift) {
      return error('Gift not found', 404)
    }

    return json(gift)
  }

  if (giftMatch && method === 'DELETE') {
    const id = giftMatch[1]
    await deleteGift(env.DB, id)
    return json({ success: true })
  }

  return error('Not found', 404)
}

async function handleClaims(request, env, pathname, method) {
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
