import { useCallback, useMemo, useState } from 'react'
import { IconArrow, IconAlert, IconPin } from '../components/Icons.jsx'
import { activitiesApi, benchLevelsApi } from '../api/index.js'
import { useCollection } from '../hooks/useCollection.js'
import { formatThaiDate } from '../utils/date.js'
import { activityTypesFrom, iconForActivityType } from '../utils/activityType.js'
import { stripHtml } from '../utils/richTextPreview.js'
import { SITE_ID } from '../config.js'

function ActivityCard({ activity, benchLabel, onOpen }) {
  const Icon = iconForActivityType(activity.activity_type)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-xl2 border border-forest-700/8 bg-white text-left shadow-card transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40"
    >
      <span className="relative block">
        {activity.image_url ? (
          <img
            src={activity.image_url}
            alt={activity.title}
            loading="lazy"
            className="h-44 w-full object-cover"
          />
        ) : (
          <span className="flex h-44 items-center justify-center bg-gradient-to-br from-forest-600 to-forest-800">
            <Icon className="h-12 w-12 text-sand-50/90" />
          </span>
        )}
        {activity.images?.length > 1 && (
          <span className="tick-num absolute right-3 top-3 rounded-full bg-soil-900/55 px-2.5 py-0.5 text-xs font-medium text-sand-50">
            {activity.images.length} รูป
          </span>
        )}
      </span>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-700/8 px-2.5 py-0.5 text-xs font-medium text-forest-700">
            <Icon className="h-3.5 w-3.5" />
            {activity.activity_type}
          </span>
          {benchLabel && (
            <span className="inline-flex items-center gap-1 rounded-full bg-clay-600/10 px-2.5 py-0.5 text-xs font-medium text-clay-700">
              <IconPin className="h-3.5 w-3.5" />
              {benchLabel}
            </span>
          )}
        </div>

        <h2 className="mt-3 font-display text-base font-semibold leading-snug text-forest-800">
          {activity.title}
        </h2>
        <p className="tick-num mt-1 text-xs text-soil-500">{formatThaiDate(activity.activity_date)}</p>

        {activity.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-soil-600">{stripHtml(activity.description)}</p>
        )}

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700">
          ดูรายละเอียด <IconArrow className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-forest-700/8 bg-white shadow-card">
      <div className="h-44 animate-pulse bg-forest-700/10" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-24 animate-pulse rounded-full bg-forest-700/10" />
        <div className="h-4 w-full animate-pulse rounded bg-forest-700/10" />
        <div className="h-3 w-24 animate-pulse rounded bg-forest-700/5" />
      </div>
    </div>
  )
}

export default function ActivitiesPage({ onExit, onOpenActivity }) {
  const fetcher = useCallback(() => activitiesApi.getBySiteId(SITE_ID, 100), [])
  const { data, loading, error, reload } = useCollection(fetcher)

  // ใช้แปลง bench_level_id เป็น "+246 ม." — activities ส่งมาแค่ id
  const benchFetcher = useCallback(() => benchLevelsApi.getBySiteId(SITE_ID), [])
  const { data: benches } = useCollection(benchFetcher)

  const [activeType, setActiveType] = useState('all')

  const activities = data || []

  const benchLabelById = useMemo(() => {
    const map = new Map()
    for (const b of benches || []) map.set(b.id, `ระดับ +${b.elevation_m} ม.`)
    return map
  }, [benches])

  // ประเภทมาจากข้อมูลจริง ไม่ใช่รายการที่ hardcode ไว้ — activity_type เป็น
  // ข้อความอิสระ เพิ่มประเภทใหม่ในหน้าแอดมินแล้วปุ่มกรองขึ้นเองทันที
  const types = useMemo(() => activityTypesFrom(activities), [activities])

  const visible =
    activeType === 'all' ? activities : activities.filter((a) => a.activity_type === activeType)

  return (
    <>
      {/* หัวเรื่องของหน้า */}
      <section className="border-b border-forest-700/10 bg-forest-800">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sand-100/70 transition-colors hover:text-sand-50"
          >
            <IconArrow className="h-3.5 w-3.5 rotate-180" />
            กลับหน้าหลัก
          </button>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-bloom-400">ภาคสนาม</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-sand-50 sm:text-4xl">
            กิจกรรมทั้งหมด
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sand-100/80">
            บันทึกการดำเนินงานภาคสนามทุกรายการ เรียงจากวันที่ใหม่สุดก่อน
            {!loading && !error && activities.length > 0 && ` · ทั้งหมด ${activities.length} รายการ`}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* ตัวกรองประเภท — โชว์เมื่อมีมากกว่า 1 ประเภทให้เลือกจริงๆ */}
        {!loading && !error && types.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveType('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeType === 'all'
                  ? 'bg-forest-700 text-sand-50 shadow-card'
                  : 'border border-forest-700/15 bg-white text-soil-600 hover:bg-forest-700/5'
              }`}
            >
              ทั้งหมด ({activities.length})
            </button>
            {types.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveType(t.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeType === t.key
                    ? 'bg-forest-700 text-sand-50 shadow-card'
                    : 'border border-forest-700/15 bg-white text-soil-600 hover:bg-forest-700/5'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.key} ({t.count})
              </button>
            ))}
          </div>
        )}

        {error ? (
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl2 border border-clay-500/25 bg-clay-400/5 px-5 py-16 text-sm text-clay-700">
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
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : activities.length === 0 ? (
          <p className="rounded-xl2 border border-forest-700/8 bg-white px-5 py-16 text-center text-sm text-soil-500 shadow-card">
            ยังไม่มีกิจกรรมที่บันทึกไว้
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                benchLabel={benchLabelById.get(activity.bench_level_id)}
                onOpen={() => onOpenActivity(activity.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
