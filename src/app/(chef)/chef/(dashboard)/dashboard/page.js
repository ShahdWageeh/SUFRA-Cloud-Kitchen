"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

function formatCurrency(value) {
  return `$${(value || 0).toFixed(2)}`;
}

function statusClassName(status) {
  const normalized = status?.toLowerCase();
  if (normalized === "preparing") return "bg-[#FFF1DF] text-[#C47520]";
  if (normalized === "ready") return "bg-[#DCF5E8] text-[#1E8059]";
  if (normalized === "out_for_delivery" || normalized === "delivering") return "bg-[#DCE9FF] text-[#2558BF]";
  if (normalized === "delivered") return "bg-[#DCF5E8] text-[#1E8059]";
  return "bg-[#EDEDED] text-[#5A5A5A]";
}

function formatStatusText(status) {
  if (!status) return "";
  if (status === "out_for_delivery") return "Delivering";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function DashboardPage() {
  // 1. Get the authenticated user state directly from your global hook
  const { user, token, logout } = useAuth(); 

  const [orders, setOrders] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. Wait until the AuthContext finishes checking for a valid token/session
    if (!token) {
      setError("Please log in to access the chef dashboard.");
      setLoading(false);
      return;
    }

    async function loadDashboardOrders() {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const fetchOptions = {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        };

        // 3. We only need to fetch orders now since profile data comes from the AuthContext!
        const ordersResponse = await fetch(`${baseUrl}/orders/chef/orders`, fetchOptions);
        const ordersResult = await ordersResponse.json();

        if (ordersResponse.status === 401) {
          // If the server rejects the token (expired session), log them out globally
          logout();
          throw new Error("Your login session has expired. Redirecting...");
        }

        if (ordersResponse.ok && ordersResult.success) {
          const liveOrders = ordersResult.data;
          setOrders(liveOrders);

          // Calculate metrics locally from live orders
          const totalRevenue = liveOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
          const totalOrdersCount = liveOrders.length;
          const activeOrdersCount = liveOrders.filter(
            o => o.status === "preparing" || o.status === "out_for_delivery"
          ).length;

          setMetrics([
            { id: "revenue", label: "Total Earnings", value: formatCurrency(totalRevenue), iconBg: "#FDF2EC", iconText: "💵" },
            { id: "orders", label: "Total Orders", value: totalOrdersCount.toString(), iconBg: "#EAF7F3", iconText: "📦" },
            { id: "active", label: "Active Orders", value: activeOrdersCount.toString(), iconBg: "#EBF3FE", iconText: "⏳" }
          ]);

          // Aggregate Popular Meals
          const mealAggregator = {};
          liveOrders.forEach(order => {
            order.items?.forEach(item => {
              const key = item.name;
              if (!mealAggregator[key]) {
                mealAggregator[key] = {
                  id: item.mealId || Math.random().toString(),
                  name: item.name,
                  image: item.image || "/fallback-meal.jpg",
                  ordersThisMonth: 0,
                  price: item.unitPrice || 0
                };
              }
              mealAggregator[key].ordersThisMonth += item.quantity || 1;
            });
          });

          const sortedMeals = Object.values(mealAggregator)
            .sort((a, b) => b.ordersThisMonth - a.ordersThisMonth)
            .slice(0, 3);
          
          setPopularMeals(sortedMeals);
        } else {
          throw new Error(ordersResult.message || "Failed to parse kitchen metrics.");
        }

      } catch (err) {
        console.error("Dashboard Orders Load Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardOrders();
  }, [token, logout]); // Re-run if token status changes

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-medium text-[#7A6560] animate-pulse">Loading kitchen insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[20px] border border-red-200 bg-red-50 p-6 text-center max-w-xl mx-auto my-10">
        <p className="font-semibold text-red-700 mb-2">Access Error</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section - Pulls from Context User State Object */}
      <section>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#1E1410] sm:text-4xl lg:text-[42px]">
          Welcome back, Chef {user?.firstName || "Chef"}!
        </h1>
        <p className="mt-2 text-sm text-[#7A6560] sm:text-[15px]">
          Here&apos;s what&apos;s happening with your kitchen today.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.id} className="rounded-[20px] border border-[#EDE6E3] bg-white px-5 py-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: metric.iconBg }}>
                {metric.iconText}
              </span>
            </div>
            <p className="mt-4 text-[13.5px] font-medium text-[#7A6560]">{metric.label}</p>
            <p className="mt-1 text-[30px] font-extrabold leading-none tracking-tight text-[#1E1410] md:text-[36px]">{metric.value}</p>
          </article>
        ))}
      </section>

      {/* Main Content Layout (Table & Sidebar remain exactly the same) */}
      <section className="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
        <div className="min-w-0">
          <div className="mb-3.5 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1E1410] md:text-[28px]">Recent Orders</h2>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#EDE6E3] bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full">
                <thead>
                  <tr className="border-b border-[#F2E9E5]">
                    {["Order ID", "Customer", "Meals Ordered", "Status", "Total"].map((heading) => (
                      <th key={heading} className="px-5 py-4 text-left text-[13.5px] font-semibold text-[#7A6560]">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-5 py-8 text-center text-sm text-[#7A6560]">No orders have been placed yet.</td>
                    </tr>
                  ) : (
                    orders.map((order, index) => (
                      <tr key={order._id} className={index !== orders.length - 1 ? "border-b border-[#F5EFEC]" : ""}>
                        <td className="px-5 py-5 text-[14px] font-bold text-[#2E1F1A]">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-5 py-5 text-[14px] text-[#3F3531]">{order.contactPhone || "Customer"}</td>
                        <td className="px-5 py-5 text-[14px] text-[#3F3531]">
                          {order.items?.map(item => `${item.name} (x${item.quantity})`).join(", ")}
                        </td>
                        <td className="px-5 py-5">
                          <span className={`inline-flex rounded-full px-3.5 py-1.5 text-[12px] font-bold ${statusClassName(order.status)}`}>
                            {formatStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-[14px] font-bold text-[#1E1410]">{formatCurrency(order.totalAmount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Popular Meals Sidebar */}
        <aside>
          <h2 className="mb-3.5 text-2xl font-extrabold tracking-tight text-[#1E1410] md:text-[28px]">Popular Meals</h2>
          <div className="flex flex-col gap-4">
            {popularMeals.length === 0 ? (
              <p className="text-sm text-[#7A6560] py-4">Data will populate as meals are ordered.</p>
            ) : (
              popularMeals.map((meal) => (
                <article key={meal.id} className="overflow-hidden rounded-[20px] border border-[#EDE6E3] bg-white shadow-sm transition hover:shadow-md">
                  <div className="relative h-[180px] md:h-[160px]">
                    <Image src={meal.image} alt={meal.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <div className="px-4 py-3.5">
                    <h3 className="text-[15px] font-bold text-[#1E1410]">{meal.name}</h3>
                    <div className="mt-1.5 flex items-center justify-between">
                      <p className="text-[12.5px] text-[#7A6560]">{meal.ordersThisMonth} units sold</p>
                      <p className="text-[15.5px] font-extrabold text-[#A0431E]">{formatCurrency(meal.price)}</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}