export default function AuthDivider({ children }) {
  return (
    <div className="flex items-center gap-4 text-[11px] text-text-secondary/80">
      <span className="h-px flex-1 bg-primary/18" />
      <span>{children}</span>
      <span className="h-px flex-1 bg-primary/18" />
    </div>
  );
}
