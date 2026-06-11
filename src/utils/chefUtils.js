export function isVerifiedChef(chef) {
  return chef?.isVerified === true;
}

export function filterVerifiedChefs(chefs) {
  return (chefs || []).filter(isVerifiedChef);
}

export function getChefDisplayName(chef) {
  const firstName = chef.firstName || "";
  const lastName = chef.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName ? `Chef ${fullName}` : "Chef";
}

export function normalizeChef(chef) {
  const id = String(chef._id || chef.id);
  const chefName = getChefDisplayName(chef);
  const brandName = chef.kitchenName || chefName;

  return {
    id,
    brandName,
    chefName,
    specialty: chef.slogan || chef.cuisine || "Home Chef",
    rating: chef.averageRating || chef.rating || 4.8,
    reviews: chef.reviewsCount || chef.reviews || 0,
    distance: chef.distance || "Nearby",
    image: chef.profileImage || chef.avatar || chef.image || "/chef1.jpg",
    coverImage: chef.coverImage || chef.kitchenCover || "/chefback.jpg",
    bio: chef.description || chef.bio || "",
    isVerified: Boolean(chef.isVerified),
  };
}

export function normalizeFeaturedChef(chef) {
  const normalized = normalizeChef(chef);

  return {
    id: normalized.id,
    name: normalized.brandName,
    specialty: normalized.specialty,
    rating: normalized.rating,
    reviews: normalized.reviews,
    image: normalized.image,
  };
}

export function normalizeChefProfile(chef) {
  const normalized = normalizeChef(chef);

  return {
    id: normalized.id,
    brandName: normalized.brandName,
    slogan: chef.slogan || "Fresh flavors from our kitchen to yours",
    avatar: normalized.image,
    coverImage: normalized.coverImage,
    bio:
      normalized.bio ||
      "Passionate home chef sharing authentic homemade meals with the community.",
    stats: [
      { id: "rating", value: `${normalized.rating}/5`, label: "Rating" },
      {
        id: "orders",
        value: String(chef.ordersCount || chef.totalOrders || "—"),
        label: "Orders",
      },
      {
        id: "followers",
        value: chef.followersCount || (normalized.isVerified ? "Verified" : "—"),
        label: "Followers",
      },
    ],
  };
}
