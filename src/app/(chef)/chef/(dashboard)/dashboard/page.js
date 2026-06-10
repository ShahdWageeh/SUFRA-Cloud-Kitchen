"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { DollarSign, ShoppingBag, Clock, Star } from "lucide-react";

function formatCurrency(value) {
  return `EGP ${(value || 0).toFixed(2)}`;
}

function statusClassName(status) {
  const normalized = status?.toLowerCase();
  if (normalized === "preparing") return "bg-[#FFF1DF] text-[#C47520]";
  if (normalized === "ready") return "bg-[#DCF5E8] text-[#1E8059]";
  if (normalized === "delivering" || normalized === "out_for_delivery")
    return "bg-[#DCE9FF] text-[#2558BF]";
  return "bg-[#EDEDED] text-[#5A5A5A]";
}

function formatStatusText(status) {
  if (!status) return "";
  if (status === "out_for_delivery") return "Delivering";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();

  // Core API Data Storage
  const [allOrders, setAllOrders] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [popularMeals, setPopularMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination Controller Configuration
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5; 

  useEffect(() => {
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };

        const ordersResponse = await fetch(
          `${baseUrl}/orders/chef/orders`,
          fetchOptions,
        );
        const ordersResult = await ordersResponse.json();

        if (ordersResponse.status === 401) {
          logout();
          throw new Error("Your login session has expired. Redirecting...");
        }

        if (
          ordersResponse.ok &&
          (ordersResult.success || Array.isArray(ordersResult))
        ) {
          const liveOrders =
            ordersResult.data ||
            (Array.isArray(ordersResult) ? ordersResult : []);
          setAllOrders(liveOrders);

          const totalRevenue = liveOrders.reduce(
            (acc, order) => acc + (order.totalAmount || 0),
            0,
          );
          const totalOrdersCount = liveOrders.length;
          const activeOrdersCount = liveOrders.filter(
            (o) =>
              o.status === "preparing" ||
              o.status === "out_for_delivery" ||
              o.status === "delivering",
          ).length;

          setMetrics([
            {
              id: "revenue",
              label: "Total Earnings",
              value: formatCurrency(totalRevenue),
              iconBg: "#FDF2EC",
              icon: DollarSign,
            },
            {
              id: "orders",
              label: "Total Orders",
              value: totalOrdersCount.toString(),
              iconBg: "#EAF7F3",
              icon: ShoppingBag,
            },
            {
              id: "active",
              label: "Active Orders",
              value: activeOrdersCount.toString(),
              iconBg: "#EBF3FE",
              icon: Clock,
            },
            {
              id: "rating",
              label: "Kitchen Rating",
              value: "4.8",
              suffix: "/ 5.0",
              trend: "0.3+",
              iconBg: "#FFF1DF",
              icon: Star,
              subtext: "(48 reviews)",
            },
          ]);

          const mealAggregator = {};
          liveOrders.forEach((order) => {
            order.items?.forEach((item) => {
              const key = item.name;
              if (!mealAggregator[key]) {
                mealAggregator[key] = {
                  id: item.mealId || Math.random().toString(),
                  name: item.name,
                  image: item.image || "/fallback-meal.jpg",
                  ordersThisMonth: 0,
                  price: item.unitPrice || 0,
                  tag: "Top Seller",
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
          throw new Error(
            ordersResult.message || "Failed to parse kitchen metrics.",
          );
        }
      } catch (err) {
        console.error("Dashboard Orders Load Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardOrders();
  }, [token, logout]);

  const totalPages = Math.ceil(allOrders.length / ORDERS_PER_PAGE) || 1;

  const indexOfLastOrder = currentPage * ORDERS_PER_PAGE;
  const indexOfFirstOrder = indexOfLastOrder - ORDERS_PER_PAGE;
  const currentDisplayedOrders = allOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-medium text-[#7A6560] animate-pulse">
          Loading kitchen insights...
        </p>
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
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#1E1410] sm:text-4xl lg:text-[42px]">
          Welcome back, Chef {user?.firstName || "Chef"}!
        </h1>
        <p className="mt-2 text-sm text-[#7A6560] sm:text-[15px]">
          Here&apos;s what&apos;s happening with your kitchen today.
        </p>
      </section>

      {/* Stats Cards Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.id}
              className="rounded-[20px] border border-[#EDE6E3] bg-white px-5 py-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: metric.iconBg }}
                >
                  <Icon size={20} strokeWidth={2} className="text-[#2D201B]" />
                </span>
                {metric.trend && (
                  <span className="text-[13px] font-bold text-[#2E8D71]">
                    ↑ {metric.trend}
                  </span>
                )}
              </div>

              <p className="mt-4 text-[13.5px] font-medium text-[#7A6560]">
                {metric.label}
              </p>

              <div className="mt-1 flex flex-col">
                <p className="text-[30px] font-extrabold leading-none tracking-tight text-[#1E1410] md:text-[36px]">
                  {metric.value}
                  {metric.suffix && (
                    <span className="ml-1.5 text-[13px] font-medium text-[#9E8880]">
                      {metric.suffix}
                    </span>
                  )}
                </p>

                {metric.subtext && (
                  <span className="mt-1.5 text-[12px] font-medium text-[#9E8880] tracking-wide">
                    {metric.subtext}
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {/* Main Content Layout Block */}
      <section className="grid gap-6 xl:grid-cols-[2.2fr_1fr]">
        {/* Recent Orders Component Container */}
        <div className="min-w-0 flex flex-col justify-between">
          <div>
            <div className="mb-3.5 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#1E1410] md:text-[28px]">
                Recent Orders
              </h2>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-[#EDE6E3] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-[700px] w-full">
                  <thead>
                    <tr className="border-b border-[#F2E9E5]">
                      {["Order ID", "Customer", "Meal", "Status", "Total"].map(
                        (heading) => (
                          <th
                            key={heading}
                            className="px-5 py-4 text-left text-[13.5px] font-semibold text-[#7A6560]"
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {currentDisplayedOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-5 py-8 text-center text-sm text-[#7A6560]"
                        >
                          No active orders tracked on this page window.
                        </td>
                      </tr>
                    ) : (
                      currentDisplayedOrders.map((order, index) => (
                        <tr
                          key={order._id}
                          className={
                            index !== currentDisplayedOrders.length - 1
                              ? "border-b border-[#F5EFEC]"
                              : ""
                          }
                        >
                          <td className="px-5 py-5 text-[14px] font-bold text-[#2E1F1A]">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-5 py-5 text-[14px] text-[#3F3531]">
                            {order.contactPhone || "Customer"}
                          </td>
                          <td className="px-5 py-5 text-[14px] text-[#3F3531]">
                            {order.items
                              ?.map(
                                (item) => `${item.name} (x${item.quantity})`,
                              )
                              .join(", ")}
                          </td>
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex rounded-full px-3.5 py-1.5 text-[12px] font-bold ${statusClassName(
                                formatStatusText(order.status),
                              )}`}
                            >
                              {formatStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-[14px] font-bold text-[#1E1410]">
                            {formatCurrency(order.totalAmount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1.5">
              {/* Prev Arrow */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-9 min-w-[36px] items-center justify-center rounded-lg border border-[#EDE6E3] bg-white px-2 text-sm font-semibold text-[#7A6560] transition hover:bg-[#FDF2EC]/50 disabled:opacity-40 disabled:hover:bg-white"
              >
                ←
              </button>

              {/* Dynamic Number Map */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#A0431E] text-white shadow-sm scale-105"
                        : "border border-[#EDE6E3] bg-white text-[#7A6560] hover:bg-[#FDF2EC]/40"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Arrow */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-9 min-w-[36px] items-center justify-center rounded-lg border border-[#EDE6E3] bg-white px-2 text-sm font-semibold text-[#7A6560] transition hover:bg-[#FDF2EC]/50 disabled:opacity-40 disabled:hover:bg-white"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Panel - Popular Meals Column */}
        <aside>
          <h2 className="mb-3.5 text-2xl font-extrabold tracking-tight text-[#1E1410] md:text-[28px]">
            Popular Meals
          </h2>

          <div className="flex flex-col gap-4">
            {popularMeals.length === 0 ? (
              <p className="text-sm text-[#7A6560] py-4">
                Data will populate as meals are ordered.
              </p>
            ) : (
              popularMeals.map((meal) => (
                <article
                  key={meal.id}
                  className="overflow-hidden rounded-[20px] border border-[#EDE6E3] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-[180px] md:h-[160px]">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    {meal.tag && (
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-[#FFF4EB] px-2.5 py-1 text-[11px] font-bold text-[#A0431E]">
                        {meal.tag}
                      </span>
                    )}
                  </div>

                  <div className="px-4 py-3.5">
                    <h3 className="text-[15px] font-bold text-[#1E1410]">
                      {meal.name}
                    </h3>
                    <div className="mt-1.5 flex items-center justify-between">
                      <p className="text-[12.5px] text-[#7A6560]">
                        {meal.ordersThisMonth} unit
                        {meal.ordersThisMonth > 1 ? "s" : ""} counted
                      </p>
                      <p className="text-[15.5px] font-extrabold text-[#A0431E]">
                        {formatCurrency(meal.price)}
                      </p>
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
