// A sprayed halo with a spiral scratched through it, after the marks in the work.
// The wobble is seeded so it draws the same way every time.

function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function spiral(rand, { turns, r0, r1, cx, cy, jitter }) {
  const steps = turns * 90
  let d = ''
  let wobble = 0
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = t * turns * Math.PI * 2
    wobble += (rand() - 0.5) * jitter
    wobble *= 0.9
    const r = r0 + (r1 - r0) * t + wobble
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r * 0.86
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

const rand = seeded(7)
const strands = [0, 1, 2, 3].map(n =>
  spiral(rand, { turns: 7, r0: 3 + n * 1.5, r1: 118 + n * 4, cx: 200, cy: 200, jitter: 1.8 })
)

export default function Scratch({ className }) {
  return (
    <svg className={className} viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <filter id="spray" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <circle cx="200" cy="200" r="150" fill="none" stroke="var(--paint-teal)" strokeWidth="30" opacity="0.4" filter="url(#spray)" />
      <circle cx="214" cy="190" r="70" fill="var(--paint-plum)" opacity="0.6" filter="url(#spray)" />
      {strands.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--color-text)" strokeWidth={i === 0 ? 1.3 : 0.8} opacity={i === 0 ? 0.55 : 0.3} strokeLinecap="round" />
      ))}
    </svg>
  )
}
