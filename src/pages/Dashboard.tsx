import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { formatCurrency } from '@/lib/utils'

// Mock dashboard data
const dashboardStats = {
  totalLeads: 156,
  activeDeals: 23,
  monthlyRevenue: 485000,
  inventoryCount: 89,
  pendingDeliveries: 12,
  serviceTickets: 8
}

const recentActivities = [
  {
    id: '1',
    type: 'lead',
    title: 'New lead from website',
    description: 'John Smith interested in 2024 Forest River',
    time: '2 hours ago',
    status: 'new'
  },
  {
    id: '2',
    type: 'deal',
    title: 'Deal closed',
    description: 'Sarah Johnson purchased 2023 Keystone RV',
    time: '4 hours ago',
    status: 'completed'
  },
  {
    id: '3',
    type: 'service',
    title: 'Service appointment scheduled',
    description: 'Mike Davis - AC repair scheduled for tomorrow',
    time: '6 hours ago',
    status: 'scheduled'
  },
  {
    id: '4',
    type: 'delivery',
    title: 'Delivery completed',
    description: 'Unit #RV-2024-001 delivered to customer',
    time: '1 day ago',
    status: 'completed'
  }
]

const upcomingTasks = [
  {
    id: '1',
    title: 'Follow up with hot leads',
    dueDate: 'Today',
    priority: 'high'
  },
  {
    id: '2',
    title: 'PDI inspection for Unit #MH-2024-005',
    dueDate: 'Tomorrow',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Monthly inventory audit',
    dueDate: 'This week',
    priority: 'low'
  },
  {
    id: '4',
    title: 'Commission calculations',
    dueDate: 'End of month',
    priority: 'medium'
  }
]

export default function Dashboard() {
  const { user } = useAuth()
  const { tenant } = useTenant()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'new':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'scheduled':
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">
              Welcome back, {user?.name}!
            </h1>
            <p className="ri-page-description">
              Here's what's happening at {tenant?.name || 'your dealership'} today
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{dashboardStats.totalLeads}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Deals</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{dashboardStats.activeDeals}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 new this week
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(dashboardStats.monthlyRevenue)}
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Inventory</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{dashboardStats.inventoryCount}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Package className="h-3 w-3 mr-1" />
              Units in stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="ri-content-grid">
        {/* Recent Activities */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from across your dealership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Upcoming Tasks</CardTitle>
            <CardDescription>
              Tasks and reminders that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <Badge className={`ri-badge-status ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              Units ready for delivery
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Tickets</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.serviceTickets}</div>
            <p className="text-xs text-muted-foreground">
              Open service requests
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Units sold
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}