import { useCallback } from "react";
import { speciesApi } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useCrud } from "../../hooks/useCrud.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { FormModal, ConfirmDialog } from "../ui/Modal.jsx";
import { ColorField, TextField } from "../ui/Field.jsx";
import {
  GhostButton,
  IconPlus,
  PrimaryButton,
  Section,
  StateBlock,
  TableWrap,
  Td,
  Th,
} from "../ui/Section.jsx";

const EMPTY = { nameTh: "", colorHex: "#3F8F5F" };

export default function SpeciesSection() {
  const { isAdmin } = useAuth();
  const fetcher = useCallback(() => speciesApi.getAll(), []);
  const { data, loading, error, reload } = useCollection(fetcher);

  const crud = useCrud({
    reload,
    emptyForm: EMPTY,
    toForm: (row) => ({ nameTh: row.name_th, colorHex: row.color_hex }),
    toPayload: (form) => ({ nameTh: form.nameTh.trim(), colorHex: form.colorHex.toUpperCase() }),
    validate: (form) => {
      if (!form.nameTh.trim()) return "กรุณากรอกชื่อพันธุ์พืช";
      if (!/^#[0-9A-Fa-f]{6}$/.test(form.colorHex)) return "รหัสสีต้องอยู่ในรูปแบบ #RRGGBB";
      return "";
    },
    create: (payload) => speciesApi.create(payload),
    update: (id, payload) => speciesApi.update(id, payload),
    remove: (id) => speciesApi.delete(id),
    labels: {
      created: "เพิ่มพันธุ์พืชแล้ว",
      updated: "แก้ไขพันธุ์พืชแล้ว",
      deleted: "ลบพันธุ์พืชแล้ว",
    },
  });

  const rows = data || [];

  return (
    <>
      <Section
        title="พันธุ์พืชคลุมดิน"
        description="ใช้ร่วมกันได้ทุกไซต์และทุกระดับชั้น สีที่ตั้งไว้คือสีที่แสดงบนหน้าเว็บจริง"
        action={
          <PrimaryButton onClick={crud.openCreate}>
            <IconPlus />
            เพิ่มพันธุ์พืช
          </PrimaryButton>
        }
      >
        <StateBlock
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="ยังไม่มีพันธุ์พืช — กด “เพิ่มพันธุ์พืช” เพื่อเริ่มต้น"
          onRetry={reload}
        >
          <TableWrap>
            <thead>
              <tr>
                <Th>ชื่อพันธุ์</Th>
                <Th>สี</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <Td className="font-medium text-forest-800">{row.name_th}</Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-forest-700/15"
                        style={{ backgroundColor: row.color_hex }}
                      />
                      <span className="font-mono text-xs uppercase text-soil-500">{row.color_hex}</span>
                    </span>
                  </Td>
                  <Td className="text-right">
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
        title={crud.isEdit ? "แก้ไขพันธุ์พืช" : "เพิ่มพันธุ์พืช"}
        error={crud.formError}
        submitting={crud.submitting}
      >
        <TextField
          label="ชื่อพันธุ์ (ภาษาไทย)"
          required
          value={crud.form.nameTh}
          onChange={(e) => crud.setField("nameTh", e.target.value)}
          placeholder="เช่น เฟื่องฟ้าสีชมพู"
        />
        <ColorField
          label="สีที่ใช้แสดงบนหน้าเว็บ"
          required
          value={crud.form.colorHex}
          onChange={(e) => crud.setField("colorHex", e.target.value)}
          hint="เลือกจากจานสีหรือพิมพ์รหัส #RRGGBB"
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(crud.deleteTarget)}
        onClose={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        title="ลบพันธุ์พืช"
        message="ถ้าพันธุ์นี้ถูกใช้ในข้อมูลการปลูกอยู่ ระบบจะไม่ยอมให้ลบ — ต้องลบข้อมูลการปลูกที่อ้างถึงออกก่อน"
        itemLabel={crud.deleteTarget?.name_th}
        error={crud.deleteError}
        submitting={crud.deleting}
      />
    </>
  );
}
