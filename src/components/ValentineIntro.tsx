import { useEffect, useMemo, useRef, useState } from 'react'

type IntroPhase = 'flyIn' | 'settle' | 'openFlap' | 'pullLetter' | 'done'

type ShepherdParticle = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  spin: number
  opacity: number
  age: number
  life: number
}

const BURST_COUNT = 32
const MAX_ACTIVE_SHEPHERDS = 110
const GRAVITY = 980
const TYPEWRITER_DELAY_MS = 120

const LETTER_TEXT = `Querida Tabatha,\n\nAlguna vez te prometí que sin importar dónde estuvieramos o que obstaculo hubiera de por medio celebraríamos San Valentín juntos. Esta vez nos tocó estar lejos el uno del otra y eso me parte el corazón. Al mismo tiempo siento\n\nForever yours,\nTu San Valentín`

export function ValentineIntro() {
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [phase, setPhase] = useState<IntroPhase>(prefersReducedMotion ? 'done' : 'flyIn')
  const [shepherds, setShepherds] = useState<ShepherdParticle[]>([])
  const [typedCharacters, setTypedCharacters] = useState(prefersReducedMotion ? LETTER_TEXT.length : 0)
  const burstButtonRef = useRef<HTMLButtonElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)
  const shepherdsRef = useRef<ShepherdParticle[]>([])

  useEffect(() => {
    if (phase === 'done') return

    const timers: number[] = []

    if (phase === 'flyIn') {
      timers.push(window.setTimeout(() => setPhase('settle'), 3000))
    } else if (phase === 'settle') {
      timers.push(window.setTimeout(() => setPhase('openFlap'), 650))
    } else if (phase === 'openFlap') {
      timers.push(window.setTimeout(() => setPhase('pullLetter'), 1000))
    } else if (phase === 'pullLetter') {
      timers.push(window.setTimeout(() => setPhase('done'), 1700))
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [phase])

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedCharacters(LETTER_TEXT.length)
      return
    }

    if (phase !== 'done') {
      setTypedCharacters(0)
      return
    }

    setTypedCharacters(0)
    const interval = window.setInterval(() => {
      setTypedCharacters((current) => {
        if (current >= LETTER_TEXT.length) {
          window.clearInterval(interval)
          return LETTER_TEXT.length
        }

        return current + 1
      })
    }, TYPEWRITER_DELAY_MS)

    return () => window.clearInterval(interval)
  }, [phase, prefersReducedMotion])

  const simulate = () => {
    if (rafRef.current !== null) return

    let previousTime: number | null = null

    const tick = (time: number) => {
      if (previousTime === null) {
        previousTime = time
      }

      const dt = Math.min((time - previousTime) / 1000, 0.035)
      previousTime = time
      const width = window.innerWidth
      const height = window.innerHeight

      let particles = shepherdsRef.current
        .map((particle) => {
          const next = { ...particle }
          next.age += dt
          next.vy += GRAVITY * dt
          next.x += next.vx * dt
          next.y += next.vy * dt
          next.rotation += next.spin * dt

          const radius = next.size / 2

          if (next.x < radius) {
            next.x = radius
            next.vx *= -0.8
          } else if (next.x > width - radius) {
            next.x = width - radius
            next.vx *= -0.8
          }

          if (next.y < radius) {
            next.y = radius
            next.vy *= -0.85
          } else if (next.y > height - radius) {
            next.y = height - radius
            next.vy *= -0.75
            next.vx *= 0.94
          }

          const fadeStart = next.life * 0.62
          if (next.age > fadeStart) {
            const fadeProgress = (next.age - fadeStart) / (next.life - fadeStart)
            next.opacity = Math.max(0, 1 - fadeProgress)
          }

          return next
        })
        .filter((particle) => particle.age < particle.life && particle.opacity > 0.02)

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const first = particles[i]
          const second = particles[j]
          const dx = second.x - first.x
          const dy = second.y - first.y
          const distance = Math.hypot(dx, dy)
          const minDistance = first.size / 2 + second.size / 2

          if (distance === 0 || distance >= minDistance) continue

          const nx = dx / distance
          const ny = dy / distance
          const overlap = minDistance - distance

          first.x -= nx * overlap * 0.5
          first.y -= ny * overlap * 0.5
          second.x += nx * overlap * 0.5
          second.y += ny * overlap * 0.5

          const rvx = second.vx - first.vx
          const rvy = second.vy - first.vy
          const velocityAlongNormal = rvx * nx + rvy * ny

          if (velocityAlongNormal > 0) continue

          const restitution = 0.75
          const impulse = (-(1 + restitution) * velocityAlongNormal) / 2

          first.vx -= impulse * nx
          first.vy -= impulse * ny
          second.vx += impulse * nx
          second.vy += impulse * ny
        }
      }

      shepherdsRef.current = particles
      setShepherds(particles)

      if (particles.length > 0) {
        rafRef.current = window.requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = window.requestAnimationFrame(tick)
  }

  const launchShepherdBurst = () => {
    const buttonRect = burstButtonRef.current?.getBoundingClientRect()
    const originX = buttonRect ? buttonRect.left + buttonRect.width / 2 : window.innerWidth / 2
    const originY = buttonRect ? buttonRect.top + buttonRect.height / 2 : window.innerHeight / 2

    const burst = Array.from({ length: BURST_COUNT }, (_, index) => {
      const angle = (-Math.PI * 0.95) + (Math.PI * 1.9 * index) / BURST_COUNT
      const speed = 220 + Math.random() * 620
      const size = 28 + Math.random() * 34

      return {
        id: particleIdRef.current++,
        x: originX + (Math.random() - 0.5) * 10,
        y: originY + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (160 + Math.random() * 120),
        size,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 540,
        opacity: 1,
        age: 0,
        life: 3.8 + Math.random() * 1.8,
      }
    })

    const merged = [...shepherdsRef.current, ...burst]
    shepherdsRef.current = merged.slice(-MAX_ACTIVE_SHEPHERDS)
    setShepherds(shepherdsRef.current)
    simulate()
  }

  const isDone = phase === 'done'
  const isFlapOpen = phase === 'openFlap' || phase === 'pullLetter' || phase === 'done'
  const isLetterOut = phase === 'pullLetter' || phase === 'done'
  const visibleLetter = LETTER_TEXT.slice(0, typedCharacters)

  return (
    <div className="intro-layer">
      <div className={`scene-stage phase-${phase}`}>
        <div className={`envelope-scene ${isDone ? 'is-hidden' : ''}`} aria-hidden="true">
          <div className="envelope">
            <div className={`envelope-flap ${isFlapOpen ? 'flap-open' : ''}`} />
            <div className="envelope-body" />
            <div className={`letter ${isLetterOut ? 'letter-open' : ''}`}>
              <div className="letter-lines" />
            </div>
            <div className="envelope-fold-bottom" />
            <div className="envelope-fold envelope-fold-left" />
            <div className="envelope-fold envelope-fold-right" />
          </div>
        </div>

        <article className={`love-card ${isDone ? 'card-visible' : ''}`}>
          <p className="card-kicker">A mi persona favorita :)</p>
          <h1>Feliz San Valentín, Tabatha 💌</h1>
          <section className="love-letter" aria-label="Love letter on worn paper">
            <p className={`letter-content ${typedCharacters < LETTER_TEXT.length ? 'typing' : ''}`}>{visibleLetter}</p>
          </section>
          <button ref={burstButtonRef} className="shepherd-burst-button" onClick={launchShepherdBurst}>
            Australian shewpard
          </button>
        </article>
      </div>

      <div className="shepherd-layer" aria-hidden="true">
        {shepherds.map((shepherd) => (
          <img
            key={shepherd.id}
            src="/australian-shepherd.svg"
            alt=""
            className="shepherd-particle"
            style={{
              width: `${shepherd.size}px`,
              height: `${shepherd.size}px`,
              transform: `translate(${shepherd.x - shepherd.size / 2}px, ${shepherd.y - shepherd.size / 2}px) rotate(${shepherd.rotation}deg)`,
              opacity: shepherd.opacity,
            }}
          />
        ))}
      </div>
    </div>
  )
}
