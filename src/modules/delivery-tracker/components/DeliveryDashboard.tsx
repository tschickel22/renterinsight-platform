import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Truck, Calendar, Clock, MapPin, TrendingUp, BarChart3 } from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { DeliveryMap } from './DeliveryMap'

interface DeliveryDashboardProps {
  deliveries: Delivery[]
  onScheduleDelivery: () => void
}

export function DeliveryDashboard({ deliveries, onScheduleDelivery }: DeliveryDashboardProps) {
  // Calculate stats
  const totalDeliveries = deliveries.length
  const scheduledDeliveries = deliveries.filter(d => d.status === DeliveryStatus.SCHEDULED).length
  const inTransitDeliveries = deliveries.filter(d => d.status === DeliveryStatus.IN_TRANSIT).length
  const completedDeliveries = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length
  
  // Get upcoming deliveries (scheduled for the next 7 days)
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingDeliveries = deliveries
    .filter(d => 
      d.status === DeliveryStatus.SCHEDULED && 
      d.scheduledDate >= now && 
      d.scheduledDate <= nextWeek
    )
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
  
  // Get in-transit deliveries
  const inTransitDeliveriesList = deliveries
    .filter(d => d.status === DeliveryStatus.IN_TRANSIT)
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
  
  // Get recent deliveries (completed in the last 30 days)
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentDeliveries = deliveries
    .filter(d => 
      d.status === DeliveryStatus.DELIVERED && 
      d.deliveredDate && 
      d.deliveredDate >= lastMonth
    )
    .sort((a, b) => (b.deliveredDate?.getTime() || 0) - (a.deliveredDate?.getTime() || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming deliveries
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Currently in transit
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Successful deliveries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Deliveries */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Deliveries</CardTitle>
              <Button size="sm" onClick={onScheduleDelivery}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
            <CardDescription>
              Deliveries scheduled for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeliveries.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Delivery #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(delivery.scheduledDate)}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Customer: {delivery.customerId}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {delivery.address.city}, {delivery.address.state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No upcoming deliveries</p>
                <p className="text-sm">Schedule a new delivery to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* In-Transit Deliveries */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>In-Transit Deliveries</CardTitle>
            <CardDescription>
              Deliveries currently on the road
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inTransitDeliveriesList.length > 0 ? (
              <div className="space-y-4">
                {inTransitDeliveriesList.map((delivery) => (
                  <div key={delivery.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <Truck className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Delivery #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">
                          ETA: {delivery.customFields?.estimatedArrival || 'Unknown'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Driver: {delivery.driver || 'Unassigned'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {delivery.address.city}, {delivery.address.state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No deliveries in transit</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map and Recent Deliveries */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Map */}
        <div className="md:col-span-2">
          {inTransitDeliveriesList.length > 0 ? (
            <DeliveryMap delivery={inTransitDeliveriesList[0]} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Delivery Map
                </CardTitle>
                <CardDescription>
                  No active deliveries to display
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No active deliveries to track</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Deliveries */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>
              Recently completed deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentDeliveries.length > 0 ? (
              <div className="space-y-4">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Delivery #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.deliveredDate ? formatDate(delivery.deliveredDate) : 'Unknown'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Customer: {delivery.customerId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No recent deliveries</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}