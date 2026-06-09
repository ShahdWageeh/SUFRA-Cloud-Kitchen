import api from "./api";
import { slugify } from "@/utils/mealUtils";

function matchesCategory(category, identifier) {
  const id = String(category._id || category.id || "");
  const slug = category.slug || slugify(category.name || category.title);

  return id === identifier || slug === identifier;
}

export const categoryService = {
  async getActiveCategories(params = {}) {
    const response = await api.get("/categories/active-with-meals", { params });
    return response.data;
  },

  async getCategoryPageData(categorySlugOrId, { mealsLimit = 50 } = {}) {
    const response = await this.getActiveCategories({ limit: mealsLimit });
    const categories = response.data || [];
    const category = categories.find((item) =>
      matchesCategory(item, categorySlugOrId),
    );

    return {
      category,
      categories,
      meals: category?.meals || [],
    };
  },
};

export default categoryService;
