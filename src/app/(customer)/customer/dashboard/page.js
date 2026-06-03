import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCartShopping,
  faHeart,
  faLocationDot,
  faMagnifyingGlass,
  faPlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { customerDashboardResponse } from "@/data/customerDashboardData";

function SectionHeader({ title, subtitle, cta }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-text-secondary">{subtitle}</p>}
      </div>
      {cta && (
        <button className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
          {cta}
          <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
}

function CuisineCard({ cuisine }) {
  return (
    <button className="group flex min-w-20 flex-col items-center gap-2 text-center">
      <span className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary-container ring-1 ring-primary/10 transition group-hover:ring-primary">
        {cuisine.image ? (
          <Image src={cuisine.image} alt={cuisine.name} fill sizes="64px" className="object-cover" />
        ) : (
          <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-outline" />
        )}
      </span>
      <span className="text-xs font-semibold text-text-secondary">{cuisine.name}</span>
    </button>
  );
}

function ChefCard({ chef }) {
  return (
    <article className="rounded-md bg-white p-4 text-center shadow-sm ring-1 ring-primary/10">
      <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full">
        <Image src={chef.image} alt={chef.name} fill sizes="64px" className="object-cover" />
      </div>
      <h3 className="mt-3 text-sm font-bold">{chef.name}</h3>
      <p className="text-xs text-text-secondary">{chef.specialty}</p>
      <p className="mt-2 text-[11px] text-text-secondary">
        <FontAwesomeIcon icon={faStar} className="mr-1 h-2.5 w-2.5 text-primary" />
        {chef.rating} - {chef.distance}
      </p>
      <button className="mt-3 h-9 w-full rounded-full border border-primary px-4 text-xs font-bold text-primary transition hover:bg-primary hover:text-white">
        {chef.cta}
      </button>
    </article>
  );
}

function MealCard({ meal }) {
  return (
    <article className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-primary/10">
      <div className="relative aspect-[1.45] overflow-hidden">
        <Image src={meal.image} alt={meal.name} fill sizes="(max-width: 768px) 100vw, 28vw" className="object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
          {meal.price}
        </span>
        <button aria-label={`Save ${meal.name}`} className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-text-secondary transition hover:text-primary">
          <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold leading-snug">{meal.name}</h3>
          <span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-bold text-teal-700">
            {meal.rating}
          </span>
        </div>
        <p className="mt-1 text-xs leading-5 text-text-secondary">{meal.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">{meal.chef}</span>
          <button aria-label={`Order ${meal.name}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-container">
            <FontAwesomeIcon icon={faCartShopping} className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
}

function KitchenCard({ kitchen }) {
  return (
    <article className="min-w-56 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-primary/10">
      <div className="relative aspect-[1.7] overflow-hidden">
        <Image src={kitchen.image} alt={kitchen.name} fill sizes="224px" className="object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white">
          {kitchen.badge}
        </span>
      </div>
      <div className="flex items-center gap-3 p-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-full">
          <Image src={kitchen.chefImage} alt={`${kitchen.name} chef`} fill sizes="36px" className="object-cover" />
        </div>
        <div>
          <h3 className="text-xs font-bold">{kitchen.name}</h3>
          <p className="text-[10px] text-text-secondary">
            <FontAwesomeIcon icon={faLocationDot} className="mr-1 h-2.5 w-2.5 text-primary" />
            {kitchen.distance}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const {
    customer,
    hero,
    cuisines,
    topChefs,
    recommendedMeals,
    featuredMeal,
    nearbyKitchens,
  } = customerDashboardResponse.data;

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-text-primary sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-md bg-white px-5 py-7 shadow-sm ring-1 ring-primary/5 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {hero.greetingPrefix} <span className="text-primary">{customer.firstName}!</span>
            </h1>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">{hero.subtitle}</p>
            <p className="mt-2 text-sm text-text-secondary">{hero.description}</p>
          </div>

          <form className="mt-6 flex max-w-3xl flex-col gap-3 rounded-md bg-background p-3 shadow-[0_12px_30px_rgba(27,28,28,0.08)] sm:flex-row sm:items-center">
            <label className="flex min-h-11 flex-1 items-center gap-3 rounded-md bg-white px-4 ring-1 ring-primary/10">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 text-outline" />
              <span className="sr-only">Search meals, cuisines or chefs</span>
              <input
                type="search"
                placeholder={hero.searchPlaceholder}
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-outline"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {hero.quickFilters.map((filter) => (
                <button key={filter} type="button" className="h-9 rounded-md border border-primary/15 bg-white px-4 text-xs font-bold text-text-secondary transition hover:border-primary hover:text-primary">
                  {filter}
                </button>
              ))}
            </div>
            <button type="submit" className="h-9 rounded-md bg-primary px-5 text-xs font-bold text-white transition hover:bg-primary-container">
              Search
            </button>
          </form>
        </section>

        <section className="mt-8">
          <SectionHeader title={cuisines.title} cta={cuisines.cta} />
          <div className="flex gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-6 md:overflow-visible">
            {cuisines.items.map((cuisine) => (
              <CuisineCard key={cuisine.id} cuisine={cuisine} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SectionHeader title={topChefs.title} subtitle={topChefs.subtitle} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topChefs.items.map((chef) => (
              <ChefCard key={chef.id} chef={chef} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <SectionHeader title={recommendedMeals.title} />
          <div className="grid gap-5 md:grid-cols-3">
            {recommendedMeals.items.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-xl bg-[#f0d6ce] p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_1.05fr] md:items-center">
            <div>
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                {featuredMeal.eyebrow}
              </span>
              <h2 className="mt-4 max-w-sm text-3xl font-bold leading-tight">{featuredMeal.name}</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">{featuredMeal.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full bg-primary px-5 py-3 text-xs font-bold text-white transition hover:bg-primary-container">
                  {featuredMeal.primaryCta}
                </button>
                <button className="rounded-full border border-primary px-5 py-3 text-xs font-bold text-primary transition hover:bg-primary hover:text-white">
                  {featuredMeal.secondaryCta}
                </button>
              </div>
            </div>
            <div className="relative aspect-[1.65] overflow-hidden rounded-lg shadow-[0_22px_35px_rgba(27,28,28,0.25)]">
              <Image src={featuredMeal.image} alt={featuredMeal.name} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            </div>
          </div>
        </section>

        <section className="mt-10 pb-8">
          <SectionHeader title={nearbyKitchens.title} cta={nearbyKitchens.cta} />
          <div className="flex gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-4 lg:overflow-visible">
            {nearbyKitchens.items.map((kitchen) => (
              <KitchenCard key={kitchen.id} kitchen={kitchen} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
