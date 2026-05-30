import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Phone, Clock, MapPin, CheckCircle, XCircle, Star } from 'lucide-react'
import { shops, technicians, reviews } from '../data/mockData'
import MapView from '../components/MapView'
import DriverTracker from '../components/DriverTracker'

export default function ShopDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as any
  const requiredParts: string[] = state?.requiredParts || ['DEF Pump Assembly', 'DEF Filter Kit']
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'technicians' | 'reviews'>('overview')

  const shop = useMemo(() => shops.find(s => s.id === id), [id])
  const shopReviews = useMemo(() => reviews.filter(r => r.shopId === id), [id])

  if (!shop) {
    return (
      <div className="p-6 text-center">
        <h2 className="font-sora font-bold text-xl text-navy">Shop not found</h2>
        <button onClick={() => navigate('/matching')} className="text-ai mt-2 text-sm">Back to matching</button>
      </div>
    )
  }

  const allParts = shop.inventory
  const shopTechs = technicians

  const matchScore = useMemo(() => {
    if (requiredParts.length === 0) return 0
    const matched = requiredParts.filter(rp => shop.inventory.some(p => p.name === rp && p.quantity > 0))
    return Math.round((matched.length / requiredParts.length) * 100)
  }, [shop, requiredParts])

  const tabs = ['overview', 'inventory', 'technicians', 'reviews'] as const
  const tabLabels: Record<string, string> = {
    overview: t('shopDetail.overview'),
    inventory: t('shopDetail.inventory'),
    technicians: t('shopDetail.technicians'),
    reviews: t('shopDetail.reviews'),
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/matching', { state: { requiredParts } })} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-muted" />
        </button>
        <div className="flex-1">
          <h1 className="font-sora font-bold text-2xl text-navy">{shop.name}</h1>
          <p className="text-muted text-sm">{shop.address}, {shop.city}, {shop.state}</p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
          {t('shopDetail.selectShop')} <ArrowLeft size={16} className="rotate-180" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden mb-4">
            <div className="flex border-b border-border overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'text-brand border-b-2 border-brand' : 'text-muted hover:text-navy'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-muted mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-navy">{shop.phone}</p>
                    <p className="text-xs text-muted">Phone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-muted mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-navy">{shop.hours}</p>
                    <p className="text-xs text-muted">Hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-muted mt-0.5" />
                  <div>
                    <p className="text-sm">{shop.distance} miles from breakdown</p>
                    <p className="text-xs text-ai hover:underline cursor-pointer">Get Directions &rarr;</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {shop.certifications.map(c => (
                      <span key={c} className="px-2.5 py-1 bg-blue-50 text-ai rounded-full text-xs font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted uppercase mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {shop.specializations.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-gray-100 text-navy/70 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="p-5">
                <div className="bg-[#EFF6FF] border-l-4 border-ai rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-ai mb-2">Verified Inventory Match</p>
                  <div className="space-y-2">
                    {requiredParts.map(rp => {
                      const part = shop.inventory.find(p => p.name === rp)
                      const inStock = part && part.quantity > 0
                      return (
                        <div key={rp} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {inStock ? <CheckCircle size={16} className="text-success" /> : <XCircle size={16} className="text-danger" />}
                            <span>{rp}</span>
                          </div>
                          <span className={`text-xs font-medium ${inStock ? 'text-success' : 'text-danger'}`}>
                            {inStock ? `In Stock (${part!.quantity} units)` : 'Out of Stock'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted mt-3">RIN cross-referenced live shop stock</p>
                </div>
                <p className="font-semibold text-sm text-navy mb-3">Full Inventory</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left pb-2 font-semibold text-xs text-muted">Part Name</th>
                        <th className="text-left pb-2 font-semibold text-xs text-muted">SKU</th>
                        <th className="text-center pb-2 font-semibold text-xs text-muted">Qty</th>
                        <th className="text-right pb-2 font-semibold text-xs text-muted">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allParts.slice(0, 10).map(p => (
                        <tr key={p.id} className="border-b border-border/50">
                          <td className="py-2 text-sm">{p.name}</td>
                          <td className="py-2 font-fault text-xs text-muted">{p.sku}</td>
                          <td className={`py-2 text-center text-sm ${p.quantity === 0 ? 'text-danger' : ''}`}>
                            {p.quantity > 0 ? p.quantity : 'OOS'}
                          </td>
                          <td className="py-2 text-right text-sm">${p.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'technicians' && (
              <div className="p-5 space-y-3">
                {shopTechs.map(t => (
                  <div key={t.id} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center font-bold text-brand text-sm">
                      {t.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy">{t.name}</p>
                      <p className="text-xs text-muted">{t.specialization} &bull; {t.experience} yrs</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      t.available ? 'bg-green-50 text-success' : 'bg-amber-50 text-warning'
                    }`}>
                      {t.available ? 'Available Now' : 'In Bay'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-warning fill-warning" />
                    <span className="font-sora font-bold text-lg">{shop.rating}</span>
                  </div>
                  <span className="text-muted text-sm">({shop.reviewCount} reviews)</span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {shopReviews.map(r => (
                    <div key={r.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-navy">{r.author}</span>
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-warning fill-warning" />
                          <span className="text-xs font-medium">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted">{r.comment}</p>
                      <p className="text-[10px] text-muted/60 mt-1">{r.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm text-center">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">{t('shopDetail.matchScore')}</p>
            <p className="font-sora font-bold text-4xl text-brand">{matchScore}%</p>
            <div className="mt-3 space-y-2 text-left">
              {[
                { label: 'Part Match', value: matchScore, color: '#3B82F6' },
                { label: 'Skill Relevance', value: 92, color: '#22C55E' },
                { label: 'Bay Availability', value: 85, color: '#F59E0B' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">{label}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <MapView lat={shop.lat} lng={shop.lng} shopName={shop.name} distance={shop.distance} />

          <DriverTracker shopLat={shop.lat} shopLng={shop.lng} shopName={shop.name} />

          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Quick Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Jobs This Month', value: `${Math.floor(Math.random() * 80) + 20}` },
                { label: 'Avg Repair Time', value: `${(Math.random() * 3 + 2).toFixed(1)} hrs` },
                { label: 'Rating', value: `${shop.rating}` },
                { label: 'Repeat Rate', value: `${Math.floor(Math.random() * 30 + 65)}%` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="font-sora font-bold text-lg text-navy">{value}</p>
                  <p className="text-[10px] text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
