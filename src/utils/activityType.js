import {
  IconSprout,
  IconArea,
  IconBench,
  IconRain,
  IconGauge,
  IconTree,
} from '../components/Icons.jsx'

/**
 * เลือกไอคอนให้กิจกรรมจาก activity_type
 *
 * activities.activity_type เป็น VARCHAR(50) ไม่ใช่ ENUM — เป็นข้อความอิสระที่
 * ผู้ใช้ตั้งเองได้ (ข้อมูลจริงใช้คำไทยอย่าง "ปลูกต้นไม้", "ติดตั้งบันได")
 * จึงจับคู่ด้วยคำสำคัญ ไม่ผูกกับรายการค่าที่กำหนดไว้ล่วงหน้า แล้วมีไอคอนสำรอง
 * เสมอเมื่อไม่ตรงอะไรเลย
 */
const RULES = [
  { icon: IconSprout, keywords: ['เพาะ', 'กล้า', 'sow', 'seed'] },
  { icon: IconArea, keywords: ['ดิน', 'ปรับพื้น', 'เตรียม', 'prepare', 'soil'] },
  { icon: IconRain, keywords: ['น้ำ', 'รด', 'บำรุง', 'water'] },
  { icon: IconGauge, keywords: ['สำรวจ', 'ตรวจ', 'วัด', 'survey', 'inspect'] },
  { icon: IconTree, keywords: ['รับต้น', 'ลำเลียง', 'ขนส่ง', 'deliver'] },
  { icon: IconBench, keywords: ['ปลูก', 'บันได', 'ระดับ', 'plant', 'bench'] },
]

export function iconForActivityType(activityType) {
  const value = String(activityType || '').toLowerCase()
  for (const rule of RULES) {
    if (rule.keywords.some((k) => value.includes(k.toLowerCase()))) return rule.icon
  }
  return IconSprout
}

/**
 * รายการประเภทที่ "มีอยู่จริง" ในข้อมูล พร้อมจำนวน เรียงจากมากไปน้อย
 * ใช้ทำปุ่มกรอง — จึงไม่มีปุ่มที่กดแล้วว่างเปล่า และรองรับประเภทใหม่
 * ที่ผู้ใช้เพิ่มเองโดยไม่ต้องแก้โค้ด
 */
export function activityTypesFrom(activities) {
  const counts = new Map()
  for (const a of activities || []) {
    const key = a.activity_type
    if (!key) continue
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, icon: iconForActivityType(key) }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key, 'th'))
}
