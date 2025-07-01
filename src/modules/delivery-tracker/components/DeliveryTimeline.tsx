// DeliveryTimeline.tsx with enhanced error handling and cleaned logic
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Truck,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  MessageSquare
} from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DeliveryTimelineProps {
  delivery: Delivery
  onAddMilestone?: (deliveryId: string, milestone: any) => void
}

export function DeliveryTimeline({ delivery, onAddMilestone }: DeliveryTimelineProps) {
  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SCHEDULED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case DeliveryStatus.IN_TRANSIT:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case DeliveryStatus.DELIVERED:
        return 'bg-green-50 text-green-700 border-green-200'
      case DeliveryStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getMilestones = () => {
    try {
      const m: any[] = []
      const cf = delivery.customFields || {}
      const safeDate = (d?: Date | string | null) => (d ? new Date(d) : new Date())

      m.push({
        id: 'scheduled',
        title: 'Delivery Scheduled',
        description: `Scheduled for ${formatDate(delivery.scheduledDate)}`,
        date: safeDate(delivery.createdAt),
        icon: Calendar
      })

      if ([DeliveryStatus.IN_TRANSIT, DeliveryStatus.DELIVERED].includes(delivery.status)) {
        m.push({
          id: 'preparation',
          title: 'Preparation Complete',
          description: 'Vehicle prepared and ready for delivery',
          date: new Date(new Date(delivery.scheduledDate).getTime() - 86400000),
          icon: CheckCircle
        })

        m.push({
          id: 'in_transit',
          title: 'In Transit',
          description: cf.departureNotes || 'Vehicle has left the dealership',
          date: safeDate(cf.departureTime),
          icon: Truck
        })
      }

      if (cf.etaUpdated && cf.estimatedArrival) {
        m.push({
          id: 'eta_update',
          title: 'ETA Updated',
          description: `New estimated arrival: ${cf.estimatedArrival}`,
          date: safeDate(cf.etaUpdated),
          icon: Clock
        })
      }

      if (cf.customerNotified) {
        m.push({
          id: 'customer_notified',
          title: 'Customer Notified',
          description: `${cf.notificationMethod || 'SMS'} notification sent to customer`,
          date: safeDate(cf.customerNotified),
          icon: MessageSquare
        })
      }

      if (delivery.status === DeliveryStatus.DELIVERED) {
        m.push({
          id: 'arrived',
          title: 'Arrived at Destination',
          description: 'Vehicle arrived at delivery location',
          date: safeDate(delivery.deliveredDate),
          icon: MapPin
        })

        m.push({
          id: 'delivered',
          title: 'Delivery Confirmed',
          description: cf.deliveryNotes || 'Delivery completed successfully',
          date: safeDate(delivery.deliveredDate),
          icon: CheckCircle
        })

        if (Array.isArray(cf.deliveryPhotos) && cf.deliveryPhotos.length > 0) {
          m.push({
            id: 'photos',
            title: 'Delivery Photos',
            description: `${cf.deliveryPhotos.length} photo(s) captured`,
            date: safeDate(delivery.deliveredDate),
            icon: Camera
          })
        }
      }

      const uniqueMilestones = Array.from(new Map(m.map(i => [i.id, i])).values())
      return uniqueMilestones.sort((a, b) => a.date.getTime() - b.date.getTime())
    } catch (err) {
      console.error('Failed to generate milestones:', err)
      return []
    }
  }

  const milestones = getMilestones()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2 text-primary" />
          Delivery Timeline
        </CardTitle>
        <CardDescription>Track the progress of this delivery</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-8">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            return (
              <div key={milestone.id} className="relative">
                <div className={cn(
                  'absolute left-[-21px] w-6 h-6 rounded-full flex items-center justify-center',
                  'bg-primary text-primary-foreground'
                )}>
                  <Icon className="h-3 w-3" />
                </div>

                <div className="mb-1 flex items-center">
                  <h3 className="text-base font-semibold">{milestone.title}</h3>
                  <Badge className="ml-2 text-xs" variant="outline">
                    {formatDate(milestone.date)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>

                {milestone.id === 'photos' && delivery.customFields?.deliveryPhotos && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {delivery.customFields.deliveryPhotos.map((photo: string, i: number) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Delivery photo ${i + 1}`}
                        className="h-20 w-full object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}