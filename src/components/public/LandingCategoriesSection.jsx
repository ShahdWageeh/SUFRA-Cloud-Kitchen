"use client";

import { useEffect, useState } from "react";
import CategoriesSlider from "@/components/ui/CategoriesSlider";
import { categoryService } from "@/services";

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCategory(category) {
  return {
    id: category._id || category.id,
    title: category.name || category.title,
    slug: category.slug || slugify(category.name || category.title || category._id),
    image: category.image,
  };
}

export default function LandingCategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoading(true);
        setError("");
        const response = await categoryService.getActiveCategories();
        const nextCategories = (response.data || []).map(normalizeCategory);

        if (isMounted) {
          setCategories(nextCategories);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Categories are unavailable right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Explore Categories
          </h2>
        </div>

        {isLoading ? (
          <p className="text-text-secondary">Loading categories...</p>
        ) : error ? (
          <p className="text-text-secondary">{error}</p>
        ) : (
          <CategoriesSlider categories={categories} />
        )}
      </div>
    </section>
  );
}
