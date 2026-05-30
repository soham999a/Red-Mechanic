import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Sparkles, AlertTriangle, Wrench, Package, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as any

  if (!state?.diagnosis) {
    return <Navigate to="/diagnostics" replace />
  }

  const { diagnosis, formData } = state
  const severityColor = (sev: string) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-red-100 text-red-700'
      case 'HIGH': return 'bg-red-50 text-red-600'
      case 'MEDIUM': return 'bg-amber-50 text-amber-700'
      case 'LOW': return 'bg-green-50 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const confidenceRing = (value: number) => {
    const r = 36
    const circ = 2 * Math.PI * r
    const offset = circ - (value / 100) * circ
    return (
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#E2E8F0" strokeWidth="6" />
        <circle cx="45" cy="45" r={r} fill="none" stroke="#F97316" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 45 45)" />
        <text x="45" y="45" textAnchor="middle" dominantBaseline="central"
          className="font-sora font-bold text-xl" fill="#0F172A">{value}%</text>
      </svg>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/diagnostics')} className="p-2 hover:bg-white rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-muted" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-sora font-bold text-2xl text-navy">Analysis Results</h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-green-50 px-2.5 py-1 rounded-full">
              <CheckCircle size={12} /> Analysis Complete
            </span>
          </div>
          <p className="text-muted text-sm">
            {formData?.make || 'Truck'} {formData?.model || ''} &bull; {formData?.faultCode || 'No fault code'} &bull; Just now
          </p>
        </div>
      </div>

      <div className="bg-[#EFF6FF] border-l-4 border-ai rounded-xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 text-ai font-semibold text-xs uppercase tracking-wider mb-2">
            <Sparkles size={16} /> AI Diagnosis by Gemini
          </div>
          <p className="font-sora font-semibold text-lg text-navy leading-snug">{diagnosis.rootCause}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <p className="text-xs text-muted mb-1">Confidence</p>
            {confidenceRing(diagnosis.confidence)}
          </div>
          <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${severityColor(diagnosis.severity)}`}>
            {diagnosis.severity}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-warning mb-3">
            <AlertTriangle size={18} />
            <span className="font-semibold text-sm text-navy">Root Cause</span>
          </div>
          <p className="text-sm text-navy/80 mb-3">{diagnosis.rootCause}</p>
          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${severityColor(diagnosis.severity)}`}>
            {diagnosis.severity} Severity
          </span>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-ai mb-3">
            <Wrench size={18} />
            <span className="font-semibold text-sm text-navy">Repair Details</span>
          </div>
          <p className="text-sm font-medium text-navy">{diagnosis.repairType}</p>
          <p className="text-xs text-muted mt-1">Est. Labor: {diagnosis.estimatedLaborHours} hrs</p>
          <p className="text-xs text-muted mt-1">{diagnosis.repairRecommendation}</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-warning mb-3">
            <Package size={18} />
            <span className="font-semibold text-sm text-navy">Required Parts</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {diagnosis.requiredParts.map((p: string) => (
              <span key={p} className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-medium">{p}</span>
            ))}
          </div>
          <p className="text-xs text-muted">{diagnosis.requiredParts.length} parts required</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-success mb-3">
            <DollarSign size={18} />
            <span className="font-semibold text-sm text-navy">Cost Estimate</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted">Parts</span><span className="font-medium">{diagnosis.estimatedPartsCost}</span></div>
            <div className="flex justify-between"><span className="text-muted">Labor</span><span className="font-medium">{diagnosis.estimatedLaborCost}</span></div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-navy">Total</span>
              <span className="font-sora font-bold text-xl text-brand">{diagnosis.estimatedTotalCost}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/matching', { state: { requiredParts: diagnosis.requiredParts } })}
        className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
      >
        Find Available Repair Shops <ArrowLeft size={18} className="rotate-180" />
      </button>
    </div>
  )
}
