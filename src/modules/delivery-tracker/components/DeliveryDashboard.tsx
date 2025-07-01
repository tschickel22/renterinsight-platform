import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Plus
} from 'lucide-react'
import { Delivery, DeliveryStatus } from '@/types'
import { formatDate } from '@/lib/utils'
import { DeliveryMap } from './DeliveryMap'
import { DeliveryTimeline } from './DeliveryTimeline'

interface DeliveryDashboardProps {
  deliveries: Delivery[]
  onScheduleDelivery: () => void
}

export function DeliveryDashboard({ deliveries, onScheduleDelivery }: DeliveryDashboardProps) {
  const totalDeliveries = deliveries.length
  const scheduledDeliveries = deliveries.filter(
    d => d.status === DeliveryStatus.SCHEDULED
  ).length
  const inTransitDeliveries = deliveries.filter(
    d => d.status === DeliveryStatus.IN_TRANSIT
  ).length
  const completedDeliveries = deliveries.filter(
    d => d.status === DeliveryStatus.DELIVERED
  ).length

  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingDeliveries = deliveries
    .filter(
      d =>
        d.status === DeliveryStatus.SCHEDULED &&
        d.scheduledDate >= now &&
        d.scheduledDate <= nextWeek
    )
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  const inTransitDeliveriesList = deliveries
    .filter(d => d.status === DeliveryStatus.IN_TRANSIT)
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentDeliveries = deliveries
    .filter(
      d =>
        d.status === DeliveryStatus.DELIVERED &&
        d.deliveredDate &&
        d.deliveredDate >= lastMonth
    )
    .sort(
      (a, b) =>
        (b.deliveredDate?.getTime() || 0) - (a.deliveredDate?.getTime() || 0)
    )
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[{
          title: 'Total Deliveries',
          count: totalDeliveries,
          icon: <Truck className="h-4 w-4 text-blue-800" />,
          description: 'All time',
          bg: 'bg-blue-100'
        }, {
          title: 'Scheduled',
          count: scheduledDeliveries,
          icon: <Calendar className="h-4 w-4 text-yellow-700" />,
          description: 'Upcoming deliveries',
          bg: 'bg-yellow-100'
        }, {
          title: 'In Transit',
          count: inTransitDeliveries,
          icon: <Truck className="h-4 w-4 text-orange-700" />,
          description: 'Currently in transit',
          bg: 'bg-orange-100'
        }, {
          title: 'Completed',
          count: completedDeliveries,
          icon: <CheckCircle className="h-4 w-4 text-green-700" />,
          description: 'Successful deliveries',
          bg: 'bg-green-100'
        }].map((stat, index) => (
          <Card key={index} className={`${stat.bg} border-0 shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming and In Transit */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Deliveries</CardTitle>
              <Button size="sm" onClick={onScheduleDelivery}>
                <Plus className="h-4 w-4 mr-2" />
                Schedule
              </Button>
            </div>
            <CardDescription>Deliveries scheduled for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeliveries.length > 0 ? (
              <div className="space-y-4">
                {upcomingDeliveries.map(delivery => (
                  <div key={delivery.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Delivery #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(delivery.scheduledDate)}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">Customer: {delivery.customerId}</p>
                      <p className="text-sm text-muted-foreground truncate">{delivery.address.city}, {delivery.address.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming deliveries</p>
                <p className="text-sm">Schedule a new delivery to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>In-Transit Deliveries</CardTitle>
            <CardDescription>Deliveries currently on the road</CardDescription>
          </CardHeader>
          <CardContent>
            {inTransitDeliveriesList.length > 0 ? (
              <div className="space-y-4">
                {inTransitDeliveriesList.map(delivery => (
                  <div key={delivery.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Truck className="h-5 w-5 text-yellow-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Delivery #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">ETA: {delivery.customFields?.estimatedArrival || 'Unknown'}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">Driver: {delivery.driver || 'Unassigned'}</p>
                      <p className="text-sm text-muted-foreground truncate">{delivery.address.city}, {delivery.address.state}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No deliveries in transit</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Map and Recent Deliveries */}
      <div className="grid gap-6 md:grid-cols-3">
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
                <CardDescription>No active deliveries to display</CardDescription>
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

        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>Recently completed deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDeliveries.length > 0 ? (
              <div className="space-y-4">
                {recentDeliveries.map(delivery => (
                  <div key={delivery.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Delivery #{delivery.id}</p>
                        <p className="text-sm text-muted-foreground">{delivery.deliveredDate ? formatDate(delivery.deliveredDate) : 'Unknown'}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">Customer: {delivery.customerId}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent deliveries</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
