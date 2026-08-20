import { IconClock, IconSun, IconRain } from './Icons.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'
import { formatThaiDate, projectDuration } from '../utils/date.js'

export default function InfoStrip() {
  const { site, loading } = useSiteData()

  const duration = site ? projectDuration(site.start_date, site.end_date) : null

  return (
    <section className="bg-sand-100/60">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div className="rounded-xl2 border border-forest-700/8 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-forest-700">
            <IconClock className="h-5 w-5" />
            <p className="text-sm font-semibold">ระยะเวลาดำเนินงาน</p>
          </div>

          {loading || !site ? (
            <>
              <div className="mt-3 h-6 w-56 animate-pulse rounded bg-forest-700/10" />
              <div className="mt-2 h-4 w-40 animate-pulse rounded bg-forest-700/5" />
              <div className="mt-3 h-2 w-full rounded-full bg-sand-100" />
            </>
          ) : (
            <>
              <p className="mt-3 font-display text-lg font-semibold text-forest-800">
                {formatThaiDate(site.start_date)} – {formatThaiDate(site.end_date)}
              </p>
              <p className="mt-1 text-sm text-soil-500">
                {duration
                  ? duration.finished
                    ? `รวม ${duration.totalLabel} · สิ้นสุดโครงการแล้ว`
                    : `รวม ${duration.totalLabel} · ผ่านไปแล้ว ${duration.elapsedLabel}`
                  : 'ยังไม่ได้ระบุช่วงเวลาโครงการ'}
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sand-100">
                <div
                  className="h-full rounded-full bg-forest-500 transition-[width] duration-500"
                  style={{ width: `${duration?.percent ?? 0}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/*
          แผนตามฤดูกาลเป็นเนื้อหาเชิงบรรยาย ไม่มีตารางรองรับในฐานข้อมูล
          จึงยังเป็นข้อความคงที่ — ถ้าต้องการให้แก้ได้จากหน้าแอดมิน
          ต้องเพิ่มตารางใหม่ (เช่น seasonal_plans) ก่อน
        */}
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
