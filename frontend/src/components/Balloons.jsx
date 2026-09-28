import { useMemo } from 'react'

const BALLOON_COLORS = [
  { body: '#ff6b9d', highlight: '#ffb3c6', string: '#e91e7a' },
  { body: '#ffd700', highlight: '#fff3b0', string: '#e6b800' },
  { body: '#c084fc', highlight: '#e9d5ff', string: '#9333ea' },
  { body: '#f472b6', highlight: '#fbcfe8', string: '#db2777' },
  { body: '#60a5fa', highlight: '#bfdbfe', string: '#2563eb' },
  { body: '#34d399', highlight: '#a7f3d0', string: '#059669' },
]

function Balloon({ style, color, size }) {
  return (
    <div className="balloon" style={style}>
      <svg
        width={size}
        height={size * 1.4}
        viewBox="0 0 60 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Balloon body */}
        <ellipse
          cx="30"
          cy="28"
          rx="26"
          ry="30"
          fill={color.body}
        />
        {/* Highlight */}
        <ellipse
          cx="20"
          cy="18"
          rx="8"
          ry="12"
          fill={color.highlight}
          opacity="0.5"
        />
        {/* Knot */}
        <polygon
          points="30,56 26,62 34,62"
          fill={color.string}
        />
        {/* String */}
        <path
          d="M30 62 Q28 70 30 76 Q32 82 30 84"
          stroke={color.string}
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  )
}

export default function Balloons({ count = 8 }) {
  const balloons = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const color = BALLOON_COLORS[i % BALLOON_COLORS.length]
      const size = 36 + Math.random() * 20
      const left = 5 + Math.random() * 90
      const duration = 18 + Math.random() * 14
      const delay = -Math.random() * duration
      const swayDuration = 3 + Math.random() * 2
      const swayDelay = -Math.random() * swayDuration

      return {
        id: i,
        color,
        size,
        style: {
          left: `${left}%`,
          animationDuration: `${duration}s, ${swayDuration}s`,
          animationDelay: `${delay}s, ${swayDelay}s`,
        },
      }
    })
  }, [count])

  return (
    <div className="balloons-container" aria-hidden="true">
      {balloons.map((b) => (
        <Balloon
          key={b.id}
          style={b.style}
          color={b.color}
          size={b.size}
        />
      ))}
    </div>
  )
}
