import { useCallback } from 'react'
import { IconArrow, IconAlert, IconClock, IconSpinner, IconDoc } from '../components/Icons.jsx'
import { newsApi } from '../api/index.js'
import { useCollection } from '../hooks/useCollection.js'
import { formatThaiDate } from '../utils/date.js'
import ImageCarousel from '../components/ImageCarousel.jsx'
import RichText from '../components/RichText.jsx'

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
      กลับไปหน้าข่าวสารทั้งหมด
    </button>
  )
}

export default function NewsDetailPage({ postId, onBack }) {
  const fetcher = useCallback(() => newsApi.getById(postId), [postId])
  const { data: post, loading, error, reload } = useCollection(fetcher, {
    enabled: Boolean(postId),
  })

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <p className="flex items-center justify-center gap-2.5 text-sm text-soil-500">
          <IconSpinner className="h-4 w-4" />
          กำลังโหลดข่าว...
        </p>
      </main>
    )
  }

  if (error) {
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
              กลับไปหน้าข่าวสารทั้งหมด
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!post) return null

  // ข้อมูลเก่าที่บันทึกก่อนมีตาราง post_images ยังมีแค่รูปปกเดี่ยว
  const gallery = post.images?.length ? post.images : post.image_url ? [post.image_url] : []

  return (
    <>
      <section className="border-b border-forest-700/10 bg-forest-800">
        <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
          <BackLink onBack={onBack} />

          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-bloom-400">
            ข่าวสารและประกาศ
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-snug text-sand-50 sm:text-3xl">
            {post.title}
          </h1>
          <p className="tick-num mt-3 flex items-center gap-2 text-sm text-sand-100/70">
            <IconClock className="h-4 w-4" />
            เผยแพร่ {formatThaiDate(post.published_date)}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
        <ImageCarousel
          images={gallery}
          alt={post.title}
          className="h-64 shadow-card sm:h-80 lg:h-96"
          fallback={
            <div className="flex h-40 items-center justify-center rounded-xl2 bg-gradient-to-br from-forest-600 to-forest-800 shadow-card">
              <IconDoc className="h-14 w-14 text-sand-50/90" />
            </div>
          }
        />

        <article className="mt-6 rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
          {post.body ? (
            <RichText html={post.body} className="text-sm" />
          ) : (
            <p className="text-sm text-soil-400">ประกาศนี้ไม่มีเนื้อหาเพิ่มเติม</p>
          )}

          <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-forest-700/8 pt-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-soil-500">วันที่เผยแพร่</dt>
              <dd className="tick-num mt-0.5 text-sm font-medium text-forest-800">
                {formatThaiDate(post.published_date)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-soil-500">พื้นที่โครงการ</dt>
              <dd className="mt-0.5 text-sm font-medium text-forest-800">{post.site_name || '-'}</dd>
            </div>
          </dl>
        </article>

        <div className="mt-6">
          <BackLink onBack={onBack} tone="light" />
        </div>
      </main>
    </>
  )
}
