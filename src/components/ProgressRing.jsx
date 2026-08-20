export default function ProgressRing({
  percent = 0,
  size = 88,
  stroke = 9,
  trackColor = '#EFE9D9',
  color = '#3F8F5F',
  label,
  sub,
  labelClassName = 'text-forest-800',
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-display text-lg font-semibold leading-none ${labelClassName}`}>
          {label ?? `${percent}%`}
        </span>
        {sub && <span className="mt-1 text-[10px] text-soil-500">{sub}</span>}
      </div>
    </div>
  )
}
