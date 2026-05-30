import { useState, useEffect } from 'react'
import { Palette, X } from 'lucide-react'

interface Colors {
  brand: string
  navy: string
  ai: string
  success: string
}

const defaults: Colors = { brand: '#F97316', navy: '#0F172A', ai: '#3B82F6', success: '#22C55E' }

export function loadColors(): Colors {
  try {
    const saved = localStorage.getItem('rin_colors')
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
  } catch { return defaults }
}

export function applyColors(colors: Colors) {
  const root = document.documentElement
  root.style.setProperty('--color-brand', colors.brand)
  root.style.setProperty('--color-navy', colors.navy)
  root.style.setProperty('--color-ai', colors.ai)
  root.style.setProperty('--color-success', colors.success)
}

export default function ColorCustomizer() {
  const [open, setOpen] = useState(false)
  const [colors, setColors] = useState<Colors>(loadColors)

  useEffect(() => { if (open) applyColors(colors) }, [colors, open])

  const handleChange = (key: keyof Colors, val: string) => {
    const next = { ...colors, [key]: val }
    setColors(next)
    localStorage.setItem('rin_colors', JSON.stringify(next))
  }

  const reset = () => {
    setColors(defaults)
    localStorage.removeItem('rin_colors')
    applyColors(defaults)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors w-full">
        <Palette size={18} />
        Customize Colors
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-bold text-lg text-navy">Theme Colors</h3>
              <button onClick={() => setOpen(false)}><X size={18} className="text-muted" /></button>
            </div>
            <div className="space-y-3">
              {(['brand', 'navy', 'ai', 'success'] as const).map(key => (
                <div key={key}>
                  <label className="text-xs font-medium text-muted capitalize block mb-1">{key}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={colors[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-border" />
                    <input type="text" value={colors[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      className="flex-1 border border-border rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ai/30" />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={reset}
              className="mt-4 w-full border border-border text-muted text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </>
  )
}
