import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, TrendingUp, TrendingDown, Target, BarChart3, X, Save } from 'lucide-react'
import { Deal, WinLossReport } from '../types'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface WinLossAnalysisProps {
  deals: Deal[]
  winLossReports: WinLossReport[]
  onCreateReport: (dealId: string, outcome: 'won' | 'lost', reportData: Partial<WinLossReport>) => void
}

const winReasons = [
  'Best Price',
  'Superior Product Features',
  'Excellent Service',
  'Strong Relationship',
  'Competitive Financing',
  'Quick Delivery',
  'Brand Reputation',
  'Referral/Recommendation'
]

const lossReasons = [
  'Price Too High',
  'Lost to Competitor',
  'Budget Constraints',
  'Timing Issues',
  'Product Limitations',
  'Service Concerns',
  'Decision Delayed',
  'Requirements Changed'
]

const competitors = [
  'Camping World',
  'Lazydays',
  'General RV',
  'PPL Motor Homes',
  'Local Dealer',
  'Private Seller',
  'Other'
]

export function WinLossAnalysis({ deals, winLossReports, onCreateReport }: WinLossAnalysisProps) {
  const [showReportForm, setShowReportForm] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [reportData, setReportData] = useState({
    outcome: 'won' as 'won' | 'lost',
    primaryReason: '',
    secondaryReasons: [] as string[],
    competitorWon: '',
    feedback: '',
    lessonsLearned: [] as string[],
    actionItems: [] as string[]
  })

  const closedDeals = deals.filter(d => d.status === 'won' || d.status === 'lost')
  const wonDeals = deals.filter(d => d.status === 'won')
  const lostDeals = deals.filter(d => d.status === 'lost')

  const winRate = closedDeals.length > 0 ? (wonDeals.length / closedDeals.length) * 100 : 0
  const avgWonDealSize = wonDeals.length > 0 ? wonDeals.reduce((sum, d) => sum + d.value, 0) / wonDeals.length : 0
  const avgLostDealSize = lostDeals.length > 0 ? lostDeals.reduce((sum, d) => sum + d.value, 0) / lostDeals.length : 0

  const handleCreateReport = (deal: Deal) => {
    setSelectedDeal(deal)
    setReportData({
      ...reportData,
      outcome: deal.status === 'won' ? 'won' : 'lost'
    })
    setShowReportForm(true)
  }

  const handleSaveReport = () => {
    if (!selectedDeal) return

    onCreateReport(selectedDeal.id, reportData.outcome, reportData)
    setShowReportForm(false)
    setSelectedDeal(null)
    setReportData({
      outcome: 'won',
      primaryReason: '',
      secondaryReasons: [],
      competitorWon: '',
      feedback: '',
      lessonsLearned: [],
      actionItems: []
    })
  }

  const addToList = (list: string[], item: string, setter: (list: string[]) => void) => {
    if (item.trim() && !list.includes(item.trim())) {
      setter([...list, item.trim()])
    }
  }

  const removeFromList = (list: string[], index: number, setter: (list: string[]) => void) => {
    setter(list.filter((_, i) => i !== index))
  }

  const getReasonAnalysis = (outcome: 'won' | 'lost') => {
    const reports = winLossReports.filter(r => r.outcome === outcome)
    const reasonCounts: Record<string, number> = {}
    
    reports.forEach(report => {
      reasonCounts[report.primaryReason] = (reasonCounts[report.primaryReason] || 0) + 1
    })

    return Object.entries(reasonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: reports.length > 0 ? (count / reports.length) * 100 : 0
      }))
  }

  const winReasonAnalysis = getReasonAnalysis('won')
  const lossReasonAnalysis = getReasonAnalysis('lost')

  return (
    <div className="space-y-6">
      {/* Win/Loss Report Form Modal */}
      {showReportForm && selectedDeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Win/Loss Report</CardTitle>
                  <CardDescription>
                    {selectedDeal.name} - {formatCurrency(selectedDeal.value)}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowReportForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Outcome</Label>
                <Select value={reportData.outcome} onValueChange={(value: 'won' | 'lost') => 
                  setReportData(prev => ({ ...prev, outcome: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="won">Won</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Primary Reason</Label>
                <Select value={reportData.primaryReason} onValueChange={(value) => 
                  setReportData(prev => ({ ...prev, primaryReason: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {(reportData.outcome === 'won' ? winReasons : lossReasons).map(reason => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reportData.outcome === 'lost' && (
                <div>
                  <Label>Competitor Won</Label>
                  <Select value={reportData.competitorWon} onValueChange={(value) => 
                    setReportData(prev => ({ ...prev, competitorWon: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select competitor" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitors.map(competitor => (
                        <SelectItem key={competitor} value={competitor}>{competitor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Customer Feedback</Label>
                <Textarea
                  value={reportData.feedback}
                  onChange={(e) => setReportData(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="What did the customer say about their decision?"
                  rows={3}
                />
              </div>

              <div>
                <Label>Lessons Learned</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a lesson learned"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.currentTarget
                          addToList(reportData.lessonsLearned, input.value, (list) => 
                            setReportData(prev => ({ ...prev, lessonsLearned: list })))
                          input.value = ''
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addToList(reportData.lessonsLearned, input.value, (list) => 
                        setReportData(prev => ({ ...prev, lessonsLearned: list })))
                      input.value = ''
                    }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reportData.lessonsLearned.map((lesson, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {lesson}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromList(reportData.lessonsLearned, index, (list) => 
                            setReportData(prev => ({ ...prev, lessonsLearned: list })))}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Action Items</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add an action item"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const input = e.currentTarget
                          addToList(reportData.actionItems, input.value, (list) => 
                            setReportData(prev => ({ ...prev, actionItems: list })))
                          input.value = ''
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addToList(reportData.actionItems, input.value, (list) => 
                        setReportData(prev => ({ ...prev, actionItems: list })))
                      input.value = ''
                    }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reportData.actionItems.map((item, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeFromList(reportData.actionItems, index, (list) => 
                            setReportData(prev => ({ ...prev, actionItems: list })))}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setShowReportForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveReport}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Win/Loss Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              {closedDeals.length} closed deals
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Won Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{wonDeals.length}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatCurrency(avgWonDealSize)} avg
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Lost Deals</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{lostDeals.length}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              {formatCurrency(avgLostDealSize)} avg
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{winLossReports.length}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Completed reports
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Win/Loss Analysis */}
      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="closed-deals">Closed Deals</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Win Reasons
                </CardTitle>
                <CardDescription>
                  Top reasons for winning deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {winReasonAnalysis.length > 0 ? (
                    winReasonAnalysis.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.reason}</span>
                          <span className="text-sm text-green-600">{item.percentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No win reports available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                  Loss Reasons
                </CardTitle>
                <CardDescription>
                  Top reasons for losing deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lossReasonAnalysis.length > 0 ? (
                    lossReasonAnalysis.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.reason}</span>
                          <span className="text-sm text-red-600">{item.percentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No loss reports available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Lessons Learned</CardTitle>
              <CardDescription>
                Key insights from win/loss reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              {winLossReports.length > 0 ? (
                <div className="space-y-4">
                  {winLossReports.slice(0, 5).map((report, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-2 mb-2">
                        {report.outcome === 'won' ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">WON</Badge>
                        ) : (
                          <Badge className="bg-red-50 text-red-700 border-red-200">LOST</Badge>
                        )}
                        <span className="text-sm font-medium">{report.primaryReason}</span>
                      </div>
                      <div className="space-y-2">
                        {report.lessonsLearned.map((lesson, i) => (
                          <p key={i} className="text-sm text-muted-foreground">• {lesson}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No lessons learned available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed-deals" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recently Closed Deals</CardTitle>
              <CardDescription>
                Deals that have been won or lost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {closedDeals.length > 0 ? (
                  closedDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{deal.name}</h3>
                          <Badge className={deal.status === 'won' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                            {deal.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Customer:</span> {deal.customerName}
                          </div>
                          <div>
                            <span className="font-medium">Value:</span> {formatCurrency(deal.value)}
                          </div>
                          <div>
                            <span className="font-medium">Closed:</span> {deal.actualCloseDate ? formatDate(deal.actualCloseDate) : 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Rep:</span> {deal.assignedTo}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCreateReport(deal)}
                        className="shadow-sm"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No closed deals available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Win/Loss Reports</CardTitle>
              <CardDescription>
                Detailed reports on won and lost deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {winLossReports.length > 0 ? (
                  winLossReports.map((report) => {
                    const deal = deals.find(d => d.id === report.dealId)
                    return (
                      <div key={report.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge className={report.outcome === 'won' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                              {report.outcome.toUpperCase()}
                            </Badge>
                            <h3 className="font-semibold">{deal?.name || 'Unknown Deal'}</h3>
                          </div>
                          <span className="text-sm text-muted-foreground">{formatDate(report.reportedAt)}</span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Reasons</h4>
                            <div className="space-y-1">
                              <p className="text-sm"><span className="font-medium">Primary:</span> {report.primaryReason}</p>
                              {report.secondaryReasons.length > 0 && (
                                <p className="text-sm"><span className="font-medium">Secondary:</span> {report.secondaryReasons.join(', ')}</p>
                              )}
                              {report.competitorWon && (
                                <p className="text-sm"><span className="font-medium">Competitor:</span> {report.competitorWon}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Feedback</h4>
                            <p className="text-sm text-muted-foreground">{report.feedback}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium mb-2">Lessons & Action Items</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Lessons Learned:</h5>
                              <ul className="text-sm space-y-1">
                                {report.lessonsLearned.map((lesson, index) => (
                                  <li key={index}>• {lesson}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-xs font-medium text-muted-foreground mb-1">Action Items:</h5>
                              <ul className="text-sm space-y-1">
                                {report.actionItems.map((item, index) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No win/loss reports available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}