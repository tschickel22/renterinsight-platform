import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { BarChart3, Calendar, Filter, Download } from 'lucide-react'
import { ReportType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ReportGeneratorFormProps {
  initialReportConfig?: ReportConfig | null
  onGenerate: (reportConfig: ReportConfig) => void
  onExportCSV: () => void
  isGenerating: boolean
  hasData: boolean
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
  hasData
}: ReportGeneratorFormProps) {
  const { toast } = useToast()
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: ReportType.SALES,
    name: 'Sales Report',
    dateRange: {
      startDate: '2023-01-01', // Changed to an earlier date to include mock data
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

    // CRITICAL FIX: Ensure onGenerate is called with the current reportConfig state
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
      
      // If we're receiving a new config, we don't need to auto-generate
      // as the parent component will handle that
    }
  }, [initialReportConfig]);

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
          <Button variant="outline" size="sm" onClick={onExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
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
              {hasData && (
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

