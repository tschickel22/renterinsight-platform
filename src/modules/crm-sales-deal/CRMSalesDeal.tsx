import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Target, Plus, Search, Filter, DollarSign, TrendingUp, Users, MapPin, Settings, BarChart3 } from 'lucide-react'
import { Deal, DealStage, DealStatus, Territory, ApprovalWorkflow, WinLossReport } from './types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useDealManagement } from './hooks/useDealManagement.ts'
import { DealPipeline } from './components/DealPipeline'
import { DealMetrics } from './components/DealMetrics'
import { WinLossAnalysis } from './components/WinLossAnalysis'
import { DealDetail } from './components/DealDetail'
import { TerritoryManagement } from './components/TerritoryManagement'
import { ApprovalWorkflows } from './components/ApprovalWorkflows'
import { DealForm } from './components/DealForm'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'

function DealsList() {
  const {
    deals,
    territories,
    approvalWorkflows,
    winLossReports,
    stageHistory,
    createDeal,
    updateDealStage,
    assignTerritory,
    createApprovalWorkflow,
    createWinLossReport,
    getDealMetrics
  } = useDealManagement()

  const { leads, salesReps } = useLeadManagement()
  const { vehicles } = useInventoryManagement()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [repFilter, setRepFilter] = useState<string>('all')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [showDealForm, setShowDealForm] = useState(false)
  const [activeTab, setActiveTab] = useState('pipeline')
  const [showDealDetail, setShowDealDetail] = useState(false)
  const { toast } = useToast()

  const getStatusColor = (status: DealStatus) => {
    switch (status) {
      case DealStatus.ACTIVE:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case DealStatus.WON:
        return 'bg-green-50 text-green-700 border-green-200'
      case DealStatus.LOST:
        return 'bg-red-50 text-red-700 border-red-200'
      case DealStatus.ON_HOLD:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case DealStatus.CANCELLED:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStage = stageFilter === 'all' || deal.stage === stageFilter
    const matchesRep = repFilter === 'all' || deal.assignedTo === repFilter

    return matchesSearch && matchesStage && matchesRep
  })

  const handleDealStageChange = async (dealId: string, newStage: DealStage) => {
    try {
      await updateDealStage(dealId, newStage)

      // Show success toast
      const deal = deals.find(d => d.id === dealId)
      if (deal) {
        toast({
          title: 'Deal Stage Updated',
          description: `${deal.name} moved to ${newStage.replace('_', ' ').toLowerCase()}`,
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update deal stage',
        variant: 'destructive'
      })
    }
  }

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowDealDetail(true)
  }

  const handleCreateDeal = () => {
    setSelectedDeal(null)
    setShowDealForm(true)
  }

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal)
    setShowDealForm(true)
  }

  const handleSaveDeal = async (dealData: Partial<Deal>) => {
    if (selectedDeal) {
      // Update existing deal
      await updateDealStage(selectedDeal.id, dealData.stage || selectedDeal.stage)
    } else {
      // Create new deal
      await createDeal(dealData)
    }
    setShowDealForm(false)
    setSelectedDeal(null)
  }

  const handleCreateApproval = async (dealId: string, workflowType: string) => {
    await createApprovalWorkflow(dealId, workflowType)
  }

  const handleCreateWinLossReport = async (dealId: string, outcome: 'won' | 'lost', reportData: Partial<WinLossReport>) => {
    await createWinLossReport(dealId, outcome, reportData)
  }

  const metrics = getDealMetrics()

  // Mock products for the form
  const mockProducts = vehicles.map(vehicle => ({
    id: vehicle.id,
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    price: vehicle.price,
    category: 'vehicle'
  })).concat([
    {
      id: 'prod-001',
      name: 'Extended Warranty Package',
      price: 3500,
      category: 'warranty'
    },
    {
      id: 'prod-002',
      name: 'Premium Interior Upgrade',
      price: 2200,
      category: 'upgrade'
    },
    {
      id: 'prod-003',
      name: 'Solar Panel Package',
      price: 3500,
      category: 'accessory'
    }
  ])

  return (
    <div className="space-y-8">
      {/* Deal Detail Modal */}
      {showDealDetail && selectedDeal && (
        <DealDetail
          deal={selectedDeal}
          onClose={() => setShowDealDetail(false)}
          onEdit={handleEditDeal}
        />
      )}

      {/* Deal Form Modal */}
      {showDealForm && (
        <DealForm
          deal={selectedDeal || undefined}
          customers={leads}
          salesReps={salesReps}
          territories={territories}
          products={mockProducts}
          onSave={handleSaveDeal}
          onCancel={() => {
            setShowDealForm(false)
            setSelectedDeal(null)
          }}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Sales Deal Management</h1>
            <p className="ri-page-description">
              Track deals through the sales pipeline with approvals and territory management
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateDeal}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(metrics.totalValue)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.totalDeals} active deals
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{metrics.winRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.wonDeals} won deals
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(metrics.averageDealSize)}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.averageSalesCycle.toFixed(0)} day cycle
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Territories</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{territories.length}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Users className="h-3 w-3 mr-1" />
              Active territories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="territories">Territories</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <DealPipeline 
            deals={deals} 
            onDealStageChange={handleDealStageChange} 
            onDealClick={handleDealClick}
          />
        </TabsContent>

        <TabsContent value="deals" className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="ri-search-bar">
              <Search className="ri-search-icon" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ri-search-input shadow-sm"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value={DealStage.PROSPECTING}>Prospecting</SelectItem>
                <SelectItem value={DealStage.QUALIFICATION}>Qualification</SelectItem>
                <SelectItem value={DealStage.NEEDS_ANALYSIS}>Needs Analysis</SelectItem>
                <SelectItem value={DealStage.PROPOSAL}>Proposal</SelectItem>
                <SelectItem value={DealStage.NEGOTIATION}>Negotiation</SelectItem>
                <SelectItem value={DealStage.CLOSED_WON}>Closed Won</SelectItem>
                <SelectItem value={DealStage.CLOSED_LOST}>Closed Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={repFilter} onValueChange={setRepFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sales Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {salesReps.map(rep => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Deals Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Deals ({filteredDeals.length})</CardTitle>
              <CardDescription>
                Manage your sales pipeline and deal progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeals.map((deal) => (
                  <div key={deal.id} className="ri-table-row cursor-pointer" onClick={() => handleEditDeal(deal)}>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-foreground">{deal.name}</h3>
                          <Badge className={cn("ri-badge-status", getStatusColor(deal.status))}>
                            {deal.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {deal.stage.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-2 text-blue-500" />
                            {deal.customerName}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-2 text-green-500" />
                            {formatCurrency(deal.value)}
                          </span>
                          <span className="flex items-center">
                            <Target className="h-3 w-3 mr-2 text-purple-500" />
                            {deal.probability}% probability
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2 text-orange-500" />
                            {territories.find(t => t.id === deal.territoryId)?.name || 'No Territory'}
                          </span>
                        </div>
                        {deal.notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded-md">
                            {deal.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="ri-action-buttons">
                      <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                        e.stopPropagation()
                        handleDealClick(deal)
                      }}>
                        View
                      </Button>
                      {deal.requiresApproval && (
                        <Button variant="outline" size="sm" className="shadow-sm" onClick={(e) => {
                          e.stopPropagation()
                          handleCreateApproval(deal.id, 'deal_value')
                        }}>
                          Request Approval
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {filteredDeals.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No deals found</p>
                    <p className="text-sm">Create your first deal to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="metrics">Deal Metrics</TabsTrigger>
              <TabsTrigger value="win-loss">Win/Loss Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              <DealMetrics metrics={metrics} />
            </TabsContent>

            <TabsContent value="win-loss">
              <WinLossAnalysis 
                deals={deals} 
                winLossReports={winLossReports}
                onCreateReport={handleCreateWinLossReport}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="territories" className="space-y-6">
          <TerritoryManagement 
            territories={territories}
            salesReps={salesReps}
            deals={deals}
            onCreateTerritory={() => {}}
            onUpdateTerritory={() => {}}
            onDeleteTerritory={() => {}}
          />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <ApprovalWorkflows 
            deals={deals}
            approvalWorkflows={approvalWorkflows}
            onApprove={() => {}}
            onReject={() => {}}
            onEscalate={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CRMSalesDeal() {
  return (
    <Routes>
      <Route path="/" element={<DealsList />} />
      <Route path="/*" element={<DealsList />} />
    </Routes>
  )
}