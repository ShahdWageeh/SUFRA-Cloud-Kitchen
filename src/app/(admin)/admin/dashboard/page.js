"use client";

import { useState, useEffect, useCallback } from "react";
import useAuth from "@/hooks/useAuth";
import { RefreshCw, ShieldAlert } from "lucide-react";
import StatsCard from "@/components/admin/ui/StatsCard";
import OrdersChart from "@/components/admin/charts/OrdersChart";
import TopChefsCard from "@/components/admin/sections/TopChefsCard";
import AcquisitionChart from "@/components/admin/charts/AcquisitionChart";
import Footer from "@/components/admin/layout/Footer";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

const AVATAR_COLORS = ["#A55632", "#1E429F", "#03543F", "#723B10", "#9B1C1C"];

export default function DashboardPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [topChefsData, setTopChefsData] = useState([]);

  const [stats, setStats] = useState([
    {
      id: "total-users",
      label: "Total Users",
      metric: "0",
      sublabel: "Registered customers",
      icon: "Users",
      iconBg: "#EBF5FF",
      iconColor: "#1E429F",
      growth: null,
    },
    {
      id: "chef-partners",
      label: "Chef Partners",
      metric: "0",
      sublabel: "Active storefronts",
      icon: "ChefHat",
      iconBg: "#FDF2F2",
      iconColor: "#9B1C1C",
      growth: null,
    },
    {
      id: "total-meals",
      label: "Total Meals",
      metric: "0",
      sublabel: "Dishes in catalog",
      icon: "UtensilsCrossed",
      iconBg: "#FDF6B2",
      iconColor: "#723B10",
      growth: null,
    },
    {
      id: "pending-verifications",
      label: "Pending Verifications",
      metric: "0",
      sublabel: "Awaiting admin review",
      icon: "ShieldCheck",
      iconBg: "#EDFDF6",
      iconColor: "#03543F",
      growth: null,
    },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getAuthHeaders = useCallback(
    (activeToken) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${activeToken}`,
    }),
    [],
  );

  const fetchDashboardInsights = useCallback(async () => {
    let activeToken = token;
    if (!activeToken && typeof window !== "undefined") {
      activeToken =
        localStorage.getItem("token") || localStorage.getItem("jwt");
    }

    if (!activeToken) {
      setError(
        "No administrative authentication token found. Please verify your session.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = getAuthHeaders(activeToken);

      const [customersRes, chefsRes, mealsRes, pendingVerifRes] =
        await Promise.all([
          fetch(`${BASE_URL}/users/customers`, { method: "GET", headers }),
          fetch(`${BASE_URL}/chefs`, { method: "GET", headers }),
          fetch(`${BASE_URL}/meals`, { method: "GET", headers }),
          fetch(`${BASE_URL}/verification-request/pending`, {
            method: "GET",
            headers,
          }),
        ]);

      // ── Customers ──────────────────────────────────────────────────────────
      let customerCount = 0;
      if (customersRes.ok) {
        const json = await customersRes.json();
        const arr = json.data || (Array.isArray(json) ? json : []);
        customerCount = arr.length;
      }

      // ── Chefs ──────────────────────────────────────────────────────────────
      let chefCount = 0;
      let calculatedTopChefs = [];
      if (chefsRes.ok) {
        const json = await chefsRes.json();
        const arr = json.data || (Array.isArray(json) ? json : []);
        chefCount = arr.length;

        calculatedTopChefs = arr.slice(0, 5).map((chef, idx) => {
          const name =
            chef.kitchenName ||
            `${chef.firstName ?? ""} ${chef.lastName ?? ""}`.trim() ||
            "Unknown Kitchen";
          const initials = chef.firstName
            ? chef.firstName.charAt(0).toUpperCase() +
              (chef.lastName?.charAt(0).toUpperCase() ?? "")
            : "CK";

          return {
            id: chef._id || String(idx),
            name,
            orders: chef.totalOrders || 0, // Fallback to 0 if not provided
            category: chef.isVerified ? "Verified Partner" : "Pending Review",
            progress: chef.isVerified ? 100 : 40,
            color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
            initials,
          };
        });
      }

      // ── Meals ──────────────────────────────────────────────────────────────
      let mealCount = 0;
      if (mealsRes.ok) {
        const json = await mealsRes.json();
        const arr = json.data || (Array.isArray(json) ? json : []);
        mealCount = arr.length;
      }

      // ── Pending Verifications ──────────────────────────────────────────────
      let pendingVerifCount = 0;
      if (pendingVerifRes.ok) {
        const json = await pendingVerifRes.json();
        const arr = json.data || (Array.isArray(json) ? json : []);
        pendingVerifCount = arr.length;
      }

      // ── Update State Metrics ───────────────────────────────────────────────
      setStats([
        {
          id: "total-users",
          label: "Total Users",
          metric: String(customerCount),
          sublabel: "Registered customers",
          icon: "Users",
          iconBg: "#EBF5FF",
          iconColor: "#1E429F",
          growth: null,
        },
        {
          id: "chef-partners",
          label: "Chef Partners",
          metric: String(chefCount),
          sublabel: "Active storefronts",
          icon: "ChefHat",
          iconBg: "#FDF2F2",
          iconColor: "#9B1C1C",
          growth: null,
        },
        {
          id: "total-meals",
          label: "Total Meals",
          metric: String(mealCount),
          sublabel: "Dishes in catalog",
          icon: "UtensilsCrossed",
          iconBg: "#FDF6B2",
          iconColor: "#723B10",
          growth: null,
        },
        {
          id: "pending-verifications",
          label: "Pending Verifications",
          metric: String(pendingVerifCount),
          sublabel: "Awaiting admin review",
          icon: "ShieldCheck",
          iconBg: "#EDFDF6",
          iconColor: "#03543F",
          growth: null,
        },
      ]);

      setTopChefsData(calculatedTopChefs);
    } catch (err) {
      console.error("Dashboard statistics breakdown failure:", err);
      setError(
        "An unexpected network error occurred while loading indicators.",
      );
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  useEffect(() => {
    if (isMounted) {
      fetchDashboardInsights();
    }
  }, [isMounted, fetchDashboardInsights]);

  if (!isMounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Platform Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8A8A" }}>
            Real-time insights into your culinary community.
          </p>
        </div>
        <button
          onClick={fetchDashboardInsights}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-semibold border rounded-xl bg-white px-4 py-2 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 shadow-sm"
          style={{ borderColor: "#ECE8E5" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Metrics
        </button>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-medium items-center">
          <ShieldAlert className="shrink-0 text-red-600" size={18} />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[400px] flex-col gap-3 items-center justify-center">
          <RefreshCw size={36} className="animate-spin text-[#A55632]" />
          <p className="text-sm font-medium text-gray-400 animate-pulse">
            Synchronizing platform indicators...
          </p>
        </div>
      ) : (
        <>
          {/* Metrics Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {stats.map((card) => (
              <StatsCard key={card.id} {...card} />
            ))}
          </div>

          {/* Performance Summary Charts & Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
            <OrdersChart />
            <TopChefsCard chefs={topChefsData} />
          </div>

          {/* Acquisition Line Data Graph */}
          <div className="mb-6">
            <AcquisitionChart />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
