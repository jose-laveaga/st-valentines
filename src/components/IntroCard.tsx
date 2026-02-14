import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import wornPaper from '../assets/worn-paper.svg'

type IntroCardProps = {
  onStart: () => void
}

export function IntroCard({ onStart }: IntroCardProps) {
  const [landed, setLanded] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const landTimeout = window.setTimeout(() => {
      setLanded(true)
    }, 90)

    const openTimeout = window.setTimeout(() => {
      setOpened(true)
    }, 980)

    return () => {
      window.clearTimeout(landTimeout)
      window.clearTimeout(openTimeout)
    }
  }, [])

  return (
    <section
      className={`intro-note ${landed ? 'note-landed' : ''} ${opened ? 'note-opened' : ''}`}
      style={{ '--paper-texture': `url(${wornPaper})` } as CSSProperties}
    >
      <span className="note-flap" aria-hidden="true" />
      <div className="intro-content">
        <p className="eyebrow">Valentine Storybook</p>
        <h1>A Little Puzzle for You</h1>
        <p className="subtitle">
          Solve two sweet brain-teasers, unlock the final page, and reveal a little love letter waiting just for you.
        </p>
        <button type="button" className="btn btn-primary" onClick={onStart}>
          Start
        </button>
      </div>
    </section>
  )
}
