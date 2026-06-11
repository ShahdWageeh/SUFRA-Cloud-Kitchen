import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faTruckFast,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import MealsGrid from "@/components/public/MealsGrid";
import { chefService, mealService } from "@/services";
import { isVerifiedChef, normalizeChefProfile } from "@/utils/chefUtils";
import { normalizePublicMeal } from "@/utils/mealUtils";

const statIconMap = {
  rating: faStar,
  orders: faTruckFast,
  followers: faUsers,
};

const OFFERING_FILTERS = ["All Items", "Main Course", "Sides", "Desserts"];

async function getChefProfileData(chefId) {
  const state = {
    isLoading: false,
    error: null,
  };

  try {
    const [chefResponse, mealsResponse] = await Promise.all([
      chefService.getChefById(chefId),
      mealService.getActiveMeals({ chefId }),
    ]);

    const chefData = chefResponse.data;
    const chef =
      chefData && isVerifiedChef(chefData)
        ? normalizeChefProfile(chefData)
        : null;

    if (!chef) {
      return { ...state, data: { chef: null, meals: [] } };
    }

    const meals = (mealsResponse.data || [])
      .map(normalizePublicMeal)
      .filter((meal) => meal.chefId === chef.id);

    return { ...state, data: { chef, meals } };
  } catch (error) {
    return {
      ...state,
      error: error.response?.data?.message || error.message,
      data: { chef: null, meals: [] },
    };
  }
}

export default async function ChefProfilePage({ params }) {
  const { chefId } = await params;
  const { data, error } = await getChefProfileData(chefId);
  const chef = data.chef;

  if (error || !chef) {
    return (
      <main className="bg-background px-4 py-16 text-center text-text-primary">
        <h1 className="text-3xl font-bold">Chef not found</h1>
        <p className="mt-2 text-sm text-text-secondary">This chef profile is unavailable right now.</p>
        <Link href="/chefs" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-xs font-bold text-white">
          Back to Chefs
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <section className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="relative h-52 overflow-hidden rounded-t-md sm:h-64 lg:h-72">
          <Image
            src={chef.coverImage}
            alt={`${chef.brandName} kitchen cover`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="relative mx-auto -mt-10 max-w-5xl rounded-md bg-white p-5 shadow-[0_14px_40px_rgba(27,28,28,0.10)] ring-1 ring-primary/10 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                src={chef.avatar}
                alt={chef.brandName}
                fill
                sizes="96px"
                className="object-cover"
              />
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-teal-500" />
            </div>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{chef.brandName}</h1>
                  <p className="mt-1 text-sm font-semibold text-primary">
                    <span aria-hidden="true">&ldquo;</span>
                    {chef.slogan}
                    <span aria-hidden="true">&rdquo;</span>
                  </p>
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
                {chef.bio}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3 sm:max-w-lg">
                {chef.stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-center gap-2 rounded-md bg-secondary-container px-3 py-2"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FontAwesomeIcon
                        icon={statIconMap[stat.id]}
                        className="h-3.5 w-3.5"
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">
                        {stat.value}
                      </span>
                      <span className="block text-[10px] uppercase tracking-wide text-text-secondary">
                        {stat.label}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
              Top Chefs Menu
            </p>
            <h2 className="mt-1 text-2xl font-bold">Signature Offerings</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {OFFERING_FILTERS.map((filter, index) => (
              <button
                key={filter}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  index === 0
                    ? "bg-primary text-white"
                    : "border border-primary/20 bg-white text-text-secondary hover:border-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {data.meals.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-sm text-text-secondary ring-1 ring-primary/10">
            This chef has not published any active meals yet.
          </div>
        ) : (
          <MealsGrid
            meals={data.meals}
            gridClassName="grid gap-5 md:grid-cols-3"
            buttonLabel="Load More Meals"
          />
        )}
      </section>
    </main>
  );
}
