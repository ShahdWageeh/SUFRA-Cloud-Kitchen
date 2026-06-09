"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function GuestGuard({ children }) {
  const router = useRouter();

  const { loading, user, isAuthenticated, redirectChefByVerification } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      switch (user.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;

        case "chef":
          redirectChefByVerification();
          break;

        default:
          router.replace("/customer/dashboard");
      }
    }
  }, [loading, isAuthenticated, user, router, redirectChefByVerification]);

  if (loading) return null;

  if (isAuthenticated) return null;

  return children;
}
