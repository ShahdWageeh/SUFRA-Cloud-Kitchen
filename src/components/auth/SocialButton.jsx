import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SocialButton({ icon, children }) {
  return (
    <button
      type="button"
      className="flex h-10 items-center justify-center gap-2 rounded-md border border-primary/20 bg-white/70 px-4 text-xs font-medium text-text-primary transition hover:border-primary/45 hover:bg-white"
    >
      {icon && <FontAwesomeIcon icon={icon} className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}
