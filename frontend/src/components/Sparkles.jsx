import { useMemo } from 'react'

const SPARKLE_SYMBOLS = ['✦', '✧', '⋆', '✴', '✵', '✶', '✷', '✸']

export default function Sparkles({ count = 20 }) {
  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100
      const top = Math.random() * 100
      const duration = 2 + Math.random() * 3
      const delay = Math.random() * 4
      const size = 10 + Math.random() * 14
      const symbol = SPARKLE_SYMBOLS[i % SPARKLE_SYMBOLS.length]
      const colors = ['#ffd700', '#ff6b9d', '#c084fc', '#f472b6', '#ffffff']
      const color = colors[i % colors.length]

      return {
        id: i,
        symbol,
        color,
        style: {
          left: `${left}%`,
          top: `${top}%`,
          fontSize: `${size}px`,
          color,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        },
      }
    })
  }, [count])

  return (
    <div className="sparkle-container" aria-hidden="true">
      {sparkles.map((s) => (
        <span key={s.id} className="sparkle-particle" style={s.style}>
          {s.symbol}
        </span>
      ))}
    </div>
  )
}
