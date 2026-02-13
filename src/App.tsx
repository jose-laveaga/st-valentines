import { useEffect, useMemo, useState } from 'react'
import { HeartsBackground } from './components/HeartsBackground'
import { IntroCard } from './components/IntroCard'
import { LetterReveal } from './components/LetterReveal'
import { RiddleOne } from './components/RiddleOne'
import { RiddleTwo } from './components/RiddleTwo'
import hints from './data/hints.json'
import letter from './data/letter.json'

type AppProgress = {
  currentStep: 1 | 2 | 3 | 4
  riddle1Solved: boolean
  riddle2Solved: boolean
}

const STORAGE_KEY = 'valentine-puzzle-progress'
const STAGE_FADE_OUT_MS = 480
const STAGE_TRANSITION_TOTAL_MS = 980

const defaultProgress: AppProgress = {
  currentStep: 1,
  riddle1Solved: false,
  riddle2Solved: false,
}

function loadProgress(): AppProgress {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultProgress

  try {
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    return defaultProgress
  }
}

function App() {
  const [progress, setProgress] = useState<AppProgress>(() => loadProgress())
  const [displayStep, setDisplayStep] = useState<AppProgress['currentStep']>(progress.currentStep)
  const [isStageTransitioning, setIsStageTransitioning] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    if (displayStep === progress.currentStep) return

    const startTimeout = window.setTimeout(() => {
      setIsStageTransitioning(true)
    }, 0)

    const swapTimeout = window.setTimeout(() => {
      setDisplayStep(progress.currentStep)
    }, STAGE_FADE_OUT_MS)

    const doneTimeout = window.setTimeout(() => {
      setIsStageTransitioning(false)
    }, STAGE_TRANSITION_TOTAL_MS)

    return () => {
      window.clearTimeout(startTimeout)
      window.clearTimeout(swapTimeout)
      window.clearTimeout(doneTimeout)
    }
  }, [displayStep, progress.currentStep])

  const stepContent = useMemo(() => {
    switch (displayStep) {
      case 1:
        return <IntroCard onStart={() => setProgress((prev) => ({ ...prev, currentStep: 2 }))} />
      case 2:
        return (
          <RiddleOne
            hint={hints.riddle1}
            onSolved={() => setProgress({ currentStep: 3, riddle1Solved: true, riddle2Solved: false })}
          />
        )
      case 3:
        return (
          <RiddleTwo
            hint={hints.riddle2}
            onSolved={() => setProgress({ currentStep: 4, riddle1Solved: true, riddle2Solved: true })}
          />
        )
      case 4:
      default:
        return (
          <LetterReveal
            title={letter.title}
            body={letter.body}
            onRestart={() => {
              window.localStorage.removeItem(STORAGE_KEY)
              setProgress(defaultProgress)
            }}
          />
        )
    }
  }, [displayStep])

  return (
    <main className="app-shell">
      <HeartsBackground />
      <div className="content-wrap">
        <p className="step-indicator">Step {progress.currentStep} of 4</p>
        <div className={`stage-frame ${isStageTransitioning ? 'is-transitioning' : ''}`} key={displayStep}>
          {stepContent}
        </div>
      </div>
    </main>
  )
}

export default App
