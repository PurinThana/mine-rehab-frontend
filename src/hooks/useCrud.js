import { useCallback, useState } from "react";
import { getErrorMessage } from "../api/index.js";
import { useToast } from "../admin/ui/Toast.jsx";

/**
 * รวมกลไก เพิ่ม / แก้ไข / ลบ ที่ทุกหมวดในหน้าแอดมินใช้เหมือนกัน:
 * เปิด-ปิดฟอร์ม, ค่าในฟอร์ม, ตรวจค่าก่อนส่ง, สถานะกำลังบันทึก, error ในฟอร์ม,
 * กล่องยืนยันลบ, และ reload ตารางหลังสำเร็จ
 *
 * เจตนา: section แต่ละไฟล์เหลือแค่ "หน้าตา + ฟิลด์อะไรบ้าง" ไม่ต้องเขียน
 * state machine เดิมซ้ำ 6 รอบ (และไม่ให้ 6 รอบนั้นเพี้ยนกันทีหลัง)
 */
export function useCrud({
  reload,
  emptyForm,
  toForm = () => ({}),
  toPayload = (form) => form,
  validate = () => "",
  create,
  update,
  remove,
  labels = {},
}) {
  const toast = useToast();

  const [editingRow, setEditingRow] = useState(null); // null = โหมดเพิ่มใหม่
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const openCreate = useCallback(() => {
    setEditingRow(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }, [emptyForm]);

  const openEdit = useCallback(
    (row) => {
      setEditingRow(row);
      setForm({ ...emptyForm, ...toForm(row) });
      setFormError("");
      setModalOpen(true);
    },
    [emptyForm, toForm],
  );

  const closeModal = useCallback(() => {
    if (submitting) return; // ไม่ให้ปิดกลางคันตอนกำลังบันทึก
    setModalOpen(false);
  }, [submitting]);

  const submit = useCallback(async () => {
    const validationError = validate(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);
    setFormError("");
    try {
      const payload = toPayload(form, editingRow);
      if (editingRow) await update(editingRow.id, payload);
      else await create(payload);

      setModalOpen(false);
      toast.success(editingRow ? labels.updated || "บันทึกการแก้ไขแล้ว" : labels.created || "เพิ่มข้อมูลแล้ว");
      await reload();
    } catch (err) {
      // error ค้างไว้ในฟอร์ม ไม่ปิด modal — ผู้ใช้จะได้แก้ค่าเดิมต่อได้
      setFormError(getErrorMessage(err, "บันทึกไม่สำเร็จ"));
    } finally {
      setSubmitting(false);
    }
  }, [form, editingRow, validate, toPayload, update, create, toast, labels, reload]);

  const askDelete = useCallback((row) => {
    setDeleteTarget(row);
    setDeleteError("");
  }, []);

  const cancelDelete = useCallback(() => {
    if (deleting) return;
    setDeleteTarget(null);
  }, [deleting]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
      toast.success(labels.deleted || "ลบข้อมูลแล้ว");
      await reload();
    } catch (err) {
      setDeleteError(getErrorMessage(err, "ลบไม่สำเร็จ"));
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, remove, toast, labels, reload]);

  return {
    form,
    setField,
    setForm,
    isEdit: Boolean(editingRow),
    editingRow,
    modalOpen,
    openCreate,
    openEdit,
    closeModal,
    formError,
    submitting,
    submit,
    deleteTarget,
    askDelete,
    cancelDelete,
    confirmDelete,
    deleteError,
    deleting,
  };
}
