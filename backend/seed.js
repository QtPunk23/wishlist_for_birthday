import db from './db/database.js'

const gifts = [
  // Косметика
  { id: 'brush-chicnie', name: 'CHICNIE flawless face brush set', description: 'Набор кистей для макияжа', url: 'https://goldapple.ru/99000035743-flawless-face-brush-set', category: 'Косметика' },
  { id: 'brush-rad', name: 'RAD solid crush brush', description: 'Кисть для макияжа', url: 'https://goldapple.ru/19000139795-solid-crush-brush', category: 'Косметика' },
  { id: 'brush-verdad', name: 'VERDAD hair growth warming', description: 'Средство для роста волос', url: 'https://goldapple.ru/19000258699-hair-growth-warming', category: 'Косметика' },
  
  // Сумочка
  { id: 'bag-7779362', name: 'Сумочка WB 7779362', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/7779362/detail.aspx?size=26714339', category: 'Сумочка' },
  { id: 'bag-4945731', name: 'Сумочка WB 4945731', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/4945731/detail.aspx?size=18054192', category: 'Сумочка' },
  { id: 'bag-168797807', name: 'Сумочка WB 168797807', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/168797807/detail.aspx?size=280524811', category: 'Сумочка' },
  { id: 'bag-233914719', name: 'Сумочка WB 233914719', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/233914719/detail.aspx?size=368697743', category: 'Сумочка' },
  { id: 'bag-41352978', name: 'Сумочка WB 41352978', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/41352978/detail.aspx?size=83168336', category: 'Сумочка' },
  { id: 'bag-1223598034', name: 'Сумочка WB 1223598034', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/1223598034/detail.aspx?size=1800709840', category: 'Сумочка' },
  { id: 'bag-1164795095', name: 'Сумочка WB 1164795095', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/1164795095/detail.aspx?size=1719401046', category: 'Сумочка' },
  { id: 'bag-584866960', name: 'Сумочка WB 584866960', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/584866960/detail.aspx?size=799515521', category: 'Сумочка' },
  { id: 'bag-835457750', name: 'Сумочка WB 835457750', description: 'Небольшая сумочка 25x40', url: 'https://www.wildberries.ru/catalog/835457750/detail.aspx?size=1254378745', category: 'Сумочка' },
  
  // Спальня
  { id: 'bedding-1124629048', name: 'Постельное бельё WB 1124629048', description: 'Постельное бельё', url: 'https://www.wildberries.ru/catalog/1124629048/detail.aspx?size=1662908958', category: 'Спальня' },
  { id: 'bedding-518383966', name: 'Постельное бельё WB 518383966', description: 'Постельное бельё', url: 'https://www.wildberries.ru/catalog/518383966/detail.aspx?size=716513965', category: 'Спальня' },
  { id: 'pajama', name: 'Пижама с длинным рукавом и штанами', description: 'Пижама с длинным рукавом и штанами, размер S-M', url: '', category: 'Спальня' },
]

export function seed() {
  db.exec('DELETE FROM gifts')
  const insert = db.prepare('INSERT OR IGNORE INTO gifts (id, name, description, url, category) VALUES (?, ?, ?, ?, ?)')
  for (const gift of gifts) {
    insert.run(gift.id, gift.name, gift.description, gift.url, gift.category)
  }
  console.log(`Seeded ${gifts.length} gifts`)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
}
