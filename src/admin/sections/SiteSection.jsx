import { useCallback, useEffect, useState } from "react";
import { sitesApi, getErrorMessage } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useToast } from "../ui/Toast.jsx";
import { DateField, TextField } from "../ui/Field.jsx";
import { Section, StateBlock } from "../ui/Section.jsx";
import { IconAlert, IconSpinner } from "../../components/Icons.jsx";
import { formatNumber } from "../utils/date.js";

// ตัวเลขภาพรวมคำนวณสดจาก view ไม่มีคอลัมน์ให้แก้ — แสดงอ่านอย่างเดียว
// เพื่อให้เห็นผลของการแก้ระดับชั้น/การปลูกได้ทันทีในหน้าเดียว
function OverviewStat({ label, value, unit }) {
  return (
    <div className="rounded-xl border border-forest-700/10 bg-white px-4 py-3">
      <p className="text-xs text-soil-500">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold text-forest-800">
        <span className="tick-num">{value}</span>
        {unit && <span className="ml-1 text-xs font-normal text-soil-500">{unit}</span>}
      </p>
    </div>
  );
}

export default function SiteSection({ siteId }) {
  const toast = useToast();

  const siteFetcher = useCallback(() => sitesApi.getById(siteId), [siteId]);
  const { data: site, loading, error, reload } = useCollection(siteFetcher, {
    enabled: Boolean(siteId),
  });

  const overviewFetcher = useCallback(() => sitesApi.getOverview(siteId), [siteId]);
  const { data: overview, reload: reloadOverview } = useCollection(overviewFetcher, {
    enabled: Boolean(siteId),
  });

  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // เติมค่าในฟอร์มเมื่อโหลดไซต์เสร็จ (และเมื่อสลับไซต์)
  useEffect(() => {
    if (!site) return;
    setForm({
      name: site.name,
      companyName: site.company_name,
      startDate: site.start_date,
      endDate: site.end_date,
    });
    setFormError("");
  }, [site]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  async function save(e) {
    e.preventDefault();
    if (saving || !form) return;

    if (!form.name.trim()) return setFormError("กรุณากรอกชื่อโครงการ");
    if (!form.companyName.trim()) return setFormError("กรุณากรอกชื่อผู้ประกอบการ");
    if (!form.startDate || !form.endDate) return setFormError("กรุณาเลือกวันเริ่มและวันสิ้นสุด");
    if (form.endDate < form.startDate) return setFormError("วันสิ้นสุดต้องไม่มาก่อนวันเริ่มโครงการ");

    setSaving(true);
    setFormError("");
    try {
      await sitesApi.update(siteId, {
        name: form.name.trim(),
        companyName: form.companyName.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      toast.success("บันทึกข้อมูลโครงการแล้ว");
      await reload();
      await reloadOverview();
    } catch (err) {
      setFormError(getErrorMessage(err, "บันทึกไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5">
      <Section
        title="ข้อมูลโครงการ"
        description="ชื่อและช่วงเวลาที่แสดงบนหัวเว็บและแถบ “ระยะเวลาดำเนินงาน”"
      >
        <StateBlock loading={loading || !form} error={error} onRetry={reload}>
          {form && (
            <form onSubmit={save} noValidate>
              <div className="grid gap-4 px-5 py-5">
                {formError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-clay-500/30 bg-clay-400/10 px-3.5 py-3 text-sm text-clay-700"
                  >
                    <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <TextField
                  label="ชื่อโครงการ"
                  required
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
                <TextField
                  label="ชื่อผู้ประกอบการ"
                  required
                  value={form.companyName}
                  onChange={(e) => setField("companyName", e.target.value)}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <DateField
                    label="วันเริ่มโครงการ"
                    required
                    value={form.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                  />
                  <DateField
                    label="วันสิ้นสุดโครงการ"
                    required
                    value={form.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-forest-700/10 bg-sand-100/60 px-5 py-3.5">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2.5 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving && <IconSpinner className="h-4 w-4" />}
                  {saving ? "กำลังบันทึก..." : "บันทึกข้อมูลโครงการ"}
                </button>
              </div>
            </form>
          )}
        </StateBlock>
      </Section>

      <Section
        title="ตัวเลขภาพรวม (คำนวณสด)"
        description="ไม่มีคอลัมน์เก็บค่าเหล่านี้ — คำนวณจากระดับชั้นและข้อมูลการปลูกทุกครั้งที่เรียก แก้ข้อมูลในหมวดอื่นแล้วตัวเลขนี้จะเปลี่ยนตาม"
      >
        {overview ? (
          <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewStat label="ระดับชั้นทั้งหมด" value={formatNumber(overview.total_benches)} unit="ระดับ" />
            <OverviewStat label="ปลูกแล้ว" value={formatNumber(overview.planted_benches)} unit="ระดับ" />
            <OverviewStat label="ยังไม่ได้ปลูก" value={formatNumber(overview.not_planted_benches)} unit="ระดับ" />
            <OverviewStat label="พื้นที่รวม" value={formatNumber(overview.total_area_sqm)} unit="ตร.ม." />
            <OverviewStat label="จำนวนต้นไม้รวม" value={formatNumber(overview.total_trees)} unit="ต้น" />
            <OverviewStat label="ความคืบหน้า" value={`${overview.coverage_pct ?? 0}`} unit="%" />
          </div>
        ) : (
          <p className="px-5 py-8 text-center text-sm text-soil-500">กำลังโหลดตัวเลขภาพรวม...</p>
        )}
      </Section>
    </div>
  );
}
