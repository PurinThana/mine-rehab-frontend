import ProgressRing from './ProgressRing.jsx'
import { IconBench, IconSprout, IconArea, IconTree, IconClock, IconAlert } from './Icons.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'
import { formatNumber, formatThaiDate, todayISO } from '../utils/date.js'

const toneClasses = {
  forest: 'bg-forest-700/8 text-forest-700',
  clay: 'bg-clay-600/10 text-clay-600',
}

function StatCard({ icon: Icon, value, unit, label, tone }) {
  return (
    <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="tick-num mt-4 font-display text-2xl font-semibold text-forest-800">
        {value} <span className="text-sm font-medium text-soil-500">{unit}</span>
      </p>
      <p className="mt-1 text-sm text-soil-500">{label}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card">
      <div className="h-9 w-9 animate-pulse rounded-lg bg-forest-700/10" />
      <div className="mt-4 h-7 w-24 animate-pulse rounded bg-forest-700/10" />
      <div className="mt-2 h-3.5 w-full animate-pulse rounded bg-forest-700/5" />
    </div>
  )
}

export default function StatsOverview() {
  const { overview, speciesTotals, loading, error, reload } = useSiteData()

  const speciesCount = (speciesTotals || []).length

  return (
    <section id="overview" className="border-b border-forest-700/8 bg-sand-50">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">ภาพรวมความก้าวหน้า</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              {/* ตัวเลขทั้งแถบคำนวณสดจากฐานข้อมูล จึงเป็นข้อมูล ณ วันนี้เสมอ */}
              ข้อมูล ณ วันที่ {formatThaiDate(todayISO())}
            </h2>
          </div>
        </div>

        {error ? (
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl2 border border-clay-500/25 bg-clay-400/5 px-5 py-10 text-sm text-clay-700">
            <span className="flex items-center gap-2">
              <IconAlert className="h-4 w-4 shrink-0" />
              {error}
            </span>
            <button
              type="button"
              onClick={reload}
              className="rounded-lg border border-clay-500/30 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-clay-400/10"
            >
              ลองอีกครั้ง
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {loading || !overview ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <StatCard
                  icon={IconBench}
                  value={formatNumber(overview.total_benches)}
                  unit="ระดับชั้น"
                  label="จำนวนระดับชั้น (Bench)"
                  tone="forest"
                />
                <StatCard
                  icon={IconSprout}
                  value={formatNumber(overview.planted_benches)}
                  unit="ระดับชั้น"
                  label="ปลูกแล้ว"
                  tone="forest"
                />
                <StatCard
                  icon={IconClock}
                  value={formatNumber(overview.not_planted_benches)}
                  unit="ระดับชั้น"
                  label="ยังไม่ได้ปลูก"
                  tone="clay"
                />
                <StatCard
                  icon={IconArea}
                  value={formatNumber(overview.total_area_sqm)}
                  unit="ตร.ม."
                  label="พื้นที่ฟื้นฟูรวม"
                  tone="forest"
                />
                <StatCard
                  icon={IconTree}
                  value={formatNumber(overview.total_trees)}
                  unit="ต้น"
                  label="จำนวนต้นไม้รวม"
                  tone="forest"
                />

                <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center gap-3">
                    <ProgressRing
                      percent={Number(overview.coverage_pct) || 0}
                      size={52}
                      stroke={6}
                      label={`${Number(overview.coverage_pct) || 0}%`}
                      labelClassName="text-sm text-forest-800"
                    />
                    <div>
                      <p className="text-sm font-semibold text-forest-800">ความคืบหน้ารวม</p>
                      <p className="mt-0.5 text-xs text-soil-500">
                        {speciesCount ? `${speciesCount} ชนิดพืชคลุมดิน` : 'ยังไม่มีข้อมูลการปลูก'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
