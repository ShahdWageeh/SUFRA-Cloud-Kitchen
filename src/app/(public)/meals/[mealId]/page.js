import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faChevronLeft,
  faClock,
  faHeart,
  faMinus,
  faPlus,
  faShieldHeart,
  faStar,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { mealsResponse } from "@/data/mealsData";

const RelatedMealsSection = dynamic(() => import("@/components/public/RelatedMealsSection"), {
  loading: () => <div className="mt-12 h-64 rounded-xl bg-secondary-container" />,
});

async function getMealDetailData(mealId) {
  const state = {
    isLoading: false,
    error: null,
  };

  try {
    // TODO: Replace local data with API call.
    // GET /api/meals/:mealId
    const meal = mealsResponse.data.meals.find((item) => item.id === mealId);
    const relatedMeals = mealsResponse.data.meals
      .filter((item) => item.id !== mealId && (item.chefId === meal?.chefId || item.category === meal?.category))
      .slice(0, 4);

    return { ...state, data: { meal, relatedMeals } };
  } catch (error) {
    return { ...state, error: error.message, data: { meal: null, relatedMeals: [] } };
  }
}

export default async function MealDetailPage({ params }) {
  const { mealId } = await params;
  const { data, error } = await getMealDetailData(mealId);
  const meal = data.meal;

  if (error || !meal) {
    return (
      <main className="bg-background px-4 py-16 text-center text-text-primary">
        <h1 className="text-3xl font-bold">Meal not found</h1>
        <p className="mt-2 text-sm text-text-secondary">This meal is unavailable right now.</p>
        <Link href="/meals" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-bold text-white">
          Back to Meals
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-background text-text-primary">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/meals" className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary">
          <FontAwesomeIcon icon={faChevronLeft} className="h-3 w-3" />
          Back to meals
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="relative aspect-[1.15] overflow-hidden rounded-xl bg-secondary-container shadow-sm">
              <Image src={meal.image} alt={meal.name} fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" />
              <button aria-label={`Save ${meal.name}`} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-md">
                <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[meal.image, "/meal2.jpg", "/meal3.jpg", "/meal4.jpg"].map((image, index) => (
                <div key={image + index} className="relative aspect-square overflow-hidden rounded-md bg-secondary-container ring-1 ring-primary/10">
                  <Image src={image} alt={`${meal.name} preview ${index + 1}`} fill sizes="120px" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-primary/10 lg:p-8">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{meal.cuisine} - {meal.category.replace("-", " ")}</p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{meal.name}</h1>
                <p className="mt-2 text-sm font-semibold text-text-secondary">by {meal.chefName}</p>
              </div>
              <span className="text-2xl font-extrabold text-primary">${meal.price}</span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-text-secondary">
              <span className="rounded-full bg-secondary-container px-3 py-2">
                <FontAwesomeIcon icon={faStar} className="mr-1 h-3 w-3 text-primary" />
                {meal.rating} ({meal.reviews} reviews)
              </span>
              <span className="rounded-full bg-secondary-container px-3 py-2">
                <FontAwesomeIcon icon={faClock} className="mr-1 h-3 w-3 text-primary" />
                Ready in 45 min
              </span>
              <span className="rounded-full bg-secondary-container px-3 py-2">
                <FontAwesomeIcon icon={faTruckFast} className="mr-1 h-3 w-3 text-primary" />
                Delivery available
              </span>
            </div>

            <p className="mt-6 text-sm leading-7 text-text-secondary">{meal.description}</p>

            <div className="mt-6">
              <h2 className="text-sm font-bold">Ingredients</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {meal.ingredients.map((ingredient) => (
                  <span key={ingredient} className="rounded-full bg-secondary-container px-3 py-2 text-xs font-semibold text-text-secondary">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            <Link href={`/chefs/${meal.chefId}`} className="mt-6 flex items-center gap-4 rounded-lg bg-background p-4 ring-1 ring-primary/10 transition hover:ring-primary">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FontAwesomeIcon icon={faShieldHeart} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-bold">{meal.chefName}</span>
                <span className="block text-xs text-text-secondary">Verified home chef - view profile</span>
              </span>
            </Link>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-12 w-36 items-center justify-between rounded-full border border-primary/20 px-4">
                <button aria-label="Decrease quantity" className="text-primary">
                  <FontAwesomeIcon icon={faMinus} className="h-3 w-3" />
                </button>
                <span className="font-bold">1</span>
                <button aria-label="Increase quantity" className="text-primary">
                  <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                </button>
              </div>
              <button className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-container">
                <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </article>
        </div>

        <section className="mt-12 rounded-xl bg-white p-6 shadow-sm ring-1 ring-primary/10">
          <h2 className="text-xl font-bold">Community Reviews</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {["Amazing flavor and generous portions.", "Tasted like a meal from home."].map((review) => (
              <article key={review} className="rounded-lg bg-background p-4">
                <div className="mb-2 text-primary">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="mr-0.5 h-3 w-3" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary">{review}</p>
              </article>
            ))}
          </div>
        </section>

        <RelatedMealsSection meals={data.relatedMeals} chefName={meal.chefName} />
      </section>
    </main>
  );
}
