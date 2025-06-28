import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Calendar, CheckCircle, Clock, MapPin, Package } from 'lucide-react'

interface DeliveryEvent {
  id: string
  type: string
  title: string
  description: string
  timestamp: Date
}

interface DeliveryTimelineProps {
  delivery: {
    id: string
    status: string
    events: DeliveryEvent[]
  }
}

export function DeliveryTimeline({ delivery }: DeliveryTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'scheduled':
        return <Calendar className="h-5 w-5 text-blue-500" />
      case 'preparation':
        return <Package className="h-5 w-5 text-purple-500" />
      case 'departure':
        return <Truck className="h-5 w-5 text-green-500" />
      case 'in_transit':
        return <Truck className="h-5 w-5 text-yellow-500" />
      case 'arrived':
        return <MapPin className="h-5 w-5 text-red-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Sort events by timestamp (most recent first)
  const sortedEvents = [...delivery.events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Timeline</CardTitle>
        <CardDescription>Track the progress of your delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-8">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

          {sortedEvents.map((event, index) => {
            const Icon = () => getEventIcon(event.type)
            return (
              <div key={event.id} className="relative">
                <div className="absolute left-[-21px] w-6 h-6 rounded-full flex items-center justify-center bg-background border-2 border-primary">
                  <Icon />
                </div>

                <div className="mb-1 flex items-center">
                  <h3 className="text-base font-semibold">{event.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {event.timestamp.toLocaleString()}
                </p>
              </div>
            )
          })}

          {delivery.status !== 'delivered' && (
            <div className="relative">
              <div className="absolute left-[-21px] w-6 h-6 rounded-full flex items-center justify-center bg-background border-2 border-dashed border-muted-foreground">
                <CheckCircle className="h-3 w-3 text-muted-foreground" />
              </div>

              <div className="mb-1 flex items-center">
                <h3 className="text-base font-semibold text-muted-foreground">Delivery Complete</h3>
              </div>
              <p className="text-sm text-muted-foreground">Your delivery will be completed soon</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}