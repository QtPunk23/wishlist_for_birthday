import { useState } from 'react'

const CATEGORIES = [
  'Косметика',
  'Сумочка',
  'Спальня',
  'Здоровье и красота',
  'Электроника',
  'Одежда',
  'Книги',
  'Украшения',
  'Спорт',
  'Дом',
  'Другое',
]

export default function AddGiftModal({ onClose, onAdd, loading }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    url: '',
    category: 'Другое',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Введите название подарка'
    if (form.url && !isValidUrl(form.url)) errs.url = 'Некорректная ссылка'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onAdd({
      name: form.name.trim(),
      description: form.description.trim(),
      url: form.url.trim(),
      category: form.category,
    })
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Добавить подарок</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="gift-name">Название *</label>
            <input
              id="gift-name"
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="Например: Наушники Sony"
              className={errors.name ? 'input-error' : ''}
              autoFocus
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gift-desc">Описание</label>
            <textarea
              id="gift-desc"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Краткое описание подарка..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gift-url">Ссылка</label>
            <input
              id="gift-url"
              type="url"
              value={form.url}
              onChange={handleChange('url')}
              placeholder="https://example.com/gift"
              className={errors.url ? 'input-error' : ''}
            />
            {errors.url && <span className="error-text">{errors.url}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gift-category">Категория</label>
            <select
              id="gift-category"
              value={form.category}
              onChange={handleChange('category')}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-sm"></span>
                  Добавление...
                </>
              ) : (
                'Добавить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
