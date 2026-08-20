import { ContourMark } from './Icons.jsx'

const COLUMNS = [
  {
    heading: 'ข้อมูล',
    links: ['แผนฟื้นฟู', 'ความก้าวหน้า', 'ข้อมูลต้นไม้', 'รายงานรายเดือน'],
  },
  {
    heading: 'องค์กร',
    links: ['เกี่ยวกับโครงการ', 'กิจกรรม', 'ข่าวสาร', 'ติดต่อเรา'],
  },
]

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-sand-100/70">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <ContourMark className="h-8 w-8" />
              <span className="font-display text-base font-semibold text-sand-50">ศูนย์ข้อมูลการฟื้นฟูเหมือง</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed">
              ติดตามแผนฟื้นฟู ความก้าวหน้า และข้อมูลการปลูกพืชคลุมดินในแต่ละระดับชั้นอย่างเป็นระบบและโปร่งใส
              จัดทำโดยบริษัท ตัวอย่างเหมือง จำกัด ร่วมกับกรมอุตสาหกรรมพื้นฐานและการเหมืองแร่
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-sm font-semibold text-sand-50">{col.heading}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-sand-50">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sand-50/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2569 ศูนย์ข้อมูลการฟื้นฟูเหมือง สงวนลิขสิทธิ์</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-sand-50">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-sand-50">เงื่อนไขการใช้งาน</a>
            <a href="#" className="hover:text-sand-50">แผนผังเว็บไซต์</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
