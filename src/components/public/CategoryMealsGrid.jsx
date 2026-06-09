"use client";

import { useState } from "react";
import LandingMealCard from "@/components/public/LandingMealCard";

const MEALS_PER_PAGE = 4;

export default function CategoryMealsGrid({ meals }) {
  const [visibleCount, setVisibleCount] = useState(MEALS_PER_PAGE);
  const visibleMeals = meals.slice(0, visibleCount);
  const hasMore = visibleCount < meals.length;

  return (
    <>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
        {visibleMeals.map((meal) => (
          <LandingMealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + MEALS_PER_PAGE)}
            className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition hover:bg-primary-container"
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
}
