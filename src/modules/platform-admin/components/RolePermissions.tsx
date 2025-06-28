import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Shield, Save, Plus, Trash2, Filter, Search, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { UserRole } from '@/types'

// Define types for permissions
interface Permission {
  id: string;
  role: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
  tenantId?: string;
}

// Mock data for available resources and actions
const availableResources = [
  'leads', 'vehicles', 'quotes', 'agreements', 'service_tickets', 
  'deliveries', 'commissions', 'invoices', 'reports', 'users',
  'tenants', 'settings'
];

const availableActions = ['create', 'read', 'update', 'delete', 'approve', 'export'];

// Mock data for permissions
const mockPermissions: Permission[] = [
  { id: '1', role: 'admin', resource: '*', action: '*' },
  { id: '2', role: 'manager', resource: 'leads', action: '*' },
  { id: '3', role: 'manager', resource: 'vehicles', action: '*' },
  { id: '4', role: 'manager', resource: 'quotes', action: '*' },
  { id: '5', role: 'sales', resource: 'leads', action: '*' },
  { id: '6', role: 'sales', resource: 'vehicles', action: 'read' },
  { id: '7', role: 'sales', resource: 'quotes', action: '*' },
  { id: '8', role: 'service', resource: 'service_tickets', action: '*' },
  { id: '9', role: 'service', resource: 'vehicles', action: 'read,update' },
  { id: '10', role: 'user', resource: 'leads', action: 'read' },
];

export function RolePermissions() {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPermission, setShowAddPermission] = useState(false);
  const [newPermission, setNewPermission] = useState<Partial<Permission>>({
    role: 'manager',
    resource: '',
    action: '',
  });
  const [loading, setLoading] = useState(false);

  // Filter permissions based on active role and search term
  const filteredPermissions = permissions.filter(permission => 
    permission.role === activeRole &&
    (searchTerm === '' || permission.resource.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddPermission = () => {
    if (!newPermission.resource || !newPermission.action) {
      toast({
        title: 'Validation Error',
        description: 'Resource and action are required',
        variant: 'destructive'
      });
      return;
    }

    const newId = Math.max(...permissions.map(p => parseInt(p.id)), 0) + 1;
    
    setPermissions([
      ...permissions,
      {
        id: newId.toString(),
        role: newPermission.role || activeRole,
        resource: newPermission.resource,
        action: newPermission.action,
        conditions: newPermission.conditions || {},
      }
    ]);

    setNewPermission({
      role: activeRole,
      resource: '',
      action: '',
    });

    setShowAddPermission(false);

    toast({
      title: 'Permission Added',
      description: `Added ${newPermission.action} permission on ${newPermission.resource} for ${newPermission.role} role`,
    });
  };

  const handleRemovePermission = (id: string) => {
    setPermissions(permissions.filter(p => p.id !== id));
    
    toast({
      title: 'Permission Removed',
      description: 'Permission has been removed successfully',
    });
  };

  const handleSavePermissions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Permissions Saved',
        description: 'Role permissions have been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save permissions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    if (action === '*') return 'All Actions';
    
    return action.split(',').map(a => 
      a.charAt(0).toUpperCase() + a.slice(1)
    ).join(', ');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Role Permissions
              </CardTitle>
              <CardDescription>
                Manage permissions for different user roles
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowAddPermission(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Permission
              </Button>
              <Button size="sm" onClick={handleSavePermissions} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeRole} onValueChange={setActiveRole} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="user">User</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Add Permission Form */}
            {showAddPermission && (
              <Card className="mb-4 border-dashed">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="resource">Resource *</Label>
                      <Select
                        value={newPermission.resource}
                        onValueChange={(value) => setNewPermission(prev => ({ ...prev, resource: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select resource" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="*">All Resources</SelectItem>
                          {availableResources.map(resource => (
                            <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="action">Action *</Label>
                      <Select
                        value={newPermission.action}
                        onValueChange={(value) => setNewPermission(prev => ({ ...prev, action: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="*">All Actions</SelectItem>
                          {availableActions.map(action => (
                            <SelectItem key={action} value={action}>{action}</SelectItem>
                          ))}
                          <SelectItem value="create,read">Create & Read</SelectItem>
                          <SelectItem value="read,update">Read & Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newPermission.role || activeRole}
                        onValueChange={(value) => setNewPermission(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowAddPermission(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPermission}>
                      Add Permission
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <TabsContent value={activeRole} className="space-y-4">
              <div className="space-y-4">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{permission.resource === '*' ? 'All Resources' : permission.resource}</h3>
                          <Badge variant="outline">
                            {getActionLabel(permission.action)}
                          </Badge>
                        </div>
                        {permission.conditions && Object.keys(permission.conditions).length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Conditions: {JSON.stringify(permission.conditions)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePermission(permission.id)}
                          disabled={permission.resource === '*' && permission.action === '*' && permission.role === 'admin'}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No permissions found for this role</p>
                    <p className="text-sm">Add permissions to define what this role can access</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}