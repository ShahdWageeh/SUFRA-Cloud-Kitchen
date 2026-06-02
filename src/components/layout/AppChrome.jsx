"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const AUTH_ROUTES = ["/login", "/forgot-password", "/reset-password", "/register"];

export default function AppChrome({ children }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname?.startsWith(route));

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main className={`grow ${isAuthRoute ? "bg-background" : "bg-gray-50"}`}>
        {children}
      </main>
      {!isAuthRoute && <Footer />}
    </>
  );
}
