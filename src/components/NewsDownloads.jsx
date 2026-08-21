import { useCallback } from 'react'
import {
  IconDoc,
  IconPin,
  IconPhone,
  IconMail,
  IconArrow,
  IconAlert,
  ContourMark,
} from './Icons.jsx'
import { newsApi, documentsApi } from '../api/index.js'
import { useCollection } from '../hooks/useCollection.js'
import { formatThaiDate } from '../utils/date.js'
import { SITE_ID } from '../config.js'

// file_size_kb เก็บเป็น KB — เกิน 1 MB แล้วอ่านเป็น MB ง่ายกว่า
function formatFileSize(sizeKb) {
  const kb = Number(sizeKb)
  if (!Number.isFinite(kb) || kb <= 0) return ''
  if (kb < 1024) return `${Math.round(kb).toLocaleString('th-TH')} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}

// เดานามสกุลจาก URL เพื่อโชว์ป้าย "PDF" ให้ตรงกับไฟล์จริง
function fileKindLabel(url) {
  const match = String(url || '').match(/\.([a-z0-9]{2,5})(?:\?|#|$)/i)
  return match ? match[1].toUpperCase() : 'ไฟล์'
}

// สถานะ loading / error / ว่าง ของทั้งสองการ์ด ให้หน้าตาเหมือนกัน
// ครอบเนื้อหาไว้เป็น children แล้วคืน children เมื่อไม่มีอะไรต้องรายงาน —
// ห้ามคืนเป็น element ไปเทียบ `state || <list/>` เพราะ element เป็น truthy เสมอ
// (แม้ตัวมันจะ render null) รายการจริงจะไม่ถูกแสดงเลย
function CardState({ loading, error, empty, emptyText, skeletonRows = 3, children }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-20 animate-pulse rounded bg-forest-700/10" />
            <div className="h-3.5 animate-pulse rounded bg-forest-700/10" />
          </div>
        ))}
      </div>
    )
  }
  if (error) {
    return (
      <p className="flex items-start gap-2 py-3 text-sm text-clay-700">
        <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
        {error}
      </p>
    )
  }
  if (empty) {
    return <p className="py-6 text-center text-sm text-soil-400">{emptyText}</p>
  }
  return children
}

export default function NewsDownloads({ onViewAllNews, onOpenPost }) {
  const newsFetcher = useCallback(() => newsApi.getBySiteId(SITE_ID, 3), [])
  const { data: news, loading: newsLoading, error: newsError } = useCollection(newsFetcher)

  const docsFetcher = useCallback(() => documentsApi.getBySiteId(SITE_ID), [])
  const { data: docs, loading: docsLoading, error: docsError } = useCollection(docsFetcher)

  const newsItems = news || []
  // เอกสารมีได้เยอะ แต่การ์ดนี้โชว์แค่ 4 รายการล่าสุดให้พอดีกับความสูง
  const docItems = (docs || []).slice(0, 4)

  return (
    <section id="news" className="bg-sand-100/50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* news */}
          <div className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-800">ข่าวสารและประกาศ</h3>
              <button type="button" onClick={onViewAllNews} className="text-xs font-semibold text-forest-700 transition-colors hover:text-forest-600">ดูทั้งหมด</button>
            </div>
            <CardState
              loading={newsLoading}
              error={newsError}
              empty={newsItems.length === 0}
              emptyText="ยังไม่มีข่าวสารหรือประกาศ"
            >
              <ul className="space-y-4">
                {newsItems.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => onOpenPost(n.id)}
                      className="flex w-full gap-3 rounded-lg text-left transition-colors hover:bg-sand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40"
                    >
                      {n.image_url ? (
                        <span className="relative shrink-0">
                          <img
                            src={n.image_url}
                            alt={n.title}
                            loading="lazy"
                            className="h-12 w-12 rounded-lg border border-forest-700/10 object-cover"
                          />
                          {n.images?.length > 1 && (
                            <span className="tick-num absolute -bottom-1 -right-1 rounded-full bg-soil-900/70 px-1.5 text-[10px] font-medium text-sand-50">
                              {n.images.length}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-500" />
                      )}
                      <span className="min-w-0">
                        <span className="block text-xs text-soil-400">{formatThaiDate(n.published_date)}</span>
                        <span className="block text-sm leading-snug text-soil-700">{n.title}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardState>
          </div>

          {/* downloads */}
          <div id="report" className="rounded-xl2 border border-forest-700/8 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-forest-800">ดาวน์โหลดเอกสาร</h3>
              <a href="#files-full" className="text-xs font-semibold text-forest-700 hover:text-forest-600">ดูทั้งหมด</a>
            </div>
            <CardState
              loading={docsLoading}
              error={docsError}
              empty={docItems.length === 0}
              emptyText="ยังไม่มีเอกสารให้ดาวน์โหลด"
              skeletonRows={4}
            >
              <ul className="space-y-1">
                {docItems.map((f) => (
                  <li key={f.id}>
                    <a
                      href={f.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg px-1.5 py-2.5 hover:bg-sand-50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-clay-600/10 text-clay-600">
                        <IconDoc className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-soil-700">{f.title}</span>
                        <span className="block text-xs text-soil-400">
                          {[fileKindLabel(f.file_url), formatFileSize(f.file_size_kb)]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardState>
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
