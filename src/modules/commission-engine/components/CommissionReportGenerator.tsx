import React, { useState, useEffect } from 'react'
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
  const [showFilters, setShowFilters] = useState(false)
  const [report, setReport] = useState<{ commissions: Commission[], summary: CommissionReportSummary } | null>(null)
  const [groupBy, setGroupBy] = useState<'none' | 'salesPerson' | 'status' | 'type'>('none')

  // Date range states
  const [startDate, setStartDate] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [dateRangePreset, setDateRangePreset] = useState<string>('this_month')

  useEffect(() => {
    const today = new Date()
    let newStartDate = new Date()
    let newEndDate = new Date()

    switch (dateRangePreset) {
      case 'last_week':
        newStartDate.setDate(today.getDate() - today.getDay() - 7)
        newEndDate.setDate(today.getDate() - today.getDay() - 1)
        break
      case 'last_month':
        newStartDate.setMonth(today.getMonth() - 1)
        newStartDate.setDate(1)
        newEndDate.setDate(0) // Last day of previous month
        break
      case 'last_year':
        newStartDate.setFullYear(today.getFullYear() - 1)
        newStartDate.setMonth(0)
        newStartDate.setDate(1)
        newEndDate.setFullYear(today.getFullYear() - 1)
        newEndDate.setMonth(11)
        newEndDate.setDate(31)
        break
      case 'ytd':
        newStartDate.setMonth(0)
        newStartDate.setDate(1)
        newEndDate = today
        break
      case 'this_month':
        newStartDate.setDate(1)
        newEndDate = today
        break
      case 'custom':
        // Do nothing, use existing startDate and endDate
        return
      default:
        // Default to this month
        newStartDate.setDate(1)
        newEndDate = today
        break
    }

    setStartDate(newStartDate.toISOString().split('T')[0])
    setEndDate(newEndDate.toISOString().split('T')[0])
  }, [dateRangePreset])

  const handleGenerateReport = () => {
    try {
      const filters: CommissionReportFilters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        salesPersonId: (document.getElementById('salesPersonId') as HTMLSelectElement)?.value || undefined,
        status: (document.getElementById('status') as HTMLSelectElement)?.value || undefined,
        type: (document.getElementById('type') as HTMLSelectElement)?.value || undefined,
      }
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
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="dateRangePreset">Date Range Preset</Label>
                  <Select
                    value={dateRangePreset}
                    onValueChange={setDateRangePreset}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="last_week">Last Week</SelectItem>
                      <SelectItem value="last_month">Last Month</SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="this_month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      setDateRangePreset('custom')
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value)
                      setDateRangePreset('custom')
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="salesPersonId">Sales Rep</Label>
                  <Select 
                    value={''} // This needs to be managed by a state variable if you want to filter
                    onValueChange={(value) => { /* Update filter state here */ }}
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
                    value={''} // This needs to be managed by a state variable if you want to filter
                    onValueChange={(value) => { /* Update filter state here */ }}
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
                    value={''} // This needs to be managed by a state variable if you want to filter
                    onValueChange={(value) => { /* Update filter state here */ }}
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
                  <CardContent className="pt
