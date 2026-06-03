// TODO: Replace this mock response with GET /api/chefs/:chefId/profile.
export const chefProfileResponse = {
  status: "success",
  data: {
    chef: {
      id: "chef-maria",
      brandName: "Chef Maria",
      slogan: "Authentic Italian soul in every bite",
      avatar: "/chef1.jpg",
      coverImage: "/chefback.jpg",
      bio:
        "Born and raised in the heart of Tuscany, my cooking is a love letter to my grandmother's kitchen. I believe that food tells stories of comfort, ordinary joys, and generous care. Every recipe is made with locally sourced organic ingredients and slow, thoughtful preparation.",
      rating: 4.9,
      reviewsCount: 126,
      ordersCount: 320,
      followersCount: "5k",
      stats: [
        { id: "rating", value: "4.9/5", label: "Rating" },
        { id: "orders", value: "320", label: "Orders" },
        { id: "followers", value: "5k", label: "Followers" },
      ],
      actions: {
        follow: "Follow",
        order: "Book Catering",
      },
    },
    offerings: {
      eyebrow: "Top Chefs Menu",
      title: "Signature Offerings",
      filters: ["All Items", "Main Course", "Sides", "Desserts"],
      meals: [
        {
          id: "tagliatelle-ragu",
          name: "Grandma's Tagliatelle al Ragu",
          price: "$34.00",
          rating: 4.9,
          image: "/meal1.jpg",
          description:
            "Hand-rolled ribbons of fresh pasta wrapped in slow-simmered tomato, beef, and herb ragu.",
          cta: "Add to Cart",
        },
        {
          id: "lasagna",
          name: "Five-Layer Lasagna Bianca",
          price: "$22.50",
          rating: 4.8,
          image: "/meal2.jpg",
          description:
            "A delicate white lasagna with creamy bechamel, spinach, and artisan cheeses.",
          cta: "Add to Cart",
        },
        {
          id: "tiramisu",
          name: "Artisanal Tiramisu",
          price: "$12.00",
          rating: 5.0,
          image: "/meal3.jpg",
          description:
            "Velvety mascarpone, espresso-soaked ladyfingers, and a dusting of cocoa.",
          cta: "Add to Cart",
        },
      ],
    },
    reviews: {
      title: "What Guests are Saying",
      subtitle: "100 authentic reviews from our community",
      cta: "View All Reviews",
      items: [
        {
          id: "review-1",
          author: "Lisa Chen",
          role: "Verified Food Lover",
          rating: 5,
          image: "/chef2.jpg",
          quote:
            "The Ragu was exactly like the one I had in Florence growing up. You can taste the hours of slow cooking. Chef Maria is a treasure.",
        },
        {
          id: "review-2",
          author: "Saif Youssef",
          role: "Weekend Host",
          rating: 5,
          image: "/chef3.jpg",
          quote:
            "Everything arrived perfectly packaged and still warm. The lasagna Bianca is heavenly. We love ordering every weekend.",
        },
      ],
    },
  },
};
