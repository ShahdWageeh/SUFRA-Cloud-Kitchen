import { Eye, Trash2, AlertTriangle, Flag, CheckCircle, XCircle, UtensilsCrossed, RefreshCw } from "lucide-react";

const STATUS_CONFIG = {
  Flagged: { dot: "bg-rose-500", text: "text-rose-600", label: "font-bold" },
  Active: { dot: "bg-emerald-500", text: "text-emerald-600", label: "font-bold" },
  "Pending Review": { dot: "bg-slate-400", text: "text-slate-500", label: "font-medium" },
};

const CATEGORY_BADGE = "bg-slate-100 text-slate-600 border border-slate-200";

const ROW_ACTIONS = {
  Flagged: [
    { icon: Eye, label: "View meal", color: "hover:text-slate-700 hover:bg-slate-100" },
    { icon: Trash2, label: "Delete meal", color: "hover:text-rose-600 hover:bg-rose-50" },
    { icon: AlertTriangle, label: "Escalate", color: "hover:text-amber-600 hover:bg-amber-50" },
  ],
  Active: [
    { icon: Eye, label: "View meal", color: "hover:text-slate-700 hover:bg-slate-100" },
    { icon: Trash2, label: "Delete meal", color: "hover:text-rose-600 hover:bg-rose-50" },
    { icon: Flag, label: "Flag meal", color: "hover:text-amber-600 hover:bg-amber-50" },
  ],
  "Pending Review": [
    { icon: Eye, label: "View meal", color: "hover:text-slate-700 hover:bg-slate-100" },
    { icon: CheckCircle, label: "Approve meal", color: "hover:text-emerald-600 hover:bg-emerald-50" },
    { icon: XCircle, label: "Reject meal", color: "hover:text-rose-600 hover:bg-rose-50" },
  ],
};

const AVATAR_COLORS = [
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function avatarColor(name = "") {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function ChefAvatar({ chef }) {
  if (chef.avatarUrl) {
    return (
      <img
        src={chef.avatarUrl}
        alt={chef.name}
        className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
      />
    );
  }
  const { bg, text } = avatarColor(chef.name);
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${bg} ${text}`}>
      {getInitials(chef.name)}
    </div>
  );
}

function MealThumbnail({ meal }) {
  return (
    <div className="relative shrink-0 w-14 h-14">
      {meal.imageUrl ? (
        <img src={meal.imageUrl} alt={meal.title} className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
          <UtensilsCrossed size={20} className="text-slate-300" />
        </div>
      )}
      {meal.flagged && (
        <span className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-[10px] font-black leading-none">!</span>
        </span>
      )}
    </div>
  );
}

function SkeletonRow({ columnsCount }) {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(columnsCount)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export function MealsTableBody({ loading, error, meals, pageSize, onRetry }) {
  if (loading) {
    return [...Array(pageSize)].map((_, i) => <SkeletonRow key={i} columnsCount={6} />);
  }

  if (error) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <AlertTriangle size={28} className="text-rose-400" />
            <p className="text-sm font-medium text-slate-600">{error}</p>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90"
              style={{ background: "#7c4a2d" }}
            >
              <RefreshCw size={14} /> Try again
            </button>
          </div>
        </td>
      </tr>
    );
  }

  if (meals.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <UtensilsCrossed size={28} className="text-slate-300" />
            <p className="text-sm font-medium text-slate-500">No meals found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters.</p>
          </div>
        </td>
      </tr>
    );
  }

  return meals.map((meal) => {
    const sc = STATUS_CONFIG[meal.status] ?? STATUS_CONFIG["Pending Review"];
    const actions = ROW_ACTIONS[meal.status] ?? ROW_ACTIONS["Pending Review"];

    return (
      <tr key={meal.id} className="hover:bg-slate-50/50 transition-colors">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <MealThumbnail meal={meal} />
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{meal.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{meal.id}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ChefAvatar chef={meal.chef} />
            <span className="text-sm text-slate-600 font-medium whitespace-nowrap">{meal.chef.name}</span>
          </div>
        </td>
        <td className="px-5 py-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_BADGE}`}>{meal.category}</span>
        </td>
        <td className="px-5 py-4 text-sm font-semibold text-slate-800">{meal.price}</td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
            <span className={`text-sm ${sc.text} ${sc.label}`}>{meal.status}</span>
          </div>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-1">
            {actions.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                aria-label={label}
                className={`p-1.5 rounded-lg text-slate-400 transition-colors ${color}`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </td>
      </tr>
    );
  });
}