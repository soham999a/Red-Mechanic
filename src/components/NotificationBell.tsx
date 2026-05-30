import { useState, useEffect, useRef } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { onNotification, startMockNotifications } from '../services/notificationService'
import type { Notification } from '../services/notificationService'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    startMockNotifications()
    const unsub = onNotification(n => {
      setNotifications(prev => [n, ...prev])
    })
    return unsub
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const typeColor = (type: string) => {
    switch (type) {
      case 'job_accepted': return 'bg-green-400'
      case 'shop_available': return 'bg-blue-400'
      case 'repair_complete': return 'bg-brand'
      case 'alert': return 'bg-amber-400'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-white transition-colors">
        <Bell size={20} className="text-muted" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold flex items-center justify-center rounded-full">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-navy">Notifications</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-ai hover:underline">
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-muted text-center py-8">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 border-b border-border/50 hover:bg-gray-50/50 transition-colors ${n.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColor(n.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy">{n.title}</p>
                      <p className="text-xs text-muted truncate">{n.message}</p>
                      <p className="text-[10px] text-muted/60 mt-0.5">{n.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
