export default function SectionCard({
  children,
}) {
  return (
    <div
      className="
      bg-white
      rounded-card
      border
      border-surface-low
      p-8
      shadow-sm
    "
    >
      {children}
    </div>
  );
}