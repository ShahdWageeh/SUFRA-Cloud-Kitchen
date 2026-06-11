"use client";

import { useEffect, useState } from "react";
import OrdersTabs from "@/components/chef/orders/OrdersTabs";
import OrdersList from "@/components/chef/orders/OrdersList";
import StatsSection from "@/components/chef/orders/StatsSection";
import useAuth from "@/hooks/useAuth";
import { ordersService } from "@/services";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("preparing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeStatus = (status) => {
    if (!status) return "preparing";
    if (status === "ready") return "out_for_delivery";
    return status;
  };

  const loadChefOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ordersService.getChefOrders();
      setOrders(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      console.error("Chef orders load failed:", err);
      setError(err?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, nextStatus, mealId) => {
    try {
      setLoading(true);
      setError(null);
      await ordersService.updateOrderItemStatus(orderId, mealId, nextStatus);
      await loadChefOrders();
    } catch (err) {
      console.error("Failed to update order item status:", err);
      setError(err?.response?.data?.message || "Unable to update order status.");
    } finally {
      setLoading(false);
    }
  };

  const preparingOrders = orders.filter((o) => normalizeStatus(o.status) === "preparing");
  const readyOrders = orders.filter((o) => normalizeStatus(o.status) === "out_for_delivery");
  const completedOrders = orders.filter((o) => normalizeStatus(o.status) === "completed");

  const visibleOrders =
    selectedStatus === "ready"
      ? readyOrders
      : selectedStatus === "completed"
      ? completedOrders
      : preparingOrders;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please log in to view your chef orders.");
      return;
    }

    loadChefOrders();
  }, [token]);

  return (
    <div className="p-8">
      <OrdersTabs
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        counts={{
          preparing: preparingOrders.length,
          ready: readyOrders.length,
          completed: completedOrders.length,
        }}
      />

      <div className="mt-6">
          <OrdersList orders={visibleOrders} onStatusChange={handleStatusChange} />
      </div>

      {/* <div className="mt-16">
        <StatsSection />
      </div> */}
    </div>
  );
}