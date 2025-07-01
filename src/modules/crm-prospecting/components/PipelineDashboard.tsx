import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Users, DollarSign, Target, Calendar, Phone, Mail, Filter } from 'lucide-react'
import { Lead, LeadStatus, PipelineStage, PipelineMetrics, SalesRepMetrics } from '../types'
import { useLeadManagement } from '../hooks/useLeadManagement'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const pipelineStages: PipelineStage[] = [
  { id: '1', name: 'New', order: 1, probability: 10, isActive: true, color: 'bg-blue-500' },
  { id: '2', name: 'Contacted', order: 2, probability: 25, isActive: true, color: 'bg-yellow-500' },
  { id: '3', name: 'Qualified', order: 3, probability: 50, isActive: true, color: 'bg-orange-500' },
  { id: '4', name: 'Proposal', order: 4, probability: 75, isActive: true, color: 'bg-purple-500' },
  { id: '5', name: 'Negotiation', order: 5, probability: 90, isActive: true, color: 'bg-indigo-500' },
  { id: '6', name: 'Closed Won', order: 6, probability: 100, isActive: true, color: 'bg-green-500' },
  { id: '7', name: 'Closed Lost', order: 7, probability: 0, isActive: true, color: 'bg-red-500' }
]

export function PipelineDashboard() {
  const { leads, salesReps, activities } = useLeadManagement()
  const [selectedRep, setSelectedRep] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<string>('30')

  // Calculate pipeline metrics
  const pipelineMetrics = useMemo(() => {
    const filteredLeads = selectedRep === 'all' 
      ? leads 
      : leads.filter(lead => lead.assignedTo === selectedRep)

    const metrics: PipelineMetrics[] = pipelineStages.map(stage => {
      const stageLeads = filteredLeads.filter(lead => {
        switch (stage.name.toLowerCase()) {
          case 'new': return lead.status === LeadStatus.NEW
          case 'contacted': return lead.status === LeadStatus.CONTACTED
          case 'qualified': return lead.status === LeadStatus.QUALIFIED
          case 'proposal': return lead.status === LeadStatus.PROPOSAL
          case 'negotiation': return lead.status === LeadStatus.NEGOTIATION
          case 'closed won': return lead.status === LeadStatus.CLOSED_WON
          case 'closed lost': return lead.status === LeadStatus.CLOSED_LOST
          default: return false
        }
      })

      const value = stageLeads.reduce((sum, lead) => {
        const estimatedValue = parseFloat(lead.customFields?.budget?.replace(/[^0-9]/g, '') || '0')
        return sum + (estimatedValue * stage.probability / 100)
      }, 0)

      return {
        stage: stage.name,
        count: stageLeads.length,
        value,
        averageTime: 7, // Mock data - would calculate from actual stage transitions
        conversionRate: stage.probability
      }
    })

    return metrics
  }, [leads, selectedRep])

  // Calculate sales rep metrics
  const salesRepMetrics = useMemo(() => {
    const metrics: SalesRepMetrics[] = salesReps.map(rep => {
      const repLeads = leads.filter(lead => lead.assignedTo === rep.id)
      const repActivities = activities.filter(activity => activity.userId === rep.id)
      
      const recentActivities = repActivities.filter(activity => {
        const activityDate = new Date(activity.createdAt)
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - 7)
        return activityDate >= cutoffDate
      })

      const qualifiedLeads = repLeads.filter(lead => 
        [LeadStatus.QUALIFIED, LeadStatus.PROPOSAL, LeadStatus.NEGOTIATION, LeadStatus.CLOSED_WON].includes(lead.status)
      )

      const closedWon = repLeads.filter(lead => lead.status === LeadStatus.CLOSED_WON)
      const closedLost = repLeads.filter(lead => lead.status === LeadStatus.CLOSED_LOST)

      const pipelineValue = repLeads.reduce((sum, lead) => {
        if (lead.status === LeadStatus.CLOSED_WON || lead.status === LeadStatus.CLOSED_LOST) return sum
        const estimatedValue = parseFloat(lead.customFields?.budget?.replace(/[^0-9]/g, '') || '0')
        const stage = pipelineStages.find(s => s.name.toLowerCase() === lead.status.replace('_', ' '))
        return sum + (estimatedValue * (stage?.probability || 0) / 100)
      }, 0)

      const totalClosed = closedWon.length + closedLost.length
      const conversionRate = totalClosed > 0 ? (closedWon.length / totalClosed) * 100 : 0

      const averageDealSize = closedWon.length > 0 
        ? closedWon.reduce((sum, lead) => {
            const value = parseFloat(lead.customFields?.budget?.replace(/[^0-9]/g, '') || '0')
            return sum + value
          }, 0) / closedWon.length
        : 0

      return {
        repId: rep.id,
        repName: rep.name,
        totalLeads: repLeads.length,
        qualifiedLeads: qualifiedLeads.length,
        closedWon: closedWon.length,
        closedLost: closedLost.length,
        pipelineValue,
        conversionRate,
        averageDealSize,
        activitiesThisWeek: recentActivities.length
      }
    })

    return metrics
  }, [leads, salesReps, activities])

  const totalPipelineValue = pipelineMetrics.reduce((sum, metric) => sum + metric.value, 0)
  const totalLeads = pipelineMetrics.reduce((sum, metric) => sum + metric.count, 0)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedRep} onValueChange={setSelectedRep}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select sales rep" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sales Reps</SelectItem>
            {salesReps.map(rep => (
              <SelectItem key={rep.id} value={rep.id}>
                {rep.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="365">1 year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {totalLeads} active leads
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Qualified Leads</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {pipelineMetrics.find(m => m.stage === 'Qualified')?.count || 0}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Ready for proposal
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {selectedRep === 'all' 
                ? Math.round(salesRepMetrics.reduce((sum, rep) => sum + rep.conversionRate, 0) / salesRepMetrics.length || 0)
                : Math.round(salesRepMetrics.find(rep => rep.repId === selectedRep)?.conversionRate || 0)
              }%
            </div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Win rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(
                selectedRep === 'all'
                  ? salesRepMetrics.reduce((sum, rep) => sum + rep.averageDealSize, 0) / salesRepMetrics.length || 0
                  : salesRepMetrics.find(rep => rep.repId === selectedRep)?.averageDealSize || 0
              )}
            </div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <DollarSign className="h-3 w-3 mr-1" />
              Per closed deal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>
            Lead distribution across pipeline stages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-7">
            {pipelineMetrics.map((metric, index) => {
              const stage = pipelineStages[index]
              return (
                <div key={stage.id} className="text-center">
                  <div className={cn(
                    "w-full h-24 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-2",
                    stage.color
                  )}>
                    {metric.count}
                  </div>
                  <h3 className="font-semibold text-sm">{stage.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(metric.value)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage.probability}% probability
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sales Rep Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Rep Performance</CardTitle>
          <CardDescription>
            Individual performance metrics and activity levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesRepMetrics.map(rep => (
              <div key={rep.repId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{rep.repName}</h3>
                    <Badge variant="secondary">
                      {rep.totalLeads} leads
                    </Badge>
                    <Badge className="bg-green-50 text-green-700 border-green-200">
                      {rep.conversionRate.toFixed(1)}% conversion
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Pipeline Value:</span>
                      <div className="font-bold text-primary">{formatCurrency(rep.pipelineValue)}</div>
                    </div>
                    <div>
                      <span className="font-medium">Qualified:</span>
                      <div className="font-bold text-green-600">{rep.qualifiedLeads}</div>
                    </div>
                    <div>
                      <span className="font-medium">Closed Won:</span>
                      <div className="font-bold text-blue-600">{rep.closedWon}</div>
                    </div>
                    <div>
                      <span className="font-medium">Activities (7d):</span>
                      <div className="font-bold text-purple-600">{rep.activitiesThisWeek}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-3 w-3 mr-1" />
                    View Leads
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    Activities
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}