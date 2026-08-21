import { useCallback } from "react";
import { activitiesApi, benchLevelsApi } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useCrud } from "../../hooks/useCrud.js";
import { FormModal, ConfirmDialog } from "../ui/Modal.jsx";
import { ComboField, DateField, SelectField, TextField, TextareaField } from "../ui/Field.jsx";
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

const EMPTY = {
  activityType: "",
  title: "",
  description: "",
  activityDate: todayISO(),
  benchLevelId: "",
  images: [],
};

export default function ActivitiesSection({ siteId }) {
  const fetcher = useCallback(() => activitiesApi.getBySiteId(siteId, 100), [siteId]);
  const { data, loading, error, reload } = useCollection(fetcher, { enabled: Boolean(siteId) });

  // ใช้ทำ dropdown "ผูกกับระดับชั้น" — โหลดแยกเพราะ activities ไม่ได้ส่งมาให้
  const benchFetcher = useCallback(() => benchLevelsApi.getBySiteId(siteId), [siteId]);
  const { data: benches } = useCollection(benchFetcher, { enabled: Boolean(siteId) });

  const benchOptions = [
    { value: "", label: "ไม่ผูกกับระดับชั้นใด" },
    ...(benches || []).map((b) => ({
      value: String(b.id),
      label: `ระดับ +${b.elevation_m} ม.`,
    })),
  ];

  const benchLabel = (id) => {
    const bench = (benches || []).find((b) => b.id === id);
    return bench ? `+${bench.elevation_m} ม.` : "-";
  };

  const crud = useCrud({
    reload,
    emptyForm: EMPTY,
    toForm: (row) => ({
      activityType: row.activity_type,
      title: row.title,
      description: row.description || "",
      images: row.images || [],
      activityDate: row.activity_date,
      benchLevelId: row.bench_level_id == null ? "" : String(row.bench_level_id),
    }),
    toPayload: (form) => ({
      siteId,
      activityType: form.activityType.trim(),
      title: form.title.trim(),
      description: form.description.trim() || null,
      images: form.images,
      activityDate: form.activityDate,
      // "" = ไม่ผูกระดับชั้น ต้องส่ง null ไม่ใช่ "" ไม่งั้น FK พัง
      benchLevelId: form.benchLevelId === "" ? null : Number(form.benchLevelId),
    }),
    validate: (form) => {
      if (!form.title.trim()) return "กรุณากรอกชื่อกิจกรรม";
      if (!form.activityType.trim()) return "กรุณาระบุประเภทกิจกรรม";
      if (!form.activityDate) return "กรุณาเลือกวันที่ทำกิจกรรม";
      return "";
    },
    create: (payload) => activitiesApi.create(payload),
    update: (id, payload) => activitiesApi.update(id, payload),
    remove: (id) => activitiesApi.delete(id),
    labels: { created: "เพิ่มกิจกรรมแล้ว", updated: "แก้ไขกิจกรรมแล้ว", deleted: "ลบกิจกรรมแล้ว" },
  });

  const rows = data || [];

  // ประเภทที่เคยใช้จริง เอาไปเป็นรายการแนะนำในฟอร์ม — activity_type เป็นข้อความ
  // อิสระ (VARCHAR) จึงไม่มีรายการค่าที่กำหนดไว้ล่วงหน้าให้ยึด
  const existingTypes = [...new Set(rows.map((r) => r.activity_type).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "th"),
  );

  return (
    <>
      <Section
        title="กิจกรรมภาคสนาม"
        description="แสดงในหมวด “กิจกรรมล่าสุด” บนหน้าเว็บ เรียงตามวันที่ใหม่สุดก่อน"
        action={
          <PrimaryButton onClick={crud.openCreate}>
            <IconPlus />
            เพิ่มกิจกรรม
          </PrimaryButton>
        }
      >
        <StateBlock
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="ยังไม่มีกิจกรรมสำหรับไซต์นี้"
          onRetry={reload}
        >
          <TableWrap>
            <thead>
              <tr>
                <Th className="w-32">วันที่</Th>
                <Th>กิจกรรม</Th>
                <Th className="w-36">ประเภท</Th>
                <Th className="w-28">ระดับชั้น</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <Td className="tick-num whitespace-nowrap text-xs text-soil-500">
                    {formatThaiDate(row.activity_date)}
                  </Td>
                  <Td>
                    <p className="font-medium text-forest-800">{row.title}</p>
                    {row.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-soil-500">
                        {/* description เก็บเป็น HTML — ตัด tag ออกก่อนโชว์ในตาราง */}
                        {stripHtml(row.description, 160)}
                      </p>
                    )}
                    {row.images?.length > 0 && (
                      <p className="mt-1 text-[11px] text-soil-400">รูป {row.images.length} รูป</p>
                    )}
                  </Td>
                  <Td className="text-xs text-soil-600">
                    {row.activity_type}
                  </Td>
                  <Td className="tick-num text-xs text-soil-600">{benchLabel(row.bench_level_id)}</Td>
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
        title={crud.isEdit ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}
        error={crud.formError}
        submitting={crud.submitting}
        maxWidth="max-w-xl"
      >
        <TextField
          label="ชื่อกิจกรรม"
          required
          value={crud.form.title}
          onChange={(e) => crud.setField("title", e.target.value)}
          placeholder="เช่น ปลูกเฟื่องฟ้าระดับชั้น +246"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ComboField
            label="ประเภทกิจกรรม"
            required
            options={existingTypes}
            value={crud.form.activityType}
            onChange={(e) => crud.setField("activityType", e.target.value)}
            placeholder="เช่น ปลูกต้นไม้"
            hint="พิมพ์ใหม่ได้ หรือเลือกจากประเภทที่เคยใช้"
          />
          <DateField
            label="วันที่ทำกิจกรรม"
            required
            value={crud.form.activityDate}
            onChange={(e) => crud.setField("activityDate", e.target.value)}
          />
        </div>
        <SelectField
          label="ผูกกับระดับชั้น"
          options={benchOptions}
          value={crud.form.benchLevelId}
          onChange={(e) => crud.setField("benchLevelId", e.target.value)}
          hint="กิจกรรมภาพรวม เช่น การสำรวจ ไม่ต้องผูกกับระดับชั้นใด"
        />
        <RichTextField
          label="รายละเอียด"
          value={crud.form.description}
          onChange={(html) => crud.setField("description", html)}
          hint="จัดตัวหนา สี และตำแหน่งข้อความได้ · เว้นว่างไว้ได้"
        />
        <MultiImageField
          label="รูปภาพกิจกรรม"
          value={crud.form.images}
          onChange={(images) => crud.setField("images", images)}
          hint="ใส่ได้หลายรูป เลื่อนดูเป็น carousel บนหน้าเว็บ · รูปแรกใช้เป็นรูปปกบนการ์ด · ถ้าไม่ใส่จะใช้ไอคอนตามประเภทกิจกรรม"
        />
      </FormModal>

      <ConfirmDialog
        open={Boolean(crud.deleteTarget)}
        onClose={crud.cancelDelete}
        onConfirm={crud.confirmDelete}
        title="ลบกิจกรรม"
        itemLabel={crud.deleteTarget?.title}
        error={crud.deleteError}
        submitting={crud.deleting}
      />
    </>
  );
}
