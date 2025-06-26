import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, Printer, Calendar, User, DollarSign, Filter } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '../types'
import { formatCurrency, formatDate } from '@/lib/utils' 
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

interface UserCommissionReportProps {
  salesReps: any[]
  generateCommissionReport: (salesRepId: string, startDate: Date, endDate: Date) => any
}

export function UserCommissionReport({ salesReps, generateCommissionReport }: UserCommissionReportProps) {
  const [selectedSalesRep, setSelectedSalesRep] = useState<string>('')
  const [dateRange, setDateRange] = useState<string>('this_month')
  const [report, setReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  // Calculate date range based on selection
  const getDateRange = (range: string): [Date, Date] => {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    
    switch (range) {
      case 'today':
        return [startOfDay, endOfDay]
      case 'this_week': {
        const startOfWeek = new Date(startOfDay)
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay()) // Sunday
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6) // Saturday
        endOfWeek.setHours(23, 59, 59)
        return [startOfWeek, endOfWeek]
      }
      case 'this_month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
        return [startOfMonth, endOfMonth]
      }
      case 'last_month': {
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
        return [startOfLastMonth, endOfLastMonth]
      }
      case 'this_quarter': {
        const quarter = Math.floor(now.getMonth() / 3)
        const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1)
        const endOfQuarter = new Date(now.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59)
        return [startOfQuarter, endOfQuarter]
      }
      case 'this_year': {
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
        return [startOfYear, endOfYear]
      }
      case 'all_time': {
        const startOfTime = new Date(2000, 0, 1)
        return [startOfTime, now]
      }
      default:
        return [startOfDay, endOfDay]
    }
  }

  // Generate report when parameters change
  useEffect(() => {
    if (selectedSalesRep) {
      generateReport()
    }
  }, [selectedSalesRep, dateRange])

  const generateReport = () => {
    if (!selectedSalesRep) {
      toast.error('Selection Required', {
        description: 'Please select a sales rep to generate a report'
      });
      return
    }

    setLoading(true)
    try {
      const [startDate, endDate] = getDateRange(dateRange)
      const reportData = generateCommissionReport(selectedSalesRep, startDate, endDate)
      setReport(reportData)
    } catch (error) {
      toast.error('Report Generation Failed', {
        description: 'There was an error generating the report'
      });
      console.error('Report generation error:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleExportCSV = () => {
    if (!report) return

    try {
      // Create CSV content
      const headers = ["Deal ID", "Type", "Amount", "Status", "Created Date", "Paid Date"]
      const csvContent = [
        headers.join(","),
        ...report.commissions.map((commission: Commission) => [
          commission.dealId,
          commission.type,
          commission.amount.toFixed(2),
          commission.status,
          new Date(commission.createdAt).toLocaleDateString(),
          commission.paidDate ? new Date(commission.paidDate).toLocaleDateString() : ''
        ].join(","))
      ].join("\n")
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `commission_report_${selectedSalesRep}_${dateRange}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Export Successful', {
        description: 'Commission report exported to CSV'
      });
    } catch (error) {
      toast.error('Export Failed', {
        description: 'There was an error exporting the report'
      });
    }
  }

  const handlePrintReport = () => {
    if (!report) return

    try {
      const doc = new jsPDF()
      
      // Add header
      doc.setFontSize(20)
      doc.text('Commission Report', 105, 15, { align: 'center' })
      
      doc.setFontSize(12)
      doc.text(`Sales Rep: ${report.salesPerson}`, 20, 30)
      doc.text(`Period: ${report.period}`, 20, 40)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 50)
      
      // Add summary
      doc.setFontSize(16)
      doc.text('Summary', 20, 65)
      
      doc.setFontSize(12)
      doc.text(`Total Commissions: ${formatCurrency(report.totalCommissions)}`, 20, 75)
      doc.text(`Paid Commissions: ${formatCurrency(report.paidCommissions)}`, 20, 85)
      doc.text(`Pending Commissions: ${formatCurrency(report.pendingCommissions)}`, 20, 95)
      doc.text(`Deal Count: ${report.dealCount}`, 20, 105)
      
      // Add commission details table
      doc.setFontSize(16)
      doc.text('Commission Details', 20, 125)
      
      // @ts-ignore
      doc.autoTable({
        startY: 130,
        head: [['Deal ID', 'Type', 'Amount', 'Status', 'Created Date', 'Paid Date']],
        body: report.commissions.map((commission: Commission) => [
          commission.dealId,
          commission.type,
          formatCurrency(commission.amount),
          commission.status,
          formatDate(commission.createdAt),
          commission.paidDate ? formatDate(commission.paidDate) : '-'
        ]),
      })
      
      // Save the PDF
      doc.save(`commission_report_${selectedSalesRep}_${dateRange}.pdf`)
      
      toast.success('Print Initiated', {
        description: 'Commission report PDF has been generated'
      });
    } catch (error) {
      toast.error('Print Failed', {
        description: 'There was an error generating the PDF'
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sales Rep Commission Report</h2>
          <p className="text-muted-foreground">
            Generate detailed commission reports by sales representative
          </p>
        </div>
      </div>

      {/* Report Parameters */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>
            Select a sales rep and date range to generate a report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Sales Representative</label>
              <Select value={selectedSalesRep} onValueChange={setSelectedSalesRep}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sales rep" />
                </SelectTrigger>
                <SelectContent>
                  {salesReps.map(rep => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={generateReport} 
                disabled={!selectedSalesRep || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {report && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Commissions</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{formatCurrency(report.totalCommissions)}</div>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <User className="h-3 w-3 mr-1" />
                  {report.salesPerson}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Paid Commissions</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{formatCurrency(report.paidCommissions)}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {report.period}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-900">Pending Commissions</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-900">{formatCurrency(report.pendingCommissions)}</div>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Awaiting payment
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Deal Count</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{report.dealCount}</div>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Total deals
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Commission Details */}
          <Card className="shadow-sm">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Commission Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of commissions for {report.salesPerson}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrintReport}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left font-medium text-muted-foreground">Deal ID</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Type</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Amount</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Status</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Created Date</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Paid Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.commissions.map((commission: Commission) => (
                      <tr key={commission.id} className="border-b hover:bg-muted/10">
                        <td className="p-2">{commission.dealId}</td>
                        <td className="p-2">
                          <Badge className={cn("ri-badge-status", getTypeColor(commission.type))}>
                            {commission.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-2 font-medium">{formatCurrency(commission.amount)}</td>
                        <td className="p-2">
                          <Badge className={cn("ri-badge-status", getStatusColor(commission.status))}>
                            {commission.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-2">{formatDate(commission.createdAt)}</td>
                        <td className="p-2">{commission.paidDate ? formatDate(commission.paidDate) : '-'}</td>
                      </tr>
                    ))}
                    {report.commissions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          No commission entries found for this period
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-muted/30">
                    <tr>
                      <td colSpan={2} className="p-2 text-right font-medium">Total:</td>
                      <td className="p-2 font-bold">{formatCurrency(report.totalCommissions)}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Report Selected State */}
      {!report && !loading && (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Report Generated</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select a sales rep and date range, then click "Generate Report" to view commission data.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}