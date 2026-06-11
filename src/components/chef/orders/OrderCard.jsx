import { Clock3, MapPin } from "lucide-react";
import Image from "next/image";

function formatOrderItems(items) {
    if (!items) return "No items listed";
    if (Array.isArray(items)) {
        return items
            .map((item) => {
                const name = item.name;
                const quantity = item.quantity;
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

export default function OrderCard({ order, orderNumber, onStatusChange }) {
    const amount = order.totalAmount;
    const customerName = `${order.customerId.firstName} ${order.customerId.lastName}`;
    const itemsSummary = formatOrderItems(order.items);
    const createdAt = order.createdAt;
    const timeAgo = getTimeAgo(createdAt);
    const imageSrc = order.items?.[0]?.image;
    const status = order.status || "preparing";

    const badgeText =
        status === "preparing"
            ? "NEW ORDER"
            : status === "ready"
            ? "READY"
            : "COMPLETED";

    const badgeClass =
        status === "preparing"
            ? "bg-orange-100 text-primary"
            : status === "ready"
            ? "bg-blue-100 text-blue-700"
            : "bg-emerald-100 text-emerald-800";

    const buttonLabel =
        status === "preparing"
            ? "Ready To Pick Up"
            : status === "ready"
            ? "Complete"
            : "Completed";

    const isButtonDisabled = status === "completed";
    const nextStatus = status === "preparing" ? "ready" : status === "ready" ? "completed" : null;

    const handleAction = () => {
        if (!isButtonDisabled && nextStatus && onStatusChange) {
            onStatusChange(order._id || order.id, nextStatus);
        }
    };

    return (
        <div className="bg-white rounded-card border border-[#EAD3CB] p-5 shadow-sm flex flex-col h-full">

            <div className="flex justify-between items-start">

                <div>
                    <span className={`px-3 py-1 rounded-full text-xs ${badgeClass}`}>
                        {badgeText}
                    </span>

                    <h3 className="mt-3 text-lg font-bold">
                        #{orderNumber}
                    </h3>
                </div>

                <div className="text-right">
                    <p className="text-primary text-lg font-bold">
                        {Number(amount).toFixed(2)} EGP
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
                    <Clock3 size={14} /> Delivery requested
                </div>
            </div>

            <div className="flex gap-3 mt-auto pt-6">
                <button
                    onClick={handleAction}
                    disabled={isButtonDisabled}
                    className={`flex-1 py-3 rounded-xl font-medium ${isButtonDisabled ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" : "bg-primary text-white hover:opacity-90"}`}
                >
                    {buttonLabel}
                </button>
            </div>
        </div>
    );
}