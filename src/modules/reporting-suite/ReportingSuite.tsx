// src/modules/reporting-suite/ReportingSuite.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, DollarSign, Users, Package, Plus } from 'lucide-react'
import { Report, ReportType } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ReportGeneratorForm } from './components/ReportGeneratorForm'
import { ReportDisplayTable } from './components/ReportDisplayTable' 
import { useReportGenerator } from './hooks/useReportGenerator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardReports } from './components/DashboardReports'

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
    icon: DollarSign,
    color: 'from-green-50 to-green-100/50'
  },
  {
    id: 'inventory-report',
    name: 'Inventory Report',
    description: 'Current inventory levels and valuation',
    type: ReportType.INVENTORY,
    icon: Package,
    color: 'from-blue-50 to-blue-100/50'
  },
  {
    id: 'customer-analysis',
    name: 'Customer Analysis',
    description: 'Customer demographics and behavior insights',
    type: ReportType.CUSTOM,
    icon: Users,
    color: 'from-purple-50 to-purple-100/50'
  },
  {
    id: 'financial-overview',
    name: 'Financial Overview',
    description: 'Revenue, expenses, and profitability analysis',
    type: ReportType.FINANCIAL,
    icon: TrendingUp,
    color: 'from-orange-50 to-orange-100/50'
  }
]

function ReportingDashboard() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const { 
    reportData, 
    reportColumns, 
    loading, 
    currentReportConfig, 
    generateReport, 
    exportToCSV 
  } = useReportGenerator()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [reportConfigForForm, setReportConfigForForm] = useState<any>(null)
  const reportGeneratorRef = useRef<HTMLDivElement>(null); // Create a ref for the report generator section
  const [shouldScrollToGenerator, setShouldScrollToGenerator] = useState(false); // New state for scrolling

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case ReportType.SALES:
        return 'bg-green-50 text-green-700 border-green-200'
      case ReportType.INVENTORY:
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case ReportType.SERVICE:
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case ReportType.FINANCIAL:
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case ReportType.CUSTOM:
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }
  
  const handleGenerateReport = (config: any) => {
    generateReport(config)
  }
  
  const handleExportCSV = () => {
    exportToCSV()
  }
  
  const handleGenerateTemplateReport = (template: any) => {
    // Create a report config based on the template
    const config = {
      type: template.type,
      name: template.name,
      dateRange: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      filters: {}
    }
    
    console.log('handleGenerateTemplateReport called with config:', config);
    
    // Set the config for the form
    setReportConfigForForm(config)
    
    // Switch to the generator tab
    setActiveTab('generator')
    
    // Generate the report
    generateReport(config)
  }

  // Function to handle "Create Report" button click
  const handleCreateNewReport = () => {
    setActiveTab('generator'); // Switch to the Report Generator tab
    setReportConfigForForm(null); // Reset the form to create a new report
    setShouldScrollToGenerator(true); // Set state to trigger scroll
    console.log('Create Report button clicked!'); // Log to confirm execution
  };

  // Effect to scroll to the report generator section when shouldScrollToGenerator is true
  useEffect(() => {
    if (shouldScrollToGenerator && reportGeneratorRef.current) {
      reportGeneratorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShouldScrollToGenerator(false); // Reset the state after scrolling
    }
  }, [shouldScrollToGenerator, reportGeneratorRef]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">Reporting Suite</h1>
            <p className="ri-page-description">
              Generate insights and analytics for your dealership
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateNewReport}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{reports.length}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              All reports
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">This Month</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {reports.filter(r => r.generatedAt.getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Generated this month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">Scheduled</CardTitle>
            <BarChart3 className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">5</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Automated reports
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Templates</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{reportTemplates.length}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <BarChart3 className="h-3 w-3 mr-1" />
              Available templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DashboardReports />
        </TabsContent>

        <TabsContent value="generator">
          {/* Report Templates */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Report Templates</CardTitle>
              <CardDescription>
                Quick start templates for common reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className={cn("overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br", template.color)}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <template.icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <Badge className={cn("ri-badge-status mt-1", getTypeColor(template.type))}>
                            {template.type.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {template.description}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full shadow-sm"
                        onClick={() => handleGenerateTemplateReport(template)}
                      >
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Generator Form */}
          <div ref={reportGeneratorRef}> {/* Assign the ref here */}
            <ReportGeneratorForm 
              onGenerate={handleGenerateReport}
              onExportCSV={handleExportCSV}
              isGenerating={loading}
              hasData={reportData.length > 0}
              initialReportConfig={reportConfigForForm}
            />
          </div>

          {/* Report Display Table */}
          {reportData.length > 0 && currentReportConfig && (
            <ReportDisplayTable
              reportType={currentReportConfig.type}
              reportName={currentReportConfig.name}
              data={reportData}
              columns={reportColumns}
              onExportCSV={handleExportCSV}
            />
          )}
        </TabsContent>

        <TabsContent value="saved">
          {/* Previously Generated Reports */}
          {reports.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Saved Reports</CardTitle>
                <CardDescription>
                  Previously generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Select a report template above to generate a new report</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
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
