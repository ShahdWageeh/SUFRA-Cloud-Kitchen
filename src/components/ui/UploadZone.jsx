"use client";

export default function UploadZone({
  label,
  icon,
  size = "md",
  fieldName,
  description,
  hint,
  isUploaded,
  onFileChange,
}) {
  return (
    <div
      className={`upload-zone relative p-2 border-2 border-dashed ${isUploaded ? "border-primary bg-primary/10" : "border-outline"} rounded-(--radius-card) ${size === "lg" ? "p-lg" : "p-md"} text-center hover:border-primary transition-colors cursor-pointer group`}
    >
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => onFileChange(e, fieldName)}
      />
      <div className={size === "lg" ? "flex flex-col items-center" : ""}>
        <span
          className={`material-symbols-outlined ${size === "lg" ? "text-4xl mb-sm" : "text-3xl"} ${isUploaded ? "text-primary" : "text-outline"} group-hover:text-primary transition-colors`}
        >
          {isUploaded ? "check_circle" : icon}
        </span>
        <p className="font-label-md text-label-md text-text-primary mt-2">
          {label}
        </p>
        {description && (
          <p className="text-xs text-outline mt-1">
            {description}
          </p>
        )}
        {hint && (
          <p className="text-[10px] text-outline mt-1 uppercase tracking-wider">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
