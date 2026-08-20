import { IconAlert, IconSpinner } from "../../components/Icons.jsx";

// การ์ดครอบแต่ละหมวดในหน้าแอดมิน + ปุ่มหลักมุมขวา
export function Section({ title, description, action, children }) {
  return (
    <section className="overflow-hidden rounded-xl2 border border-forest-700/10 bg-sand-50 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-forest-700/10 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-forest-800">{title}</h2>
          {description && <p className="mt-0.5 text-xs leading-relaxed text-soil-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-1.5 rounded-xl bg-forest-700 px-4 py-2 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, tone = "neutral", className = "", ...props }) {
  const tones = {
    neutral: "text-soil-600 hover:bg-forest-700/5 hover:text-soil-800",
    danger: "text-clay-700 hover:bg-clay-400/10",
    forest: "text-forest-700 hover:bg-forest-700/5",
  };
  return (
    <button
      type="button"
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconPlus({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// สถานะ loading / error / ว่าง ของทุกตาราง ให้หน้าตาเหมือนกันทั้งหน้าแอดมิน
export function StateBlock({ loading, error, empty, emptyText, onRetry, children }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2.5 px-5 py-12 text-sm text-soil-500">
        <IconSpinner className="h-4 w-4" />
        กำลังโหลดข้อมูล...
      </div>
    );
  }
  if (error) {
    return (
      <div className="px-5 py-10 text-center">
        <IconAlert className="mx-auto h-6 w-6 text-clay-600" />
        <p className="mt-2 text-sm text-clay-700">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-xl border border-forest-700/15 px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-700/5"
          >
            ลองอีกครั้ง
          </button>
        )}
      </div>
    );
  }
  if (empty) {
    return (
      <p className="px-5 py-12 text-center text-sm text-soil-500">
        {emptyText || "ยังไม่มีข้อมูลในหมวดนี้"}
      </p>
    );
  }
  return children;
}

// ตารางที่เลื่อนแนวนอนได้เองบนจอแคบ ไม่ทำให้ทั้งหน้าเลื่อน
export function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }) {
  return (
    <th
      className={`border-b border-forest-700/10 bg-sand-100/60 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-soil-500 ${className}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`border-b border-forest-700/8 px-4 py-3 align-middle ${className}`}>{children}</td>;
}

export function StatusBadge({ planted }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        planted ? "bg-forest-700/10 text-forest-700" : "bg-bloom-400/20 text-bloom-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${planted ? "bg-forest-500" : "bg-bloom-500"}`} />
      {planted ? "ปลูกแล้ว" : "ยังไม่ได้ปลูก"}
    </span>
  );
}
