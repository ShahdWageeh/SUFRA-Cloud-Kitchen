import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCartShopping,
  faShieldHeart,
  faStar,
  faTruckFast,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { chefProfileResponse } from "@/data/chefProfileData";

const statIconMap = {
  rating: faStar,
  orders: faTruckFast,
  followers: faUsers,
};

function Rating({ value, compact = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-primary">
      <FontAwesomeIcon
        icon={faStar}
        className={compact ? "h-2.5 w-2.5" : "h-3 w-3"}
      />
      <span className={compact ? "text-[10px]" : "text-xs"}>{value}</span>
    </span>
  );
}

function MealCard({ meal }) {
  return (
    <article className="overflow-hidden rounded-md bg-white shadow-[0_12px_35px_rgba(27,28,28,0.08)] ring-1 ring-primary/10">
      <div className="relative aspect-[1.45] overflow-hidden">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          sizes="(max-width: 768px) 100vw, 31vw"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm">
          {meal.price}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold leading-snug text-text-primary">
            {meal.name}
          </h3>
          <Rating value={meal.rating} compact />
        </div>
        <p className="mt-2 min-h-10 text-xs leading-5 text-text-secondary">
          {meal.description}
        </p>
        <button className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-secondary-container text-xs font-semibold text-text-secondary transition hover:bg-primary hover:text-white">
          <FontAwesomeIcon icon={faCartShopping} className="h-3 w-3" />
          {meal.cta}
        </button>
      </div>
    </article>
  );
}

function TestimonialCard({ review }) {
  return (
    <article className="rounded-md bg-white p-5 shadow-sm ring-1 ring-primary/10">
      <div className="flex gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md">
          <Image
            src={review.image}
            alt={review.author}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="mb-1 flex gap-0.5 text-primary">
            {Array.from({ length: review.rating }).map((_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className="h-2.5 w-2.5"
              />
            ))}
          </div>
          <p className="text-xs leading-5 text-text-secondary">
            {review.quote}
          </p>
          <p className="mt-3 text-xs font-bold text-text-primary">
            {review.author}
          </p>
          <p className="text-[10px] text-text-secondary">{review.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function ChefProfilePage() {
  const { chef, offerings, reviews } = chefProfileResponse.data;

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
              {offerings.eyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-bold">Signature Offerings</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {offerings.filters.map((filter, index) => (
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
        <div className="grid gap-5 md:grid-cols-3">
          {offerings.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </section>

      <section className="bg-secondary-container/45">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{reviews.title}</h2>
              <p className="mt-1 text-sm text-text-secondary">
                {reviews.subtitle}
              </p>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-white px-4 py-2 text-xs font-semibold text-text-secondary transition hover:border-primary hover:text-primary">
              {reviews.cta}
              <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.items.map((review) => (
              <TestimonialCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
