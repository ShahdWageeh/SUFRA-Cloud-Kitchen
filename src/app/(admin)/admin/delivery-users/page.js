"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Ban,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Truck,
  Users,
  ShieldCheck,
  ShieldOff,
  Phone,
  Mail,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { Loader } from "@/components/ui";
import { adminDeliveryService } from "@/services";
import toast from "react-hot-toast";

const PAGE_SIZE = 5;

const STATUS_CONFIG = {
  active: {
    badge: "bg-teal-50 text-teal-700 border border-teal-200",
    dot: "bg-teal-500",
    text: "Active",
  },
  blocked: {
    badge: "bg-rose-50 text-rose-600 border border-rose-200",
    dot: "bg-rose-400",
    text: "Blocked",
  },
  inactive: {
    badge: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
    text: "Inactive",
  },
};

// ── Analytics Cards ─────────────────────────────────────────────────────────

function AnalyticsCards({ users, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 h-28 bg-white border border-slate-100 flex items-center justify-center"
          >
            <Loader size={30} />
          </div>
        ))}
      </div>
    );
  }

  const total = users.length;
  const active = users.filter((u) => u.status === "active").length;
  const blocked = users.filter((u) => u.status === "blocked").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: "#7c3a2d" }}
      >
        <div className="flex items-center justify-between">
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">
            Total
          </span>
          <Users size={16} className="text-white/60" />
        </div>
        <div>
          <p className="text-4xl font-bold text-white leading-none">{total}</p>
          <p className="text-sm text-white/70 mt-1.5 font-medium">
            Delivery Personnel
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-teal-50 border border-teal-100">
        <div className="flex items-center justify-between">
          <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={11} /> Active
          </span>
          <Truck size={16} className="text-teal-600/50" />
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-900 leading-none">
            {active}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Available Users
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-rose-50 border border-rose-100">
        <div className="flex items-center justify-between">
          <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Ban size={11} /> Blocked
          </span>
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-900 leading-none">
            {blocked}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Restricted Access
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Modals ──────────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = "danger", loading }) {
  if (!isOpen) return null;
  const isDanger = type === "danger";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2 ${
            isDanger ? "bg-rose-500" : "bg-[#7c3a2d]"
          }`}
        >
          {loading && <Loader size={14} className="p-0" />}
          {isDanger ? "Confirm Delete" : "Confirm Action"}
        </button>
      </div>
    </Modal>
  );
}

// ── Main Page Component ─────────────────────────────────────────────────────

export default function DeliveryUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, type: "" });
  const [actionLoading, setActionLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminDeliveryService.getAllDeliveryUsers();
      setUsers(response?.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load delivery users. Please try again.");
      toast.error("Could not fetch delivery personnel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      await adminDeliveryService.createDeliveryUser(formData);
      toast.success("Delivery user created successfully!");
      setIsAddModalOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "" });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create user.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAction = async () => {
    if (!confirmData.id) return;
    try {
      setActionLoading(true);
      if (confirmData.type === "delete") {
        await adminDeliveryService.deleteDeliveryUser(confirmData.id);
        toast.success("User deleted successfully.");
      } else {
        await adminDeliveryService.toggleDeliveryUserStatus(confirmData.id);
        toast.success("User status updated.");
      }
      setIsConfirmModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openConfirm = (id, type) => {
    setConfirmData({ id, type });
    setIsConfirmModalOpen(true);
  };

  // ── Filtering & Pagination ──
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.includes(q)
      );
    });
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredUsers.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);

  if (loading && users.length === 0) return <Loader fullPage={true} />;

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Delivery Users Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your delivery team, add new members, and monitor their status.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-[#7c3a2d] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 shadow-sm self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Delivery User
        </button>
      </div>

      {/* ── Analytics ── */}
      <AnalyticsCards users={users} loading={loading} />

      {/* ── Table Container ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActivePage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3a2d]/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {["#", "User Details", "Contact Info", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    {error ? (
                      <div className="flex flex-col items-center gap-2 text-rose-500">
                        <p>{error}</p>
                        <button onClick={fetchUsers} className="text-xs font-bold underline">Retry</button>
                      </div>
                    ) : (
                      "No delivery users found."
                    )}
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const status = user.status || "inactive";
                  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.inactive;
                  const rowNum = (activePage - 1) * PAGE_SIZE + idx + 1;
                  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 w-10">
                        <span className="text-xs font-medium text-slate-400">{rowNum}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#7c3a2d]/10 text-[#7c3a2d] flex items-center justify-center font-bold text-xs shrink-0">
                            {initials || <Truck size={16} />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">ID: {user._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail size={12} className="text-slate-300" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={12} className="text-slate-300" />
                            {user.phone || "No phone"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* <button
                            onClick={() => openConfirm(user._id, "toggle")}
                            className={`p-2 rounded-lg transition-all ${
                              status === "blocked"
                                ? "text-emerald-500 hover:bg-emerald-50"
                                : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                            }`}
                            title={status === "blocked" ? "Activate User" : "Block User"}
                          >
                            {status === "blocked" ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
                          </button> */}
                          <button
                            onClick={() => openConfirm(user._id, "delete")}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{paginatedUsers.length}</span> of <span className="font-semibold text-slate-600">{filteredUsers.length}</span> users
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={activePage === 1}
              onClick={() => setActivePage(p => p - 1)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-slate-600 w-8 text-center">{activePage} / {totalPages}</span>
            <button
              disabled={activePage === totalPages}
              onClick={() => setActivePage(p => p + 1)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Delivery Personnel"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
              <input
                required
                type="text"
                placeholder="John"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7c3a2d]/20 outline-none"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
              <input
                required
                type="text"
                placeholder="Doe"
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7c3a2d]/20 outline-none"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
            <input
              required
              type="email"
              placeholder="delivery@example.com"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7c3a2d]/20 outline-none"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
            <input
              required
              type="tel"
              placeholder="01234567890"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7c3a2d]/20 outline-none"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7c3a2d]/20 outline-none"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={actionLoading}
            className="w-full bg-[#7c3a2d] text-white py-3 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 mt-2"
          >
            {actionLoading ? <Loader size={16} className="p-0" /> : <Plus size={16} />}
            Create Delivery Account
          </button>
        </form>
      </Modal>

      {/* ── Confirm Action Modal ── */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleAction}
        loading={actionLoading}
        title={confirmData.type === "delete" ? "Delete User" : "Update Status"}
        message={
          confirmData.type === "delete"
            ? "Are you sure you want to permanently delete this delivery user? This action cannot be undone."
            : "Are you sure you want to toggle the status of this delivery user?"
        }
        type={confirmData.type === "delete" ? "danger" : "primary"}
      />
    </div>
  );
}
