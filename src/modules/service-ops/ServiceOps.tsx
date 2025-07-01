import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Wrench, Plus, Search, Filter, Calendar, Clock, User, TrendingUp, DollarSign } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useServiceManagement } from './hooks/useServiceManagement'
import { useToast } from '@/hooks/use-toast'
import { ServiceTicketForm } from './components/ServiceTicketForm'
import { ServiceTicketDetail } from './components/ServiceTicketDetail'
import { CustomerPortalView } from './components/CustomerPortalView'
import { NewLeadForm } from '@/modules/crm-prospecting/components/NewLeadForm'

function ServiceTicketsList() {
  const { tickets, createTicket, updateTicket, deleteTicket, updateTicketStatus } = useServiceManagement()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setpriorityFilter] = useState<string>('all')
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showTicketDetail, setShowTicketDetail] = useState(false)
  const [showCustomerPortal, setShowCustomerPortal] = useState(false)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ServiceTicket | null>(null)

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
    ticket.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(ticket => statusFilter === 'all' || ticket.status === statusFilter)
  .filter(ticket => priorityFilter === 'all' || ticket.priority === priorityFilter)

  const handleCreateTicket = () => {
    setSelectedTicket(null)
    setShowTicketForm(true)
  }

  const handleEditTicket = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowTicketForm(true)
    setShowTicketDetail(false)
  }

  const handleViewTicket = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowTicketDetail(true)
  }

  const handleViewCustomerPortal = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowCustomerPortal(true)
  }

  const handleSaveTicket = async (ticketData: Partial<ServiceTicket>) => {
    try {
      if (selectedTicket) {
        // Update existing ticket
        await updateTicket(selectedTicket.id, ticketData)
        toast({
          title: 'Success',
          description: 'Service ticket updated successfully',
        })
      } else {
        // Create new ticket
        await createTicket(ticketData)
        toast({
          title: 'Success',
          description: 'Service ticket created successfully',
        })
      }
      setShowTicketForm(false)
      setSelectedTicket(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedTicket ? 'update' : 'create'} service ticket`,
        variant: 'destructive'
      })
    }
  }

  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this service ticket?')) {
      try {
        await deleteTicket(ticketId)
        toast({
          title: 'Success',
          description: 'Service ticket deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete service ticket',
          variant: 'destructive'
        })
      }
    }
  }

  const handleStatusChange = async (ticketId: string, status: ServiceStatus) => {
    try {
      await updateTicketStatus(ticketId, status)
      toast({
        title: 'Status Updated',
        description: `Ticket status changed to ${status.replace('_', ' ')}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ticket status',
        variant: 'destructive'
      })
    }
  }

  const handleNewCustomerSuccess = (newCustomer: any) => {
    toast({
      title: 'Customer Added',
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added.`,
    })
    // Open the service ticket form with the new customer selected
    setSelectedTicket(null)
    setShowLeadModal(false)
    setShowTicketForm(true)
  }

  return (
    <div className="space-y-8">
      {/* New Customer Form Modal */}
      {showLeadModal && (
        <NewLeadForm
          onClose={() => setShowLeadModal(false)}
          onSuccess={handleNewCustomerSuccess}
        />
      )}
      
      {/* Service Ticket Form Modal */}
      {showTicketForm && (
        <ServiceTicketForm
          ticket={selectedTicket || undefined}
          onSave={handleSaveTicket}
          onCancel={() => {
            setShowTicketForm(false)
            setSelectedTicket(null)
          }}
        />
      )}
      
      {/* Service Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <ServiceTicketDetail
          ticket={selectedTicket}
          onClose={() => setShowTicketDetail(false)}
          onEdit={handleEditTicket}
        />
      )}
      
      {/* Customer Portal View Modal */}
      {showCustomerPortal && selectedTicket && (
        <CustomerPortalView
          ticket={selectedTicket}
          onClose={() => setShowCustomerPortal(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets and maintenance schedules
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateTicket}>
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
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={ServiceStatus.OPEN}>Open</SelectItem>
              <SelectItem value={ServiceStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={ServiceStatus.WAITING_PARTS}>Waiting Parts</SelectItem>
              <SelectItem value={ServiceStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={ServiceStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setpriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value={Priority.LOW}>Low</SelectItem>
              <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
              <SelectItem value={Priority.HIGH}>High</SelectItem>
              <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleViewTicket(ticket)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => handleEditTicket(ticket)}
                  >
                    Edit
                  </Button>
                  {ticket.customFields?.customerPortalAccess !== false && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="shadow-sm"
                      onClick={() => handleViewCustomerPortal(ticket)}
                    >
                      Customer View
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No service tickets found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ServiceOps() {
  return (
    <Routes>
      <Route path="/*" element={<ServiceTicketsList />} />
    </Routes>
  )
}