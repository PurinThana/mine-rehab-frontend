import { IconClock, IconSun, IconRain } from './Icons.jsx'

export default function InfoStrip() {
  return (
    <section className="bg-sand-100/60">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-forest-700">
            <IconClock className="h-5 w-5" />
            <p className="text-sm font-semibold">ระยะเวลาดำเนินงาน</p>
          </div>
          <p className="mt-3 font-display text-lg font-semibold text-forest-800">1 ก.พ. 2568 – 31 ม.ค. 2572</p>
          <p className="mt-1 text-sm text-soil-500">รวม 4 ปี · ผ่านไปแล้ว 1 ปี 3 เดือน</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sand-100">
            <div className="h-full rounded-full bg-forest-500" style={{ width: '31%' }} />
          </div>
        </div>

        <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-clay-600">
            <IconSun className="h-5 w-5" />
            <p className="text-sm font-semibold">แผนช่วงหน้าร้อน</p>
          </div>
          <p className="mt-3 text-sm text-soil-600">มีนาคม – พฤษภาคม</p>
          <p className="mt-1 text-sm text-soil-500">เน้นให้น้ำและบำรุงรักษาต้นกล้าที่ปลูกแล้ว</p>
        </div>

        <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-forest-600">
            <IconRain className="h-5 w-5" />
            <p className="text-sm font-semibold">แผนช่วงหน้าฝน</p>
          </div>
          <p className="mt-3 text-sm text-soil-600">มิถุนายน – ตุลาคม</p>
          <p className="mt-1 text-sm text-soil-500">ปลูกเพิ่มในระดับชั้นที่เหลือและซ่อมแซมพื้นที่ปลูก</p>
        </div>
      </div>
    </section>
  )
}
