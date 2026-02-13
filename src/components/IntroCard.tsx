type IntroCardProps = {
  onStart: () => void
}

export function IntroCard({ onStart }: IntroCardProps) {
  return (
    <section className="card fade-in">
      <p className="eyebrow">Valentine Storybook</p>
      <h1>A Little Puzzle for You</h1>
      <p className="subtitle">
        Solve two sweet brain-teasers, unlock the final page, and reveal a little love letter waiting just for
        you.
      </p>
      <button type="button" className="btn btn-primary" onClick={onStart}>
        Start
      </button>
    </section>
  )
}
