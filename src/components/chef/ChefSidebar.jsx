"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Wallet,
  BadgeCheck,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/chef/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Meal Listings",
    href: "/chef/meals",
    icon: UtensilsCrossed,
  },
  {
    label: "Orders",
    href: "/chef/orders",
    icon: ShoppingBag,
  },
  {
    label: "Revenue",
    href: "/chef/revenue",
    icon: Wallet,
  },
  {
    label: "Branding",
    href: "/chef/branding",
    icon: BadgeCheck,
  },
];

function isNavItemActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ChefSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const chefName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`
    : "Chef";
  const chefTitle = user?.kitchenName || user?.role || "Chef";
  const initials = user?.firstName
    ? `${user.firstName[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "CH";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-72 flex-col
          border-r border-[#e9dfdc]
          bg-[#fcf9f8]
          px-6 py-7
          transition-transform duration-300

          lg:sticky
          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}

        <div>
          <div className="flex items-center gap-2">
<Image src="/icon.png" alt="logo" width="30" height="30"></Image>
          <h1 className="text-[2rem] font-semibold leading-tight text-[#2d201b]">
            Sufra
          </h1>
          </div>
          

          <p className="mt-1 text-sm text-[#7e6a63]">Chef Portal</p>
        </div>

        {/* Navigation */}

        <nav className="mt-10 flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "border-l-2 border-[#964326] bg-[#f6efed] font-medium text-[#964326]"
                    : "text-[#5f5652] hover:bg-[#f3ece9]"
                }`}
              >
                <span>
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Account Section */}

        <div className="border-t border-[#e9dfdc] pt-5">
          <Link
            href="/chef/meals/create"
            onClick={onClose}
            className="mb-4 block w-full rounded-xl bg-[#964326] py-3 text-center text-[14px] font-bold text-white transition hover:bg-[#7d3820]"
          >
            Create New Listing
          </Link>

          <Link
            href="/chef/profile"
            onClick={onClose}
            className="rounded-2xl bg-[#f2ece9] p-3 block hover:bg-[#e9e1dd] transition"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d7a27f] to-[#8f4e32] text-xs font-semibold text-white">
                {initials}
              </div>

              <div>
                <p className="text-sm font-semibold text-[#352822]">
                  {chefName}
                </p>

                <p className="text-xs text-[#7e6a63]">{chefTitle}</p>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              onClose();
              handleLogout();
            }}
            className="mt-4 w-full rounded-xl border border-[#d6c3b8] bg-white py-3 text-sm font-semibold text-[#5f5652] transition hover:bg-[#f3ece9]"
          >
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
