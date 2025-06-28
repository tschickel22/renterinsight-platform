import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Truck, Wrench, FileCheck, Bell, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface CustomerDashboardProps {
  customer: CustomerData | null
}

export function CustomerDashboard({ customer }: CustomerDashboardProps) {
  // Mock data for dashboard
  const mockData = {
    quotes: [
      { id: 'Q-001', title: 'New RV Quote', status: 'sent', date: '2024-01-15' },
      { id: 'Q-002', title: 'Service Package Quote', status: 'viewed', date: '2024-01-10' }
    ],
    serviceRequests: [
      { id: 'S-001', title: 'Annual Maintenance', status: 'in_progress', date: '2024-01-20' }
    ],
    deliveries: [
      { id: 'D-001', title: 'New RV Delivery', status: 'scheduled', date: '2024-02-15' }
    ],
    documents: [
      { id: 'DOC-001', title: 'Purchase Agreement', status: 'pending_signature', date: '2024-01-18' }
    ],
    notifications: [
      { id: 'N-001', title: 'Quote Updated', description: 'Your quote has been updated with new pricing.', date: '2024-01-19' },
      { id: 'N-002', title: 'Service Completed', description: 'Your annual maintenance service has been completed.', date: '2024-01-18' }
    ],
    upcomingAppointments: [
      { id: 'A-001', title: 'Service Appointment', date: '2024-02-05', time: '10:00 AM' }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'viewed':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'in_transit':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'pending_signature':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'signed':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">Welcome, {customer?.firstName || 'Customer'}</h2>
              <p className="text-blue-700 mt-1">
                Here's a summary of your account activity
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button variant="outline" className="bg-white/70 hover:bg-white/90">
                <Wrench className="h-4 w-4 mr-2" />
                Request Service
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="h-4 w-4 mr-2" />
                View Quotes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Quotes</p>
                <p className="text-2xl font-bold">{mockData.quotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service Requests</p>
                <p className="text-2xl font-bold">{mockData.serviceRequests.length}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deliveries</p>
                <p className="text-2xl font-bold">{mockData.deliveries.length}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{mockData.documents.length}</p>
              </div>
              <FileCheck className="h-8 w-8 text-purple-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Quotes */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Recent Quotes
            </CardTitle>
            <CardDescription>
              Your most recent quotes and proposals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.quotes.length > 0 ? (
                mockData.quotes.map(quote => (
                  <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{quote.title}</h3>
                        <Badge className={cn("ri-badge-status text-xs", getStatusColor(quote.status))}>
                          {quote.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {quote.date}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No quotes available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>
              Your scheduled appointments and deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.upcomingAppointments.length > 0 ? (
                mockData.upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                    <div>
                      <h3 className="font-medium">{appointment.title}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {appointment.date}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {appointment.time}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No upcoming appointments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Recent Notifications
            </CardTitle>
            <CardDescription>
              Important updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.notifications.length > 0 ? (
                mockData.notifications.map(notification => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                    <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.date}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Mark Read
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}