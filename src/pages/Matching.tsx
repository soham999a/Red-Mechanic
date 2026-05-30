import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { Star, MapPin, Users, Package, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { shops } from '../data/mockData'
import type { Shop } from '../data/mockData'

interface MatchScore {
  shop: Shop
  partsScore: number
  techScore: number
  ratingScore: number
  distanceScore: number
  finalScore: number
}

export default function Matching() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as any
  const [showRanking, setShowRanking] = useState(false)

  const requiredParts: string[] = state?.requiredParts || ['DEF Pump Assembly', 'DEF Filter Kit']

  const matches = useMemo(() => {
    return shops
      .map(shop => {
        const matched = shop.inventory.filter(p => requiredParts.includes(p.name) && p.quantity > 0)
        const matchedCount = matched.length
        const partsScore = (matchedCount / requiredParts.length) * 100
        const techScore = (shop.availableTechnicians / 5) * 100
        const ratingScore = (shop.rating / 5) * 100
        const distanceScore = Math.max(0, 100 - (shop.distance * 2))
        const finalScore = (partsScore * 0.40) + (techScore * 0.30) + (ratingScore * 0.20) + (distanceScore * 0.10)
        return { shop, partsScore, techScore, ratingScore, distanceScore, finalScore } as MatchScore
      })
      .sort((a, b) => b.finalScore - a.finalScore)
  }, [requiredParts])

  const best = matches[0]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-sora font-bold text-2xl text-navy">Repair Shop Matching</h1>
        <p className="text-muted text-sm mt-1">Searching for: {requiredParts.join(', ')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {requiredParts.map(p => (
          <span key={p} className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand/10 text-brand rounded-full text-xs font-medium">
            {p}
          </span>
        ))}
      </div>

      {best && (
        <div className="bg-white border-2 border-brand rounded-xl p-6 shadow-md mb-6 relative">
          <span className="absolute -top-2.5 left-4 bg-brand text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full">
            Best Match
          </span>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
            <div>
              <h2 className="font-sora font-bold text-xl text-navy">{best.shop.name}</h2>
              <p className="text-muted text-sm flex items-center gap-1 mt-0.5">
                <MapPin size={14} /> {best.shop.address}, {best.shop.city}, {best.shop.state} &bull; {best.shop.distance} mi
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={14} className="text-warning fill-warning" />
                <span className="text-sm font-medium">{best.shop.rating}</span>
                <span className="text-xs text-muted">({best.shop.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-success bg-green-50 px-2.5 py-1.5 rounded-full font-medium">
                <Package size={13} /> {Math.round(best.partsScore / 100 * requiredParts.length)}/{requiredParts.length} Parts
              </span>
              <span className="flex items-center gap-1 text-xs text-success bg-green-50 px-2.5 py-1.5 rounded-full font-medium">
                <Users size={13} /> {best.shop.availableTechnicians} Techs
              </span>
              <span className="flex items-center gap-1 text-xs text-success bg-green-50 px-2.5 py-1.5 rounded-full font-medium">
                <Clock size={13} /> Open Now
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Match Score</span>
                <span className="font-bold text-brand">{Math.round(best.finalScore)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${best.finalScore}%` }} />
              </div>
            </div>
            <button
              onClick={() => navigate(`/shop/${best.shop.id}`, { state: { requiredParts } })}
              className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              Select Shop <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowRanking(!showRanking)}
        className="flex items-center gap-2 text-ai text-sm font-medium mb-4 hover:underline"
      >
        {showRanking ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Ranking Logic
      </button>

      {showRanking && best && (
        <div className="bg-[#EFF6FF] border-l-4 border-ai rounded-xl p-5 mb-6">
          <p className="font-semibold text-sm text-ai mb-3">Score Breakdown for {best.shop.name}</p>
          <div className="space-y-3">
            {[
              { label: 'Parts Inventory Match', value: best.partsScore, color: '#3B82F6' },
              { label: 'Tech Availability', value: best.techScore, color: '#22C55E' },
              { label: 'Fleet Rating', value: best.ratingScore, color: '#F59E0B' },
              { label: 'Proximity Score', value: best.distanceScore, color: '#F97316' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-navy/70">{label}</span>
                  <span className="font-medium">{Math.round(value)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Rank</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Shop</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-xs text-muted uppercase">Match</th>
              <th className="text-center px-4 py-3 font-semibold text-xs text-muted uppercase">Parts</th>
              <th className="text-center px-4 py-3 font-semibold text-xs text-muted uppercase">Techs</th>
              <th className="text-center px-4 py-3 font-semibold text-xs text-muted uppercase">Rating</th>
              <th className="text-right px-4 py-3 font-semibold text-xs text-muted uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.slice(0, 5).map((m, i) => (
              <tr key={m.shop.id} className="border-b border-border/50 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    i === 0 ? 'bg-brand text-white' : i === 1 ? 'bg-gray-200 text-navy' : 'bg-gray-100 text-muted'
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-navy">{m.shop.name}</td>
                <td className="px-4 py-3 text-muted text-xs">{m.shop.city}, {m.shop.state} &bull; {m.shop.distance}mi</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${m.finalScore}%` }} />
                    </div>
                    <span className="text-xs font-bold text-brand">{Math.round(m.finalScore)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm">{Math.round(m.partsScore / 100 * requiredParts.length)}/{requiredParts.length}</td>
                <td className="px-4 py-3 text-center text-sm">{m.shop.availableTechnicians}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-warning fill-warning" />
                    <span className="text-xs">{m.shop.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`/shop/${m.shop.id}`, { state: { requiredParts } })}
                    className="text-ai hover:text-ai/80 text-xs font-medium"
                  >
                    View &rarr;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
