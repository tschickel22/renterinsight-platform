import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Truck, Wrench, FileCheck, User, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ImpersonationBanner } from './components/ImpersonationBanner'
import { CustomerDashboard } from './components/CustomerDashboard'
import { QuoteList } from './components/QuoteList'
import { ServiceRequestList } from './components/ServiceRequestList'
import { DeliveryTracking } from './components/DeliveryTracking'
import { DocumentList } from './components/DocumentList'
import { CustomerLogin } from './components/CustomerLogin'

// Types for customer data
interface CustomerData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

function CustomerPortalDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonatedUser, setImpersonatedUser] = useState<CustomerData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Check for impersonation or authentication on mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const impersonateId = queryParams.get('impersonateClientId')
    
    if (impersonateId) {
      // In a real app, you would fetch the customer data from an API
      // For this demo, we'll use mock data
      const mockCustomer: CustomerData = {
        id: impersonateId,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '(555) 123-4567'
      }
      
      setImpersonatedUser(mockCustomer)
      setIsImpersonating(true)
      setIsAuthenticated(true)
      
      // Remove the query parameter from the URL without reloading
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    } else {
      // Check if user is authenticated (would use a real auth check in production)
      const isLoggedIn = localStorage.getItem('customerPortalAuth') === 'true'
      setIsAuthenticated(isLoggedIn)
    }
  }, [location])

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would validate credentials against an API
    // For this demo, we'll just simulate a successful login
    localStorage.setItem('customerPortalAuth', 'true')
    setIsAuthenticated(true)
    
    // Mock customer data
    const mockCustomer: CustomerData = {
      id: 'cust-123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: email,
      phone: '(555) 987-6543'
    }
    
    setImpersonatedUser(mockCustomer)
    
    toast({
      title: 'Login Successful',
      description: 'Welcome to your customer portal.',
    })
  }

  const handleLogout = () => {
    if (isImpersonating) {
      // If impersonating, just close the window/tab
      window.close()
    } else {
      // Regular logout
      localStorage.removeItem('customerPortalAuth')
      setIsAuthenticated(false)
      setImpersonatedUser(null)
      
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
      })
    }
  }

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <CustomerLogin onLogin={handleLogin} />
  }

  return (
    <div className="space-y-6">
      {/* Impersonation Banner */}
      {isImpersonating && impersonatedUser && (
        <ImpersonationBanner 
          customerName={`${impersonatedUser.firstName} ${impersonatedUser.lastName}`} 
          onExit={handleLogout}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">
              Welcome, {impersonatedUser?.firstName || 'Customer'}
            </h1>
            <p className="ri-page-description">
              Your customer portal dashboard
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            {isImpersonating ? 'Exit Impersonation' : 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CustomerDashboard customer={impersonatedUser} />
        </TabsContent>

        <TabsContent value="quotes">
          <QuoteList customerId={impersonatedUser?.id || ''} />
        </TabsContent>

        <TabsContent value="service">
          <ServiceRequestList customerId={impersonatedUser?.id || ''} />
        </TabsContent>

        <TabsContent value="delivery">
          <DeliveryTracking customerId={impersonatedUser?.id || ''} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentList customerId={impersonatedUser?.id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CustomerPortal() {
  return (
    <Routes>
      <Route path="/" element={<CustomerPortalDashboard />} />
      <Route path="/*" element={<CustomerPortalDashboard />} />
    </Routes>
  )
}