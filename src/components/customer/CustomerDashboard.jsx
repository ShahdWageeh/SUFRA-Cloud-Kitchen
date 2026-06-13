"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCartShopping,
  faHeart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import CategoriesSlider from "@/components/ui/CategoriesSlider";
import AddToCartButton from "@/components/public/AddToCartButton";
import useAuth from "@/hooks/useAuth";
import { categoryService, chefService, mealService } from "@/services";
import { normalizeChef } from "@/utils/chefUtils";
import { normalizeCategory, normalizePublicMeal } from "@/utils/mealUtils";

function SectionHeader({ title, subtitle, cta, ctaHref }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>}
      </div>
      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary"
        >
          {cta}
          <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" />
        </Link>
      )}
    </div>
  );
}

function toDashboardChef(chef) {
  const normalized = normalizeChef(chef);

  return {
    id: normalized.id,
    name: normalized.brandName,
    specialty: normalized.specialty,
    image: normalized.image,
    rating: normalized.rating,
    distance: normalized.distance,
    cta: "View Menu",
  };
}

function toDashboardMeal(meal) {
  const normalized = normalizePublicMeal(meal);

  return {
    id: normalized.id,
    name: normalized.name,
    price: `$${normalized.price}`,
    image: normalized.image,
    rating: normalized.rating,
    chef: normalized.chefName,
    description: normalized.description,
  };
}

function toFeaturedMeal(meal) {
  const normalized = normalizePublicMeal(meal);

  return {
    id: normalized.id,
    eyebrow: "Popular Today",
    name: normalized.name,
    description: normalized.description,
    image: normalized.image,
    primaryCta: "Order Now",
    secondaryCta: "View Details",
  };
}

function DashboardChefCard({ chef }) {
  return (
    <article className="rounded-md bg-white p-4 text-center shadow-sm ring-1 ring-primary/10">
      <Link href={`/chefs/${chef.id}`} className="block">
        <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full">
          <Image src={chef.image} alt={chef.name} fill sizes="64px" className="object-cover" />
        </div>
        <h3 className="mt-3 text-sm font-bold hover:text-primary">{chef.name}</h3>
        <p className="text-xs text-text-secondary">{chef.specialty}</p>
        <p className="mt-2 text-[11px] text-text-secondary">
          <FontAwesomeIcon icon={faStar} className="mr-1 h-2.5 w-2.5 text-primary" />
          {chef.rating} - {chef.distance}
        </p>
      </Link>
      <Link
        href={`/chefs/${chef.id}`}
        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full border border-primary px-4 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
      >
        {chef.cta}
      </Link>
    </article>
  );
}

function DashboardMealCard({ meal }) {
  return (
    <article className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-primary/10">
      <Link href={`/meals/${meal.id}`} className="block">
        <div className="relative aspect-[1.45] overflow-hidden">
          <Image src={meal.image} alt={meal.name} fill sizes="(max-width: 768px) 100vw, 28vw" className="object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
            {meal.price}
          </span>
          <button
            type="button"
            aria-label={`Save ${meal.name}`}
            onClick={(event) => event.preventDefault()}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-text-secondary transition hover:text-primary"
          >
            <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/meals/${meal.id}`} className="text-sm font-bold leading-snug hover:text-primary">
            {meal.name}
          </Link>
          <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">
            {meal.rating}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-text-secondary">{meal.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">{meal.chef}</span>
          <AddToCartButton
            mealId={meal.id}
            aria-label={`Order ${meal.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-container"
          >
            <FontAwesomeIcon icon={faCartShopping} className="h-3 w-3" />
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}


export default function CustomerDashboard() {
  const { user, refreshUser } = useAuth();
  const [categories, setCategories] = useState([]);
  const [topChefs, setTopChefs] = useState([]);
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [featuredMeal, setFeaturedMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const firstName = user?.firstName || "there";

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError("");

        const [categoriesResponse, chefsResponse, mealsResponse] = await Promise.all([
          categoryService.getActiveCategories(),
          chefService.getVerifiedChefs(),
          mealService.getActiveMeals(),
        ]);

        if (!isMounted) return;

        const sliderCategories = (categoriesResponse.data || []).map((category) => {
          const normalized = normalizeCategory(category);
          return {
            id: normalized.id,
            title: normalized.label,
            slug: normalized.slug,
            image: normalized.image,
          };
        });

        const chefs = (chefsResponse.data || []).slice(0, 4).map(toDashboardChef);
        const meals = (mealsResponse.data || []).map(normalizePublicMeal);

        setCategories(sliderCategories);
        setTopChefs(chefs);
        setRecommendedMeals(meals.slice(0, 3).map(toDashboardMeal));
        setFeaturedMeal(meals.length ? toFeaturedMeal(meals[meals.length - 1]) : null);
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Dashboard content is unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-text-primary sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-md bg-white px-5 py-7 shadow-sm ring-1 ring-primary/5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Welcome back, <span className="text-primary">{firstName}!</span>
            </h1>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">What are you craving today?</p>
            <p className="mt-2 text-sm text-text-secondary">
              Authentic home-cooked meals from the best chefs in your neighborhood.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader title="Explore Cuisines" cta="See All" ctaHref="/meals/categories" />
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading cuisines...</p>
          ) : error ? (
            <p className="text-sm text-text-secondary">{error}</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-text-secondary">No categories available right now.</p>
          ) : (
            <CategoriesSlider categories={categories} />
          )}
        </section>

        <section className="mt-8">
          <SectionHeader
            title="Top-Rated Local Chefs"
            subtitle={`Home chefs trusted by ${firstName} and your neighbors`}
          />
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading chefs...</p>
          ) : topChefs.length === 0 ? (
            <p className="text-sm text-text-secondary">No verified chefs available right now.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topChefs.map((chef) => (
                <DashboardChefCard key={chef.id} chef={chef} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <SectionHeader title={`Recommended for ${firstName}`} />
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading recommendations...</p>
          ) : recommendedMeals.length === 0 ? (
            <p className="text-sm text-text-secondary">No meal recommendations available right now.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {recommendedMeals.map((meal) => (
                <DashboardMealCard key={meal.id} meal={meal} />
              ))}
            </div>
          )}
        </section>

        {featuredMeal && (
          <section className="mt-10 overflow-hidden rounded-xl bg-[#f0d6ce] p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_1.05fr] md:items-center">
              <div>
                <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  {featuredMeal.eyebrow}
                </span>
                <h2 className="mt-4 max-w-sm text-3xl font-bold leading-tight">{featuredMeal.name}</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
                  {featuredMeal.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <AddToCartButton
                    mealId={featuredMeal.id}
                    className="rounded-full bg-primary px-5 py-3 text-xs font-bold text-white transition hover:bg-primary-container"
                  >
                    {featuredMeal.primaryCta}
                  </AddToCartButton>
                  <Link
                    href={`/meals/${featuredMeal.id}`}
                    className="rounded-full border border-primary px-5 py-3 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                  >
                    {featuredMeal.secondaryCta}
                  </Link>
                </div>
              </div>
              <Link
                href={`/meals/${featuredMeal.id}`}
                className="relative block aspect-[1.65] overflow-hidden rounded-lg shadow-[0_22px_35px_rgba(27,28,28,0.25)]"
              >
                <Image
                  src={featuredMeal.image}
                  alt={featuredMeal.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
