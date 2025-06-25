import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Wrench, Plus, Search, Filter, Calendar, Clock, User, TrendingUp, DollarSign, ShieldCheck, FileText } from 'lucide-react'
import { ServiceTicket, ServiceStatus, Priority } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useServiceManagement } from './hooks/useServiceManagement'
import { Lead } from '@/types'
import { ServiceTicketDetail } from './components/ServiceTicketDetail'
import { ServiceTicketForm } from './components/ServiceTicketForm'
import { CustomerPortalView } from './components/CustomerPortalView'
import { useToast } from '@/hooks/use-toast'

// Mock data for customers and vehicles since we're not importing the hooks
const mockCustomers: Lead[] = [
  {
    id: 'cust-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    source: 'Website',
    sourceId: '1',
    status: 'new' as any,
    notes: '',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'cust-2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 987-6543',
    source: 'Referral',
    sourceId: '2',
    status: 'qualified' as any,
    notes: '',
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockVehicles = [
  {
    id: 'veh-1',
    vin: '1FDXE4FS8KDC12345',
    make: 'Forest River',
    model: 'Georgetown',
    year: 2024,
    type: 'motorhome',
    status: 'available',
    price: 125000,
    cost: 95000,
    location: 'Lot A-15',
    features: ['Slide-out', 'Generator', 'Solar Panel'],
    images: ['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'veh-2',
    vin: '1FDXE4FS8KDC67890',
    make: 'Winnebago',
    model: 'View',
    year: 2023,
    type: 'rv',
    status: 'available',
    price: 89000,
    cost: 72000,
    location: 'Lot B-08',
    features: ['Compact Design', 'Fuel Efficient'],
    images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
    customFields: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

function ServiceTicketsList() {
  const { 
    tickets, 
    technicians, 
    createTicket, 
    updateTicket, 
    updateTicketStatus, 
    assignTechnician, 
    generatePDF, 
    shareWithCustomer,
    submitCustomerFeedback
  } = useServiceManagement()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showTicketDetail, setShowTicketDetail] = useState(false)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showCustomerView, setShowCustomerView] = useState(false)
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreateTicket = () => {
    setSelectedTicket(null)
    setShowTicketForm(true)
  }

  const handleEditTicket = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowTicketForm(true)
  }

  const handleViewTicket = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowTicketDetail(true)
  }

  const handleViewCustomerPortal = (ticket: ServiceTicket) => {
    setSelectedTicket(ticket)
    setShowCustomerView(true)
  }

  const handleSaveTicket = async (ticketData: Partial<ServiceTicket>) => {
    try {
      if (selectedTicket) {
        await updateTicket(selectedTicket.id, ticketData)
        toast({
          title: 'Success',
          description: 'Service ticket updated successfully',
        })
      } else {
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

  const handleGeneratePDF = (ticketId: string) => {
    try {
      generatePDF(ticketId)
      toast({
        title: 'Success',
        description: 'PDF generated and downloaded',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      })
    }
  }

  const handleShareWithCustomer = async (ticketId: string) => {
    try {
      await shareWithCustomer(ticketId)
      toast({
        title: 'Success',
        description: 'Service ticket shared with customer',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share with customer',
        variant: 'destructive'
      })
    }
  }

  const handleSubmitFeedback = async (ticketId: string, feedback: string, rating: number) => {
    try {
      await submitCustomerFeedback(ticketId, feedback, rating)
      setShowCustomerView(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback',
        variant: 'destructive'
      })
    }
  }

  const handleAssignTechnician = async (ticketId: string, technicianId: string) => {
    try {
      await assignTechnician(ticketId, technicianId)
      toast({
        title: 'Success',
        description: 'Technician assigned successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign technician',
        variant: 'destructive'
      })
    }
  }

  // Calculate stats
  const totalTickets = tickets.length
  const inProgressTickets = tickets.filter(t => t.status === ServiceStatus.IN_PROGRESS).length
  const waitingPartsTickets = tickets.filter(t => t.status === ServiceStatus.WAITING_PARTS).length
  const totalRevenue = tickets.reduce((sum, t) => 
    sum + t.parts.reduce((pSum, p) => pSum + p.total, 0) + 
    t.labor.reduce((lSum, l) => lSum + l.total, 0), 0)
  const warrantyTickets = tickets.filter(t => t.customFields?.isWarrantyCovered).length

  return (
    <div className="space-y-8">
      {/* Service Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <ServiceTicketDetail
          ticket={selectedTicket}
          onClose={() => setShowTicketDetail(false)}
          onEdit={handleEditTicket}
          onGeneratePDF={handleGeneratePDF}
          onShareWithCustomer={handleShareWithCustomer}
        />
      )}
      
      {/* Service Ticket Form Modal */}
      {showTicketForm && (
        <ServiceTicketForm
          ticket={selectedTicket || undefined}
          customers={mockCustomers}
          vehicles={mockVehicles}
          technicians={technicians}
          onSave={handleSaveTicket}
          onCancel={() => {
            setShowTicketForm(false)
            setSelectedTicket(null)
          }}
        />
      )}
      
      {/* Customer Portal View Modal */}
      {showCustomerView && selectedTicket && (
        <CustomerPortalView
          ticket={selectedTicket}
          onClose={() => setShowCustomerView(false)}
          onDownloadPDF={handleGeneratePDF}
          onSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Service Operations</h1>
            <p className="ri-page-description">
              Manage service tickets, technician assignments, and warranty claims
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
            <div className="text-2xl font-bold text-blue-900">{totalTickets}</div>
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
            <div className="text-2xl font-bold text-yellow-900">{inProgressTickets}</div>
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
            <div className="text-2xl font-bold text-orange-900">{waitingPartsTickets}</div>
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
            <div className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Service revenue
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Warranty Claims</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{warrantyTickets}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Warranty covered
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
                      {ticket.customFields?.isWarrantyCovered && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          WARRANTY
                        </Badge>
                      )}
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
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewTicket(ticket)
                    }}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditTicket(ticket)
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCustomerPortal(ticket)
                    }}
                  >
                    <User className="h-3 w-3 mr-1" />
                    Customer View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGeneratePDF(ticket.id)
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredTickets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No service tickets found</p>
                <p className="text-sm">Create your first service ticket to get started</p>
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
      <Route path="/" element={<ServiceTicketsList />} />
      <Route path="/*" element={<ServiceTicketsList />} />
    </Routes>
  )
}