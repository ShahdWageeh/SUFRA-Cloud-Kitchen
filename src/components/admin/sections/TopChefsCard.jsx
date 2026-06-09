import { topChefs } from '@/data/dashboard'

export default function TopChefsCard() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm flex flex-col" style={{ borderColor: '#ECE8E5' }}>
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-800">Top Chefs</h3>
        <p className="text-xs text-gray-400 mt-0.5">Highest performing this month</p>
      </div>

      {/* Chef list */}
      <div className="space-y-5 flex-1">
        {topChefs.map((chef) => (
          <div key={chef.id}>
            <div className="flex items-center gap-3 mb-2">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: chef.color }}
              >
                {chef.initials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800 truncate">{chef.name}</span>
                  <span className="text-xs font-semibold text-gray-600 ml-2 flex-shrink-0">{chef.orders} Orders</span>
                </div>
                <span className="text-xs text-gray-400">{chef.category}</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F0EEEC' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${chef.progress}%`,
                  backgroundColor: chef.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: '#ECE8E5' }}>
        <button className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: '#A55632' }}>
          View All Rankings →
        </button>
      </div>
    </div>
  )
}
