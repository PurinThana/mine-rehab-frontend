import { useCallback, useState } from "react";
import { benchLevelsApi, plantingsApi, speciesApi, getErrorMessage } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { Modal } from "../ui/Modal.jsx";
import { DateField, NumberField, SelectField } from "../ui/Field.jsx";
import { useToast } from "../ui/Toast.jsx";
import {
  GhostButton,
  IconPlus,
  PrimaryButton,
  StateBlock,
  TableWrap,
  Td,
  Th,
} from "../ui/Section.jsx";
import { IconAlert, IconSpinner } from "../../components/Icons.jsx";
import { formatNumber, formatThaiDate, todayISO } from "../utils/date.js";

/**
 * จัดการข้อมูลการปลูกของ "หนึ่งระดับชั้น"
 *
 * backend ใช้ upsert ตามคู่ (ระดับชั้น, พันธุ์พืช) — เพิ่มพันธุ์ที่มีอยู่แล้วซ้ำ
 * จะกลายเป็นการแก้จำนวนต้นของแถวเดิม จึงล็อกช่องพันธุ์ไว้ตอนกดแก้ไข
 * เพื่อไม่ให้ผู้ใช้เข้าใจผิดว่า "ย้ายพันธุ์" ได้ (จริงๆ จะได้แถวใหม่เพิ่ม)
 *
 * สลับระหว่างมุมมองรายการกับฟอร์มในกล่องเดียว ไม่ซ้อน modal
 */
export default function PlantingsModal({ bench, onClose, onChanged }) {
  const toast = useToast();

  const detailFetcher = useCallback(() => benchLevelsApi.getById(bench.id), [bench.id]);
  const { data: detail, loading, error, reload } = useCollection(detailFetcher);

  const speciesFetcher = useCallback(() => speciesApi.getAll(), []);
  const { data: species } = useCollection(speciesFetcher);

  const [view, setView] = useState("list"); // 'list' | 'form'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ speciesId: "", treeCount: "", plantedDate: todayISO() });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [rowError, setRowError] = useState("");

  const plantings = detail?.plantings || [];
  const speciesList = species || [];

  const usedSpeciesIds = new Set(plantings.map((p) => p.species_id));
  const availableSpecies = speciesList.filter((s) => !usedSpeciesIds.has(s.id));

  const totalTrees = plantings.reduce((sum, p) => sum + Number(p.tree_count), 0);

  function openAdd() {
    setEditing(null);
    setForm({
      speciesId: availableSpecies[0] ? String(availableSpecies[0].id) : "",
      treeCount: "",
      plantedDate: todayISO(),
    });
    setFormError("");
    setView("form");
  }

  function openEdit(planting) {
    setEditing(planting);
    setForm({
      speciesId: String(planting.species_id),
      treeCount: String(planting.tree_count),
      plantedDate: planting.planted_date || todayISO(),
    });
    setFormError("");
    setView("form");
  }

  async function submit(e) {
    e.preventDefault();
    if (submitting) return;

    if (!form.speciesId) {
      setFormError("กรุณาเลือกพันธุ์พืช");
      return;
    }
    if (form.treeCount === "" || Number(form.treeCount) < 0) {
      setFormError("จำนวนต้นต้องเป็นตัวเลขไม่ติดลบ");
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      await plantingsApi.createOrUpdate({
        benchLevelId: bench.id,
        speciesId: Number(form.speciesId),
        treeCount: Number(form.treeCount),
        plantedDate: form.plantedDate || null,
      });
      toast.success(editing ? "แก้ไขข้อมูลการปลูกแล้ว" : "บันทึกข้อมูลการปลูกแล้ว");
      setView("list");
      await reload();
      // ตารางระดับชั้นด้านนอกต้องรีเฟรชด้วย เพราะสถานะอาจเปลี่ยนเป็น "ปลูกแล้ว"
      await onChanged();
    } catch (err) {
      setFormError(getErrorMessage(err, "บันทึกไม่สำเร็จ"));
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setRowError("");
    try {
      await plantingsApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      toast.success("ลบข้อมูลการปลูกแล้ว");
      await reload();
      // ลบรายการสุดท้ายออก backend จะคืนสถานะเป็น "ยังไม่ได้ปลูก"
      await onChanged();
    } catch (err) {
      setRowError(getErrorMessage(err, "ลบไม่สำเร็จ"));
    } finally {
      setDeleting(false);
    }
  }

  const speciesOptions = editing
    ? [{ value: String(editing.species_id), label: editing.name_th }]
    : availableSpecies.map((s) => ({ value: String(s.id), label: s.name_th }));

  return (
    <Modal
      open
      onClose={onClose}
      title={`ข้อมูลการปลูก — ระดับ +${bench.elevation_m} ม.`}
      subtitle={
        view === "list"
          ? `รวม ${formatNumber(totalTrees)} ต้น จาก ${plantings.length} พันธุ์`
          : editing
            ? "แก้ไขจำนวนต้นของพันธุ์นี้"
            : "เพิ่มพันธุ์พืชที่ปลูกในระดับชั้นนี้"
      }
      maxWidth="max-w-2xl"
    >
      {view === "list" ? (
        <>
          <StateBlock
            loading={loading}
            error={error}
            empty={plantings.length === 0}
            emptyText="ยังไม่มีข้อมูลการปลูกในระดับชั้นนี้"
            onRetry={reload}
          >
            <TableWrap>
              <thead>
                <tr>
                  <Th>พันธุ์พืช</Th>
                  <Th className="w-28 text-right">จำนวนต้น</Th>
                  <Th className="w-32">วันที่ปลูก</Th>
                  <Th className="text-right">จัดการ</Th>
                </tr>
              </thead>
              <tbody>
                {plantings.map((p) => (
                  <tr key={p.id}>
                    <Td>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 shrink-0 rounded-full border border-forest-700/15"
                          style={{ backgroundColor: p.color_hex }}
                        />
                        <span className="font-medium text-forest-800">{p.name_th}</span>
                      </span>
                    </Td>
                    <Td className="tick-num text-right text-soil-600">
                      {formatNumber(p.tree_count)}
                    </Td>
                    <Td className="tick-num text-xs text-soil-500">
                      {formatThaiDate(p.planted_date)}
                    </Td>
                    <Td className="whitespace-nowrap text-right">
                      <GhostButton tone="forest" onClick={() => openEdit(p)}>
                        แก้ไข
                      </GhostButton>
                      <GhostButton tone="danger" onClick={() => setDeleteTarget(p)}>
                        ลบ
                      </GhostButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </StateBlock>

          {rowError && (
            <p role="alert" className="mx-5 mt-4 flex items-start gap-2 text-sm text-clay-700">
              <IconAlert className="mt-0.5 h-4 w-4 shrink-0" />
              {rowError}
            </p>
          )}

          {deleteTarget && (
            <div className="mx-5 mt-4 rounded-xl border border-clay-500/30 bg-clay-400/10 px-4 py-3">
              <p className="text-sm text-clay-700">
                ลบข้อมูลการปลูก <span className="font-semibold">{deleteTarget.name_th}</span> (
                {formatNumber(deleteTarget.tree_count)} ต้น) ออกจากระดับชั้นนี้?
              </p>
              <p className="mt-1 text-xs text-clay-700/80">
                ถ้าเป็นรายการสุดท้าย ระดับชั้นนี้จะกลับเป็น “ยังไม่ได้ปลูก”
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex items-center gap-1.5 rounded-lg bg-clay-600 px-3 py-1.5 text-xs font-medium text-sand-50 transition-colors hover:bg-clay-700 disabled:opacity-70"
                >
                  {deleting && <IconSpinner className="h-3.5 w-3.5" />}
                  {deleting ? "กำลังลบ..." : "ยืนยันลบ"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-soil-600 transition-colors hover:bg-forest-700/5 disabled:opacity-60"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2.5 border-t border-forest-700/10 bg-sand-100/60 px-5 py-3.5">
            <PrimaryButton
              onClick={openAdd}
              disabled={availableSpecies.length === 0}
              title={
                availableSpecies.length === 0
                  ? "ทุกพันธุ์พืชที่มีถูกบันทึกในระดับชั้นนี้แล้ว — แก้ไขจำนวนที่แถวเดิม หรือเพิ่มพันธุ์ใหม่ในหมวดพันธุ์พืช"
                  : undefined
              }
            >
              <IconPlus />
              เพิ่มการปลูก
            </PrimaryButton>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-soil-600 transition-colors hover:bg-forest-700/5"
            >
              ปิด
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={submit} noValidate>
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
            <SelectField
              label="พันธุ์พืช"
              required
              disabled={Boolean(editing)}
              options={speciesOptions}
              value={form.speciesId}
              onChange={(e) => setForm((f) => ({ ...f, speciesId: e.target.value }))}
              hint={
                editing
                  ? "เปลี่ยนพันธุ์ไม่ได้ — ถ้าต้องการเปลี่ยน ให้ลบรายการนี้แล้วเพิ่มพันธุ์ใหม่"
                  : "แสดงเฉพาะพันธุ์ที่ยังไม่ถูกบันทึกในระดับชั้นนี้"
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="จำนวนต้น"
                required
                min="0"
                value={form.treeCount}
                onChange={(e) => setForm((f) => ({ ...f, treeCount: e.target.value }))}
              />
              <DateField
                label="วันที่ปลูก"
                value={form.plantedDate}
                onChange={(e) => setForm((f) => ({ ...f, plantedDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-forest-700/10 bg-sand-100/60 px-5 py-3.5">
            <button
              type="button"
              onClick={() => setView("list")}
              disabled={submitting}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-soil-600 transition-colors hover:bg-forest-700/5 disabled:opacity-60"
            >
              ย้อนกลับ
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-forest-700 px-5 py-2.5 text-sm font-medium text-sand-50 shadow-card transition-colors hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting && <IconSpinner className="h-4 w-4" />}
              {submitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
