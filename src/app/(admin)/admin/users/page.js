"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  UserPlus,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Ban,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  Active: {
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  Banned: {
    badge: "bg-rose-50 text-rose-600 border border-rose-200",
    dot: "bg-rose-400",
  },
  Inactive: {
    badge: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
};

// ─── API Layer ────────────────────────────────────────────────────────────────
// Replace these functions with your real API calls.
// Expected shapes are documented inline.

async function fetchUsers({ page, pageSize, status, sortBy }) {
  // TODO: replace with real endpoint, :
  // const res = await fetch(
  //   `/api/admin/users?page=${page}&pageSize=${pageSize}&status=${status}&sortBy=${sortBy}`
  // );
  // if (!res.ok) throw new Error('Failed to fetch users');
  // return res.json();
  //
  // Expected response shape:
  // {
  //   users: [
  //     {
  //       id: string | number,
  //       name: string,
  //       location: string,
  //       email: string,
  //       joinDate: string,        // ISO date string or pre-formatted
  //       totalOrders: number,
  //       status: 'Active' | 'Banned' | 'Inactive',
  //       avatarUrl?: string,      // optional — falls back to initials
  //     }
  //   ],
  //   total: number,               // total records for pagination
  //   totalPages: number,
  // }

  // ── Fallback mock data (remove once API is wired up) ──
  await new Promise((r) => setTimeout(r, 600));
  const mock = [
    {
      id: 1,
      name: "Ahmed Khalil",
      location: "Cairo, EG",
      email: "ahmed.k@example.com",
      joinDate: "Oct 12, 2023",
      totalOrders: 24,
      status: "Active",
    },
    {
      id: 2,
      name: "Laila Mansour",
      location: "Alexandria, EG",
      email: "laila.m@domain.com",
      joinDate: "Nov 05, 2023",
      totalOrders: 8,
      status: "Active",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Laila",
    },
    {
      id: 3,
      name: "Omar Mahmoud",
      location: "Giza, EG",
      email: "omar88@webmail.net",
      joinDate: "Dec 01, 2023",
      totalOrders: 0,
      status: "Banned",
    },
    {
      id: 4,
      name: "Sarah Younis",
      location: "Mansoura, EG",
      email: "sarah.y@gmail.com",
      joinDate: "Jan 15, 2024",
      totalOrders: 15,
      status: "Active",
      avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Sarah",
    },
  ];
  return { users: mock, total: 128422, totalPages: 1284 };
}

async function fetchStats() {
  // TODO: replace with real endpoint, e.g.:
  // const res = await fetch('/api/admin/users/stats');
  // if (!res.ok) throw new Error('Failed to fetch stats');
  // return res.json();
  //
  // Expected response shape:
  // {
  //   totalUsers:    number,
  //   totalGrowth:   string,   // e.g. "+12%"
  //   activeToday:   number,
  //   newJoins24h:   number,
  //   newJoinExtra:  number,   // the "+N" overflow badge
  //   recentAvatars: string[], // array of avatar URLs for overlap stack
  //   reportsBans:   number,
  // }

  await new Promise((r) => setTimeout(r, 400));
  return {
    totalUsers: 12842,
    totalGrowth: "+12%",
    activeToday: 3205,
    newJoins24h: 48,
    newJoinExtra: 45,
    recentAvatars: [
      "https://api.dicebear.com/7.x/thumbs/svg?seed=Felix",
      "https://api.dicebear.com/7.x/thumbs/svg?seed=Mia",
      "https://api.dicebear.com/7.x/thumbs/svg?seed=Leo",
    ],
    reportsBans: 14,
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
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
];

function getAvatarColor(id) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ user }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 object-cover shrink-0"
      />
    );
  }
  const { bg, text } = getAvatarColor(user.id);
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${bg} ${text}`}
    >
      {getInitials(user.name)}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
      <div className="h-8 bg-slate-100 rounded animate-pulse w-20" />
      <div className="h-3 bg-slate-100 rounded animate-pulse w-32" />
    </div>
  );
}

function AnalyticsCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Users */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Total Users
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {stats.totalUsers.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={13} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">
            {stats.totalGrowth} from last month
          </span>
        </div>
      </div>

      {/* Active Today */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Active Today
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {stats.activeToday.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">
            All systems operational
          </span>
        </div>
      </div>

      {/* New Joins 24h */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          New Joins (24h)
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {stats.newJoins24h}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {stats.recentAvatars.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="w-6 h-6 rounded-full border-2 border-white bg-slate-100"
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            +{stats.newJoinExtra}
          </span>
        </div>
      </div>

      {/* Reports / Bans */}
      <div className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">
          Reports / Bans
        </p>
        <p className="text-3xl font-bold text-rose-600 leading-none">
          {stats.reportsBans}
        </p>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={13} className="text-rose-400" />
          <span className="text-xs text-rose-500 font-medium">
            Pending moderation review
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UsersManagement() {
  // ── Table state ──
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Stats state ──
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // ── Filter / pagination state ──
  const [activePage, setActivePage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");

  // ── Selection state ──
  const [selected, setSelected] = useState(new Set());

  // ── Fetch users ──
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelected(new Set());
    try {
      const data = await fetchUsers({
        page: activePage,
        pageSize: PAGE_SIZE,
        status: statusFilter,
        sortBy,
      });
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [activePage, statusFilter, sortBy]);

  // ── Fetch stats ──
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await fetchStats();
      setStats(data);
    } catch {
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ── Selection helpers ──
  const allIds = users.map((u) => u.id);
  const allChecked =
    allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someChecked = allIds.some((id) => selected.has(id));

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(allIds));
  };

  const toggleRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Pagination helpers ──
  const goToPage = (n) => {
    const clamped = Math.max(1, Math.min(totalPages, n));
    setActivePage(clamped);
  };

  const visiblePages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (activePage <= 3) return [1, 2, 3];
    if (activePage >= totalPages - 2)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [activePage - 1, activePage, activePage + 1];
  };

  const showStartEllipsis = activePage > 4 && totalPages > 5;
  const showEndEllipsis = activePage < totalPages - 3 && totalPages > 5;

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Users Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, monitor, and manage customer accounts for the Matbakhna
            platform.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={15} />
            Export CSV
          </button>
          <button
            className="flex items-center gap-2 text-sm font-semibold text-white rounded-lg px-4 py-2 transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: "#0f5c4e" }}
          >
            <UserPlus size={15} />
            Manual Registration
          </button>
        </div>
      </div>

      {/* ── Analytics Cards ── */}
      <AnalyticsCards stats={stats} loading={statsLoading} />

      {/* ── Filter Bar ── */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActivePage(1);
              }}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 transition-colors shadow-sm cursor-pointer focus:outline-none"
            >
              <option value="all">Status: All Users</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Sort filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setActivePage(1);
              }}
              className="appearance-none flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 transition-colors shadow-sm cursor-pointer focus:outline-none"
            >
              <option value="joinDate">Sorted by: Join Date</option>
              <option value="name">Sorted by: Name</option>
              <option value="orders">Sorted by: Orders</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Retry button shown on error */}
          {error && (
            <button
              onClick={loadUsers}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}

          {/* Bulk actions */}
          {selected.size > 0 && (
            <>
              <span className="text-sm font-medium text-slate-500">
                {selected.size} Selected
              </span>
              <button className="flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors">
                <Ban size={14} />
                Bulk Ban
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = someChecked && !allChecked;
                    }}
                    onChange={toggleAll}
                    disabled={loading || !!error}
                    className="w-4 h-4 rounded accent-amber-800 cursor-pointer disabled:opacity-40"
                  />
                </th>
                {[
                  "User Name",
                  "Email",
                  "Join Date",
                  "Total Orders",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Loading skeletons */}
              {loading &&
                [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Error state */}
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle size={28} className="text-rose-400" />
                      <p className="text-sm font-medium text-slate-600">
                        {error}
                      </p>
                      <button
                        onClick={loadUsers}
                        className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                        style={{ background: "#7c4a2d" }}
                      >
                        <RefreshCw size={14} />
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm font-medium text-slate-500">
                        No users found
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
                users.map((user) => {
                  const isChecked = selected.has(user.id);
                  const sc =
                    STATUS_CONFIG[user.status] ?? STATUS_CONFIG["Inactive"];
                  return (
                    <tr
                      key={user.id}
                      onClick={() => toggleRow(user.id)}
                      className={`transition-colors cursor-pointer ${
                        isChecked ? "bg-amber-50/60" : "hover:bg-slate-50/60"
                      }`}
                    >
                      <td
                        className="px-5 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRow(user.id)}
                          className="w-4 h-4 rounded accent-amber-800 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {user.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {user.joinDate}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                        {user.totalOrders} Orders
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          {user.status}
                        </span>
                      </td>

                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="View user"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            aria-label="Ban user"
                          >
                            <Ban size={15} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="More options"
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-400">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin" /> Loading...
              </span>
            ) : (
              <>
                Showing{" "}
                {Math.min(
                  (activePage - 1) * PAGE_SIZE + 1,
                  total,
                ).toLocaleString()}{" "}
                to {Math.min(activePage * PAGE_SIZE, total).toLocaleString()} of{" "}
                <span className="font-medium text-slate-600">
                  {total.toLocaleString()}
                </span>{" "}
                users
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

            {/* First page when not in visible range */}
            {showStartEllipsis && (
              <>
                <button
                  onClick={() => goToPage(1)}
                  className="w-7 h-7 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  1
                </button>
                <span className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">
                  ...
                </span>
              </>
            )}

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

            {/* Last page when not in visible range */}
            {showEndEllipsis && (
              <>
                <span className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">
                  ...
                </span>
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`w-14 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    activePage === totalPages
                      ? "text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  style={
                    activePage === totalPages ? { background: "#7c4a2d" } : {}
                  }
                >
                  {totalPages.toLocaleString()}
                </button>
              </>
            )}

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
