import { useEffect, useMemo, useState } from 'react'

type IntroPhase = 'flyIn' | 'settle' | 'open' | 'done'

export function ValentineIntro() {
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  const [phase, setPhase] = useState<IntroPhase>(prefersReducedMotion ? 'done' : 'flyIn')

  useEffect(() => {
    if (phase === 'done') return

    const timers: number[] = []

    if (phase === 'flyIn') {
      timers.push(window.setTimeout(() => setPhase('settle'), 3000))
    } else if (phase === 'settle') {
      timers.push(window.setTimeout(() => setPhase('open'), 650))
    } else if (phase === 'open') {
      timers.push(window.setTimeout(() => setPhase('done'), 1450))
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [phase])

  const isDone = phase === 'done'
  const isOpening = phase === 'open' || phase === 'done'

  return (
    <div className="intro-layer">
      {!isDone && (
        <button className="skip-button" onClick={() => setPhase('done')}>
          Skip animation
        </button>
      )}

      <div className={`scene-stage phase-${phase}`}>
        <div className={`envelope-scene ${isDone ? 'is-hidden' : ''}`} aria-hidden="true">
          <div className="envelope">
            <div className="envelope-body" />
            <div className={`letter ${isOpening ? 'letter-open' : ''}`} />
            <div className="envelope-fold envelope-fold-left" />
            <div className="envelope-fold envelope-fold-right" />
            <div className={`envelope-flap ${isOpening ? 'flap-open' : ''}`} />
          </div>
        </div>

        <article className={`love-card ${isDone ? 'card-visible' : ''}`}>
          <p className="card-kicker">For my favorite person</p>
          <h1>Happy Valentine&apos;s Day 💌</h1>
          <p>
            You make ordinary days feel magical. Thank you for your warmth, kindness, and the
            little moments that mean everything.
          </p>
          <button className="card-button">Open a little surprise</button>
        </article>
      </div>
    </div>
  )
}
