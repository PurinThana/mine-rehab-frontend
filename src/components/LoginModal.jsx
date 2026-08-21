import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../api/index.js";
import {
  ContourMark,
  IconAlert,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconSpinner,
} from "./Icons.jsx";

const LAST_EMAIL_KEY = "lastLoginEmail";

export default function LoginModal({ open, onClose }) {
  const { login } = useAuth();
  const emailId = useId();
  const passwordId = useId();
  const emailRef = useRef(null);

  const [email, setEmail] = useState(
    () => localStorage.getItem(LAST_EMAIL_KEY) || "",
  );
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() =>
    Boolean(localStorage.getItem(LAST_EMAIL_KEY)),
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ล้างรหัสผ่านและ error ทุกครั้งที่เปิดใหม่ — ไม่ทิ้งค่าค้างไว้ใน state
  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError("");
    setShowPassword(false);
    setSubmitting(false);
    // โฟกัสเองแทน autoFocus เพราะ element เพิ่ง mount พร้อม overlay
    const timer = setTimeout(() => emailRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [open]);

  // ปิดด้วย Esc + ล็อกการเลื่อนหน้าเว็บด้านหลัง
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await login(trimmedEmail, password);
      if (remember) localStorage.setItem(LAST_EMAIL_KEY, trimmedEmail);
      else localStorage.removeItem(LAST_EMAIL_KEY);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "เข้าสู่ระบบไม่สำเร็จ"));
      setPassword("");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-soil-900/45 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(e) => {
        // ปิดเมื่อคลิกพื้นหลัง แต่ไม่ปิดถ้าลากเมาส์ออกมาจากในกล่อง
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="w-full max-w-md overflow-hidden rounded-xl2 border border-forest-700/10 bg-sand-50 shadow-card"
      >
        {/* หัวกล่อง */}
        <div className="relative border-b border-forest-700/10 bg-forest-800 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-sand-50/70 transition-colors hover:bg-sand-50/10 hover:text-sand-50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sand-50">
              <ContourMark className="h-8 w-8" />
            </span>
            <span className="flex flex-col">
              <h2
                id="login-title"
                className="font-display text-lg font-semibold text-sand-50"
              >
                เข้าสู่ระบบสำหรับเจ้าหน้าที่
              </h2>
              <span className="text-xs text-sand-200/80">
                สำหรับผู้ดูแลข้อมูลโครงการเท่านั้น
              </span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6" noValidate>
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-clay-500/30 bg-clay-400/10 px-3.5 py-3 text-sm text-clay-700"
            >
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* อีเมล */}
          <label
            htmlFor={emailId}
            className="mb-1.5 block text-sm font-medium text-soil-700"
          >
            อีเมล
          </label>
          <div className="relative mb-4">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-soil-400">
              <IconMail className="h-[18px] w-[18px]" />
            </span>
            <input
              id={emailId}
              ref={emailRef}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="name@example.com"
              disabled={submitting}
              className="w-full rounded-xl border border-forest-700/15 bg-white py-2.5 pl-11 pr-3.5 text-sm text-soil-900 outline-none transition-colors placeholder:text-soil-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 disabled:opacity-60"
            />
          </div>

          {/* รหัสผ่าน */}
          <label
            htmlFor={passwordId}
            className="mb-1.5 block text-sm font-medium text-soil-700"
          >
            รหัสผ่าน
          </label>
          <div className="relative mb-4">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-soil-400">
              <IconLock className="h-[18px] w-[18px]" />
            </span>
            <input
              id={passwordId}
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={submitting}
              className="w-full rounded-xl border border-forest-700/15 bg-white py-2.5 pl-11 pr-11 text-sm text-soil-900 outline-none transition-colors placeholder:text-soil-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-soil-400 transition-colors hover:bg-forest-700/5 hover:text-soil-600"
            >
              {showPassword ? (
                <IconEyeOff className="h-[18px] w-[18px]" />
              ) : (
                <IconEye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          <label className="mb-5 flex w-fit cursor-pointer items-center gap-2.5 text-sm text-soil-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-forest-700/25 accent-forest-600"
            />
            จำอีเมลนี้ไว้
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 py-3 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting && <IconSpinner className="h-4 w-4" />}
            {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-soil-500">
            ผู้เข้าชมทั่วไปดูข้อมูลทั้งหมดได้โดยไม่ต้องเข้าสู่ระบบ
            <br />
            หากลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบของโครงการ
          </p>
        </form>
      </div>
    </div>
  );
}
