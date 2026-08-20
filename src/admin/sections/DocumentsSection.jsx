import { useCallback } from "react";
import { documentsApi } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useCrud } from "../../hooks/useCrud.js";
import { FormModal, ConfirmDialog } from "../ui/Modal.jsx";
import { DateField, NumberField, TextField } from "../ui/Field.jsx";
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
import { todayISO, formatThaiDate, formatNumber } from "../../utils/date.js";
import FileUploadField from "../ui/FileUploadField.jsx";

const EMPTY = {
  title: "",
  fileUrl: "",
  fileSizeKb: "",
  category: "",
  uploadedDate: todayISO(),
};

export default function DocumentsSection({ siteId }) {
  const fetcher = useCallback(() => documentsApi.getBySiteId(siteId), [siteId]);
  const { data, loading, error, reload } = useCollection(fetcher, { enabled: Boolean(siteId) });

  const crud = useCrud({
    reload,
    emptyForm: EMPTY,
    toForm: (row) => ({
      title: row.title,
      fileUrl: row.file_url,
      fileSizeKb: String(row.file_size_kb),
      category: row.category,
      uploadedDate: row.uploaded_date,
    }),
    toPayload: (form) => ({
      siteId,
      title: form.title.trim(),
      fileUrl: form.fileUrl.trim(),
      fileSizeKb: Number(form.fileSizeKb),
      category: form.category.trim(),
      uploadedDate: form.uploadedDate,
    }),
    validate: (form) => {
      if (!form.title.trim()) return "กรุณากรอกชื่อเอกสาร";
      if (!form.fileUrl.trim()) return "กรุณาอัปโหลดไฟล์ หรือวาง URL ของไฟล์";
      if (!form.category.trim()) return "กรุณากรอกหมวดเอกสาร";
      if (form.fileSizeKb === "" || Number(form.fileSizeKb) < 0)
        return "ขนาดไฟล์ต้องเป็นตัวเลขไม่ติดลบ";
      if (!form.uploadedDate) return "กรุณาเลือกวันที่อัปโหลด";
      return "";
    },
    create: (payload) => documentsApi.create(payload),
    update: (id, payload) => documentsApi.update(id, payload),
    remove: (id) => documentsApi.delete(id),
    labels: { created: "เพิ่มเอกสารแล้ว", updated: "แก้ไขเอกสารแล้ว", deleted: "ลบเอกสารแล้ว" },
  });

  const rows = data || [];

  return (
    <>
      <Section
        title="เอกสารดาวน์โหลด"
        description="อัปโหลด PDF ได้จากในฟอร์มโดยตรง ไฟล์จะถูกเก็บไว้ที่ Cloudinary แล้วบันทึกลิงก์ลงฐานข้อมูล"
        action={
          <PrimaryButton onClick={crud.openCreate}>
            <IconPlus />
            เพิ่มเอกสาร
          </PrimaryButton>
        }
      >
        <StateBlock
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="ยังไม่มีเอกสารสำหรับไซต์นี้"
          onRetry={reload}
        >
          <TableWrap>
            <thead>
              <tr>
                <Th>ชื่อเอกสาร</Th>
                <Th className="w-32">หมวด</Th>
                <Th className="w-24 text-right">ขนาด (KB)</Th>
                <Th className="w-32">วันที่อัปโหลด</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <Td>
                    <p className="font-medium text-forest-800">{row.title}</p>
                    <p className="mt-0.5 break-all font-mono text-[11px] text-soil-400">
                      {row.file_url}
                    </p>
                  </Td>
                  <Td className="text-xs text-soil-600">{row.category}</Td>
                  <Td className="tick-num text-right text-xs text-soil-600">
                    {formatNumber(row.file_size_kb)}
                  </Td>
                  <Td className="tick-num whitespace-nowrap text-xs text-soil-500">
                    {formatThaiDate(row.uploaded_date)}
                  </Td>
                  <Td className="whitespace-nowrap text-right">
                    <GhostButton tone="forest" onClick={() => crud.openEdit(row)}>
                      แก้ไข
                    </GhostButton>
                    <GhostButton tone="danger" onClick={() => crud.askDelete(row)}>
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
        title={crud.isEdit ? "แก้ไขเอกสาร" : "เพิ่มเอกสาร"}
        error={crud.formError}
        submitting={crud.submitting}
        maxWidth="max-w-xl"
      >
        <TextField
          label="ชื่อเอกสาร"
          required
          value={crud.form.title}
          onChange={(e) => crud.setField("title", e.target.value)}
          placeholder="เช่น รายงานความก้าวหน้าไตรมาส 2"
        />
        <FileUploadField
          label="ไฟล์เอกสาร (PDF)"
          accept="application/pdf"
          previewKind="document"
          required
          value={crud.form.fileUrl}
          onChange={(url) => crud.setField("fileUrl", url)}
          // อัปโหลดแล้วรู้ขนาดไฟล์จริง ไม่ต้องให้ผู้ใช้กรอกเองแล้วเสี่ยงพิมพ์ผิด
          onUploaded={(result) => crud.setField("fileSizeKb", String(result.sizeKb))}
          hint="อัปโหลดแล้วระบบจะเติมขนาดไฟล์ให้อัตโนมัติ"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="หมวดเอกสาร"
            required
            value={crud.form.category}
            onChange={(e) => crud.setField("category", e.target.value)}
            placeholder="เช่น รายงาน, แผนงาน"
          />
          <NumberField
            label="ขนาดไฟล์ (KB)"
            required
            min="0"
            hint="เติมอัตโนมัติเมื่ออัปโหลด"
            value={crud.form.fileSizeKb}
            onChange={(e) => crud.setField("fileSizeKb", e.target.value)}
          />
        </div>
        <DateField
          label="วันที่อัปโหลด"
          required
          value={crud.form.uploadedDate}
          onChange={(e) => crud.setField("uploadedDate", e.target.value)}
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(crud.deleteTarget)}
        onClose={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        title="ลบเอกสาร"
        message="ลบเฉพาะรายการในหน้าเว็บ ไฟล์จริงบน storage ยังอยู่ ต้องไปลบแยกเอง"
        itemLabel={crud.deleteTarget?.title}
        error={crud.deleteError}
        submitting={crud.deleting}
      />
    </>
  );
}
