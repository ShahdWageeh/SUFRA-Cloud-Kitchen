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
  ShieldOff,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Loader } from "@/components/ui";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

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

// ─── Auth helper ──────────────────────────────────────────────────────────────

function getAuthHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("Sufra_token") || localStorage.getItem("jwt")
      : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Derive a display status from the customer object based on API docs */
function resolveStatus(customer) {
  if (customer.isBlocked === 1 || customer.status === "blocked")
    return "Banned";
  if (customer.status === "inactive") return "Inactive";
  return "Active";
}

const AVATAR_COLORS = [
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
];

function getAvatarColor(id) {
  const hash = String(id)
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
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
      <td colSpan={6} className="px-4 py-8">
        <div className="flex justify-center">
          <Loader />
        </div>
      </td>
    </tr>
  );
}

// ─── Analytics Cards Component ─────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-center h-[108px]">
      <Loader size={30} className="p-0" />
    </div>
  );
}

function AnalyticsCards({ customers, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const total = customers.length;
  const active = customers.filter((c) => resolveStatus(c) === "Active").length;
  const banned = customers.filter((c) => resolveStatus(c) === "Banned").length;

  const now = Date.now();
  const newToday = customers.filter((c) => {
    if (!c.createdAt) return false;
    return now - new Date(c.createdAt).getTime() < 86400000;
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Total Users
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {total.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <TrendingUp size={13} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">
            All registered customers
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Active Users
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {active.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">
            Not blocked
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          New Joins (24h)
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {newToday}
        </p>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-teal-500" />
          <span className="text-xs text-teal-600 font-medium">
            Joined in the last 24 hours
          </span>
        </div>
      </div>

      <div className="bg-rose-50 rounded-2xl border border-rose-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-400">
          Banned Users
        </p>
        <p className="text-3xl font-bold text-rose-600 leading-none">
          {banned}
        </p>
        <div className="flex items-center gap-1.5">
          <AlertTriangle size={13} className="text-rose-400" />
          <span className="text-xs text-rose-500 font-medium">
            Blocked accounts
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  open,
  isBanning,
  count,
  onConfirm,
  onCancel,
  loading,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center gap-3 mb-4">
          {isBanning ? (
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
              <Ban size={20} className="text-rose-500" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-emerald-500" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-slate-800">
              {isBanning ? "Ban" : "Unban"} {count} user{count !== 1 ? "s" : ""}
              ?
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBanning
                ? "They will lose access to the platform immediately."
                : "They will regain access to the platform."}
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2 ${
              isBanning ? "bg-rose-500" : "bg-emerald-500"
            }`}
          >
            {loading && <Loader size={13} className="p-0" />}
            {isBanning ? "Yes, Ban" : "Yes, Unban"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UsersManagement() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Guard against hydration mismatch state differences
  const [mounted, setMounted] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");
  const [searchQuery, setSearchQuery] = useState("");

  const [selected, setSelected] = useState(new Set());

  const [modal, setModal] = useState({
    open: false,
    userIds: [],
    isBanning: true,
  });
  const [banLoading, setBanLoading] = useState(false);

  // ── Fetch all customers ───────────────────────────────────────────────────
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelected(new Set());
    try {
      const res = await fetch(`${BASE_URL}/users/customers`, {
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setAllCustomers(json.data || []);
      } else {
        setError(json.message || "Failed to load customers.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadCustomers();
  }, [loadCustomers]);

  // ── Toggle block for ONE user via API ─────────────────────────────────────
  const toggleBlockUser = async (userId) => {
    const res = await fetch(
      `${BASE_URL}/users/customers/${userId}/toggle-block`,
      { method: "PATCH", headers: getAuthHeaders() },
    );
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Action failed.");
    return json.data;
  };

  // ── Open ban modal for single user ───────────────────────────────────────
  const openSingleBanModal = (user, e) => {
    e.stopPropagation();
    const isBanning = resolveStatus(user) !== "Banned";
    setModal({ open: true, userIds: [user._id], isBanning });
  };

  // ── Open ban modal for bulk selection ────────────────────────────────────
  const openBulkBanModal = () => {
    const ids = [...selected];
    const anyActive = ids.some((id) => {
      const u = allCustomers.find((c) => c._id === id);
      return u && resolveStatus(u) !== "Banned";
    });
    setModal({ open: true, userIds: ids, isBanning: anyActive });
  };

  // ── Confirm ban/unban ─────────────────────────────────────────────────────
  const handleConfirmBan = async () => {
    setBanLoading(true);
    try {
      const results = await Promise.allSettled(
        modal.userIds.map((id) => toggleBlockUser(id)),
      );

      setAllCustomers((prev) => {
        const updated = [...prev];
        results.forEach((result, i) => {
          if (result.status === "fulfilled") {
            const idx = updated.findIndex((c) => c._id === modal.userIds[i]);
            if (idx !== -1) updated[idx] = result.value;
          }
        });
        return updated;
      });

      setSelected(new Set());
      setModal({ open: false, userIds: [], isBanning: true });
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setBanLoading(false);
    }
  };

  // ── Client-side filter + search + sort ────────────────────────────────────
  const filteredCustomers = allCustomers
    .filter((c) => {
      if (statusFilter !== "all" && resolveStatus(c) !== statusFilter) {
        return false;
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const firstName = (c.firstName || "").toLowerCase();
        const lastName = (c.lastName || "").toLowerCase();
        const email = (c.email || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        const fullName = `${firstName} ${lastName}`;

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          fullName.includes(query) ||
          email.includes(query) ||
          phone.includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        );
      }
      if (sortBy === "joinDate") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / PAGE_SIZE),
  );
  const safePage = Math.min(activePage, totalPages);
  const pageCustomers = filteredCustomers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const goToPage = (n) => setActivePage(Math.max(1, Math.min(totalPages, n)));

  const visiblePages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3];
    if (safePage >= totalPages - 2)
      return [totalPages - 2, totalPages - 1, totalPages];
    return [safePage - 1, safePage, safePage + 1];
  };

  const showStartEllipsis = safePage > 4 && totalPages > 5;
  const showEndEllipsis = safePage < totalPages - 3 && totalPages > 5;

  // ── Selection ─────────────────────────────────────────────────────────────
  const pageIds = pageCustomers.map((u) => u._id);
  const allChecked =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  const toggleAll = () =>
    setSelected(allChecked ? new Set() : new Set(pageIds));

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="w-full">
      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={modal.open}
        isBanning={modal.isBanning}
        count={modal.userIds.length}
        onConfirm={handleConfirmBan}
        onCancel={() => setModal({ open: false, userIds: [], isBanning: true })}
        loading={banLoading}
      />

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
        {/* <div className="flex items-center gap-2 shrink-0">
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
        </div> */}
      </div>

      {/* ── Analytics Cards ── */}
      <AnalyticsCards customers={allCustomers} loading={loading} />

      {/* ── Filter & Search Bar ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search Input */}
          <div className="relative w-full max-w-xs shrink-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActivePage(1);
              }}
              className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 placeholder-slate-400 focus:outline-none focus:border-slate-300 transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActivePage(1);
              }}
              className="appearance-none text-sm text-slate-600 bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 transition-colors shadow-sm cursor-pointer focus:outline-none"
            >
              <option value="all">Status: All</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setActivePage(1);
              }}
              className="appearance-none text-sm text-slate-600 bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 transition-colors shadow-sm cursor-pointer focus:outline-none"
            >
              <option value="joinDate">Sort: Join Date</option>
              <option value="name">Sort: Name</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
          {error && (
            <button
              onClick={loadCustomers}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RefreshCw size={14} /> Retry
            </button>
          )}
          {selected.size > 0 && (
            <>
              <span className="text-sm font-medium text-slate-500">
                {selected.size} Selected
              </span>
              <button
                onClick={openBulkBanModal}
                className="flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors"
              >
                <Ban size={14} /> Bulk Ban / Unban
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
                {["User", "Email", "Joined", "Status", "Actions"].map((h) => (
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
              {loading &&
                [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading && error && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle size={28} className="text-rose-400" />
                      <p className="text-sm font-medium text-slate-600">
                        {error}
                      </p>
                      <button
                        onClick={loadCustomers}
                        className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90"
                        style={{ background: "#7c4a2d" }}
                      >
                        <RefreshCw size={14} /> Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      No users found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your search criteria or filters.
                    </p>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                pageCustomers.map((customer) => {
                  const status = resolveStatus(customer);
                  const sc = STATUS_CONFIG[status] ?? STATUS_CONFIG["Inactive"];
                  const isChecked = selected.has(customer._id);
                  const isBanned = status === "Banned";
                  const displayName =
                    `${customer.firstName || ""} ${customer.lastName || ""}`.trim();

                  const user = {
                    id: customer._id,
                    name: displayName,
                    avatarUrl: customer.avatarUrl || null,
                  };

                  return (
                    <tr
                      key={customer._id}
                      onClick={() => toggleRow(customer._id)}
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
                          onChange={() => toggleRow(customer._id)}
                          className="w-4 h-4 rounded accent-amber-800 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {displayName || "—"}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {customer.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {customer.email || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(customer.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          {status}
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
                            onClick={(e) => openSingleBanModal(customer, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBanned
                                ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                            }`}
                            aria-label={isBanned ? "Unban user" : "Ban user"}
                            title={isBanned ? "Unban user" : "Ban user"}
                          >
                            {isBanned ? (
                              <ShieldCheck size={15} />
                            ) : (
                              <ShieldOff size={15} />
                            )}
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
                <Loader size={12} className="p-0" /> Loading...
              </span>
            ) : (
              <>
                Showing{" "}
                {filteredCustomers.length === 0
                  ? 0
                  : ((safePage - 1) * PAGE_SIZE + 1).toLocaleString()}{" "}
                –{" "}
                {Math.min(
                  safePage * PAGE_SIZE,
                  filteredCustomers.length,
                ).toLocaleString()}{" "}
                of{" "}
                <span className="font-medium text-slate-600">
                  {filteredCustomers.length.toLocaleString()}
                </span>{" "}
                users
              </>
            )}
          </p>

          <div className="flex items-center gap-1">
            <button
              disabled={!mounted || safePage === 1 || loading}
              onClick={() => goToPage(safePage - 1)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>

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
                  safePage === n
                    ? "text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                style={safePage === n ? { background: "#7c4a2d" } : {}}
              >
                {n}
              </button>
            ))}

            {showEndEllipsis && (
              <>
                <span className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">
                  ...
                </span>
                <button
                  onClick={() => goToPage(totalPages)}
                  className={`w-10 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    safePage === totalPages
                      ? "text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  style={
                    safePage === totalPages ? { background: "#7c4a2d" } : {}
                  }
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              disabled={!mounted || safePage === totalPages || loading}
              onClick={() => goToPage(safePage + 1)}
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
