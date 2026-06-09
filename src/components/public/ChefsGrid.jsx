"use client";

import { useState } from "react";
import ChefCard from "@/components/public/ChefCard";

const CHEFS_PER_PAGE = 4;

export default function ChefsGrid({ chefs }) {
  const [visibleCount, setVisibleCount] = useState(CHEFS_PER_PAGE);
  const visibleChefs = chefs.slice(0, visibleCount);
  const hasMore = visibleCount < chefs.length;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleChefs.map((chef) => (
          <ChefCard key={chef.id} chef={chef} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + CHEFS_PER_PAGE)}
            className="rounded-full bg-primary px-8 py-3 text-xs font-bold text-white transition hover:bg-primary-container"
          >
            View More Chefs
          </button>
        </div>
      )}
    </>
  );
}
