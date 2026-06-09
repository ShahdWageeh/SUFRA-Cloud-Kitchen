import { ChevronDown } from "lucide-react";

export function FilterToolbar({ category, setCategory, status, setStatus, onClear, onApply }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-1">
          Filters:
        </span>

        {/* Category Selector */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Main Dish">Main Dish</option>
            <option value="Italian">Italian</option>
            <option value="Dessert">Dessert</option>
            <option value="Premium">Premium</option>
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Status Selector */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-300 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Flagged">Flagged</option>
            <option value="Active">Active</option>
            <option value="Pending Review">Pending Review</option>
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <button onClick={onClear} className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium px-2">
          Clear All
        </button>

        <button
          onClick={onApply}
          className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity ml-auto"
          style={{ background: "#7c4a2d" }}
        >
          Apply Search
        </button>
      </div>
    </div>
  );
}