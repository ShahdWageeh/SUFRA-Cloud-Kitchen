import {
  Users,
  ChefHat,
  UtensilsCrossed,
  ShoppingBag,
  ShieldCheck,
  MessageSquare,
  Wallet,
  Layers,
  TrendingUp,
} from 'lucide-react'

const iconMap = {
  Users,
  ChefHat,
  UtensilsCrossed,
  ShoppingBag,
  ShieldCheck,
  MessageSquare,
  Wallet,
  Layers,
}

export default function StatsCard({ icon, iconBg, iconColor, metric, label, sublabel, growth, growthPositive }) {
  const Icon = iconMap[icon] || ShoppingBag

  return (
    <div
      className="bg-white rounded-2xl border p-6 flex flex-col justify-between h-35 shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: '#ECE8E5' }}
    >
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} strokeWidth={1.8} />
        </div>

        {/* Growth badge */}
        {growth && (
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={11} />
            {growth}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div>
        <div className="text-sm text-gray-400 mt-0.5">{label}</div>
        <div className="text-2xl font-bold text-gray-800 leading-tight">{metric}</div>
        {sublabel && (
          <div className="text-xs text-gray-400 mb-0.5">{sublabel}</div>
        )}
      </div>
    </div>
  )
}
