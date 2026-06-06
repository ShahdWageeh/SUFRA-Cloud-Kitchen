import { Clock3, MapPin } from "lucide-react";
import Image from "next/image";

export default function OrderCard({ order }) {
    return (
        <div className="bg-white rounded-card border border-[#EAD3CB] p-5 shadow-sm flex flex-col h-full">

            <div className="flex justify-between items-start">

                <div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs
            ${order.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-primary"
                            }`}
                    >
                        {order.priority === "high"
                            ? "HIGH PRIORITY"
                            : "NEW ORDER"}
                    </span>

                    <h3 className="mt-3 text-lg font-bold">
                        {order.id}
                    </h3>
                </div>

                <div className="text-right">
                    <p className="text-primary text-lg font-bold">
                        SAR {order.amount}
                    </p>

                    <p className="text-sm text-text-tertiary">
                        {order.timeAgo}
                    </p>
                </div>
            </div>

            <div className="border-b border-gray-300 my-3" />

            <div className="flex items-start gap-4 mt-2">
                <Image
                    src={order.image}
                    alt="food"
                    width={80}
                    height={80}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div className="min-w-0">
                    <h4 className="font-semibold text-text-primary">
                        {order.customer}
                    </h4>

                    <p className="text-sm text-text-secondary mt-1">
                        {order.items}
                    </p>
                </div>
            </div>

            <div className="border-b border-gray-300 my-3" />

            <div className="mt-2 text-sm text-text-secondary">

                <div className="flex items-center gap-2">
                    {order.type === "delivery" ? (
                        <Clock3 size={14} />
                    ) : (
                        <MapPin size={14} />
                    )}

                    <span>
                        {order.type === "delivery"
                            ? "ASAP • Delivery requested"
                            : "Pickup at 7:30 PM"}
                    </span>
                </div>

                {order.note && (
                    <p className="mt-2 italic">
                        "{order.note}"
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