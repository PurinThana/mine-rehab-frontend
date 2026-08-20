import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../api/index.js";

// โหลดข้อมูลหนึ่งชุด + reload หลังแก้ไข ทุก section ในหน้าแอดมินใช้ตัวนี้
// ตัวเดียวกัน จึงได้พฤติกรรม loading / error / reload เหมือนกันหมด
//
// fetcher ต้องเป็น useCallback ฝั่งผู้เรียก ไม่งั้น effect จะวนไม่จบ
export function useCollection(fetcher, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");
  // กัน response ของคำขอเก่ามาทับของใหม่ (เช่นสลับไซต์เร็วๆ)
  const requestId = useRef(0);

  const load = useCallback(async () => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      return;
    }
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = await fetcher();
      if (id === requestId.current) setData(result);
    } catch (err) {
      if (id === requestId.current) setError(getErrorMessage(err, "โหลดข้อมูลไม่สำเร็จ"));
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
