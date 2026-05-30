import { useState } from 'react'

interface LandingContent {
  badge: string
  title: string
  subtitle: string
}

export function loadLandingContent(): LandingContent {
  try {
    const saved = localStorage.getItem('rin_landing_content')
    return saved ? JSON.parse(saved) : {
      badge: 'AI-Powered Fleet Intelligence',
      title: 'Route Any Truck to the Right Shop. Instantly.',
      subtitle: 'Red Mechanic uses AI to analyze fault codes, match inventory, and connect drivers to the best repair shop in real time.',
    }
  } catch {
    return { badge: '', title: '', subtitle: '' }
  }
}

export function saveLandingContent(content: LandingContent) {
  localStorage.setItem('rin_landing_content', JSON.stringify(content))
}

interface Props {
  content: LandingContent
  onChange: (c: LandingContent) => void
  onClose: () => void
}

export default function LandingEditor({ content, onChange, onClose }: Props) {
  const [local, setLocal] = useState(content)

  const save = () => {
    saveLandingContent(local)
    onChange(local)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-sora font-bold text-lg text-navy mb-4">Edit Landing Page</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Badge</label>
            <input value={local.badge} onChange={e => setLocal({ ...local, badge: e.target.value })}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Title</label>
            <textarea value={local.title} onChange={e => setLocal({ ...local, title: e.target.value })}
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted block mb-1">Subtitle</label>
            <textarea value={local.subtitle} onChange={e => setLocal({ ...local, subtitle: e.target.value })}
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ai/30 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={save} className="flex-1 bg-brand hover:bg-brand-dark text-white py-2 rounded-lg text-sm font-semibold transition-colors">Save</button>
          <button onClick={onClose} className="flex-1 border border-border text-muted py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  )
}
