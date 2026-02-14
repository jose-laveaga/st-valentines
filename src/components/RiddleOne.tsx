import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { PuppySadAnimation } from './PuppySadAnimation'

const RIDDLE_1_SOLUTION = '451'

type RiddleOneProps = {
  hint: string
  onSolved: () => void
}

const clues = ['123', '532', '342', '235']

export function RiddleOne({ hint, onSolved }: RiddleOneProps) {
  const [digits, setDigits] = useState(['', '', ''])
  const [showHint, setShowHint] = useState(false)
  const [showPuppies, setShowPuppies] = useState(false)
  const [solved, setSolved] = useState(false)

  const isComplete = useMemo(() => digits.every((digit) => /^[1-5]$/.test(digit)), [digits])

  const updateDigit = (position: number, value: string) => {
    const next = value.replace(/[^1-5]/g, '').slice(-1)
    setDigits((current) => current.map((digit, index) => (index === position ? next : digit)))
  }

  const submitAnswer = (event: FormEvent) => {
    event.preventDefault()

    if (!isComplete) return

    const value = digits.join('')

    if (value === RIDDLE_1_SOLUTION) {
      setSolved(true)
      window.setTimeout(onSolved, 1000)
      return
    }

    setShowPuppies(true)
  }

  return (
    <section className={`card card-terminal step-transition ${solved ? 'success-glow' : ''}`}>
      <h2>Riddle I — The Hidden Lock</h2>
      <p className="subtitle">
        There is a three-digit code where only digits 1 through 5 are possible. In each clue, exactly one digit is
        correct—but never in the correct position.
      </p>
      <div className="clue-grid">
        {clues.map((clue) => (
          <div key={clue} className="clue-chip">
            {clue}
          </div>
        ))}
      </div>
      <form onSubmit={submitAnswer} className="digit-form">
        <div className="digit-row">
          {digits.map((digit, index) => (
            <input
              key={index}
              inputMode="numeric"
              maxLength={1}
              pattern="[1-5]"
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              className="digit-slot"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={!isComplete || solved}>
          Submit
        </button>
      </form>
      <button type="button" className="btn btn-ghost" onClick={() => setShowHint((value) => !value)}>
        {showHint ? 'Hide hint' : 'Show hint'}
      </button>
      {showHint && <p className="hint-box">💡 {hint}</p>}
      {solved && <p className="success-note">✓ Correct. Unlocking the next page...</p>}
      <PuppySadAnimation active={showPuppies} onDone={() => setShowPuppies(false)} />
    </section>
  )
}
