"use client";

import { useState, useEffect, useCallback } from "react";
import {
  SlidersHorizontal,
  MoreVertical,
  Pencil,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Package,
} from "lucide-react";
import { Loader } from "@/components/ui";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  NEW: {
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  "IN PROGRESS": {
    badge: "bg-teal-50 text-teal-700 border border-teal-200",
    dot: "bg-teal-400",
  },
  COMPLETED: {
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
  CANCELLED: {
    badge: "bg-rose-50 text-rose-600 border border-rose-200",
    dot: "bg-rose-400",
  },
};

const ROW_ACTION = {
  NEW: { icon: MoreVertical, label: "Options" },
  "IN PROGRESS": { icon: Pencil, label: "Edit order" },
  COMPLETED: { icon: Eye, label: "View order" },
  CANCELLED: { icon: Info, label: "Order info" },
};

// ─── API Layer ────────────────────────────────────────────────────────────────


async function fetchOrders({ page, pageSize, status, dateRange, chef }) {
  // TODO: replace with real endpoint
  // const params = new URLSearchParams({ page, pageSize, status, dateRange, chef });
  // const res = await fetch(`/api/admin/orders?${params}`);
  // if (!res.ok) throw new Error('Failed to fetch orders');
  // return res.json();

  await new Promise((r) => setTimeout(r, 650));
  const mock = [
    {
      id: "#MK-8821",
      customer: { name: "James Smith" },
      chef: "Chef Laila's Kitchen",
      datetime: "Today, 12:45 PM",
      amount: "$45.50",
      status: "NEW",
    },
    {
      id: "#MK-8819",
      customer: {
        name: "Sarah Connor",
        avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Sarah",
      },
      chef: "Grandma's Flavors",
      datetime: "Today, 11:30 AM",
      amount: "$112.00",
      status: "IN PROGRESS",
    },
    {
      id: "#MK-8815",
      customer: { name: "Michael Brown" },
      chef: "Spices of Nile",
      datetime: "Yesterday, 08:20 PM",
      amount: "$28.90",
      status: "COMPLETED",
    },
    {
      id: "#MK-8802",
      customer: { name: "David Wilson" },
      chef: "Chef Laila's Kitchen",
      datetime: "Yesterday, 06:15 PM",
      amount: "$55.00",
      status: "CANCELLED",
    },
  ];
  return { orders: mock, total: 156, totalPages: 16 };
}

async function fetchMetrics() {
  // TODO: replace with real endpoint
  // const res = await fetch('/api/admin/orders/metrics');
  // if (!res.ok) throw new Error('Failed to fetch metrics');
  // return res.json();

  await new Promise((r) => setTimeout(r, 400));
  return {
    newCount: 12,
    inProgressCount: 28,
    deliveredCount: 142,
    totalRevenue: "$4.2k",
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const AVATAR_COLORS = [
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];

function avatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomerAvatar({ customer }) {
  if (customer.avatarUrl) {
    return (
      <img
        src={customer.avatarUrl}
        alt={customer.name}
        className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
      />
    );
  }
  const { bg, text } = avatarColor(customer.name);
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${bg} ${text}`}
    >
      {getInitials(customer.name)}
    </div>
  );
}

function MetricWidget({ label, value, valueClass }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm min-w-[100px]">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none mb-1">
          {label}
        </p>
        <p className={`text-xl font-bold leading-none ${valueClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm min-w-[100px] flex items-center justify-center h-[54px]">
      <Loader size={20} className="p-0" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      <td colSpan={7} className="px-5 py-8">
        <div className="flex justify-center">
          <Loader />
        </div>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveOrdersControl() {
  // ── Orders state ──
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Metrics state ──
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // ── Filter state ──
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [chefFilter, setChefFilter] = useState("");

  // ── Applied filter state 
  const [applied, setApplied] = useState({
    status: "",
    dateRange: "",
    chef: "",
  });

  // ── Pagination ──
  const [activePage, setActivePage] = useState(1);

  // ── Fetch orders ──
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders({
        page: activePage,
        pageSize: PAGE_SIZE,
        status: applied.status,
        dateRange: applied.dateRange,
        chef: applied.chef,
      });
      setOrders(data.orders);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [activePage, applied]);

  // ── Fetch metrics ──
  const loadMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const data = await fetchMetrics();
      setMetrics(data);
    } catch {
      // non-critical
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // ── Handlers ──
  const handleApply = (e) => {
    e.preventDefault();
    setActivePage(1);
    setApplied({ status: statusFilter, dateRange, chef: chefFilter });
  };

  const goToPage = (n) => setActivePage(Math.max(1, Math.min(totalPages, n)));

  const visiblePages = () => {
    if (totalPages <= 3)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (activePage === 1) return [1, 2, 3];
    if (activePage >= totalPages)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [activePage - 1, activePage, activePage + 1];
  };

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-400 mb-1">
            Admin &rsaquo; Orders Management
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Live Orders Control
          </h1>
        </div>

        {/* Metric widgets */}
        <div className="flex items-center gap-2 flex-wrap">
          {metricsLoading ? (
            [1, 2, 3, 4].map((i) => <MetricSkeleton key={i} />)
          ) : metrics ? (
            <>
              <MetricWidget
                label="New"
                value={metrics.newCount}
                valueClass="text-amber-700"
              />
              <MetricWidget
                label="In Progress"
                value={metrics.inProgressCount}
                valueClass="text-teal-600"
              />
              <MetricWidget
                label="Delivered"
                value={metrics.deliveredCount}
                valueClass="text-slate-500"
              />
              <MetricWidget
                label="Total Rev."
                value={metrics.totalRevenue}
                valueClass="text-slate-900"
              />
            </>
          ) : null}
        </div>
      </div>

      {/* ── Filter Panel ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <form onSubmit={handleApply}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="IN PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date Range
              </label>
              <input
                type="date"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>

            {/* Chef */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Chef
              </label>
              <div className="relative">
                <select
                  value={chefFilter}
                  onChange={(e) => setChefFilter(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
                >
                  <option value="">All Chefs</option>
                  <option value="chef-laila">Chef Laila's Kitchen</option>
                  <option value="grandma-flavors">Grandma's Flavors</option>
                  <option value="spices-nile">Spices of Nile</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider opacity-0 select-none">
                &nbsp;
              </label>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-sm rounded-lg px-4 py-2 transition-colors"
              >
                <SlidersHorizontal size={15} />
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {[
                  "Order ID",
                  "Customer",
                  "Chef",
                  "Date & Time",
                  "Total Amount",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Loading */}
              {loading &&
                [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Error */}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle size={28} className="text-rose-400" />
                      <p className="text-sm font-medium text-slate-600">
                        {error}
                      </p>
                      <button
                        onClick={loadOrders}
                        className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                        style={{ background: "#7c4a2d" }}
                      >
                        <RefreshCw size={14} />
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && !error && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package size={28} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">
                        No orders found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                !error &&
                orders.map((order) => {
                  const sc =
                    STATUS_CONFIG[order.status] ?? STATUS_CONFIG["COMPLETED"];
                  const act =
                    ROW_ACTION[order.status] ?? ROW_ACTION["COMPLETED"];
                  const ActionIcon = act.icon;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4">
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#7c4a2d" }}
                        >
                          {order.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <CustomerAvatar customer={order.customer} />
                          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                            {order.customer.name}
                          </span>
                        </div>
                      </td>

                      {/* Chef */}
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {order.chef}
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {order.datetime}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {order.amount}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${sc.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          aria-label={act.label}
                        >
                          <ActionIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-slate-500">
            {loading ? (
              <span className="flex items-center gap-1.5 text-xs">
                <Loader size={12} className="p-0" /> Loading…
              </span>
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1}–
                  {Math.min(activePage * PAGE_SIZE, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {total.toLocaleString()}
                </span>{" "}
                orders
              </>
            )}
          </p>

          <div className="flex items-center gap-1">
            <button
              disabled={activePage === 1 || loading}
              onClick={() => goToPage(activePage - 1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

            {visiblePages().map((n) => (
              <button
                key={n}
                onClick={() => goToPage(n)}
                disabled={loading}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                  activePage === n
                    ? "text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                style={activePage === n ? { background: "#7c4a2d" } : {}}
              >
                {n}
              </button>
            ))}

            <button
              disabled={activePage === totalPages || loading}
              onClick={() => goToPage(activePage + 1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
