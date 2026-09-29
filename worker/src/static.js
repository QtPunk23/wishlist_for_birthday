import {
  index_html,
  index_3aprlJl5_css,
  index_C14AnF_l_js,
  admin_html,
  admin_index_html,
  index_DkwQu_hQ_css,
  index_D2eYraT6_js,
} from './assets.js'

const frontendHTML = index_html
const adminHTML = admin_html

export function getFrontendHTML() {
  return new Response(frontendHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export function getAdminHTML() {
  return new Response(adminHTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

export function getAsset(filename) {
  const assets = {
    'index.html': index_html,
    'index-3aprlJl5.css': index_3aprlJl5_css,
    'index-C14AnF-l.js': index_C14AnF_l_js,
    'admin.html': admin_html,
    'admin-index.html': admin_index_html,
    'index-DkwQu-hQ.css': index_DkwQu_hQ_css,
    'index-D2eYraT6.js': index_D2eYraT6_js,
  }

  const content = assets[filename]
  if (!content) return new Response('Not found', { status: 404 })

  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
  }

  const ext = filename.slice(filename.lastIndexOf('.'))
  const contentType = mimeTypes[ext] || 'application/octet-stream'

  return new Response(content, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
