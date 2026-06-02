"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faBell,
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-outline/20 backdrop-blur">
      <nav className="container mx-auto h-18 px-4 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          Matbakhna
        </Link>

        {/* Desktop Links */}
        <div className="hidden text-sm md:flex items-center gap-8">
          <Link href="/" className="text-primary font-semibold">
            Browse
          </Link>

          <Link
            href="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>

          <Link
            href="/how-it-works"
            className="hover:text-primary transition-colors"
          >
            How It Works
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

          <Link
            href="/login"
            className="hidden ml-3 sm:block bg-primary text-white px-8 py-2 rounded-full hover:opacity-90 transition"
          >
            Sign In
          </Link>

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

            <Link
              href="/login"
              className="bg-primary text-center text-white py-3 rounded-full"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
