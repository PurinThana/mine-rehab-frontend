import { IconDoc, IconPin, IconPhone, IconMail, IconArrow, ContourMark } from './Icons.jsx'

const NEWS = [
  { date: '24 พ.ค. 2569', title: 'รายงานความก้าวหน้าการฟื้นฟู ประจำเดือนพฤษภาคม 2569' },
  { date: '18 พ.ค. 2569', title: 'การปลูกเฟื้องฟ้าระดับชั้น +246 และแผนดูแลช่วงหน้าฝน' },
  { date: '10 พ.ค. 2569', title: 'จัดอบรมทีมดูแลและบำรุงรักษาต้นเฟื้องฟ้า ครั้งที่ 2/2569' },
]

const FILES = [
  { title: 'แผนฟื้นฟูพื้นที่เหมือง (ฉบับสมบูรณ์)', size: 'PDF · 4.2 MB' },
  { title: 'รายงานความก้าวหน้าการฟื้นฟู (รายเดือน)', size: 'PDF · 2.1 MB' },
  { title: 'แผนการปลูกต้นไม้ตามระดับชั้น (Bench)', size: 'PDF · 1.8 MB' },
  { title: 'คู่มือการปลูกและบำรุงรักษาเฟื้องฟ้า', size: 'PDF · 3.6 MB' },
]

export default function NewsDownloads() {
  return (
    <section id="news" className="bg-sand-100/50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* news */}
          <div className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-800">ข่าวสารและประกาศ</h3>
              <a href="#news-full" className="text-xs font-semibold text-forest-700 hover:text-forest-600">ดูทั้งหมด</a>
            </div>
            <ul className="space-y-4">
              {NEWS.map((n) => (
                <li key={n.title} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                  <div>
                    <p className="text-xs text-soil-400">{n.date}</p>
                    <p className="text-sm leading-snug text-soil-700">{n.title}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* downloads */}
          <div id="report" className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-800">ดาวน์โหลดเอกสาร</h3>
              <a href="#files-full" className="text-xs font-semibold text-forest-700 hover:text-forest-600">ดูทั้งหมด</a>
            </div>
            <ul className="space-y-1">
              {FILES.map((f) => (
                <li key={f.title}>
                  <a href="#file" className="flex items-center gap-3 rounded-lg px-1.5 py-2.5 hover:bg-sand-50">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-clay-600/10 text-clay-600">
                      <IconDoc className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-soil-700">{f.title}</span>
                      <span className="block text-xs text-soil-400">{f.size}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div id="contact" className="flex flex-col gap-4">
            <div className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-forest-800">ติดต่อเรา</h3>
              <p className="mt-1 text-sm text-soil-500">บริษัท ตัวอย่างเหมือง จำกัด</p>
              <ul className="mt-4 space-y-3 text-sm text-soil-600">
                <li className="flex items-center gap-2.5"><IconPhone className="h-[18px] w-[18px] text-forest-600" /> 0-1234-5678 ต่อ 123</li>
                <li className="flex items-center gap-2.5"><IconMail className="h-[18px] w-[18px] text-forest-600" /> rehab@minesample.co.th</li>
                <li className="flex items-start gap-2.5"><IconPin className="h-[18px] w-[18px] shrink-0 text-forest-600" /> 123 หมู่ 4 ต.เหมือง อ.เหมือง จ.เหมือง 12345</li>
              </ul>
            </div>

            <div className="flex flex-1 flex-col justify-between rounded-xl2 bg-forest-700 p-6 text-sand-50 shadow-card">
              <div>
                <ContourMark className="h-8 w-8" />
                <p className="mt-3 font-display text-lg font-semibold leading-snug">
                  ร่วมฟื้นฟู เพื่ออนาคตที่ยั่งยืนของเราและสังคม
                </p>
              </div>
              <a
                href="#join"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-sand-50 px-4 py-2.5 text-sm font-semibold text-forest-700 hover:bg-sand-100"
              >
                ร่วมเป็นส่วนหนึ่ง <IconArrow className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
