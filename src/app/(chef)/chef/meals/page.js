"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";

function formatPrice(price) {
  return `$${(price || 0).toFixed(2)}`;
}

export default function MealsPage() {
  const { token, user, logout } = useAuth();

  // State Management
  const [meals, setMeals] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalListings: 0,
    activeListings: 0,
    inactiveListings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateAnalytics = (mealsArray) => {
    const total = mealsArray.length;
    const active = mealsArray.filter((m) => m.status === "Active").length;
    const inactive = total - active;

    setAnalytics({
      totalListings: total,
      activeListings: active,
      inactiveListings: inactive,
    });
  };

  useEffect(() => {
    if (!token) {
      setError("Please log in to manage your meal listings.");
      setLoading(false);
      return;
    }

    if (!user || !user._id) {
      return;
    }

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

  // 2. Toggle Status (PATCH to /meals/:id/status)
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
        body: JSON.stringify({
          status: nextStatus, 
        }),
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
      console.error("Status Update Failed:", err);
      alert("Network exception error changing visibility settings.");
    }
  };

  // 3. Delete Meal Listing Handler
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
      console.error("Deletion Error:", err);
      alert("Error processing deletion request workflow.");
    }
  };

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

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
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
          <Plus size={16} />
          Create New Listing
        </Link>
      </div>

      {/* Analytics Dynamic Display Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Total Listings", value: analytics.totalListings },
          { label: "Active Items", value: analytics.activeListings },
          { label: "Inactive Items", value: analytics.inactiveListings },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[20px] border border-[#EDE6E3] bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-[13px] font-medium text-[#7A6560]">
              {item.label}
            </p>
            <p className="mt-2 text-[34px] font-extrabold text-[#1E1410]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      {/* Meals Table Section */}
      <section className="overflow-hidden rounded-[24px] border border-[#EDE6E3] bg-white">
        {/* Filters Wrapper Block */}
        <div className="flex flex-col gap-4 border-b border-[#EFE4DF] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#F5EFEC] px-4 py-2 text-sm text-[#5f4b44]"
            >
              Category <span className="font-medium text-[#964326]">All</span>
              <ChevronDown size={15} />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#F5EFEC] px-4 py-2 text-sm text-[#5f4b44]"
            >
              Status <span className="font-medium text-[#964326]">All</span>
              <ChevronDown size={15} />
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-[#5f4b44] transition hover:text-[#964326]"
          >
            <SlidersHorizontal size={16} /> More Filters
          </button>
        </div>

        {/* Responsive Table UI */}
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
              {meals.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-sm text-[#7A6560]"
                  >
                    No kitchen dishes listed yet. Click &quot;Create New
                    Listing&quot; to begin!
                  </td>
                </tr>
              ) : (
                meals.map((meal, index) => (
                  <tr
                    key={meal.id}
                    className={
                      index !== meals.length - 1
                        ? "border-b border-[#F5EFEC]"
                        : ""
                    }
                  >
                    {/* Meal Details Image + Metadata */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#f5efec]">
                          {meal.image ? (
                            <Image
                              src={meal.image}
                              alt={meal.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d5ab89] to-[#8d5033] text-xs font-bold text-white">
                              {meal.name
                                .split(" ")
                                .slice(0, 2)
                                .map((w) => w[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#2A211D]">
                            {meal.name}
                          </p>
                          <p className="text-sm text-[#8B7A73]">
                            Updated {meal.updatedAt}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Label */}
                    <td className="px-6 py-5 text-[#3E322D]">
                      {meal.category}
                    </td>

                    {/* Price Label */}
                    <td className="px-6 py-5 font-semibold text-[#251E1B]">
                      {formatPrice(meal.price)}
                    </td>

                    {/* Interactive Status Toggle */}
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => toggleStatus(meal.id, meal.status)}
                        className={`inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                          meal.status === "Active"
                            ? "bg-[#E4F5F1] text-[#1F7F6E] hover:bg-[#d4eee6]"
                            : "bg-[#F2F2F2] text-[#6E6D6D] hover:bg-[#e4e4e4]"
                        }`}
                      >
                        {meal.status}
                      </button>
                    </td>

                    {/* Actions Context Group */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/chef/meals/${meal.id}/edit`}
                          className="rounded-lg p-2 text-[#6f625d] transition hover:bg-[#F5EFEC] hover:text-[#964326]"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="rounded-lg p-2 text-[#6f625d] transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Static Pagination Segment */}
        <div className="flex flex-col gap-3 border-t border-[#EFE4DF] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7D6D67]">
            Showing {meals.length} of {meals.length} meals
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

      {/* Guide CTA Segment */}
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
        <div className="flex h-32 w-52 items-center justify-center rounded-3xl bg-[#FFF4EF] text-[#964326]">
          <UtensilsCrossed size={64} />
        </div>
      </section>
    </div>
  );
}
