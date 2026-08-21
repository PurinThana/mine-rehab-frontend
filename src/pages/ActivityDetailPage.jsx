import { useCallback } from 'react'
import { IconArrow, IconAlert, IconPin, IconClock, IconSpinner } from '../components/Icons.jsx'
import { activitiesApi } from '../api/index.js'
import { useCollection } from '../hooks/useCollection.js'
import { formatThaiDate } from '../utils/date.js'
import ImageCarousel from '../components/ImageCarousel.jsx'
import RichText from '../components/RichText.jsx'
import { iconForActivityType } from '../utils/activityType.js'

function BackLink({ onBack, tone = 'dark' }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
        tone === 'dark'
          ? 'text-sand-100/70 hover:text-sand-50'
          : 'text-forest-700 hover:text-forest-600'
      }`}
    >
      <IconArrow className="h-3.5 w-3.5 rotate-180" />
      กลับไปหน้ากิจกรรมทั้งหมด
    </button>
  )
}

export default function ActivityDetailPage({ activityId, onBack }) {
  const fetcher = useCallback(() => activitiesApi.getById(activityId), [activityId])
  const { data: activity, loading, error, reload } = useCollection(fetcher, {
    enabled: Boolean(activityId),
  })

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="flex items-center justify-center gap-2.5 text-sm text-soil-500">
          <IconSpinner className="h-4 w-4" />
          กำลังโหลดข้อมูลกิจกรรม...
        </p>
      </main>
    )
  }

  if (error) {
    // 404 (ลบไปแล้ว / id ผิด) กับ backend ล่ม ต่างกันตรงสิ่งที่ผู้ใช้ทำได้ต่อ
    // จึงเสนอทั้งลองใหม่และกลับไปหน้ารายการ
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="rounded-xl2 border border-clay-500/25 bg-clay-400/5 px-5 py-12 text-center">
          <IconAlert className="mx-auto h-6 w-6 text-clay-600" />
          <p className="mt-3 text-sm text-clay-700">{error}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={reload}
              className="rounded-xl border border-clay-500/30 px-4 py-2 text-sm font-medium text-clay-700 transition-colors hover:bg-clay-400/10"
            >
              ลองอีกครั้ง
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl bg-forest-700 px-4 py-2 text-sm font-medium text-sand-50 transition-colors hover:bg-forest-600"
            >
              กลับไปหน้ากิจกรรมทั้งหมด
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!activity) return null

  const Icon = iconForActivityType(activity.activity_type)
  const gallery = activity.images?.length
    ? activity.images
    : activity.image_url
      ? [activity.image_url]
      : []

  return (
    <>
      <section className="border-b border-forest-700/10 bg-forest-800">
        <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
          <BackLink onBack={onBack} />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-50/10 px-3 py-1 text-xs font-medium text-sand-50">
              <Icon className="h-3.5 w-3.5" />
              {activity.activity_type}
            </span>
            {activity.bench_elevation_m != null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-bloom-500/15 px-3 py-1 text-xs font-medium text-bloom-400">
                <IconPin className="h-3.5 w-3.5" />
                ระดับ +{activity.bench_elevation_m} ม.
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-2xl font-semibold leading-snug text-sand-50 sm:text-3xl">
            {activity.title}
          </h1>

          <p className="tick-num mt-3 flex items-center gap-2 text-sm text-sand-100/70">
            <IconClock className="h-4 w-4" />
            {formatThaiDate(activity.activity_date)}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
        <ImageCarousel
          images={gallery}
          alt={activity.title}
          className="h-64 shadow-card sm:h-80 lg:h-96"
          fallback={
            <div className="flex h-52 items-center justify-center rounded-xl2 bg-gradient-to-br from-forest-600 to-forest-800 shadow-card sm:h-64">
              <Icon className="h-16 w-16 text-sand-50/90" />
            </div>
          }
        />

        <div className="mt-6 rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-semibold text-forest-800">รายละเอียด</h2>
          {activity.description ? (
            <RichText html={activity.description} className="mt-2 text-sm" />
          ) : (
            <p className="mt-2 text-sm text-soil-400">ไม่ได้บันทึกรายละเอียดเพิ่มเติมไว้</p>
          )}

          <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-forest-700/8 pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-soil-500">ประเภทกิจกรรม</dt>
              <dd className="mt-0.5 text-sm font-medium text-forest-800">{activity.activity_type}</dd>
            </div>
            <div>
              <dt className="text-xs text-soil-500">วันที่ดำเนินการ</dt>
              <dd className="tick-num mt-0.5 text-sm font-medium text-forest-800">
                {formatThaiDate(activity.activity_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-soil-500">ระดับชั้นที่เกี่ยวข้อง</dt>
              <dd className="mt-0.5 text-sm font-medium text-forest-800">
                {activity.bench_elevation_m != null
                  ? `+${activity.bench_elevation_m} ม.`
                  : 'ไม่ผูกกับระดับชั้นใด'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-soil-500">พื้นที่โครงการ</dt>
              <dd className="mt-0.5 text-sm font-medium text-forest-800">
                {activity.site_name || '-'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6">
          <BackLink onBack={onBack} tone="light" />
        </div>
      </main>
    </>
  )
}
