import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Calendar, MapPin, CheckCircle, Clock, AlertTriangle, Camera } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface DeliveryTimelineProps {
  delivery: Delivery
}

export function DeliveryTimeline({ delivery }: DeliveryTimelineProps) {
  // Define milestones based on delivery status and dates
  const milestones = [
    {
      id: 'created',
      title: 'Delivery Scheduled',
      date: delivery.createdAt,
      icon: Calendar,
      status: 'completed',
      description: `Delivery scheduled for ${formatDate(delivery.scheduledDate)}`
    },
    {
      id: 'preparation',
      title: 'Preparation',
      date: new Date(delivery.createdAt.getTime() + 24 * 60 * 60 * 1000), // 1 day after creation
      icon: Truck,
      status: delivery.status !== DeliveryStatus.SCHEDULED ? 'completed' : 
              new Date() > new Date(delivery.createdAt.getTime() + 24 * 60 * 60 * 1000) ? 'completed' : 'pending',
      description: 'Vehicle prepared for delivery'
    },
    {
      id: 'in_transit',
      title: 'In Transit',
      date: delivery.status === DeliveryStatus.IN_TRANSIT ? delivery.updatedAt : null,
      icon: Truck,
      status: delivery.status === DeliveryStatus.IN_TRANSIT || delivery.status === DeliveryStatus.DELIVERED ? 'completed' : 'pending',
      description: delivery.status === DeliveryStatus.IN_TRANSIT ? 'Vehicle is on the way to customer' : 'Waiting to begin transit'
    },
    {
      id: 'delivered',
      title: 'Delivered',
      date: delivery.deliveredDate,
      icon: CheckCircle,
      status: delivery.status === DeliveryStatus.DELIVERED ? 'completed' : 'pending',
      description: delivery.deliveredDate ? `Delivered on ${formatDate(delivery.deliveredDate)}` : 'Pending delivery'
    }
  ]

  // If delivery is cancelled, add a cancelled milestone
  if (delivery.status === DeliveryStatus.CANCELLED) {
    milestones.push({
      id: 'cancelled',
      title: 'Cancelled',
      date: delivery.updatedAt,
      icon: AlertTriangle,
      status: 'completed',
      description: 'Delivery was cancelled'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500'
      case 'pending':
        return 'text-yellow-500'
      case 'cancelled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary" />
          Delivery Timeline
        </CardTitle>
        <CardDescription>
          Track the progress of this delivery
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const isLast = index === milestones.length - 1
            
            return (
              <div key={milestone.id} className="relative">
                {!isLast && (
                  <div className={cn(
                    "absolute left-6 top-10 bottom-0 w-px",
                    milestone.status === 'completed' ? "bg-green-200" : "bg-gray-200"
                  )} />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                    milestone.status === 'completed' ? "bg-green-50 border-2 border-green-200" : "bg-gray-50 border-2 border-gray-200"
                  )}>
                    <milestone.icon className={cn(
                      "h-6 w-6",
                      getStatusColor(milestone.status)
                    )} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge className={cn(
                        "text-xs",
                        milestone.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
                        milestone.status === 'pending' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {milestone.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                    
                    {milestone.date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(milestone.date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}