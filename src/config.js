// ไซต์ที่หน้า landing แสดงข้อมูลของ — เว็บสาธารณะโชว์ทีละไซต์
// ตั้งค่าได้ผ่าน VITE_SITE_ID ถ้ามีหลายไซต์ในฐานข้อมูล
export const SITE_ID = Number(import.meta.env.VITE_SITE_ID) || 1;
