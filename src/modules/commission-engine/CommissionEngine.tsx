import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, Plus, Search, Filter, CheckCircle, XCircle, Clock, Calendar, User, BarChart3 } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { CommissionRule } from './types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useCommissionManagement } from './hooks/useCommissionManagement'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { CommissionForm } from './components/CommissionForm'
import { CommissionDetail } from './components/CommissionDetail'
import { CommissionRulesList } from './components/CommissionRulesList'
import { CommissionRuleForm } from './components/CommissionRuleForm'
import { CommissionReportGenerator } from './components/CommissionReportGenerator'

// Mock data for sales reps and deals
const mockSalesReps = [
  {
    id: 'sales-001',
    name: 'John Smith',
    email: 'john.smith@dealership.com',
    phone: '(555) 123-4567',
    territory: 'North Region',
    isActive: true,
    targets: {
      monthly: 10,
      quarterly: 30,
      annual: 120
    }
  },
  {
    id: 'sales-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dealership.com',
    phone: '(555) 987-6543',
    territory: 'South Region',
    isActive: true,
    targets: {
      monthly: 12,
      quarterly: 36,
      annual: 144
    }
  },
  {
    id: 'sales-003',
    name: 'Mike Davis',
    email: 'mike.davis@dealership.com',
    phone: '(555) 456-7890',
    territory: 'East Region',
    isActive: true,
    targets: {
      monthly: 8,
      quarterly: 24,
      annual: 96
    }
  }
]

const mockDeals = [
  {
    id: 'deal-001',
    name: 'Georgetown Class A Sale - Smith Family',
    customerName: 'John & Mary Smith',
    value: 137500,
    stage: 'closed_won',
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'deal-002',
    name: 'Travel Trailer - Johnson Family',
    customerName: 'Sarah Johnson',
    value: 75000,
    stage: 'closed_won',
    status: 'active',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'deal-003',
    name: 'Service Contract - Davis',
    customerName: 'Mike Davis',
    value: 2500,
    stage: 'closed_won',
    status: 'active',
    createdAt: new Date('2024-01-20')
  }
]

function CommissionsList() {
  const {
    commissions,
    rules,
    auditTrail,
    createCommission,
    updateCommission,
    approveCommission,
    rejectCommission,
    markCommissionPaid,
    createRule,
    updateRule,
    deleteRule,
    getAuditTrailByCommission,
    generateCommissionReport,
    exportCommissionsToCSV
  } = useCommissionManagement()
  
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('commissions')
  const [showCommissionForm, setShowCommissionForm] = useState(false)
  const [showCommissionDetail, setShowCommissionDetail] = useState(false)
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null)
  const [selectedRule, setSelectedRule] = useState<CommissionRule | null>(null)

  const getStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case CommissionStatus.APPROVED:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case CommissionStatus.PAID:
        return 'bg-green-50 text-green-700 border-green-200'
      case CommissionStatus.CANCELLED:
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeColor = (type: CommissionType) => {
    switch (type) {
      case CommissionType.FLAT:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case CommissionType.PERCENTAGE:
        return 'bg-green-50 text-green-700 border-green-200'
      case CommissionType.TIERED:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />
      case CommissionStatus.APPROVED:
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case CommissionStatus.PAID:
        return <DollarSign className="h-4 w-4 text-green-500" />
      case CommissionStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = 
      commission.salesPersonId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.dealId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCreateCommission = () => {
    setSelectedCommission(null)
    setShowCommissionForm(true)
  }

  const handleEditCommission = (commission: Commission) => {
    setSelectedCommission(commission)
    setShowCommissionForm(true)
    setShowCommissionDetail(false)
  }

  const handleViewCommission = (commission: Commission) => {
    setSelectedCommission(commission)
    setShowCommissionDetail(true)
  }

  const handleSaveCommission = async (commissionData: Partial<Commission>, notes?: string) => {
    try {
      if (selectedCommission) {
        // Update existing commission
        await updateCommission(
          selectedCommission.id, 
          commissionData, 
          user?.id || 'current-user',
          user?.name || 'Current User',
          notes
        )
        toast({
          title: 'Success',
          description: 'Commission updated successfully',
        })
      } else {
        // Create new commission
        await createCommission(
          commissionData, 
          user?.id || 'current-user',
          user?.name || 'Current User'
        )
        toast({
          title: 'Success',
          description: 'Commission created successfully',
        })
      }
      setShowCommissionForm(false)
      setSelectedCommission(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedCommission ? 'update' : 'create'} commission`,
        variant: 'destructive'
      })
    }
  }

  const handleApproveCommission = async (commissionId: string, notes?: string) => {
    try {
      await approveCommission(
        commissionId, 
        user?.id || 'current-user',
        user?.name || 'Current User',
        notes
      )
      toast({
        title: 'Success',
        description: 'Commission approved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve commission',
        variant: 'destructive'
      })
    }
  }

  const handleRejectCommission = async (commissionId: string, notes?: string) => {
    try {
      await rejectCommission(
        commissionId, 
        user?.id || 'current-user',
        user?.name || 'Current User',
        notes
      )
      toast({
        title: 'Success',
        description: 'Commission rejected successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject commission',
        variant: 'destructive'
      })
    }
  }

  const handleMarkPaid = async (commissionId: string, notes?: string) => {
    try {
      await markCommissionPaid(
        commissionId, 
        user?.id || 'current-user',
        user?.name || 'Current User',
        notes
      )
      toast({
        title: 'Success',
        description: 'Commission marked as paid successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark commission as paid',
        variant: 'destructive'
      })
    }
  }

  const handleCreateRule = () => {
    setSelectedRule(null)
    setShowRuleForm(true)
  }

  const handleEditRule = (rule: CommissionRule) => {
    setSelectedRule(rule)
    setShowRuleForm(true)
  }

  const handleSaveRule = async (ruleData: Partial<CommissionRule>) => {
    try {
      if (selectedRule) {
        // Update existing rule
        await updateRule(selectedRule.id, ruleData)
        toast({
          title: 'Success',
          description: 'Commission rule updated successfully',
        })
      } else {
        // Create new rule
        await createRule(ruleData)
        toast({
          title: 'Success',
          description: 'Commission rule created successfully',
        })
      }
      setShowRuleForm(false)
      setSelectedRule(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedRule ? 'update' : 'create'} commission rule`,
        variant: 'destructive'
      })
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this commission rule?')) {
      try {
        await deleteRule(ruleId)
        toast({
          title: 'Success',
          description: 'Commission rule deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete commission rule',
          variant: 'destructive'
        })
      }
    }
  }

  // Stats
  const totalCommissions = commissions.length
  const pendingCommissions = commissions.filter(c => c.status === CommissionStatus.PENDING).length
  const approvedCommissions = commissions.filter(c => c.status === CommissionStatus.APPROVED).length
  const paidCommissions = commissions.filter(c => c.status === CommissionStatus.PAID).length
  
  const totalAmount = commissions.reduce((sum, c) => sum + c.amount, 0)
  const pendingAmount = commissions.filter(c => c.status === CommissionStatus.PENDING)
    .reduce((sum, c) => sum + c.amount, 0)
  const approvedAmount = commissions.filter(c => c.status === CommissionStatus.APPROVED)
    .reduce((sum, c) => sum + c.amount, 0)
  const paidAmount = commissions.filter(c => c.status === CommissionStatus.PAID)
    .reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="space-y-8">
      {/* Commission Form Modal */}
      {showCommissionForm && (
        <CommissionForm
          commission={selectedCommission || undefined}
          salesReps={mockSalesReps}
          deals={mockDeals}
          rules={rules}
          onSave={handleSaveCommission}
          onCancel={() => {
            setShowCommissionForm(false)
            setSelectedCommission(null)
          }}
        />
      )}
      
      {/* Commission Detail Modal */}
      {showCommissionDetail && selectedCommission && (
        <CommissionDetail
          commission={selectedCommission}
          salesReps={mockSalesReps}
          deals={mockDeals}
          auditTrail={getAuditTrailByCommission(selectedCommission.id)}
          onClose={() => setShowCommissionDetail(false)}
          onEdit={handleEditCommission}
          onApprove={handleApproveCommission}
          onReject={handleRejectCommission}
          onMarkPaid={handleMarkPaid}
        />
      )}
      
      {/* Rule Form Modal */}
      {showRuleForm && (
        <CommissionRuleForm
          rule={selectedRule || undefined}
          onSave={handleSaveRule}
          onCancel={() => {
            setShowRuleForm(false)
            setSelectedRule(null)
          }}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Commission Engine</h1>
            <p className="ri-page-description">
              Manage sales commissions and payment rules
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateCommission}>
            <Plus className="h-4 w-4 mr-2" />
            New Commission
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <User className="h-3 w-3 mr-1" />
              {totalCommissions} commissions
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {pendingCommissions} pending approval
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(approvedAmount)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              {approvedCommissions} approved
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <DollarSign className="h-3 w-3 mr-1" />
              {paidCommissions} paid out
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search commissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={CommissionStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={CommissionStatus.APPROVED}>Approved</SelectItem>
                <SelectItem value={CommissionStatus.PAID}>Paid</SelectItem>
                <SelectItem value={CommissionStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button onClick={handleCreateCommission} className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Commission
            </Button>
          </div>

          {/* Commissions Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Commissions</CardTitle>
              <CardDescription>
                Track and manage sales commissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCommissions.map((commission) => {
                  const salesRep = mockSalesReps.find(rep => rep.id === commission.salesPersonId)
                  const deal = mockDeals.find(d => d.id === commission.dealId)
                  
                  return (
                    <div key={commission.id} className="ri-table-row">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">Commission #{commission.id}</h3>
                            <Badge className={cn("ri-badge-status", getTypeColor(commission.type))}>
                              {commission.type.toUpperCase()}
                            </Badge>
                            <Badge className={cn("ri-badge-status", getStatusColor(commission.status))}>
                              {getStatusIcon(commission.status)}
                              <span className="ml-1">{commission.status.toUpperCase()}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-2 text-blue-500" />
                              <span className="font-medium">Sales Rep:</span> 
                              <span className="ml-1">{salesRep?.name || commission.salesPersonId}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-2 text-green-500" />
                              <span className="font-medium">Deal:</span> 
                              <span className="ml-1">{deal?.name || commission.dealId}</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-2 text-purple-500" />
                              <span className="font-medium">Amount:</span> 
                              <span className="ml-1 font-bold text-primary">{formatCurrency(commission.amount)}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-2 text-orange-500" />
                              <span className="font-medium">Created:</span> 
                              <span className="ml-1">{formatDate(commission.createdAt)}</span>
                            </div>
                          </div>
                          {commission.notes && (
                            <div className="mt-2 bg-muted/30 p-2 rounded-md">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Notes:</span> {commission.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ri-action-buttons">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shadow-sm"
                          onClick={() => handleViewCommission(commission)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shadow-sm"
                          onClick={() => handleEditCommission(commission)}
                        >
                          Edit
                        </Button>
                        {commission.status === CommissionStatus.PENDING && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="shadow-sm"
                            onClick={() => handleApproveCommission(commission.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {commission.status === CommissionStatus.APPROVED && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="shadow-sm"
                            onClick={() => handleMarkPaid(commission.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {filteredCommissions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No commissions found</p>
                    <p className="text-sm">Create your first commission to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <CommissionRulesList
            rules={rules}
            onCreateRule={handleCreateRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
          />
        </TabsContent>

        <TabsContent value="reports">
          <CommissionReportGenerator
            salesReps={mockSalesReps}
            onGenerateReport={generateCommissionReport}
            onExportCSV={exportCommissionsToCSV}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CommissionEngine() {
  return (
    <Routes>
      <Route path="/" element={<CommissionsList />} />
      <Route path="/*" element={<CommissionsList />} />
    </Routes>
  )
}