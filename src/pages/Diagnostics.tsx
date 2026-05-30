import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Sparkles, AlertTriangle, Info } from 'lucide-react'
import { commonFaultCodes, faultCategories, symptomsList, mockDiagnosisResult } from '../data/mockData'
import type { DiagnosisResult } from '../data/mockData'

export default function Diagnostics() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [faultCode, setFaultCode] = useState('')
  const [category, setCategory] = useState('')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [vin, setVin] = useState('')
  const [engineHours, setEngineHours] = useState('')
  const [mileage, setMileage] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const analyze = async () => {
    const apiKey = localStorage.getItem('rin_gemini_key')
    if (!apiKey) {
      alert('Please enter your Gemini API key in the sidebar first.')
      return
    }

    setLoading(true)
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const modelAI = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const prompt = `You are an expert truck repair diagnostic AI. Analyze the fault code and symptoms provided and return a JSON response with exactly these fields:
{
  rootCause: string,
  confidence: number (0-100),
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  repairType: string,
  estimatedLaborHours: string,
  requiredParts: string[],
  repairRecommendation: string,
  estimatedPartsCost: string,
  estimatedLaborCost: string,
  estimatedTotalCost: string,
  additionalNotes: string
}
Return only valid JSON, no markdown, no explanation.

Fault Code: ${faultCode || 'N/A'}
Truck Make: ${make || 'N/A'}
Truck Model: ${model || 'N/A'}
Year: ${year || 'N/A'}
Category: ${category || 'N/A'}
Symptoms: ${symptoms.join(', ') || 'N/A'}
VIN: ${vin || 'N/A'}
Engine Hours: ${engineHours || 'N/A'}
Mileage: ${mileage || 'N/A'}
Notes: ${notes || 'N/A'}`

      const result = await modelAI.generateContent(prompt)
      const text = result.response.text()
      const clean = text.replace(/```json\s*|\s*```/g, '').trim()
      const data: DiagnosisResult = JSON.parse(clean)
      navigate('/results', { state: { diagnosis: data, formData: { make, model, faultCode } } })
    } catch {
      navigate('/results', { state: { diagnosis: mockDiagnosisResult, formData: { make, model, faultCode } } })
    } finally {
      setLoading(false)
    }
  }

  const severityColor = (sev: string) => {
    switch (sev) {
      case 'HIGH': return 'text-white bg-danger/80'
      case 'MEDIUM': return 'text-white bg-warning/80'
      case 'LOW': return 'text-white bg-success/80'
      default: return 'text-white bg-muted/60'
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="font-sora font-bold text-2xl text-navy">{t('diagnostics.title')}</h1>
          <p className="text-muted text-sm">{t('diagnostics.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="lg:col-span-3 lg:order-1 order-1">
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">{t('diagnostics.make')}</label>
                <select
                  value={make}
                  onChange={e => setMake(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai bg-white"
                >
                  <option value="">Select make</option>
                  {['Volvo', 'Freightliner', 'Kenworth', 'Peterbilt', 'Mack', 'International'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">{t('diagnostics.model')}</label>
                <input
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. VNL 860"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">{t('diagnostics.year')}</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai bg-white"
                >
                  <option value="">Select year</option>
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">{t('diagnostics.faultCode')}</label>
                <input
                  value={faultCode}
                  onChange={e => setFaultCode(e.target.value.toUpperCase())}
                  placeholder="e.g. P20EE"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm font-fault focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">VIN</label>
                <input
                  value={vin}
                  onChange={e => setVin(e.target.value.toUpperCase())}
                  placeholder="e.g. 1HGBH41JXMN109186"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm font-fault focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">{t('diagnostics.category')}</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai bg-white"
                >
                  <option value="">Select category</option>
                  {faultCategories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Engine Hours</label>
                <input
                  value={engineHours}
                  onChange={e => setEngineHours(e.target.value)}
                  placeholder="e.g. 12,450"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Mileage</label>
                <input
                  value={mileage}
                  onChange={e => setMileage(e.target.value)}
                  placeholder="e.g. 425,000"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-navy mb-2">{t('diagnostics.symptoms')}</label>
              <div className="flex flex-wrap gap-2">
                {symptomsList.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      symptoms.includes(s)
                        ? 'bg-ai text-white border-ai'
                        : 'bg-white text-muted border-border hover:border-ai/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-navy mb-1">{t('diagnostics.notes')}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional — describe any additional symptoms or context..."
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 focus:border-ai resize-none"
              />
            </div>

            <button
              onClick={analyze}
              disabled={loading}
              className="mt-5 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                  {t('diagnostics.analyzing')}
                </span>
              ) : (
                <><Sparkles size={18} /> {t('diagnostics.analyze')}</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 lg:order-2 order-2 space-y-4">
          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-sora font-semibold text-base text-navy mb-3">Common Fault Codes</h3>
            <div className="space-y-2">
              {commonFaultCodes.map(fc => (
                <div key={fc.code} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <div>
                    <span className="font-fault text-sm font-medium text-navy">{fc.code}</span>
                    <p className="text-xs text-muted">{fc.description}</p>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${severityColor(fc.severity)}`}>
                    {fc.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#EFF6FF] border-l-4 border-ai rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="text-ai shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-sm text-ai mb-1">AI Intelligence Insight</p>
                <p className="text-sm text-navy/70 leading-relaxed">
                  AI analyzes 50,000+ fault code patterns from real repair data to provide accurate diagnostics.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-sm text-navy mb-1">Demo Notice</p>
                <p className="text-xs text-muted leading-relaxed">
                  If Gemini API call fails, mock data will be used automatically so the demo never breaks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
