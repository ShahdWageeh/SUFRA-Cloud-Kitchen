"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchInput({ 
  placeholder = "Search...", 
  className = "",
  inputClassName = "",
  buttonClassName = "",
  showButton = false,
  initialValue = "",
  basePath = "/search"
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue || searchParams.get("q") || "");

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      const url = new URL(window.location.origin + basePath);
      url.searchParams.set("q", query.trim());
      router.push(url.pathname + url.search);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`flex items-center ${className}`}>
      <div className={`relative flex flex-1 items-center ${inputClassName}`}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-4 text-text-secondary"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full bg-transparent py-2 pl-12 pr-4 outline-none"
        />
      </div>
      {showButton && (
        <button
          type="submit"
          className={`ml-2 rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition hover:bg-primary-container ${buttonClassName}`}
        >
          Search
        </button>
      )}
    </form>
  );
}
