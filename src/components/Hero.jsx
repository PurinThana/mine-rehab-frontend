import BenchContours from './BenchContours.jsx'
import ProgressRing from './ProgressRing.jsx'
import { IconArrow } from './Icons.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'
import { formatNumber, formatThaiDate, todayISO } from '../utils/date.js'

export default function Hero() {
  const { overview, benchLevels, speciesTotals, loading } = useSiteData()

  const levels = benchLevels || []
  const elevations = levels.map((l) => Number(l.elevation_m))
  const range =
    elevations.length > 0 ? { base: Math.min(...elevations), top: Math.max(...elevations) } : null

  const speciesCount = (speciesTotals || []).length
  const coverage = Number(overview?.coverage_pct) || 0

  const trust = [
    'ฟื้นฟูตามหลักวิชาการเหมืองแร่',
    speciesCount ? `พืชคลุมดินท้องถิ่น ${formatNumber(speciesCount)} ชนิด` : 'พืชคลุมดินท้องถิ่น',
    'ข้อมูลเปิดเผย อัปเดตทุกเดือน',
  ]

  return (
    <section id="home" className="relative overflow-hidden bg-forest-800">
      {/* faint oversized contour ring, purely atmospheric */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full border border-sand-50/5" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full border border-sand-50/5" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-bloom-500/40 bg-bloom-500/10 px-3 py-1 text-xs font-medium tracking-wide text-bloom-400">
            ศูนย์ข้อมูลเปิด · อัปเดตข้อมูล ณ วันที่ {formatThaiDate(todayISO())}
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.15] text-sand-50 sm:text-5xl lg:text-[3.25rem]">
            ฟื้นฟูพื้นที่เหมือง
            <br />
            ทีละระดับชั้น จนครบทั้งภูเขา
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand-100/80 sm:text-lg">
            ติดตามแผนฟื้นฟู ความก้าวหน้า และข้อมูลการปลูกพืชคลุมดินของแต่ละระดับชั้น (Bench)
            {range ? ` ตั้งแต่ระดับ +${range.base} ถึง +${range.top} เมตร` : ''}{' '}
            แบบเปิดเผยและตรวจสอบย้อนหลังได้ทุกขั้นตอน
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#bench"
              className="inline-flex items-center gap-2 rounded-full bg-clay-600 px-6 py-3 text-sm font-semibold text-sand-50 shadow-card transition-colors hover:bg-clay-700"
            >
              ดูแผนฟื้นฟูทั้งหมด
              <IconArrow />
            </a>
            <a
              href="#overview"
              className="inline-flex items-center gap-2 rounded-full border border-sand-50/25 px-6 py-3 text-sm font-semibold text-sand-50 transition-colors hover:bg-sand-50/10"
            >
              ดูความก้าวหน้าล่าสุด
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {trust.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-sand-100/70">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <BenchContours className="w-full drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]" />

          <div className="absolute -bottom-6 left-1/2 flex w-[calc(100%-1rem)] max-w-xs -translate-x-1/2 items-center gap-4 rounded-xl2 border border-forest-700/10 bg-sand-50 p-4 shadow-card sm:-right-8 sm:left-auto sm:bottom-6 sm:translate-x-0">
            {loading || !overview ? (
              <>
                <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-forest-700/10" />
                <div className="flex-1">
                  <div className="h-4 w-28 animate-pulse rounded bg-forest-700/10" />
                  <div className="mt-2 h-3 w-36 animate-pulse rounded bg-forest-700/5" />
                </div>
              </>
            ) : (
              <>
                <ProgressRing percent={coverage} size={64} stroke={7} label={`${coverage}%`} />
                <div>
                  <p className="text-sm font-semibold text-forest-800">ความคืบหน้ารวม</p>
                  <p className="mt-0.5 text-xs text-soil-500">
                    ปลูกแล้ว {formatNumber(overview.planted_benches)} จาก{' '}
                    {formatNumber(overview.total_benches)} ระดับชั้น
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
