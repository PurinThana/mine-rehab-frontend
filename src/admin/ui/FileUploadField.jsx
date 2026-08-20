import { useId, useRef, useState } from "react";
import { uploadsApi, getErrorMessage } from "../../api/index.js";
import { IconAlert, IconDoc, IconSpinner } from "../../components/Icons.jsx";
import { formatNumber } from "../../utils/date.js";

/**
 * เลือกไฟล์ → อัปโหลดขึ้น Cloudinary ผ่าน API → คืน URL กลับมาใส่ในฟอร์ม
 *
 * ยังให้วาง URL เองได้ด้วย (เผื่อไฟล์อยู่ที่อื่นแล้ว) จึงไม่บังคับให้ต้องอัปโหลด
 * ทุกครั้ง และของเดิมที่กรอก URL ไว้ก็ยังแก้ได้เหมือนเดิม
 *
 * onUploaded(result) ให้ผู้เรียกใช้ข้อมูลอื่นจากผลอัปโหลดได้ เช่น เอา sizeKb
 * ไปเติมช่อง "ขนาดไฟล์" ให้อัตโนมัติ
 */
export default function FileUploadField({
  label,
  accept = "image/*",
  value,
  onChange,
  onUploaded,
  hint,
  required,
  previewKind = "image", // 'image' | 'document'
}) {
  const id = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handlePick(e) {
    const file = e.target.files?.[0];
    // เคลียร์ค่าใน input เสมอ เพื่อให้เลือกไฟล์ชื่อเดิมซ้ำได้ (onChange จะไม่ยิงถ้าค่าเดิม)
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    setProgress(0);
    try {
      const result = await uploadsApi.upload(file, setProgress);
      onChange(result.url);
      onUploaded?.(result);
    } catch (err) {
      setError(getErrorMessage(err, "อัปโหลดไม่สำเร็จ"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soil-700">
        {label}
        {required && <span className="ml-1 text-clay-600">*</span>}
      </label>

      {/* ตัวอย่างไฟล์ที่เลือกไว้แล้ว */}
      {value && !uploading && (
        <div className="mb-2.5 flex items-center gap-3 rounded-xl border border-forest-700/10 bg-white p-2.5">
          {previewKind === "image" ? (
            <img
              src={value}
              alt="ตัวอย่างรูปที่เลือก"
              className="h-16 w-24 shrink-0 rounded-lg border border-forest-700/10 object-cover"
              // รูปเสีย/URL ผิด ให้ซ่อนไปเลย ไม่ต้องโชว์ไอคอนรูปแตก
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-clay-600/10 text-clay-600">
              <IconDoc className="h-5 w-5" />
            </span>
          )}
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 break-all font-mono text-[11px] text-forest-700 underline-offset-2 hover:underline"
          >
            {value}
          </a>
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-clay-700 transition-colors hover:bg-clay-400/10"
          >
            เอาออก
          </button>
        </div>
      )}

      {uploading && (
        <div className="mb-2.5 rounded-xl border border-forest-700/10 bg-white px-3.5 py-3">
          <p className="flex items-center gap-2 text-sm text-soil-600">
            <IconSpinner className="h-4 w-4" />
            กำลังอัปโหลด... {progress}%
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-700/10">
            <div
              className="h-full rounded-full bg-forest-600 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handlePick}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl border border-forest-700/15 bg-white px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-700/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {value ? "เลือกไฟล์ใหม่" : "เลือกไฟล์จากเครื่อง"}
        </button>
        <span className="text-xs text-soil-400">หรือวาง URL เอง:</span>
      </div>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        disabled={uploading}
        className="mt-2 w-full rounded-xl border border-forest-700/15 bg-white px-3.5 py-2.5 font-mono text-xs text-soil-900 outline-none transition-colors placeholder:font-body placeholder:text-soil-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 disabled:bg-sand-100 disabled:opacity-70"
      />

      {error ? (
        <p className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-clay-700">
          <IconAlert className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-soil-500">{hint}</p>
      )}
    </div>
  );
}

export function formatUploadedSize(bytes) {
  return `${formatNumber(Math.max(1, Math.ceil(bytes / 1024)))} KB`;
}
