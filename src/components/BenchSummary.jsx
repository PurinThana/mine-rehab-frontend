import { IconArrow } from './Icons.jsx'

const LEVELS = [
  { elevation: 270, planted: true, area: 489, trees: 408 },
  { elevation: 264, planted: true, area: 489, trees: 634 },
  { elevation: 258, planted: true, area: 489, trees: 921 },
  { elevation: 252, planted: true, area: 489, trees: 1161 },
  { elevation: 246, planted: true, area: 489, trees: 592 },
  { elevation: 240, planted: true, area: 489, trees: 401 },
  { elevation: 234, planted: true, area: 489, trees: 358 },
  { elevation: 228, planted: false, area: 489, trees: null },
  { elevation: 222, planted: false, area: 489, trees: null },
  { elevation: 216, planted: false, area: 489, trees: null },
  { elevation: 210, planted: false, area: 489, trees: null },
]

export default function BenchSummary() {
  const plantedCount = LEVELS.filter((l) => l.planted).length

  return (
    <section id="bench" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">แผนฟื้นฟูรายระดับชั้น</p>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">สรุปการปลูกตามระดับชั้น (Bench)</h2>
          <p className="mt-2 max-w-2xl text-sm text-soil-500">
            แต่ละระดับชั้นสูง 6 เมตร พื้นที่ปลูกเท่ากันที่ 489 ตร.ม. เรียงจากยอด +270 ลงมาถึงฐาน +210
          </p>
        </div>
        <a href="#report" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-600">
          ดูรายละเอียดเต็ม <IconArrow className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* stacked terrace side-view */}
        <div className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
          <p className="mb-4 text-sm font-semibold text-forest-800">มุมมองด้านข้าง</p>
          <div className="mx-auto flex w-full max-w-[200px] flex-col-reverse gap-[3px]">
            {LEVELS.map((level, i) => {
              const widthPct = 46 + i * 5.4
              return (
                <div key={level.elevation} className="flex items-center gap-2">
                  <span className="w-8 shrink-0 text-right font-mono text-[10px] text-soil-400">+{level.elevation}</span>
                  <div
                    className={`h-4 rounded-sm ${level.planted ? 'bg-forest-500' : 'bg-clay-400/60'}`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-5 flex items-center gap-4 text-xs text-soil-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-forest-500" /> ปลูกแล้ว</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-clay-400/60" /> ยังไม่ได้ปลูก</span>
          </div>
        </div>

        {/* data table */}
        <div className="overflow-hidden rounded-xl2 border border-forest-700/8 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-forest-700/8 bg-sand-100/50 text-left text-xs font-semibold uppercase tracking-wide text-soil-500">
                  <th className="px-5 py-3">ระดับชั้น</th>
                  <th className="px-5 py-3">สถานะการปลูก</th>
                  <th className="px-5 py-3 text-right">พื้นที่ (ตร.ม.)</th>
                  <th className="px-5 py-3 text-right">จำนวนต้นไม้</th>
                </tr>
              </thead>
              <tbody>
                {LEVELS.map((level) => (
                  <tr key={level.elevation} className="border-b border-forest-700/6 last:border-0 hover:bg-sand-50">
                    <td className="px-5 py-3 font-mono font-medium text-forest-800">+{level.elevation}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          level.planted ? 'bg-forest-500/10 text-forest-700' : 'bg-clay-500/10 text-clay-600'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${level.planted ? 'bg-forest-500' : 'bg-clay-500'}`} />
                        {level.planted ? 'ปลูกแล้ว' : 'ยังไม่ได้ปลูก'}
                      </span>
                    </td>
                    <td className="tick-num px-5 py-3 text-right text-soil-600">{level.area.toLocaleString('th-TH')}</td>
                    <td className="tick-num px-5 py-3 text-right text-soil-600">
                      {level.trees ? level.trees.toLocaleString('th-TH') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-forest-700/8 bg-sand-100/40 px-5 py-3 text-xs text-soil-500">
            <span>ปลูกแล้ว {plantedCount} จาก {LEVELS.length} ระดับชั้น</span>
            <span>ยังไม่ได้ปลูก {LEVELS.length - plantedCount} ระดับชั้น</span>
          </div>
        </div>
      </div>
    </section>
  )
}
