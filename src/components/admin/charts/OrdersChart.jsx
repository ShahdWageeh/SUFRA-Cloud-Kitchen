'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { ChevronDown } from 'lucide-react'
import { ordersChartData } from '@/data/dashboard'

const CustomBar = (props) => {
  const { x, y, width, height, fill } = props
  const radius = 6
  return (
    <g>
      <path
        d={`M${x},${y + height} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height} Z`}
        fill={fill}
      />
    </g>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-3 text-sm" style={{ borderColor: '#ECE8E5' }}>
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.fill }} className="text-xs">
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function OrdersChart() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#ECE8E5' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-800">Orders Overview</h3>
          <p className="text-xs text-gray-400 mt-0.5">Weekly performance comparison</p>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#ECE8E5' }}
        >
          Last 7 Days
          <ChevronDown size={13} />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#A55632' }} />
          <span className="text-xs text-gray-500">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#E7D5CC' }} />
          <span className="text-xs text-gray-500">Pending</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={ordersChartData} barGap={4} barSize={22}>
          <CartesianGrid vertical={false} stroke="#F0EEEC" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8A8A8A', fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8A8A8A' }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <Bar dataKey="completed" name="Completed" fill="#A55632" shape={<CustomBar />} radius={[6, 6, 0, 0]} />
          <Bar dataKey="pending" name="Pending" fill="#E7D5CC" shape={<CustomBar />} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
