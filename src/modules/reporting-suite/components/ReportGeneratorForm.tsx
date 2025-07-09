import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useReportGenerator } from '../hooks/useReportGenerator'
import { ReportType } from '@/types'
import { Calendar, FileText, Settings } from 'lucide-react'

export default function ReportGeneratorForm() {
  const { generateReport, loading } = useReportGenerator()
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: '' as ReportType | '',
    startDate: '',
    endDate: '',
    description: ''
  })

  const reportTypeOptions = [
    { value: ReportType.SALES, label: 'Sales Report' },
    { value: ReportType.INVENTORY, label: 'Inventory Report' },
    { value: ReportType.SERVICE, label: 'Service Report' },
    { value: ReportType.FINANCIAL, label: 'Financial Report' },
    { value: ReportType.CUSTOM, label: 'Custom Report' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.reportName || !formData.reportType) {
      console.warn('⚠️ Missing required fields:', { reportName: formData.reportName, reportType: formData.reportType })
      return
    }

    console.log('📝 Form submission data:', formData)
    console.log('🎯 Report type from form:', formData.reportType)
    
    const config = {
      reportType: formData.reportType as ReportType,
      reportName: formData.reportName,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: formData.endDate ? new Date(formData.endDate) : new Date(),
      filters: [],
      columns: []
    }
    
    console.log('⚙️ Generated config object:', config)
    console.log('🔍 Config reportType type:', typeof config.reportType)
    console.log('🔍 Config reportType value:', config.reportType)
    
    try {
      await generateReport(config)
      console.log('✅ Custom report generation completed successfully')
      
      // Reset form after successful generation
      setFormData({
        reportName: '',
        reportType: '',
        startDate: '',
        endDate: '',
        description: ''
      })
    } catch (error) {
      console.error('❌ Error generating custom report:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    console.log(`📝 Form field changed: ${field} = ${value}`)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="ri-page-header">
        <h2 className="ri-page-title">Custom Report Generator</h2>
        <p className="ri-page-description">
          Create custom reports with specific parameters and filters
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle>Report Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure your custom report parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name *</Label>
                <Input
                  id="reportName"
                  placeholder="Enter report name"
                  value={formData.reportName}
                  onChange={(e) => handleInputChange('reportName', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type *</Label>
                <Select
                  value={formData.reportType}
                  onValueChange={(value) => handleInputChange('reportType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter report description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  reportName: '',
                  reportType: '',
                  startDate: '',
                  endDate: '',
                  description: ''
                })}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.reportName || !formData.reportType}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}