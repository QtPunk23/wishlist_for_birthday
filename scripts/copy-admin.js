/**
 * Copy admin/dist into frontend/dist/admin/ so the worker can serve
 * both frontend and admin from a single assets directory.
 */
import { cpSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rootDir = join(__dirname, '..')
const adminDist = join(rootDir, 'admin', 'dist')
const targetDir = join(rootDir, 'frontend', 'dist', 'admin')

if (!existsSync(adminDist)) {
  console.error('admin/dist not found. Run "npm run build:admin" first.')
  process.exit(1)
}

// Remove old admin directory if it exists
if (existsSync(targetDir)) {
  const { rmSync } = await import('fs')
  rmSync(targetDir, { recursive: true })
}

// Copy admin/dist to frontend/dist/admin
mkdirSync(targetDir, { recursive: true })
cpSync(adminDist, targetDir, { recursive: true })

console.log('Copied admin/dist to frontend/dist/admin/')
