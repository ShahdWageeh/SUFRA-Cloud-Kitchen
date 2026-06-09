import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, SlidersHorizontal, Pencil, Trash2 } from "lucide-react";

// Helper utilities for pricing
export function formatPrice(price) {
  return `$${(price || 0).toFixed(2)}`;
}

//DYNAMIC ANALYTICS COUNTERS COMPONENT
export function AnalyticsGrid({ analytics }) {
  const cards = [
    { label: "Total Listings", value: analytics.totalListings },
    { label: "Active Items", value: analytics.activeListings },
    { label: "Inactive Items", value: analytics.inactiveListings },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((item) => (
        <article
          key={item.label}
          className="rounded-[20px] border border-[#EDE6E3] bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-[13px] font-medium text-[#7A6560]">{item.label}</p>
          <p className="mt-2 text-[34px] font-extrabold text-[#1E1410]">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}

//FILTERS CONTROL BAR 
export function TableFilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  catDropdownOpen,
  setCatDropdownOpen,
  statusDropdownOpen,
  setStatusDropdownOpen,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#EFE4DF] px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-3 z-30">
        {/* Category State Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setCatDropdownOpen(!catDropdownOpen);
              setStatusDropdownOpen(false);
            }}
            className="flex items-center gap-2 rounded-full bg-[#F5EFEC] px-4 py-2 text-sm text-[#5f4b44] font-medium transition hover:bg-[#ebdcd5]"
          >
            Category:{" "}
            <span className="text-[#964326] font-bold">{selectedCategory}</span>
            <ChevronDown size={15} />
          </button>

          {catDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl border border-[#EDE6E3] bg-white shadow-xl py-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setCatDropdownOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm font-medium hover:bg-[#fff6f1] ${selectedCategory === "All" ? "text-[#964326] bg-[#fff6f1]" : "text-[#2A211D]"}`}
              >
                All Categories
              </button>
              {categories.map((catName) => (
                <button
                  key={catName}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(catName);
                    setCatDropdownOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm font-medium hover:bg-[#fff6f1] ${selectedCategory === catName ? "text-[#964326] bg-[#fff6f1]" : "text-[#2A211D]"}`}
                >
                  {catName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status State Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setStatusDropdownOpen(!statusDropdownOpen);
              setCatDropdownOpen(false);
            }}
            className="flex items-center gap-2 rounded-full bg-[#F5EFEC] px-4 py-2 text-sm text-[#5f4b44] font-medium transition hover:bg-[#ebdcd5]"
          >
            Status:{" "}
            <span className="text-[#964326] font-bold">{selectedStatus}</span>
            <ChevronDown size={15} />
          </button>

          {statusDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 rounded-xl border border-[#EDE6E3] bg-white shadow-xl py-1">
              {["All", "Active", "Inactive"].map((statusOption) => (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(statusOption);
                    setStatusDropdownOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm font-medium hover:bg-[#fff6f1] ${selectedStatus === statusOption ? "text-[#964326] bg-[#fff6f1]" : "text-[#2A211D]"}`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MealTableRow({ meal, isLast, onToggleStatus, onDelete }) {
  return (
    <tr className={!isLast ? "border-b border-[#F5EFEC]" : ""}>
      {/* Meal Details Image + Metadata */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#f5efec] shrink-0">
            {meal.image ? (
              <Image
                src={meal.image}
                alt={meal.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#d5ab89] to-[#8d5033] text-xs font-bold text-white">
                {meal.name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-[#2A211D]">{meal.name}</p>
            <p className="text-sm text-[#8B7A73]">Updated {meal.updatedAt}</p>
          </div>
        </div>
      </td>

      {/* Category Label */}
      <td className="px-6 py-5 text-[#3E322D] font-medium">{meal.category}</td>

      {/* Price Label */}
      <td className="px-6 py-5 font-bold text-[#251E1B]">
        {formatPrice(meal.price)}
      </td>

      {/* Interactive Status Toggle */}
      <td className="px-6 py-5">
        <button
          type="button"
          onClick={() => onToggleStatus(meal.id, meal.status)}
          className={`inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
            meal.status === "Active"
              ? "bg-[#E4F5F1] text-[#1F7F6E] hover:bg-[#d4eee6]"
              : "bg-[#F2F2F2] text-[#6E6D6D] hover:bg-[#e4e4e4]"
          }`}
        >
          {meal.status}
        </button>
      </td>

      {/* Actions Group */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <Link
            href={`/chef/meals/${meal.id}/edit`}
            className="rounded-lg p-2 text-[#6f625d] transition hover:bg-[#F5EFEC] hover:text-[#964326]"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(meal.id)}
            className="rounded-lg p-2 text-[#6f625d] transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
