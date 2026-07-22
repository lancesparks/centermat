"use client";

import * as React from "react";

interface CheckboxProps {
  containerClasses?: string;
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({
  containerClasses = "",
  label,
  checked,
  onChange,
  disabled = false
}: CheckboxProps) {
  return (
    <div className={containerClasses}>
      <label
        className={`group flex items-start gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="relative flex items-center justify-center mt-0.5 size-4 shrink-0">
          <input
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
            className="peer size-4 appearance-none border-2 border-ink bg-paper transition-colors checked:bg-ink focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-1 cursor-pointer disabled:cursor-not-allowed"
          />

          <svg
            className="pointer-events-none absolute size-2.5 stroke-ivory opacity-0 transition-opacity peer-checked:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="4"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <span className="text-sm leading-tight text-ink select-none">
          {label}
        </span>
      </label>
    </div>
  );
}
