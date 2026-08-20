import { useAuth } from "../context/AuthContext.jsx";
import { IconAlert } from "./Icons.jsx";

// แจ้งเตือนตอน token หมดอายุ (หรือถูกปฏิเสธด้วย 401) ผู้ใช้จะได้รู้ว่าทำไม
// ปุ่มแก้ไขข้อมูลหายไป แทนที่จะงงว่าระบบพัง
export default function SessionExpiredNotice({ onLoginClick }) {
  const { sessionExpired, dismissSessionExpired } = useAuth();

  if (!sessionExpired) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-40 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl2 border border-bloom-500/40 bg-sand-50 px-4 py-3.5 shadow-card"
    >
      <div className="flex items-start gap-3">
        <IconAlert className="mt-0.5 h-5 w-5 shrink-0 text-bloom-600" />
        <div className="flex-1">
          <p className="font-display text-sm font-semibold text-forest-800">
            เซสชันหมดอายุแล้ว
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-soil-600">
            ระบบออกจากระบบให้อัตโนมัติเพื่อความปลอดภัย
            กรุณาเข้าสู่ระบบใหม่หากต้องการแก้ไขข้อมูล
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                dismissSessionExpired();
                onLoginClick?.();
              }}
              className="rounded-lg bg-forest-700 px-3 py-1.5 text-xs font-medium text-sand-50 transition-colors hover:bg-forest-600"
            >
              เข้าสู่ระบบใหม่
            </button>
            <button
              type="button"
              onClick={dismissSessionExpired}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-soil-500 transition-colors hover:bg-forest-700/5 hover:text-soil-700"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
