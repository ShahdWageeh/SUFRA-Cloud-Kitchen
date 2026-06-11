export default function TopChefsCard({ chefs = [] }) {
  return (
    <div
      className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col"
      style={{ borderColor: "#ECE8E5" }}
    >
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-800">Chef Readiness</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Verification status for current partners
        </p>
      </div>

      <div className="space-y-5 flex-1">
        {chefs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-semibold text-slate-600">
              No chefs loaded
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Partner data will appear after the API responds.
            </p>
          </div>
        ) : (
          chefs.map((chef) => (
            <div key={chef.id}>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: chef.color }}
                >
                  {chef.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {chef.name}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 flex-shrink-0">
                      {chef.statusText}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {chef.category}
                  </span>
                </div>
              </div>

              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "#F0EEEC" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${chef.progress}%`,
                    backgroundColor: chef.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 pt-4 border-t" style={{ borderColor: "#ECE8E5" }}>
        <a
          href="/admin/chefs"
          className="text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: "#A55632" }}
        >
          Manage chefs
        </a>
      </div>
    </div>
  );
}
