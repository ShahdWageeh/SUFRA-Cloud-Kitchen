import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";

export default function MealCard({ meal, featured = false }) {
  return (
    <article className={`overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-primary/10 transition hover:-translate-y-1 hover:shadow-xl ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/meals/${meal.id}`} className="block focus:outline-none focus:ring-2 focus:ring-primary">
        <div className={`relative overflow-hidden ${featured ? "aspect-[1.65]" : "aspect-[1.25]"}`}>
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 44vw" : "(max-width: 768px) 100vw, 24vw"}
            className="object-cover"
            loading={featured ? "eager" : "lazy"}
            unoptimized
          />
          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm">
            ${meal.price}
          </span>
          {meal.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {meal.badge}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/meals/${meal.id}`} className="text-base font-bold leading-snug text-text-primary hover:text-primary">
              {meal.name}
            </Link>
            <p className="mt-1 text-xs font-semibold text-text-secondary">by {meal.chefName}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
            <FontAwesomeIcon icon={faStar} className="h-3 w-3" />
            {meal.rating}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">{meal.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-text-tertiary">{meal.cuisine}</span>
          <Link href={`/meals/${meal.id}`} className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white">
            <FontAwesomeIcon icon={faCartShopping} className="h-3 w-3" />
            View Meal
          </Link>
        </div>
      </div>
    </article>
  );
}
