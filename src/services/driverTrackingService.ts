export interface DriverPosition {
  lat: number
  lng: number
  heading: number
  speed: number
  address: string
}

const listeners: ((pos: DriverPosition) => void)[] = []

export function onDriverPosition(cb: (pos: DriverPosition) => void) {
  listeners.push(cb)
  return () => { const i = listeners.indexOf(cb); if (i >= 0) listeners.splice(i, 1) }
}

export function startMockTracking(shopLat: number, shopLng: number) {
  let lat = shopLat - 0.08
  let lng = shopLng - 0.05
  const interval = setInterval(() => {
    lat += 0.002 + Math.random() * 0.003
    lng += 0.001 + Math.random() * 0.002
    if (lat >= shopLat && lng >= shopLng) {
      lat = shopLat
      lng = shopLng
      clearInterval(interval)
    }
    listeners.forEach(cb => cb({
      lat, lng,
      heading: Math.atan2(shopLng - lng, shopLat - lat) * (180 / Math.PI),
      speed: 35 + Math.random() * 25,
      address: `${(Math.abs(lat - shopLat) * 69).toFixed(1)} mi from shop`,
    }))
  }, 3000)
  return () => clearInterval(interval)
}
