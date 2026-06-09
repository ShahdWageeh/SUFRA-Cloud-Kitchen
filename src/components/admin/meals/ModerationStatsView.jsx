import { StatCard, StatSkeleton } from "./StatCard";

export function ModerationStatsView({ loading, stats }) {
  if (loading) {
    return (
      <div className="flex items-stretch gap-3 shrink-0">
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }
  if (!stats) return null;

  return (
    <div className="flex items-stretch gap-3 shrink-0">
      <StatCard
        label="Pending Audit"
        value={stats.pendingAudit}
        bg="bg-amber-800"
        textColor="text-white"
        subTextColor="text-amber-200"
      />
      <StatCard
        label="Flagged Today"
        value={stats.flaggedToday}
        bg="bg-rose-50 border border-rose-100"
        textColor="text-rose-600"
        subTextColor="text-rose-400"
      />
    </div>
  );
}