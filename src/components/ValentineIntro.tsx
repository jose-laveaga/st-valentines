import { useEffect, useMemo, useState } from 'react'

type IntroPhase = 'flyIn' | 'settle' | 'openFlap' | 'pullLetter' | 'done'

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

  const isDone = phase === 'done'
  const isFlapOpen = phase === 'openFlap' || phase === 'pullLetter' || phase === 'done'
  const isLetterOut = phase === 'pullLetter' || phase === 'done'

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
            <div className={`envelope-flap ${isFlapOpen ? 'flap-open' : ''}`} />
            <div className="envelope-body" />
            <div className={`letter ${isLetterOut ? 'letter-open' : ''}`}>
              <div className="letter-lines" />
            </div>
            <div className={`envelope-fold-bottom ${isLetterOut ? 'bottom-fold-cover' : ''}`} />
            <div className="envelope-fold envelope-fold-left" />
            <div className="envelope-fold envelope-fold-right" />
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
