import { useState, useEffect, useCallback } from 'react'
import GiftList from './components/GiftList.jsx'
import ClaimModal from './components/ClaimModal.jsx'
import Fireworks from './components/Fireworks.jsx'
import Balloons from './components/Balloons.jsx'
import Sparkles from './components/Sparkles.jsx'
import Garland from './components/Garland.jsx'
import FloatingHearts from './components/FloatingHearts.jsx'

const API_BASE = '/api'

function getGuestName() {
  return localStorage.getItem('guestName') || ''
}

function setGuestName(name) {
  localStorage.setItem('guestName', name)
}

function getClaimedGifts() {
  try {
    return JSON.parse(localStorage.getItem('claimedGifts') || '[]')
  } catch {
    return []
  }
}

function addClaimedGift(giftId) {
  const claimed = getClaimedGifts()
  if (!claimed.includes(giftId)) {
    claimed.push(giftId)
    localStorage.setItem('claimedGifts', JSON.stringify(claimed))
  }
}

function removeClaimedGift(giftId) {
  const claimed = getClaimedGifts().filter(id => id !== giftId)
  localStorage.setItem('claimedGifts', JSON.stringify(claimed))
}

export default function App() {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalGift, setModalGift] = useState(null)
  const [toast, setToast] = useState(null)
  const [fireworksTrigger, setFireworksTrigger] = useState(0)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const fetchGifts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE}/gifts`)
      if (!res.ok) throw new Error('Не удалось загрузить список подарков')
      const data = await res.json()
      setGifts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGifts()
  }, [fetchGifts])

  // Launch fireworks on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setFireworksTrigger(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClaim = async (giftId, guestName) => {
    try {
      const res = await fetch(`${API_BASE}/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giftId, guestName }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Не удалось забронировать подарок')
      }
      setGuestName(guestName)
      addClaimedGift(giftId)
      setGifts((prev) =>
        prev.map((g) =>
          g.id === giftId ? { ...g, status: 'claimed' } : g,
        ),
      )
      setModalGift(null)
      showToast('Подарок забронирован! 🎉')
      // Celebrate with fireworks!
      setFireworksTrigger((prev) => prev + 1)
    } catch (err) {
      showToast(err.message, 'error')
      throw err
    }
  }

  const handleUnclaim = async (giftId) => {
    const guestName = getGuestName()
    try {
      const res = await fetch(`${API_BASE}/claims/${giftId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Не удалось снять бронирование')
      }
      removeClaimedGift(giftId)
      setGifts((prev) =>
        prev.map((g) =>
          g.id === giftId ? { ...g, status: 'available' } : g,
        ),
      )
      showToast('Бронирование снято')
    } catch (err) {
      showToast(err.message, 'error')
      throw err
    }
  }

  const handleCardClick = (gift) => {
    if (gift.status !== 'claimed') {
      setModalGift(gift)
    }
  }

  return (
    <div className="app">
      <div className="confetti-bg" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="confetti-piece" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            backgroundColor: ['#ff6b9d', '#ffd700', '#c084fc', '#f472b6', '#a78bfa'][i % 5],
          }} />
        ))}
      </div>

      <Balloons count={8} />
      <Sparkles count={20} />
      <FloatingHearts count={10} />

      <Fireworks trigger={fireworksTrigger} />

      <header className="header">
        <Garland />
        <div className="header-content">
          <div className="header-icon">🎂</div>
          <h1 className="header-title">Список желаний</h1>
          <p className="header-subtitle">
            Выбери подарок, который хочешь подарить 🎁
          </p>
        </div>
        <div className="header-decoration">
          <span className="deco-star">✨</span>
          <span className="deco-star">✨</span>
          <span className="deco-star">✨</span>
        </div>
      </header>

      <main className="main">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Загружаем подарки...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <span className="error-icon">😢</span>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchGifts}>
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && !error && gifts.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🎈</span>
            <p>Пока нет подарков в списке</p>
          </div>
        )}

        {!loading && !error && gifts.length > 0 && (
          <GiftList
            gifts={gifts}
            onClaimClick={handleCardClick}
            onUnclaim={handleUnclaim}
          />
        )}
      </main>

      {modalGift && (
        <ClaimModal
          gift={modalGift}
          onClose={() => setModalGift(null)}
          onSubmit={handleClaim}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
