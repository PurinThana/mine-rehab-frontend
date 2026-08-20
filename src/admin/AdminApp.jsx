import { useCallback, useEffect, useMemo, useState } from "react";
import { sitesApi } from "../api/index.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCollection } from "../hooks/useCollection.js";
import { ToastProvider } from "./ui/Toast.jsx";
import { ContourMark, IconAlert, IconLock, IconLogout, IconSpinner } from "../components/Icons.jsx";

import SiteSection from "./sections/SiteSection.jsx";
import BenchLevelsSection from "./sections/BenchLevelsSection.jsx";
import SpeciesSection from "./sections/SpeciesSection.jsx";
import ActivitiesSection from "./sections/ActivitiesSection.jsx";
import NewsSection from "./sections/NewsSection.jsx";
import DocumentsSection from "./sections/DocumentsSection.jsx";
import SnapshotsSection from "./sections/SnapshotsSection.jsx";

// key ตรงกับ segment ที่สองของ hash: "#/admin/news" -> "news"
const NAV = [
  { key: "site", label: "ข้อมูลโครงการ", Component: SiteSection },
  { key: "bench-levels", label: "ระดับชั้น (Bench)", Component: BenchLevelsSection },
  { key: "species", label: "พันธุ์พืช", Component: SpeciesSection },
  { key: "activities", label: "กิจกรรม", Component: ActivitiesSection },
  { key: "news", label: "ข่าวสาร", Component: NewsSection },
  { key: "documents", label: "เอกสาร", Component: DocumentsSection },
  { key: "snapshots", label: "ประวัติความคืบหน้า", Component: SnapshotsSection },
];

const ROLE_LABEL = { admin: "ผู้ดูแลระบบ", staff: "เจ้าหน้าที่" };

function CenteredCard({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-50 px-5 py-12">
      <div className="w-full max-w-md rounded-xl2 border border-forest-700/10 bg-sand-50 px-6 py-8 text-center shadow-card">
        {children}
      </div>
    </div>
  );
}

export default function AdminApp({ section, onNavigate, onExit, onLoginClick }) {
  const { user, isAuthenticated, isAdmin, restoring, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sitesFetcher = useCallback(() => sitesApi.getAll(), []);
  const { data: sites, loading: sitesLoading, error: sitesError, reload: reloadSites } =
    useCollection(sitesFetcher, { enabled: isAuthenticated });

  const [siteId, setSiteId] = useState(null);

  // เลือกไซต์เริ่มต้น: ไซต์ที่ผู้ใช้สังกัด ถ้าไม่มี (เช่น admin ที่ไม่ผูกไซต์) ใช้ไซต์แรก
  useEffect(() => {
    if (siteId || !sites?.length) return;
    const own = user?.siteId && sites.find((s) => s.id === user.siteId);
    setSiteId(own ? own.id : sites[0].id);
  }, [sites, user, siteId]);

  const active = useMemo(() => NAV.find((n) => n.key === section) || NAV[0], [section]);

  // --- ด่านตรวจสิทธิ์ ---
  if (restoring) {
    return (
      <CenteredCard>
        <IconSpinner className="mx-auto h-6 w-6 text-forest-600" />
        <p className="mt-3 text-sm text-soil-500">กำลังตรวจสอบสิทธิ์...</p>
      </CenteredCard>
    );
  }

  if (!isAuthenticated) {
    return (
      <CenteredCard>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-forest-700/10">
          <IconLock className="h-6 w-6 text-forest-700" />
        </span>
        <h1 className="mt-4 font-display text-lg font-semibold text-forest-800">
          ต้องเข้าสู่ระบบก่อน
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-soil-500">
          หน้าจัดการข้อมูลเปิดให้เฉพาะเจ้าหน้าที่ที่เข้าสู่ระบบแล้ว
        </p>
        <div className="mt-5 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-xl bg-forest-700 px-5 py-2.5 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600"
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-soil-600 transition-colors hover:bg-forest-700/5"
          >
            กลับหน้าเว็บ
          </button>
        </div>
      </CenteredCard>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-sand-100/50">
        {/* หัวหน้าจัดการ */}
        <header className="sticky top-0 z-30 border-b border-forest-700/10 bg-sand-50/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <ContourMark className="h-9 w-9 shrink-0" />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="font-display text-[15px] font-semibold text-forest-800">
                  จัดการข้อมูลเว็บไซต์
                </span>
                <span className="truncate text-[11px] text-soil-500">
                  {user.name} · {ROLE_LABEL[user.role] || user.role}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onExit}
                className="hidden rounded-full border border-forest-700/15 bg-white/70 px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-white sm:block"
              >
                ดูหน้าเว็บ
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-clay-700 transition-colors hover:bg-clay-400/10"
              >
                <IconLogout className="h-4 w-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl gap-6 px-5 py-6 lg:flex lg:px-8">
          {/* เมนูข้าง (จอใหญ่) */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-[5.5rem] flex flex-col gap-1">
              {NAV.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                    item.key === active.key
                      ? "bg-forest-700 text-sand-50 shadow-card"
                      : "text-soil-600 hover:bg-forest-700/5 hover:text-forest-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 flex-1">
            {/* เมนู (จอเล็ก) */}
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-expanded={mobileNavOpen}
                className="flex w-full items-center justify-between rounded-xl border border-forest-700/15 bg-sand-50 px-4 py-3 text-sm font-medium text-forest-800"
              >
                {active.label}
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 text-soil-400 transition-transform ${mobileNavOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M6 9.5l6 6 6-6" />
                </svg>
              </button>
              {mobileNavOpen && (
                <div className="mt-1.5 flex flex-col gap-1 rounded-xl border border-forest-700/10 bg-sand-50 p-1.5">
                  {NAV.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        onNavigate(item.key);
                        setMobileNavOpen(false);
                      }}
                      className={`rounded-lg px-3 py-2 text-left text-sm font-medium ${
                        item.key === active.key
                          ? "bg-forest-700/10 text-forest-800"
                          : "text-soil-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ตัวเลือกไซต์ — ทุกหมวดยึดไซต์ที่เลือกไว้ตัวนี้ */}
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl2 border border-forest-700/10 bg-sand-50 px-5 py-3.5 shadow-card">
              <label htmlFor="admin-site" className="text-sm font-medium text-soil-700">
                ไซต์ที่กำลังจัดการ
              </label>
              {sitesLoading ? (
                <span className="flex items-center gap-2 text-sm text-soil-500">
                  <IconSpinner className="h-4 w-4" /> กำลังโหลด...
                </span>
              ) : sitesError ? (
                <span className="flex items-center gap-2 text-sm text-clay-700">
                  <IconAlert className="h-4 w-4" /> {sitesError}
                  <button type="button" onClick={reloadSites} className="underline">
                    ลองอีกครั้ง
                  </button>
                </span>
              ) : (
                <select
                  id="admin-site"
                  value={siteId ?? ""}
                  onChange={(e) => setSiteId(Number(e.target.value))}
                  className="min-w-0 flex-1 rounded-xl border border-forest-700/15 bg-white px-3.5 py-2 text-sm text-soil-900 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
                >
                  {(sites || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              )}
              {!isAdmin && (
                <span className="rounded-full bg-bloom-400/20 px-2.5 py-0.5 text-[11px] font-medium text-bloom-600">
                  สิทธิ์เจ้าหน้าที่ — ลบระดับชั้น/พันธุ์พืชไม่ได้
                </span>
              )}
            </div>

            {siteId ? (
              <active.Component siteId={siteId} />
            ) : (
              !sitesLoading &&
              !sitesError && (
                <p className="rounded-xl2 border border-forest-700/10 bg-sand-50 px-5 py-12 text-center text-sm text-soil-500 shadow-card">
                  ยังไม่มีไซต์ในระบบ — ต้องสร้างไซต์ก่อนจึงจะจัดการข้อมูลได้
                </p>
              )
            )}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
