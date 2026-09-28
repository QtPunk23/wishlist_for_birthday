import { useState, useEffect, useRef } from 'react'

export default function ClaimModal({ gift, onClose, onSubmit }) {
  const [guestName, setGuestName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = guestName.trim()
    if (!name) {
      setError('Пожалуйста, введи своё имя')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(gift.id, name)
    } catch {
      // error toast handled by parent
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="claim-modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className="modal-header">
          <span className="modal-icon">🎁</span>
          <h2 id="claim-modal-title">Хочешь подарить?</h2>
          <p className="modal-gift-name">{gift.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="guest-name" className="modal-label">
            Как тебя зовут?
          </label>
          <input
            id="guest-name"
            ref={inputRef}
            type="text"
            className="modal-input"
            placeholder="Введи своё имя..."
            value={guestName}
            onChange={(e) => {
              setGuestName(e.target.value)
              setError(null)
            }}
            maxLength={50}
            disabled={submitting}
          />
          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={submitting}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Бронируем...' : 'Забронировать 🎉'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
