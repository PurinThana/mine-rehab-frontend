import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { sitesApi, benchLevelsApi, speciesApi, getErrorMessage } from "../api/index.js";
import { SITE_ID } from "../config.js";

/**
 * ข้อมูลชุดเดียวของไซต์ที่หน้า landing ใช้ร่วมกันหลาย section
 *
 * ทำไมต้องมี context ไม่ให้แต่ละ component ยิงเอง: Hero, StatsOverview,
 * BenchSummary และ FlowerTypes ใช้ข้อมูลชุดเดียวกันซ้ำๆ (overview ใช้ 2 ที่,
 * bench-levels ใช้ 2 ที่, species-totals ใช้ 3 ที่) ถ้าแยกกันยิงจะกลายเป็น
 * ~9 คำขอต่อการเปิดหน้าเดียว ซึ่งแพงมากบน host ฟรีที่มี cold start
 *
 * โหลดพร้อมกันทีเดียว 4 คำขอ แล้วแชร์ผลให้ทุก section
 */
const SiteDataContext = createContext(null);

export function SiteDataProvider({ children }) {
  const [data, setData] = useState({
    site: null,
    overview: null,
    benchLevels: null,
    speciesTotals: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const [site, overview, benchLevels, speciesTotals] = await Promise.all([
        sitesApi.getById(SITE_ID),
        sitesApi.getOverview(SITE_ID),
        benchLevelsApi.getBySiteId(SITE_ID),
        speciesApi.getTotalsBySite(SITE_ID),
      ]);
      if (id !== requestId.current) return; // ผลของคำขอเก่า ทิ้งไป
      setData({ site, overview, benchLevels, speciesTotals });
    } catch (err) {
      // ทั้งสี่คำขอไปที่เซิร์ฟเวอร์เดียวกัน ถ้าพลาดมักพลาดพร้อมกัน (backend ล่ม /
      // ยังไม่ตื่นจาก cold start) จึงรายงานเป็น error เดียวแล้วให้กดลองใหม่ได้
      if (id === requestId.current) setError(getErrorMessage(err, "โหลดข้อมูลไม่สำเร็จ"));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => ({ ...data, loading, error, reload: load }), [data, loading, error, load]);

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData ต้องอยู่ภายใน <SiteDataProvider>");
  return ctx;
}
