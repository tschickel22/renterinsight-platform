import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Globe, Plus, Search, Filter, Users, Eye, Settings, MessageSquare, TrendingUp, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts'
import { useToast } from '@/hooks/use-toast'
import { NewClientAccountForm } from '@/components/NewClientAccountForm'
import { ClientAccountStatus } from '@/types'

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

function PortalDashboard() {
  const { getAllClientAccounts, resetClientPassword, updateClientStatus, sendInvitation } = useClientPortalAccounts()
  const { toast } = useToast()
  const [portalUsers, setPortalUsers] = useState(mockPortalUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewClientAccountForm, setShowNewClientAccountForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

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

  const handleAddPortalUser = () => {
    setShowNewClientAccountForm(true)
  }

  const handleNewClientAccountSuccess = (account: any) => {
    // Refresh the list of portal users
    const updatedUsers = getAllClientAccounts();
    setPortalUsers(updatedUsers);
    
    toast({
      title: 'Success',
      description: `Portal account created for ${account.name}`,
    });
    setShowNewClientAccountForm(false);
  }

  const handleManageUser = (user: any) => {
    setSelectedUser(user);
    // In a real implementation, you would navigate to a management page or open a modal
    toast({
      title: 'Manage User',
      description: `Managing ${user.name}`,
    });
  }

  const handleUserSettings = (user: any) => {
    setSelectedUser(user);
    // In a real implementation, you would navigate to a settings page or open a modal
    toast({
      title: 'User Settings',
      description: `Settings for ${user.name}`,
    });
  }

  const handleResetPassword = async (userId: string) => {
    setLoading(true);
    try {
      const result = await resetClientPassword(userId);
      toast({
        title: 'Password Reset',
        description: `New temporary password: ${result.tempPassword}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (userId: string, status: ClientAccountStatus) => {
    setLoading(true);
    try {
      await updateClientStatus(userId, status);
      const updatedUsers = getAllClientAccounts();
      setPortalUsers(updatedUsers);
      toast({
        title: 'Status Updated',
        description: `User status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSendNotification = async (userId: string, type: 'email' | 'sms') => {
    setLoading(true);
    try {
      await sendInvitation(userId, type);
      toast({
        title: 'Notification Sent',
        description: `${type.toUpperCase()} notification sent successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to send ${type} notification`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = portalUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* New Client Account Form Modal */}
      {showNewClientAccountForm && (
        <NewClientAccountForm
          onClose={() => setShowNewClientAccountForm(false)}
          onSuccess={handleNewClientAccountSuccess}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Client Portal</h1>
            <p className="ri-page-description">
              Manage customer portal access and self-service features
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleAddPortalUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add Portal User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Portal Users</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{portalUsers.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Total registered users
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Users</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {portalUsers.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Monthly Logins</CardTitle>
            <Globe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">247</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Support Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">12</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <MessageSquare className="h-3 w-3 mr-1" />
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portal Features */}
      <div className="ri-content-grid">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Portal Features</CardTitle>
            <CardDescription>
              Available self-service features for customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-blue-500 bg-blue-50 p-2 rounded-lg" />
                  <div>
                    <p className="font-semibold">Vehicle Information</p>
                    <p className="text-sm text-muted-foreground">View vehicle details and documentation</p>
                  </div>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-8 w-8 text-purple-500 bg-purple-50 p-2 rounded-lg" />
                  <div>
                    <p className="font-semibold">Service Requests</p>
                    <p className="text-sm text-muted-foreground">Submit and track service tickets</p>
                  </div>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-green-500 bg-green-50 p-2 rounded-lg" />
                  <div>
                    <p className="font-semibold">Account Management</p>
                    <p className="text-sm text-muted-foreground">Update profile and preferences</p>
                  </div>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Globe className="h-8 w-8 text-orange-500 bg-orange-50 p-2 rounded-lg" />
                  <div>
                    <p className="font-semibold">Document Library</p>
                    <p className="text-sm text-muted-foreground">Access manuals and warranties</p>
                  </div>
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>
              Latest portal user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900">
                    John Smith logged in
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-900">
                    Sarah Johnson submitted service request
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    4 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-purple-900">
                    Mike Davis updated profile
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageUser(user)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUserSettings(user)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleResetPassword(user.id)}
                    disabled={loading}
                  >
                    Reset Password
                  </Button>
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as ClientAccountStatus)}
                    className="px-2 py-1 text-xs rounded-md border border-input bg-background"
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ClientPortal() {
  return (
    <Routes>
      <Route path="/" element={<PortalDashboard />} />
      <Route path="/*" element={<PortalDashboard />} />
    </Routes>
  )
}