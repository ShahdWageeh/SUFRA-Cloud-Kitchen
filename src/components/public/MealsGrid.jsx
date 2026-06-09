"use client";

import { useState } from "react";
import MealCard from "@/components/public/MealCard";

const MEALS_PER_PAGE = 4;

export default function MealsGrid({
  meals,
  gridClassName = "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
  buttonLabel = "Load More Meals",
}) {
  const [visibleCount, setVisibleCount] = useState(MEALS_PER_PAGE);
  const visibleMeals = meals.slice(0, visibleCount);
  const hasMore = visibleCount < meals.length;

  return (
    <>
      <div className={gridClassName}>
        {visibleMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + MEALS_PER_PAGE)}
            className="rounded-full border border-primary px-7 py-3 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </>
  );
}
