import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DollarSign, Plus, Calculator, BarChart3, History, Settings, Users } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { Commission, CommissionStatus, CommissionType, AuditEntry } from './types'
import { CommissionRuleForm, CommissionRule } from './components/CommissionRuleForm'
import { CommissionRulesList } from './components/CommissionRulesList'
import { CommissionReportView } from './components/CommissionReportView'
import { CommissionCalculator } from './components/CommissionCalculator'
import { AuditTrailCard } from './components/AuditTrailCard'
import { useCommissionManagement } from './hooks/useCommissionManagement'
import { UserCommissionReport } from './components/UserCommissionReport'

function CommissionEngineDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const {
    commissions,
    rules,
    auditTrail,
    salesReps,
    createCommissionRule,
    updateCommissionRule,
    deleteCommissionRule,
    duplicateCommissionRule,
    getAuditTrailByDealId,
    addAuditEntry,
    updateAuditEntryNotes,
    generateCommissionReport
  } = useCommissionManagement()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showRuleForm, setShowRuleForm] = useState(false)
  const [selectedRule, setSelectedRule] = useState<CommissionRule | null>(null)
  const [selectedDealId, setSelectedDealId] = useState<string>('deal-001') // For demo purposes

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
        await updateCommissionRule(selectedRule.id, ruleData)
        toast({
          title: 'Success',
          description: 'Commission rule updated successfully',
        })
      } else {
        await createCommissionRule(ruleData)
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
        await deleteCommissionRule(ruleId)
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
      await duplicateCommissionRule(rule.id)
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
    
    // Add the calculation to the audit trail
    await addAuditEntry({
      dealId: selectedDealId,
      userId: user?.id || '',
      userName: user?.name || '',
      action: 'manual_note',
      description: `Calculated commission of ${formatCurrency(calculationData.commission)} using ${calculationData.ruleName}`,
      timestamp: new Date()
    });
    
    toast({
      title: 'Success',
      description: 'Calculation saved successfully',
    })
    
    return true;
  }

  // Get audit trail for the selected deal
  const dealAuditTrail = getAuditTrailByDealId(selectedDealId)

  // Calculate stats for dashboard
  const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0)
  const pendingCommission = commissions
    .filter(c => c.status === CommissionStatus.PENDING || c.status === CommissionStatus.APPROVED)
    .reduce((sum, c) => sum + c.amount, 0)
  const paidCommission = commissions
    .filter(c => c.status === CommissionStatus.PAID)
    .reduce((sum, c) => sum + c.amount, 0)

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
            <div className="text-2xl font-bold text-purple-900">{rules.length}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Active rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
          <TabsTrigger value="user-reports">User Reports</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <CommissionCalculator 
              rules={rules}
              onSaveCalculation={handleSaveCalculation}
            />
            
            <AuditTrailCard
              entries={dealAuditTrail}
              dealId={selectedDealId}
              currentUserId={user?.id || ''}
              currentUserName={user?.name || ''}
              onAddEntry={addAuditEntry}
              onUpdateEntry={updateAuditEntryNotes}
            />
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <CommissionRulesList
            rules={rules}
            onCreateRule={handleCreateRule}
            onEditRule={handleEditRule}
            onDeleteRule={handleDeleteRule}
            onDuplicateRule={handleDuplicateRule}
          />
        </TabsContent>

        <TabsContent value="user-reports">
          <UserCommissionReport 
            salesReps={salesReps}
            generateCommissionReport={generateCommissionReport}
          />
        </TabsContent>

        <TabsContent value="reports">
          <CommissionReportView
            commissions={commissions}
            salesReps={salesReps}
            onExportCSV={handleExportCSV}
            onPrintReport={handlePrintReport}
          />
        </TabsContent>

        <TabsContent value="calculator">
          <div className="max-w-2xl mx-auto">
            <CommissionCalculator 
              rules={rules}
              onSaveCalculation={handleSaveCalculation}
            />
          </div>
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
    <AuthProvider>
      <CommissionEngineDashboard />
    </AuthProvider>
  )
}