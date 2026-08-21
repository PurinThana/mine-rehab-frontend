import { useRef, useState } from 'react'
import { uploadsApi, getErrorMessage } from '../../api/index.js'
import { IconAlert, IconSpinner, IconArrow } from '../../components/Icons.jsx'

/**
 * จัดการรูปหลายรูปของกิจกรรม/ข่าว — อัปโหลดหลายไฟล์พร้อมกัน, สลับลำดับ, ลบ
 *
 * ลำดับใน array คือลำดับที่แสดงบน carousel และ "รูปแรก = รูปปก" ที่ใช้บนการ์ด
 * ในหน้ารายการ (ฝั่ง backend ตั้ง image_url จากรูปแรกให้เองตอนบันทึก)
 *
 * ใช้ปุ่มเลื่อนซ้าย/ขวาแทน drag and drop เพราะทำงานได้บนทัชสกรีนและคีย์บอร์ด
 * โดยไม่ต้องพึ่ง library
 */
export default function MultiImageField({ label, value = [], onChange, hint, max = 12 }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [error, setError] = useState('')
  const [urlDraft, setUrlDraft] = useState('')

  const images = value || []
  const full = images.length >= max

  async function handlePick(e) {
    const files = [...(e.target.files || [])]
    e.target.value = '' // ให้เลือกไฟล์ชุดเดิมซ้ำได้
    if (!files.length) return

    const room = max - images.length
    if (room <= 0) return
    const batch = files.slice(0, room)

    setUploading(true)
    setError('')
    setProgress({ done: 0, total: batch.length })

    const added = []
    const failures = []
    // อัปโหลดทีละไฟล์ ไม่ยิงพร้อมกันทั้งหมด เพื่อให้เห็นความคืบหน้าเป็นลำดับ
    // และไม่ถล่ม API ตอนเลือกมาสิบรูป
    for (const [i, file] of batch.entries()) {
      try {
        const result = await uploadsApi.upload(file)
        added.push(result.url)
      } catch (err) {
        failures.push(`${file.name}: ${getErrorMessage(err, 'อัปโหลดไม่สำเร็จ')}`)
      }
      setProgress({ done: i + 1, total: batch.length })
    }

    // เก็บรูปที่สำเร็จไว้เสมอ แม้บางไฟล์จะล้ม — ไม่ทิ้งงานที่ทำได้แล้ว
    if (added.length) onChange([...images, ...added])
    if (failures.length) setError(failures.join(' · '))
    if (files.length > room) {
      setError((prev) =>
        [prev, `ใส่ได้อีก ${room} รูป (สูงสุด ${max} รูป) ไฟล์ที่เกินถูกข้าม`].filter(Boolean).join(' · '),
      )
    }
    setUploading(false)
  }

  function move(from, to) {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  function remove(index) {
    onChange(images.filter((_, i) => i !== index))
  }

  function addUrl() {
    const url = urlDraft.trim()
    if (!url) return
    if (images.includes(url)) {
      setError('รูปนี้อยู่ในรายการแล้ว')
      return
    }
    if (full) return
    onChange([...images, url])
    setUrlDraft('')
    setError('')
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-soil-700">
        {label}
        {images.length > 0 && (
          <span className="ml-2 font-normal text-soil-400">
            {images.length}/{max} รูป
          </span>
        )}
      </label>

      {images.length > 0 && (
        <ul className="mb-3 grid gap-2 sm:grid-cols-2">
          {images.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="flex items-center gap-2.5 rounded-xl border border-forest-700/10 bg-white p-2"
            >
              <span className="relative shrink-0">
                <img
                  src={url}
                  alt={`รูปที่ ${index + 1}`}
                  className="h-14 w-20 rounded-lg border border-forest-700/10 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
                {index === 0 && (
                  <span className="absolute -left-1 -top-1 rounded-full bg-forest-700 px-1.5 py-0.5 text-[10px] font-medium text-sand-50">
                    ปก
                  </span>
                )}
              </span>

              <span className="min-w-0 flex-1 break-all font-mono text-[10px] leading-tight text-soil-400">
                {url.split('/').pop()}
              </span>

              <span className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label="เลื่อนขึ้น"
                  title="เลื่อนไปก่อนหน้า"
                  className="grid h-7 w-7 place-items-center rounded-lg text-soil-500 transition-colors hover:bg-forest-700/8 disabled:opacity-30"
                >
                  <IconArrow className="h-3.5 w-3.5 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === images.length - 1}
                  aria-label="เลื่อนลง"
                  title="เลื่อนไปถัดไป"
                  className="grid h-7 w-7 place-items-center rounded-lg text-soil-500 transition-colors hover:bg-forest-700/8 disabled:opacity-30"
                >
                  <IconArrow className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="ลบรูปนี้"
                  title="ลบรูปนี้"
                  className="grid h-7 w-7 place-items-center rounded-lg text-clay-700 transition-colors hover:bg-clay-400/10"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      {uploading && (
        <div className="mb-2.5 rounded-xl border border-forest-700/10 bg-white px-3.5 py-2.5">
          <p className="flex items-center gap-2 text-sm text-soil-600">
            <IconSpinner className="h-4 w-4" />
            กำลังอัปโหลด {progress.done}/{progress.total} ไฟล์...
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePick}
          disabled={uploading || full}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || full}
          className="rounded-xl border border-forest-700/15 bg-white px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-700/5 disabled:cursor-not-allowed disabled:opacity-60"
          title={full ? `ครบ ${max} รูปแล้ว` : undefined}
        >
          เลือกรูปจากเครื่อง (เลือกหลายไฟล์ได้)
        </button>
      </div>

      <div className="mt-2 flex gap-2">
        <input
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addUrl()
            }
          }}
          placeholder="หรือวาง URL รูปแล้วกด เพิ่ม"
          disabled={uploading || full}
          className="min-w-0 flex-1 rounded-xl border border-forest-700/15 bg-white px-3.5 py-2 font-mono text-xs text-soil-900 outline-none transition-colors placeholder:font-body placeholder:text-soil-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 disabled:bg-sand-100 disabled:opacity-70"
        />
        <button
          type="button"
          onClick={addUrl}
          disabled={uploading || full || !urlDraft.trim()}
          className="shrink-0 rounded-xl border border-forest-700/15 px-3.5 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-700/5 disabled:opacity-40"
        >
          เพิ่ม
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-clay-700">
          <IconAlert className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-soil-500">{hint}</p>
      )}
    </div>
  )
}
