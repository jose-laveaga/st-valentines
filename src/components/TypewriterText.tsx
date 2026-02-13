import { useEffect, useMemo, useState } from 'react'

type TypewriterTextProps = {
  text: string
  isActive: boolean
  speed?: number
}

export function TypewriterText({ text, isActive, speed = 24 }: TypewriterTextProps) {
  const chars = useMemo(() => Array.from(text), [text])
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!isActive || visibleCount >= chars.length) return

    const timeout = window.setTimeout(() => {
      setVisibleCount((count) => count + 1)
    }, speed)

    return () => window.clearTimeout(timeout)
  }, [chars.length, isActive, speed, visibleCount])

  return <p className="letter-body">{chars.slice(0, visibleCount).join('')}</p>
}
