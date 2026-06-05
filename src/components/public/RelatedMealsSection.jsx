import Link from "next/link";
import MealCard from "@/components/public/MealCard";

export default function RelatedMealsSection({ meals, chefName }) {
  if (!meals?.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">More from {chefName}</h2>
          <p className="mt-1 text-sm text-text-secondary">Freshly prepared favorites from the same kitchen.</p>
        </div>
        <Link href="/meals" className="text-xs font-bold text-primary">
          View all
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
}
