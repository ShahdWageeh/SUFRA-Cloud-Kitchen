"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function VerificationGuard({ children }) {
  const router = useRouter();

  const { loading, user, isAuthenticated, redirectChefByVerification } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "chef") {
      router.replace("/");
      return;
    }

    redirectChefByVerification();
  }, [loading, isAuthenticated, user, router, redirectChefByVerification]);

  if (loading) return null;

  if (!user) return null;

  if (user.role !== "chef") return null;

  return children;
}
