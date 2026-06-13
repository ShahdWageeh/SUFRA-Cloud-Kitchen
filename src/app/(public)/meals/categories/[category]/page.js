import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faMagnifyingGlass,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import CategoryMealsGrid from "@/components/public/CategoryMealsGrid";
import { categoryService } from "@/services";
import { normalizeCategory, normalizeMeal } from "@/utils/mealUtils";
import { SearchInput } from "@/components/ui";

async function getCategoryMealsData(categorySlugOrId) {
  const state = {
    isLoading: false,
    error: null,
  };

  try {
    const { category, categories, meals } =
      await categoryService.getCategoryPageData(categorySlugOrId);

    return {
      ...state,
      data: {
        category: category ? normalizeCategory(category) : null,
        categories: categories.map(normalizeCategory),
        meals: meals.map(normalizeMeal),
      },
    };
  } catch (error) {
    return {
      ...state,
      error: error.response?.data?.message || error.message,
      data: { category: null, categories: [], meals: [] },
    };
  }
}

function formatCategory(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function CategoryPage({ params, searchParams }) {
  const { category } = await params;
  const { q = "" } = (await searchParams) || {};
  const { data, error } = await getCategoryMealsData(category);
  const title = data.category?.label || formatCategory(category);
  const featuredMeal = data.meals[0];

  const filteredMeals = q 
    ? data.meals.filter(meal => 
        meal.title?.toLowerCase().includes(q.toLowerCase()) || 
        meal.description?.toLowerCase().includes(q.toLowerCase()) ||
        meal.chef?.toLowerCase().includes(q.toLowerCase())
      )
    : data.meals;

  return (
    <main className="bg-background text-text-primary">
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* ... */}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <SearchInput
          placeholder={`Search ${title.toLowerCase()} meals...`}
          className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-primary/10"
          inputClassName="bg-background rounded-md"
          showButton={true}
          basePath={`/meals/categories/${category}`}
        />

        {/* ... */}

        {error || filteredMeals.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-primary/10">
            <h2 className="text-xl font-bold">No meals found</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {q ? `No meals found matching "${q}" in this category.` : `There are no meals in this category yet. Check back soon or explore all meals.`}
            </p>
            <Link
              href="/meals"
              className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-bold text-white"
            >
              Browse All Meals
            </Link>
          </div>
        ) : (
          <CategoryMealsGrid meals={filteredMeals} />
        )}
      </section>
    </main>
  );
}
