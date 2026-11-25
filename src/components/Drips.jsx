// Paint running off the bottom of a word. Positions are fixed so it
// drips the same way on every visit.

const DRIPS = [
  { x: 6, len: 22, w: 5 },
  { x: 14, len: 46, w: 6 },
  { x: 27, len: 14, w: 4 },
  { x: 38, len: 62, w: 7 },
  { x: 49, len: 26, w: 4 },
  { x: 61, len: 38, w: 6 },
  { x: 73, len: 12, w: 4 },
  { x: 82, len: 54, w: 6 },
  { x: 93, len: 20, w: 5 },
]

export default function Drips({ className }) {
  return (
    <svg className={className} width="100%" height="76" aria-hidden="true">
      {DRIPS.map(({ x, len, w }) => (
        <svg key={x} x={`${x}%`} overflow="visible" fill="currentColor">
          <rect x="0" y="-4" width={w} height={len + 4} rx={w / 2} />
          <circle cx={w / 2} cy={len} r={w * 0.8} />
        </svg>
      ))}
    </svg>
  )
}
