import { Clock3, MapPin } from "lucide-react";
import Image from "next/image";

function getOrderPriority(status) {
  if (!status) return "new";
  if (status === "out_for_delivery" || status === "delivering" || status === "delivered") return "high";
  return "new";
}

function getOrderType(order) {
  if (order.type) return order.type;
  if (order.deliveryType) return order.deliveryType;
  if (order.isPickup || order.pickup) return "pickup";
  return "delivery";
}

function formatOrderItems(items) {
  if (!items) return "No items listed";
  if (Array.isArray(items)) {
    return items
      .map((item) => {
        const name = item.name || item.title || item.mealName || "Meal";
        const quantity = item.quantity ?? item.qty ?? 1;
        return `${quantity}x ${name}`;
      })
      .join(", ");
  }

  return String(items);
}

function getTimeAgo(dateString) {
  if (!dateString) return "Just now";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function OrderCard({ order }) {
    const orderId = order._id || order.id || order.orderId || "Order";
    const orderStatus = order.status || order.orderStatus;
    const orderType = getOrderType(order);
    const priority = getOrderPriority(orderStatus);
    const amount = order.totalAmount ?? order.amount ?? 0;
    const customerName = order.customer?.name || order.customerName || order.customer || "Guest";
    const itemsSummary = formatOrderItems(order.items);
    const note = order.note || order.specialInstructions || order.comment || "";
    const createdAt = order.createdAt || order.date;
    const timeAgo = getTimeAgo(createdAt);
    const imageSrc = order.image || order.items?.[0]?.image ||
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZHklMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";

    return (
        <div className="bg-white rounded-card border border-[#EAD3CB] p-5 shadow-sm flex flex-col h-full">

            <div className="flex justify-between items-start">

                <div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs
            ${priority === "high"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-primary"
                            }`}
                    >
                        {priority === "high"
                            ? "HIGH PRIORITY"
                            : "NEW ORDER"}
                    </span>

                    <h3 className="mt-3 text-lg font-bold">
                        {orderId}
                    </h3>
                </div>

                <div className="text-right">
                    <p className="text-primary text-lg font-bold">
                        SAR {Number(amount).toFixed(2)}
                    </p>

                    <p className="text-sm text-text-tertiary">
                        {timeAgo}
                    </p>
                </div>
            </div>

            <div className="border-b border-gray-300 my-3" />

            <div className="flex items-start gap-4 mt-2">
                <Image
                    src={imageSrc}
                    alt="food"
                    width={80}
                    height={80}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div className="min-w-0">
                    <h4 className="font-semibold text-text-primary">
                        {customerName}
                    </h4>

                    <p className="text-sm text-text-secondary mt-1">
                        {itemsSummary}
                    </p>
                </div>
            </div>

            <div className="border-b border-gray-300 my-3" />

            <div className="mt-2 text-sm text-text-secondary">

                <div className="flex items-center gap-2">
                    {orderType === "delivery" ? (
                        <Clock3 size={14} />
                    ) : (
                        <MapPin size={14} />
                    )}

                    <span>
                        {orderType === "delivery"
                            ? "ASAP • Delivery requested"
                            : "Pickup requested"}
                    </span>
                </div>

                {note && (
                    <p className="mt-2 italic">
                        "{note}"
                    </p>
                )}
            </div>

            <div className="flex gap-3 mt-auto pt-6">

                <button className="flex-1 bg-primary text-white py-3 rounded-xl font-medium hover:opacity-90">
                    Accept
                </button>

                <button className="px-6 py-3 bg-secondary-container rounded-xl text-text-secondary hover:opacity-90">
                    Reject
                </button>

            </div>
        </div>
    );
}