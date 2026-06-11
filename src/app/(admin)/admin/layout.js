"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/layout/Sidebar";
import TopHeader from "@/components/admin/layout/TopHeader";
import { AdminGuard } from "@/guards";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminLoginPage = pathname === "/admin/login";

  return (
    <AdminGuard>
      {isAdminLoginPage ? (
        children
      ) : (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
          <Sidebar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <div className="flex flex-1 flex-col  min-w-0">
            <TopHeader setMobileOpen={setMobileOpen} />

            <main className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}
