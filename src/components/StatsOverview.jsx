import ProgressRing from './ProgressRing.jsx'
import { IconBench, IconSprout, IconArea, IconTree, IconClock } from './Icons.jsx'

const STATS = [
  { icon: IconBench, value: '11', unit: 'ระดับชั้น', label: 'จำนวนระดับชั้น (Bench)', tone: 'forest' },
  { icon: IconSprout, value: '7', unit: 'ระดับชั้น', label: 'ปลูกแล้ว', tone: 'forest' },
  { icon: IconClock, value: '4', unit: 'ระดับชั้น', label: 'ยังไม่ได้ปลูก', tone: 'clay' },
  { icon: IconArea, value: '3,747', unit: 'ตร.ม.', label: 'พื้นที่ฟื้นฟูรวม', tone: 'forest' },
  { icon: IconTree, value: '3,123', unit: 'ต้น', label: 'จำนวนต้นไม้รวม', tone: 'forest' },
]

const toneClasses = {
  forest: 'bg-forest-700/8 text-forest-700',
  clay: 'bg-clay-600/10 text-clay-600',
}

export default function StatsOverview() {
  return (
    <section id="overview" className="border-b border-forest-700/8 bg-sand-50">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">ภาพรวมความก้าวหน้า</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">ข้อมูล ณ วันที่ 24 พฤษภาคม 2569</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map(({ icon: Icon, value, unit, label, tone }) => (
            <div
              key={label}
              className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
            >
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="tick-num mt-4 font-display text-2xl font-semibold text-forest-800">
                {value} <span className="text-sm font-medium text-soil-500">{unit}</span>
              </p>
              <p className="mt-1 text-sm text-soil-500">{label}</p>
            </div>
          ))}

          <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <ProgressRing percent={83} size={52} stroke={6} label="83%" labelClassName="text-sm text-forest-800" />
              <div>
                <p className="text-sm font-semibold text-forest-800">ความคืบหน้ารวม</p>
                <p className="mt-0.5 text-xs text-soil-500">4 ชนิดพืชคลุมดิน</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
