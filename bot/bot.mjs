// Birthday Wishlist Telegram Bot - Polling version with fetch
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const TOKEN = '8896889815:AAEH3P42-nqWueUwHhiOaJwmDm8qDE9pBKs'
const API_URL = `https://api.telegram.org/bot${TOKEN}`

// Initialize database
const dataDir = join(__dirname, 'data')
mkdirSync(dataDir, { recursive: true })

const db = new DatabaseSync(join(dataDir, 'wishlist.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS gifts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    url TEXT,
    category TEXT,
    status TEXT DEFAULT 'available',
    chat_id TEXT,
    claimed_at TEXT
  )
`)

const countResult = db.prepare('SELECT COUNT(*) as count FROM gifts').get()
if (countResult.count === 0) {
  seedDatabase()
}

function seedDatabase() {
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

function getAllGifts() {
  return db.prepare('SELECT * FROM gifts').all()
}

function getGiftById(id) {
  return db.prepare('SELECT * FROM gifts WHERE id = ?').get(id)
}

function claimGift(id, chatId) {
  const result = db.prepare(
    'UPDATE gifts SET status = ?, chat_id = ?, claimed_at = ? WHERE id = ? AND status = ?'
  ).run('claimed', chatId, new Date().toISOString(), id, 'available')
  return result.changes > 0
}

function unclaimGift(id, chatId) {
  const result = db.prepare(
    'UPDATE gifts SET status = ?, chat_id = ?, claimed_at = NULL WHERE id = ? AND chat_id = ?'
  ).run('available', id, chatId)
  return result.changes > 0
}

function getGiftsByCategory() {
  const gifts = getAllGifts()
  const grouped = {}
  for (const gift of gifts) {
    if (!grouped[gift.category]) grouped[gift.category] = []
    grouped[gift.category].push(gift)
  }
  return grouped
}

// Telegram API helper using fetch
async function callTelegramAPI(method, params = {}) {
  const response = await fetch(`${API_URL}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  return response.json()
}

async function sendMessage(chatId, text, keyboard = null) {
  const params = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
  }
  if (keyboard) {
    params.reply_markup = JSON.stringify(keyboard)
  }
  return callTelegramAPI('sendMessage', params)
}

async function editMessageText(chatId, messageId, text, keyboard = null) {
  const params = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: 'HTML',
  }
  if (keyboard) {
    params.reply_markup = JSON.stringify(keyboard)
  }
  return callTelegramAPI('editMessageText', params)
}

async function answerCallbackQuery(callbackQueryId, text = null) {
  const params = { callback_query_id: callbackQueryId }
  if (text) params.text = text
  return callTelegramAPI('answerCallbackQuery', params)
}

const categoryIcons = {
  'Спальня': '🛏️',
  'Косметика': '💄',
  'Здоровье и красота': '💆',
  'Сумочка': '👜',
}

function getMainKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '🎁 Посмотреть подарки', callback_data: 'view_gifts' }],
      [{ text: '📋 Мои подарки', callback_data: 'my_gifts' }],
    ],
  }
}

function getCategoryKeyboard() {
  const categories = Object.keys(getGiftsByCategory())
  const keyboard = categories.map((cat) => [
    { text: `${categoryIcons[cat] || '🎁'} ${cat}`, callback_data: `category_${cat}` },
  ])
  keyboard.push([{ text: '🔙 Назад', callback_data: 'main_menu' }])
  return { inline_keyboard: keyboard }
}

function getGiftKeyboard(gift, chatId) {
  const isClaimed = gift.status === 'claimed'
  const isMyClaim = isClaimed && gift.chat_id === String(chatId)

  const buttons = []
  if (gift.url) {
    buttons.push([{ text: '🔗 Посмотреть подарок', url: gift.url }])
  }

  if (isMyClaim) {
    buttons.push([{ text: '❌ Снять выбор', callback_data: `unclaim_${gift.id}` }])
  } else if (!isClaimed) {
    buttons.push([{ text: '🎁 Хочу подарить', callback_data: `claim_${gift.id}` }])
  }

  buttons.push([{ text: '🔙 Назад', callback_data: `category_${gift.category}` }])

  return { inline_keyboard: buttons }
}

function formatGiftMessage(gift) {
  const status = gift.status === 'claimed' ? '🔴 Занято' : '🟢 Свободно'
  let message = `${status}\n\n`
  message += `<b>${gift.name}</b>\n`
  if (gift.description) {
    message += `${gift.description}\n`
  }
  return message
}

async function handleStart(chatId) {
  const text = '🎂 <b>Виш-лист именинницы</b>\n\nВыбери действие:'
  await sendMessage(chatId, text, getMainKeyboard())
}

async function handleViewGifts(chatId, messageId) {
  const text = '📂 <b>Выбери категорию:</b>'
  await editMessageText(chatId, messageId, text, getCategoryKeyboard())
}

async function handleCategory(chatId, messageId, category) {
  const gifts = getGiftsByCategory()[category] || []
  const icon = categoryIcons[category] || '🎁'

  for (const gift of gifts) {
    const text = formatGiftMessage(gift)
    await sendMessage(chatId, text, getGiftKeyboard(gift, chatId))
  }

  await sendMessage(chatId, `${icon} <b>${category}</b>\n\nВыбери подарок выше или вернись назад:`, {
    inline_keyboard: [[{ text: '🔙 Назад', callback_data: 'main_menu' }]],
  })
}

async function handleClaim(chatId, messageId, giftId, callbackQueryId) {
  const gift = getGiftById(giftId)

  if (!gift) {
    await answerCallbackQuery(callbackQueryId, 'Подарок не найден')
    return
  }

  if (gift.status === 'claimed') {
    await answerCallbackQuery(callbackQueryId, 'Этот подарок уже занят!')
    return
  }

  const success = claimGift(giftId, chatId)
  if (success) {
    await answerCallbackQuery(callbackQueryId, 'Подарок забронирован! 🎉')
    const updatedGift = getGiftById(giftId)
    await editMessageText(chatId, messageId, formatGiftMessage(updatedGift), getGiftKeyboard(updatedGift, chatId))
  } else {
    await answerCallbackQuery(callbackQueryId, 'Не удалось забронировать')
  }
}

async function handleUnclaim(chatId, messageId, giftId, callbackQueryId) {
  const gift = getGiftById(giftId)

  if (!gift) {
    await answerCallbackQuery(callbackQueryId, 'Подарок не найден')
    return
  }

  const success = unclaimGift(giftId, chatId)
  if (success) {
    await answerCallbackQuery(callbackQueryId, 'Выбор снят')
    const updatedGift = getGiftById(giftId)
    await editMessageText(chatId, messageId, formatGiftMessage(updatedGift), getGiftKeyboard(updatedGift, chatId))
  } else {
    await answerCallbackQuery(callbackQueryId, 'Не удалось снять выбор')
  }
}

async function handleMyGifts(chatId) {
  const gifts = getAllGifts()
  const myGifts = gifts.filter((g) => g.chat_id === String(chatId))

  if (myGifts.length === 0) {
    await sendMessage(chatId, 'Ты пока не выбрала ни одного подарка.', getMainKeyboard())
  } else {
    let text = '🎁 <b>Твои подарки:</b>\n\n'
    for (const gift of myGifts) {
      text += `• ${gift.name}\n`
    }
    await sendMessage(chatId, text, {
      inline_keyboard: [[{ text: '🔙 Назад', callback_data: 'main_menu' }]],
    })
  }
}

let lastUpdateId = 0

async function pollUpdates() {
  try {
    const result = await callTelegramAPI('getUpdates', {
      offset: lastUpdateId + 1,
      timeout: 30,
    })

    if (result.ok && result.result) {
      for (const update of result.result) {
        lastUpdateId = update.update_id

        if (update.message && update.message.text === '/start') {
          await handleStart(update.message.chat.id)
        } else if (update.callback_query) {
          const query = update.callback_query
          const chatId = query.message.chat.id
          const messageId = query.message.message_id
          const data = query.data

          if (data === 'main_menu') {
            const text = '🎂 <b>Виш-лист именинницы</b>\n\nВыбери действие:'
            await editMessageText(chatId, messageId, text, getMainKeyboard())
          } else if (data === 'view_gifts') {
            await handleViewGifts(chatId, messageId)
          } else if (data === 'my_gifts') {
            await handleMyGifts(chatId)
          } else if (data.startsWith('category_')) {
            const category = data.replace('category_', '')
            await handleCategory(chatId, messageId, category)
          } else if (data.startsWith('claim_')) {
            const giftId = data.replace('claim_', '')
            await handleClaim(chatId, messageId, giftId, query.id)
          } else if (data.startsWith('unclaim_')) {
            const giftId = data.replace('unclaim_', '')
            await handleUnclaim(chatId, messageId, giftId, query.id)
          }

          await answerCallbackQuery(query.id)
        }
      }
    }
  } catch (error) {
    console.error('Polling error:', error.message)
  }

  setTimeout(pollUpdates, 1000)
}

console.log('Bot is running with polling...')
console.log('Send /start to your bot in Telegram')
pollUpdates()
