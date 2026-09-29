import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const assetsDir = join(__dirname, 'assets')
const files = readdirSync(assetsDir)

let output = '// Auto-generated file assets\n'
for (const file of files) {
  const content = readFileSync(join(assetsDir, file), 'utf-8')
  const key = file.replace(/[^a-zA-Z0-9]/g, '_')
  output += `export const ${key} = ${JSON.stringify(content)}\n`
}

writeFileSync(join(__dirname, 'src', 'assets.js'), output)
console.log('Generated assets.js with', files.length, 'files')
