import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Bell, Plus, Save, Trash2, X, Calendar, Check, Info, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Define types for system alerts
interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  targetRoles: string[];
  targetTenants: string[];
  createdBy: string;
  createdAt: Date;
}

// Mock data for system alerts
const mockAlerts: SystemAlert[] = [
  {
    id: '1',
    title: 'Scheduled Maintenance',
    message: 'The system will be undergoing scheduled maintenance on Saturday, July 15th from 2:00 AM to 5:00 AM EST. During this time, the system may be unavailable.',
    severity: 'info',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-16'),
    isActive: true,
    targetRoles: ['all'],
    targetTenants: [],
    createdBy: 'admin',
    createdAt: new Date('2024-07-01')
  },
  {
    id: '2',
    title: 'Critical Security Update',
    message: 'A critical security update has been applied to the system. Please ensure all users log out and log back in to apply the changes.',
    severity: 'critical',
    startDate: new Date('2024-06-28'),
    endDate: new Date('2024-07-05'),
    isActive: true,
    targetRoles: ['admin', 'manager'],
    targetTenants: [],
    createdBy: 'admin',
    createdAt: new Date('2024-06-28')
  }
];

export function SystemAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SystemAlert[]>(mockAlerts);
  const [activeTab, setActiveTab] = useState('active');
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newAlert, setNewAlert] = useState<Partial<SystemAlert>>({
    title: '',
    message: '',
    severity: 'info',
    startDate: new Date(),
    isActive: true,
    targetRoles: ['all'],
    targetTenants: []
  });

  const handleAddAlert = async () => {
    if (!newAlert.title || !newAlert.message) {
      toast({
        title: 'Validation Error',
        description: 'Title and message are required',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const alert: SystemAlert = {
        id: Math.random().toString(36).substring(2, 9),
        title: newAlert.title || '',
        message: newAlert.message || '',
        severity: newAlert.severity || 'info',
        startDate: newAlert.startDate || new Date(),
        endDate: newAlert.endDate,
        isActive: newAlert.isActive !== false,
        targetRoles: newAlert.targetRoles || ['all'],
        targetTenants: newAlert.targetTenants || [],
        createdBy: 'admin',
        createdAt: new Date()
      };
      
      setAlerts([...alerts, alert]);
      setShowAddAlert(false);
      setNewAlert({
        title: '',
        message: '',
        severity: 'info',
        startDate: new Date(),
        isActive: true,
        targetRoles: ['all'],
        targetTenants: []
      });
      
      toast({
        title: 'Alert Created',
        description: 'System alert has been created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create system alert',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlert = async (id: string, isActive: boolean) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive } : alert
    ));
    
    toast({
      title: isActive ? 'Alert Activated' : 'Alert Deactivated',
      description: `Alert has been ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  };

  const handleDeleteAlert = async (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    
    toast({
      title: 'Alert Deleted',
      description: 'System alert has been deleted successfully',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'error':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'active') return alert.isActive;
    if (activeTab === 'inactive') return !alert.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Manage system-wide alerts and notifications
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddAlert(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add Alert Form */}
          {showAddAlert && (
            <Card className="mb-6 border-dashed">
              <CardHeader>
                <CardTitle className="text-lg">New System Alert</CardTitle>
                <CardDescription>
                  Create a new system-wide alert or notification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="alertTitle">Title *</Label>
                    <Input
                      id="alertTitle"
                      value={newAlert.title}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Scheduled Maintenance"
                    />
                  </div>
                  <div>
                    <Label htmlFor="alertSeverity">Severity</Label>
                    <Select
                      value={newAlert.severity}
                      onValueChange={(value: 'info' | 'warning' | 'error' | 'critical') => 
                        setNewAlert(prev => ({ ...prev, severity: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="alertMessage">Message *</Label>
                  <Textarea
                    id="alertMessage"
                    value={newAlert.message}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter alert message"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newAlert.startDate ? new Date(newAlert.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewAlert(prev => ({ 
                        ...prev, 
                        startDate: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newAlert.endDate ? new Date(newAlert.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setNewAlert(prev => ({ 
                        ...prev, 
                        endDate: e.target.value ? new Date(e.target.value) : undefined 
                      }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Target Roles</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="role-all"
                        checked={newAlert.targetRoles?.includes('all')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewAlert(prev => ({ ...prev, targetRoles: ['all'] }));
                          } else {
                            setNewAlert(prev => ({ ...prev, targetRoles: [] }));
                          }
                        }}
                      />
                      <Label htmlFor="role-all">All Roles</Label>
                    </div>
                    {!newAlert.targetRoles?.includes('all') && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="role-admin"
                            checked={newAlert.targetRoles?.includes('admin')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: [...(prev.targetRoles || []), 'admin'] 
                                }));
                              } else {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: prev.targetRoles?.filter(r => r !== 'admin') || [] 
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="role-admin">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="role-manager"
                            checked={newAlert.targetRoles?.includes('manager')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: [...(prev.targetRoles || []), 'manager'] 
                                }));
                              } else {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: prev.targetRoles?.filter(r => r !== 'manager') || [] 
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="role-manager">Manager</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="role-sales"
                            checked={newAlert.targetRoles?.includes('sales')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: [...(prev.targetRoles || []), 'sales'] 
                                }));
                              } else {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: prev.targetRoles?.filter(r => r !== 'sales') || [] 
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="role-sales">Sales</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="role-service"
                            checked={newAlert.targetRoles?.includes('service')}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: [...(prev.targetRoles || []), 'service'] 
                                }));
                              } else {
                                setNewAlert(prev => ({ 
                                  ...prev, 
                                  targetRoles: prev.targetRoles?.filter(r => r !== 'service') || [] 
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="role-service">Service</Label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={newAlert.isActive}
                    onCheckedChange={(checked) => setNewAlert(prev => ({ ...prev, isActive: !!checked }))}
                  />
                  <Label htmlFor="isActive">Active alert</Label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddAlert(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAlert} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Alert
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active
                <Badge className="ml-2 bg-green-50 text-green-700 border-green-200">
                  {alerts.filter(a => a.isActive).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive
                <Badge className="ml-2 bg-gray-50 text-gray-700 border-gray-200">
                  {alerts.filter(a => !a.isActive).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            getSeverityColor(alert.severity)
                          )}>
                            {getSeverityIcon(alert.severity)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{alert.title}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={cn("text-xs", getSeverityColor(alert.severity))}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              {alert.isActive ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                                  ACTIVE
                                </Badge>
                              ) : (
                                <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-xs">
                                  INACTIVE
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleAlert(alert.id, !alert.isActive)}
                          >
                            {alert.isActive ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {alert.message}
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div>
                          <span className="font-medium">Date Range:</span>
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(alert.startDate)}</span>
                            {alert.endDate && (
                              <>
                                <span>-</span>
                                <span>{formatDate(alert.endDate)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Target Roles:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {alert.targetRoles.map(role => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role === 'all' ? 'All Roles' : role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Created:</span>
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{formatDate(alert.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No alerts found</p>
                  <p className="text-sm">Create a new alert to notify users of important information</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}