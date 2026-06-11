"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {
  hasBlockStatusFields,
  isCustomerBlocked,
} from "@/utils/userStatus";

export default function BannedGuard({ children }) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user || user.role !== "customer") return;

    let cancelled = false;

    async function enforceBan() {
      let profile = user;

      if (!hasBlockStatusFields(user)) {
        const refreshed = await refreshUser();
        if (refreshed) profile = refreshed;
      }

      if (!cancelled && isCustomerBlocked(profile)) {
        router.replace("/banned");
      }
    }

    enforceBan();

    return () => {
      cancelled = true;
    };
  }, [user, loading, router, refreshUser]);

  if (loading) return null;

  if (user?.role === "customer" && isCustomerBlocked(user)) {
    return null;
  }

  return children;
}
