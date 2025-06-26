import React, { useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Delivery } from '@/types'
import { MapPin, Navigation, Truck } from 'lucide-react'

interface DeliveryMapProps {
  delivery: Delivery
  className?: string
}

export function DeliveryMap({ delivery, className }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // In a real application, this would use a mapping API like Google Maps, Mapbox, etc.
    // For this demo, we'll just show a placeholder map
    
    if (mapRef.current) {
      // Create a simple placeholder map
      const mapContainer = mapRef.current
      mapContainer.innerHTML = ''
      
      // Create map elements
      const mapElement = document.createElement('div')
      mapElement.className = 'relative w-full h-full bg-muted/30 rounded-lg overflow-hidden'
      
      // Add map content
      mapElement.innerHTML = `
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-muted-foreground mb-2">Map would display here in a real application</div>
            <div class="flex flex-col items-center">
              <div class="text-sm font-medium">Delivery Address:</div>
              <div class="text-sm">${delivery.address.street}</div>
              <div class="text-sm">${delivery.address.city}, ${delivery.address.state} ${delivery.address.zipCode}</div>
            </div>
          </div>
        </div>
        
        <!-- Simulated map markers -->
        <div class="absolute bottom-4 right-4 bg-background p-2 rounded-md shadow-sm">
          <div class="flex items-center space-x-2 text-xs">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Origin</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span>Destination</span>
            </div>
            ${delivery.status === 'in_transit' ? `
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Current Location</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <!-- Simulated route -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg width="200" height="100" viewBox="0 0 200 100">
            <path d="M20,80 Q100,20 180,80" stroke="#3b82f6" stroke-width="3" fill="none" stroke-dasharray="5,5" />
            ${delivery.status === 'in_transit' ? `
              <circle cx="100" cy="50" r="5" fill="#3b82f6" />
            ` : ''}
            <circle cx="20" cy="80" r="5" fill="#22c55e" />
            <circle cx="180" cy="80" r="5" fill="#ef4444" />
          </svg>
        </div>
      `
      
      mapContainer.appendChild(mapElement)
    }
  }, [delivery])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          Delivery Map
        </CardTitle>
        <CardDescription>
          Track delivery location and route
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-64 w-full">
          {/* Map will be rendered here */}
          <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
            <div className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}