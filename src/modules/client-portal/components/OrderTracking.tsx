import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Truck, MapPin, Calendar, CheckCircle, Clock, Package } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface OrderTrackingProps {
  customerId: string
  deliveries: Delivery[]
}

export function OrderTracking({ customerId, deliveries }: OrderTrackingProps) {
  const [activeTab, setActiveTab] = useState('active')
  
  const customerDeliveries = deliveries.filter(delivery => delivery.customerId === customerId)
  
  const activeDeliveries = customerDeliveries.filter(
    d => d.status === DeliveryStatus.SCHEDULED || d.status === DeliveryStatus.IN_TRANSIT
  )
  
  const completedDeliveries = customerDeliveries.filter(
    d => d.status === DeliveryStatus.DELIVERED
  )

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

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SCHEDULED:
        return <Calendar className="h-5 w-5 text-blue-500" />
      case DeliveryStatus.IN_TRANSIT:
        return <Truck className="h-5 w-5 text-yellow-500" />
      case DeliveryStatus.DELIVERED:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case DeliveryStatus.CANCELLED:
        return <Clock className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const renderDeliveryCard = (delivery: Delivery) => (
    <Card key={delivery.id} className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(delivery.status)}
            <div>
              <h3 className="text-lg font-semibold">Delivery #{delivery.id}</h3>
              <div className="flex items-center mt-1">
                <Badge className={cn("ri-badge-status", getStatusColor(delivery.status))}>
                  {delivery.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-2 md:mt-0">
            {delivery.status === DeliveryStatus.SCHEDULED && (
              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Scheduled for {formatDate(delivery.scheduledDate)}
              </div>
            )}
            {delivery.status === DeliveryStatus.IN_TRANSIT && (
              <div className="text-sm text-muted-foreground flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                In transit since {delivery.customFields?.departureTime ? 
                  new Date(delivery.customFields.departureTime).toLocaleString() : 
                  'unknown'}
              </div>
            )}
            {delivery.status === DeliveryStatus.DELIVERED && delivery.deliveredDate && (
              <div className="text-sm text-muted-foreground flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Delivered on {formatDate(delivery.deliveredDate)}
              </div>
            )}
          </div>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Delivery Address:</p>
              <p className="text-sm text-muted-foreground">
                {delivery.address.street}, {delivery.address.city}, {delivery.address.state} {delivery.address.zipCode}
              </p>
            </div>
          </div>
        </div>

        {delivery.status === DeliveryStatus.IN_TRANSIT && delivery.customFields?.estimatedArrival && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700">Estimated Arrival:</p>
                <p className="text-sm text-yellow-600">
                  {delivery.customFields.estimatedArrival}
                </p>
              </div>
            </div>
          </div>
        )}

        {delivery.notes && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium">Notes:</p>
            <p>{delivery.notes}</p>
          </div>
        )}

        {delivery.status === DeliveryStatus.DELIVERED && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              View Delivery Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Order Tracking</h2>
        <p className="text-muted-foreground">
          Track the status of your Home/RV delivery
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active Orders
            {activeDeliveries.length > 0 && (
              <Badge className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                {activeDeliveries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedDeliveries.length > 0 && (
              <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
                {completedDeliveries.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDeliveries.length > 0 ? (
            activeDeliveries.map(delivery => renderDeliveryCard(delivery))
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Deliveries</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any active deliveries at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeliveries.length > 0 ? (
            completedDeliveries.map(delivery => renderDeliveryCard(delivery))
          ) : (
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Deliveries</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any completed deliveries yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}