export interface Notification {
  id: string
  title: string
  message: string
  type: 'job_accepted' | 'shop_available' | 'repair_complete' | 'alert'
  timestamp: Date
  read: boolean
}

const listeners: ((n: Notification) => void)[] = []
let counter = 0

export function onNotification(cb: (n: Notification) => void) {
  listeners.push(cb)
  return () => { const i = listeners.indexOf(cb); if (i >= 0) listeners.splice(i, 1) }
}

function emit(n: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const notif: Notification = { ...n, id: `n-${++counter}`, timestamp: new Date(), read: false }
  listeners.forEach(cb => cb(notif))
}

const shops = ['TruckPro Service Center', 'Reliable Diesel Fleet', 'Lone Star Heavy Duty', 'Mechanix Express']

export function startMockNotifications() {
  const simulate = () => {
    const type = ['job_accepted', 'shop_available', 'repair_complete', 'alert'][Math.floor(Math.random() * 4)] as Notification['type']
    const shop = shops[Math.floor(Math.random() * shops.length)]
    switch (type) {
      case 'job_accepted':
        emit({ type, title: 'Job Accepted', message: `${shop} has accepted your repair request` })
        break
      case 'shop_available':
        emit({ type, title: 'Shop Available', message: `${shop} now has bay availability for your truck` })
        break
      case 'repair_complete':
        emit({ type, title: 'Repair Complete', message: `Your vehicle at ${shop} is ready for pickup` })
        break
      case 'alert':
        emit({ type, title: 'Price Alert', message: `Part prices dropped at ${shop} — save up to 15%` })
        break
    }
    setTimeout(simulate, 15000 + Math.random() * 30000)
  }
  setTimeout(simulate, 5000)
}
