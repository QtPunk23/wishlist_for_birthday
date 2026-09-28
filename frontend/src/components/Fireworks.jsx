import { useEffect, useRef, useCallback } from 'react'

const COLORS = [
  ['#ff6b9d', '#ffb3c6', '#ff8fab'],
  ['#ffd700', '#ffed4a', '#f6e05e'],
  ['#c084fc', '#d8b4fe', '#a78bfa'],
  ['#f472b6', '#f9a8d4', '#ec4899'],
  ['#60a5fa', '#93c5fd', '#3b82f6'],
]

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function randomColor() {
  const palette = COLORS[Math.floor(Math.random() * COLORS.length)]
  return palette[Math.floor(Math.random() * palette.length)]
}

class Particle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.color = color
    const angle = Math.random() * Math.PI * 2
    const speed = randomBetween(1, 6)
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.alpha = 1
    this.decay = randomBetween(0.008, 0.02)
    this.gravity = 0.04
    this.size = randomBetween(2, 4)
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.vx *= 0.98
    this.vy *= 0.98
    this.alpha -= this.decay
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = Math.max(this.alpha, 0)
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 6
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  get isDead() {
    return this.alpha <= 0
  }
}

class Rocket {
  constructor(x, targetY) {
    this.x = x
    this.y = window.innerHeight
    this.targetY = targetY
    this.speed = randomBetween(8, 12)
    this.color = randomColor()
    this.trail = []
  }

  update() {
    this.trail.push({ x: this.x, y: this.y, alpha: 1 })
    if (this.trail.length > 8) this.trail.shift()
    this.trail.forEach((t) => (t.alpha -= 0.12))

    this.y -= this.speed
    this.speed -= 0.15
  }

  draw(ctx) {
    // Draw trail
    this.trail.forEach((t) => {
      if (t.alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = t.alpha * 0.6
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(t.x, t.y, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // Draw rocket head
    ctx.save()
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  get exploded() {
    return this.y <= this.targetY || this.speed <= 0
  }
}

export default function Fireworks({ trigger, onComplete }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const rocketsRef = useRef([])
  const particlesRef = useRef([])
  const isActiveRef = useRef(false)

  const explode = useCallback((x, y) => {
    const count = Math.floor(randomBetween(40, 70))
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(x, y, randomColor()))
    }
  }, [])

  const launchRocket = useCallback(() => {
    const x = randomBetween(
      window.innerWidth * 0.15,
      window.innerWidth * 0.85
    )
    const targetY = randomBetween(
      window.innerHeight * 0.1,
      window.innerHeight * 0.4
    )
    rocketsRef.current.push(new Rocket(x, targetY))
  }, [])

  const startShow = useCallback(() => {
    if (isActiveRef.current) return
    isActiveRef.current = true
    rocketsRef.current = []
    particlesRef.current = []

    // Launch initial volley
    const initialCount = Math.min(5, Math.max(3, Math.floor(window.innerWidth / 300)))
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => launchRocket(), i * 300)
    }

    // Keep launching for a few seconds
    const launchInterval = setInterval(() => {
      if (rocketsRef.current.length < 3) {
        launchRocket()
      }
    }, 600)

    // Stop launching after 4 seconds
    setTimeout(() => {
      clearInterval(launchInterval)
    }, 4000)

    // Stop the whole show after all particles fade
    setTimeout(() => {
      isActiveRef.current = false
      if (onComplete) onComplete()
    }, 9000)
  }, [launchRocket, onComplete])

  // Handle external trigger
  useEffect(() => {
    if (trigger > 0) {
      startShow()
    }
  }, [trigger, startShow])

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let running = true

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function animate() {
      if (!running) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw rockets
      rocketsRef.current = rocketsRef.current.filter((rocket) => {
        rocket.update()
        rocket.draw(ctx)
        if (rocket.exploded) {
          explode(rocket.x, rocket.y)
          return false
        }
        return true
      })

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.update()
        p.draw(ctx)
        return !p.isDead
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      running = false
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [explode])

  return (
    <canvas
      ref={canvasRef}
      className="fireworks-canvas"
      aria-hidden="true"
    />
  )
}
