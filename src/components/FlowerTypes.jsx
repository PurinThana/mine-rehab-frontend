import { IconBloom, IconArrow, IconAlert } from './Icons.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'
import { formatNumber } from '../utils/date.js'

export default function FlowerTypes() {
  const { speciesTotals, loading, error } = useSiteData()

  const species = speciesTotals || []
  const totalTrees = species.reduce((sum, s) => sum + Number(s.total_trees), 0)

  return (
    <section id="species" className="bg-sand-100/50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">พืชคลุมดิน</p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">ชนิดเฟื่องฟ้าที่ใช้ปลูก</h2>
            <p className="mt-2 max-w-2xl text-sm text-soil-500">
              {loading || error || species.length === 0
                ? 'เลือกใช้พืชคลุมดินท้องถิ่นเพื่อยึดหน้าดินและฟื้นระบบนิเวศเดิม'
                : `เลือกใช้เฟื่องฟ้า ${formatNumber(species.length)} สายพันธุ์เพื่อยึดหน้าดินและฟื้นระบบนิเวศเดิม รวม ${formatNumber(totalTrees)} ต้นในพื้นที่ที่ปลูกแล้ว`}
            </p>
          </div>
          <a href="#species-full" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-600">
            ดูข้อมูลชนิดพืชทั้งหมด <IconArrow className="h-3.5 w-3.5" />
          </a>
        </div>

        {error ? (
          <p className="flex items-center justify-center gap-2 rounded-xl2 border border-clay-500/25 bg-clay-400/5 px-5 py-10 text-sm text-clay-700">
            <IconAlert className="h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card">
                <div className="h-9 w-9 animate-pulse rounded-full bg-forest-700/10" />
                <div className="mt-4 h-3.5 w-full animate-pulse rounded bg-forest-700/10" />
                <div className="mt-2 h-5 w-20 animate-pulse rounded bg-forest-700/5" />
              </div>
            ))}
          </div>
        ) : species.length === 0 ? (
          <p className="rounded-xl2 border border-forest-700/8 bg-white px-5 py-10 text-center text-sm text-soil-500 shadow-card">
            ยังไม่มีข้อมูลการปลูกพืชคลุมดิน
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {species.map((s) => (
              <div
                key={s.species_id}
                className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <IconBloom className="h-9 w-9" color={s.color_hex} />
                <p className="mt-4 text-sm font-semibold text-forest-800">{s.name_th}</p>
                <p className="tick-num mt-1 font-display text-lg font-semibold text-soil-700">
                  {formatNumber(s.total_trees)}{' '}
                  <span className="font-body text-xs font-normal text-soil-500">ต้น</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
