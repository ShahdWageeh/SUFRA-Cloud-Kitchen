"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
    label: "Onboarding",
    href: "/chef/onboarding",
    icon: BadgeCheck,
  },
];

function isNavItemActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function ChefSidebar({ isOpen, onClose }) {
  const pathname = usePathname();

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
          <h1 className="text-[2rem] font-semibold leading-tight text-[#2d201b]">
            Sofra
          </h1>

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
          <button
            type="button"
            className="mb-4 w-full rounded-xl bg-[#964326] py-3 text-[14px] font-bold text-white transition hover:bg-[#7d3820]"
          >
            Create New Listing
          </button>

          <div className="rounded-2xl bg-[#f2ece9] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#d7a27f] to-[#8f4e32] text-xs font-semibold text-white">
                CA
              </div>

              <div>
                <p className="text-sm font-semibold text-[#352822]">
                  Chef Amina
                </p>

                <p className="text-xs text-[#7e6a63]">Master Baker</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
