"use client";

import { useState } from "react";
import ChefSidebar from "@/components/chef/ChefSidebar";
import ChefTopbar from "@/components/chef/ChefTopbar";

export default function ChefLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#faf8f6]">
      <ChefSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChefTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
