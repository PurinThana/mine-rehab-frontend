import { useCallback } from 'react'
import { IconArrow, IconAlert } from './Icons.jsx'
import { activitiesApi } from '../api/index.js'
import { useCollection } from '../hooks/useCollection.js'
import { formatThaiDate } from '../utils/date.js'
import { iconForActivityType } from '../utils/activityType.js'
import { SITE_ID } from '../config.js'

function ActivityCard({ activity }) {
  // activity_type เป็นข้อความอิสระ จับคู่ไอคอนด้วยคำสำคัญ (ดู utils/activityType.js)
  const Icon = iconForActivityType(activity.activity_type)

  return (
    <div className="group overflow-hidden rounded-xl2 border border-forest-700/8 bg-white shadow-card transition-transform hover:-translate-y-0.5">
      {activity.image_url ? (
        <img
          src={activity.image_url}
          alt={activity.title}
          loading="lazy"
          className="h-28 w-full object-cover"
        />
      ) : (
        <div className="flex h-28 items-center justify-center bg-gradient-to-br from-forest-600 to-forest-800">
          <Icon className="h-9 w-9 text-sand-50/90" />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm font-semibold leading-snug text-forest-800">{activity.title}</p>
        <p className="mt-1 text-xs text-soil-500">{formatThaiDate(activity.activity_date)}</p>
      </div>
    </div>
  )
}

export default function RecentActivities({ onViewAll }) {
  const fetcher = useCallback(() => activitiesApi.getBySiteId(SITE_ID, 5), [])
  const { data, loading, error } = useCollection(fetcher)

  const activities = data || []

  return (
    <section id="activities" className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-clay-600">ภาคสนาม</p>
          <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">กิจกรรมล่าสุด</h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 transition-colors hover:text-forest-600"
        >
          ดูกิจกรรมทั้งหมด <IconArrow className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading ? (
        // โครงการ์ดเปล่าขนาดเท่าของจริง กัน layout กระโดดตอนข้อมูลมาถึง
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl2 border border-forest-700/8 bg-white shadow-card"
            >
              <div className="h-28 animate-pulse bg-forest-700/10" />
              <div className="space-y-2 p-4">
                <div className="h-3.5 animate-pulse rounded bg-forest-700/10" />
                <div className="h-2.5 w-2/3 animate-pulse rounded bg-forest-700/5" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="flex items-center justify-center gap-2 rounded-xl2 border border-clay-500/25 bg-clay-400/5 px-5 py-10 text-sm text-clay-700">
          <IconAlert className="h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : activities.length === 0 ? (
        <p className="rounded-xl2 border border-forest-700/8 bg-white px-5 py-10 text-center text-sm text-soil-500 shadow-card">
          ยังไม่มีกิจกรรมที่บันทึกไว้
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </section>
  )
}
