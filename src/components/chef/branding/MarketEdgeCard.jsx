import { TrendingUp } from "lucide-react";

export default function MarketEdgeCard({ items }) {
  const marketItems = Array.isArray(items) ? items : [];

  return (
    <div className="bg-[#0F766E] text-white rounded-3xl p-6 border border-gray-300">

      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} />
        <h3 className="text-xl font-semibold">
          Market Edge
        </h3>
      </div>

      <ul className="space-y-4">
        {marketItems.map((item) => (
          <li
            key={item}
            className="text-sm"
          >
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
