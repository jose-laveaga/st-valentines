const hearts = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 10}s`,
  duration: `${16 + Math.random() * 12}s`,
  size: 14 + Math.round(Math.random() * 22),
}))

export function HeartsBackground() {
  return (
    <div className="hearts-layer" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart"
          style={{
            left: heart.left,
            animationDelay: heart.delay,
            animationDuration: heart.duration,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
          }}
        />
      ))}
    </div>
  )
}
