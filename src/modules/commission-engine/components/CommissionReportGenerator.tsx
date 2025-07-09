import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { BarChart3, Download, FileText, Filter, Calendar, User } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { CommissionReportFilters, CommissionReportSummary } from '../types'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import Papa from 'papaparse'

interface CommissionReportGeneratorProps {
  salesReps: any[] // Using existing sales rep data
  onGenerateReport: (filters: CommissionReportFilters) => { commissions: Commission[], summary: CommissionReportSummary }
  onExportCSV: (commissions: Commission[]) => any[][]
}

export function CommissionReportGenerator({
  salesReps,
  onGenerateReport,
  onExportCSV
}: CommissionReportGeneratorProps) {
  const { toast } = useToast()
  const [filters, setFilters] = useState<CommissionReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    salesPersonId: '',
    status: '',
    type: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [report, setReport] = useState<{ commissions: Commission[], summary: CommissionReportSummary } | null>(null)
  const [groupBy, setGroupBy] = useState<'none' | 'salesPerson' | 'status' | 'type'>('none')

  const handleGenerateReport = () => {
    try {
      const result = onGenerateReport(filters)
      setReport(result)
      
      toast({
        title: 'Report Generated',
        description: `Generated report with ${result.commissions.length} commissions`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive'
      })
    }
  }

  const handleExportCSV = () => {
    if (!report) return
    
    try {
      const csvData = onExportCSV(report.commissions)
      
      // Convert to CSV
      const csv = Papa.unparse(csvData)
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `commission_report_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: 'Export Successful',
        description: 'Commission report exported to CSV',
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export report to CSV',
        variant: 'destructive'
      })
    }
  }

  const groupCommissions = (commissions: Commission[]) => {
    if (groupBy === 'none') return { 'All Commissions': commissions }
    
    const grouped: Record<string, Commission[]> = {}
    
    commissions.forEach(commission => {
      let key = ''
      
      switch (groupBy) {
        case 'salesPerson':
          key = commission.salesPersonId
          break
        case 'status':
          key = commission.status
          break
        case 'type':
          key = commission.type
          break
      }
      
      if (!grouped[key]) {
        grouped[key] = []
      }
      
      grouped[key].push(commission)
    })
    
    return grouped
  }

  const getGroupTitle = (key: string) => {
    switch (groupBy) {
      case 'salesPerson':
        const rep = salesReps.find(r => r.id === key)
        return rep ? rep.name : key
      case 'status':
        return key.charAt(0).toUpperCase() + key.slice(1)
      case 'type':
        return key.charAt(0).toUpperCase() + key.slice(1)
      default:
        return key
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case CommissionStatus.PENDING:
        return 'Pending'
      case CommissionStatus.APPROVED:
        return 'Approved'
      case CommissionStatus.PAID:
        return 'Paid'
      case CommissionStatus.CANCELLED:
        return 'Cancelled'
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case CommissionType.FLAT:
        return 'Flat'
      case CommissionType.PERCENTAGE:
        return 'Percentage'
      case CommissionType.TIERED:
        return 'Tiered'
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Commission Report Generator
              </CardTitle>
              <CardDescription>
                Generate detailed commission reports with custom filters
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="shadow-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showFilters && (
            <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      startDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      endDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="salesPersonId">Sales Rep</Label>
                  <Select 
                    value={filters.salesPersonId || ''} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, salesPersonId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Sales Reps" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sales Reps</SelectItem>
                      {salesReps.map(rep => (
                        <SelectItem key={rep.id} value={rep.id}>
                          {rep.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={filters.status || ''} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value={CommissionStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={CommissionStatus.APPROVED}>Approved</SelectItem>
                      <SelectItem value={CommissionStatus.PAID}>Paid</SelectItem>
                      <SelectItem value={CommissionStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Commission Type</Label>
                  <Select 
                    value={filters.type || ''} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value={CommissionType.FLAT}>Flat</SelectItem>
                      <SelectItem value={CommissionType.PERCENTAGE}>Percentage</SelectItem>
                      <SelectItem value={CommissionType.TIERED}>Tiered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleGenerateReport}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          )}

          {!showFilters && (
            <div className="flex justify-end mb-6">
              <Button onClick={handleGenerateReport}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          )}

          {report && (
            <div className="space-y-6">
              {/* Report Summary */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-700 mb-1">Total Commissions</div>
                      <div className="text-2xl font-bold text-blue-900">{report.summary.totalCommissions}</div>
                      <div className="text-sm text-blue-700 mt-1">{formatCurrency(report.summary.totalAmount)}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-yellow-700 mb-1">Pending</div>
                      <div className="text-2xl font-bold text-yellow-900">{formatCurrency(report.summary.pendingAmount)}</div>
                      <div className="text-sm text-yellow-700 mt-1">Awaiting approval</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-700 mb-1">Paid</div>
                      <div className="text-2xl font-bold text-green-900">{formatCurrency(report.summary.paidAmount)}</div>
                      <div className="text-sm text-green-700 mt-1">Commissions paid</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm bg-purple-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-sm font-medium text-purple-700 mb-1">Approved</div>
                      <div className="text-2xl font-bold text-purple-900">{formatCurrency(report.summary.approvedAmount)}</div>
                      <div className="text-sm text-purple-700 mt-1">Ready for payment</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Report Options */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="groupBy" className="whitespace-nowrap">Group By:</Label>
                  <Select 
                    value={groupBy} 
                    onValueChange={(value: 'none' | 'salesPerson' | 'status' | 'type') => setGroupBy(value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Grouping</SelectItem>
                      <SelectItem value="salesPerson">Sales Rep</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="type">Commission Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" onClick={handleExportCSV} disabled={!report}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>

              {/* Report Data */}
              <div className="space-y-6">
                {Object.entries(groupCommissions(report.commissions)).map(([key, commissions]) => (
                  <div key={key} className="space-y-2">
                    <h3 className="text-lg font-semibold flex items-center">
                      {groupBy === 'salesPerson' && <User className="h-4 w-4 mr-2 text-blue-500" />}
                      {groupBy === 'status' && <FileText className="h-4 w-4 mr-2 text-yellow-500" />}
                      {groupBy === 'type' && <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />}
                      {getGroupTitle(key)}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({commissions.length} commissions, {formatCurrency(commissions.reduce((sum, c) => sum + c.amount, 0))})
                      </span>
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="p-2 text-left font-medium text-muted-foreground">Sales Rep</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Deal</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Type</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Amount</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Status</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {commissions.map((commission) => {
                            const salesRep = salesReps.find(r => r.id === commission.salesPersonId)
                            
                            return (
                              <tr key={commission.id} className="border-b hover:bg-muted/10">
                                <td className="p-2">{salesRep?.name || commission.salesPersonId}</td>
                                <td className="p-2">{commission.dealId}</td>
                                <td className="p-2">{getTypeLabel(commission.type)}</td>
                                <td className="p-2 font-medium">{formatCurrency(commission.amount)}</td>
                                <td className="p-2">{getStatusLabel(commission.status)}</td>
                                <td className="p-2">{new Date(commission.createdAt).toLocaleDateString()}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!report && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No report generated yet</p>
              <p className="text-sm">Use the filters above to generate a commission report</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}