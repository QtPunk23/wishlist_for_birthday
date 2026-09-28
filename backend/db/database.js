import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dataDir = join(__dirname, '..', 'data')
mkdirSync(dataDir, { recursive: true })

const db = new DatabaseSync(join(dataDir, 'wishlist.db'))

export function initDatabase() {
  db.exec(`
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

export default db
