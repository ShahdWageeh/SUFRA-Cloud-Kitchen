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
        <div className="relative overflow-hidden rounded-xl bg-text-primary">
          <div className="relative h-72 sm:h-80">
            <Image
              src={data.category?.image || featuredMeal?.image || "/heroEnhance.jpeg"}
              alt={`${title} meals`}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-black/10" />
          </div>
          <div className="absolute inset-0 flex items-center px-6 sm:px-10">
            <div className="max-w-xl text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-white/75">Category Collection</p>
              <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title} Delights</h1>
              <p className="mt-3 text-sm leading-6 text-white/85">
                Explore handpicked {title.toLowerCase()} meals from trusted local chefs, made fresh with tradition and care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <SearchInput
          placeholder={`Search ${title.toLowerCase()} meals...`}
          className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-primary/10"
          inputClassName="bg-background rounded-md"
          showButton={true}
          basePath={`/meals/categories/${category}`}
        />

         <div className="mt-7 flex gap-5 overflow-x-auto border-b border-primary/10 pb-3">
          <Link href="/meals" className="shrink-0 text-sm font-bold text-primary">
            All Clients
          </Link>
          {data.categories.map((item) => (
            <Link
              key={item.id}
              href={`/meals/categories/${item.slug || item.id}`}
              className={`shrink-0 text-sm font-bold ${item.slug === category || item.id === category ? "text-primary" : "text-text-secondary"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

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
