// backend เปิด dateStrings ไว้ จึงได้ DATE เป็น 'YYYY-MM-DD' ตรงๆ
// ใส่ <input type="date"> ได้เลยโดยไม่ต้องแปลง timezone (ซึ่งเป็นจุดที่วันมักเลื่อน)

export function todayISO() {
  const now = new Date();
  // ใช้เวลาท้องถิ่น ไม่ใช้ toISOString() เพราะมันแปลงเป็น UTC แล้ววันอาจเลื่อนไป 1 วัน
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

// '2026-08-20' -> '20 ส.ค. 2569' (พ.ศ.)
export function formatThaiDate(isoDate) {
  if (!isoDate) return "-";
  const [year, month, day] = String(isoDate).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return String(isoDate);
  return `${day} ${THAI_MONTHS[month - 1]} ${year + 543}`;
}

export function formatNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("th-TH") : "-";
}
