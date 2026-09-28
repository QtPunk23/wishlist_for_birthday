import GiftCard from './GiftCard.jsx'

function getCategoryIcon(category) {
  const icons = {
    'Косметика': '💄',
    'Сумочка': '👜',
    'Спальня': '🛏️',
  }
  return icons[category] || '🎀'
}

export default function GiftList({ gifts, onClaimClick, onUnclaim }) {
  const grouped = gifts.reduce((acc, gift) => {
    const cat = gift.category || 'Другое'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(gift)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort()

  return (
    <div className="gift-list">
      {categories.map((category) => (
        <section key={category} className="gift-category">
          <h2 className="gift-category-title">
            <span className="category-icon">{getCategoryIcon(category)}</span>
            {category}
          </h2>
          <div className="gift-grid">
            {grouped[category].map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onClaimClick={onClaimClick}
                onUnclaim={onUnclaim}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
