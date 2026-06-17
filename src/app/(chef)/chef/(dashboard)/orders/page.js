"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import OrdersTabs from "@/components/chef/orders/OrdersTabs";
import OrdersList from "@/components/chef/orders/OrdersList";
import StatsSection from "@/components/chef/orders/StatsSection";
import useAuth from "@/hooks/useAuth";
import { ordersService } from "@/services";

export default function OrdersPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("preparing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);

  const normalizeStatus = (status) => {
    if (!status) return "preparing";
    if (status === "ready" || status === "out_for_delivery") return "out_for_delivery";
    if (status === "delivered") return "completed";
    return status;
  };

  const getOrderStatus = (order) => {
    const itemStatus = order.items?.[0]?.status;
    return normalizeStatus(itemStatus ?? order.status);
  };

  const loadChefOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await ordersService.getChefOrders();
      const fetchedOrders = Array.isArray(result.data) ? result.data : [];
      setOrders(fetchedOrders);

      // Check for highlight parameter after orders are loaded
      const highlight = searchParams.get("highlight");
      if (highlight && fetchedOrders.length > 0) {
        const targetOrder = fetchedOrders.find(o => (o._id || o.id) === highlight);
        if (targetOrder) {
          const status = getOrderStatus(targetOrder);
          const tab = status === "out_for_delivery" ? "ready" : (status === "completed" ? "completed" : "preparing");
          setSelectedStatus(tab);
          setHighlightedOrderId(highlight);

          // Scroll to the order card after a short delay to allow for tab switching and rendering
          setTimeout(() => {
            const element = document.getElementById(`order-card-${highlight}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 500);

          // Clear highlight after some time
          setTimeout(() => {
            setHighlightedOrderId(null);
          }, 8000);
        }
      }
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

  const preparingOrders = orders.filter((o) => getOrderStatus(o) === "preparing");
  const readyOrders = orders.filter((o) => getOrderStatus(o) === "out_for_delivery");
  const completedOrders = orders.filter((o) => getOrderStatus(o) === "completed");

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
          <OrdersList 
            orders={visibleOrders} 
            onStatusChange={handleStatusChange} 
            highlightedOrderId={highlightedOrderId}
          />
      </div>

      {/* <div className="mt-16">
        <StatsSection />
      </div> */}
    </div>
  );
}