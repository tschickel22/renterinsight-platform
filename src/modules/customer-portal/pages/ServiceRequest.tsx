import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wrench, Plus, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { ServiceTicketForm } from '../components/ServiceTicketForm'
import { cn } from '@/lib/utils'

// Mock service tickets
const mockServiceTickets = [
  {
    id: 'SRV-2024-001',
    title: 'Annual Maintenance Service',
    description: 'Regular maintenance including oil change and system checks',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date('2024-03-15'),
    scheduledDate: new Date('2024-04-10'),
    estimatedCompletion: new Date('2024-04-12')
  },
  {
    id: 'SRV-2024-002',
    title: 'AC System Repair',
    description: 'Air conditioning not cooling properly',
    status: 'completed',
    priority: 'high',
    createdAt: new Date('2024-02-20'),
    scheduledDate: new Date('2024-02-25'),
    completedDate: new Date('2024-02-27')
  }
]

export function ServiceRequest() {
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'waiting_parts':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'in_progress':
        return <Wrench className="h-4 w-4 text-yellow-500" />
      case 'waiting_parts':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const activeTickets = mockServiceTickets.filter(ticket => 
    ticket.status !== 'completed' && ticket.status !== 'cancelled'
  )
  
  const completedTickets = mockServiceTickets.filter(ticket => 
    ticket.status === 'completed' || ticket.status === 'cancelled'
  )

  const handleSubmitService = (serviceData: any) => {
    console.log('Service request submitted:', serviceData)
    setShowServiceForm(false)
    // In a real app, this would send the data to the server
  }

  return (
    <div className="space-y-6">
      {showServiceForm && (
        <ServiceTicketForm 
          onSubmit={handleSubmitService}
          onCancel={() => setShowServiceForm(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground">
            Request service or track existing service tickets
          </p>
        </div>
        <Button onClick={() => setShowServiceForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Service Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active
            <Badge className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
              {activeTickets.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
              {completedTickets.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Service Tickets</CardTitle>
              <CardDescription>
                Track the status of your current service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTickets.length > 0 ? (
                  activeTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{ticket.title}</h3>
                          <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{ticket.status.replace('_', ' ').toUpperCase()}</span>
                          </Badge>
                          <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
                            {ticket.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Scheduled: {ticket.scheduledDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Estimated completion: {ticket.estimatedCompletion.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No active service tickets</p>
                    <p className="text-sm">Create a new service request to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Service History</CardTitle>
              <CardDescription>
                View your past service requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTickets.length > 0 ? (
                  completedTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold">{ticket.title}</h3>
                          <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                            {getStatusIcon(ticket.status)}
                            <span className="ml-1">{ticket.status.replace('_', ' ').toUpperCase()}</span>
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Completed: {ticket.completedDate?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No completed service tickets</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}