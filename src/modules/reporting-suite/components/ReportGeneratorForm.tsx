// src/modules/reporting-suite/components/ReportGeneratorForm.tsx
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { BarChart3, Calendar, Filter, Download } from 'lucide-react'
import { ReportType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { jsPDF } from 'jspdf' // Import jsPDF
import 'jspdf-autotable' // Import jspdf-autotable
import { useTenant } from '@/contexts/TenantContext' // Import useTenant

interface ReportGeneratorFormProps {
  initialReportConfig?: ReportConfig | null
  onGenerate: (reportConfig: ReportConfig) => void
  onExportCSV: () => void
  isGenerating: boolean
  reportData: any[] // Receive reportData
  reportColumns: any[] // Receive reportColumns
}

export interface ReportConfig {
  type: ReportType
  name: string
  dateRange: {
    startDate: string
    endDate: string
  }
  filters: {
    salesRep?: string
    status?: string
    location?: string
  }
}

export function ReportGeneratorForm({
  initialReportConfig,
  onGenerate,
  onExportCSV,
  isGenerating,
  reportData, // Receive reportData
  reportColumns // Receive reportColumns
}: ReportGeneratorFormProps) {
  const { toast } = useToast()
  const { tenant } = useTenant() // Use the useTenant hook
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: ReportType.SALES,
    name: 'Sales Report',
    dateRange: {
      startDate: '2023-01-01',
      endDate: new Date().toISOString().split('T')[0]
    },
    filters: {}
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('handleSubmit called from ReportGeneratorForm');

    if (!reportConfig.name) {
      toast({
        title: 'Validation Error',
        description: 'Report name is required',
        variant: 'destructive'
      })
      return
    }

    console.log('Calling onGenerate with config:', reportConfig);
    onGenerate(reportConfig);
  }

  const handleReportTypeChange = (type: ReportType) => {
    let name = 'Custom Report'

    switch (type) {
      case ReportType.SALES:
        name = 'Sales Report'
        break
      case ReportType.INVENTORY:
        name = 'Inventory Report'
        break
      case ReportType.SERVICE:
        name = 'Service Report'
        break
      case ReportType.FINANCIAL:
        name = 'Financial Report'
        break
    }

    setReportConfig(prev => ({
      ...prev,
      type,
      name
    }))
  }

  // Update form when initialReportConfig changes
  useEffect(() => {
    if (initialReportConfig) {
      console.log('ReportGeneratorForm useEffect triggered with initialReportConfig:', initialReportConfig);
      setReportConfig(initialReportConfig);
    }
  }, [initialReportConfig]);

  const handleExportPDF = () => {
    // Directly check reportData and reportColumns length
    if (!reportData?.length || !reportColumns?.length) {
      toast({
        title: 'No Data to Export',
        description: 'Generate a report first before exporting to PDF.',
        variant: 'destructive'
      });
      return;
    }

    const doc = new jsPDF();

    // Add header with company name and logo
    doc.setFontSize(18);
    doc.text(tenant?.name || 'Renter Insight CRM/DMS', 14, 22);

    if (tenant?.branding?.logo) {
      // You might need to adjust x, y, width, height based on your logo size and desired position
      // For a real logo, ensure it's a base64 string or a URL accessible by jsPDF
      // For this example, we'll use a placeholder or assume it's a small image.
      // If it's a URL, jsPDF might need to fetch it, which can be asynchronous.
      // For simplicity, assuming a small image or a placeholder.
      // If it's a complex image, consider converting it to a data URL (base64) beforehand.
      // doc.addImage(tenant.branding.logo, 'PNG', 170, 10, 30, 30); // Example: x, y, width, height
    }

    doc.setFontSize(12);
    doc.text(`Date Range: ${reportConfig.dateRange.startDate} to ${reportConfig.dateRange.endDate}`, 14, 38);

    // Prepare table headers and data
    const headers = reportColumns.map(col => col.label);
    const data = reportData.map(row =>
      reportColumns.map(col => {
        const value = row[col.key];
        switch (col.type) {
          case 'currency':
            return typeof value === 'number' ? `$${value.toFixed(2)}` : value;
          case 'date':
            // Ensure value is a Date object before calling toISOString
            return value instanceof Date ? value.toISOString().split('T')[0] : value;
          default:
            return value;
        }
      })
    );

    // Add table
    (doc as any).autoTable({
      startY: 50,
      head: [headers],
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        // Example: align currency columns right
        ...reportColumns.reduce((acc, col, index) => {
          if (col.type === 'currency') {
            acc[index] = { halign: 'right' };
          }
          return acc;
        }, {})
      }
    });

    doc.save(`${reportConfig.name.replace(/\s/g, '_')}.pdf`);

    toast({
      title: 'PDF Export Successful',
      description: 'The report has been exported as a PDF.',
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
              Generate Report
            </CardTitle>
            <CardDescription>
              Configure and generate custom reports
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}> {/* New PDF Export Button */}
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={reportConfig.type}
                onValueChange={(value: ReportType) => handleReportTypeChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportType.SALES}>Sales Report</SelectItem>
                  <SelectItem value={ReportType.INVENTORY}>Inventory Report</SelectItem>
                  <SelectItem value={ReportType.SERVICE}>Service Report</SelectItem>
                  <SelectItem value={ReportType.FINANCIAL}>Financial Report</SelectItem>
                  <SelectItem value={ReportType.CUSTOM}>Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter report name"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  type="date"
                  value={reportConfig.dateRange.startDate}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      startDate: e.target.value
                    }
                  }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={reportConfig.dateRange.endDate}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    dateRange: {
                      ...prev.dateRange,
                      endDate: e.target.value
                    }
                  }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="salesRep">Sales Rep</Label>
              <Select
                value={reportConfig.filters.salesRep || ''}
                onValueChange={(value) => setReportConfig(prev => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    salesRep: value || undefined
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sales Reps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sales Reps</SelectItem>
                  <SelectItem value="rep-001">John Smith</SelectItem>
                  <SelectItem value="rep-002">Sarah Johnson</SelectItem>
                  <SelectItem value="rep-003">Mike Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={reportConfig.filters.status || ''}
                onValueChange={(value) => setReportConfig(prev => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    status: value || undefined
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={reportConfig.filters.location || ''}
                onValueChange={(value) => setReportConfig(prev => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    location: value || undefined
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="north">North Region</SelectItem>
                  <SelectItem value="south">South Region</SelectItem>
                  <SelectItem value="east">East Region</SelectItem>
                  <SelectItem value="west">West Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <div className="flex space-x-2">
              {reportData?.length > 0 && ( // Check reportData length directly
                <Button type="button" variant="outline" onClick={onExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              )}
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
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
        </form>
      </CardContent>
    </Card>
  )
}

