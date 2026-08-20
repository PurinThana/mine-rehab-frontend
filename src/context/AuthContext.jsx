import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  authApi,
  clearAuthToken,
  getAuthToken,
  onUnauthorized,
  setAuthToken,
} from "../api/index.js";

const AuthContext = createContext(null);

const EXPIRY_KEY = "tokenExpiresAt"; // unix seconds ที่ backend ส่งมาพร้อม token

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `restoring` = true ระหว่างตรวจ token เดิมใน localStorage ตอนเปิดหน้าเว็บ
  // ทำให้ Navbar ไม่กระพริบเป็น "เข้าสู่ระบบ" ทั้งที่ยังล็อกอินอยู่
  const [restoring, setRestoring] = useState(() => Boolean(getAuthToken()));
  const [sessionExpired, setSessionExpired] = useState(false);
  const expiryTimer = useRef(null);

  const endSession = useCallback(({ expired = false } = {}) => {
    clearAuthToken();
    localStorage.removeItem(EXPIRY_KEY);
    if (expiryTimer.current) clearTimeout(expiryTimer.current);
    setUser(null);
    // ตั้งค่าได้ทางเดียว: เคลียร์เฉพาะตอน login สำเร็จหรือผู้ใช้กดปิดเอง
    // ไม่งั้น endSession() ที่ตามมาทีหลัง (เช่นใน .catch ของ /auth/me)
    // จะลบธงที่ interceptor เพิ่งตั้งไว้ แล้วแจ้งเตือนจะไม่ขึ้นเลย
    if (expired) setSessionExpired(true);
  }, []);

  // ตั้งเวลาให้ session หลุดเองตอน token หมดอายุ ผู้ใช้จะไม่เจอปุ่มที่กดแล้ว
  // error เพราะ token ตายไปแล้วแต่หน้าเว็บยังคิดว่าล็อกอินอยู่
  const scheduleExpiry = useCallback(
    (expiresAtSeconds) => {
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
      if (!expiresAtSeconds) return;

      const msLeft = expiresAtSeconds * 1000 - Date.now();
      if (msLeft <= 0) {
        endSession({ expired: true });
        return;
      }
      // setTimeout เก็บได้สูงสุด ~24.8 วัน (32-bit) — token อายุ 8h ไม่ถึงอยู่แล้ว
      expiryTimer.current = setTimeout(() => endSession({ expired: true }), msLeft);
    },
    [endSession],
  );

  // ถ้า request ใดๆ ได้ 401 (token หมดอายุ/ถูกแก้) ให้เคลียร์ session ทันที
  useEffect(() => onUnauthorized(() => endSession({ expired: true })), [endSession]);

  // กู้คืน session ตอนโหลดหน้าเว็บ: ยิง /auth/me เพื่อยืนยันว่า token ยังใช้ได้จริง
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setRestoring(false);
      return;
    }

    let cancelled = false;
    authApi
      .getMe()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        const savedExpiry = Number(localStorage.getItem(EXPIRY_KEY)) || null;
        scheduleExpiry(savedExpiry);
      })
      .catch(() => {
        // 401 ถูกจัดการโดย interceptor แล้ว ที่เหลือ (เช่น backend ล่ม) ก็ถือว่า
        // ยังไม่ได้ล็อกอิน ปลอดภัยกว่าปล่อยให้แสดงว่าล็อกอินอยู่
        if (!cancelled) endSession();
      })
      .finally(() => {
        if (!cancelled) setRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, [endSession, scheduleExpiry]);

  useEffect(() => () => clearTimeout(expiryTimer.current), []);

  const login = useCallback(
    async (email, password) => {
      // โยน error ต่อให้ฟอร์มจัดการ เพื่อให้ข้อความ error อยู่ติดกับ input
      const data = await authApi.login({ email, password });
      setAuthToken(data.token);
      if (data.expiresAt) localStorage.setItem(EXPIRY_KEY, String(data.expiresAt));
      setSessionExpired(false);
      setUser(data.user);
      scheduleExpiry(data.expiresAt);
      return data.user;
    },
    [scheduleExpiry],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // token อาจหมดอายุไปแล้ว — ไม่เป็นไร ฝั่ง client ล้างทิ้งได้เลย
    }
    endSession();
    setSessionExpired(false); // ออกจากระบบเอง ไม่ต้องขึ้นแจ้งเตือน
  }, [endSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      restoring,
      sessionExpired,
      dismissSessionExpired: () => setSessionExpired(false),
      login,
      logout,
    }),
    [user, restoring, sessionExpired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth ต้องอยู่ภายใน <AuthProvider>");
  return ctx;
}

