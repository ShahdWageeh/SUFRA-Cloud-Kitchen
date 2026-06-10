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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please log in to view your chef orders.");
      return;
    }

    async function loadChefOrders() {
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
    }

    loadChefOrders();
  }, [token]);

  return (
    <div className="p-8">
      <OrdersTabs incomingOrders={orders.length} />

      <div className="mt-6">
        {loading ? (
          <div className="rounded-[20px] border border-[#EDE6E3] bg-white p-8 text-center text-sm text-[#7A6560]">
            Loading your chef orders...
          </div>
        ) : error ? (
          <div className="rounded-[20px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[20px] border border-[#EDE6E3] bg-white p-8 text-center text-sm text-[#7A6560]">
            No orders found for your kitchen yet.
          </div>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>

      <div className="mt-16">
        <StatsSection />
      </div>
    </div>
  );
}