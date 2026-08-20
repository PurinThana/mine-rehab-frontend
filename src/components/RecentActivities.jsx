import { IconSprout, IconArea, IconBench, IconRain, IconGauge, IconArrow } from './Icons.jsx'

const ACTIVITIES = [
  { icon: IconSprout, title: 'เพาะกล้าเฟื้องฟ้า', date: '23 พ.ค. 2569' },
  { icon: IconArea, title: 'เตรียมดินและปรับพื้นที่', date: '20 พ.ค. 2569' },
  { icon: IconBench, title: 'ปลูกเฟื้องฟ้าระดับชั้น +246', date: '18 พ.ค. 2569' },
  { icon: IconRain, title: 'ให้น้ำและบำรุงรักษา', date: '16 พ.ค. 2569' },
  { icon: IconGauge, title: 'สำรวจภาพรวมพื้นที่ฟื้นฟู', date: '15 พ.ค. 2569' },
]

export default function RecentActivities() {
  return (
    <section id="activities" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">ภาคสนาม</p>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">กิจกรรมล่าสุด</h2>
        </div>
        <a href="#activities-full" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-600">
          ดูกิจกรรมทั้งหมด <IconArrow className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ACTIVITIES.map(({ icon: Icon, title, date }) => (
          <div key={title} className="group overflow-hidden rounded-xl2 border border-forest-700/8 bg-white shadow-card transition-transform hover:-translate-y-0.5">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-forest-600 to-forest-800">
              <Icon className="h-9 w-9 text-sand-50/90" />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold leading-snug text-forest-800">{title}</p>
              <p className="mt-1 text-xs text-soil-500">{date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
