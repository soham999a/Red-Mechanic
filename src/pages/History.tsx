import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { repairHistory } from '../data/mockData'

const PAGE_SIZE = 10

export default function History() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [makeFilter, setMakeFilter] = useState('')
  const [page, setPage] = useState(1)
  const [modalRecord, setModalRecord] = useState<typeof repairHistory[0] | null>(null)
  const [showExport, setShowExport] = useState(false)
  const [exportFields, setExportFields] = useState(['id', 'date', 'truckMake', 'truckModel', 'faultCode', 'shopName', 'matchScore', 'status', 'repairTime', 'totalCost'])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const exportableFields = [
    { key: 'id', label: 'ID' },
    { key: 'date', label: 'Date' },
    { key: 'truckMake', label: 'Truck Make' },
    { key: 'truckModel', label: 'Truck Model' },
    { key: 'faultCode', label: 'Fault Code' },
    { key: 'shopName', label: 'Shop' },
    { key: 'matchScore', label: 'Match Score' },
    { key: 'status', label: 'Status' },
    { key: 'repairTime', label: 'Time' },
    { key: 'totalCost', label: 'Total Cost' },
  ]

  const filtered = useMemo(() => {
    return repairHistory.filter(r => {
      const matchesSearch = !search ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.truckMake.toLowerCase().includes(search.toLowerCase()) ||
        r.shopName.toLowerCase().includes(search.toLowerCase()) ||
        r.faultCode.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || r.status === statusFilter
      const matchesMake = !makeFilter || r.truckMake === makeFilter
      const matchesDateFrom = !dateFrom || r.date >= dateFrom
      const matchesDateTo = !dateTo || r.date <= dateTo
      return matchesSearch && matchesStatus && matchesMake && matchesDateFrom && matchesDateTo
    })
  }, [search, statusFilter, makeFilter, dateFrom, dateTo])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const exportCSV = () => {
    const headers = exportFields.map(k => exportableFields.find(f => f.key === k)?.label || k).join(',')
    const rows = repairHistory.map(r => {
      const vals = exportFields.map(k => {
        const v = (r as any)[k]
        return typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      })
      return vals.join(',')
    })
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `repair_history_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setShowExport(false)
  }

  const toggleField = (key: string) => {
    setExportFields(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key])
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-success'
      case 'In Progress': return 'bg-amber-50 text-warning'
      case 'Pending': return 'bg-gray-100 text-muted'
      default: return 'bg-gray-100 text-muted'
    }
  }

  const makes = [...new Set(repairHistory.map(r => r.truckMake))]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sora font-bold text-2xl text-navy">{t('history.title')}</h1>
          <p className="text-muted text-sm">{t('history.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder={t('history.search')}
              className="pl-9 pr-3 py-2 border border-border rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ai/30"
            />
          </div>
          <button onClick={() => setShowExport(true)}
            className="flex items-center gap-2 border border-border hover:bg-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={16} /> {t('history.export')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Repairs', value: '1,247' },
          { label: 'Avg Match Score', value: '89%' },
          { label: 'Avg Repair Time', value: '3.8 hrs' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs text-muted">{label}</p>
            <p className="font-sora font-bold text-xl text-navy mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ai/30">
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
        </select>
        <select value={makeFilter} onChange={e => { setMakeFilter(e.target.value); setPage(1) }}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ai/30">
          <option value="">All Makes</option>
          {makes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1) }}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white" />
        <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1) }}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-white" />
      </div>

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">ID</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Truck</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Fault Code</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Shop</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Match</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Time</th>
              <th className="text-right px-4 py-3 font-semibold text-xs text-muted uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(r => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-fault text-xs text-navy">{r.id}</td>
                <td className="px-4 py-3 text-muted text-xs">{r.date}</td>
                <td className="px-4 py-3 font-medium text-sm">{r.truckMake} {r.truckModel}</td>
                <td className="px-4 py-3">
                  <span className="font-fault text-xs bg-gray-100 px-2 py-0.5 rounded text-navy">{r.faultCode}</span>
                </td>
                <td className="px-4 py-3 text-sm text-muted">{r.shopName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.matchScore}%`, backgroundColor: r.matchScore >= 90 ? '#22C55E' : r.matchScore >= 80 ? '#F59E0B' : '#F97316' }} />
                    </div>
                    <span className="text-xs font-medium">{r.matchScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${statusBadge(r.status)}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">{r.repairTime}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setModalRecord(r)} className="text-ai hover:text-ai/80 text-xs font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-muted">
        <span>Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand text-white' : 'hover:bg-white text-muted'}`}>
              {p}
            </button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="p-1.5 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {modalRecord && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setModalRecord(null)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg text-navy mb-4">Repair Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">ID</span><span className="font-fault">{modalRecord.id}</span></div>
              <div className="flex justify-between"><span className="text-muted">Date</span><span>{modalRecord.date}</span></div>
              <div className="flex justify-between"><span className="text-muted">Truck</span><span>{modalRecord.truckMake} {modalRecord.truckModel}</span></div>
              <div className="flex justify-between"><span className="text-muted">Fault Code</span><span className="font-fault">{modalRecord.faultCode}</span></div>
              <div className="flex justify-between"><span className="text-muted">Shop</span><span>{modalRecord.shopName}</span></div>
              <div className="flex justify-between"><span className="text-muted">Status</span><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge(modalRecord.status)}`}>{modalRecord.status}</span></div>
              <div className="flex justify-between"><span className="text-muted">Repair Time</span><span>{modalRecord.repairTime}</span></div>
              <div className="flex justify-between"><span className="text-muted">Total Cost</span><span className="font-bold">${modalRecord.totalCost}</span></div>
              <div className="pt-2 border-t border-border">
                <p className="text-muted text-xs mb-1">Parts Used</p>
                <div className="flex flex-wrap gap-1">
                  {modalRecord.partsUsed.map(p => (
                    <span key={p} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setModalRecord(null)} className="mt-4 w-full bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-semibold transition-colors">Close</button>
          </div>
        </div>
      )}

      {showExport && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowExport(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg text-navy mb-4">Export CSV</h3>
            <p className="text-xs text-muted mb-3">Select columns to include:</p>
            <div className="space-y-2 mb-4">
              {exportableFields.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={exportFields.includes(key)}
                    onChange={() => toggleField(key)} className="accent-brand" />
                  {label}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={exportCSV} disabled={exportFields.length === 0}
                className="flex-1 bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                Download CSV
              </button>
              <button onClick={() => setShowExport(false)}
                className="flex-1 border border-border text-muted py-2 rounded-lg text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
