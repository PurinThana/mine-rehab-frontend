// Top-down contour rendering of the terraced bench levels shown in the
// operational data (elevation +210 through +270). Outer rings read as
// still-bare soil, inner rings as planted cover — the same story the
// bench table tells, drawn instead of typed.

const RINGS = [
  { r: 168, fill: '#C1723C', opacity: 0.16 }, // +210 – not yet planted
  { r: 150, fill: '#C1723C', opacity: 0.22 }, // +216
  { r: 132, fill: '#CB8354', opacity: 0.26 }, // +222
  { r: 114, fill: '#CB8354', opacity: 0.3 },  // +228
  { r: 96, fill: '#AECEB2', opacity: 0.55 },  // +234 – planted
  { r: 80, fill: '#8FC29B', opacity: 0.65 },  // +240
  { r: 65, fill: '#6BAE7E', opacity: 0.75 },  // +246
  { r: 51, fill: '#4E8F66', opacity: 0.85 },  // +252
  { r: 38, fill: '#3F8F5F', opacity: 0.92 },  // +258
  { r: 26, fill: '#2C6B47', opacity: 1 },     // +264
  { r: 15, fill: '#1F4D3A', opacity: 1 },     // +270 summit
]

// Fixed, deterministic "tree" scatter so the render is stable.
const TREES = [
  [40, 100], [-55, 92], [10, 130], [70, 60], [-70, 40], [30, 150],
  [-30, 145], [90, 20], [-95, 10], [0, -40], [45, -95], [-40, -100],
  [-90, -35], [100, -60], [-110, -70], [120, 40], [-120, 90], [60, 120],
]

export default function BenchContours({ className = '' }) {
  return (
    <svg viewBox="-190 -190 380 380" className={className} role="img" aria-label="แผนผังระดับชั้นการฟื้นฟูแบบวงรอบจากมุมสูง">
      <circle r="182" fill="#EFE9D9" />
      {RINGS.map((ring, i) => (
        <circle key={i} r={ring.r} fill={ring.fill} opacity={ring.opacity} />
      ))}
      {/* contour stroke lines to read as topography */}
      {RINGS.map((ring, i) => (
        <circle key={`s-${i}`} r={ring.r} fill="none" stroke="#F7F4EC" strokeOpacity="0.5" strokeWidth="1.5" />
      ))}
      {/* access road spiral */}
      <path
        d="M -182 0 A182 182 0 0 1 0 -182"
        fill="none"
        stroke="#F7F4EC"
        strokeOpacity="0.65"
        strokeWidth="4"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      {TREES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill="#0F241B" fillOpacity="0.55" />
      ))}
      <circle r="6" fill="#F7F4EC" />
    </svg>
  )
}
