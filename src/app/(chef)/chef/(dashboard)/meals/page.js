"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { Plus, ChevronLeft, ChevronRight, UtensilsCrossed } from "lucide-react";
import {
  AnalyticsGrid,
  MealTableRow,
  TableFilterBar,
} from "@/components/meals/MealTableComponents";

export default function MealsPage() {
  const { token, user, logout } = useAuth();

  const [meals, setMeals] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalListings: 0,
    activeListings: 0,
    inactiveListings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const calculateAnalytics = (mealsArray) => {
    const total = mealsArray.length;
    const active = mealsArray.filter((m) => m.status === "Active").length;
    setAnalytics({
      totalListings: total,
      activeListings: active,
      inactiveListings: total - active,
    });
  };

  useEffect(() => {
    if (!token) {
      setError("Please log in to manage your meal listings.");
      setLoading(false);
      return;
    }
    if (!user?._id) return;

    async function fetchChefMeals() {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await fetch(`${baseUrl}/meals?chefId=${user._id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }

        if (response.ok && result.success) {
          const normalizedMeals = (result.data || []).map((meal) => ({
            id: meal._id,
            name: meal.name,
            category:
              meal.categories?.[0]?.name ||
              meal.category?.name ||
              "Uncategorized",
            price: meal.price,
            image: meal.mealImages?.[0] || meal.image || null,
            status: meal.status === "inactive" ? "Inactive" : "Active",
            updatedAt: meal.updatedAt
              ? new Date(meal.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently",
          }));

          setMeals(normalizedMeals);
          calculateAnalytics(normalizedMeals);

          const cats = Array.from(
            new Set(normalizedMeals.map((m) => m.category)),
          );
          setUniqueCategories(cats);
        } else {
          throw new Error(result.message || "Failed to load meal listings.");
        }
      } catch (err) {
        console.error("Meals Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChefMeals();
  }, [token, user, logout]);

  const toggleStatus = async (mealId, currentStatus) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const nextStatus = currentStatus === "Active" ? "inactive" : "active";

      const response = await fetch(`${baseUrl}/meals/${mealId}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMeals((currentMeals) => {
          const updated = currentMeals.map((meal) =>
            meal.id === mealId
              ? {
                  ...meal,
                  status: nextStatus === "active" ? "Active" : "Inactive",
                }
              : meal,
          );
          calculateAnalytics(updated);
          return updated;
        });
      } else {
        alert(result.message || "Failed to change active status state.");
      }
    } catch (err) {
      alert("Network exception error changing visibility settings.");
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this meal listing?",
      )
    )
      return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/meals/${mealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMeals((currentMeals) => {
          const filtered = currentMeals.filter((meal) => meal.id !== mealId);
          calculateAnalytics(filtered);
          return filtered;
        });
      } else {
        alert(result.message || "Failed to delete meal listing.");
      }
    } catch (err) {
      alert("Error processing deletion request workflow.");
    }
  };

  const filteredMeals = meals.filter((meal) => {
    const categoryMatches =
      selectedCategory === "All" || meal.category === selectedCategory;
    const statusMatches =
      selectedStatus === "All" || meal.status === selectedStatus;
    return categoryMatches && statusMatches;
  });

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-medium text-[#7A6560] animate-pulse">
          Loading menu items...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[20px] border border-red-200 bg-red-50 p-6 text-center max-w-xl mx-auto my-10">
        <p className="font-semibold text-red-700 mb-2">Error Loading Meals</p>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  // console.log("meals:", meals);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Container */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#7e6a63] md:text-base">
          You have{" "}
          <span className="font-bold text-[#964326]">
            {analytics.activeListings}
          </span>{" "}
          active meal listings today.
        </p>

        <Link
          href="/chef/meals/create"
          className="inline-flex items-center gap-2 rounded-full bg-[#964326] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#82402a]"
        >
          <Plus size={16} /> Create New Listing
        </Link>
      </div>

      {/* Analytics Dynamic Display Section */}
      <AnalyticsGrid analytics={analytics} />

      {/*  Filtered Data Table Container Block */}
      <section className="overflow-visible rounded-[24px] border border-[#EDE6E3] bg-white">
        <TableFilterBar
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          catDropdownOpen={catDropdownOpen}
          setCatDropdownOpen={setCatDropdownOpen}
          statusDropdownOpen={statusDropdownOpen}
          setStatusDropdownOpen={setStatusDropdownOpen}
        />

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#F2E9E5] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Meal Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Category
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Price
                </th>
                <th className="w-[120px] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMeals.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-sm text-[#7A6560]"
                  >
                    No kitchen dishes matching the selected criteria filters
                    were found.
                  </td>
                </tr>
              ) : (
                filteredMeals.map((meal, idx) => (
                  <MealTableRow
                    key={meal.id}
                    meal={meal}
                    isLast={idx === filteredMeals.length - 1}
                    onToggleStatus={toggleStatus}
                    onDelete={handleDeleteMeal}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Static Table Pagination Navigation Footer */}
        <div className="flex flex-col gap-3 border-t border-[#EFE4DF] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7D6D67]">
            Showing {filteredMeals.length} of {meals.length} meals total
          </p>

          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DAD4] text-[#7B6B64] hover:bg-[#F6EFEB]">
              <ChevronLeft size={16} />
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#964326] text-white">
              1
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DAD4] text-[#7B6B64] hover:bg-[#F6EFEB]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Guide Callout Footer Element */}
      <section className="flex flex-col items-center justify-between gap-6 rounded-[24px] border border-[#EFD8CF] bg-[#F7D7C9] px-6 py-8 md:flex-row md:px-8">
        <div>
          <h3 className="text-2xl font-extrabold text-[#35231C] md:text-3xl">
            Want to increase visibility?
          </h3>
          <p className="mt-3 max-w-2xl text-[#634B42]">
            Adding high-quality photography to your listings increases
            conversions significantly. Learn how to make your dishes stand out
            and attract more customers.
          </p>
          <button
            type="button"
            className="mt-5 rounded-full bg-[#964326] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7F3920]"
          >
            Read Guide
          </button>
        </div>
        <div className="flex h-32 w-52 items-center justify-center rounded-3xl bg-[#FFF4EF] text-[#964326] shrink-0">
          <UtensilsCrossed size={64} />
        </div>
      </section>
    </div>
  );
}