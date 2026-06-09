"use client";

import { FilterToolbar } from "@/components/admin/meals/FilterToolbar";
import { MealsTableBody } from "@/components/admin/meals/MealsTableBody";
import { ModerationStatsView } from "@/components/admin/meals/ModerationStatsView";
import { PaginationFooter } from "@/components/admin/meals/PaginationFooter";
import { useState, useEffect, useCallback } from "react";


const PAGE_SIZE = 10;

async function fetchMeals({ page, pageSize, category, status }) {
  await new Promise((r) => setTimeout(r, 650));
  const mock = [
    {
      id: "ML-8821",
      title: "Spicy Lamb Mandi",
      flagged: true,
      imageUrl: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=80&h=80&fit=crop",
      chef: { name: "Chef Fatima K.", avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Fatima" },
      category: "Main Dish",
      price: "$24.00",
      status: "Flagged",
    },
    {
      id: "ML-4512",
      title: "Margarita Classico",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop",
      chef: { name: "Chef Marco R.", avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Marco" },
      category: "Italian",
      price: "$18.50",
      status: "Active",
    },
    {
      id: "ML-3390",
      title: "Berry Bliss Parfait",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=80&h=80&fit=crop",
      chef: { name: "Sarah Al-D." },
      category: "Dessert",
      price: "$12.00",
      status: "Pending Review",
    },
    {
      id: "ML-2211",
      title: "Signature Wagyu Fillet",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=80&h=80&fit=crop",
      chef: { name: "Chef Andre P.", avatarUrl: "https://api.dicebear.com/7.x/thumbs/svg?seed=Andre" },
      category: "Premium",
      price: "$65.00",
      status: "Active",
    },
  ];
  return { meals: mock, total: 128, totalPages: 32 };
}

async function fetchModerationStats() {
  await new Promise((r) => setTimeout(r, 400));
  return { pendingAudit: 14, flaggedToday: 6 };
}

export default function MealsModeration() {
  const [meals, setMeals] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [categoryInput, setCategoryInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [applied, setApplied] = useState({ category: "", status: "" });

  const [activePage, setActivePage] = useState(1);

  const loadMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMeals({
        page: activePage,
        pageSize: PAGE_SIZE,
        category: applied.category,
        status: applied.status,
      });
      setMeals(data.meals);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [activePage, applied]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await fetchModerationStats();
      setStats(data);
    } catch {
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleApply = () => {
    setActivePage(1);
    setApplied({ category: categoryInput, status: statusInput });
  };

  const handleClear = () => {
    setCategoryInput("");
    setStatusInput("");
    setActivePage(1);
    setApplied({ category: "", status: "" });
  };

  const handlePageChange = (pageTarget) => {
    setActivePage(Math.max(1, Math.min(totalPages, pageTarget)));
  };

  return (
    <div className="w-full pb-20">
      {/* Upper Layout Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meals Moderation</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
            Audit active community listings to ensure safety and quality standards. Action flagged content immediately.
          </p>
        </div>
        <ModerationStatsView loading={statsLoading} stats={stats} />
      </div>

      {/* Interactive Toolbar Filter Layer */}
      <FilterToolbar
        category={categoryInput}
        setCategory={setCategoryInput}
        status={statusInput}
        setStatus={setStatusInput}
        onClear={handleClear}
        onApply={handleApply}
      />

      {/* Main Table Interface Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Meal Details", "Chef", "Category", "Price", "Status", "Actions"].map((headerName) => (
                  <th
                    key={headerName}
                    className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400 whitespace-nowrap"
                  >
                    {headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <MealsTableBody
                loading={loading}
                error={error}
                meals={meals}
                pageSize={PAGE_SIZE}
                onRetry={loadMeals}
              />
            </tbody>
          </table>
        </div>

        {/* Global Structural Pagination Controller */}
        <PaginationFooter
          loading={loading}
          total={total}
          activePage={activePage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}