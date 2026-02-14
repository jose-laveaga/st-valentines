import { HeartsBackground } from './components/HeartsBackground'
import { ValentineIntro } from './components/ValentineIntro'

function App() {
  return (
    <main className="valentine-app">
      <div className="matcha-base" aria-hidden="true" />
      <div className="texture-layer" aria-hidden="true" />
      <HeartsBackground />
      <ValentineIntro />
    </main>
  )
}

export default App
