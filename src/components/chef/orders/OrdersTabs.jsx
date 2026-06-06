export default function OrdersTabs() {
  return (
    <div className="border-b border-surface-low">
      <div className="flex gap-10">

        <button className="pb-3 border-b-2 border-primary text-primary font-medium">
          Incoming (3)
        </button>

        <button className="pb-3 text-text-secondary">
          In Progress (5)
        </button>

        <button className="pb-3 text-text-secondary">
          Completed
        </button>

      </div>
    </div>
  );
}