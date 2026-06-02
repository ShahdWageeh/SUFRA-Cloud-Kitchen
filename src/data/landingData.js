import {
  faUtensils,
  faLeaf,
  faCakeCandles,
  faBreadSlice,
  faBurger,
  faBowlFood,
} from "@fortawesome/free-solid-svg-icons";

export const categories = [
  {
    id: 1,
    title: "Traditional",
    icon: faUtensils,
  },
  {
    id: 2,
    title: "Vegan",
    icon: faLeaf,
  },
  {
    id: 3,
    title: "Desserts",
    icon: faCakeCandles,
  },
  {
    id: 4,
    title: "Breads",
    icon: faBreadSlice,
  },
  {
    id: 5,
    title: "Stews",
    icon: faBowlFood,
  },
  {
    id: 6,
    title: "Street Food",
    icon: faBurger,
  },
];

export const meals = [
  {
    id: 1,
    title: "Levantine Harvest Salad",
    chef: "Chef Amina",
    price: 12.5,
    rating: 4.9,
    image: "/meal1.jpg",
    description:
      "Fresh seasonal greens with zesty lemon tahini dressing and toasted pine nuts.",
  },

  {
    id: 2,
    title: "Saffron Lamb Tagine",
    chef: "Chef Maria",
    price: 24,
    rating: 5,
    image: "/meal2.jpg",
    description: "Slow-cooked lamb with apricots, almonds and aromatic spices.",
  },

  {
    id: 3,
    title: "Wild Yeast Sourdough",
    chef: "Chef Omar",
    price: 8,
    rating: 4.8,
    image: "/meal3.jpg",
    description: "36-hour fermented artisan sourdough with a crisp crust.",
  },

  {
    id: 4,
    title: "Hyderabadi Biryani",
    chef: "Chef Fatima",
    price: 18.5,
    rating: 4.9,
    image: "/meal4.jpg",
    description:
      "Traditional chicken biryani layered with saffron basmati rice.",
  },
];

export const chefs = [
  {
    id: 1,
    name: "Chef Amina",
    specialty: "Couscous Royal",
    rating: 4.9,
    reviews: 120,
    image: "/chef1.jpg",
  },

  {
    id: 2,
    name: "Chef Karim",
    specialty: "Spicy Ramen",
    rating: 5.0,
    reviews: 85,
    image: "/chef2.jpg",
  },

  {
    id: 3,
    name: "Chef Ibrahim",
    specialty: "Lamb Kabsa",
    rating: 4.8,
    reviews: 200,
    image: "/chef3.jpg",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    role: "Food Enthusiast",
    text: "Finally, food that actually tastes like my grandmother's cooking. No commercial restaurant can replicate this level of soul and tradition.",
  },

  {
    id: 2,
    name: "Chef Amina",
    role: "Partner Chef",
    text: "Becoming a chef on Matbakhna changed my life. I can share my heritage and support my family from my own kitchen.",
  },

  {
    id: 3,
    name: "Michael R.",
    role: "Regular Customer",
    text: "The AI planner is surprisingly accurate! It introduced me to dishes I'd never tried before but now absolutely love.",
  },
];
