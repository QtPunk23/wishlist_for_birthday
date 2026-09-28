import { useMemo } from 'react'

const HEART_SYMBOLS = ['💕', '💖', '💗', '💝', '❤️', '🩷', '💜', '🧡']

export default function FloatingHearts({ count = 10 }) {
  const hearts = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100
      const duration = 12 + Math.random() * 10
      const delay = -Math.random() * duration
      const symbol = HEART_SYMBOLS[i % HEART_SYMBOLS.length]

      return {
        id: i,
        symbol,
        style: {
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        },
      }
    })
  }, [count])

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span key={h.id} className="floating-heart" style={h.style}>
          {h.symbol}
        </span>
      ))}
    </div>
  )
}
