"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildLoginUrl } from "@/utils/authRedirects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const loginHref = buildLoginUrl(pathname);
  const { user, isCustomer, logout } = useAuth();

  const customerName =
    user?.firstName || user?.name?.split(" ")?.[0] || user?.email || "Customer";
  const avatarInitial = customerName.charAt(0).toUpperCase();

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
          <Link href="/" className="text-primary font-semibold">
            Browse
          </Link>

          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>

          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            Contact
          </Link>

          <Link
            href="/register/chef"
            className="hover:text-primary transition-colors"
          >
            Become a Chef
          </Link>
        </div>

        {/* Search */}
        <div className="hidden border-primary-container border lg:flex items-center bg-secondary-container px-4 py-2 rounded-full w-72">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-text-secondary"
          />

          <input
            type="text"
            placeholder="Search dishes..."
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button>
            <FontAwesomeIcon icon={faBell} className="text-lg" />
          </button>

          <button>
            <FontAwesomeIcon icon={faCartShopping} className="text-lg" />
          </button>

          {isCustomer ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="flex items-center gap-2 rounded-full border border-primary/20 bg-white p-1 pr-3 shadow-sm transition hover:border-primary"
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
                  className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-primary/10 bg-white py-2 shadow-xl"
                >
                  <Link
                    href="/customer/dashboard"
                    onClick={closeMenus}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text-primary transition hover:bg-secondary-container hover:text-primary"
                    role="menuitem"
                  >
                    <FontAwesomeIcon icon={faTableColumns} className="h-4 w-4" />
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

            <Link href="/categories">Categories</Link>

            <Link href="/how-it-works">How It Works</Link>

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
