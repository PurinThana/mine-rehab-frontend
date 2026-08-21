/**
 * แสดงเนื้อหาที่จัดรูปแบบไว้ (ตัวหนา / สี / จัดตำแหน่ง / รายการ)
 *
 * ความปลอดภัย: HTML ถูกล้างที่ฝั่งเซิร์ฟเวอร์แล้วก่อนเก็บลงฐานข้อมูล
 * (backend/src/utils/richText.js) ค่าที่มาถึงตรงนี้จึงผ่าน allowlist แล้ว —
 * ห้ามนำ component นี้ไปใช้กับ HTML จากแหล่งอื่นที่ไม่ผ่านการล้าง
 *
 * ข้อมูลเก่าเป็นข้อความธรรมดา (ยังไม่มีตัวแก้ไข) จึงตรวจก่อนว่ามี tag ไหม
 * ถ้าไม่มีก็แสดงเป็นข้อความล้วนพร้อมรักษาการเว้นบรรทัดไว้ ไม่ต้องแปลงข้อมูลเดิม
 */
export default function RichText({ html, className = '' }) {
  if (!html) return null

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(html)

  if (!looksLikeHtml) {
    return <div className={`whitespace-pre-line ${className}`}>{html}</div>
  }

  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
