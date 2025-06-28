import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Building, Key, Settings, Mail, MessageSquare, FileText, Database, Shield, AlertTriangle, CheckCircle, XCircle, Clock, ListFilter, Download, RefreshCw, Search, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

// Mock audit logs
const mockAuditLogs = [
  {
    id: '1',
    timestamp: new Date('2024-06-27T10:00:00Z'),
    actor: 'admin@renterinsight.com',
    action: 'tenant_created',
    target: 'Demo RV Dealership',
    status: 'success',
    details: 'New tenant organization created',
    type: 'tenant',
  },
  {
    id: '2',
    timestamp: new Date('2024-06-27T10:05:00Z'),
    actor: 'admin@renterinsight.com',
    action: 'api_token_generated',
    target: 'Production API Key',
    status: 'success',
    details: 'New API token generated for production environment',
    type: 'api_token',
  },
  {
    id: '3',
    timestamp: new Date('2024-06-27T10:10:00Z'),
    actor: 'manager@demorv.com',
    action: 'module_disabled',
    target: 'Commission Engine',
    status: 'success',
    details: 'Module disabled by tenant manager',
    type: 'module',
  },
  {
    id: '4',
    timestamp: new Date('2024-06-27T10:15:00Z'),
    actor: 'system',
    action: 'email_sent',
    target: 'john.doe@example.com',
    status: 'success',
    details: 'Welcome email sent to new lead',
    type: 'email',
  },
  {
    id: '5',
    timestamp: new Date('2024-06-27T10:20:00Z'),
    actor: 'system',
    action: 'sms_failed',
    target: '+15551234567',
    status: 'failure',
    details: 'SMS delivery failed due to invalid number',
    type: 'sms',
  },
  {
    id: '6',
    timestamp: new Date('2024-06-27T10:25:00Z'),
    actor: 'admin@renterinsight.com',
    action: 'user_login',
    target: 'admin@renterinsight.com',
    status: 'success',
    details: 'User logged in',
    type: 'user',
  },
  {
    id: '7',
    timestamp: new Date('2024-06-27T10:30:00Z'),
    actor: 'system',
    action: 'database_backup',
    target: 'daily_backup_20240627',
    status: 'success',
    details: 'Daily database backup completed',
    type: 'database',
  },
  {
    id: '8',
    timestamp: new Date('2024-06-27T10:35:00Z'),
    actor: 'admin@renterinsight.com',
    action: 'settings_updated',
    target: 'Tenant Settings',
    status: 'success',
    details: 'Tenant branding settings updated',
    type: 'settings',
  },
];

export function AuditLogs() {
  const [logs, setLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'tenant_created':
      case 'tenant_updated':
      case 'tenant_deleted':
        return <Building className="h-4 w-4" />;
      case 'api_token_generated':
      case 'api_token_revoked':
        return <Key className="h-4 w-4" />;
      case 'module_enabled':
      case 'module_disabled':
        return <Settings className="h-4 w-4" />;
      case 'email_sent':
      case 'email_failed':
        return <Mail className="h-4 w-4" />;
      case 'sms_sent':
      case 'sms_failed':
        return <MessageSquare className="h-4 w-4" />;
      case 'user_login':
      case 'user_logout':
      case 'user_role_changed':
        return <User className="h-4 w-4" />;
      case 'database_backup':
      case 'database_restore':
        return <Database className="h-4 w-4" />;
      case 'settings_updated':
        return <Settings className="h-4 w-4" />;
      case 'permission_changed':
        return <Shield className="h-4 w-4" />;
      case 'system_error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system_event':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'failure':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'tenant':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'api_token':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'module':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'email':
      case 'sms':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'user':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'database':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'settings':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRefresh = () => {
    // In a real app, this would fetch new logs from the backend
    setLogs(mockAuditLogs);
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    
    // Simulate a refresh action
    console.log('Refreshing audit logs...');
  };

  const handleExport = () => {
    // In a real app, this would trigger a CSV export
    console.log('Exporting audit logs...');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ScrollText className="h-5 w-5 mr-2 text-primary" />
                Audit Logs
              </CardTitle>
              <CardDescription>
                View system audit logs and activity
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="api_token">API Token</SelectItem>
                <SelectItem value="module">Module</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const Icon = getActionIcon(log.action);
                return (
                  <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                      getStatusColor(log.status).replace('text-', 'bg-').replace('border-', '')
                    )}>
                      {Icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{log.action.replace(/_/g, ' ').toUpperCase()}</span>
                          <Badge className={cn("text-xs", getStatusColor(log.status))}>
                            {log.status.toUpperCase()}
                          </Badge>
                          <Badge className={cn("text-xs", getLogTypeColor(log.type))}>
                            {log.type.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium">{log.actor}</span> performed action on <span className="font-medium">{log.target}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ScrollText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No audit logs found</p>
                <p className="text-sm">Adjust your filters or refresh the logs</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
