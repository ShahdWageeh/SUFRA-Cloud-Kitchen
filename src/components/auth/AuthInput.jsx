"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AuthInput({
  label,
  icon,
  error,
  className = "",
  inputClassName = "",
  ...props
}) {
  const inputId = props.id || props.name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={inputId} className="block text-[11px] font-medium text-text-secondary">
        {label}
      </label>
      <div
        className={`flex h-11 items-center rounded-md border bg-white/80 px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 ${
          error ? "border-red-400" : "border-primary/25"
        }`}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="mr-3 h-3.5 w-3.5 text-text-secondary/80"
          />
        )}
        <input
          id={inputId}
          className={`h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-outline/55 ${inputClassName}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
