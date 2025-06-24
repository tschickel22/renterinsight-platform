import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Plus, Search, Filter, Download, Eye, TrendingUp, DollarSign, Users, Package } from 'lucide-react'
import { Report, ReportType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    type: ReportType.SALES,
    module: 'sales',
    filters: [],
    columns: [],
    data: [],
    generatedAt: new Date('2024-01-20'),
    generatedBy: 'admin'
  },
  {
    id: '2',
    name: 'Inventory Valuation',
    type: ReportType.INVENTORY,
    module: 'inventory',
    filters: [],
    columns: [],
    data: [],
    generatedAt: new Date('2024-01-19'),
    generatedBy: 'manager'
  },
  {
    id: '3',
    name: 'Service Revenue Analysis',
    type: ReportType.SERVICE,
    module: 'service',
    filters: [],
    columns: [],
    data: [],
    generatedAt: new Date('2024-01-18'),
    generatedBy: 'admin'
  }
]

const reportTemplates = [
  {
    id: 'sales-summary',
    name: 'Sales Summary',
    description: 'Overview of sales performance and metrics',
    type: ReportType.SALES,
    icon: DollarSign
  },
  {
    id: 'inventory-report',
    name: 'Inventory Report',
    description: 'Current inventory levels and valuation',
    type: ReportType.INVENTORY,
    icon: Package
  },
  {
    id: 'customer-analysis',
    name: 'Customer Analysis',
    description: 'Customer demographics and behavior insights',
    type: ReportType.CUSTOM,
    icon: Users
  },
  {
    id: 'financial-overview',
    name: 'Financial Overview',
    description: 'Revenue, expenses, and profitability analysis',
    type: ReportType.FINANCIAL,
    icon: TrendingUp
  }
]

function ReportingDashboard() {
  const [reports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState('')

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.SALES:
        return 'bg-green-100 text-green-800'
      case ReportType.INVENTORY:
        return 'bg-blue-100 text-blue-800'
      case ReportType.SERVICE:
        return 'bg-purple-100 text-purple-800'
      case ReportType.FINANCIAL:
        return 'bg-orange-100 text-orange-800'
      case ReportType.CUSTOM:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporting Suite</h1>
          <p className="text-muted-foreground">
            Generate insights and analytics for your dealership
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.generatedAt.getMonth() === new Date().getMonth()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportTemplates.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>
            Quick start templates for common reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3 mb-2">
                  <template.icon className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge className={getTypeColor(template.type)} variant="secondary">
                      {template.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <Button size="sm" className="w-full">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>
            View and manage your generated reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{report.name}</h3>
                      <Badge className={getTypeColor(report.type)}>
                        {report.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Module:</span> {report.module}
                      </div>
                      <div>
                        <span className="font-medium">Generated By:</span> {report.generatedBy}
                      </div>
                      <div>
                        <span className="font-medium">Generated:</span> {formatDate(report.generatedAt)}
                      </div>
                      <div>
                        <span className="font-medium">Records:</span> {report.data.length}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Export
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

export default function ReportingSuite() {
  return (
    <Routes>
      <Route path="/" element={<ReportingDashboard />} />
      <Route path="/*" element={<ReportingDashboard />} />
    </Routes>
  )
}