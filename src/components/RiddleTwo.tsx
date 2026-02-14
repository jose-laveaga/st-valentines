import { useState } from 'react'
import { PuppySadAnimation } from './PuppySadAnimation'

const RIDDLE_2_SOLUTION = 'B'

type RiddleTwoProps = {
  hint: string
  onSolved: () => void
}

const chests = [
  { id: 'A', statement: 'The gold is in here.' },
  { id: 'B', statement: 'The gold is in chest A or D.' },
  { id: 'C', statement: 'The gold is not in here.' },
  { id: 'D', statement: 'The gold is in here.' },
]

export function RiddleTwo({ hint, onSolved }: RiddleTwoProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showPuppies, setShowPuppies] = useState(false)
  const [solved, setSolved] = useState(false)

  const check = () => {
    if (!selected) return

    if (selected === RIDDLE_2_SOLUTION) {
      setSolved(true)
      window.setTimeout(onSolved, 1000)
      return
    }

    setShowPuppies(true)
  }

  return (
    <section className={`card step-transition ${solved ? 'success-glow' : ''}`}>
      <h2>Riddle II — The Four Chests</h2>
      <p className="subtitle">Exactly one chest has gold, and only one statement below is true.</p>
      <div className="chest-grid">
        {chests.map((chest) => (
          <button
            type="button"
            key={chest.id}
            className={`chest-card ${selected === chest.id ? 'active' : ''} ${solved && selected === chest.id ? 'solved' : ''}`}
            onClick={() => setSelected(chest.id)}
          >
            <span className="chest-label">Chest {chest.id}</span>
            <span>{chest.statement}</span>
          </button>
        ))}
      </div>
      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={check} disabled={!selected || solved}>
          Check
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setShowHint((value) => !value)}>
          {showHint ? 'Hide hint' : 'Show hint'}
        </button>
      </div>
      {showHint && <p className="hint-box">💡 {hint}</p>}
      {solved && <p className="success-note">✓ You found the truthful chest. Opening the letter...</p>}
      <PuppySadAnimation active={showPuppies} onDone={() => setShowPuppies(false)} />
    </section>
  )
}
