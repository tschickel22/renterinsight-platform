import { useState, useEffect } from 'react'
import { 
  PDITemplate, 
  PDITemplateSection, 
  PDITemplateItem,
  PDIInspection, 
  PDIInspectionItem, 
  PDIDefect, 
  PDIPhoto, 
  PDISignoff,
  PDIInspectionStatus,
  PDIInspectionItemStatus,
  PDIDefectStatus,
  PDIDefectSeverity,
  PDISignoffRole
} from '../types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import { Vehicle, VehicleType } from '@/types'

export function usePDIManagement() {
  const [templates, setTemplates] = useState<PDITemplate[]>([])
  const [inspections, setInspections] = useState<PDIInspection[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing data from localStorage or use mock data
    const savedTemplates = loadFromLocalStorage('renter-insight-pdi-templates', [
      {
        id: '1',
        name: 'RV Pre-Delivery Inspection',
        description: 'Standard PDI checklist for recreational vehicles',
        vehicleType: VehicleType.RV,
        isActive: true,
        sections: [
          {
            id: '1-1',
            templateId: '1',
            name: 'Exterior',
            description: 'Exterior inspection items',
            orderIndex: 1,
            items: [
              {
                id: '1-1-1',
                sectionId: '1-1',
                name: 'Exterior Body Condition',
                description: 'Check for scratches, dents, or damage',
                itemType: 'checkbox',
                isRequired: true,
                orderIndex: 1,
                createdAt: new Date('2024-01-01')
              },
              {
                id: '1-1-2',
                sectionId: '1-1',
                name: 'Roof Inspection',
                description: 'Check roof seals, vents, and AC units',
                itemType: 'checkbox',
                isRequired: true,
                orderIndex: 2,
                createdAt: new Date('2024-01-01')
              },
              {
                id: '1-1-3',
                sectionId: '1-1',
                name: 'Exterior Photos',
                description: 'Take photos of all sides of the vehicle',
                itemType: 'photo',
                isRequired: true,
                orderIndex: 3,
                createdAt: new Date('2024-01-01')
              }
            ],
            createdAt: new Date('2024-01-01')
          },
          {
            id: '1-2',
            templateId: '1',
            name: 'Interior',
            description: 'Interior inspection items',
            orderIndex: 2,
            items: [
              {
                id: '1-2-1',
                sectionId: '1-2',
                name: 'Interior Cleanliness',
                description: 'Verify interior is clean and free of debris',
                itemType: 'checkbox',
                isRequired: true,
                orderIndex: 1,
                createdAt: new Date('2024-01-01')
              },
              {
                id: '1-2-2',
                sectionId: '1-2',
                name: 'Furniture Condition',
                description: 'Check all furniture for damage or defects',
                itemType: 'checkbox',
                isRequired: true,
                orderIndex: 2,
                createdAt: new Date('2024-01-01')
              }
            ],
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Motorhome Pre-Delivery Inspection',
        description: 'Comprehensive PDI checklist for motorhomes',
        vehicleType: VehicleType.MOTORHOME,
        isActive: true,
        sections: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ])

    const savedInspections = loadFromLocalStorage('renter-insight-pdi-inspections', [
      {
        id: '1',
        templateId: '1',
        vehicleId: '1',
        inspectorId: 'user-001',
        status: PDIInspectionStatus.IN_PROGRESS,
        startedAt: new Date('2024-01-15'),
        notes: 'Initial inspection for new RV',
        items: [
          {
            id: '1-1',
            inspectionId: '1',
            templateItemId: '1-1-1',
            status: PDIInspectionItemStatus.PASSED,
            notes: 'No exterior damage found',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
          },
          {
            id: '1-2',
            inspectionId: '1',
            templateItemId: '1-1-2',
            status: PDIInspectionItemStatus.FAILED,
            notes: 'Roof seal damaged near AC unit',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
          }
        ],
        defects: [
          {
            id: '1-1',
            inspectionId: '1',
            inspectionItemId: '1-2',
            title: 'Roof Seal Damage',
            description: 'Damaged roof seal near AC unit on passenger side',
            severity: PDIDefectSeverity.MEDIUM,
            status: PDIDefectStatus.OPEN,
            assignedTo: 'user-002',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15')
          }
        ],
        photos: [
          {
            id: '1-1',
            inspectionId: '1',
            inspectionItemId: '1-2',
            defectId: '1-1',
            url: 'https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg',
            caption: 'Damaged roof seal',
            createdAt: new Date('2024-01-15')
          }
        ],
        signoffs: [],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ])

    setTemplates(savedTemplates)
    setInspections(savedInspections)
  }

  const saveTemplatesToStorage = (updatedTemplates: PDITemplate[]) => {
    saveToLocalStorage('renter-insight-pdi-templates', updatedTemplates)
  }

  const saveInspectionsToStorage = (updatedInspections: PDIInspection[]) => {
    saveToLocalStorage('renter-insight-pdi-inspections', updatedInspections)
  }

  // Template Management
  const getTemplatesByVehicleType = (vehicleType: string) => {
    return templates.filter(t => t.vehicleType === vehicleType && t.isActive)
  }

  const getTemplateById = (templateId: string) => {
    return templates.find(t => t.id === templateId)
  }

  const createTemplate = async (templateData: Partial<PDITemplate>) => {
    setLoading(true)
    try {
      const newTemplate: PDITemplate = {
        id: Math.random().toString(36).substr(2, 9),
        name: templateData.name || '',
        description: templateData.description || '',
        vehicleType: templateData.vehicleType || VehicleType.RV,
        isActive: templateData.isActive ?? true,
        sections: templateData.sections || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedTemplates = [...templates, newTemplate]
      setTemplates(updatedTemplates)
      saveTemplatesToStorage(updatedTemplates)

      return newTemplate
    } finally {
      setLoading(false)
    }
  }

  const updateTemplate = async (templateId: string, templateData: Partial<PDITemplate>) => {
    const updatedTemplates = templates.map(template => 
      template.id === templateId 
        ? { 
            ...template, 
            ...templateData,
            updatedAt: new Date() 
          }
        : template
    )
    setTemplates(updatedTemplates)
    saveTemplatesToStorage(updatedTemplates)
  }

  const deleteTemplate = async (templateId: string) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId)
    setTemplates(updatedTemplates)
    saveTemplatesToStorage(updatedTemplates)
  }

  // Template Section Management
  const createTemplateSection = async (templateId: string, sectionData: Partial<PDITemplateSection>) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return null

    const newSection: PDITemplateSection = {
      id: Math.random().toString(36).substr(2, 9),
      templateId,
      name: sectionData.name || '',
      description: sectionData.description || '',
      orderIndex: sectionData.orderIndex || template.sections.length + 1,
      items: sectionData.items || [],
      createdAt: new Date()
    }

    const updatedTemplate = {
      ...template,
      sections: [...template.sections, newSection],
      updatedAt: new Date()
    }

    const updatedTemplates = templates.map(t => 
      t.id === templateId ? updatedTemplate : t
    )

    setTemplates(updatedTemplates)
    saveTemplatesToStorage(updatedTemplates)

    return newSection
  }

  // Template Item Management
  const createTemplateItem = async (sectionId: string, itemData: Partial<PDITemplateItem>) => {
    const templateIndex = templates.findIndex(t => 
      t.sections.some(s => s.id === sectionId)
    )
    
    if (templateIndex === -1) return null

    const template = templates[templateIndex]
    const sectionIndex = template.sections.findIndex(s => s.id === sectionId)
    
    if (sectionIndex === -1) return null

    const section = template.sections[sectionIndex]
    
    const newItem: PDITemplateItem = {
      id: Math.random().toString(36).substr(2, 9),
      sectionId,
      name: itemData.name || '',
      description: itemData.description || '',
      itemType: itemData.itemType || 'checkbox',
      isRequired: itemData.isRequired ?? true,
      orderIndex: itemData.orderIndex || section.items.length + 1,
      createdAt: new Date()
    }

    const updatedSection = {
      ...section,
      items: [...section.items, newItem]
    }

    const updatedSections = [...template.sections]
    updatedSections[sectionIndex] = updatedSection

    const updatedTemplate = {
      ...template,
      sections: updatedSections,
      updatedAt: new Date()
    }

    const updatedTemplates = [...templates]
    updatedTemplates[templateIndex] = updatedTemplate

    setTemplates(updatedTemplates)
    saveTemplatesToStorage(updatedTemplates)

    return newItem
  }

  // Inspection Management
  const getInspectionsByVehicleId = (vehicleId: string) => {
    return inspections.filter(i => i.vehicleId === vehicleId)
  }

  const getInspectionById = (inspectionId: string) => {
    return inspections.find(i => i.id === inspectionId)
  }

  const createInspection = async (inspectionData: Partial<PDIInspection>) => {
    setLoading(true)
    try {
      const template = templates.find(t => t.id === inspectionData.templateId)
      if (!template) throw new Error('Template not found')

      // Create inspection items from template
      const items: PDIInspectionItem[] = []
      template.sections.forEach(section => {
        section.items.forEach(item => {
          items.push({
            id: Math.random().toString(36).substr(2, 9),
            inspectionId: '',  // Will be updated after inspection is created
            templateItemId: item.id,
            templateItem: item,
            status: PDIInspectionItemStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        })
      })

      const newInspection: PDIInspection = {
        id: Math.random().toString(36).substr(2, 9),
        templateId: inspectionData.templateId || '',
        template: template || undefined,
        vehicleId: inspectionData.vehicleId || '',
        inspectorId: inspectionData.inspectorId || '',
        status: PDIInspectionStatus.IN_PROGRESS,
        startedAt: new Date(),
        notes: inspectionData.notes || '',
        items: [],
        defects: [],
        photos: [],
        signoffs: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Update inspection ID in items
      items.forEach(item => {
        item.inspectionId = newInspection.id
      })
      newInspection.items = items

      const updatedInspections = [...inspections, newInspection]
      setInspections(updatedInspections)
      saveInspectionsToStorage(updatedInspections)

      return newInspection
    } finally {
      setLoading(false)
    }
  }

  const updateInspection = async (inspectionId: string, inspectionData: Partial<PDIInspection>) => {
    const updatedInspections = inspections.map(inspection => 
      inspection.id === inspectionId 
        ? { 
            ...inspection, 
            ...inspectionData,
            updatedAt: new Date() 
          }
        : inspection
    )
    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)
  }

  const updateInspectionItem = async (inspectionId: string, itemId: string, itemData: Partial<PDIInspectionItem>) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return

    const inspection = inspections[inspectionIndex]
    const itemIndex = inspection.items.findIndex(item => item.id === itemId)
    if (itemIndex === -1) return

    const updatedItems = [...inspection.items]
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      ...itemData,
      updatedAt: new Date()
    }

    const updatedInspection = {
      ...inspection,
      items: updatedItems,
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)
  }

  const completeInspection = async (inspectionId: string, notes?: string) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return

    const inspection = inspections[inspectionIndex]
    
    // Check if all required items have been completed
    const allRequiredItemsCompleted = inspection.items.every(item => {
      const templateItem = templates
        .flatMap(t => t.sections)
        .flatMap(s => s.items)
        .find(ti => ti.id === item.templateItemId)
      
      return !templateItem?.isRequired || item.status !== PDIInspectionItemStatus.PENDING
    })

    if (!allRequiredItemsCompleted) {
      throw new Error('All required items must be completed')
    }

    const updatedInspection = {
      ...inspection,
      status: PDIInspectionStatus.COMPLETED,
      completedAt: new Date(),
      notes: notes || inspection.notes,
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)
  }

  // Defect Management
  const createDefect = async (inspectionId: string, defectData: Partial<PDIDefect>) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return null

    const inspection = inspections[inspectionIndex]

    const newDefect: PDIDefect = {
      id: Math.random().toString(36).substr(2, 9),
      inspectionId,
      inspectionItemId: defectData.inspectionItemId,
      title: defectData.title || '',
      description: defectData.description || '',
      severity: defectData.severity || PDIDefectSeverity.MEDIUM,
      status: PDIDefectStatus.OPEN,
      assignedTo: defectData.assignedTo,
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedInspection = {
      ...inspection,
      defects: [...inspection.defects, newDefect],
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)

    return newDefect
  }

  const updateDefect = async (inspectionId: string, defectId: string, defectData: Partial<PDIDefect>) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return

    const inspection = inspections[inspectionIndex]
    const defectIndex = inspection.defects.findIndex(d => d.id === defectId)
    if (defectIndex === -1) return

    const updatedDefects = [...inspection.defects]
    updatedDefects[defectIndex] = {
      ...updatedDefects[defectIndex],
      ...defectData,
      updatedAt: new Date()
    }

    const updatedInspection = {
      ...inspection,
      defects: updatedDefects,
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)
  }

  const resolveDefect = async (inspectionId: string, defectId: string, resolutionNotes: string) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return

    const inspection = inspections[inspectionIndex]
    const defectIndex = inspection.defects.findIndex(d => d.id === defectId)
    if (defectIndex === -1) return

    const updatedDefects = [...inspection.defects]
    updatedDefects[defectIndex] = {
      ...updatedDefects[defectIndex],
      status: PDIDefectStatus.RESOLVED,
      resolvedAt: new Date(),
      resolutionNotes,
      updatedAt: new Date()
    }

    const updatedInspection = {
      ...inspection,
      defects: updatedDefects,
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)
  }

  // Photo Management
  const addPhoto = async (inspectionId: string, photoData: Partial<PDIPhoto>) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return null

    const inspection = inspections[inspectionIndex]

    const newPhoto: PDIPhoto = {
      id: Math.random().toString(36).substr(2, 9),
      inspectionId,
      inspectionItemId: photoData.inspectionItemId,
      defectId: photoData.defectId,
      url: photoData.url || '',
      caption: photoData.caption,
      createdAt: new Date()
    }

    const updatedInspection = {
      ...inspection,
      photos: [...inspection.photos, newPhoto],
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)

    return newPhoto
  }

  // Signoff Management
  const addSignoff = async (inspectionId: string, signoffData: Partial<PDISignoff>) => {
    const inspectionIndex = inspections.findIndex(i => i.id === inspectionId)
    if (inspectionIndex === -1) return null

    const inspection = inspections[inspectionIndex]

    const newSignoff: PDISignoff = {
      id: Math.random().toString(36).substr(2, 9),
      inspectionId,
      userId: signoffData.userId || '',
      role: signoffData.role || PDISignoffRole.INSPECTOR,
      signatureUrl: signoffData.signatureUrl,
      notes: signoffData.notes,
      signedAt: new Date(),
      createdAt: new Date()
    }

    let updatedStatus = inspection.status
    
    // If this is a manager signoff, update the inspection status to approved
    if (signoffData.role === PDISignoffRole.MANAGER) {
      updatedStatus = PDIInspectionStatus.APPROVED
    }

    const updatedInspection = {
      ...inspection,
      signoffs: [...inspection.signoffs, newSignoff],
      status: updatedStatus,
      updatedAt: new Date()
    }

    const updatedInspections = [...inspections]
    updatedInspections[inspectionIndex] = updatedInspection

    setInspections(updatedInspections)
    saveInspectionsToStorage(updatedInspections)

    return newSignoff
  }

  return {
    templates,
    inspections,
    loading,
    getTemplatesByVehicleType,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createTemplateSection,
    createTemplateItem,
    getInspectionsByVehicleId,
    getInspectionById,
    createInspection,
    updateInspection,
    updateInspectionItem,
    completeInspection,
    createDefect,
    updateDefect,
    resolveDefect,
    addPhoto,
    addSignoff
  }
}