"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mealService, chefService } from "@/services";
import { normalizePublicMeal } from "@/utils/mealUtils";
import { normalizeChef } from "@/utils/chefUtils";
import MealsGrid from "@/components/public/MealsGrid";
import ChefsGrid from "@/components/public/ChefsGrid";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SearchInput } from "@/components/ui";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [meals, setMeals] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("meals");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [mealsRes, chefsRes] = await Promise.all([
          mealService.getActiveMeals(),
          chefService.getVerifiedChefs(),
        ]);
        
        const allMeals = (mealsRes.data || []).map(normalizePublicMeal);
        const allChefs = (chefsRes.data || []).map(normalizeChef);
        
        // Client-side filtering
        const q = query.toLowerCase();
        
        const filteredMeals = allMeals.filter(meal => 
          meal.name?.toLowerCase().includes(q) ||
          meal.description?.toLowerCase().includes(q) ||
          meal.chefName?.toLowerCase().includes(q) ||
          meal.categoryLabel?.toLowerCase().includes(q) ||
          meal.cuisine?.toLowerCase().includes(q)
        );
        
        const filteredChefs = allChefs.filter(chef => 
          chef.brandName?.toLowerCase().includes(q) ||
          chef.chefName?.toLowerCase().includes(q) ||
          chef.specialty?.toLowerCase().includes(q) ||
          chef.bio?.toLowerCase().includes(q)
        );
        
        setMeals(filteredMeals);
        setChefs(filteredChefs);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (query) {
      fetchData();
    } else {
      setMeals([]);
      setChefs([]);
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <section className="bg-secondary-container py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold">
              Search Results for <span className="text-primary">&quot;{query}&quot;</span>
            </h1>
            <div className="mt-8">
              <SearchInput 
                placeholder="Search for more meals or chefs..." 
                className="max-w-2xl bg-white p-2 rounded-full shadow-sm"
                inputClassName="bg-transparent"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex gap-8 border-b border-outline/20">
            <button
              onClick={() => setActiveTab("meals")}
              className={`pb-4 text-sm font-bold transition-colors ${
                activeTab === "meals"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Meals ({meals.length})
            </button>
            <button
              onClick={() => setActiveTab("chefs")}
              className={`pb-4 text-sm font-bold transition-colors ${
                activeTab === "chefs"
                  ? "border-b-2 border-primary text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Chefs ({chefs.length})
            </button>
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="py-20 text-center">
                <p className="text-text-secondary">Searching...</p>
              </div>
            ) : (
              <>
                {activeTab === "meals" && (
                  meals.length > 0 ? (
                    <MealsGrid meals={meals} />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-text-secondary">No meals found matching your search.</p>
                    </div>
                  )
                )}
                {activeTab === "chefs" && (
                  chefs.length > 0 ? (
                    <ChefsGrid chefs={chefs} />
                  ) : (
                    <div className="py-20 text-center">
                      <p className="text-text-secondary">No chefs found matching your search.</p>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
