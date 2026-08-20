import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { IconAlert } from "../../components/Icons.jsx";

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, tone = "success") => {
      const id = nextId++;
      setToasts((list) => [...list, { id, message, tone }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), tone === "error" ? 6000 : 3500),
      );
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 rounded-xl2 border px-4 py-3 text-sm shadow-card ${
              toast.tone === "error"
                ? "border-clay-500/30 bg-clay-400/10 text-clay-700"
                : "border-forest-500/30 bg-forest-50 text-forest-700"
            }`}
          >
            {toast.tone === "error" ? (
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="ปิดการแจ้งเตือน"
              className="-mr-1 -mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md opacity-60 transition-opacity hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast ต้องอยู่ภายใน <ToastProvider>");
  return ctx;
}
