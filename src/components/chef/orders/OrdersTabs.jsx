export default function OrdersTabs({ counts = {}, selectedStatus = "preparing", onSelectStatus }) {
  const tabs = [
    { key: "preparing", label: "Preparing", count: counts.preparing || 0 },
    { key: "ready", label: "Ready", count: counts.ready || 0 },
    { key: "completed", label: "Completed", count: counts.completed || 0 },
  ];

  return (
    <div className="border-b border-surface-low">
      <div className="flex gap-10">
        {tabs.map((tab) => {
          const isActive = tab.key === selectedStatus;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectStatus?.(tab.key)}
              className={`pb-3 text-sm font-medium ${isActive ? "border-b-2 border-primary text-primary" : "text-text-secondary hover:text-primary"}`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}