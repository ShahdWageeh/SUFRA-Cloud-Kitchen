"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, Settings, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
const sectionTitles = [
  { key: "/chef/dashboard", title: "Dashboard" },
  { key: "/chef/meals", title: "Manage Meals" },
  { key: "/chef/orders", title: "Orders" },
  { key: "/chef/revenue", title: "Revenue" },
  { key: "/chef/onboarding", title: "Onboarding" },
];

function getSectionTitle(pathname) {
  const match = sectionTitles.find(
    (item) => pathname === item.key || pathname.startsWith(`${item.key}/`),
  );

  return match?.title ?? "Chef Portal";
}

export default function ChefTopbar({ onMenuClick }) {
  const pathname = usePathname();
  const title = getSectionTitle(pathname);
  const { theme, toggleTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#efe4df] bg-[#fcf9f8] px-4 py-4 md:px-8">
        {/* Left Side */}

        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-lg border border-[#eaded8] bg-white p-2 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <h2 className="text-lg font-semibold text-[#2f221d] md:text-2xl">
            {title}
          </h2>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop Search */}

          <label className="hidden h-10 w-80 items-center rounded-full border border-[#eaded8] bg-white px-4 md:flex">
            <span className="mr-2 text-sm text-[#8f7f78]">⌕</span>

            <input
              type="text"
              placeholder="Search your kitchen..."
              className="w-full bg-transparent text-sm text-[#3f3531] outline-none placeholder:text-[#ad9f98]"
            />
          </label>

          {/* Mobile Search Button */}

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eaded8] bg-white text-[#624c44] hover:bg-[#f8f2ef] md:hidden"
            aria-label="Search"
          >
            <Search size={16} className="mr-2 text-[#8f7f78]" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eaded8] bg-white text-[#624c44] hover:bg-[#f8f2ef]"
          >
            {theme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eaded8] bg-white text-[#624c44] hover:bg-[#f8f2ef]"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eaded8] bg-white text-[#624c44] hover:bg-[#f8f2ef]"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Search Overlay */}

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 md:hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-lg">
              <span className="text-[#8f7f78]">
                <Search size={18} className="text-[#8f7f78]" />{" "}
              </span>

              <input
                autoFocus
                type="text"
                placeholder="Search your kitchen..."
                className="flex-1 bg-transparent text-sm outline-none"
              />

              <button
                onClick={() => setSearchOpen(false)}
                className="text-sm font-medium text-[#964326]"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
