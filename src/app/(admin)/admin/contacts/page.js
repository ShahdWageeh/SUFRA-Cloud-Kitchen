"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { contactService } from "@/services";
import { Loader } from "@/components/ui";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  finished: {
    label: "Finished",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
};

function extractMessages(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
  const hash = String(id)
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function SenderAvatar({ message }) {
  const { bg, text } = getAvatarColor(message._id);
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${bg} ${text}`}
    >
      {getInitials(message.fullName)}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      <td colSpan={6} className="px-4 py-12">
        <div className="flex justify-center">
          <Loader />
        </div>
      </td>
    </tr>
  );
}

function StatsCards({ messages, loading }) {
  const stats = useMemo(() => {
    const total = messages.length;
    const pending = messages.filter((m) => m.status === "pending").length;
    const finished = messages.filter((m) => m.status === "finished").length;
    return { total, pending, finished };
  }, [messages]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Total Messages
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {stats.total.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <MessageSquare size={13} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">
            All contact inquiries
          </span>
        </div>
      </div>

      <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
          Pending
        </p>
        <p className="text-3xl font-bold text-amber-700 leading-none">
          {stats.pending.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-amber-500" />
          <span className="text-xs text-amber-600 font-medium">
            Awaiting response
          </span>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col gap-3 col-span-2 lg:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
          Finished
        </p>
        <p className="text-3xl font-bold text-emerald-700 leading-none">
          {stats.finished.toLocaleString()}
        </p>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">
            Resolved inquiries
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageDetailModal({ message, onClose, onMarkFinished, marking }) {
  if (!message) return null;

  const sc = STATUS_CONFIG[message.status] ?? STATUS_CONFIG.pending;
  const role =
    message.senderRole || message.role || message.userRole || "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {message.subject}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Received {formatDate(message.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <SenderAvatar message={message} />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {message.fullName}
              </p>
              <a
                href={`mailto:${message.email}`}
                className="text-xs text-primary hover:underline"
              >
                {message.email}
              </a>
            </div>
            <span
              className={`ml-auto inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Sender Role
              </p>
              <p className="text-slate-700 capitalize mt-0.5">{role}</p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Message ID
              </p>
              <p className="text-slate-500 font-mono text-xs mt-0.5 truncate">
                {message._id}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Message
            </p>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap rounded-lg bg-slate-50 p-4">
              {message.message}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          {message.status === "pending" && (
            <button
              onClick={() => onMarkFinished(message._id)}
              disabled={marking}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#7c4a2d" }}
            >
              {marking ? (
                <Loader size={14} className="p-0" />
              ) : (
                <CheckCircle size={14} />
              )}
              Mark as Finished
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactsManagement() {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [markingId, setMarkingId] = useState(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getMessages();
      if (result.success !== false) {
        setAllMessages(extractMessages(result));
      } else {
        setError(result.message || "Failed to load messages.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (typeof window === "undefined" || allMessages.length === 0) return;

    const entityId = new URLSearchParams(window.location.search).get("entity");
    if (!entityId) return;

    const message = allMessages.find((item) => item._id === entityId);
    if (message) queueMicrotask(() => setSelectedMessage(message));
  }, [allMessages]);

  const handleMarkFinished = async (messageId) => {
    setMarkingId(messageId);
    try {
      const result = await contactService.markAsFinished(messageId);
      if (result.success !== false) {
        const updated = result.data || { _id: messageId, status: "finished" };
        setAllMessages((prev) =>
          prev.map((m) =>
            m._id === messageId ? { ...m, ...updated, status: "finished" } : m,
          ),
        );
        setSelectedMessage((prev) =>
          prev?._id === messageId ? { ...prev, status: "finished" } : prev,
        );
        toast.success("Message marked as finished");
      } else {
        toast.error(result.message || "Failed to update message");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update message status",
      );
    } finally {
      setMarkingId(null);
    }
  };

  const filteredMessages = allMessages
    .filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          (m.fullName || "").toLowerCase().includes(query) ||
          (m.email || "").toLowerCase().includes(query) ||
          (m.subject || "").toLowerCase().includes(query) ||
          (m.message || "").toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMessages.length / PAGE_SIZE),
  );
  const safePage = Math.min(activePage, totalPages);
  const pageMessages = filteredMessages.slice(
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

  return (
    <div className="w-full">
      <MessageDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onMarkFinished={handleMarkFinished}
        marking={markingId === selectedMessage?._id}
      />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Contact Messages
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and respond to support inquiries from customers and chefs.
          </p>
        </div>
        <button
          onClick={loadMessages}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 shrink-0"
        >
          {loading ? (
            <Loader size={16} className="p-0" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      <StatsCards messages={allMessages} loading={loading} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          <div className="relative w-full max-w-xs shrink-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, email, subject..."
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
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {["Sender", "Subject", "Role", "Date", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                    >
                      {h}
                    </th>
                  ),
                )}
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
                        onClick={loadMessages}
                        className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90"
                        style={{ background: "#7c4a2d" }}
                      >
                        <RefreshCw size={14} /> Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Mail size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-500">
                      No messages found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {allMessages.length === 0
                        ? "Contact submissions will appear here."
                        : "Try adjusting your search or filters."}
                    </p>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                pageMessages.map((message) => {
                  const sc =
                    STATUS_CONFIG[message.status] ?? STATUS_CONFIG.pending;
                  const role =
                    message.senderRole ||
                    message.role ||
                    message.userRole ||
                    "—";
                  const isMarking = markingId === message._id;

                  return (
                    <tr
                      key={message._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <SenderAvatar message={message} />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {message.fullName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {message.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700 font-medium line-clamp-1">
                          {message.subject}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {message.message}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 capitalize">
                          <User size={12} />
                          {role}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {formatDate(message.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          {sc.label}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSelectedMessage(message)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="View message"
                          >
                            <Eye size={15} />
                          </button>

                          {message.status === "pending" && (
                            <button
                              onClick={() => handleMarkFinished(message._id)}
                              disabled={isMarking}
                              className="p-1.5 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                              aria-label="Mark as finished"
                              title="Mark as finished"
                            >
                              {isMarking ? (
                                <Loader size={15} className="p-0" />
                              ) : (
                                <CheckCircle size={15} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-400">
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader size={12} className="p-0" /> Loading...
              </span>
            ) : (
              <>
                Showing{" "}
                {filteredMessages.length === 0
                  ? 0
                  : ((safePage - 1) * PAGE_SIZE + 1).toLocaleString()}{" "}
                –{" "}
                {Math.min(
                  safePage * PAGE_SIZE,
                  filteredMessages.length,
                ).toLocaleString()}{" "}
                of{" "}
                <span className="font-medium text-slate-600">
                  {filteredMessages.length.toLocaleString()}
                </span>{" "}
                messages
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
