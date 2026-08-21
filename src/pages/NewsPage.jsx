import { useCallback } from 'react'
import { IconArrow, IconAlert, IconDoc, IconClock } from '../components/Icons.jsx'
import { newsApi } from '../api/index.js'
import { useCollection } from '../hooks/useCollection.js'
import { formatThaiDate } from '../utils/date.js'
import { stripHtml } from '../utils/richTextPreview.js'
import { SITE_ID } from '../config.js'

function NewsCard({ post, onOpen }) {
  const imageCount = post.images?.length || 0
  const cover = post.image_url || post.images?.[0] || null
  const preview = stripHtml(post.body)

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col overflow-hidden rounded-xl2 border border-forest-700/8 bg-white text-left shadow-card transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40"
    >
      <span className="relative block">
        {cover ? (
          <img src={cover} alt={post.title} loading="lazy" className="h-44 w-full object-cover" />
        ) : (
          <span className="flex h-44 items-center justify-center bg-gradient-to-br from-forest-600 to-forest-800">
            <IconDoc className="h-12 w-12 text-sand-50/90" />
          </span>
        )}
        {imageCount > 1 && (
          <span className="tick-num absolute right-3 top-3 rounded-full bg-soil-900/55 px-2.5 py-0.5 text-xs font-medium text-sand-50">
            {imageCount} รูป
          </span>
        )}
      </span>

      <span className="flex flex-1 flex-col p-5">
        <span className="tick-num flex items-center gap-1.5 text-xs text-soil-500">
          <IconClock className="h-3.5 w-3.5" />
          {formatThaiDate(post.published_date)}
        </span>
        <h2 className="mt-2 font-display text-base font-semibold leading-snug text-forest-800">
          {post.title}
        </h2>
        {preview && (
          <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-soil-600">{preview}</span>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700">
          อ่านต่อ <IconArrow className="h-3.5 w-3.5" />
        </span>
      </span>
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-forest-700/8 bg-white shadow-card">
      <div className="h-44 animate-pulse bg-forest-700/10" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-forest-700/5" />
        <div className="h-4 w-full animate-pulse rounded bg-forest-700/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-forest-700/5" />
      </div>
    </div>
  )
}

export default function NewsPage({ onExit, onOpenPost }) {
  const fetcher = useCallback(() => newsApi.getBySiteId(SITE_ID, 100), [])
  const { data, loading, error, reload } = useCollection(fetcher)

  const posts = data || []

  return (
    <>
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
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-bloom-400">
            ประชาสัมพันธ์
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-sand-50 sm:text-4xl">
            ข่าวสารและประกาศ
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sand-100/80">
            ประกาศและรายงานความก้าวหน้าของโครงการ เรียงจากวันที่เผยแพร่ใหม่สุดก่อน
            {!loading && !error && posts.length > 0 && ` · ทั้งหมด ${posts.length} รายการ`}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
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
        ) : posts.length === 0 ? (
          <p className="rounded-xl2 border border-forest-700/8 bg-white px-5 py-16 text-center text-sm text-soil-500 shadow-card">
            ยังไม่มีข่าวสารหรือประกาศ
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <NewsCard key={post.id} post={post} onOpen={() => onOpenPost(post.id)} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
