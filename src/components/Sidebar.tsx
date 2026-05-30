import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import { House, Cpu, MapPin, BarChart2, ClipboardList, Shield, Eye, EyeOff, Globe, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ColorCustomizer from './ColorCustomizer'
import NotificationBell from './NotificationBell'

const SidebarContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })
export const useSidebar = () => useContext(SidebarContext)

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
  const [open, setOpen] = useState(false)
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

  const close = () => setOpen(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-border flex items-center justify-between px-4 z-40 lg:hidden">
        <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          {open ? <X size={22} className="text-navy" /> : <Menu size={22} className="text-navy" />}
        </button>
        <span className="font-sora font-bold text-lg text-brand">RIN</span>
        <NotificationBell />
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={close} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-[240px] bg-navy flex flex-col z-50 transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="px-5 pt-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <button onClick={() => { navigate('/'); close() }} className="text-left">
            <span className="font-sora font-bold text-2xl text-brand tracking-tight">RIN</span>
            <p className="text-white/40 text-[11px] leading-tight mt-0.5">Repair Intelligence Network</p>
          </button>
          <button onClick={close} className="lg:hidden text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
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
    </SidebarContext.Provider>
  )
}
