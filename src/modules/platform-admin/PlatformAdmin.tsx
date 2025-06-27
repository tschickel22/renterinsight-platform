import React, { useState } from 'react'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge' 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Plus, Search, Filter, Users, Building, Activity, AlertTriangle, TrendingUp, Key, Settings, Eye } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ClientAccount, ClientAccountStatus, UserRole } from '@/types'
import { cn } from '@/lib/utils'
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts'
import { useToast } from '@/hooks/use-toast'

const mockTenants = [
  {
    id: '1',
    name: 'Demo RV Dealership',
    domain: 'demo.renterinsight.com',
    status: 'active',
    users: 5,
    createdAt: new Date('2024-01-01'),
    lastActivity: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Sunshine RV Center',
    domain: 'sunshine.renterinsight.com',
    status: 'active',
    users: 12,
    createdAt: new Date('2023-12-15'),
    lastActivity: new Date('2024-01-19')
  }
]

const mockSystemMetrics = {
  totalTenants: 2,
  activeTenants: 2,
  totalUsers: 17,
  systemUptime: '99.9%',
  avgResponseTime: '120ms',
  errorRate: '0.1%'
}

function PlatformAdminDashboard() {
  const { hasRole } = useAuth()
  const { getAllClientAccounts, resetClientPassword, updateClientStatus } = useClientPortalAccounts()
  const { toast } = useToast()
  const [tenants] = useState(mockTenants)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('tenants')
  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>([])
  const [clientSearchTerm, setClientSearchTerm] = useState('')

  useEffect(() => {
    // Load client accounts
    setClientAccounts(getAllClientAccounts())
  }, [getAllClientAccounts])

  const handleResetPassword = async (clientId: string) => {
    try {
      const result = await resetClientPassword(clientId)
      toast({
        title: 'Password Reset',
        description: `New temporary password: ${result.tempPassword}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive'
      })
    }
  }

  const handleStatusChange = async (clientId: string, status: ClientAccountStatus) => {
    try {
      await updateClientStatus(clientId, status)
      setClientAccounts(getAllClientAccounts())
      toast({
        title: 'Status Updated',
        description: `Client account status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      })
    }
  }

  const handleClientPreview = (clientId: string) => {
    // Create a preview URL with the client ID that points directly to the client portal
    const previewUrl = `/portal/preview?preview=true&clientId=${clientId}`
    window.open(previewUrl, '_blank')
    
    toast({
      title: 'Client Preview',
      description: 'Opening client portal preview in a new window',
    })
  }

  if (!hasRole(UserRole.ADMIN)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the Platform Admin area.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

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

  const getClientStatusColor = (status: ClientAccountStatus) => {
    switch (status) {
      case ClientAccountStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200'
      case ClientAccountStatus.INACTIVE:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      case ClientAccountStatus.SUSPENDED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredClientAccounts = clientAccounts.filter(account =>
    account.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    account.email.toLowerCase().includes(clientSearchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Platform Admin</h1>
            <p className="ri-page-description">
              System administration and tenant management
            </p>
          </div>
          <Button className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* System Metrics */} 
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockSystemMetrics.totalTenants}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All tenants
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Tenants</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockSystemMetrics.activeTenants}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{mockSystemMetrics.totalUsers}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <Users className="h-3 w-3 mr-1" />
              All users
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockSystemMetrics.systemUptime}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Excellent
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Avg Response</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{mockSystemMetrics.avgResponseTime}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Fast response
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Error Rate</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{mockSystemMetrics.errorRate}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Very low
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="client-accounts">Client Portal Accounts</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search tenants..."
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

          {/* Tenants Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Tenant Management</CardTitle>
              <CardDescription>
                Manage dealership tenants and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTenants.map((tenant) => (
                  <div key={tenant.id} className="ri-table-row">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{tenant.name}</h3>
                          <Badge className={cn("ri-badge-status", getStatusColor(tenant.status))}>
                            {tenant.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Domain:</span> 
                            <span className="ml-1">{tenant.domain}</span>
                          </div>
                          <div>
                            <span className="font-medium">Users:</span> 
                            <span className="ml-1">{tenant.users}</span>
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> 
                            <span className="ml-1">{tenant.createdAt.toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium">Last Activity:</span> 
                            <span className="ml-1">{tenant.lastActivity.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <Shield className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                      <Button variant="outline" size="sm" className="shadow-sm">
                        <Activity className="h-3 w-3 mr-1" />
                        Monitor
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client-accounts" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search client accounts..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Client Accounts Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Client Portal Accounts</CardTitle>
              <CardDescription>
                Manage client portal access and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClientAccounts.length > 0 ? (
                  filteredClientAccounts.map((account) => (
                    <div key={account.id} className="ri-table-row">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">{account.name}</h3>
                            <Badge className={cn("ri-badge-status", getClientStatusColor(account.status))}>
                              {account.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Email:</span> 
                              <span className="ml-1">{account.email}</span>
                            </div>
                            <div>
                              <span className="font-medium">Phone:</span> 
                              <span className="ml-1">{account.phone || 'Not provided'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> 
                              <span className="ml-1">{new Date(account.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="font-medium">Last Login:</span> 
                              <span className="ml-1">{account.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : 'Never'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ri-action-buttons">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shadow-sm"
                          onClick={() => handleResetPassword(account.id)}
                        >
                          <Key className="h-3 w-3 mr-1" />
                          Reset Password
                        </Button>
                        <select
                          value={account.status}
                          onChange={(e) => handleStatusChange(account.id, e.target.value as ClientAccountStatus)}
                          className="px-2 py-1 text-xs rounded-md border border-input bg-background"
                        >
                          <option value={ClientAccountStatus.ACTIVE}>Active</option>
                          <option value={ClientAccountStatus.INACTIVE}>Inactive</option>
                          <option value={ClientAccountStatus.SUSPENDED}>Suspended</option>
                        </select>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shadow-sm"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shadow-sm"
                          onClick={() => handleClientPreview(account.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Client Preview
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No client accounts found</p>
                    <p className="text-sm">Create client accounts from the CRM module</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-health" className="space-y-6">
          {/* System Health */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">System Health</CardTitle>
              <CardDescription>
                Real-time system status and health metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">Database: Healthy</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">API Services: Operational</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">Payment Gateway: Connected</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">Email Service: Active</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">File Storage: Available</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-900">Backup System: Running</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PlatformAdmin() {
  return (
    <Routes>
      <Route path="/" element={<PlatformAdminDashboard />} />
      <Route path="/*" element={<PlatformAdminDashboard />} />
    </Routes>
  )
}