import { IconBloom, IconArrow } from './Icons.jsx'

const SPECIES = [
  { name: 'เฟื้องฟ้าสีส้ม', trees: '489', color: '#C1723C' },
  { name: 'เฟื้องฟ้าสีชมพู', trees: '760', color: '#C4557A' },
  { name: 'เฟื้องฟ้าสีขาวปลายชมพู', trees: '1,105', color: '#D9A9BE' },
  { name: 'เฟื้องฟ้าสีแดง', trees: '1,393', color: '#B03A3A' },
]

export default function FlowerTypes() {
  return (
    <section id="species" className="bg-sand-100/50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">พืชคลุมดิน</p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">ชนิดเฟื้องฟ้าที่ใช้ปลูก</h2>
            <p className="mt-2 max-w-2xl text-sm text-soil-500">
              เลือกใช้เฟื้องฟ้า 4 สายพันธุ์เพื่อยึดหน้าดินและฟื้นระบบนิเวศเดิม รวม 3,747 ต้นในพื้นที่ที่ปลูกแล้ว
            </p>
          </div>
          <a href="#species-full" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-600">
            ดูข้อมูลชนิดพืชทั้งหมด <IconArrow className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SPECIES.map((s) => (
            <div key={s.name} className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5">
              <IconBloom className="h-9 w-9" color={s.color} />
              <p className="mt-4 text-sm font-semibold text-forest-800">{s.name}</p>
              <p className="tick-num mt-1 text-lg font-display font-semibold text-soil-700">
                {s.trees} <span className="text-xs font-body font-normal text-soil-500">ต้น</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
