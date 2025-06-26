import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Plus, Calculator, BarChart3, History, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { CommissionRuleForm, CommissionRule } from './components/CommissionRuleForm'
import { ErrorBoundary } from 'react-error-boundary'
import { CommissionRulesList } from './components/CommissionRulesList'
import { CommissionReportView } from './components/CommissionReportView'
import { CommissionCalculator } from './components/CommissionCalculator'
import { AuditTrailCard, AuditEntry } from './components/AuditTrailCard'
import { useCommissionManagement } from './hooks/useCommissionManagement'

function CommissionEngineDashboard() {
  const { user } = useAuth() || { user: null }
  const { toast } = useToast()
  const {
    commissions,
    rules,
    auditTrail,
    createCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    duplicateCommissionRule,
    getAuditTrailByDealId,
    addAuditEntry,
    updateAuditEntryNotes
  } = useCommissionManagement()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [selectedRule, setSelectedRule] = useState<CommissionRule | null>(null)
  const [selectedDealId, setSelectedDealId] = useState<string>('deal-001') // For demo purposes

  // Mock sales reps data
  const salesReps = [
    { id: 'sales-001', name: 'John Smith' },
    { id: 'sales-002', name: 'Sarah Johnson' },
    { id: 'sales-003', name: 'Mike Davis' }
  ]

  const handleCreateRule = () => {
    setSelectedRule(null)
    setShowRuleForm(true)
    toast({
      title: 'Create Rule',
      description: 'Fill in the details to create a new commission rule'
    })
  }

  const handleEditRule = (rule: CommissionRule) => {
    setSelectedRule(rule)
    setShowRuleForm(true)
  }

  const handleSaveRule = async (ruleData: Partial<CommissionRule>) => {
    try {
      if (selectedRule) {
        await updateCommissionRule(selectedRule.id, ruleData, user?.id || 'unknown', user?.name || 'Unknown User')
        toast({
          title: 'Success',
          description: 'Commission rule updated successfully',
        })
      } else {
        await createCommissionRule(ruleData, user?.id || 'unknown', user?.name || 'Unknown User')
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
        await deleteCommissionRule(ruleId, user?.id || 'unknown', user?.name || 'Unknown User')
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

  const handleDuplicateRule = async (rule: CommissionRule) => {
    try {
      await duplicateCommissionRule(rule.id, user?.id || 'unknown', user?.name || 'Unknown User')
      toast({
        title: 'Success',
        description: 'Commission rule duplicated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate commission rule',
        variant: 'destructive'
      })
    }
  }

  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Exporting CSV...')
  }

  const handlePrintReport = () => {
    // In a real app, this would open a print dialog
    window.print()
  }

  const handleSaveCalculation = async (calculationData: any) => {
    // In a real app, this would save the calculation to the database
    console.log('Saving calculation:', calculationData)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Success',
        description: 'Calculation saved successfully',
      })
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save calculation',
        variant: 'destructive'
      })
      return false;
    }
  }

  // Get audit trail for the selected deal
  const dealAuditTrail = getAuditTrailByDealId(selectedDealId)

  // Calculate stats for dashboard
  const totalCommission = Array.isArray(commissions) ? 
    commissions.reduce((sum, c) => sum + (c.amount || 0), 0) : 0;
  
  const pendingCommission = Array.isArray(commissions) ? 
    commissions
      .filter(c => c.status === CommissionStatus.PENDING || c.status === CommissionStatus.APPROVED)
      .reduce((sum, c) => sum + (c.amount || 0), 0) : 0;
  
  const paidCommission = Array.isArray(commissions) ? 
    commissions
      .filter(c => c.status === CommissionStatus.PAID)
      .reduce((sum, c) => sum + (c.amount || 0), 0) : 0;

  return (
    <div className="space-y-8">
      {/* Commission Rule Form Modal */}
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
          <Button className="shadow-sm" onClick={handleCreateRule}>
            <Plus className="h-4 w-4 mr-2" />
            New Commission Rule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading stats. Please try refreshing the page.</div>}>
        <div className="ri-stats-grid">
          <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalCommission)}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <BarChart3 className="h-3 w-3 mr-1" />
                All commissions
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900">Pending</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{formatCurrency(pendingCommission)}</div>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <BarChart3 className="h-3 w-3 mr-1" />
                Awaiting payment
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(paidCommission)}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <BarChart3 className="h-3 w-3 mr-1" />
                Paid out
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Commission Rules</CardTitle>
              <Settings className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{rules ? rules.length : 0}</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <BarChart3 className="h-3 w-3 mr-1" />
                Active rules
              </p>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading dashboard. Please try refreshing the page.</div>}>
            <div className="grid gap-6 md:grid-cols-2">
              <CommissionCalculator 
                rules={rules || []}
                onSaveCalculation={handleSaveCalculation}
              />
              
              <AuditTrailCard
                entries={dealAuditTrail || []}
                dealId={selectedDealId}
                currentUserId={user?.id || 'unknown'}
                currentUserName={user?.name || 'Unknown User'}
                onAddEntry={addAuditEntry}
                onUpdateEntry={updateAuditEntryNotes}
              />
            </div>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="rules">
          <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading rules. Please try refreshing the page.</div>}>
            <CommissionRulesList
              rules={rules || []}
              onCreateRule={handleCreateRule}
              onEditRule={handleEditRule}
              onDeleteRule={handleDeleteRule}
              onDuplicateRule={handleDuplicateRule}
            />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="reports">
          <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading reports. Please try refreshing the page.</div>}>
            <CommissionReportView
              commissions={commissions || []}
              salesReps={salesReps || []}
              onExportCSV={handleExportCSV}
              onPrintReport={handlePrintReport}
            />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="calculator">
          <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error loading calculator. Please try refreshing the page.</div>}>
            <div className="max-w-2xl mx-auto">
              <CommissionCalculator 
                rules={rules || []}
                onSaveCalculation={handleSaveCalculation}
              />
            </div>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Render the app
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <ErrorBoundary fallback={<div className="p-8 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
      <p className="mb-4">There was an error loading the Commission Engine</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Reload Page
      </button>
    </div>}>
      <CommissionEngineDashboard />
    </ErrorBoundary>
  )
} else {
  console.error('Root element not found')
}