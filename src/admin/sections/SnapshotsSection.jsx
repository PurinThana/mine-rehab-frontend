import { useCallback, useState } from "react";
import { snapshotsApi, getErrorMessage } from "../../api/index.js";
import { useCollection } from "../../hooks/useCollection.js";
import { useToast } from "../ui/Toast.jsx";
import { FormModal } from "../ui/Modal.jsx";
import { DateField } from "../ui/Field.jsx";
import {
  IconPlus,
  PrimaryButton,
  Section,
  StateBlock,
  TableWrap,
  Td,
  Th,
} from "../ui/Section.jsx";
import { formatNumber, formatThaiDate, todayISO } from "../utils/date.js";

/**
 * Snapshot คือตารางเดียวที่เก็บ "ประวัติ" — ตารางอื่นเก็บแค่สถานะปัจจุบัน
 * ค่าที่บันทึกมาจากสถานะจริงของไซต์ตอนกดบันทึก ไม่ให้กรอกตัวเลขเอง
 * เพื่อไม่ให้ประวัติขัดกับข้อมูลจริง
 */
export default function SnapshotsSection({ siteId }) {
  const toast = useToast();
  const fetcher = useCallback(() => snapshotsApi.getBySiteId(siteId, 60), [siteId]);
  const { data, loading, error, reload } = useCollection(fetcher, { enabled: Boolean(siteId) });

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // backend คืนแบบเก่า -> ใหม่ (พร้อมป้อนกราฟ) แต่ตารางอ่านง่ายกว่าถ้าใหม่อยู่บน
  const rows = [...(data || [])].reverse();

  async function submit() {
    if (!date) {
      setFormError("กรุณาเลือกวันที่ของ snapshot");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await snapshotsApi.create(siteId, date);
      setOpen(false);
      toast.success("บันทึก snapshot แล้ว");
      await reload();
    } catch (err) {
      setFormError(getErrorMessage(err, "บันทึก snapshot ไม่สำเร็จ"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Section
        title="ประวัติความคืบหน้า (Snapshot)"
        description="บันทึกสถานะปัจจุบันไว้เป็นประวัติ ใช้ย้อนดูความคืบหน้าเดือนก่อนๆ และป้อนกราฟ"
        action={
          <PrimaryButton
            onClick={() => {
              setDate(todayISO());
              setFormError("");
              setOpen(true);
            }}
          >
            <IconPlus />
            บันทึก snapshot
          </PrimaryButton>
        }
      >
        <StateBlock
          loading={loading}
          error={error}
          empty={rows.length === 0}
          emptyText="ยังไม่มีประวัติ — กด “บันทึก snapshot” เพื่อเก็บสถานะวันนี้ไว้"
          onRetry={reload}
        >
          <TableWrap>
            <thead>
              <tr>
                <Th className="w-32">วันที่</Th>
                <Th className="text-right">ระดับชั้นทั้งหมด</Th>
                <Th className="text-right">ปลูกแล้ว</Th>
                <Th className="text-right">จำนวนต้นไม้</Th>
                <Th className="text-right">ความคืบหน้า</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.snapshot_date}>
                  <Td className="tick-num whitespace-nowrap font-medium text-forest-800">
                    {formatThaiDate(row.snapshot_date)}
                  </Td>
                  <Td className="tick-num text-right text-soil-600">
                    {formatNumber(row.total_benches)}
                  </Td>
                  <Td className="tick-num text-right text-soil-600">
                    {formatNumber(row.planted_benches)}
                  </Td>
                  <Td className="tick-num text-right text-soil-600">
                    {formatNumber(row.total_trees)}
                  </Td>
                  <Td className="tick-num text-right font-semibold text-forest-700">
                    {Number(row.coverage_pct)}%
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </StateBlock>
      </Section>

      <FormModal
        open={open}
        onClose={() => !submitting && setOpen(false)}
        onSubmit={submit}
        title="บันทึก snapshot"
        subtitle="ระบบจะอ่านตัวเลขจากสถานะจริงของไซต์ตอนนี้ให้เอง"
        error={formError}
        submitting={submitting}
        submitLabel="บันทึก snapshot"
      >
        <DateField
          label="วันที่ของ snapshot"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          hint="ถ้ามี snapshot ของวันนี้อยู่แล้ว ระบบจะเขียนทับด้วยตัวเลขปัจจุบัน"
        />
      </FormModal>
    </>
  );
}
