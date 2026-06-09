'use client'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { acquisitionData } from '@/data/dashboard'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border p-3 text-sm" style={{ borderColor: '#ECE8E5' }}>
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-bold text-gray-700">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomLegend = () => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2">
      <span className="w-6 h-0.5 inline-block rounded" style={{ backgroundColor: '#0F7A78' }} />
      <span className="text-xs text-gray-500">Active Users</span>
    </div>
    <div className="flex items-center gap-2">
      <span
        className="w-6 inline-block"
        style={{
          height: '2px',
          backgroundImage: `repeating-linear-gradient(to right, #A55632 0, #A55632 4px, transparent 4px, transparent 8px)`,
        }}
      />
      <span className="text-xs text-gray-500">Chef Partners</span>
    </div>
  </div>
)

export default function AcquisitionChart() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#ECE8E5' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-800">User Acquisition Growth</h3>
          <p className="text-xs text-gray-400 mt-0.5">Cumulative growth over the last 6 months</p>
        </div>
        <CustomLegend />
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={acquisitionData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="activeUsersGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F7A78" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0F7A78" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F5F3F1" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8A8A8A' }}
            tickFormatter={(v) => v.slice(0, 3)}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#8A8A8A' }}
            width={45}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="activeUsers"
            name="Active Users"
            stroke="#0F7A78"
            strokeWidth={2.5}
            fill="url(#activeUsersGrad)"
            dot={{ r: 4, fill: '#0F7A78', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0F7A78' }}
          />
          <Area
            type="monotone"
            dataKey="chefPartners"
            name="Chef Partners"
            stroke="#A55632"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            fill="none"
            dot={{ r: 4, fill: '#A55632', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#A55632' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
