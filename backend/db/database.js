import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function initDatabase() {
  const client = await pool.connect()
  try {
    await client.query(`
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
    console.log('Database initialized')
  } finally {
    client.release()
  }
}

export async function getAllGifts() {
  const result = await pool.query('SELECT * FROM gifts ORDER BY category, name')
  return result.rows
}

export async function getGiftById(id) {
  const result = await pool.query('SELECT * FROM gifts WHERE id = $1', [id])
  return result.rows[0]
}

export async function claimGift(id, guestName) {
  const result = await pool.query(
    `UPDATE gifts 
     SET status = 'claimed', claimed_by = $1, claimed_at = $2 
     WHERE id = $3 AND status = 'available'
     RETURNING *`,
    [guestName, new Date().toISOString(), id]
  )
  return result.rows[0]
}

export async function unclaimGift(id, guestName) {
  const result = await pool.query(
    `UPDATE gifts 
     SET status = 'available', claimed_by = NULL, claimed_at = NULL 
     WHERE id = $1 AND claimed_by = $2
     RETURNING *`,
    [id, guestName]
  )
  return result.rows[0]
}

export async function seedDatabase() {
  const client = await pool.connect()
  try {
    await client.query('DELETE FROM gifts')
    
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

    const insert = await client.prepare(
      'INSERT INTO gifts (id, name, description, url, category) VALUES ($1, $2, $3, $4, $5)'
    )
    
    for (const gift of gifts) {
      await insert.run(gift.id, gift.name, gift.description, gift.url, gift.category)
    }
    
    console.log(`Seeded ${gifts.length} gifts`)
  } finally {
    client.release()
  }
}

export default pool
