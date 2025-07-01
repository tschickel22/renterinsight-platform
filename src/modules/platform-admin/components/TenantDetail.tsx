import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { X, Save, Building, Users, Settings, Shield, Activity, Globe, Edit, Trash2 } from 'lucide-react'
import { UserForm } from './UserForm'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface TenantDetailProps {
  tenant: any
  onSave: (tenantId: string, tenantData: any) => Promise<void>
  onClose: () => void
}

export function TenantDetail({ tenant, onSave, onClose }: TenantDetailProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    ...tenant,
    settings: {
      ...tenant.settings,
      features: tenant.settings?.features || {
        crm: true,
        inventory: true,
        quotes: true,
        agreements: true,
        service: true,
        delivery: true,
        commissions: true,
        portal: true,
        invoices: true,
        reports: true
      }
    },
    branding: tenant.branding || {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.domain) {
      toast({
        title: 'Validation Error',
        description: 'Tenant name and domain are required',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(tenant.id, {
        ...formData,
        status: formData.isActive ? 'active' : 'inactive'
      })
      toast({
        title: 'Success',
        description: 'Tenant updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tenant',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
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

  // Fetch users when the Users tab is selected
  useEffect(() => {
    if (activeTab === 'users') {
      fetchTenantUsers();
    }
  }, [activeTab, tenant.id]);

  const fetchTenantUsers = () => {
    setLoadingUsers(true);
    // Simulate API call delay
    setTimeout(() => {
      // Mock user data for the selected tenant
      const mockUsers = [
        { id: 'user-1', name: 'Tenant Admin', email: 'admin@tenant.com', role: 'admin', is_active: true },
        { id: 'user-2', name: 'Tenant Manager', email: 'manager@tenant.com', role: 'manager', is_active: true },
        { id: 'user-3', name: 'Sales Rep', email: 'sales@tenant.com', role: 'sales', is_active: false },
      ];
      setUsers(mockUsers);
      setLoadingUsers(false);
    }, 500); // Simulate network delay
  };

  const handleAddUser = (userData: any) => {
    // In a real app, this would be an API call
    console.log(editingUser ? 'Updating user:' : 'Adding user:', userData);
    
    // If we're editing, update the users array
    if (editingUser) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        )
      );
      
      toast({
        title: 'User Updated',
        description: `${userData.name} has been updated successfully.`,
      });
    } else {
      // For new users, add to the array
      const newUser = { ...userData, id: userData.id || Math.random().toString(36).substr(2, 9) };
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      toast({
        title: 'User Added',
        description: `${userData.name} has been added successfully.`,
      });
    }
    
    setShowAddUserForm(false);
    setEditingUser(null);
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowAddUserForm(true);
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user ${userName}?`)) {
      // In a real app, this would be an API call to delete the user
      console.log('Deleting user:', userId);
      
      // Update the users array by filtering out the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast({
        title: 'User Deleted',
        description: `${userName} has been deleted successfully.`,
      });
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Add User Form Modal */}
      {showAddUserForm && (
        <UserForm
          tenantId={tenant.id}
          user={editingUser}
          onSave={handleAddUser}
          onCancel={() => {
            setShowAddUserForm(false);
            setEditingUser(null);
          }}
        />
      )}
      
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <CardTitle className="text-xl">{tenant.name}</CardTitle>
                <Badge className={cn("ri-badge-status", getStatusColor(tenant.status))}>
                  {tenant.status.toUpperCase()}
                </Badge>
              </div>
              <CardDescription>
                {tenant.domain}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Tenant Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sunshine RV Dealership"
                  />
                </div>
                
                <div>
                  <Label htmlFor="domain">Domain *</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="e.g., sunshine.renterinsight.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be used for tenant-specific access
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.settings.timezone}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.settings.currency}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, currency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={formData.settings.dateFormat}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, dateFormat: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                />
                <Label htmlFor="isActive">Active tenant</Label>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <h3 className="text-lg font-semibold">Enabled Features</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(formData.settings.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={enabled as boolean}
                      onCheckedChange={(checked) => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          features: {
                            ...prev.settings.features,
                            [feature]: !!checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor={`feature-${feature}`} className="capitalize">
                      {feature === 'crm' ? 'CRM & Prospecting' : 
                       feature === 'invoices' ? 'Invoice & Payments' : 
                       feature}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <h3 className="text-lg font-semibold">Branding</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      id="primaryColor"
                      value={formData.branding.primaryColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      className="w-16 h-10 shadow-sm"
                    />
                    <Input 
                      value={formData.branding.primaryColor} 
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: e.target.value }
                      }))}
                      className="shadow-sm" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type="color"
                      id="secondaryColor"
                      value={formData.branding.secondaryColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      className="w-16 h-10 shadow-sm"
                    />
                    <Input 
                      value={formData.branding.secondaryColor} 
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        branding: { ...prev.branding, secondaryColor: e.target.value }
                      }))}
                      className="shadow-sm" 
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select
                    value={formData.branding.fontFamily}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      branding: { ...prev.branding, fontFamily: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Preview */}
              <div className="border rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div 
                  className="space-y-4 p-4 rounded-lg border"
                  style={{
                    fontFamily: formData.branding.fontFamily
                  }}
                >
                  <div className="space-y-2">
                    <h4 className="font-semibold">Text Preview</h4>
                    <p>This is how your text will appear with the selected font.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold">Color Preview</h4>
                    <div className="flex space-x-4">
                      <div 
                        className="w-20 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: formData.branding.primaryColor }}
                      >
                        Primary
                      </div>
                      <div 
                        className="w-20 h-10 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: formData.branding.secondaryColor }}
                      >
                        Secondary
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Users</h3>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddUserForm(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              {loadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div>
                        <h4 className="font-semibold">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={user.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}>
                          {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                        <Badge variant="outline">
                          {user.role.toUpperCase()}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No users found for this tenant</p>
                  <p className="text-sm">Add users to provide access to this tenant</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Activity Log</h3>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              
              <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No activity recorded yet</p>
                <p className="text-sm">Activity will be logged as users interact with the system</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
