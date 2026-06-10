"use client";

import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { buildLoginUrl } from "@/utils/authRedirects";

export default function AddToCartButton({ className, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated, isCustomer } = useAuth();

  const handleClick = () => {
    if (loading) return;

    if (!isAuthenticated || !isCustomer) {
      router.push(buildLoginUrl(pathname));
      return;
    }

    // Cart integration can be wired here when available.
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
