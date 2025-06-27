import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Eye, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  FileText, 
  Wrench, 
  Truck, 
  Star 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { ClientQuotes } from './components/ClientQuotes'
import { ServiceRequestForm } from './components/ServiceRequestForm'
import { OrderTracking } from './components/OrderTracking'
import { CustomerSurvey } from './components/CustomerSurvey'
import { ClientManagement } from './components/ClientManagement'
import { useToast } from '@/hooks/use-toast'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useServiceManagement } from '@/modules/service-ops/hooks/useServiceManagement'
import { useDeliveryManagement } from '@/modules/delivery-tracker/hooks/useDeliveryManagement'
import { ClientLayout } from './components/ClientLayout'

const mockPortalUsers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    status: 'active',
    lastLogin: new Date('2024-01-18'),
    vehicleCount: 1,
    serviceTickets: 2,
    invoices: 3
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    status: 'active',
    lastLogin: new Date('2024-01-16'),
    vehicleCount: 1,
    serviceTickets: 0,
    invoices: 1
  }
]

function ClientNavigation() {
  const location = useLocation()
  
  const navItems = [
    { name: 'Dashboard', href: '/portal', icon: Globe },
    { name: 'My Quotes', href: '/portal/quotes', icon: FileText },
    { name: 'Service Requests', href: '/portal/service-requests', icon: Wrench },
    { name: 'Order Tracking', href: '/portal/orders', icon: Truck },
    { name: 'Feedback', href: '/portal/surveys', icon: Star }
  ]
  
  return (
    <div className="mb-8">
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {navItems.map((item) => {
          const isActive = 
            (item.href === '/portal' && location.pathname === '/portal') || 
            (item.href !== '/portal' && location.pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function PortalDashboard() {
  const [portalUsers] = useState(mockPortalUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('users')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredUsers = portalUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Client Portal</h1>
            <p className="ri-page-description">
              Manage customer portal access and self-service features
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Portal User
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Portal Users
          </TabsTrigger>
          <TabsTrigger value="management">
            <Settings className="h-4 w-4 mr-2" />
            Client Management
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search portal users..."
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

          {/* Portal Users Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Portal Users</CardTitle>
              <CardDescription>
                Manage customer portal access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="ri-table-row">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge className={cn("ri-badge-status", getStatusColor(user.status))}>
                            {user.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Email:</span> 
                            <span className="ml-1">{user.email}</span>
                          </div>
                          <div>
                            <span className="font-medium">Last Login:</span> 
                            <span className="ml-1">{user.lastLogin.toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Vehicles:</span> 
                            <span className="ml-1">{user.vehicleCount}</span>
                          </div>
                          <div>
                            <span className="font-medium">Service Tickets:</span> 
                            <span className="ml-1">{user.serviceTickets}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <Users className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="management">
          <ClientManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ClientQuotesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const customerId = user?.id || 'cust-1' // Fallback for demo
  
  // In a real app, these would come from API calls
  const quotes = [
    {
      id: '1',
      customerId: 'cust-1',
      vehicleId: 'veh-1',
      items: [
        {
          id: '1',
          description: '2024 Forest River Georgetown',
          quantity: 1,
          unitPrice: 125000,
          total: 125000
        },
        {
          id: '2',
          description: 'Extended Warranty',
          quantity: 1,
          unitPrice: 2500,
          total: 2500
        }
      ],
      subtotal: 127500,
      tax: 10200,
      total: 137700,
      status: 'sent',
      validUntil: new Date('2024-02-15'),
      notes: 'Customer interested in financing options',
      customFields: {},
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16')
    }
  ]
  
  const acceptQuote = async (quoteId: string) => {
    // In a real app, this would call an API
    toast({
      title: 'Quote Accepted',
      description: 'You have successfully accepted this quote.',
    })
  }
  
  const rejectQuote = async (quoteId: string) => {
    // In a real app, this would call an API
    toast({
      title: 'Quote Declined',
      description: 'You have declined this quote.',
    })
  }
  
  return (
    <>
      <ClientNavigation />
      <ClientQuotes 
        customerId={customerId}
        quotes={quotes}
        acceptQuote={acceptQuote}
        rejectQuote={rejectQuote}
      />
    </>
  )
}

function ServiceRequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { vehicles } = useInventoryManagement()
  const { createTicket } = useServiceManagement()
  const customerId = user?.id || 'cust-1' // Fallback for demo
  
  const handleSubmitRequest = async (ticketData: any) => {
    try {
      await createTicket({
        ...ticketData,
        customerId
      })
      return true
    } catch (error) {
      console.error('Error submitting service request:', error)
      throw error
    }
  }
  
  return (
    <>
      <ClientNavigation />
      <ServiceRequestForm 
        customerId={customerId}
        vehicles={vehicles}
        onSubmitRequest={handleSubmitRequest}
      />
    </>
  )
}

function OrderTrackingPage() {
  const { user } = useAuth()
  const { deliveries } = useDeliveryManagement()
  const customerId = user?.id || 'cust-1' // Fallback for demo
  
  return (
    <>
      <ClientNavigation />
      <OrderTracking 
        customerId={customerId}
        deliveries={deliveries}
      />
    </>
  )
}

function SurveysPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const customerId = user?.id || 'cust-1' // Fallback for demo
  
  const handleSubmitSurvey = async (surveyData: any) => {
    // In a real app, this would call an API
    console.log('Survey submitted:', surveyData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return true
  }
  
  return (
    <>
      <ClientNavigation />
      <CustomerSurvey 
        customerId={customerId}
        onSubmitSurvey={handleSubmitSurvey}
      />
    </>
  )
}

function ClientDashboard() {
  const { user } = useAuth()
  
  return (
    <>
      <ClientNavigation />
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome to Your Client Portal</h2>
          <p className="text-muted-foreground">
            Manage your Home/RV information, service requests, and more
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">My Quotes</h3>
                <p className="text-muted-foreground mb-4">
                  View and accept quotes for your Home/RV
                </p>
                <Button asChild>
                  <Link to="/portal/quotes">View Quotes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Service Requests</h3>
                <p className="text-muted-foreground mb-4">
                  Submit and track service requests
                </p>
                <Button asChild>
                  <Link to="/portal/service-requests">Request Service</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Order Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Track your Home/RV delivery status
                </p>
                <Button asChild>
                  <Link to="/portal/orders">Track Order</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default function ClientPortal() {
  return (
    <ClientLayout>
      <Routes>
        <Route path="/" element={<ClientDashboard />} />
        <Route path="/quotes" element={<ClientQuotesPage />} />
        <Route path="/service-requests" element={<ServiceRequestsPage />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/surveys" element={<SurveysPage />} />
        <Route path="/admin/*" element={<PortalDashboard />} />
        <Route path="/*" element={<ClientDashboard />} />
      </Routes>
    </ClientLayout>
  )
}