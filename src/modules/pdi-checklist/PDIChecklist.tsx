import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClipboardCheck, Plus, CheckSquare, AlertTriangle, Image as ImageIcon, TrendingUp } from 'lucide-react'
import { PDITemplate, PDIInspection, PDIInspectionStatus } from './types'
import { usePDIManagement } from './hooks/usePDIManagement'
import { useInventoryManagement } from '@/modules/inventory-management/hooks/useInventoryManagement'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { PDITemplateList } from './components/PDITemplateList'
import { PDITemplateForm } from './components/PDITemplateForm'
import { PDIInspectionList } from './components/PDIInspectionList'
import { PDIInspectionForm } from './components/PDIInspectionForm'
import { PDIInspectionDetail } from './components/PDIInspectionDetail'
import { PDINewInspectionForm } from './components/PDINewInspectionForm'

function PDIChecklistDashboard() {
  const { 
    templates, 
    inspections, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    createInspection,
    updateInspection,
    updateInspectionItem,
    completeInspection,
    createDefect,
    addPhoto,
    addSignoff
  } = usePDIManagement()
  
  const { vehicles } = useInventoryManagement()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState('inspections')
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [showInspectionForm, setShowInspectionForm] = useState(false)
  const [showNewInspectionForm, setShowNewInspectionForm] = useState(false)
  const [showInspectionDetail, setShowInspectionDetail] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<PDITemplate | null>(null)
  const [selectedInspection, setSelectedInspection] = useState<PDIInspection | null>(null)

  // Template Management
  const handleCreateTemplate = () => {
    setSelectedTemplate(null)
    setShowTemplateForm(true)
  }

  const handleEditTemplate = (template: PDITemplate) => {
    setSelectedTemplate(template)
    setShowTemplateForm(true)
  }

  const handleViewTemplate = (template: PDITemplate) => {
    // In a real app, you might want to show a read-only view
    setSelectedTemplate(template)
    setShowTemplateForm(true)
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(templateId)
        toast({
          title: 'Success',
          description: 'Template deleted successfully',
        })
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete template',
          variant: 'destructive'
        })
      }
    }
  }

  const handleDuplicateTemplate = async (template: PDITemplate) => {
    try {
      const newTemplate = { 
        ...template,
        id: undefined,
        name: `${template.name} (Copy)`,
      }
      await createTemplate(newTemplate)
      toast({
        title: 'Success',
        description: 'Template duplicated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate template',
        variant: 'destructive'
      })
    }
  }

  const handleSaveTemplate = async (templateData: Partial<PDITemplate>) => {
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, templateData)
      } else {
        await createTemplate(templateData)
      }
      setShowTemplateForm(false)
      setSelectedTemplate(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${selectedTemplate ? 'update' : 'create'} template`,
        variant: 'destructive'
      })
    }
  }

  // Inspection Management
  const handleCreateInspection = () => {
    setShowNewInspectionForm(true)
  }

  const handleNewInspection = async (inspectionData: Partial<PDIInspection>) => {
    try {
      const newInspection = await createInspection(inspectionData)
      setShowNewInspectionForm(false)
      
      // Open the inspection form for the new inspection
      setSelectedInspection(newInspection)
      setShowInspectionForm(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create inspection',
        variant: 'destructive'
      })
    }
  }

  const handleViewInspection = (inspection: PDIInspection) => {
    setSelectedInspection(inspection)
    setShowInspectionDetail(true)
  }

  const handleContinueInspection = (inspection: PDIInspection) => {
    setSelectedInspection(inspection)
    setShowInspectionForm(true)
  }

  const handleSaveInspection = async (inspectionData: Partial<PDIInspection>) => {
    if (!selectedInspection) return
    
    try {
      await updateInspection(selectedInspection.id, inspectionData)
      toast({
        title: 'Success',
        description: 'Inspection saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save inspection',
        variant: 'destructive'
      })
    }
  }

  const handleCompleteInspection = async (inspectionId: string, notes?: string) => {
    try {
      await completeInspection(inspectionId, notes)
      setShowInspectionForm(false)
      setSelectedInspection(null)
      toast({
        title: 'Success',
        description: 'Inspection completed successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete inspection',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateInspectionItem = async (inspectionId: string, itemId: string, itemData: Partial<PDIInspectionItem>) => {
    try {
      await updateInspectionItem(inspectionId, itemId, itemData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      })
    }
  }

  const handleAddDefect = async (inspectionId: string, defectData: Partial<PDIDefect>) => {
    try {
      await createDefect(inspectionId, defectData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add defect',
        variant: 'destructive'
      })
    }
  }

  const handleAddPhoto = async (inspectionId: string, photoData: Partial<PDIPhoto>) => {
    try {
      await addPhoto(inspectionId, photoData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add photo',
        variant: 'destructive'
      })
    }
  }

  const handleAddSignoff = async (inspectionId: string, signoffData: Partial<PDISignoff>) => {
    try {
      await addSignoff(inspectionId, {
        ...signoffData,
        userId: user?.id || 'current-user'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add signoff',
        variant: 'destructive'
      })
    }
  }

  // Stats
  const totalTemplates = templates.length
  const activeTemplates = templates.filter(t => t.isActive).length
  const totalInspections = inspections.length
  const completedInspections = inspections.filter(i => 
    i.status === PDIInspectionStatus.COMPLETED || 
    i.status === PDIInspectionStatus.APPROVED
  ).length
  const inProgressInspections = inspections.filter(i => i.status === PDIInspectionStatus.IN_PROGRESS).length
  const totalDefects = inspections.reduce((sum, i) => sum + i.defects.length, 0)
  const openDefects = inspections.reduce((sum, i) => 
    sum + i.defects.filter(d => d.status === 'open' || d.status === 'in_progress').length, 0
  )
  const totalPhotos = inspections.reduce((sum, i) => sum + i.photos.length, 0)

  return (
    <div className="space-y-8">
      {/* Template Form Modal */}
      {showTemplateForm && (
        <PDITemplateForm
          template={selectedTemplate || undefined}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setShowTemplateForm(false)
            setSelectedTemplate(null)
          }}
        />
      )}

      {/* New Inspection Form Modal */}
      {showNewInspectionForm && (
        <PDINewInspectionForm
          templates={templates}
          vehicles={vehicles}
          currentUserId={user?.id || 'current-user'}
          onCreateInspection={handleNewInspection}
          onCancel={() => setShowNewInspectionForm(false)}
        />
      )}

      {/* Inspection Form Modal */}
      {showInspectionForm && selectedInspection && (
        <PDIInspectionForm
          inspection={selectedInspection}
          vehicles={vehicles}
          onSave={handleSaveInspection}
          onComplete={handleCompleteInspection}
          onUpdateItem={handleUpdateInspectionItem}
          onAddDefect={handleAddDefect}
          onAddPhoto={handleAddPhoto}
          onCancel={() => {
            setShowInspectionForm(false)
            setSelectedInspection(null)
          }}
        />
      )}

      {/* Inspection Detail Modal */}
      {showInspectionDetail && selectedInspection && (
        <PDIInspectionDetail
          inspection={selectedInspection}
          vehicles={vehicles}
          onAddSignoff={handleAddSignoff}
          onClose={() => {
            setShowInspectionDetail(false)
            setSelectedInspection(null)
          }}
        />
      )}

      {/* Page Header */}
      <div className="ri-page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="ri-page-title">PDI Checklist - Home/Vehicle</h1>
            <p className="ri-page-description">
              Manage pre-delivery inspections and quality control for homes and vehicles
            </p>
          </div>
          <Button className="shadow-sm" onClick={handleCreateInspection}>
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ri-stats-grid">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Inspections</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalInspections}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {completedInspections} completed
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">In Progress</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{inProgressInspections}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active inspections
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-900">Open Defects</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{openDefects}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {totalDefects} total defects
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Templates</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{totalTemplates}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {activeTemplates} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="inspections">
          <PDIInspectionList
            inspections={inspections}
            onCreateInspection={handleCreateInspection}
            onViewInspection={handleViewInspection}
            onContinueInspection={handleContinueInspection}
          />
        </TabsContent>

        <TabsContent value="templates">
          <PDITemplateList
            templates={templates}
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onDuplicateTemplate={handleDuplicateTemplate}
            onViewTemplate={handleViewTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function PDIChecklist() {
  return (
    <Routes>
      <Route path="/" element={<PDIChecklistDashboard />} />
      <Route path="/*" element={<PDIChecklistDashboard />} />
    </Routes>
  )
}