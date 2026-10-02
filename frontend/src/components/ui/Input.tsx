import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
};

export default function Input({
  error,
  label,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
          }
          disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60
          ${className ?? ""}`}
      />
    </div>
  );
}
