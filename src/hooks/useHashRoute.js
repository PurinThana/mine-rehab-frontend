import { useCallback, useEffect, useState } from "react";

// Routing แบบ hash ที่ไม่ต้องพึ่ง react-router และไม่ต้องตั้งค่า server
// สำหรับ SPA fallback — ใช้ prefix "#/" เสมอ ("#/admin", "#/admin/news")
// จึงไม่ชนกับ anchor ของหน้า landing ที่เป็น "#home", "#bench" (ไม่มี slash)
function readPath() {
  const hash = window.location.hash || "";
  if (!hash.startsWith("#/")) return "/"; // anchor ธรรมดา = ยังอยู่หน้า landing
  return hash.slice(1) || "/";
}

export function useHashRoute() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onChange = () => setPath(readPath());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((to) => {
    // ตั้งค่า hash ให้ browser ยิง hashchange เอง — ได้ประวัติ back/forward ฟรี
    window.location.hash = to === "/" ? "" : `#${to}`;
    if (to === "/") setPath("/"); // การลบ hash ทิ้งไม่ยิง hashchange ทุกเบราว์เซอร์
  }, []);

  // segments ของ "/admin/news" = ["admin", "news"]
  const segments = path.split("/").filter(Boolean);

  return { path, segments, navigate };
}
