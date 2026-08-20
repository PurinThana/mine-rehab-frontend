import { useCallback, useState } from "react";
import { benchLevelsApi } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useCrud } from "../../hooks/useCrud.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { FormModal, ConfirmDialog } from "../ui/Modal.jsx";
import { NumberField, SelectField } from "../ui/Field.jsx";
import {
  GhostButton,
  IconPlus,
  PrimaryButton,
  Section,
  StateBlock,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "../ui/Section.jsx";
import { formatNumber } from "../utils/date.js";
import PlantingsModal from "./PlantingsModal.jsx";

const STATUS_OPTIONS = [
  { value: "not_planted", label: "ยังไม่ได้ปลูก" },
  { value: "planted", label: "ปลูกแล้ว" },
];

const EMPTY = { elevationM: "", areaSqm: "", sequenceOrder: "", status: "not_planted" };

export default function BenchLevelsSection({ siteId }) {
  const { isAdmin } = useAuth();
  const fetcher = useCallback(() => benchLevelsApi.getBySiteId(siteId), [siteId]);
  const { data, loading, error, reload } = useCollection(fetcher, { enabled: Boolean(siteId) });

  // ระดับชั้นที่กำลังเปิดจัดการข้อมูลการปลูก
  const [plantingBench, setPlantingBench] = useState(null);

  const rows = data || [];

  const crud = useCrud({
    reload,
    emptyForm: EMPTY,
    toForm: (row) => ({
      elevationM: String(row.elevation_m),
      areaSqm: String(row.area_sqm),
      sequenceOrder: String(row.sequence_order),
      status: row.status,
    }),
    toPayload: (form, editing) => {
      const base = {
        elevationM: Number(form.elevationM),
        areaSqm: Number(form.areaSqm),
        sequenceOrder: Number(form.sequenceOrder),
        status: form.status,
      };
      return editing ? base : { ...base, siteId };
    },
    validate: (form) => {
      if (form.elevationM === "" || Number.isNaN(Number(form.elevationM)))
        return "กรุณากรอกระดับความสูงเป็นตัวเลข";
      if (form.areaSqm === "" || Number(form.areaSqm) < 0)
        return "พื้นที่ต้องเป็นตัวเลขไม่ติดลบ";
      if (form.sequenceOrder === "" || Number.isNaN(Number(form.sequenceOrder)))
        return "กรุณากรอกลำดับการแสดงเป็นตัวเลข";
      return "";
    },
    create: (payload) => benchLevelsApi.create(payload),
    update: (id, payload) => benchLevelsApi.update(id, payload),
    remove: (id) => benchLevelsApi.delete(id),
    labels: {
      created: "เพิ่มระดับชั้นแล้ว",
      updated: "แก้ไขระดับชั้นแล้ว",
      deleted: "ลบระดับชั้นแล้ว",
    },
  });

  // ค่า sequence_order ถัดไป เพื่อไม่ต้องให้ผู้ใช้เดาเอง
  const nextSequence = rows.length
    ? Math.max(...rows.map((r) => Number(r.sequence_order))) + 1
    : 1;

  return (
    <>
      <Section
        title="ระดับชั้น (Bench)"
        description="สถานะของแต่ละระดับชั้นคือค่าที่ตัวเลข “ความคืบหน้า” บนหน้าเว็บใช้คำนวณโดยตรง"
        action={
          <PrimaryButton
            onClick={() => {
              crud.openCreate();
              crud.setField("sequenceOrder", String(nextSequence));
            }}
          >
            <IconPlus />
            เพิ่มระดับชั้น
          </PrimaryButton>
        }
      >
        <StateBlock
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="ยังไม่มีระดับชั้นสำหรับไซต์นี้"
          onRetry={reload}
        >
          <TableWrap>
            <thead>
              <tr>
                <Th className="w-16">ลำดับ</Th>
                <Th className="w-28">ระดับ (ม.)</Th>
                <Th className="w-32 text-right">พื้นที่ (ตร.ม.)</Th>
                <Th className="w-40">สถานะ</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <Td className="tick-num text-xs text-soil-400">{row.sequence_order}</Td>
                  <Td className="tick-num font-semibold text-forest-800">+{row.elevation_m}</Td>
                  <Td className="tick-num text-right text-soil-600">{formatNumber(row.area_sqm)}</Td>
                  <Td>
                    <StatusBadge planted={row.status === "planted"} />
                  </Td>
                  <Td className="whitespace-nowrap text-right">
                    <GhostButton tone="forest" onClick={() => setPlantingBench(row)}>
                      การปลูก
                    </GhostButton>
                    <GhostButton tone="forest" onClick={() => crud.openEdit(row)}>
                      แก้ไข
                    </GhostButton>
                    <GhostButton
                      tone="danger"
                      onClick={() => crud.askDelete(row)}
                      disabled={!isAdmin}
                      title={isAdmin ? undefined : "ต้องมีสิทธิ์ผู้ดูแลระบบจึงลบได้"}
                    >
                      ลบ
                    </GhostButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </StateBlock>
      </Section>

      <FormModal
        open={crud.modalOpen}
        onClose={crud.closeModal}
        onSubmit={crud.submit}
        title={crud.isEdit ? `แก้ไขระดับชั้น +${crud.editingRow?.elevation_m}` : "เพิ่มระดับชั้น"}
        error={crud.formError}
        submitting={crud.submitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="ระดับความสูง (เมตร)"
            required
            value={crud.form.elevationM}
            onChange={(e) => crud.setField("elevationM", e.target.value)}
            placeholder="246"
            hint="ห้ามซ้ำกับระดับชั้นอื่นในไซต์เดียวกัน"
          />
          <NumberField
            label="พื้นที่ (ตร.ม.)"
            required
            min="0"
            step="0.01"
            value={crud.form.areaSqm}
            onChange={(e) => crud.setField("areaSqm", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="ลำดับการแสดง"
            required
            value={crud.form.sequenceOrder}
            onChange={(e) => crud.setField("sequenceOrder", e.target.value)}
            hint="เลขน้อยแสดงก่อน"
          />
          <SelectField
            label="สถานะ"
            options={STATUS_OPTIONS}
            value={crud.form.status}
            onChange={(e) => crud.setField("status", e.target.value)}
            hint="การบันทึกข้อมูลการปลูกจะตั้งเป็น “ปลูกแล้ว” ให้อัตโนมัติ"
          />
        </div>
      </FormModal>

      <ConfirmDialog
        open={Boolean(crud.deleteTarget)}
        onClose={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        title="ลบระดับชั้น"
        message="ข้อมูลการปลูกทั้งหมดของระดับชั้นนี้จะถูกลบไปด้วย และตัวเลขความคืบหน้าบนหน้าเว็บจะเปลี่ยนตาม"
        itemLabel={crud.deleteTarget ? `ระดับ +${crud.deleteTarget.elevation_m} ม.` : ""}
        error={crud.deleteError}
        submitting={crud.deleting}
      />

      {plantingBench && (
        <PlantingsModal
          bench={plantingBench}
          onClose={() => setPlantingBench(null)}
          onChanged={reload}
        />
      )}
    </>
  );
}
