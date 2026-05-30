import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Building2, Truck, ClipboardList } from 'lucide-react'
import { shops, vehicles, repairHistory } from '../data/mockData'
import type { Shop } from '../data/mockData'

type Tab = 'shops' | 'vehicles' | 'repairs'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('shops')
  const [shopList, setShopList] = useState(shops)
  const [vehicleList] = useState(vehicles)
  const [repairList] = useState(repairHistory)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<Shop>>({})
  const [notification, setNotification] = useState('')

  const notify = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const openNew = () => {
    setForm({ name: '', address: '', city: '', state: 'TX', rating: 4.5, reviewCount: 0, availableTechnicians: 1, specializations: [], certifications: [], isOpen: true, phone: '', hours: 'Mon-Sat 6:00 AM - 10:00 PM', inventory: [], distance: 10 })
    setEditingShop(null)
    setShowForm(true)
  }

  const openEdit = (s: Shop) => {
    setForm({ ...s })
    setEditingShop(s)
    setShowForm(true)
  }

  const saveShop = () => {
    if (!form.name) return
    if (editingShop) {
      setShopList(prev => prev.map(s => s.id === editingShop.id ? { ...s, ...form } as Shop : s))
      notify(`"${form.name}" updated`)
    } else {
      const newShop = { ...form, id: `shop-${Date.now()}` } as Shop
      setShopList(prev => [...prev, newShop])
      notify(`"${form.name}" created`)
    }
    setShowForm(false)
    setEditingShop(null)
  }

  const deleteShop = (id: string) => {
    const s = shopList.find(x => x.id === id)
    setShopList(prev => prev.filter(x => x.id !== id))
    notify(`"${s?.name}" deleted`)
  }

  const tabs: { key: Tab; label: string; icon: typeof Building2 }[] = [
    { key: 'shops', label: 'Repair Shops', icon: Building2 },
    { key: 'vehicles', label: 'Vehicles', icon: Truck },
    { key: 'repairs', label: 'Repair Records', icon: ClipboardList },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {notification && (
        <div className="fixed top-4 right-4 bg-navy text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50 animate-pulse">
          {notification}
        </div>
      )}
      <div className="mb-6">
        <h1 className="font-sora font-bold text-2xl text-navy">Admin Panel</h1>
        <p className="text-muted text-sm">Manage your network data — all changes stay in your browser</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key ? 'bg-brand text-white' : 'bg-white border border-border text-muted hover:border-brand/30'
            }`}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'shops' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">{shopList.length} shops</p>
            <button onClick={openNew}
              className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus size={16} /> Add Shop
            </button>
          </div>
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-xs text-muted">City</th>
                  <th className="text-center px-4 py-3 font-semibold text-xs text-muted">Rating</th>
                  <th className="text-center px-4 py-3 font-semibold text-xs text-muted">Techs</th>
                  <th className="text-center px-4 py-3 font-semibold text-xs text-muted">Open</th>
                  <th className="text-right px-4 py-3 font-semibold text-xs text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shopList.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-navy">{s.name}</td>
                    <td className="px-4 py-3 text-muted">{s.city}</td>
                    <td className="px-4 py-3 text-center">{s.rating}</td>
                    <td className="px-4 py-3 text-center">{s.availableTechnicians}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.isOpen ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                        {s.isOpen ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 size={14} className="text-ai" /></button>
                        <button onClick={() => deleteShop(s.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><Trash2 size={14} className="text-danger" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'vehicles' && (
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Make</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Model</th>
                <th className="text-center px-4 py-3 font-semibold text-xs text-muted">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Driver</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicleList.map(v => (
                <tr key={v.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">{v.make}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3 text-center">{v.year}</td>
                  <td className="px-4 py-3">{v.driverName}</td>
                  <td className="px-4 py-3 text-muted text-xs">{v.currentLocation}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      v.status === 'Active' ? 'bg-green-50 text-success' : 'bg-amber-50 text-warning'
                    }`}>{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'repairs' && (
        <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Truck</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Shop</th>
                <th className="text-left px-4 py-3 font-semibold text-xs text-muted">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-xs text-muted">Cost</th>
              </tr>
            </thead>
            <tbody>
              {repairList.map(r => (
                <tr key={r.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-fault text-xs">{r.id}</td>
                  <td className="px-4 py-3 text-xs text-muted">{r.date}</td>
                  <td className="px-4 py-3">{r.truckMake} {r.truckModel}</td>
                  <td className="px-4 py-3 text-muted text-xs">{r.shopName}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      r.status === 'Completed' ? 'bg-green-50 text-success' :
                      r.status === 'In Progress' ? 'bg-amber-50 text-warning' : 'bg-gray-100 text-muted'
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">${r.totalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-sora font-bold text-lg text-navy mb-4">{editingShop ? 'Edit Shop' : 'Add Shop'}</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted block mb-1">Name</label>
                  <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">City</label>
                  <input value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">State</label>
                  <input value={form.state || 'TX'} onChange={e => setForm({ ...form, state: e.target.value })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Rating (1-5)</label>
                  <input type="number" min={1} max={5} step={0.1} value={form.rating || 4.5}
                    onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Technicians</label>
                  <input type="number" min={1} max={10} value={form.availableTechnicians || 1}
                    onChange={e => setForm({ ...form, availableTechnicians: parseInt(e.target.value) })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Phone</label>
                  <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted block mb-1">Distance (mi)</label>
                  <input type="number" value={form.distance || 10}
                    onChange={e => setForm({ ...form, distance: parseInt(e.target.value) })}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={saveShop}
                className="flex-1 bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                <Save size={16} /> {editingShop ? 'Update' : 'Create'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-border text-muted py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
