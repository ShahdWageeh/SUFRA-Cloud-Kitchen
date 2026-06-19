"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildLoginUrl } from "@/utils/authRedirects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Brain, Moon, Sun } from "lucide-react";

import {
  faBars,
  faXmark,
  faBell,
  faCartShopping,
  faMagnifyingGlass,
  faChevronDown,
  faRightFromBracket,
  faReceipt,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { SearchInput } from "@/components/ui";
import CustomerNotificationBell from "@/components/customer/CustomerNotificationBell";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const loginHref = buildLoginUrl(pathname);
  const { user, isCustomer, logout } = useAuth();
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const customerName =
    user?.firstName || user?.name?.split(" ")?.[0] || user?.email || "Customer";
  const avatarInitial = customerName.charAt(0).toUpperCase();
  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline/20 backdrop-blur">
      <nav className="container mx-auto h-18 px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/icon.png" alt="logo" width="50" height="50"></Image>
          <Link href="/" className="text-2xl font-bold text-primary">
            SUFRA
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden text-sm md:flex items-center gap-8">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === "/"
                ? "text-primary font-semibold"
                : "hover:text-primary"
            }`}
          >
            Browse
          </Link>

          <Link
            href="/about"
            className={`transition-colors ${
              isActive("/about")
                ? "text-primary font-semibold"
                : "hover:text-primary"
            }`}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={`transition-colors ${
              isActive("/contact")
                ? "text-primary font-semibold"
                : "hover:text-primary"
            }`}
          >
            Contact
          </Link>
          {isCustomer ? null : (
            <Link
              href="/register/chef"
              className="hover:text-primary transition-colors"
            >
              Become a Chef
            </Link>
          )}
        </div>

        {/* Search */}
        <SearchInput
          placeholder="Search dishes..."
          className="hidden lg:flex w-72"
          inputClassName="border-primary-container border bg-secondary-container rounded-full"
        />

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-surface text-text-primary transition hover:border-primary hover:bg-secondary-container"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </button>

          {isCustomer ? (
            <CustomerNotificationBell />
          ) : (
            <button>
              <FontAwesomeIcon icon={faBell} className="text-lg" />
            </button>
          )}

          <Link
            href={isCustomer ? "/customer/cart" : loginHref}
            className="relative"
          >
            <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
            {isCustomer && cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isCustomer ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-surface p-1 pr-3 shadow-sm transition hover:border-primary"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {avatarInitial}
                </span>
                <span className="hidden max-w-24 truncate text-sm font-semibold text-text-primary sm:block">
                  {customerName}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`hidden h-3 w-3 text-text-secondary transition sm:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-primary/10 bg-surface py-2 shadow-xl"
                >
                  <Link
                    href="/customer/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-secondary-container hover:text-primary"
                    role="menuitem"
                  >
                    <FontAwesomeIcon
                      icon={faTableColumns}
                      className="h-4 w-4"
                    />
                    Dashboard
                  </Link>
                  <Link
                    href="/customer/orders"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-secondary-container hover:text-primary"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faReceipt} className="h-4 w-4" />
                    Orders
                  </Link>
                  <Link
                    href="/customer/meal-planner"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-secondary-container hover:text-primary"
                    role="menuitem"
                  >
                    <Brain size={16} />
                    {/* <FontAwesomeIcon icon={faReceipt} className="h-4 w-4" /> */}
                    Meal Planner
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      logout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    role="menuitem"
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="h-4 w-4"
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={loginHref}
              className="hidden ml-3 sm:block bg-primary text-white px-8 py-2 rounded-full hover:opacity-90 transition"
            >
              Sign In
            </Link>
          )}

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <FontAwesomeIcon
              icon={open ? faXmark : faBars}
              className="text-xl"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}

      {open && (
        <div className="md:hidden border-t border-outline/20 bg-surface">
          <div className="flex flex-col gap-5 p-5">
            <Link href="/">Browse</Link>

            <Link href="/about">About</Link>

            <Link href="/contact">Contact</Link>

            <Link href="/register/chef">Become a Chef</Link>

            {isCustomer ? (
              <>
                <Link href="/customer/dashboard" onClick={closeMenus}>
                  Dashboard
                </Link>

                <Link href="/customer/orders" onClick={closeMenus}>
                  Orders
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    logout();
                  }}
                  className="bg-primary text-center text-white py-3 rounded-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href={loginHref}
                className="bg-primary text-center text-white py-3 rounded-full"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
