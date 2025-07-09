import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useReportGenerator } from '../hooks/useReportGenerator'
import { ReportType } from '@/types'
import { BarChart3, DollarSign, Package, Wrench, TrendingUp } from 'lucide-react'

const reportTemplates = [
  {
    id: 'sales-summary',
    name: 'Sales Summary',
    description: 'Overview of sales performance and metrics',
    type: ReportType.SALES,
    icon: DollarSign,
    category: 'SALES'
  },
  {
    id: 'inventory-report',
    name: 'Inventory Report',
    description: 'Current inventory levels and valuation',
    type: ReportType.INVENTORY,
    icon: Package,
    category: 'INVENTORY'
  },
  {
    id: 'service-analysis',
    name: 'Service Analysis',
    description: 'Service ticket trends and performance',
    type: ReportType.SERVICE,
    icon: Wrench,
    category: 'SERVICE'
  },
  {
    id: 'financial-overview',
    name: 'Financial Overview',
    description: 'Financial performance and cash flow',
    type: ReportType.FINANCIAL,
    icon: TrendingUp,
    category: 'FINANCIAL'
  },
  {
    id: 'customer-analysis',
    name: 'Customer Analysis',
    description: 'Customer demographics and behavior insights',
    type: ReportType.CUSTOM,
    icon: BarChart3,
    category: 'CUSTOM'
  }
]

export default function DashboardReports() {
  const { generateReport, loading, currentReportConfig } = useReportGenerator()

  const handleGenerateReport = async (template: typeof reportTemplates[0]) => {
    console.log('🎯 Generating report for template:', template)
    console.log('📊 Report type being passed:', template.type)
    
    const config = {
      reportType: template.type,
      reportName: template.name,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
      filters: [],
      columns: []
    }
    
    console.log('⚙️ Full config object:', config)
    
    try {
      await generateReport(config)
      console.log('✅ Report generation completed successfully')
    } catch (error) {
      console.error('❌ Error generating report:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h2 className="ri-page-title">Report Templates</h2>
        <p className="ri-page-description">
          Quick start templates for common reports
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTemplates.map((template) => {
          const Icon = template.icon
          const isGenerating = loading && currentReportConfig?.reportType === template.type
          
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleGenerateReport(template)}
                  disabled={loading}
                  className="w-full"
                  variant={isGenerating ? "secondary" : "default"}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    'Generate Report'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Generating {currentReportConfig?.reportName}...
          </p>
        </div>
      )}
    </div>
  )
}