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

export function getAllGifts() {
  return db.prepare('SELECT * FROM gifts ORDER BY category, name').all()
}

export function getGiftById(id) {
  return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id)
}

export function claimGift(id, guestName) {
  const result = db.prepare(
    'UPDATE gifts SET status = ?, claimed_by = ?, claimed_at = ? WHERE id = ? AND status = ?'
  ).run('claimed', guestName, new Date().toISOString(), id, 'available')
  return result.changes > 0
}

export function unclaimGift(id, guestName) {
  const result = db.prepare(
    'UPDATE gifts SET status = ?, claimed_by = ?, claimed_at = NULL WHERE id = ? AND claimed_by = ?'
  ).run('available', id, guestName)
  return result.changes > 0
}

export function seedDatabase() {
  db.exec('DELETE FROM gifts')
  
  const gifts = [
    { id: 'bedding-1124629048', name: 'Постельное бельё', description: 'Постельное бельё', url: 'https://www.wildberries.ru/catalog/1124629048/detail.aspx?size=1662908958', category: 'Спальня' },
    { id: 'bedding-518383966', name: 'Постельное бельё', description: 'Постельное бельё', url: 'https://www.wildberries.ru/catalog/518383966/detail.aspx?size=716513965', category: 'Спальня' },
    { id: 'pajama', name: 'Пижама с длинным рукавом и штанами', description: 'Пижама с длинным рукавом и штанами, размер S-M', url: '', category: 'Спальня' },
    { id: 'brush-chicnie', name: 'Набор кистей CHICNIE flawless face brush set', description: 'Набор кистей для макияжа', url: 'https://goldapple.ru/99000035743-flawless-face-brush-set', category: 'Косметика' },
    { id: 'brush-rad', name: 'Набор кистей RAD solid crush brush', description: 'Набор кистей для макияжа', url: 'https://goldapple.ru/19000139795-solid-crush-brush', category: 'Косметика' },
    { id: 'tonic-verdad', name: 'Тоник для роста волос VERDAD hair growth warming', description: 'Тоник для роста волос', url: 'https://goldapple.ru/19000258699-hair-growth-warming', category: 'Косметика' },
    { id: 'cream-set', name: 'Набор кремов-баттеров', description: 'Набор кремов-баттеров', url: 'https://www.wildberries.ru/catalog/168797807/detail.aspx?size=280524811', category: 'Косметика' },
    { id: 'shampoo', name: 'Шампунь с коллагеном', description: 'Шампунь с коллагеном', url: 'https://www.wildberries.ru/catalog/233914719/detail.aspx?size=368697743', category: 'Косметика' },
    { id: 'hair-mask', name: 'Маска для волос', description: 'Маска для волос', url: 'https://www.wildberries.ru/catalog/41352978/detail.aspx?size=83168336', category: 'Косметика' },
    { id: 'tonometer-1', name: 'Тонометр', description: 'Тонометр', url: 'https://www.wildberries.ru/catalog/7779362/detail.aspx?size=26714339', category: 'Здоровье и красота' },
    { id: 'tonometer-2', name: 'Тонометр (альтернатива)', description: 'Тонометр — альтернатива первому', url: 'https://www.wildberries.ru/catalog/4945731/detail.aspx?size=18054192', category: 'Здоровье и красота' },
    { id: 'steamer-1', name: 'Пароочиститель', description: 'Пароочиститель', url: 'https://www.wildberries.ru/catalog/1223598034/detail.aspx?size=1800709840', category: 'Здоровье и красота' },
    { id: 'steamer-2', name: 'Пароочиститель (альтернатива)', description: 'Пароочиститель — альтернатива первому', url: 'https://www.wildberries.ru/catalog/1164795095/detail.aspx?size=1719401046', category: 'Здоровье и красота' },
    { id: 'bag', name: 'Сумка', description: 'Небольшая сумка 25x40', url: 'https://www.wildberries.ru/catalog/584866960/detail.aspx?size=799515521', category: 'Сумочка' },
    { id: 'bag-alt', name: 'Сумка (альтернатива)', description: 'Небольшая сумка 25x40, похожая форма', url: 'https://www.wildberries.ru/catalog/835457750/detail.aspx?size=1254378745', category: 'Сумочка' },
  ]

  const insert = db.prepare('INSERT INTO gifts (id, name, description, url, category) VALUES (?, ?, ?, ?, ?)')
  for (const gift of gifts) {
    insert.run(gift.id, gift.name, gift.description, gift.url, gift.category)
  }
  console.log(`Seeded ${gifts.length} gifts`)
}

export default db
