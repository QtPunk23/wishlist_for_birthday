import { useState } from 'react'

function getGuestName() {
  return localStorage.getItem('guestName') || ''
}

function getClaimedGifts() {
  try {
    return JSON.parse(localStorage.getItem('claimedGifts') || '[]')
  } catch {
    return []
  }
}

export default function GiftCard({ gift, onClaimClick, onUnclaim }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [unclaiming, setUnclaiming] = useState(false)

  const guestName = getGuestName()
  const claimedGifts = getClaimedGifts()
  const isMyClaim = gift.status === 'claimed' && claimedGifts.includes(gift.id) && guestName

  const handleUnclaimClick = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }
    setUnclaiming(true)
    try {
      await onUnclaim(gift.id)
    } finally {
      setUnclaiming(false)
      setShowConfirm(false)
    }
  }

  const cancelConfirm = () => setShowConfirm(false)

  return (
    <div className={`gift-card ${gift.status === 'claimed' ? 'gift-card--claimed' : ''}`}>
      <div className="gift-card-header">
        <span className="gift-card-category">{gift.category}</span>
        {gift.status === 'claimed' && <span className="gift-card-badge">Занято</span>}
      </div>

      <h3 className="gift-card-name">{gift.name}</h3>
      <p className="gift-card-description">{gift.description}</p>

      {gift.url && (
        <a
          href={gift.url}
          target="_blank"
          rel="noopener noreferrer"
          className="gift-card-link"
        >
          <span>🔗</span> Посмотреть подарок
        </a>
      )}

      <div className="gift-card-actions">
        {gift.status !== 'claimed' ? (
          <button
            className="btn btn-primary btn-claim"
            onClick={() => onClaimClick(gift)}
          >
            <span>🎁</span> Хочу подарить
          </button>
        ) : isMyClaim ? (
          <div className="claimed-actions">
            {!showConfirm ? (
              <button
                className="btn btn-outline btn-unclaim"
                onClick={handleUnclaimClick}
                disabled={unclaiming}
              >
                {unclaiming ? 'Снимаем...' : 'Снять бронь'}
              </button>
            ) : (
              <div className="confirm-unclaim">
                <span>Ты уверена?</span>
                <div className="confirm-buttons">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleUnclaimClick}
                    disabled={unclaiming}
                  >
                    {unclaiming ? '...' : 'Да, снять'}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={cancelConfirm}
                    disabled={unclaiming}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
