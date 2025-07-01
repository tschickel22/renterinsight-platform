import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Plus, Search, Filter, Users, Eye, Settings, MessageSquare, Mail, Phone, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PortalUserForm } from './components/PortalUserForm'
import { PortalUserList } from './components/PortalUserList'
import { PortalSettings } from './components/PortalSettings'

function ClientPortalDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [showUserForm, setShowUserForm] = useState(false)
  
  const handleAddUser = () => {
    setShowUserForm(true)
  }
  
  const handleImpersonateUser = (userId: string, userName: string) => {
    // Open customer portal in a new tab with impersonation parameter
    const customerPortalUrl = `/customer-portal?impersonateClientId=${userId}`
    window.open(customerPortalUrl, '_blank')
  }

  return (
    <div className="space-y-8">
      {/* User Form Modal */}
      {showUserForm && (
        <PortalUserForm
          onSave={() => {
            setShowUserForm(false)
          }}
          onCancel={() => setShowUserForm(false)}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Client Portal Management</h1>
            <p className="ri-page-description">
              Manage customer portal access and self-service features
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add Portal User
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Portal Users</TabsTrigger>
          <TabsTrigger value="settings">Portal Settings</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <PortalUserList onImpersonate={handleImpersonateUser} />
        </TabsContent>

        <TabsContent value="settings">
          <PortalSettings />
        </TabsContent>

        <TabsContent value="activity">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Portal Activity</CardTitle>
              <CardDescription>
                Recent user activity in the customer portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Activity items would go here */}
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No recent activity to display</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ClientPortal() {
  return (
    <Routes>
      <Route path="/" element={<ClientPortalDashboard />} />
      <Route path="/*" element={<ClientPortalDashboard />} />
    </Routes>
  )
}