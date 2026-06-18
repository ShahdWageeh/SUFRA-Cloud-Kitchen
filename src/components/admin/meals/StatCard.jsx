import { Loader2 } from "lucide-react";

export function StatCard({ label, value, bg, textColor, subTextColor }) {
  return (
    <div className={`rounded-2xl px-6 py-5 flex flex-col gap-1 min-w-35 ${bg}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>
        {label}
      </p>
      <p className={`text-5xl font-black leading-none ${textColor}`}>
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-2xl px-6 py-5 bg-slate-100 min-w-35">
      <div className="h-2.5 bg-slate-200 rounded animate-pulse w-20 mb-3" />
      <div className="h-12 bg-slate-200 rounded animate-pulse w-16" />
    </div>
  );
}