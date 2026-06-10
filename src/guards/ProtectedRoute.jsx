"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { buildLoginUrl } from "@/utils/authRedirects";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(buildLoginUrl(pathname));
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) return null;

  if (!isAuthenticated) return null;

  return children;
}
