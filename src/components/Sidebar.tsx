import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { House, Cpu, MapPin, BarChart2, ClipboardList, Shield, Eye, EyeOff, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ColorCustomizer from './ColorCustomizer'
import NotificationBell from './NotificationBell'

const navItems = [
  { to: '/', labelKey: 'nav.home', icon: House },
  { to: '/diagnostics', labelKey: 'nav.diagnostics', icon: Cpu },
  { to: '/matching', labelKey: 'nav.matching', icon: MapPin },
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: BarChart2 },
  { to: '/history', labelKey: 'nav.history', icon: ClipboardList },
  { to: '/admin', labelKey: 'nav.admin', icon: Shield },
]

export default function Sidebar() {
  const { t, i18n } = useTranslation()
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('rin_gemini_key')
    if (saved) setApiKey(saved)
  }, [])

  const handleKeyChange = (val: string) => {
    setApiKey(val)
    localStorage.setItem('rin_gemini_key', val)
  }

  const switchLang = () => {
    const next = i18n.language === 'en' ? 'es' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('rin_lang', next)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-navy flex flex-col z-50">
      <div className="px-5 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-left">
          <span className="font-sora font-bold text-2xl text-brand tracking-tight">RIN</span>
          <p className="text-white/40 text-[11px] leading-tight mt-0.5">Repair Intelligence Network</p>
        </button>
        <NotificationBell />
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
        {navItems.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-brand bg-brand/10 border-l-[3px] border-brand rounded-l-none'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} />
            {t(labelKey)}
          </NavLink>
        ))}
        <div className="pt-2 mt-2 border-t border-white/10">
          <ColorCustomizer />
          <button onClick={switchLang}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors w-full">
            <Globe size={18} />
            {i18n.language === 'en' ? 'Español' : 'English'}
          </button>
        </div>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mb-2">{t('sidebar.apiKey')}</p>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={t('sidebar.pasteKey')}
              className="w-full bg-white/10 text-white text-xs rounded px-2 py-1.5 border border-white/10 focus:outline-none focus:border-brand/50 placeholder:text-white/30 font-mono"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-white/30 text-[10px] mt-1.5">{t('sidebar.keyNeverLeaves')}</p>
        </div>
      </div>
    </aside>
  )
}
