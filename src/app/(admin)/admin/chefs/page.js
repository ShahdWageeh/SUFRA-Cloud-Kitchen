"use client";

import { useState } from "react";
import {
  ChevronDown,
  Eye,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";

//Data
const CHEFS = [
  {
    id: 1,
    name: "Fatima Al-Sayed",
    kitchen: "The Levant Table",
    cuisine: "Levantine / Syrian",
    date: "Oct 12, 2023",
    status: "Pending Review",
    initials: "FA",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
  },
  {
    id: 2,
    name: "Omar Khaled",
    kitchen: "Nile Delights",
    cuisine: "Egyptian",
    date: "Sep 28, 2023",
    status: "Approved",
    initials: "OK",
    avatarBg: "bg-teal-100",
    avatarText: "text-teal-700",
  },
  {
    id: 3,
    name: "Amira Mansour",
    kitchen: "Grandma's Spices",
    cuisine: "Khaleeji",
    date: "Aug 15, 2023",
    status: "Suspended",
    initials: "AM",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-700",
  },
  {
    id: 4,
    name: "Youssef Rami",
    kitchen: "Maghreb Bites",
    cuisine: "North African",
    date: "Oct 24, 2023",
    status: "Pending Review",
    initials: "YR",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-700",
  },
];

const STATUS_CONFIG = {
  "Pending Review": {
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    dot: "bg-slate-400",
  },
  Approved: {
    badge: "bg-teal-50 text-teal-700 border border-teal-200",
    dot: "bg-teal-500",
  },
  Suspended: {
    badge: "bg-rose-50 text-rose-600 border border-rose-200",
    dot: "bg-rose-400",
  },
};

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function MiniBarChart() {
  const bars = [40, 65, 50, 80, 60, 90, 75];
  return (
    <div className="flex items-end gap-[3px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: i === bars.length - 1 ? "#0d9488" : "#ccfbf1",
          }}
        />
      ))}
    </div>
  );
}

// ─── Analytics Cards ─────────────────────────────────────────────────────────

function AnalyticsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Card 1 – Pending Approvals */}
      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: "#7c3a2d" }}
      >
        <div className="flex items-center justify-between">
          <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide">
            +12 today
          </span>
          <Clock size={16} className="text-white/60" />
        </div>
        <div>
          <p className="text-4xl font-bold text-white leading-none">18</p>
          <p className="text-sm text-white/70 mt-1.5 font-medium">
            Pending Approvals
          </p>
        </div>
      </div>

      {/* Card 2 – Active Chefs */}
      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-amber-50 border border-amber-100">
        <div className="flex items-center justify-between">
          <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={11} /> Verified
          </span>
          <Users size={16} className="text-slate-400" />
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-900 leading-none">482</p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Active Chefs
          </p>
        </div>
      </div>

      {/* Card 3 – Growth Rate */}
      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <span className="bg-teal-50 text-teal-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <TrendingUp size={11} /> Monthly
          </span>
        </div>
        <div>
          <p className="text-4xl font-bold text-teal-600 leading-none">
            +14.2%
          </p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Growth Rate
          </p>
        </div>
        <MiniBarChart />
      </div>

      {/* Card 4 – Flagged Profiles */}
      <div className="rounded-2xl p-5 flex flex-col gap-3 bg-rose-50 border border-rose-100">
        <div className="flex items-center justify-between">
          <span className="bg-rose-100 text-rose-600 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <AlertTriangle size={11} /> Flagged
          </span>
        </div>
        <div>
          <p className="text-4xl font-bold text-slate-900 leading-none">5</p>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Flagged Profiles
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Row Actions ─────────────────────────────────────────────────────────────

function RowActions({ status }) {
  return (
    <div className="flex items-center gap-2">
      {/* Eye — always present */}
      <button
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        aria-label="View chef"
      >
        <Eye size={16} />
      </button>

      {/* Approve — Pending only */}
      {status === "Pending Review" && (
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ background: "#7c3a2d" }}
        >
          Approve
        </button>
      )}

      {/* Reactivate — Suspended only */}
      {status === "Suspended" && (
        <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
          Reactivate
        </button>
      )}

      {/* Block / Dismiss — Pending or Approved */}
      {(status === "Pending Review" || status === "Approved") && (
        <button
          className={`p-1.5 rounded-lg transition-colors ${
            status === "Pending Review"
              ? "text-rose-400 hover:text-rose-600 hover:bg-rose-50"
              : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
          }`}
          aria-label="Block chef"
        >
          <Ban size={16} />
        </button>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ChefsManagement() {
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisines");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [activePage, setActivePage] = useState(1);

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

        {/* Filters */}
        <div className="flex items-center gap-2">
          {[cuisineFilter, statusFilter].map((val, i) => (
            <button
              key={i}
              onClick={() => {}}
              className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
            >
              {val}
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  "Chef & Kitchen",
                  "Cuisine",
                  "Signup Date",
                  "Approval Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CHEFS.map((chef) => {
                const sc = STATUS_CONFIG[chef.status];
                return (
                  <tr
                    key={chef.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Chef & Kitchen */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${chef.avatarBg} ${chef.avatarText}`}
                        >
                          {chef.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {chef.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {chef.kitchen}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Cuisine */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {chef.cuisine}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {chef.date}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                        />
                        {chef.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <RowActions status={chef.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* ── Pagination Footer ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing 4 of 128 chefs</p>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
              disabled={activePage === 1}
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={15} />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setActivePage(n)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  activePage === n
                    ? "text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                style={activePage === n ? { background: "#7c3a2d" } : {}}
              >
                {n}
              </button>
            ))}
            <button
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setActivePage((p) => Math.min(3, p + 1))}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Analytics Cards ── */}
      <AnalyticsCards />
    </div>
  );
}
