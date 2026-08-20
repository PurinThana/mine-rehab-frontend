import { useState } from "react";
import { ContourMark, IconLock } from "./Icons.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import UserMenu from "./UserMenu.jsx";

const LINKS = [
  { label: "หน้าหลัก", href: "#home", active: true },
  { label: "แผนฟื้นฟู", href: "#bench" },
  { label: "ความก้าวหน้า", href: "#overview" },
  { label: "ข้อมูลต้นไม้", href: "#species" },
  { label: "กิจกรรม", href: "#activities" },
  { label: "รายงาน", href: "#news" },
  { label: "ติดต่อ", href: "#contact" },
];

export default function Navbar({ onLoginClick, onAdminClick }) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, restoring } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-forest-700/10 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <ContourMark className="h-9 w-9 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-[15px] font-semibold text-forest-800 sm:text-base">
              ข้อมูลการฟื้นฟูเหมือง
            </span>
            <span className="text-[11px] text-soil-500 sm:text-xs">
              โครงการฟื้นฟูพื้นที่เหมืองด้วยการปลูกต้นเฟื่องฟ้า
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative py-1 text-sm font-medium transition-colors hover:text-forest-700 ${
                link.active ? "text-forest-800" : "text-soil-600"
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute -bottom-[13px] left-0 right-0 h-[2px] rounded-full bg-clay-600" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* ระหว่างกู้คืน session ยังไม่รู้ว่าล็อกอินอยู่หรือไม่ — เว้นที่ไว้กันเมนูกระพริบ */}
          {restoring ? (
            <span className="hidden h-9 w-32 animate-pulse rounded-full bg-forest-700/10 sm:block" />
          ) : isAuthenticated ? (
            <UserMenu onAdminClick={onAdminClick} />
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="hidden items-center gap-2 rounded-full bg-forest-700 px-4 py-2 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600 sm:flex"
            >
              <IconLock className="h-4 w-4" />
              สำหรับ กพร.
            </button>
          )}

          <button
            type="button"
            aria-label="เปิดเมนู"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-forest-700/15 text-forest-700 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-forest-700/10 bg-sand-50 px-5 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    link.active
                      ? "bg-forest-700/10 text-forest-800"
                      : "text-soil-600"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {!restoring && !isAuthenticated && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLoginClick?.();
                  }}
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-forest-700 px-3 py-2 text-center text-sm font-medium text-sand-50"
                >
                  <IconLock className="h-4 w-4" />
                  สำหรับ กพร.
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
