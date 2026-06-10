export default function OrdersTabs({incomingOrders}) {
  return (
    <div className="border-b border-surface-low">
      <div className="flex gap-10">

        <button className="pb-3 border-b-2 border-primary text-primary font-medium">
          Incoming ({incomingOrders})
        </button>

        <button className="pb-3 text-text-secondary">
          In Progress (0)
        </button>

        <button className="pb-3 text-text-secondary">
          Completed (0)
        </button>

      </div>
    </div>
  );
}