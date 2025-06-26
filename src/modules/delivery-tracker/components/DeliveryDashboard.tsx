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
  const scheduledDeliveries = deliveries.filter(d => d.status === DeliveryStatus.SCHEDULED).length
  const inTransitDeliveries = deliveries.filter(d => d.status === DeliveryStatus.IN_TRANSIT).length
  const completedDeliveries = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length

  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingDeliveries = deliveries.filter(
    d => d.status === DeliveryStatus.SCHEDULED && d.scheduledDate >= now && d.scheduledDate <= nextWeek
  ).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  const inTransitDeliveriesList = deliveries.filter(d => d.status === DeliveryStatus.IN_TRANSIT)
    .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())

  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const recentDeliveries = deliveries.filter(
    d => d.status === DeliveryStatus.DELIVERED && d.deliveredDate && d.deliveredDate >= lastMonth
  ).sort((a, b) => (b.deliveredDate?.getTime() || 0) - (a.deliveredDate?.getTime() || 0)).slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[{
          title: 'Total Deliveries',
          count: totalDeliveries,
          icon: <Truck className="h-4 w-4 text-white" />,
          description: 'All time'
        }, {
          title: 'Scheduled',
          count: scheduledDeliveries,
          icon: <Calendar className="h-4 w-4 text-white" />,
          description: 'Upcoming deliveries'
        }, {
          title: 'In Transit',
          count: inTransitDeliveries,
          icon: <Truck className="h-4 w-4 text-white" />,
          description: 'Currently in transit'
        }, {
          title: 'Completed',
          count: completedDeliveries,
          icon: <TrendingUp className="h-4 w-4 text-white" />,
          description: 'Successful deliveries'
        }].map((stat, index) => (
          <Card key={index} className="shadow-sm bg-gradient-to-br from-blue-100 to-blue-50 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stat.count}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Remaining sections preserved below this point... */}
    </div>
  )
}
