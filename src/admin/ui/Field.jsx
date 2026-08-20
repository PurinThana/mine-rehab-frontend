import { useId } from "react";

const inputClass =
  "w-full rounded-xl border border-forest-700/15 bg-white px-3.5 py-2.5 text-sm text-soil-900 outline-none transition-colors placeholder:text-soil-400 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 disabled:bg-sand-100 disabled:opacity-70";

function Wrapper({ label, hint, required, error, htmlFor, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-soil-700">
        {label}
        {required && <span className="ml-1 text-clay-600">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-soil-500">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-clay-700">{error}</p>}
    </div>
  );
}

export function TextField({ label, hint, required, error, className, ...props }) {
  const id = useId();
  return (
    <Wrapper {...{ label, hint, required, error, className }} htmlFor={id}>
      <input id={id} className={inputClass} {...props} />
    </Wrapper>
  );
}

export function NumberField({ label, hint, required, error, className, ...props }) {
  const id = useId();
  return (
    <Wrapper {...{ label, hint, required, error, className }} htmlFor={id}>
      <input id={id} type="number" className={`${inputClass} tick-num`} {...props} />
    </Wrapper>
  );
}

export function DateField({ label, hint, required, error, className, ...props }) {
  const id = useId();
  return (
    <Wrapper {...{ label, hint, required, error, className }} htmlFor={id}>
      <input id={id} type="date" className={`${inputClass} tick-num`} {...props} />
    </Wrapper>
  );
}

export function TextareaField({ label, hint, required, error, className, rows = 4, ...props }) {
  const id = useId();
  return (
    <Wrapper {...{ label, hint, required, error, className }} htmlFor={id}>
      <textarea id={id} rows={rows} className={`${inputClass} resize-y`} {...props} />
    </Wrapper>
  );
}

export function SelectField({ label, hint, required, error, className, options, ...props }) {
  const id = useId();
  return (
    <Wrapper {...{ label, hint, required, error, className }} htmlFor={id}>
      <select id={id} className={inputClass} {...props}>
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

// สีของพันธุ์พืชใช้บนหน้าเว็บจริง จึงให้เห็นตัวอย่างสีคู่กับค่า #RRGGBB
export function ColorField({ label, hint, required, error, className, value, onChange, ...props }) {
  const id = useId();
  return (
    <Wrapper {...{ label, hint, required, error, className }} htmlFor={id}>
      <div className="flex items-center gap-2.5">
        <input
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(value) ? value : "#3F8F5F"}
          onChange={onChange}
          aria-label={`${label} (เลือกจากจานสี)`}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-forest-700/15 bg-white p-1"
        />
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder="#RRGGBB"
          maxLength={7}
          className={`${inputClass} font-mono uppercase`}
          {...props}
        />
      </div>
    </Wrapper>
  );
}
