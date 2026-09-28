import { useState, useEffect, useCallback } from 'react'
import GiftList from './components/GiftList'
import AddGiftModal from './components/AddGiftModal'

const API_BASE = 'http://localhost:3001/api'

export default function App() {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchGifts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/gifts`)
      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
      const data = await res.json()
      setGifts(data)
    } catch (err) {
      setError(err.message || 'Не удалось загрузить список подарков')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGifts()
  }, [fetchGifts])

  const handleAddGift = async (giftData) => {
    setActionLoading(true)
    try {
      const res = await fetch(`${API_BASE}/gifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(giftData),
      })
      if (!res.ok) throw new Error('Не удалось добавить подарок')
      await fetchGifts()
      setShowModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Мой вишлист</h1>
          <p className="subtitle">Подарки на день рождения</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={actionLoading}
        >
          <span className="btn-icon">+</span>
          Добавить подарок
        </button>
      </header>

      {error && (
        <div className="error-banner" onClick={() => setError(null)}>
          <span>{error}</span>
          <button className="error-close">&times;</button>
        </div>
      )}

      <main className="main">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка подарков...</p>
          </div>
        ) : (
          <GiftList gifts={gifts} />
        )}
      </main>

      {showModal && (
        <AddGiftModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddGift}
          loading={actionLoading}
        />
      )}
    </div>
  )
}
