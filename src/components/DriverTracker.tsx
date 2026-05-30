import { useState, useEffect } from 'react'
import { Navigation, Truck, Gauge, MapPin } from 'lucide-react'
import { onDriverPosition, startMockTracking } from '../services/driverTrackingService'

interface DriverTrackerProps {
  shopLat: number
  shopLng: number
  shopName: string
}

export default function DriverTracker({ shopLat, shopLng, shopName }: DriverTrackerProps) {
  const [pos, setPos] = useState<{ lat: number; lng: number; speed: number; address: string } | null>(null)
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    const unsub = onDriverPosition(p => setPos(p))
    return unsub
  }, [])

  const startTracking = () => {
    setTracking(true)
    startMockTracking(shopLat, shopLng)
  }

  const progress = pos ? Math.min(100, ((Math.abs(pos.lat - shopLat) + Math.abs(pos.lng - shopLng)) / 0.15) * 100) : 0

  return (
    <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={18} className="text-ai" />
        <span className="font-semibold text-sm text-navy">Driver Tracking</span>
      </div>

      {!tracking ? (
        <button onClick={startTracking}
          className="w-full bg-ai hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Navigation size={16} /> Start Live Tracking
        </button>
      ) : pos ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand" />
              <span className="text-muted text-xs">{pos.address}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Gauge size={12} /> {Math.round(pos.speed)} mph
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-ai rounded-full transition-all duration-1000" style={{ width: `${100 - progress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted">
            <span>Origin</span>
            <span className="font-medium text-ai">{shopName}</span>
          </div>
          <p className="text-[10px] text-muted text-center animate-pulse">Updating in real-time &bull; GPS active</p>
        </div>
      ) : (
        <p className="text-xs text-muted text-center py-3">Waiting for GPS signal...</p>
      )}
    </div>
  )
}
