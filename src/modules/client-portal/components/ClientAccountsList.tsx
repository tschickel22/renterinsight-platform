import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Globe, Search, Filter, User, Mail, Clock, RotateCw, Lock, Eye, Settings } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { clientPortalApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface ClientAccount {
  id: string
  name: string
  email: string
  status: string
  lastLogin?: Date
  createdAt: Date
}

export function ClientAccountsList() {
  const { toast } = useToast()
  const [accounts, setAccounts] = useState<ClientAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    setLoading(true)
    try {
      const data = await clientPortalApi.getClientAccounts()
      setAccounts(data)
    } catch (error) {
      console.error('Error loading client accounts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load client accounts',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (userId: string, email: string) => {
    try {
      await clientPortalApi.resetClientPassword(userId)
      toast({
        title: 'Password Reset Sent',
        description: `Password reset email sent to ${email}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send password reset',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      await clientPortalApi.updateClientAccount(userId, { status })
      
      // Update local state
      setAccounts(prev => 
        prev.map(account => 
          account.id === userId ? { ...account, status } : account
        )
      )
      
      toast({
        title: 'Status Updated',
        description: `Account status updated to ${status}`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update account status',
        variant: 'destructive'
      })
    }
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

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search client accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="shadow-sm" onClick={loadAccounts}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Accounts List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Client Portal Accounts</CardTitle>
          <CardDescription>
            Manage client access to the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading client accounts...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{account.name}</h3>
                        <Badge className={cn("ri-badge-status", getStatusColor(account.status))}>
                          {account.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2 text-blue-500" />
                          <span>{account.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2 text-green-500" />
                          <span>Created: {formatDate(account.createdAt)}</span>
                        </div>
                        {account.lastLogin && (
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-2 text-purple-500" />
                            <span>Last login: {formatDate(account.lastLogin)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleResetPassword(account.id, account.email)}
                        className="shadow-sm"
                      >
                        <Lock className="h-3 w-3 mr-1" />
                        Reset Password
                      </Button>
                      <Select 
                        defaultValue={account.status}
                        onValueChange={(value) => handleUpdateStatus(account.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No client accounts found</p>
                  <p className="text-sm">Create your first client account to get started</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}