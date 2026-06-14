"use client";

import { useEffect, useState } from "react";
import { deliveryService } from "@/services";
import { MapPin, Phone, Package, CircleCheckBig } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CurrentOrderPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const response = await deliveryService.getCurrentOrder();

        setOrder(response?.data || null);
      } catch (error) {
        toast.error("Failed to load order");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, []);

  async function handleCompleteOrder() {
    if (!order) return;

    try {
      setCompleting(true);

      const response = await deliveryService.completeOrder(order._id);

      toast.success(response?.message || "Order completed successfully");

      setOrder(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to complete order");
    } finally {
      setCompleting(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="rounded-2xl shadow-sm bg-white p-10 text-center">
          <Package size={60} className="mx-auto mb-4 text-red-400" />

          <h2 className="text-xl font-semibold">No Active Order</h2>

          <p className="mt-2 text-text-secondary">
            You currently have no assigned deliveries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Current Order</h1>

        <p className="mt-1 text-sm text-text-secondary">
          Active delivery assignment.
        </p>
      </div>

      {/* Order Card */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Order ID</p>

            <h2 className="text-xl font-bold">#{order._id}</h2>
          </div>

          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            {order.status}
          </span>
        </div>
      </div>

      {/* Customer */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Customer Information</h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-text-secondary">Customer Name</p>

            <p className="font-medium">
              {order.customerId?.firstName} {order.customerId?.lastName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} />

            <a
              href={`tel:${order.contactPhone}`}
              className="font-medium text-primary"
            >
              {order.contactPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Address */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Delivery Address</h3>

        <div className="flex items-start gap-3">
          <MapPin size={18} />

          <p>{order.shippingAddress}</p>
        </div>
      </div>

      {/* Items */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Order Items</h3>

        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border p-3"
            >
              <div>
                <p className="font-medium">{item.mealName || item.name}</p>

                <p className="text-sm text-text-secondary">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="font-semibold">{item.price} EGP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Total Amount</span>

          <span className="text-2xl font-bold text-primary">
            {order.totalAmount} EGP
          </span>
        </div>
      </div>

      {/* Complete Button */}

      <button
        onClick={handleCompleteOrder}
        disabled={completing}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        <CircleCheckBig size={20} />

        {completing ? "Completing..." : "Mark As Delivered"}
      </button>
    </div>
  );
}
