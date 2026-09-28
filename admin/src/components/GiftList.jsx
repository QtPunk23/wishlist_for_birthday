import GiftCard from './GiftCard'

export default function GiftList({ gifts }) {
  if (gifts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎁</div>
        <h3>Список подарков пуст</h3>
        <p>Добавьте первый подарок, чтобы начать</p>
      </div>
    )
  }

  // Group gifts by category
  const grouped = gifts.reduce((acc, gift) => {
    const cat = gift.category || 'Другое'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(gift)
    return acc
  }, {})

  // Sort categories alphabetically
  const sortedCategories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, 'ru')
  )

  return (
    <div className="gift-list">
      {sortedCategories.map(category => (
        <section key={category} className="category-section">
          <h2 className="category-title">
            <span className="category-icon">{getCategoryIcon(category)}</span>
            {category}
            <span className="category-count">{grouped[category].length}</span>
          </h2>
          <div className="gift-grid">
            {grouped[category].map(gift => (
              <GiftCard key={gift.id} gift={gift} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function getCategoryIcon(category) {
  const icons = {
    'Косметика': '💄',
    'Сумочка': '👜',
    'Спальня': '🛏️',
    'Электроника': '📱',
    'Одежда': '👗',
    'Книги': '📚',
    'Украшения': '💍',
    'Спорт': '⚽',
    'Дом': '🏠',
    'Другое': '🎁',
  }
  return icons[category] || '🎁'
}
