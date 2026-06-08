"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();

  const { loading, user } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) return;

    if (!allowedRoles?.includes(user?.role)) {
      router.replace("/");
    }
  }, [loading, user, allowedRoles, router]);

  if (loading) return null;

  if (!user) return null;

  if (!allowedRoles?.includes(user?.role)) return null;

  return children;
}
