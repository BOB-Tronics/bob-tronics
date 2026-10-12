import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldClasses =
  "h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-ink">
          {label}
          {props.required && " *"}
        </label>
      )}
      <input
        id={inputId}
        className={`${fieldClasses} ${error ? "border-red-400" : ""}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, id, className = "", ...props }: SelectProps) {
  const selectId = id ?? props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-sm font-semibold text-ink">
          {label}
          {props.required && " *"}
        </label>
      )}
      <select id={selectId} className={fieldClasses} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
