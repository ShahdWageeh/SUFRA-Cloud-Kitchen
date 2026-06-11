export function getChefName(chef) {
  if (!chef) return "Chef";
  if (typeof chef === "string") return chef;

  const name = [chef.firstName, chef.lastName].filter(Boolean).join(" ");
  return name ? `Chef ${name}` : chef.kitchenName || chef.name || "Chef";
}

function getCategoryInfo(meal) {
  const categories = meal.categories || [];
  const primaryCategory = categories[0] || meal.category;

  if (!primaryCategory) {
    return { slug: "", label: "Homemade" };
  }

  if (typeof primaryCategory === "object") {
    const label = primaryCategory.name || primaryCategory.title || "Homemade";
    return {
      slug: primaryCategory.slug || slugify(label),
      label,
    };
  }

  const label = String(primaryCategory);
  return {
    slug: slugify(label),
    label,
  };
}

function getMealImages(meal) {
  if (meal.mealImages?.length) return meal.mealImages;
  if (meal.images?.length) return meal.images;
  if (meal.image) return [meal.image];
  return ["/meal1.jpg"];
}

export function normalizePublicMeal(meal) {
  const chef = meal.chefId || meal.chef;
  const rawChefId = typeof chef === "object" ? chef._id || chef.id : chef;
  const chefId = rawChefId ? String(rawChefId) : null;
  const { slug: category, label: categoryLabel } = getCategoryInfo(meal);
  const images = getMealImages(meal);

  const reviews = (meal.reviews?.length > 0) ? meal.reviews : (meal.recentReviews || meal.reviews || []);
  const reviewsCount = meal.reviewsCount ?? reviews.length;

  return {
    id: meal._id || meal.id,
    name: meal.name || meal.title,
    chefName: getChefName(chef),
    chefId,
    category,
    categoryLabel,
    cuisine: meal.cuisine || categoryLabel,
    price: meal.price,
    rating: typeof meal.averageRating === "number" ? meal.averageRating : (meal.rating || meal.ratingAverage || 4.8),
    reviews,
    reviewsCount,
    image: images[0],
    images,
    badge: meal.badge,
    description: meal.description || "",
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
  };
}

export function normalizeMeal(meal) {
  const normalized = normalizePublicMeal(meal);

  return {
    id: normalized.id,
    title: normalized.name,
    chef: normalized.chefName,
    price: normalized.price,
    rating: normalized.rating,
    image: normalized.image,
    description: normalized.description,
  };
}

export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeCategory(category) {
  return {
    id: category._id || category.id,
    label: category.name || category.title,
    slug: category.slug || slugify(category.name || category.title || category._id),
    image: category.image,
  };
}
