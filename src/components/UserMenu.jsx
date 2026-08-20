import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { IconLogout, IconSettings, IconUser } from "./Icons.jsx";

// ตัวอักษรแรกของชื่อ ใช้เป็น avatar แบบไม่ต้องมีรูป
function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.length === 1 ? parts[0].slice(0, 1) : parts[0][0] + parts[1][0];
}

const ROLE_LABEL = { admin: "ผู้ดูแลระบบ", staff: "เจ้าหน้าที่" };

export default function UserMenu({ onAdminClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const wrapRef = useRef(null);

  // ปิดเมนูเมื่อคลิกที่อื่นหรือกด Esc
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setOpen(false);
    setLoggingOut(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-forest-700/15 bg-white/70 py-1.5 pl-1.5 pr-3 text-sm transition-colors hover:border-forest-700/30 hover:bg-white"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest-700 font-display text-xs font-semibold uppercase text-sand-50">
          {initials(user.name)}
        </span>
        <span className="hidden max-w-[10rem] truncate font-medium text-forest-800 sm:block">
          {user.name}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 shrink-0 text-soil-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] w-64 overflow-hidden rounded-xl2 border border-forest-700/10 bg-sand-50 shadow-card"
        >
          <div className="border-b border-forest-700/10 px-4 py-3.5">
            <p className="flex items-center gap-2 font-display text-sm font-semibold text-forest-800">
              <IconUser className="h-4 w-4 shrink-0 text-forest-600" />
              <span className="truncate">{user.name}</span>
            </p>
            <p className="mt-1 truncate text-xs text-soil-500">{user.email}</p>
            <span className="mt-2 inline-block rounded-full bg-forest-700/10 px-2.5 py-0.5 text-[11px] font-medium text-forest-700">
              {ROLE_LABEL[user.role] || user.role}
            </span>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onAdminClick?.();
            }}
            className="flex w-full items-center gap-2.5 border-b border-forest-700/10 px-4 py-3 text-left text-sm font-medium text-forest-700 transition-colors hover:bg-forest-700/5"
          >
            <IconSettings className="h-4 w-4 shrink-0" />
            จัดการข้อมูลเว็บไซต์
          </button>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-left text-sm font-medium text-clay-700 transition-colors hover:bg-clay-400/10 disabled:opacity-60"
          >
            <IconLogout className="h-4 w-4 shrink-0" />
            {loggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
          </button>
        </div>
      )}
    </div>
  );
}
