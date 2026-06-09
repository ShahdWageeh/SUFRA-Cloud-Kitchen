"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import LandingMealCard from "@/components/public/LandingMealCard";
import { mealService } from "@/services";
import { normalizeMeal } from "@/utils/mealUtils";

export default function LandingMealsSection() {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMeals() {
      try {
        setIsLoading(true);
        setError("");
        const response = await mealService.getActiveMeals();
        const nextMeals = (response.data || []).slice(0, 4).map(normalizeMeal);

        if (isMounted) {
          setMeals(nextMeals);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Meals are unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMeals();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 bg-secondary-container">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Most Loved Meals
          </h2>
          <Link
            href="/meals"
            className="text-primary flex items-center gap-2"
          >
            See All
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-text-secondary">Loading meals...</p>
        ) : error ? (
          <p className="text-text-secondary">{error}</p>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {meals.map((meal) => (
              <LandingMealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
