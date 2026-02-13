import { useEffect } from 'react'

type PuppySadAnimationProps = {
  active: boolean
  onDone?: () => void
}

const puppyCount = 3

export function PuppySadAnimation({ active, onDone }: PuppySadAnimationProps) {
  useEffect(() => {
    if (!active) return

    const timeout = window.setTimeout(() => {
      onDone?.()
    }, 2000)

    return () => window.clearTimeout(timeout)
  }, [active, onDone])

  if (!active) return null

  return (
    <div className="puppy-overlay" role="status" aria-live="polite">
      <div className="puppy-row">
        {Array.from({ length: puppyCount }).map((_, index) => (
          <div className="puppy" style={{ animationDelay: `${index * 0.12}s` }} key={index}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <ellipse cx="60" cy="76" rx="32" ry="28" fill="#f5d7ba" />
              <circle cx="60" cy="47" r="30" fill="#f9e1c7" />
              <ellipse cx="35" cy="42" rx="10" ry="15" fill="#e8bb93" />
              <ellipse cx="85" cy="42" rx="10" ry="15" fill="#e8bb93" />
              <circle cx="49" cy="46" r="3" fill="#503b2f" />
              <circle cx="71" cy="46" r="3" fill="#503b2f" />
              <ellipse cx="60" cy="56" rx="8" ry="6" fill="#7f5f4f" />
              <path d="M49 66 Q60 74 71 66" stroke="#7f5f4f" strokeWidth="4" fill="none" strokeLinecap="round" />
              <ellipse className="tear" cx="48" cy="57" rx="2.5" ry="5" fill="#90c9e9" />
              <ellipse className="tear" cx="72" cy="57" rx="2.5" ry="5" fill="#90c9e9" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
