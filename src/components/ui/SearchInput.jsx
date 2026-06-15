"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUtensils, faUser } from "@fortawesome/free-solid-svg-icons";
import { mealService, chefService } from "@/services";
import { normalizePublicMeal } from "@/utils/mealUtils";
import { normalizeChef } from "@/utils/chefUtils";
import Loader from "./Loader";

export default function SearchInput({ 
  placeholder = "Search...", 
  className = "",
  inputClassName = "",
  buttonClassName = "",
  showButton = false,
  initialValue = "",
  basePath = "/search"
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue || searchParams.get("q") || "");
  const [results, setResults] = useState({ meals: [], chefs: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length > 1) {
        setIsLoading(true);
        // Only open the dropdown if the user is actively focused on the input
        if (isFocused) {
          setIsOpen(true);
        }
        
        try {
          const [mealsRes, chefsRes] = await Promise.all([
            mealService.getActiveMeals(),
            chefService.getVerifiedChefs(),
          ]);

          const allMeals = (mealsRes.data || []).map(normalizePublicMeal);
          const allChefs = (chefsRes.data || []).map(normalizeChef);

          const q = trimmedQuery.toLowerCase();

          const filteredMeals = allMeals.filter(meal => 
            meal.name?.toLowerCase().includes(q) ||
            meal.description?.toLowerCase().includes(q) ||
            meal.chefName?.toLowerCase().includes(q)
          ).slice(0, 5);

          const filteredChefs = allChefs.filter(chef => 
            chef.brandName?.toLowerCase().includes(q) ||
            chef.chefName?.toLowerCase().includes(q)
          ).slice(0, 3);

          setResults({ meals: filteredMeals, chefs: filteredChefs });
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults({ meals: [], chefs: [] });
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isFocused]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      const currentQuery = query.trim();
      setQuery(""); // Clear the input
      const url = new URL(window.location.origin + basePath);
      url.searchParams.set("q", currentQuery);
      router.push(url.pathname + url.search);
    }
  };

  const handleResultClick = (type, id) => {
    setIsOpen(false);
    setQuery(""); // Clear the input
    if (type === "meal") {
      router.push(`/meals/${id}`);
    } else {
      router.push(`/chefs/${id}`);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <div className={`relative flex flex-1 items-center ${inputClassName}`}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-4 text-text-secondary"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.trim().length > 1) setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full rounded-full bg-transparent py-2.5 pl-12 pr-10 outline-none placeholder:text-text-secondary/60"
          />
          {isLoading && (
            <div className="absolute right-4 scale-50">
              <Loader size={24} />
            </div>
          )}
        </div>
        {showButton && (
          <button
            type="submit"
            className={`ml-2 rounded-full bg-primary px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-container hover:shadow-md active:scale-95 ${buttonClassName}`}
          >
            Search
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {isOpen && (results.meals.length > 0 || results.chefs.length > 0) && (
        <div className="absolute top-full mt-3 w-full overflow-hidden rounded-3xl border border-outline/10 bg-surface/95 backdrop-blur-md py-3 shadow-2xl z-50 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.meals.length > 0 && (
            <div className="px-2 pb-3">
              <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary/70">
                Popular Dishes
              </div>
              <div className="space-y-1">
                {results.meals.map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => handleResultClick("meal", meal.id)}
                    className="group flex w-full items-center gap-4 rounded-2xl px-4 py-2.5 text-left transition-all hover:bg-primary/5 active:bg-primary/10"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary-container">
                      <img
                        src={meal.image || "/meal1.jpg"}
                        alt={meal.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-[15px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {meal.name}
                      </div>
                      <div className="flex items-center gap-2 truncate text-xs text-text-secondary/80">
                        <span className="font-medium text-primary/80">{meal.price} EGP</span>
                        <span className="h-1 w-1 rounded-full bg-outline/30" />
                        <span>{meal.chefName}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.chefs.length > 0 && (
            <div className={`px-2 pt-3 ${results.meals.length > 0 ? "border-t border-outline/5" : ""}`}>
              <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary/70">
                Top Chefs
              </div>
              <div className="space-y-1">
                {results.chefs.map((chef) => (
                  <button
                    key={chef.id}
                    onClick={() => handleResultClick("chef", chef.id)}
                    className="group flex w-full items-center gap-4 rounded-2xl px-4 py-2.5 text-left transition-all hover:bg-primary/5 active:bg-primary/10"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary-container ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <img
                        src={chef.image || "/chef1.jpg"}
                        alt={chef.brandName}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-[15px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {chef.brandName}
                      </div>
                      <div className="truncate text-xs text-text-secondary/80">
                        {chef.specialty}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            className="mt-3 block w-full border-t border-outline/5 py-4 text-center text-xs font-bold text-primary hover:bg-primary/5 hover:tracking-wide transition-all"
          >
            Show all results for &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
