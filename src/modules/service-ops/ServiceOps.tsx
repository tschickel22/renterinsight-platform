import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Wrench, Plus, Search, Filter, Calendar, Clock, User, TrendingUp, DollarSign } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

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
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ServiceStatus.IN_PROGRESS:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case ServiceStatus.WAITING_PARTS:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case ServiceStatus.COMPLETED:
        return 'bg-green-50 text-green-700 border-green-200'
      case ServiceStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return 'bg-green-50 text-green-700 border-green-200'
      case Priority.MEDIUM:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case Priority.HIGH:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case Priority.URGENT:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets and maintenance schedules
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Service Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tickets</CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{tickets.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All service requests
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {tickets.filter(t => t.status === ServiceStatus.IN_PROGRESS).length}
            </div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Currently working
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Waiting Parts</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {tickets.filter(t => t.status === ServiceStatus.WAITING_PARTS).length}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              Parts on order
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(tickets.reduce((sum, t) => 
                sum + t.parts.reduce((pSum, p) => pSum + p.total, 0) + 
                t.labor.reduce((lSum, l) => lSum + l.total, 0), 0))}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Service revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="ri-search-bar">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search service tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <Button variant="outline" className="shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Service Tickets Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Service Tickets</CardTitle>
          <CardDescription>
            Manage service requests and maintenance schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                      <Badge className={cn("ri-badge-status", getPriorityColor(ticket.priority))}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                      <Badge className={cn("ri-badge-status", getStatusColor(ticket.status))}>
                        {ticket.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-blue-500" />
                        <span className="font-medium">Customer:</span> 
                        <span className="ml-1">{ticket.customerId}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2 text-green-500" />
                        <span className="font-medium">Assigned:</span> 
                        <span className="ml-1">{ticket.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-purple-500" />
                        <span className="font-medium">Scheduled:</span> 
                        <span className="ml-1">{ticket.scheduledDate ? formatDate(ticket.scheduledDate) : 'Not scheduled'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2 text-orange-500" />
                        <span className="font-medium">Created:</span> 
                        <span className="ml-1">{formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                    <div className="mt-2 bg-muted/30 p-2 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {ticket.description}
                      </p>
                      {ticket.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Notes:</span> {ticket.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                        <span className="font-medium">Parts:</span> {formatCurrency(ticket.parts.reduce((sum, p) => sum + p.total, 0))}
                      </span>
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">
                        <span className="font-medium">Labor:</span> {formatCurrency(ticket.labor.reduce((sum, l) => sum + l.total, 0))}
                      </span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-semibold">
                        <span className="font-medium">Total:</span> {formatCurrency(
                          ticket.parts.reduce((sum, p) => sum + p.total, 0) + 
                          ticket.labor.reduce((sum, l) => sum + l.total, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="shadow-sm">
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