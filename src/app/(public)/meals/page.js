import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import MealsGrid from "@/components/public/MealsGrid";
import { categoryService, mealService } from "@/services";
import { normalizeCategory, normalizePublicMeal } from "@/utils/mealUtils";
import { SearchInput } from "@/components/ui";

async function getMealsPageData() {
  const state = {
    isLoading: false,
    error: null,
  };

  try {
    const [mealsResponse, categoriesResponse] = await Promise.all([
      mealService.getActiveMeals(),
      categoryService.getActiveCategories(),
    ]);

    const meals = (mealsResponse.data || []).map(normalizePublicMeal);
    const categories = (categoriesResponse.data || []).map(normalizeCategory);

    return {
      ...state,
      data: { categories, meals },
    };
  } catch (error) {
    return {
      ...state,
      error: error.response?.data?.message || error.message,
      data: { categories: [], meals: [] },
    };
  }
}

export default async function MealsPage({ searchParams }) {
  const { q = "" } = (await searchParams) || {};
  const { data, error } = await getMealsPageData();
  
  const filteredMeals = q 
    ? data.meals.filter(meal => 
        meal.name?.toLowerCase().includes(q.toLowerCase()) || 
        meal.description?.toLowerCase().includes(q.toLowerCase()) ||
        meal.chefName?.toLowerCase().includes(q.toLowerCase()) ||
        meal.categoryLabel?.toLowerCase().includes(q.toLowerCase())
      )
    : data.meals;

  return (
    <main className="bg-background text-text-primary">
      <section className="bg-secondary-container">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Discover home-cooked meals</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Explore Authentic Flavors
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Discover handmade meals crafted by passionate chefs in your community. Fresh food, real stories, and unforgettable flavor.
          </p>

          <SearchInput
            placeholder="Search meals, cuisines or chefs..."
            className="mx-auto mt-7 max-w-3xl rounded-lg bg-white p-3 shadow-[0_14px_35px_rgba(27,28,28,0.08)]"
            inputClassName="bg-background ring-1 ring-primary/10 rounded-md"
            showButton={true}
            basePath="/meals"
          />

          {/* ... */}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Browse CloudKitchen picks</h2>
            <p className="mt-1 text-sm text-text-secondary">{filteredMeals.length} meals available today</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/meals" className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white">
              All
            </Link>
            {data.categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/meals/categories/${category.slug || category.id}`}
                className="rounded-full border border-primary/15 bg-white px-4 py-2 text-xs font-bold text-text-secondary transition hover:border-primary hover:text-primary"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            We could not load meals right now.
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            {q ? `No meals found matching "${q}"` : "No meals are available right now. Check back soon."}
          </div>
        ) : (
          <MealsGrid meals={filteredMeals} />
        )}
      </section>
    </main>
  );
}
