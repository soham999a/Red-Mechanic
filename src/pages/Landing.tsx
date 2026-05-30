import { useNavigate } from 'react-router-dom'
import { Cpu, MapPin, BarChart2, ArrowRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-sora font-bold text-2xl text-brand">RIN</span>
            <span className="text-navy font-medium text-sm hidden sm:inline">Red Mechanic</span>
          </div>
          <button
            onClick={() => navigate('/diagnostics')}
            className="bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
          >
            Start Demo <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center min-h-[80vh] justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          AI-Powered Fleet Intelligence
        </span>

        <h1 className="font-sora font-bold text-[56px] leading-[1.1] tracking-tight text-navy max-w-4xl">
          Route Any Truck to the Right Shop. Instantly.
        </h1>

        <p className="mt-4 text-muted text-lg max-w-2xl leading-relaxed">
          Red Mechanic uses AI to analyze fault codes, match inventory, and connect drivers to the best repair shop in real time.
        </p>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => navigate('/diagnostics')}
            className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand/25 flex items-center gap-2"
          >
            Start Demo <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="border border-border hover:border-brand/30 text-navy px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: 'AI Fault Diagnosis', desc: 'Gemini AI analyzes fault codes and symptoms instantly' },
            { icon: MapPin, title: 'Smart Shop Routing', desc: 'Ranked by inventory match, technicians and proximity' },
            { icon: BarChart2, title: 'Fleet Intelligence', desc: 'Network learns from every repair to get smarter' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                <Icon className="text-brand" size={22} />
              </div>
              <h3 className="font-sora font-semibold text-lg text-navy mb-1">{title}</h3>
              <p className="text-muted text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-white/80 text-sm font-medium">
            <span>2,400+ Repair Shops</span>
            <span className="text-white/20">|</span>
            <span>94% Match Accuracy</span>
            <span className="text-white/20">|</span>
            <span>18 min Avg Response</span>
            <span className="text-white/20">|</span>
            <span>50K+ Fault Codes Analyzed</span>
          </div>
        </div>
      </section>
    </div>
  )
}
