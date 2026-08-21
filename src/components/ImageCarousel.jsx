import { useCallback, useEffect, useRef, useState } from 'react'
import { IconArrow } from './Icons.jsx'

/**
 * แกลเลอรีรูปแบบเลื่อนดู
 *
 * ใช้ scroll snap ของ CSS เป็นกลไกหลัก ไม่ได้คำนวณ transform เอง — เลื่อนด้วย
 * นิ้วบนมือถือและ trackpad ได้ฟรี ส่วนปุ่มลูกศรกับจุดบอกตำแหน่งเพียงสั่ง
 * scrollTo แล้วอ่านตำแหน่งกลับมาจาก event onScroll จึงไม่มีสถานะสองชุดที่ขัดกัน
 */
export default function ImageCarousel({ images = [], alt = '', className = '', fallback = null }) {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  const count = images.length

  // อ่านรูปที่อยู่กลางจอจากตำแหน่ง scroll จริง
  const syncIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const next = Math.round(track.scrollLeft / track.clientWidth)
    setIndex((prev) => (prev === next ? prev : next))
  }, [])

  const goTo = useCallback((next) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(next, count - 1))
    // อัปเดตตัวเลข/จุดบอกตำแหน่งทันที ไม่รอ event scroll — ปุ่มจึงตอบสนองทันที
    // และไม่ค้างถ้าการเลื่อนแบบ smooth ถูกขัดจังหวะ ส่วน onScroll ยังทำหน้าที่
    // แก้ค่าให้ตรงเวลาผู้ใช้ปัดด้วยนิ้วเอง
    setIndex(clamped)
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' })
  }, [count])

  // ลูกศรซ้าย/ขวาบนคีย์บอร์ดเมื่อโฟกัสอยู่ในแกลเลอรี
  useEffect(() => {
    const track = trackRef.current
    if (!track || count < 2) return
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1) }
    }
    track.addEventListener('keydown', onKeyDown)
    return () => track.removeEventListener('keydown', onKeyDown)
  }, [count, index, goTo])

  if (count === 0) return fallback

  return (
    <div className={`relative overflow-hidden rounded-xl2 bg-forest-900/5 ${className}`}>
      <div
        ref={trackRef}
        onScroll={syncIndex}
        tabIndex={count > 1 ? 0 : -1}
        role={count > 1 ? 'group' : undefined}
        aria-label={count > 1 ? `แกลเลอรีรูปภาพ ${count} รูป` : undefined}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500/40 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="h-full w-full shrink-0 snap-center">
            <img
              src={src}
              alt={count > 1 ? `${alt} (รูปที่ ${i + 1} จาก ${count})` : alt}
              // รูปแรกโหลดทันที ที่เหลือค่อยโหลดเมื่อเลื่อนถึง
              loading={i === 0 ? 'eager' : 'lazy'}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="รูปก่อนหน้า"
            className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-sand-50/90 text-forest-800 shadow-card transition-opacity hover:bg-sand-50 disabled:pointer-events-none disabled:opacity-0"
          >
            <IconArrow className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= count - 1}
            aria-label="รูปถัดไป"
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-sand-50/90 text-forest-800 shadow-card transition-opacity hover:bg-sand-50 disabled:pointer-events-none disabled:opacity-0"
          >
            <IconArrow className="h-4 w-4" />
          </button>

          {/* จุดบอกตำแหน่ง — กดข้ามไปรูปที่ต้องการได้ */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={`dot-${src}-${i}`}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`ไปที่รูปที่ ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-sand-50' : 'w-1.5 bg-sand-50/60 hover:bg-sand-50/90'
                }`}
              />
            ))}
          </div>

          <span className="tick-num absolute right-3 top-3 rounded-full bg-soil-900/55 px-2.5 py-0.5 text-xs font-medium text-sand-50">
            {index + 1}/{count}
          </span>
        </>
      )}
    </div>
  )
}
