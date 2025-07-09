import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, FileText, PlusCircle } from 'lucide-react'
import { ReportGeneratorForm, ReportConfig } from '@/modules/reporting-suite/components/ReportGeneratorForm'
import { useReportGenerator } from '@/modules/reporting-suite/hooks/useReportGenerator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ReportingSuite() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { reportData, reportColumns, loading: isGenerating, generateReport, exportToCSV } = useReportGenerator()

  const handleGenerateReport = (config: ReportConfig) => {
    console.log('ReportingSuite: handleGenerateReport called with config:', config) // Debug log
    generateReport(config)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="ri-page-header">
          <h1 className="ri-page-title">Reporting Suite</h1>
          <p className="ri-page-description">
            Generate insights and analytics for your dealership
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="ri-stats-grid">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  All reports
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Generated this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Automated reports
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Available templates
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Report Templates</h3>
            <p className="text-muted-foreground">Quick start templates for common reports</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="flex flex-col items-center text-center p-4">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Sales</CardTitle>
                <CardDescription className="text-sm mb-4">Overview of sales performance and metrics</CardDescription>
                <Button onClick={() => handleGenerateReport({
                  type: ReportType.SALES,
                  name: 'Sales Report',
                  dateRange: {
                    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  },
                  filters: {}
                })}>Generate Report</Button>
              </Card>
              <Card className="flex flex-col items-center text-center p-4">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Inventory</CardTitle>
                <CardDescription className="text-sm mb-4">Current inventory levels and valuation</CardDescription>
                <Button onClick={() => handleGenerateReport({
                  type: ReportType.INVENTORY,
                  name: 'Inventory Report',
                  dateRange: {
                    startDate: '', // Not applicable for inventory, but required by type
                    endDate: ''
                  },
                  filters: {}
                })}>Generate Report</Button>
              </Card>
              <Card className="flex flex-col items-center text-center p-4">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Customer</CardTitle>
                <CardDescription className="text-sm mb-4">Demographics and behavior insights</CardDescription>
                <Button onClick={() => handleGenerateReport({
                  type: ReportType.CUSTOM, // Assuming CUSTOM for customer reports
                  name: 'Customer Report',
                  dateRange: {
                    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  },
                  filters: {}
                })}>Generate Report</Button>
              </Card>
              <Card className="flex flex-col items-center text-center p-4">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Financial</CardTitle>
                <CardDescription className="text-sm mb-4">Revenue, expenses, and profitability analysis</CardDescription>
                <Button onClick={() => handleGenerateReport({
                  type: ReportType.FINANCIAL,
                  name: 'Financial Report',
                  dateRange: {
                    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  },
                  filters: {}
                })}>Generate Report</Button>
              </Card>
            </div>
          </div>

          <ReportGeneratorForm
            onGenerate={handleGenerateReport}
            onExportCSV={exportToCSV}
            isGenerating={isGenerating}
            hasData={reportData.length > 0}
          />

          {isGenerating && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="ml-4 text-lg text-muted-foreground">Generating report...</p>
            </div>
          )}

          {!isGenerating && reportData.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Generated Report</CardTitle>
                <CardDescription>Displaying results for your custom report.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {reportColumns.map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((row, index) => (
                      <TableRow key={index}>
                        {reportColumns.map((col) => (
                          <TableCell key={col.key}>
                            {col.type === 'currency'
                              ? formatCurrency(row[col.key])
                              : col.type === 'date'
                                ? formatDate(row[col.key])
                                : row[col.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!isGenerating && reportData.length === 0 && (
            <div className="text-center text-muted-foreground p-8">
              <p>No report data to display. Generate a report using the form above.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <h3 className="text-xl font-semibold">Saved Reports</h3>
          <p className="text-muted-foreground">Manage your previously saved reports.</p>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">No saved reports yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
