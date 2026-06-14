"use client";

/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  EyeOff,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { Loader } from "@/components/ui";
import StatsCard from "@/components/admin/ui/StatsCard";
import TopChefsCard from "@/components/admin/sections/TopChefsCard";
import Footer from "@/components/admin/layout/Footer";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const AVATAR_COLORS = ["#A55632", "#1E429F", "#03543F", "#723B10", "#9B1C1C"];

const EMPTY_SNAPSHOT = {
  customers: [],
  chefs: [],
  meals: [],
  categories: [],
  verifications: [],
  contacts: [],
};

function getStoredToken() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("Sufra_token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("admin_token") ||
    ""
  );
}

function extractArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
}

function normalizeStatus(value = "") {
  return String(value).toLowerCase().replaceAll("_", " ");
}

function isBlocked(user) {
  return user?.isBlocked === 1 || user?.isBlocked === true || user?.status === "blocked";
}

function isActiveRecord(record) {
  return !record?.status || record.status === "active";
}

function getChefName(chef) {
  return (
    chef?.kitchenName ||
    `${chef?.firstName ?? ""} ${chef?.lastName ?? ""}`.trim() ||
    "Unnamed kitchen"
  );
}

function getInitials(chef) {
  const source = `${chef?.firstName ?? ""} ${chef?.lastName ?? ""}`.trim() || getChefName(chef);
  return source
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "CK";
}

function formatDate(value) {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function fetchResource(path, headers) {
  const response = await fetch(`${BASE_URL}${path}`, { method: "GET", headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || `${path} returned ${response.status}`);
  }

  return extractArray(payload);
}

function QueueCard({ icon: Icon, label, value, tone, href }) {
  const toneMap = {
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    teal: "bg-teal-50 text-teal-700 border-teal-100",
    slate: "bg-slate-50 text-slate-700 border-slate-100",
  };
  const className = `rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-sm ${toneMap[tone]}`;

  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <Icon size={18} />
        {href ? <ArrowRight size={16} /> : null}
      </div>
      <p className="mt-5 text-3xl font-bold leading-none">{value}</p>
      <p className="mt-2 text-sm font-semibold">{label}</p>
    </>
  );

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
}

function HealthRow({ label, active, total, color }) {
  const percentage = total ? Math.round((active / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">
          {active.toLocaleString()} of {total.toLocaleString()}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function RecentList({ title, description, items, emptyText, href, type }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
        <a href={href} className="text-sm font-semibold text-[#A55632]">
          Open
        </a>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            {emptyText}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item._id || item.id || `${type}-${item.email || item.subject}`}
              className="rounded-xl border border-slate-100 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {type === "contact"
                    ? item.subject || item.fullName || "Support message"
                    : getChefName(item.chefId || item.chef || item)}
                </p>
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                  {normalizeStatus(item.status || "pending")}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-slate-400">
                {type === "contact"
                  ? item.email || item.fullName || "No sender"
                  : formatDate(item.createdAt || item.updatedAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT);
  const [warnings, setWarnings] = useState([]);
  const [error, setError] = useState(null);

  const fetchDashboardInsights = useCallback(async () => {
    const activeToken = token || getStoredToken();

    if (!activeToken) {
      setError("No admin token found. Please sign in again to load dashboard data.");
      setWarnings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeToken}`,
    };

    const endpoints = [
      ["customers", "/users/customers"],
      ["chefs", "/chefs"],
      ["meals", "/meals"],
      ["categories", "/categories"],
      ["verifications", "/verification-request/pending"],
      ["contacts", "/contact"],
    ];

    const results = await Promise.allSettled(
      endpoints.map(([key, path]) =>
        fetchResource(path, headers).then((data) => ({ key, data })),
      ),
    );

    const nextSnapshot = { ...EMPTY_SNAPSHOT };
    const nextWarnings = [];

    results.forEach((result, index) => {
      const [key, path] = endpoints[index];
      if (result.status === "fulfilled") {
        nextSnapshot[key] = result.value.data;
      } else {
        nextWarnings.push(`${path}: ${result.reason.message}`);
      }
    });

    setSnapshot(nextSnapshot);
    setWarnings(nextWarnings);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchDashboardInsights();
  }, [fetchDashboardInsights]);

  const customers = snapshot.customers;
  const chefs = snapshot.chefs;
  const meals = snapshot.meals;
  const categories = snapshot.categories;
  const contacts = snapshot.contacts;
  const verifications = snapshot.verifications;

  const activeCustomers = customers.filter((customer) => !isBlocked(customer)).length;
  const verifiedChefs = chefs.filter((chef) => chef.isVerified).length;
  const activeMeals = meals.filter(isActiveRecord).length;
  const activeCategories = categories.filter(isActiveRecord).length;
  const hiddenCatalogItems =
    meals.length - activeMeals + categories.length - activeCategories;
  const pendingContacts = contacts.filter((message) => message.status === "pending").length;

  const stats = [
    {
      id: "customers",
      label: "Customers",
      metric: customers.length.toLocaleString(),
      sublabel: `${activeCustomers.toLocaleString()} active accounts`,
      icon: "Users",
      iconBg: "#EBF5FF",
      iconColor: "#1E429F",
    },
    {
      id: "chefs",
      label: "Chef Partners",
      metric: chefs.length.toLocaleString(),
      sublabel: `${verifiedChefs.toLocaleString()} verified kitchens`,
      icon: "ChefHat",
      iconBg: "#FDF2F2",
      iconColor: "#9B1C1C",
    },
    {
      id: "meals",
      label: "Meal Catalog",
      metric: meals.length.toLocaleString(),
      sublabel: `${activeMeals.toLocaleString()} visible dishes`,
      icon: "UtensilsCrossed",
      iconBg: "#FDF6B2",
      iconColor: "#723B10",
    },
    {
      id: "support",
      label: "Open Support",
      metric: pendingContacts.toLocaleString(),
      sublabel: "Pending contact messages",
      icon: "MessageSquare",
      iconBg: "#EDFDF6",
      iconColor: "#03543F",
    },
  ];

  const chefReadiness = chefs.slice(0, 5).map((chef, index) => ({
    id: chef._id || chef.id || String(index),
    name: getChefName(chef),
    initials: getInitials(chef),
    category: chef.email || chef.phone || "Partner profile",
    statusText: chef.isVerified ? "Verified" : "Needs review",
    progress: chef.isVerified ? 100 : 45,
    color: AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));

  const pendingVerificationItems = verifications.slice(0, 3);
  const pendingContactItems = contacts
    .filter((message) => message.status === "pending")
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A55632]">
            Admin Command Center
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Snapshot of customers, chefs, meals, categories, payouts, and support work.
          </p>
        </div>
        <button
          onClick={fetchDashboardInsights}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? (
            <Loader size={20} className="p-0" />
          ) : (
            <RefreshCw size={15} />
          )}
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          <ShieldAlert className="shrink-0 text-red-600" size={18} />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle size={16} />
            Some API sections could not be loaded.
          </div>
          <p className="mt-1 text-xs text-amber-700">
            Showing the available data. Check backend support for: {warnings.join(" | ")}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-3">
          <Loader size={40} />
          <p className="text-sm font-medium text-slate-400">
            Loading documented API surfaces...
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {stats.map((card) => (
              <StatsCard key={card.id} {...card} />
            ))}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <QueueCard
              icon={Clock3}
              label="Chef verifications"
              value={verifications.length.toLocaleString()}
              tone="amber"
              href="/admin/verifications"
            />
            <QueueCard
              icon={MessageSquare}
              label="Support messages"
              value={pendingContacts.toLocaleString()}
              tone="teal"
              href="/admin/contacts"
            />
            <QueueCard
              icon={EyeOff}
              label="Hidden categories"
              value={hiddenCatalogItems.toLocaleString()}
              tone="rose"
              href="/admin/categories"
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Platform Health
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    What is live, verified, and visible right now
                  </p>
                </div>
                <CheckCircle2 size={20} className="text-teal-600" />
              </div>

              <div className="space-y-5">
                <HealthRow
                  label="Active customers"
                  active={activeCustomers}
                  total={customers.length}
                  color="#1E429F"
                />
                <HealthRow
                  label="Verified chefs"
                  active={verifiedChefs}
                  total={chefs.length}
                  color="#A55632"
                />
                <HealthRow
                  label="Visible meals"
                  active={activeMeals}
                  total={meals.length}
                  color="#03543F"
                />
                <HealthRow
                  label="Active categories"
                  active={activeCategories}
                  total={categories.length}
                  color="#723B10"
                />
              </div>
            </div>

            <TopChefsCard chefs={chefReadiness} />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentList
              title="Verification Inbox"
              description="Newest chefs waiting for document review"
              items={pendingVerificationItems}
              emptyText="No pending verification requests."
              href="/admin/verifications"
              type="verification"
            />
            <RecentList
              title="Support Inbox"
              description="Pending contact messages from customers and chefs"
              items={pendingContactItems}
              emptyText="No pending support messages."
              href="/admin/contacts"
              type="contact"
            />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
