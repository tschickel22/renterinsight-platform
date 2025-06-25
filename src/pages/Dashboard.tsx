import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, FileText, DollarSign, TrendingUp, Calendar, Plus } from 'lucide-react'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'
import { Lead } from '@/types'

const stats = [
  {
    name: 'Total Leads',
    value: '2,651',
    change: '+4.75%',
    changeType: 'positive',
    icon: Users,
  },
  {
    name: 'Inventory Units',
    value: '847',
    change: '+54.02%',
    changeType: 'positive',
    icon: Package,
  },
  {
    name: 'Active Quotes',
    value: '124',
    change: '-1.39%',
    changeType: 'negative',
    icon: FileText,
  },
  {
    name: 'Monthly Revenue',
    value: '$405,091',
    change: '+10.18%',
    changeType: 'positive',
    icon: DollarSign,
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'lead',
    title: 'New lead from website',
    description: 'John Smith interested in Class A Motorhome',
    time: '2 minutes ago',
  },
  {
    id: 2,
    type: 'quote',
    title: 'Quote sent to customer',
    description: 'Quote #Q-2024-001 sent to Sarah Johnson',
    time: '15 minutes ago',
  },
  {
    id: 3,
    type: 'service',
    title: 'Service appointment scheduled',
    description: 'Annual maintenance for RV #VIN123456',
    time: '1 hour ago',
  },
  {
    id: 4,
    type: 'delivery',
    title: 'Delivery completed',
    description: 'Travel Trailer delivered to Mike Davis',
    time: '2 hours ago',
  },
]

export default function Dashboard() {
  const [showNewLeadForm, setShowNewLeadForm] = useState(false)

  const handleNewLeadSuccess = (newLead: Lead) => {
    console.log('New lead created from dashboard:', newLead)
    // Optionally show a success message or redirect
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-lead':
        setShowNewLeadForm(true)
        break
      case 'add-inventory':
        window.location.href = '/inventory'
        break
      case 'create-quote':
        window.location.href = '/quotes'
        break
      case 'schedule-service':
        window.location.href = '/service'
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* New Lead Form Modal */}
      {showNewLeadForm && (
        <NewLeadForm
          onClose={() => setShowNewLeadForm(false)}
          onSuccess={handleNewLeadSuccess}
        />
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Renter Insight CRM/DMS dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your dealership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  </div>
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button 
                onClick={() => handleQuickAction('add-lead')}
                className="flex items-center justify-between p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Add New Lead</span>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
              <button 
                onClick={() => handleQuickAction('add-inventory')}
                className="flex items-center justify-between p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="font-medium">Add Inventory</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </button>
              <button 
                onClick={() => handleQuickAction('create-quote')}
                className="flex items-center justify-between p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Create Quote</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </button>
              <button 
                onClick={() => handleQuickAction('schedule-service')}
                className="flex items-center justify-between p-3 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">Schedule Service</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}