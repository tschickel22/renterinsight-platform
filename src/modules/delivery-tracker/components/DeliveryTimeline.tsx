import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Calendar, CheckCircle, Clock, MapPin, Camera, MessageSquare } from 'lucide-react'
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

  // Generate milestones based on delivery status and data
  const getMilestones = () => {
    const milestones = [
      {
        id: 'scheduled',
        title: 'Delivery Scheduled',
        description: `Scheduled for ${formatDate(delivery.scheduledDate)}`,
        date: delivery.createdAt,
        status: 'completed',
        icon: Calendar
      }
    ]

    // Add preparation milestone if in transit or delivered
    if (delivery.status === DeliveryStatus.IN_TRANSIT || delivery.status === DeliveryStatus.DELIVERED) {
      milestones.push({
        id: 'preparation',
        title: 'Preparation Complete',
        description: 'Vehicle prepared and ready for delivery',
        date: new Date(delivery.scheduledDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before scheduled
        status: 'completed',
        icon: CheckCircle
      })
    }

    // Add in transit milestone if applicable
    if (delivery.status === DeliveryStatus.IN_TRANSIT || delivery.status === DeliveryStatus.DELIVERED) {
      milestones.push({
        id: 'in_transit',
        title: 'In Transit',
        description: delivery.customFields?.departureNotes || 'Vehicle has left the dealership',
        date: delivery.customFields?.departureTime ? new Date(delivery.customFields.departureTime) : new Date(),
        status: 'completed',
        icon: Truck
      })
    }

    // Add ETA update if available
    if (delivery.customFields?.etaUpdated) {
      milestones.push({
        id: 'eta_update',
        title: 'ETA Updated',
        description: `New estimated arrival: ${delivery.customFields.estimatedArrival}`,
        date: new Date(delivery.customFields.etaUpdated),
        status: 'completed',
        icon: Clock
      })
    }

    // Add customer notification if available
    if (delivery.customFields?.customerNotified) {
      milestones.push({
        id: 'customer_notified',
        title: 'Customer Notified',
        description: `${delivery.customFields.notificationMethod || 'SMS'} notification sent to customer`,
        date: new Date(delivery.customFields.customerNotified),
        status: 'completed',
        icon: MessageSquare
      })
    }

    // Add ETA update if available
    if (delivery.customFields?.etaUpdated) {
      milestones.push({
        id: 'eta_update',
        title: 'ETA Updated',
        description: `New estimated arrival: ${delivery.customFields.estimatedArrival}`,
        date: new Date(delivery.customFields.etaUpdated),
        status: 'completed',
        icon: Clock
      })
    }

    // Add customer notification if available
    if (delivery.customFields?.customerNotified) {
      milestones.push({
        id: 'customer_notified',
        title: 'Customer Notified',
        description: `${delivery.customFields.notificationMethod || 'SMS'} notification sent to customer`,
        date: new Date(delivery.customFields.customerNotified),
        status: 'completed',
        icon: MessageSquare
      })
    }

    // Add arrival milestone if delivered
    if (delivery.status === DeliveryStatus.DELIVERED) {
      milestones.push({
        id: 'arrived',
        title: 'Arrived at Destination',
        description: 'Vehicle arrived at delivery location',
        date: delivery.deliveredDate || new Date(),
        status: 'completed',
        icon: MapPin
      })
    }

    // Add delivery confirmation if delivered
    if (delivery.status === DeliveryStatus.DELIVERED) {
      milestones.push({
        id: 'delivered',
        title: 'Delivery Confirmed',
        description: delivery.customFields?.deliveryNotes || 'Delivery completed successfully',
        date: delivery.deliveredDate || new Date(),
        status: 'completed',
        icon: CheckCircle
      })
    }

    // Add photo verification if available
    if (delivery.customFields?.deliveryPhotos && delivery.customFields.deliveryPhotos.length > 0) {
      milestones.push({
        id: 'photos',
        title: 'Delivery Photos',
        description: `${delivery.customFields.deliveryPhotos.length} photos captured`,
        date: delivery.deliveredDate || new Date(),
        status: 'completed',
        icon: Camera
      })
    }

    // Add photo verification if available
    if (delivery.customFields?.deliveryPhotos && delivery.customFields.deliveryPhotos.length > 0) {
      milestones.push({
        id: 'photos',
        title: 'Delivery Photos',
        description: `${delivery.customFields.deliveryPhotos.length} photos captured`,
        date: delivery.deliveredDate || new Date(),
        status: 'completed',
        icon: Camera
      })
    }

    // Sort milestones by date
    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const milestones = getMilestones()

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="h-5 w-5 mr-2 text-primary" />
          Delivery Timeline
        </CardTitle>
        <CardDescription>
          Track the progress of this delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-8 space-y-8">
          {/* Vertical timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

          {milestones.map((milestone, index) => {
            const Icon = milestone.icon
            const isLast = index === milestones.length - 1

            return (
              <div key={milestone.id} className="relative">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-[-21px] w-6 h-6 rounded-full flex items-center justify-center",
                  milestone.status === 'completed' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="h-3 w-3" />
                </div>
                
                <div className="mb-1 flex items-center">
                  <h3 className="text-base font-semibold">{milestone.title}</h3>
                  <Badge className="ml-2 text-xs" variant="outline">
                    {formatDate(milestone.date)}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
                
                {/* Display photos if this is the photos milestone */}
                {milestone.id === 'photos' && delivery.customFields?.deliveryPhotos && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {delivery.customFields.deliveryPhotos.map((photo: string, photoIndex: number) => (
                      <img 
                        key={photoIndex} 
                        src={photo} 
                        alt={`Delivery photo ${photoIndex + 1}`} 
                        className="h-20 w-full object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                {/* Display photos if this is the photos milestone */}
                {milestone.id === 'photos' && delivery.customFields?.deliveryPhotos && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {delivery.customFields.deliveryPhotos.map((photo: string, photoIndex: number) => (
                      <img 
                        key={photoIndex} 
                        src={photo} 
                        alt={`Delivery photo ${photoIndex + 1}`} 
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