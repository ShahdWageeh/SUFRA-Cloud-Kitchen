"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { buildLoginUrl } from "@/utils/authRedirects";

export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.replace(buildLoginUrl(pathname));
      return;
    }

    if (!allowedRoles?.includes(user.role)) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, pathname]);

  if (loading) return null;

  if (!user) return null;

  if (!allowedRoles?.includes(user.role)) return null;

  return children;
}
