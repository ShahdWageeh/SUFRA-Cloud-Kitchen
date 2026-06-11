"use client";

import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { buildLoginUrl } from "@/utils/authRedirects";

export default function AddToCartButton({ className, children, mealId, quantity = 1 }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated, isCustomer } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  const isLoading = authLoading || cartLoading;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    if (!isAuthenticated || !isCustomer) {
      router.push(buildLoginUrl(pathname));
      return;
    }

    try {
      await addToCart(mealId, quantity);
    } catch (error) {
      // Error handled by context toast
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}
