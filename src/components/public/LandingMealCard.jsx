import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";

export default function LandingMealCard({ meal }) {
  const mealName = meal.title || meal.name;
  const chefName = meal.chef || meal.chefName;
  const mealHref = `/meals/${meal.id}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition flex flex-col">
      <Link href={mealHref} className="relative block h-60 focus:outline-none focus:ring-2 focus:ring-primary">
        <Image
          src={meal.image}
          alt={mealName}
          fill
          className="object-cover"
          unoptimized
        />

        <span className="absolute top-4 right-4 bg-secondary-container px-3 py-1 rounded-full font-semibold">
          EGP {meal.price}
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between mb-3">
          <Link href={mealHref} className="font-bold text-lg hover:text-primary">
            {mealName}
          </Link>

          <span className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
            {meal.rating}
          </span>
        </div>

        <div className="flex-1 border-b border-primary-container pb-5 mb-5">
          <p className="text-text-secondary">{meal.description}</p>
        </div>

        <div className="flex justify-between items-center gap-3">
          <span className="font-medium">{chefName}</span>

          <Link
            href={mealHref}
            className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            <FontAwesomeIcon icon={faCartShopping} className="h-3 w-3" />
            View Meal
          </Link>
        </div>
      </div>
    </div>
  );
}
