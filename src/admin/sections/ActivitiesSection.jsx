import { useCallback } from "react";
import { activitiesApi, benchLevelsApi } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useCrud } from "../../hooks/useCrud.js";
import { FormModal, ConfirmDialog } from "../ui/Modal.jsx";
import { DateField, SelectField, TextField, TextareaField } from "../ui/Field.jsx";
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
import FileUploadField from "../ui/FileUploadField.jsx";

// ตรงกับค่าที่ seed.sql ใช้ และกับไอคอนที่ RecentActivities.jsx จับคู่ไว้
const ACTIVITY_TYPES = [
  { value: "sow", label: "เพาะกล้า (sow)" },
  { value: "prepare", label: "เตรียมดิน / ปรับพื้นที่ (prepare)" },
  { value: "plant", label: "ปลูก (plant)" },
  { value: "water", label: "ให้น้ำ / บำรุงรักษา (water)" },
  { value: "survey", label: "สำรวจ (survey)" },
];

const TYPE_LABEL = Object.fromEntries(ACTIVITY_TYPES.map((t) => [t.value, t.label.split(" (")[0]]));

const EMPTY = {
  activityType: "plant",
  title: "",
  description: "",
  activityDate: todayISO(),
  benchLevelId: "",
  imageUrl: "",
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
      imageUrl: row.image_url || "",
      activityDate: row.activity_date,
      benchLevelId: row.bench_level_id == null ? "" : String(row.bench_level_id),
    }),
    toPayload: (form) => ({
      siteId,
      activityType: form.activityType,
      title: form.title.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      activityDate: form.activityDate,
      // "" = ไม่ผูกระดับชั้น ต้องส่ง null ไม่ใช่ "" ไม่งั้น FK พัง
      benchLevelId: form.benchLevelId === "" ? null : Number(form.benchLevelId),
    }),
    validate: (form) => {
      if (!form.title.trim()) return "กรุณากรอกชื่อกิจกรรม";
      if (!form.activityType) return "กรุณาเลือกประเภทกิจกรรม";
      if (!form.activityDate) return "กรุณาเลือกวันที่ทำกิจกรรม";
      return "";
    },
    create: (payload) => activitiesApi.create(payload),
    update: (id, payload) => activitiesApi.update(id, payload),
    remove: (id) => activitiesApi.delete(id),
    labels: { created: "เพิ่มกิจกรรมแล้ว", updated: "แก้ไขกิจกรรมแล้ว", deleted: "ลบกิจกรรมแล้ว" },
  });

  const rows = data || [];

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
                        {row.description}
                      </p>
                    )}
                  </Td>
                  <Td className="text-xs text-soil-600">
                    {TYPE_LABEL[row.activity_type] || row.activity_type}
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
          <SelectField
            label="ประเภทกิจกรรม"
            required
            options={ACTIVITY_TYPES}
            value={crud.form.activityType}
            onChange={(e) => crud.setField("activityType", e.target.value)}
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
        <TextareaField
          label="รายละเอียด"
          value={crud.form.description}
          onChange={(e) => crud.setField("description", e.target.value)}
          hint="เว้นว่างไว้ได้"
        />
        <FileUploadField
          label="รูปภาพกิจกรรม"
          accept="image/*"
          value={crud.form.imageUrl}
          onChange={(url) => crud.setField("imageUrl", url)}
          hint="ถ้าไม่ใส่ การ์ดบนหน้าเว็บจะใช้ไอคอนตามประเภทกิจกรรมแทน"
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
