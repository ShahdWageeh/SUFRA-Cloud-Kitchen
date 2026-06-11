"use client";

import { useEffect, useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { categoryService, mealPlanningService } from "@/services";

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function MealCard({ meal }) {
  return (
    <div className="rounded-3xl border border-surface-low bg-white p-5 shadow-sm">
      <h4 className="text-lg font-semibold">{meal.name || meal.title || "Meal"}</h4>
      <p className="mt-2 text-sm text-text-secondary line-clamp-3">
        {meal.description || meal.summary || "No description available."}
      </p>
      <div className="mt-4 text-sm text-text-secondary">
        <span className="font-medium">Category:</span>{" "}
        {meal.category?.name || meal.categories?.[0]?.name || "—"}
      </div>
    </div>
  );
}

export default function MealPlannerPage() {
  const { user, loading, isCustomer } = useAuth();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [weeklyBudget, setWeeklyBudget] = useState(1000);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [allergies, setAllergies] = useState("");
  const [plan, setPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await categoryService.getActiveCategories();
        const categoriesResponse = response?.data ?? response;
        const categoryList = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : categoriesResponse?.data || [];

        setCategories(categoryList);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    if (!loading && user && !isCustomer) {
      window.location.href = "/";
    }
  }, [loading, user, isCustomer]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: category._id || category.id,
        name: category.name || category.title || "Unnamed category",
      })),
    [categories],
  );

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      setError("Please select at least one favorite category.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setPlan(null);

    try {
      const response = await mealPlanningService.generateMealPlan({
        weeklyBudget,
        mealsPerDay,
        favoriteCategories: selectedCategories,
        allergies: allergies
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      const responseData = response?.data ?? response;
      const planData = responseData?.data || responseData;
      setPlan(planData || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to generate meal plan. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedPlanEntries = useMemo(() => {
    if (!plan) return [];
    return Object.entries(plan).sort(
      ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime(),
    );
  }, [plan]);

  return (
    <div className="min-h-screen bg-[#F8F7F5] py-10 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold">7-Day AI Meal Planner</h1>
              <p className="mt-3 max-w-2xl text-sm text-text-secondary">
                Generate a personalized meal plan based on your budget, daily meal frequency, favorite categories, and allergies.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-text-secondary">Weekly Budget</span>
              <input
                type="number"
                min={100}
                value={weeklyBudget}
                onChange={(event) => setWeeklyBudget(Number(event.target.value))}
                className="w-full rounded-2xl border border-surface-low bg-surface px-4 py-3"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text-secondary">Meals Per Day</span>
              <select
                value={mealsPerDay}
                onChange={(event) => setMealsPerDay(Number(event.target.value))}
                className="w-full rounded-2xl border border-surface-low bg-surface px-4 py-3"
              >
                {[1, 2, 3, 4].map((count) => (
                  <option key={count} value={count}>
                    {count} meals
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-text-secondary">Allergies</span>
              <input
                type="text"
                value={allergies}
                onChange={(event) => setAllergies(event.target.value)}
                placeholder="peanut, dairy"
                className="w-full rounded-2xl border border-surface-low bg-surface px-4 py-3"
              />
            </label>
          </div>

          <div className="mt-8 rounded-3xl border border-surface-low bg-surface p-6">
            <h2 className="text-lg font-semibold">Favorite Categories</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Select the categories that should guide your meal plan.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryOptions.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    selectedCategories.includes(category.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-surface-low bg-white text-text-primary hover:border-gray-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-2xl bg-primary px-6 py-3 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Generating plan..." : "Generate Meal Plan"}
            </button>
            <span className="text-sm text-text-secondary">
              The AI analyzes your preferences and suggests meals for the next 7 days.
            </span>
          </div>
        </div>

        {plan && (
          <div className="space-y-6">
            {sortedPlanEntries.map(([date, meals]) => (
              <div key={date} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">
                      {formatDateLabel(date)}
                    </p>
                    <h3 className="text-2xl font-semibold">Daily plan</h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(meals).map(([mealKey, mealArray]) => (
                    <div
                      key={mealKey}
                      className="space-y-3 rounded-3xl border border-surface-low bg-surface p-4"
                    >
                      <div className="text-sm font-semibold text-text-primary">
                        {mealKey.replace(/meal/i, "Meal ")}
                      </div>
                      {Array.isArray(mealArray) && mealArray.length > 0 ? (
                        mealArray.map((meal) => (
                          <MealCard
                            key={meal._id || meal.id || meal.name || meal.title}
                            meal={meal}
                          />
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-surface-low bg-white p-4 text-sm text-text-secondary">
                          No meal recommended.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
