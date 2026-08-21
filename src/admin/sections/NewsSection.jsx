import { useCallback } from "react";
import { newsApi } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useCrud } from "../../hooks/useCrud.js";
import { FormModal, ConfirmDialog } from "../ui/Modal.jsx";
import { DateField, TextField, TextareaField } from "../ui/Field.jsx";
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
import { todayISO, formatThaiDate } from "../../utils/date.js";
import MultiImageField from "../ui/MultiImageField.jsx";
import { stripHtml } from "../../utils/richTextPreview.js";
import RichTextField from "../ui/RichTextField.jsx";

const EMPTY = { title: "", body: "", images: [], publishedDate: todayISO() };

export default function NewsSection({ siteId }) {
  const fetcher = useCallback(() => newsApi.getBySiteId(siteId, 100), [siteId]);
  const { data, loading, error, reload } = useCollection(fetcher, { enabled: Boolean(siteId) });

  const crud = useCrud({
    reload,
    emptyForm: EMPTY,
    toForm: (row) => ({
      title: row.title,
      body: row.body || "",
      images: row.images || [],
      publishedDate: row.published_date,
    }),
    toPayload: (form) => ({
      siteId,
      title: form.title.trim(),
      body: form.body || null,
      images: form.images,
      publishedDate: form.publishedDate,
    }),
    validate: (form) => {
      if (!form.title.trim()) return "กรุณากรอกหัวข้อข่าว";
      if (!form.publishedDate) return "กรุณาเลือกวันที่เผยแพร่";
      return "";
    },
    create: (payload) => newsApi.create(payload),
    update: (id, payload) => newsApi.update(id, payload),
    remove: (id) => newsApi.delete(id),
    labels: { created: "เพิ่มข่าวแล้ว", updated: "แก้ไขข่าวแล้ว", deleted: "ลบข่าวแล้ว" },
  });

  const rows = data || [];

  return (
    <>
      <Section
        title="ข่าวสารและประกาศ"
        description="แสดงในหมวด “ข่าวสาร” บนหน้าเว็บ เรียงตามวันที่เผยแพร่ใหม่สุดก่อน"
        action={
          <PrimaryButton onClick={crud.openCreate}>
            <IconPlus />
            เพิ่มข่าว
          </PrimaryButton>
        }
      >
        <StateBlock
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="ยังไม่มีข่าวสำหรับไซต์นี้"
          onRetry={reload}
        >
          <TableWrap>
            <thead>
              <tr>
                <Th className="w-32">วันที่เผยแพร่</Th>
                <Th>หัวข้อ</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <Td className="whitespace-nowrap tick-num text-xs text-soil-500">
                    {formatThaiDate(row.published_date)}
                  </Td>
                  <Td>
                    <p className="font-medium text-forest-800">{row.title}</p>
                    {row.body && (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-soil-500">
                        {/* body เก็บเป็น HTML — ตัด tag ออกก่อนโชว์ในตาราง */}
                        {stripHtml(row.body, 160)}
                      </p>
                    )}
                    {row.images?.length > 0 && (
                      <p className="mt-1 text-[11px] text-soil-400">รูป {row.images.length} รูป</p>
                    )}
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
        title={crud.isEdit ? "แก้ไขข่าว" : "เพิ่มข่าว"}
        error={crud.formError}
        submitting={crud.submitting}
        maxWidth="max-w-xl"
      >
        <TextField
          label="หัวข้อข่าว"
          required
          value={crud.form.title}
          onChange={(e) => crud.setField("title", e.target.value)}
        />
        <DateField
          label="วันที่เผยแพร่"
          required
          value={crud.form.publishedDate}
          onChange={(e) => crud.setField("publishedDate", e.target.value)}
        />
        <RichTextField
          label="เนื้อหา"
          minHeight="14rem"
          value={crud.form.body}
          onChange={(html) => crud.setField("body", html)}
          hint="จัดตัวหนา สี และตำแหน่งข้อความได้ · เว้นว่างไว้ได้ถ้าต้องการแสดงแค่หัวข้อ"
        />
        <MultiImageField
          label="รูปประกอบข่าว"
          value={crud.form.images}
          onChange={(images) => crud.setField("images", images)}
          hint="ใส่ได้หลายรูป เลื่อนดูเป็น carousel ในหน้าข่าว · รูปแรกใช้เป็นรูปย่อในรายการ"
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(crud.deleteTarget)}
        onClose={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        title="ลบข่าว"
        itemLabel={crud.deleteTarget?.title}
        error={crud.deleteError}
        submitting={crud.deleting}
      />
    </>
  );
}
