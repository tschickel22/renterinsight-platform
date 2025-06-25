import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Clipboard, Plus, Search, Filter, Edit, Trash2, Copy, CheckSquare } from 'lucide-react'
import { PDITemplate } from '../types'
import { cn } from '@/lib/utils'

interface PDITemplateListProps {
  templates: PDITemplate[]
  onCreateTemplate: () => void
  onEditTemplate: (template: PDITemplate) => void
  onDeleteTemplate: (templateId: string) => void
  onDuplicateTemplate: (template: PDITemplate) => void
  onViewTemplate: (template: PDITemplate) => void
}

export function PDITemplateList({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onViewTemplate
}: PDITemplateListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || template.vehicleType === typeFilter

    return matchesSearch && matchesType
  })

  const getVehicleTypeLabel = (type: string) => {
    return type.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="ri-search-bar flex-1">
          <Search className="ri-search-icon" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ri-search-input shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-md border border-input bg-background"
          >
            <option value="all">All Types</option>
            <option value="rv">RV</option>
            <option value="motorhome">Motorhome</option>
            <option value="travel_trailer">Travel Trailer</option>
            <option value="fifth_wheel">Fifth Wheel</option>
            <option value="toy_hauler">Toy Hauler</option>
          </select>
          <Button variant="outline" className="shadow-sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={onCreateTemplate} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Templates List */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">PDI Templates ({filteredTemplates.length})</CardTitle>
          <CardDescription>
            Manage pre-delivery inspection templates for different vehicle types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="ri-table-row">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      <Badge variant="outline">
                        {getVehicleTypeLabel(template.vehicleType)}
                      </Badge>
                      {template.isActive ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          ACTIVE
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-50 text-gray-700 border-gray-200">
                          INACTIVE
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {template.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center">
                        <Clipboard className="h-3 w-3 mr-1 text-blue-500" />
                        {template.sections.length} sections
                      </span>
                      <span className="flex items-center">
                        <CheckSquare className="h-3 w-3 mr-1 text-green-500" />
                        {template.sections.reduce((sum, section) => sum + section.items.length, 0)} items
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ri-action-buttons">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => onViewTemplate(template)}
                  >
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => onEditTemplate(template)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm"
                    onClick={() => onDuplicateTemplate(template)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-sm text-red-600 hover:text-red-700"
                    onClick={() => onDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clipboard className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No templates found</p>
                <p className="text-sm">Create your first template to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}