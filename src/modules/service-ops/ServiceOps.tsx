import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Wrench, Plus, Search, Filter, Calendar, Clock, User } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

const mockServiceTickets: ServiceTicket[] = [
  {
    id: '1',
    customerId: 'cust-1',
    vehicleId: 'veh-1',
    title: 'Annual Maintenance Service',
    description: 'Complete annual maintenance including oil change, filter replacement, and system checks',
    priority: Priority.MEDIUM,
    status: ServiceStatus.IN_PROGRESS,
    assignedTo: 'Tech-001',
    scheduledDate: new Date('2024-01-20'),
    parts: [
      {
        id: '1',
        partNumber: 'OIL-001',
        description: 'Engine Oil Filter',
        quantity: 1,
        unitCost: 25.99,
        total: 25.99
      }
    ],
    labor: [
      {
        id: '1',
        description: 'Annual Maintenance',
        hours: 3,
        rate: 85,
        total: 255
      }
    ],
    notes: 'Customer requested additional inspection of brake system',
    customFields: {},
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '2',
    customerId: 'cust-2',
    vehicleId: 'veh-2',
    title: 'AC System Repair',
    description: 'Air conditioning not cooling properly, needs diagnostic and repair',
    priority: Priority.HIGH,
    status: ServiceStatus.WAITING_PARTS,
    assignedTo: 'Tech-002',
    scheduledDate: new Date('2024-01-22'),
    parts: [
      {
        id: '2',
        partNumber: 'AC-COMP-001',
        description: 'AC Compressor',
        quantity: 1,
        unitCost: 450.00,
        total: 450.00
      }
    ],
    labor: [
      {
        id: '2',
        description: 'AC System Diagnostic',
        hours: 2,
        rate: 85,
        total: 170
      }
    ],
    notes: 'Waiting for compressor part to arrive',
    customFields: {},
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16')
  }
]

function ServiceTicketsList() {
  const [tickets] = useState<ServiceTicket[]>(mockServiceTickets)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case ServiceStatus.OPEN:
        return 'bg-blue-100 text-blue-800'
      case ServiceStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800'
      case ServiceStatus.WAITING_PARTS:
        return 'bg-orange-100 text-orange-800'
      case ServiceStatus.COMPLETED:
        return 'bg-green-100 text-green-800'
      case ServiceStatus.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return 'bg-green-100 text-green-800'
      case Priority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800'
      case Priority.HIGH:
        return 'bg-orange-100 text-orange-800'
      case Priority.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Operations</h1>
          <p className="text-muted-foreground">
            Manage service tickets and maintenance schedules
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Service Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => t.status === ServiceStatus.IN_PROGRESS).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Parts</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets.filter(t => t.status === ServiceStatus.WAITING_PARTS).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(tickets.reduce((sum, t) => 
                sum + t.parts.reduce((pSum, p) => pSum + p.total, 0) + 
                t.labor.reduce((lSum, l) => lSum + l.total, 0), 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search service tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Service Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Tickets</CardTitle>
          <CardDescription>
            Manage service requests and maintenance schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{ticket.title}</h3>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span className="font-medium">Customer:</span> {ticket.customerId}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span className="font-medium">Assigned: </span> {ticket.assignedTo || 'Unassigned'}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="font-medium">Scheduled:</span> {ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="font-medium">Created:</span> {formatDate(ticket.createdAt)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                      {ticket.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Notes:</span> {ticket.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span>
                        <span className="font-medium">Parts:</span> {formatCurrency(ticket.parts.reduce((sum, p) => sum + p.total, 0))}
                      </span>
                      <span>
                        <span className="font-medium">Labor:</span> {formatCurrency(ticket.labor.reduce((sum, l) => sum + l.total, 0))}
                      </span>
                      <span>
                        <span className="font-medium">Total:</span> {formatCurrency(
                          ticket.parts.reduce((sum, p) => sum + p.total, 0) + 
                          ticket.labor.reduce((sum, l) => sum + l.total, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ServiceOps() {
  return (
    <Routes>
      <Route path="/" element={<ServiceTicketsList />} />
      <Route path="/*" element={<ServiceTicketsList />} />
    </Routes>
  )
}