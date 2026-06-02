import { ShoppingBag, DollarSign, UtensilsCrossed, Star } from "lucide-react";

export const dashboardMetrics = [
  {
    id: 1,
    label: "Total Orders",
    value: "1,284",
    trend: "+12%",
    icon: ShoppingBag,
    iconBg: "#FDE9DE",
  },
  {
    id: 2,
    label: "Monthly Revenue",
    value: "$4,850.00",
    icon: DollarSign,
    iconBg: "#D9FAF4",
  },
  {
    id: 3,
    label: "Active Meals",
    value: "18",
    suffix: "Dishes",
    icon: UtensilsCrossed,
    iconBg: "#F2F0E7",
  },
  {
    id: 4,
    label: "Average Rating",
    value: "4.9",
    suffix: "(210 reviews)",
    icon: Star,
    iconBg: "#FFF1D9",
  },
];

export const recentOrders = [
  {
    id: "#MK-8821",
    customer: "Sarah Jenkins",
    meal: "Traditional Kabsa",
    status: "Preparing",
    total: 45,
  },
  {
    id: "#MK-8820",
    customer: "Ahmed Al-Farsi",
    meal: "Stuffed Vine Leaves",
    status: "Ready",
    total: 32,
  },
  {
    id: "#MK-8819",
    customer: "Lina Roberts",
    meal: "Lamb Mansaf",
    status: "Delivering",
    total: 58,
  },
  {
    id: "#MK-8818",
    customer: "Youssef K.",
    meal: "Mezze Platter Large",
    status: "Completed",
    total: 28,
  },
];

export const popularMeals = [
  {
    id: "popular-1",
    name: "Traditional Lamb Mansaf",
    ordersThisMonth: 142,
    price: 58,
    tag: "#1 Top Seller",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "popular-2",
    name: "Smoky Chicken Mandi",
    ordersThisMonth: 98,
    price: 42,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1604908176997-431f6f7f3f0c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "popular-3",
    name: "Deluxe Mezze Platter",
    ordersThisMonth: 76,
    price: 36,
    tag: null,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop",
  },
];
