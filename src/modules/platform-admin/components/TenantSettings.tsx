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
import { Building, Save, RefreshCw, Check, X, Settings, Globe, Mail, MessageSquare, Shield, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Define types for tenant settings
interface TenantSetting {
  key: string;
  value: any;
  description: string;
  isOverridden: boolean;
  defaultValue: any;
}

interface TenantData {
  id: string;
  name: string;
  domain: string;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

// Mock data for tenant settings
const mockTenantData: TenantData = {
  id: '1',
  name: 'Demo RV Dealership',
  domain: 'demo.renterinsight.com',
  settings: {
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    features: {
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
  isActive: true,
  createdAt: new Date('2024-01-01')
};

const mockTenantSettings: TenantSetting[] = [
  { key: 'system.default_user_role', value: 'user', description: 'Default role for new users', isOverridden: true, defaultValue: 'user' },
  { key: 'system.password_policy', value: { min_length: 10, require_uppercase: true, require_number: true, require_special: true }, description: 'Password policy settings', isOverridden: true, defaultValue: { min_length: 8, require_uppercase: true, require_number: true, require_special: true } },
  { key: 'system.session_timeout', value: 60, description: 'Session timeout in minutes', isOverridden: true, defaultValue: 30 },
  { key: 'system.max_login_attempts', value: 5, description: 'Maximum failed login attempts before lockout', isOverridden: false, defaultValue: 5 },
  { key: 'system.lockout_duration', value: 30, description: 'Account lockout duration in minutes', isOverridden: false, defaultValue: 30 },
  { key: 'system.audit_level', value: 'verbose', description: 'Audit logging level (minimal, standard, verbose)', isOverridden: true, defaultValue: 'standard' },
];

export function TenantSettings() {
  const { toast } = useToast();
  const [tenant, setTenant] = useState<TenantData>(mockTenantData);
  const [settings, setSettings] = useState<TenantSetting[]>(mockTenantSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveTenant = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Tenant Updated',
        description: 'Tenant settings have been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tenant settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = (key: string, value: any) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value, isOverridden: true } : setting
    ));
  };

  const handleResetSetting = (key: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value: setting.defaultValue, isOverridden: false } : setting
    ));
    
    toast({
      title: 'Setting Reset',
      description: `Setting "${key}" has been reset to default value`,
    });
  };

  const filteredSettings = settings.filter(setting => 
    setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Tenant Settings
              </CardTitle>
              <CardDescription>
                Manage tenant configuration and overrides
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveTenant} disabled={loading}>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="overrides">Setting Overrides</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="tenantName">Tenant Name</Label>
                  <Input
                    id="tenantName"
                    value={tenant.name}
                    onChange={(e) => setTenant(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tenantDomain">Domain</Label>
                  <Input
                    id="tenantDomain"
                    value={tenant.domain}
                    onChange={(e) => setTenant(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={tenant.settings.timezone}
                    onValueChange={(value) => setTenant(prev => ({ 
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
                    value={tenant.settings.currency}
                    onValueChange={(value) => setTenant(prev => ({ 
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
                    value={tenant.settings.dateFormat}
                    onValueChange={(value) => setTenant(prev => ({ 
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
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="isActive"
                    checked={tenant.isActive}
                    onCheckedChange={(checked) => setTenant(prev => ({ ...prev, isActive: !!checked }))}
                  />
                  <Label htmlFor="isActive">Active tenant</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Core Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-crm"
                          checked={tenant.settings.features.crm}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, crm: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-crm">CRM & Prospecting</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-inventory"
                          checked={tenant.settings.features.inventory}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, inventory: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-inventory">Inventory Management</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-quotes"
                          checked={tenant.settings.features.quotes}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, quotes: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-quotes">Quote Builder</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-agreements"
                          checked={tenant.settings.features.agreements}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, agreements: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-agreements">Agreement Vault</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Operations Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-service"
                          checked={tenant.settings.features.service}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, service: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-service">Service Operations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-delivery"
                          checked={tenant.settings.features.delivery}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, delivery: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-delivery">Delivery Tracker</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-commissions"
                          checked={tenant.settings.features.commissions}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, commissions: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-commissions">Commission Engine</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-portal"
                          checked={tenant.settings.features.portal}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, portal: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-portal">Client Portal</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Financial Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-invoices"
                          checked={tenant.settings.features.invoices}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, invoices: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-invoices">Invoice & Payments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="feature-reports"
                          checked={tenant.settings.features.reports}
                          onCheckedChange={(checked) => setTenant(prev => ({ 
                            ...prev, 
                            settings: { 
                              ...prev.settings, 
                              features: { ...prev.settings.features, reports: !!checked } 
                            } 
                          }))}
                        />
                        <Label htmlFor="feature-reports">Reporting Suite</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Module Activation Notice</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Disabling modules may result in data being inaccessible until the module is re-enabled.
                        Users with permissions to disabled modules will not be able to access those features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="overrides" className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredSettings.map((setting) => (
                  <Card key={setting.key} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{setting.key}</CardTitle>
                          <CardDescription>{setting.description}</CardDescription>
                        </div>
                        {setting.isOverridden ? (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                            Overridden
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Default
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {typeof setting.value === 'object' ? (
                          <div className="space-y-2">
                            {Object.entries(setting.value).map(([key, value]) => (
                              <div key={key} className="grid grid-cols-2 gap-2">
                                <Label htmlFor={`${setting.key}.${key}`}>{key.replace(/_/g, ' ')}</Label>
                                {typeof value === 'boolean' ? (
                                  <div className="flex items-center">
                                    <Checkbox
                                      id={`${setting.key}.${key}`}
                                      checked={value as boolean}
                                      onCheckedChange={(checked) => {
                                        const newValue = { ...setting.value, [key]: !!checked };
                                        handleUpdateSetting(setting.key, newValue);
                                      }}
                                    />
                                    <Label htmlFor={`${setting.key}.${key}`} className="ml-2">
                                      {value ? 'Enabled' : 'Disabled'}
                                    </Label>
                                  </div>
                                ) : (
                                  <Input
                                    id={`${setting.key}.${key}`}
                                    value={value as string}
                                    onChange={(e) => {
                                      const newValue = { ...setting.value, [key]: e.target.value };
                                      handleUpdateSetting(setting.key, newValue);
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : typeof setting.value === 'boolean' ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={setting.key}
                              checked={setting.value}
                              onCheckedChange={(checked) => handleUpdateSetting(setting.key, !!checked)}
                            />
                            <Label htmlFor={setting.key}>{setting.value ? 'Enabled' : 'Disabled'}</Label>
                          </div>
                        ) : (
                          <Input
                            id={setting.key}
                            value={setting.value}
                            onChange={(e) => handleUpdateSetting(setting.key, e.target.value)}
                          />
                        )}

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetSetting(setting.key)}
                            disabled={!setting.isOverridden}
                          >
                            Reset to Default
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <CardDescription>
                    Manage users for this tenant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>User management is handled in the Users section</p>
                    <Button className="mt-4">
                      Go to User Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}