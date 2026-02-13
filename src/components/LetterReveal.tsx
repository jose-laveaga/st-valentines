import { useState } from 'react'
import { TypewriterText } from './TypewriterText'

type LetterRevealProps = {
  title: string
  body: string
  onRestart: () => void
}

export function LetterReveal({ title, body, onRestart }: LetterRevealProps) {
  const [opened, setOpened] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  return (
    <section className="card fade-in">
      <h2>Final Page — Love Letter</h2>
      {!opened ? (
        <button type="button" className="envelope" onClick={() => setOpened(true)}>
          <span className="envelope-flap" />
          <span className="envelope-heart">❤</span>
          <span className="envelope-label">Tap to open</span>
        </button>
      ) : (
        <article className="letter-sheet">
          <h3>{title}</h3>
          <TypewriterText key={replayKey} text={body} isActive={opened} />
        </article>
      )}
      <div className="button-row">
        <button type="button" className="btn btn-ghost" onClick={() => setReplayKey((value) => value + 1)} disabled={!opened}>
          Replay animation
        </button>
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          Restart
        </button>
      </div>
    </section>
  )
}
