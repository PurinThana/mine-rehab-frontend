import { useEffect, useId, useRef, useState } from 'react'

/**
 * ช่องพิมพ์ข้อความที่จัดรูปแบบได้ — ตัวหนา/เอียง/ขีดเส้นใต้, สี, จัดตำแหน่ง, รายการ
 *
 * ทำไมไม่ใช้ library: ต้องการแค่ชุดคำสั่งพื้นฐาน และโปรเจกต์นี้ยังไม่มี
 * dependency ฝั่ง UI เลย การเพิ่ม editor สำเร็จรูปหนักเกินความจำเป็น
 *
 * ใช้ document.execCommand ซึ่งถูกประกาศ deprecated แล้ว แต่ยังทำงานได้ในทุก
 * เบราว์เซอร์ปัจจุบันและยังไม่มีมาตรฐานอื่นมาแทน — ถ้าวันหนึ่งเลิกทำงานจริง
 * จุดที่ต้องแก้อยู่ในไฟล์นี้ไฟล์เดียว
 *
 * contenteditable ต้องเป็น uncontrolled: ถ้าเขียน innerHTML กลับจาก state ทุกครั้ง
 * ที่พิมพ์ เคอร์เซอร์จะเด้งไปท้ายข้อความ จึงตั้งค่าเริ่มต้นครั้งเดียวตอน mount
 * แล้วอ่านค่าออกทาง onInput เท่านั้น
 */

const COLORS = [
  { value: '#3A2C22', label: 'ดำน้ำตาล' },
  { value: '#1F4D3A', label: 'เขียวป่า' },
  { value: '#B4622E', label: 'ส้มดิน' },
  { value: '#B9862C', label: 'ทอง' },
  { value: '#9E2A2A', label: 'แดง' },
  { value: '#8A6B54', label: 'น้ำตาล' },
]

function ToolbarButton({ onRun, title, active, children, className = '' }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      // onMouseDown + preventDefault: กันไม่ให้ปุ่มแย่งโฟกัสไปจากข้อความที่เลือกไว้
      // ถ้าปล่อยให้เป็น onClick ตามปกติ selection จะหายก่อนคำสั่งจะทำงาน
      onMouseDown={(e) => {
        e.preventDefault()
        onRun()
      }}
      className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm transition-colors ${
        active ? 'bg-forest-700 text-sand-50' : 'text-soil-600 hover:bg-forest-700/8 hover:text-forest-800'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default function RichTextField({ label, hint, required, error, value, onChange, minHeight = '10rem' }) {
  const id = useId()
  const editorRef = useRef(null)
  const [colorOpen, setColorOpen] = useState(false)
  const colorRef = useRef(null)

  // ตั้งเนื้อหาเริ่มต้นครั้งเดียว และตอนสลับไปแก้รายการอื่น (value จากภายนอก
  // ต่างจากที่อยู่ในช่องจริงๆ) — ไม่เขียนทับระหว่างผู้ใช้พิมพ์
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    const incoming = value || ''
    if (el.innerHTML !== incoming && document.activeElement !== el) {
      el.innerHTML = incoming
    }
  }, [value])

  useEffect(() => {
    if (!colorOpen) return
    const onDown = (e) => {
      if (!colorRef.current?.contains(e.target)) setColorOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [colorOpen])

  function run(command, argument) {
    editorRef.current?.focus()
    // ค่าเริ่มต้นของเบราว์เซอร์คือสร้าง tag เก่าอย่าง <font color> ซึ่งตัวล้าง HTML
    // ฝั่งเซิร์ฟเวอร์ไม่รับ (สีจะหายตอนบันทึก) — เปิด styleWithCSS ให้ได้
    // <span style="color:..."> ที่อยู่ใน allowlist แทน
    try {
      document.execCommand('styleWithCSS', false, true)
    } catch {
      // เบราว์เซอร์เก่าบางตัวไม่รู้จักคำสั่งนี้ — ยังมีตัวแปลง font -> span
      // ที่ฝั่งเซิร์ฟเวอร์รับไว้อีกชั้น
    }
    document.execCommand(command, false, argument)
    // อ่านค่าออกทันทีหลังคำสั่ง เพราะ execCommand ไม่ยิง input event ทุกเบราว์เซอร์
    onChange(editorRef.current?.innerHTML || '')
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soil-700">
        {label}
        {required && <span className="ml-1 text-clay-600">*</span>}
      </label>

      <div className="overflow-hidden rounded-xl border border-forest-700/15 bg-white focus-within:border-forest-500 focus-within:ring-2 focus-within:ring-forest-500/20">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-forest-700/10 bg-sand-100/60 px-2 py-1.5">
          <ToolbarButton title="ตัวหนา" onRun={() => run('bold')} className="font-bold">B</ToolbarButton>
          <ToolbarButton title="ตัวเอียง" onRun={() => run('italic')} className="italic font-serif">I</ToolbarButton>
          <ToolbarButton title="ขีดเส้นใต้" onRun={() => run('underline')} className="underline">U</ToolbarButton>
          <ToolbarButton title="ขีดฆ่า" onRun={() => run('strikeThrough')} className="line-through">S</ToolbarButton>

          <span className="mx-1 h-5 w-px bg-forest-700/15" />

          <ToolbarButton title="ชิดซ้าย" onRun={() => run('justifyLeft')}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h10M4 18h13" />
            </svg>
          </ToolbarButton>
          <ToolbarButton title="กึ่งกลาง" onRun={() => run('justifyCenter')}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M7 12h10M6 18h12" />
            </svg>
          </ToolbarButton>
          <ToolbarButton title="ชิดขวา" onRun={() => run('justifyRight')}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M10 12h10M7 18h13" />
            </svg>
          </ToolbarButton>

          <span className="mx-1 h-5 w-px bg-forest-700/15" />

          <ToolbarButton title="รายการจุด" onRun={() => run('insertUnorderedList')}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1.2" fill="currentColor" /><circle cx="4.5" cy="12" r="1.2" fill="currentColor" /><circle cx="4.5" cy="18" r="1.2" fill="currentColor" />
            </svg>
          </ToolbarButton>
          <ToolbarButton title="รายการเลข" onRun={() => run('insertOrderedList')}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6h11M9 12h11M9 18h11M3 5h1.5v3M3 11h2l-2 3h2" />
            </svg>
          </ToolbarButton>

          <span className="mx-1 h-5 w-px bg-forest-700/15" />

          {/* สีตัวอักษร */}
          <div ref={colorRef} className="relative">
            <ToolbarButton title="สีตัวอักษร" onRun={() => setColorOpen((v) => !v)}>
              <span className="flex items-center gap-1">
                <span className="text-xs font-semibold">A</span>
                <span className="h-1.5 w-3.5 rounded-sm bg-gradient-to-r from-clay-600 to-forest-600" />
              </span>
            </ToolbarButton>
            {colorOpen && (
              <div className="absolute left-0 top-9 z-10 flex w-40 flex-wrap gap-1.5 rounded-xl border border-forest-700/12 bg-white p-2 shadow-card">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    aria-label={`สี ${c.label}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      run('foreColor', c.value)
                      setColorOpen(false)
                    }}
                    className="h-6 w-6 rounded-full border border-forest-700/15"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            )}
          </div>

          <ToolbarButton title="ล้างรูปแบบ" onRun={() => run('removeFormat')}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M7 6h12M11 6l-2 12M4 20l6-6" />
            </svg>
          </ToolbarButton>
        </div>

        {/* rich-text ใช้คลาสเดียวกับหน้าเว็บสาธารณะ ที่พิมพ์จึงหน้าตาเหมือนที่แสดงจริง */}
        <div
          id={id}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          onBlur={(e) => onChange(e.currentTarget.innerHTML)}
          style={{ minHeight }}
          className="rich-text max-h-80 overflow-y-auto px-3.5 py-3 text-sm outline-none"
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs font-medium text-clay-700">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-soil-500">{hint}</p>
      )}
    </div>
  )
}
