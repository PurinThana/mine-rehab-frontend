import { useEffect } from "react";
import { IconAlert, IconSpinner } from "../../components/Icons.jsx";

// กล่อง modal พื้นฐาน: Esc ปิด, คลิกพื้นหลังปิด, ล็อก scroll ด้านหลัง
export function Modal({ open, onClose, title, subtitle, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-soil-900/45 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`w-full ${maxWidth} my-auto overflow-hidden rounded-xl2 border border-forest-700/10 bg-sand-50 shadow-card`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-forest-700/10 px-5 py-4">
          <div>
            <h3 className="font-display text-base font-semibold text-forest-800">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-soil-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-soil-400 transition-colors hover:bg-forest-700/5 hover:text-soil-600"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Modal + <form> + ปุ่มบันทึก/ยกเลิก + แถบ error — ทุกฟอร์มในหน้าแอดมินใช้ตัวนี้
export function FormModal({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  error,
  submitting,
  submitLabel = "บันทึก",
  children,
  maxWidth,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle} maxWidth={maxWidth}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!submitting) onSubmit();
        }}
        noValidate
      >
        <div className="max-h-[min(60vh,32rem)] overflow-y-auto px-5 py-5">
          {error && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-xl border border-clay-500/30 bg-clay-400/10 px-3.5 py-3 text-sm text-clay-700"
            >
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="grid gap-4">{children}</div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-forest-700/10 bg-sand-100/60 px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-soil-600 transition-colors hover:bg-forest-700/5 disabled:opacity-60"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2.5 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting && <IconSpinner className="h-4 w-4" />}
            {submitting ? "กำลังบันทึก..." : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ยืนยันก่อนลบ — ระบุชื่อรายการที่จะลบให้ชัด กันกดผิดแถว
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "ยืนยันการลบ",
  message,
  itemLabel,
  error,
  submitting,
  confirmLabel = "ลบ",
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="px-5 py-5">
        {error && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2.5 rounded-xl border border-clay-500/30 bg-clay-400/10 px-3.5 py-3 text-sm text-clay-700"
          >
            <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <p className="text-sm leading-relaxed text-soil-600">
          {message || "การลบนี้ย้อนกลับไม่ได้ ต้องการดำเนินการต่อหรือไม่"}
        </p>
        {itemLabel && (
          <p className="mt-3 rounded-xl border border-forest-700/10 bg-white px-3.5 py-2.5 text-sm font-medium text-forest-800">
            {itemLabel}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end gap-2.5 border-t border-forest-700/10 bg-sand-100/60 px-5 py-3.5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-soil-600 transition-colors hover:bg-forest-700/5 disabled:opacity-60"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-clay-600 px-5 py-2.5 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-clay-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && <IconSpinner className="h-4 w-4" />}
          {submitting ? "กำลังลบ..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
