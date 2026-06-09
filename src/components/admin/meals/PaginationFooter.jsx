import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export function PaginationFooter({ loading, total, activePage, totalPages, pageSize, onPageChange }) {
  const visiblePages = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (activePage <= 2) return [1, 2, 3];
    if (activePage >= totalPages - 1) return [totalPages - 2, totalPages - 1, totalPages];
    return [activePage - 1, activePage, activePage + 1];
  };

  const showEndEllipsis = activePage < totalPages - 2 && totalPages > 3;

  return (
    <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm text-slate-500">
        {loading ? (
          <span className="flex items-center gap-1.5 text-xs">
            <Loader2 size={12} className="animate-spin" /> Loading…
          </span>
        ) : (
          <>
            Showing{" "}
            <span className="font-medium text-slate-700">
              {total === 0 ? 0 : (activePage - 1) * pageSize + 1} to {Math.min(activePage * pageSize, total)}
            </span>{" "}
            of <span className="font-medium text-slate-700">{total.toLocaleString()}</span> items
          </>
        )}
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={activePage === 1 || loading}
          onClick={() => onPageChange(activePage - 1)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={15} />
        </button>

        {visiblePages().map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            disabled={loading}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
              activePage === n ? "text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
            style={activePage === n ? { background: "#7c4a2d" } : {}}
          >
            {n}
          </button>
        ))}

        {showEndEllipsis && (
          <>
            <span className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">…</span>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={loading}
              className={`w-9 h-7 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                activePage === totalPages ? "text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
              style={activePage === totalPages ? { background: "#7c4a2d" } : {}}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={activePage === totalPages || loading}
          onClick={() => onPageChange(activePage + 1)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}