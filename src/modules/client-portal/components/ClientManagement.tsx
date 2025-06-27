import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, Users, Settings, Plus } from 'lucide-react'
import { ClientAccountsList } from './ClientAccountsList'
import { NewClientAccountForm } from '@/modules/crm-prospecting/components/NewClientAccountForm'
import { useToast } from '@/hooks/use-toast'
import { clientPortalApi } from '@/lib/api'

export function ClientManagement() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('accounts')
  const [showNewClientAccountForm, setShowNewClientAccountForm] = useState(false)

  const handleCreateClientAccount = async (accountData: { email: string; name: string; sendInvite: boolean; leadId?: string }) => {
    try {
      await clientPortalApi.createClientAccount(accountData)
      
      toast({
        title: 'Client Account Created',
        description: accountData.sendInvite 
          ? 'Account created and invitation sent successfully' 
          : 'Account created successfully',
      })
      
      setShowNewClientAccountForm(false)
      return true
    } catch (error) {
      console.error('Error creating client account:', error)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      {/* New Client Account Form Modal */}
      {showNewClientAccountForm && (
        <NewClientAccountForm
          onSave={handleCreateClientAccount}
          onCancel={() => setShowNewClientAccountForm(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Client Portal Management</h2>
          <p className="text-muted-foreground">
            Manage client portal accounts and settings
          </p>
        </div>
        <Button onClick={() => setShowNewClientAccountForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client Account
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">
            <Users className="h-4 w-4 mr-2" />
            Client Accounts
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Portal Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <ClientAccountsList />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Portal Settings</CardTitle>
              <CardDescription>
                Configure client portal settings and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Enable Quote Acceptance</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow clients to accept quotes directly through the portal
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Enable Service Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow clients to submit service requests through the portal
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Enable Order Tracking</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow clients to track their orders and deliveries
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Enable Feedback Surveys</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow clients to submit feedback through surveys
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}