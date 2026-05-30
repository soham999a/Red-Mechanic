import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useTranslation } from 'react-i18next'
import { Sparkles, TrendingUp, Building2, Package, Truck, Edit3 } from 'lucide-react'

const defaultFaultData = [
  { code: 'P20EE', count: 287 },
  { code: 'P0087', count: 243 },
  { code: 'P0299', count: 198 },
  { code: 'P0401', count: 167 },
  { code: 'P0113', count: 134 },
  { code: 'U0100', count: 98 },
]

const defaultCategoryData = [
  { name: 'Emissions', value: 34, color: '#F97316' },
  { name: 'Engine', value: 28, color: '#3B82F6' },
  { name: 'Electrical', value: 18, color: '#64748B' },
  { name: 'Transmission', value: 12, color: '#F59E0B' },
  { name: 'Brakes', value: 8, color: '#22C55E' },
]

const topShops = [
  { rank: 1, name: 'TruckPro Service Center', jobs: 187, rating: 4.9, avgTime: '3.2h', revenue: '$284K' },
  { rank: 2, name: 'Reliable Diesel Fleet', jobs: 154, rating: 4.7, avgTime: '3.8h', revenue: '$221K' },
  { rank: 3, name: 'Lone Star Heavy Duty', jobs: 132, rating: 4.6, avgTime: '4.1h', revenue: '$198K' },
  { rank: 4, name: 'Mechanix Express', jobs: 118, rating: 4.4, avgTime: '3.5h', revenue: '$167K' },
  { rank: 5, name: 'Apex Truck Repair', jobs: 97, rating: 4.3, avgTime: '4.4h', revenue: '$142K' },
]

export default function Dashboard() {
  const { t } = useTranslation()
  const [editingChart, setEditingChart] = useState(false)
  const [faultData, setFaultData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rin_chart_faults') || 'null') || defaultFaultData } catch { return defaultFaultData }
  })
  const [categoryData, setCategoryData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rin_chart_categories') || 'null') || defaultCategoryData } catch { return defaultCategoryData }
  })
  const [editFaults, setEditFaults] = useState('')
  const [editCategories, setEditCategories] = useState('')

  const openChartEditor = () => {
    setEditFaults(JSON.stringify(faultData, null, 2))
    setEditCategories(JSON.stringify(categoryData, null, 2))
    setEditingChart(true)
  }

  const saveChartData = () => {
    try {
      const f = JSON.parse(editFaults)
      const c = JSON.parse(editCategories)
      setFaultData(f)
      setCategoryData(c)
      localStorage.setItem('rin_chart_faults', JSON.stringify(f))
      localStorage.setItem('rin_chart_categories', JSON.stringify(c))
      setEditingChart(false)
    } catch { alert('Invalid JSON. Please check your syntax.') }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sora font-bold text-2xl text-navy">{t('dashboard.title')}</h1>
          <p className="text-muted text-sm">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openChartEditor}
            className="flex items-center gap-1.5 border border-border hover:bg-white px-3 py-2 rounded-lg text-xs font-medium transition-colors text-muted">
            <Edit3 size={14} /> Edit Charts
          </button>
          <select className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ai/30">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Building2, label: 'Total Shops', value: '42', change: '+3 this month', color: 'text-brand' },
          { icon: Package, label: 'Inventory Items', value: '12,840', change: 'across network', color: 'text-ai' },
          { icon: Truck, label: 'Active Vehicles', value: '318', change: 'monitored', color: 'text-success' },
          { icon: TrendingUp, label: 'Repairs This Month', value: '1,247', change: '+12%', color: 'text-success' },
        ].map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted font-medium">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <p className="font-sora font-bold text-2xl text-navy">{value}</p>
            <p className="text-xs text-muted mt-1">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 bg-white border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-sora font-semibold text-sm text-navy mb-4">Most Common Fault Codes</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={faultData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis dataKey="code" type="category" tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#0F172A' }} width={60} />
              <Tooltip />
              <Bar dataKey="count" fill="#F97316" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-sora font-semibold text-sm text-navy mb-4">Repairs by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                {categoryData.map((entry: any) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" formatter={(value) => <span className="text-xs text-muted">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 pb-0">
            <h3 className="font-sora font-semibold text-sm text-navy">Top Performing Shops</h3>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-sm mt-2">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 font-semibold text-xs text-muted">Rank</th>
                <th className="text-left px-5 py-3 font-semibold text-xs text-muted">Shop</th>
                <th className="text-center px-5 py-3 font-semibold text-xs text-muted">Jobs</th>
                <th className="text-center px-5 py-3 font-semibold text-xs text-muted">Rating</th>
                <th className="text-center px-5 py-3 font-semibold text-xs text-muted">Avg Time</th>
                <th className="text-right px-5 py-3 font-semibold text-xs text-muted">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topShops.map(s => (
                <tr key={s.rank} className="border-b border-border/50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${s.rank === 1 ? 'bg-brand text-white' : 'bg-gray-100 text-muted'}`}>{s.rank}</span>
                  </td>
                  <td className="px-5 py-3 font-medium text-navy">{s.name}</td>
                  <td className="px-5 py-3 text-center">{s.jobs}</td>
                  <td className="px-5 py-3 text-center">{s.rating}</td>
                  <td className="px-5 py-3 text-center">{s.avgTime}</td>
                  <td className="px-5 py-3 text-right font-medium">{s.revenue}</td>
                </tr>
            ))}
          </tbody>
        </table></div>
      </div>

        <div className="lg:col-span-2">
          <div className="bg-[#EFF6FF] border-l-4 border-ai rounded-xl p-5 h-full">
            <div className="flex items-center gap-2 text-ai mb-4">
              <Sparkles size={18} />
              <span className="font-semibold text-sm">{t('dashboard.aiInsights')}</span>
            </div>
            <div className="space-y-4">
              {[
                { dot: 'bg-amber-400', text: 'DEF system failures up 23% this month across the network.' },
                { dot: 'bg-success', text: 'TruckPro Service Center resolves DEF repairs 40% faster than average.' },
                { dot: 'bg-ai', text: 'Freightliner Cascadia has highest fault frequency — consider preventive alerts.' },
              ].map(({ dot, text }) => (
                <div key={text} className="flex gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot}`} />
                  <p className="text-sm text-navy/80 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingChart && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setEditingChart(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg text-navy mb-4">Edit Chart Data</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Fault Codes Data (JSON array)</label>
                <textarea value={editFaults} onChange={e => setEditFaults(e.target.value)}
                  rows={6} className="w-full border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ai/30 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted block mb-1">Category Data (JSON array)</label>
                <textarea value={editCategories} onChange={e => setEditCategories(e.target.value)}
                  rows={6} className="w-full border border-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ai/30 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={saveChartData} className="flex-1 bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-semibold">Save & Apply</button>
              <button onClick={() => setEditingChart(false)} className="flex-1 border border-border text-muted py-2 rounded-lg text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
