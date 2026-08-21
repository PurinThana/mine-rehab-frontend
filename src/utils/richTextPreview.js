/**
 * ตัด tag ออกจาก HTML เพื่อทำข้อความตัวอย่างบนการ์ดและในตารางหน้าแอดมิน
 *
 * เนื้อหาถูกล้างที่ฝั่งเซิร์ฟเวอร์แล้ว แต่ตรงนี้ต้องการ "ข้อความล้วน" ไม่ใช่
 * HTML ที่ปลอดภัย — ถ้าเอา HTML ไปใส่ในการ์ดตรงๆ จะเห็น <p> ปนกับข้อความ
 *
 * ใช้ DOMParser ไม่ใช่ regex เพื่อให้ entity อย่าง &amp; &nbsp; ถูกถอดรหัสถูกต้อง
 */
export function stripHtml(html, maxLength = 300) {
  if (!html) return ''

  let text
  if (/<[a-z][\s\S]*>/i.test(html)) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    text = doc.body.textContent || ''
  } else {
    text = String(html)
  }

  text = text.replace(/\s+/g, ' ').trim()
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}
