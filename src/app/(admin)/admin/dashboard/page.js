"use client";

import { useState, useEffect, useCallback } from "react";
import useAuth from "@/hooks/useAuth";
import { RefreshCw, ShieldAlert } from "lucide-react";
import AcquisitionChart from "@/components/admin/charts/AcquisitionChart";
import StatsCard from "@/components/admin/ui/StatsCard";
import OrdersChart from "@/components/admin/charts/OrdersChart";
import TopChefsCard from "@/components/admin/sections/TopChefsCard";
import Footer from "@/components/admin/layout/Footer";

export default function DashboardPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Stats cards initial state set to 0. No hardcoded fake percentages or numbers.
  const [stats, setStats] = useState([
    {
      id: "total-users",
      label: "Total Users",
      metric: "0",
      sublabel: "Database Records",
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
      id: "total-orders",
      label: "Total Orders",
      metric: "0",
      sublabel: "Processed volumes",
      icon: "ShoppingBag",
      iconBg: "#EDFDF6",
      iconColor: "#03543F",
      growth: null,
    },
  ]);

  const [topChefsData, setTopChefsData] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchDashboardInsights = useCallback(async () => {
    let activeToken = token;
    if (!activeToken && typeof window !== "undefined") {
      activeToken =
        localStorage.getItem("token") || localStorage.getItem("jwt");
    }

    if (!activeToken) {
      setError(
        "No administrative authentication token discovered. Please verify session state.",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseUrl = "https://sufra-cloud-kitchen.vercel.app/api";

      // Querying ONLY the authentic available data streams from your documentation
      const [chefsRes, mealsRes] = await Promise.all([
        fetch(`${baseUrl}/chefs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
        }),
        fetch(`${baseUrl}/meals`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
        }),
      ]);

      let chefCount = 0;
      let mealCount = 0;
      let calculatedTopChefs = [];

      // Process real chef data from API response
      if (chefsRes.ok) {
        const chefsJson = await chefsRes.json();
        const chefsArray =
          chefsJson.data || (Array.isArray(chefsJson) ? chefsJson : []);
        chefCount = chefsArray.length;

        // Map through your real chefs array to show actual names/kitchens from database
        calculatedTopChefs = chefsArray.map((chef, idx) => ({
          id: chef._id || String(idx),
          name: chef.kitchenName || `${chef.firstName} ${chef.lastName}`,
          orders: 0, // Left at 0 since no order metric exists on the base /chefs list
          category: chef.isVerified
            ? "Verified Partner"
            : "Pending Verification",
          progress: chef.isVerified ? 100 : 20,
          color: "#A55632",
          initials: chef.firstName
            ? chef.firstName.charAt(0) + (chef.lastName?.charAt(0) || "")
            : "CK",
        }));
      }

      // Process real meals data from API response
      if (mealsRes.ok) {
        const mealsJson = await mealsRes.json();
        const mealsArray =
          mealsJson.data || (Array.isArray(mealsJson) ? mealsJson : []);
        mealCount = mealsArray.length;
      }

      // Update metrics with pure live database counts only
      setStats([
        {
          id: "total-users",
          label: "Total Users",
          metric: "0",
          sublabel: "Endpoint Pending",
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
          id: "total-orders",
          label: "Total Orders",
          metric: "0",
          sublabel: "Endpoint Pending",
          icon: "ShoppingBag",
          iconBg: "#EDFDF6",
          iconColor: "#03543F",
          growth: null,
        },
      ]);

      setTopChefsData(calculatedTopChefs);
    } catch (err) {
      console.error("Dashboard Fetch Fault:", err);
      setError(
        "An unexpected network exception occurred synchronizing platform collections.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isMounted) {
      fetchDashboardInsights();
    }
  }, [isMounted, fetchDashboardInsights]);

  if (!isMounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Platform Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8A8A" }}>
            Real-time insights into your culinary community.
          </p>
        </div>
        <button
          onClick={fetchDashboardInsights}
          disabled={loading}
          className="inline-flex items-center gap-2 text-xs font-semibold border rounded-xl bg-white px-4 py-2 text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
          style={{ borderColor: "#ECE8E5" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Metrics
        </button>
      </div>

      {/* Error Alert Display */}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            {stats.map((card) => (
              <StatsCard key={card.id} {...card} />
            ))}
          </div>

          {/* Orders Overview + Top Chefs */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mb-6">
            {/* Charts will render empty states naturally or rely on database values when ready */}
            <OrdersChart />
            <TopChefsCard chefs={topChefsData} />
          </div>

          {/* User Acquisition Growth */}
          <div className="mb-6">
            <AcquisitionChart />
          </div>
        </>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
