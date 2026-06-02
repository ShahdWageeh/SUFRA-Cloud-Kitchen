import Image from "next/image";
import {
  Plus,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";

import { listingAnalytics, mealListings } from "@/data/chefMealsData";

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

export default function MealsPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-[#7e6a63] md:text-base">
          You have 12 active meal listings today.
        </p>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-[#964326] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#82402a]"
        >
          <Plus size={16} />
          Create New Listing
        </button>
      </div>

      {/* Analytics */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {listingAnalytics.map((item) => (
          <article
            key={item.label}
            className="rounded-[20px] border border-[#EDE6E3] bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-[13px] font-medium text-[#7A6560]">
              {item.label}
            </p>

            <p className="mt-2 text-[34px] font-extrabold text-[#1E1410]">
              {item.value}
            </p>
          </article>
        ))}
      </section>

      {/* Meals Table */}

      <section className="overflow-hidden rounded-[24px] border border-[#EDE6E3] bg-white">
        {/* Filters */}

        <div className="flex flex-col gap-4 border-b border-[#EFE4DF] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#F5EFEC] px-4 py-2 text-sm text-[#5f4b44]"
            >
              Category
              <span className="font-medium text-[#964326]">All</span>
              <ChevronDown size={15} />
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-[#F5EFEC] px-4 py-2 text-sm text-[#5f4b44]"
            >
              Status
              <span className="font-medium text-[#964326]">Active</span>
              <ChevronDown size={15} />
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-[#5f4b44] transition hover:text-[#964326]"
          >
            <SlidersHorizontal size={16} />
            More Filters
          </button>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#F2E9E5] text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Meal Details
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Category
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Price
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B7E78]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {mealListings.map((meal, index) => (
                <tr
                  key={meal.id}
                  className={
                    index !== mealListings.length - 1
                      ? "border-b border-[#F5EFEC]"
                      : ""
                  }
                >
                  {/* Meal */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#f5efec]">
                        {meal.image ? (
                          <Image
                            src={meal.image}
                            alt={meal.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d5ab89] to-[#8d5033] text-xs font-bold text-white">
                            {meal.name
                              .split(" ")
                              .slice(0, 2)
                              .map((word) => word[0])
                              .join("")}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-[#2A211D]">
                          {meal.name}
                        </p>

                        <p className="text-sm text-[#8B7A73]">
                          {meal.updatedAt}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}

                  <td className="px-6 py-5 text-[#3E322D]">{meal.category}</td>

                  {/* Price */}

                  <td className="px-6 py-5 font-semibold text-[#251E1B]">
                    {formatPrice(meal.price)}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        meal.status === "Active"
                          ? "bg-[#E4F5F1] text-[#1F7F6E]"
                          : "bg-[#F2F2F2] text-[#6E6D6D]"
                      }`}
                    >
                      {meal.status}
                    </span>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#6f625d] transition hover:bg-[#F5EFEC] hover:text-[#964326]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="rounded-lg p-2 text-[#6f625d] transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="flex flex-col gap-3 border-t border-[#EFE4DF] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#7D6D67]">
            Showing {mealListings.length} of 24 meals
          </p>

          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DAD4] text-[#7B6B64] hover:bg-[#F6EFEB]">
              <ChevronLeft size={16} />
            </button>

            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#964326] text-white">
              1
            </button>

            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DAD4] text-[#7B6B64] hover:bg-[#F6EFEB]">
              2
            </button>

            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DAD4] text-[#7B6B64] hover:bg-[#F6EFEB]">
              3
            </button>

            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7DAD4] text-[#7B6B64] hover:bg-[#F6EFEB]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="flex flex-col items-center justify-between gap-6 rounded-[24px] border border-[#EFD8CF] bg-[#F7D7C9] px-6 py-8 md:flex-row md:px-8">
        <div>
          <h3 className="text-2xl font-extrabold text-[#35231C] md:text-3xl">
            Want to increase visibility?
          </h3>

          <p className="mt-3 max-w-2xl text-[#634B42]">
            Adding high-quality photography to your listings increases
            conversions significantly. Learn how to make your dishes stand out
            and attract more customers.
          </p>

          <button
            type="button"
            className="mt-5 rounded-full bg-[#964326] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7F3920]"
          >
            Read Guide
          </button>
        </div>

        <div className="flex h-32 w-52 items-center justify-center rounded-3xl bg-[#FFF4EF] text-[#964326]">
          <UtensilsCrossed size={64} />
        </div>
      </section>
    </div>
  );
}
