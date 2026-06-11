"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, user, isAuthenticated } = useAuth();

  useEffect(() => {
    // If we're on the login page itself, don't guard
    if (pathname === "/admin/login") return;
    
    if (loading) return;

    // Check if user is authenticated and has admin role
    if (!isAuthenticated || !user || user.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
  }, [loading, isAuthenticated, user, router, pathname]);

  // If loading, show nothing or a spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If on login page, allow rendering
  if (pathname === "/admin/login") return children;

  // Final check before rendering protected content
  if (!user || user.role !== "admin") return null;

  return children;
}
