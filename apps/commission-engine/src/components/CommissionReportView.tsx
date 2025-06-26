import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, Printer, Calendar, User, DollarSign, Filter, Search } from 'lucide-react'
import { Commission, CommissionStatus, CommissionType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface CommissionReportViewProps {
  commissions: Commission[]
  salesReps: any[] // Using existing sales rep data
  onExportCSV: () => void
  onPrintReport: () => void
}

export function CommissionReportView({
  commissions,
  salesReps,
  onExportCSV,
  onPrintReport
}: CommissionReportViewProps) {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<string>('this_month')
  const [salesRepFilter, setSalesRepFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

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

  // Filter commissions based on search, date range, sales rep, and status
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = 
      commission.dealId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.salesPersonId.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Date range filter
    let matchesDateRange = true
    const now = new Date()
    const commissionDate = commission.createdAt
    
    if (dateRange === 'today') {
      matchesDateRange = commissionDate.toDateString() === now.toDateString()
    } else if (dateRange === 'this_week') {
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      matchesDateRange = commissionDate >= startOfWeek && commissionDate <= endOfWeek
    } else if (dateRange === 'this_month') {
      matchesDateRange = 
        commissionDate.getMonth() === now.getMonth() && 
        commissionDate.getFullYear() === now.getFullYear()
    } else if (dateRange === 'last_month') {
      const lastMonth = new Date(now)
      lastMonth.setMonth(now.getMonth() - 1)
      matchesDateRange = 
        commissionDate.getMonth() === lastMonth.getMonth() && 
        commissionDate.getFullYear() === lastMonth.getFullYear()
    } else if (dateRange === 'this_year') {
      matchesDateRange = commissionDate.getFullYear() === now.getFullYear()
    }
    
    const matchesSalesRep = salesRepFilter === 'all' || commission.salesPersonId === salesRepFilter
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter

    return matchesSearch && matchesDateRange && matchesSalesRep && matchesStatus
  })

  // Calculate totals
  const totalCommission = filteredCommissions.reduce((sum, commission) => sum + commission.amount, 0)
  const pendingCommission = filteredCommissions
    .filter(c => c.status === CommissionStatus.PENDING || c.status === CommissionStatus.APPROVED)
    .reduce((sum, c) => sum + c.amount, 0)
  const paidCommission = filteredCommissions
    .filter(c => c.status === CommissionStatus.PAID)
    .reduce((sum, c) => sum + c.amount, 0)

  // Get sales rep name by ID
  const getSalesRepName = (repId: string) => {
    const rep = salesReps.find(r => r.id === repId)
    return rep ? rep.name : repId
  }

  const handleExport = () => {
    try {
      onExportCSV()
      toast({
        title: 'Export Successful',
        description: 'Commission report exported to CSV',
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the report',
        variant: 'destructive'
      })
    }
  }

  const handlePrint = () => {
    try {
      onPrintReport()
      toast({
        title: 'Print Initiated',
        description: 'Commission report sent to printer',
      })
    } catch (error) {
      toast({
        title: 'Print Failed',
        description: 'There was an error printing the report',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Commission Report</h2>
          <p className="text-muted-foreground">
            View and analyze commission data
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              {filteredCommissions.length} commission entries
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Pending Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{formatCurrency(pendingCommission)}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Not yet paid
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Paid Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(paidCommission)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Already paid out
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search by deal ID or sales rep..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={salesRepFilter} onValueChange={setSalesRepFilter}>
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
            More Filters
          </Button>
        </div>
      </div>

      {/* Commission Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Commission Details</CardTitle>
          <CardDescription>
            Detailed breakdown of commission entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left font-medium text-muted-foreground">Date</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Deal ID</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Sales Rep</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Type</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Status</th>
                  <th className="p-2 text-left font-medium text-muted-foreground">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b hover:bg-muted/10">
                    <td className="p-2">{formatDate(commission.createdAt)}</td>
                    <td className="p-2">{commission.dealId}</td>
                    <td className="p-2">{getSalesRepName(commission.salesPersonId)}</td>
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
                    <td className="p-2">{commission.paidDate ? formatDate(commission.paidDate) : '-'}</td>
                  </tr>
                ))}
                {filteredCommissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No commission entries found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-muted/30">
                <tr>
                  <td colSpan={4} className="p-2 text-right font-medium">Total:</td>
                  <td className="p-2 font-bold">{formatCurrency(totalCommission)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}