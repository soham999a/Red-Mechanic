import { MapPin, Navigation } from 'lucide-react'

interface MapViewProps {
  lat: number
  lng: number
  shopName: string
  distance?: number
  driverLat?: number
  driverLng?: number
}

export default function MapView({ lat, lng, shopName, distance, driverLat, driverLng }: MapViewProps) {
  const query = encodeURIComponent(`${lat},${lng}`)
  const src = `https://www.google.com/maps?q=${query}&output=embed&z=13`

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="h-48 bg-gray-100 relative">
        <iframe
          title={shopName}
          src={src}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {driverLat && driverLng && (
          <div className="absolute top-2 left-2 bg-white rounded-full px-2.5 py-1 shadow-md flex items-center gap-1.5 text-xs font-medium text-ai">
            <Navigation size={12} className="animate-pulse" />
            Driver en route
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin size={16} className="text-brand" />
          <span>{shopName}</span>
        </div>
        {distance && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ai hover:underline font-medium"
          >
            {distance} mi &rarr;
          </a>
        )}
      </div>
    </div>
  )
}
