import { IconArrow, IconAlert } from './Icons.jsx'
import { useSiteData } from '../context/SiteDataContext.jsx'
import { formatNumber } from '../utils/date.js'

// คำอธิบายใต้หัวข้อ สร้างจากข้อมูลจริง ไม่ฝังตัวเลขไว้ในโค้ด
// (พื้นที่แต่ละระดับชั้นไม่จำเป็นต้องเท่ากัน จึงบอกเป็นช่วงเมื่อไม่เท่า)
function describeLevels(levels) {
  if (levels.length === 0) return 'ยังไม่ได้กำหนดระดับชั้นสำหรับพื้นที่นี้'

  const elevations = levels.map((l) => Number(l.elevation_m))
  const top = Math.max(...elevations)
  const base = Math.min(...elevations)

  const areas = levels.map((l) => Number(l.area_sqm))
  const minArea = Math.min(...areas)
  const maxArea = Math.max(...areas)
  const areaText =
    minArea === maxArea
      ? `พื้นที่ปลูกเท่ากันที่ ${formatNumber(minArea)} ตร.ม.`
      : `พื้นที่ปลูก ${formatNumber(minArea)}–${formatNumber(maxArea)} ตร.ม.`

  // ระยะห่างระหว่างชั้น อ่านจากผลต่างของสองระดับที่อยู่ติดกัน
  const sorted = [...elevations].sort((a, b) => b - a)
  const gaps = sorted.slice(1).map((v, i) => sorted[i] - v)
  const uniformGap = gaps.length && gaps.every((g) => g === gaps[0]) ? gaps[0] : null

  const heightText = uniformGap ? `แต่ละระดับชั้นสูง ${formatNumber(uniformGap)} เมตร ` : ''
  return `${heightText}${areaText} เรียงจากยอด +${top} ลงมาถึงฐาน +${base}`
}

export default function BenchSummary() {
  const { benchLevels, loading, error, reload } = useSiteData()

  const levels = benchLevels || []
  // API เรียงตาม sequence_order (1 = ยอด) แล้ว ตารางใช้ลำดับนี้ตรงๆ
  const plantedCount = levels.filter((l) => l.status === 'planted').length

  return (
    <section id="bench" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">แผนฟื้นฟูรายระดับชั้น</p>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">สรุปการปลูกตามระดับชั้น (Bench)</h2>
          <p className="mt-2 max-w-2xl text-sm text-soil-500">
            {loading || error ? 'ข้อมูลระดับชั้นทั้งหมดของพื้นที่ฟื้นฟู' : describeLevels(levels)}
          </p>
        </div>
        <a href="#report" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-600">
          ดูรายละเอียดเต็ม <IconArrow className="h-3.5 w-3.5" />
        </a>
      </div>

      {error ? (
        <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl2 border border-clay-500/25 bg-clay-400/5 px-5 py-12 text-sm text-clay-700">
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
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* stacked terrace side-view */}
          <div className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
            <p className="mb-4 text-sm font-semibold text-forest-800">มุมมองด้านข้าง</p>
            <div className="mx-auto flex w-full max-w-[200px] flex-col-reverse gap-[3px]">
              {(loading ? Array.from({ length: 11 }) : levels).map((level, i) => {
                // แถบกว้างขึ้นเรื่อยๆ ลงไปหาฐาน ให้ดูเหมือนภูเขาแบบขั้นบันได
                const widthPct = 46 + i * 5.4
                if (loading) {
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-8 shrink-0" />
                      <div
                        className="h-4 animate-pulse rounded-sm bg-forest-700/10"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  )
                }
                return (
                  <div key={level.id} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-right font-mono text-[10px] text-soil-400">
                      +{level.elevation_m}
                    </span>
                    <div
                      className={`h-4 rounded-sm ${
                        level.status === 'planted' ? 'bg-forest-500' : 'bg-clay-400/60'
                      }`}
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
                  {loading ? (
                    Array.from({ length: 11 }).map((_, i) => (
                      <tr key={i} className="border-b border-forest-700/6 last:border-0">
                        <td className="px-5 py-3"><div className="h-4 w-12 animate-pulse rounded bg-forest-700/10" /></td>
                        <td className="px-5 py-3"><div className="h-5 w-24 animate-pulse rounded-full bg-forest-700/10" /></td>
                        <td className="px-5 py-3"><div className="ml-auto h-4 w-16 animate-pulse rounded bg-forest-700/5" /></td>
                        <td className="px-5 py-3"><div className="ml-auto h-4 w-14 animate-pulse rounded bg-forest-700/5" /></td>
                      </tr>
                    ))
                  ) : levels.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-sm text-soil-500">
                        ยังไม่มีข้อมูลระดับชั้น
                      </td>
                    </tr>
                  ) : (
                    levels.map((level) => {
                      const planted = level.status === 'planted'
                      const trees = Number(level.total_trees)
                      return (
                        <tr key={level.id} className="border-b border-forest-700/6 last:border-0 hover:bg-sand-50">
                          <td className="px-5 py-3 font-mono font-medium text-forest-800">+{level.elevation_m}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                planted ? 'bg-forest-500/10 text-forest-700' : 'bg-clay-500/10 text-clay-600'
                              }`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${planted ? 'bg-forest-500' : 'bg-clay-500'}`} />
                              {planted ? 'ปลูกแล้ว' : 'ยังไม่ได้ปลูก'}
                            </span>
                          </td>
                          <td className="tick-num px-5 py-3 text-right text-soil-600">
                            {formatNumber(level.area_sqm)}
                          </td>
                          <td className="tick-num px-5 py-3 text-right text-soil-600">
                            {trees > 0 ? formatNumber(trees) : '—'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            {!loading && levels.length > 0 && (
              <div className="flex items-center justify-between border-t border-forest-700/8 bg-sand-100/40 px-5 py-3 text-xs text-soil-500">
                <span>ปลูกแล้ว {plantedCount} จาก {levels.length} ระดับชั้น</span>
                <span>ยังไม่ได้ปลูก {levels.length - plantedCount} ระดับชั้น</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
