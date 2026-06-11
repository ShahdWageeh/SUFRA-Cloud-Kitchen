"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  ChevronDown,
  Eye,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  X,
  Users,
} from "lucide-react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const CHEFS_PER_PAGE = 5;

const STATUS_CONFIG = {
  verified: {
    badge: "bg-teal-50 text-teal-700 border border-teal-200",
    dot: "bg-teal-500",
    text: "Verified",
  },
  unverified: {
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
    text: "Unverified",
  },
};

function AnalyticsCards({ chefs, loadingStats }) {
  const totalChefs = chefs.length;
  const pendingCount = chefs.filter((c) => !c.isVerified).length;
  const verifiedCount = chefs.filter((c) => c.isVerified).length;

  if (loadingStats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 h-28 bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: "#7c3a2d" }}
      >
        <div className="flex items-center justify-between">
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">
            Unverified
          </span>
          <Clock size={16} className="text-white/60" />
        </div>
        <div>
          <p className="text-4xl font-bold text-white leading-none">
            {pendingCount}
          </p>
          <p className="text-sm text-white/70 mt-1.5 font-medium">
            Pending Approvals
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-amber-50 border border-amber-100">
        <div className="flex items-center justify-between">
          <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={11} /> Total
          </span>
          <Users size={16} className="text-slate-400" />
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-900 leading-none">
            {totalChefs}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Registered Chefs
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-teal-50 border border-teal-100">
        <div className="flex items-center justify-between">
          <span className="bg-teal-100 text-teal-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={11} /> Active
          </span>
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-900 leading-none">
            {verifiedCount}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Verified Chefs
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChefsManagement() {
  const [chefs, setChefs] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filter States ──
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'verified' | 'unverified'
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getAuthHeaders = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/chefs`, { method: "GET" });
      const result = await res.json();
      if (result.success) setChefs(result.data);
      else setError(result.message || "Failed to retrieve chefs.");
    } catch {
      setError("An unexpected error occurred while loading chefs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationRequests = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch(`${BASE_URL}/verification-request/pending`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const result = await res.json();
      if (result.success) setVerificationRequests(result.data);
    } catch {
      // Fail silently
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchChefs();
    fetchVerificationRequests();

    // Close status dropdown if clicking outside the wrapper
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleVerification = async (chefId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/chefs/${chefId}/toggle-verification`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );
      const result = await res.json();
      if (result.success) {
        setChefs((prev) =>
          prev.map((chef) =>
            chef._id === chefId
              ? { ...chef, isVerified: !chef.isVerified }
              : chef,
          ),
        );
      } else {
        alert(result.message || "Action unauthorized or failed.");
      }
    } catch {
      alert("Error reaching the network. Please verify authentication.");
    }
  };

  // ── Combined Search and Dropdown Filtering ──
  const filteredChefs = useMemo(() => {
    return chefs.filter((chef) => {
      // 1. Evaluate Verification Status Rule
      if (activeFilter === "verified" && !chef.isVerified) return false;
      if (activeFilter === "unverified" && chef.isVerified) return false;

      // 2. Evaluate Text Search String Rule
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      const fullName =
        `${chef.firstName || ""} ${chef.lastName || ""}`.toLowerCase();
      const kitchen = (chef.kitchenName || "").toLowerCase();
      const email = (chef.email || "").toLowerCase();

      return fullName.includes(q) || kitchen.includes(q) || email.includes(q);
    });
  }, [chefs, searchQuery, activeFilter]);

  // Reset to page 1 when search strings or filters change
  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, activeFilter]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(filteredChefs.length / CHEFS_PER_PAGE),
  );
  const safePage = Math.min(activePage, totalPages);
  const paginatedChefs = filteredChefs.slice(
    (safePage - 1) * CHEFS_PER_PAGE,
    safePage * CHEFS_PER_PAGE,
  );
  const startIndex =
    filteredChefs.length === 0 ? 0 : (safePage - 1) * CHEFS_PER_PAGE + 1;
  const endIndex = Math.min(safePage * CHEFS_PER_PAGE, filteredChefs.length);

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (safePage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (safePage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        safePage - 1,
        safePage,
        safePage + 1,
        "...",
        totalPages,
      );
    }
    return pages;
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setActivePage(page);
  };

  // Convert label string dynamically based on filter choice
  const getFilterButtonLabel = () => {
    if (activeFilter === "verified") return "Status: Verified";
    if (activeFilter === "unverified") return "Status: Unverified";
    return "All Statuses";
  };

  if (loading)
    return <div className="p-6 text-slate-600">Loading Chefs data...</div>;
  if (error)
    return (
      <div className="p-6 text-rose-600 font-semibold">Error: {error}</div>
    );

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Chefs Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, and manage home chefs in your community.
          </p>
        </div>

        {/* Functional Filter Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-4 py-2 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm focus:outline-none"
          >
            {getFilterButtonLabel()}
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${activeFilter === "all" ? "bg-slate-50 text-[#7c3a2d] font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
              >
                All Statuses
              </button>
              <button
                onClick={() => {
                  setActiveFilter("verified");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${activeFilter === "verified" ? "bg-slate-50 text-[#7c3a2d] font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
              >
                Verified Only
              </button>
              <button
                onClick={() => {
                  setActiveFilter("unverified");
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${activeFilter === "unverified" ? "bg-slate-50 text-[#7c3a2d] font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
              >
                Unverified Only
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* ── Search Bar ── */}
        <div className="px-5 py-3.5 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email or kitchen…"
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{ "--tw-ring-color": "#7c3a2d" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {["#", "Chef & Kitchen", "Email", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedChefs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-400 bg-white"
                  >
                    No matching chef profiles matched the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedChefs.map((chef, idx) => {
                  const statusKey = chef.isVerified ? "verified" : "unverified";
                  const sc = STATUS_CONFIG[statusKey];
                  const initials =
                    `${chef.firstName?.[0] || ""}${chef.lastName?.[0] || ""}` ||
                    "CH";
                  const rowNumber = (safePage - 1) * CHEFS_PER_PAGE + idx + 1;

                  return (
                    <tr
                      key={chef._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-4 w-10">
                        <span className="text-xs font-medium text-slate-400">
                          {rowNumber}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-amber-100 text-amber-700">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              <HighlightMatch
                                text={`${chef.firstName} ${chef.lastName}`}
                                query={searchQuery}
                              />
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              <HighlightMatch
                                text={
                                  chef.kitchenName || "No Kitchen Registered"
                                }
                                query={searchQuery}
                              />
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-500">
                          <HighlightMatch
                            text={chef.email || "—"}
                            query={searchQuery}
                          />
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          {sc.text}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            aria-label="View chef"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleVerification(chef._id)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                            style={{
                              backgroundColor: chef.isVerified
                                ? "#64748b"
                                : "#7c3a2d",
                            }}
                          >
                            {chef.isVerified
                              ? "Disable / Revoke"
                              : "Verify Chef"}
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

        {/* ── Pagination Footer ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-400">
            {filteredChefs.length === 0
              ? "No results matching criteria"
              : `Showing ${startIndex}–${endIndex} of ${filteredChefs.length} chef${filteredChefs.length !== 1 ? "s" : ""}`}
          </p>

          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={safePage === 1}
              onClick={() => goToPage(safePage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>

            {getPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-7 h-7 flex items-center justify-center text-xs text-slate-400 select-none"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    page === safePage
                      ? "text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                  style={page === safePage ? { background: "#7c3a2d" } : {}}
                  aria-current={page === safePage ? "page" : undefined}
                >
                  {page}
                </button>
              ),
            )}

            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={safePage === totalPages}
              onClick={() => goToPage(safePage + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Analytics Cards ── */}
      <AnalyticsCards chefs={chefs} loadingStats={loadingStats} />
    </div>
  );
}

// ── Highlight matching text in search results ─────────────────────────────────
function HighlightMatch({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-100 text-amber-800 rounded px-0.5 font-semibold not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
