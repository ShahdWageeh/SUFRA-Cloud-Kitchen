"use client";

import { useEffect, useState } from "react";
import { deliveryService } from "@/services";
import { Package, CheckCircle, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function DeliveryDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [orderResponse, historyResponse] = await Promise.all([
          deliveryService.getCurrentOrder(),
          deliveryService.getDeliveryHistory(),
        ]);

        setCurrentOrder(orderResponse?.data || null);
        setHistory(historyResponse?.data || []);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const completedOrders = history.length;
  const isBusy = !!currentOrder;

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Delivery Dashboard
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Track your deliveries and assigned orders.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-text-secondary">Current Status</h3>

            <Truck className="text-primary" size={20} />
          </div>

          <p className="mt-3 text-2xl font-bold">
            {isBusy ? "Busy" : "Available"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-text-secondary">Active Order</h3>

            <Package className="text-red-400" size={20} />
          </div>

          <p className="mt-3 text-2xl font-bold">{currentOrder ? "1" : "0"}</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-text-secondary">Completed Orders</h3>

            <CheckCircle className="text-green-600" size={20} />
          </div>

          <p className="mt-3 text-2xl font-bold">{completedOrders}</p>
        </div>
      </div>

      {/* Current Order */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Current Order</h2>

          <Link
            href="/delivery/current-order"
            className="flex items-center gap-2 text-sm font-medium text-primary"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>

        {!currentOrder ? (
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-text-secondary">No active delivery assigned.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <span className="text-sm text-text-secondary">Order ID</span>

              <p className="font-medium">#{currentOrder._id}</p>
            </div>

            <div>
              <span className="text-sm text-text-secondary">Customer</span>

              <p className="font-medium">
                {currentOrder.customerId?.firstName}{" "}
                {currentOrder.customerId?.lastName}
              </p>
            </div>

            <div>
              <span className="text-sm text-text-secondary">Status</span>

              <p className="font-medium capitalize">{currentOrder.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Completed Orders */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Deliveries</h2>

          <Link
            href="/delivery/history"
            className="text-sm font-medium text-primary"
          >
            View All
          </Link>
        </div>

        {history.length === 0 ? (
          <p className="text-text-secondary">No completed deliveries yet.</p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">#{order._id}</p>

                  <p className="text-sm text-text-secondary">
                    {order.customerId?.firstName} {order.customerId?.lastName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">{order.totalAmount} EGP</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
