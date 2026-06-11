"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChefHat,
  Users,
  ShoppingBag,
  Shield,
  UtensilsCrossed,
  BarChart2,
  Plus,
  X,
  ShieldIcon,
} from "lucide-react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  { id: "chefs", label: "Chefs", icon: ChefHat, href: "/admin/chefs" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "contacts", label: "Contacts", icon: ShoppingBag, href: "/admin/contacts" },
  {
    id: "categories",
    label: "Categories",
    icon: UtensilsCrossed,
    href: "/admin/categories",
  },
  {
    id: "verifications",
    label: "Verifications",
    icon: ShieldIcon,
    href: "/admin/verifications",
  },
];

function SidebarContent({ pathname, setMobileOpen }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Logo */}
        <div className="px-6 pt-8 pb-6">
          <div className="leading-none">
            <div
              className="text-4xl font-bold tracking-tight"
              style={{ color: "#A55632", fontFamily: "Georgia, serif" }}
            >
              Sufra
            </div>
            {/* <div
              className="text-4xl font-bold tracking-tight"
              style={{ color: "#A55632", fontFamily: "Georgia, serif" }}
            >
              Ra
            </div> */}
          </div>
          <div className="text-xs text-gray-400 mt-2 font-medium tracking-widest uppercase">
            Admin Console
          </div>
        </div>

        {/* Divider */}
        <div
          className="mx-6 mb-6 border-t"
          style={{ borderColor: "#ECE8E5" }}
        />

        {/* Nav */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group"
                style={{
                  color: isActive ? "#A55632" : "#8A8A8A",
                  backgroundColor: isActive ? "#F0E8E2" : "transparent",
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ backgroundColor: "#A55632" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* New Report Button */}
      <div className="px-4 pb-8 mt-4">
        <button
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#A55632" }}
        >
          <Plus size={16} />
          New Report
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile close button */}
      {mobileOpen && (
        <button
          className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-600"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40
          h-screen w-[240px] flex-shrink-0
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ backgroundColor: "#F6F4F3" }}
      >
        <SidebarContent pathname={pathname} setMobileOpen={setMobileOpen} />
      </aside>

      {/* Desktop spacer */}
      <div className="hidden lg:block w-[240px] flex-shrink-0" />
    </>
  );
}
