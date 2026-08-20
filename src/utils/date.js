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

// '2568-02-01' -> { years, months } ของช่วงเวลาระหว่างสองวัน
function diffYearsMonths(fromISO, toISO) {
  const [fy, fm, fd] = String(fromISO).slice(0, 10).split("-").map(Number);
  const [ty, tm, td] = String(toISO).slice(0, 10).split("-").map(Number);
  let months = (ty - fy) * 12 + (tm - fm);
  if (td < fd) months -= 1; // ยังไม่ครบเดือน
  if (months < 0) months = 0;
  return { years: Math.floor(months / 12), months: months % 12 };
}

function thaiDuration({ years, months }) {
  const parts = [];
  if (years) parts.push(`${years} ปี`);
  if (months) parts.push(`${months} เดือน`);
  return parts.length ? parts.join(" ") : "น้อยกว่า 1 เดือน";
}

/**
 * สรุประยะเวลาโครงการจาก start_date / end_date สำหรับแถบ "ระยะเวลาดำเนินงาน"
 * คำนวณจากวันนี้ทุกครั้งที่เรียก จึงไม่มีตัวเลขค้างให้ต้องมาแก้ทีหลัง
 */
export function projectDuration(startDate, endDate, today = todayISO()) {
  if (!startDate || !endDate) return null;

  const total = diffYearsMonths(startDate, endDate);
  const clampedToday = today < startDate ? startDate : today > endDate ? endDate : today;
  const elapsed = diffYearsMonths(startDate, clampedToday);

  const totalMonths = total.years * 12 + total.months;
  const elapsedMonths = elapsed.years * 12 + elapsed.months;

  return {
    totalLabel: thaiDuration(total),
    elapsedLabel: today < startDate ? "ยังไม่เริ่ม" : thaiDuration(elapsed),
    // ปัดให้อยู่ใน 0–100 เสมอ กันแถบ progress ล้นกรอบถ้าวันที่ในฐานข้อมูลเพี้ยน
    percent: totalMonths > 0 ? Math.min(100, Math.round((elapsedMonths / totalMonths) * 100)) : 0,
    finished: today >= endDate,
  };
}
