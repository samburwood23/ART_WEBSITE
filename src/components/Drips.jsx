// Paint running off the bottom of a word. Seeded, so it drips the same way
// on every visit.

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function makeDrips(seed, count, maxLen) {
  const rand = seeded(seed)
  return Array.from({ length: count }, (_, i) => {
    const w = 3 + rand() * 5
    return {
      x: ((i + 0.2 + rand() * 0.6) / count) * 96,
      w,
      len: 8 + Math.pow(rand(), 1.6) * maxLen,
    }
  })
}

export default function Drips({ className, seed = 1, count = 12, maxLen = 70 }) {
  const drips = makeDrips(seed, count, maxLen)
  return (
    <svg className={className} width="100%" height={maxLen + 20} aria-hidden="true">
      {drips.map(({ x, len, w }, i) => (
        <svg key={i} x={`${x}%`} overflow="visible" fill="currentColor">
          <ellipse cx={w / 2} cy="0" rx={w * 1.4} ry={w} />
          <rect x="0" y="-2" width={w} height={len + 2} rx={w / 2} />
          <circle cx={w / 2} cy={len} r={w * 0.78} />
        </svg>
      ))}
    </svg>
  )
}
