import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X, Upload, Check, AlertTriangle, FileText } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { useToast } from '@/hooks/use-toast'
import Papa from 'papaparse'

interface CSVImportProps {
  onImport: (vehicles: Partial<Vehicle>[]) => Promise<void>
  onCancel: () => void
}

export function CSVImport({ onImport, onCancel }: CSVImportProps) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  
  const requiredFields = ['vin', 'make', 'model', 'year', 'price', 'cost']
  const vehicleFields = [
    { key: 'vin', label: 'VIN' },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'cost', label: 'Cost' },
    { key: 'location', label: 'Location' },
    { key: 'features', label: 'Features' },
    { key: 'exteriorColor', label: 'Exterior Color' },
    { key: 'interiorColor', label: 'Interior Color' },
    { key: 'length', label: 'Length' },
    { key: 'weight', label: 'Weight' },
    { key: 'sleeps', label: 'Sleeps' },
    { key: 'slideouts', label: 'Slideouts' },
    { key: 'fuelType', label: 'Fuel Type' },
    { key: 'mileage', label: 'Mileage' },
    { key: 'condition', label: 'Condition' }
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedData(results.data)
          
          // Auto-map columns if headers match
          if (results.meta.fields) {
            const autoMappings: Record<string, string> = {}
            
            results.meta.fields.forEach(field => {
              const normalizedField = field.toLowerCase().replace(/[^a-z0-9]/g, '')
              
              vehicleFields.forEach(vField => {
                const normalizedVField = vField.key.toLowerCase()
                if (normalizedField === normalizedVField || 
                    normalizedField === vField.label.toLowerCase().replace(/[^a-z0-9]/g, '')) {
                  autoMappings[field] = vField.key
                }
              })
            })
            
            setMappings(autoMappings)
          }
          
          setStep('map')
        },
        error: (error) => {
          toast({
            title: 'Error Parsing CSV',
            description: error.message,
            variant: 'destructive'
          })
        }
      })
    }
  }

  const handleMappingChange = (csvField: string, vehicleField: string) => {
    setMappings(prev => ({
      ...prev,
      [csvField]: vehicleField
    }))
  }

  const handlePreview = () => {
    // Check if all required fields are mapped
    const mappedRequiredFields = requiredFields.filter(field => 
      Object.values(mappings).includes(field)
    )
    
    if (mappedRequiredFields.length < requiredFields.length) {
      toast({
        title: 'Missing Required Fields',
        description: `Please map all required fields: ${requiredFields.join(', ')}`,
        variant: 'destructive'
      })
      return
    }
    
    setStep('preview')
    // Select all rows by default
    setSelectedRows(parsedData.map((_, index) => index))
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(parsedData.map((_, index) => index))
    } else {
      setSelectedRows([])
    }
  }

  const toggleSelectRow = (rowIndex: number) => {
    if (selectedRows.includes(rowIndex)) {
      setSelectedRows(selectedRows.filter(i => i !== rowIndex))
    } else {
      setSelectedRows([...selectedRows, rowIndex])
    }
  }

  const handleImport = async () => {
    if (selectedRows.length === 0) {
      toast({
        title: 'No Rows Selected',
        description: 'Please select at least one row to import',
        variant: 'destructive'
      })
      return
    }
    
    setLoading(true)
    try {
      const vehiclesToImport = selectedRows.map(rowIndex => {
        const row = parsedData[rowIndex]
        const vehicle: Partial<Vehicle> = {
          images: [],
          features: [],
          customFields: {}
        }
        
        // Map fields according to user mappings
        Object.entries(mappings).forEach(([csvField, vehicleField]) => {
          const value = row[csvField]
          
          if (vehicleField === 'features') {
            // Handle features as comma-separated list
            vehicle.features = value ? value.split(',').map((f: string) => f.trim()) : []
          } else if (vehicleField === 'year' || vehicleField === 'price' || vehicleField === 'cost') {
            // Handle numeric fields
            vehicle[vehicleField as keyof Vehicle] = parseFloat(value) || 0
          } else if (vehicleField === 'type') {
            // Handle enum fields
            vehicle.type = validateVehicleType(value)
          } else if (vehicleField === 'status') {
            // Handle enum fields
            vehicle.status = validateVehicleStatus(value)
          } else if (['exteriorColor', 'interiorColor', 'length', 'weight', 'sleeps', 
                      'slideouts', 'fuelType', 'mileage', 'condition'].includes(vehicleField)) {
            // Handle custom fields
            vehicle.customFields = {
              ...vehicle.customFields,
              [vehicleField]: value
            }
          } else {
            // Handle standard fields
            (vehicle as any)[vehicleField] = value
          }
        })
        
        return vehicle
      })
      
      await onImport(vehiclesToImport)
      
      toast({
        title: 'Import Successful',
        description: `Imported ${vehiclesToImport.length} vehicles`,
      })
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'There was an error importing the vehicles',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const validateVehicleType = (value: string): VehicleType => {
    const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    if (normalizedValue.includes('motorhome')) return VehicleType.MOTORHOME
    if (normalizedValue.includes('travel') && normalizedValue.includes('trailer')) return VehicleType.TRAVEL_TRAILER
    if (normalizedValue.includes('fifth') && normalizedValue.includes('wheel')) return VehicleType.FIFTH_WHEEL
    if (normalizedValue.includes('toy') && normalizedValue.includes('hauler')) return VehicleType.TOY_HAULER
    
    return VehicleType.RV
  }

  const validateVehicleStatus = (value: string): VehicleStatus => {
    const normalizedValue = value.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    if (normalizedValue.includes('reserved')) return VehicleStatus.RESERVED
    if (normalizedValue.includes('sold')) return VehicleStatus.SOLD
    if (normalizedValue.includes('service')) return VehicleStatus.SERVICE
    if (normalizedValue.includes('delivered')) return VehicleStatus.DELIVERED
    
    return VehicleStatus.AVAILABLE
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Import Inventory from CSV</CardTitle>
              <CardDescription>
                {step === 'upload' && 'Upload a CSV file with your inventory data'}
                {step === 'map' && 'Map CSV columns to vehicle fields'}
                {step === 'preview' && 'Preview and select vehicles to import'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Upload a CSV file with your inventory data
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="max-w-sm mx-auto"
                />
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">CSV Format Guidelines</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• File should be in CSV format</li>
                  <li>• First row should contain column headers</li>
                  <li>• Required fields: VIN, Make, Model, Year, Price, Cost</li>
                  <li>• Features should be comma-separated within quotes</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {step === 'map' && (
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {file?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {parsedData.length} rows found
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Map CSV Columns to Vehicle Fields</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Required fields are marked with *
                </p>
                
                <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                  {file && parsedData.length > 0 && Object.keys(parsedData[0]).map((csvField) => (
                    <div key={csvField} className="flex items-center space-x-4">
                      <div className="w-1/3 font-medium truncate">{csvField}</div>
                      <div className="w-2/3">
                        <select
                          value={mappings[csvField] || ''}
                          onChange={(e) => handleMappingChange(csvField, e.target.value)}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">-- Skip this field --</option>
                          {vehicleFields.map((field) => (
                            <option key={field.key} value={field.key}>
                              {field.label} {requiredFields.includes(field.key) ? '*' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button onClick={handlePreview}>
                  Preview Data
                </Button>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={selectedRows.length === parsedData.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <Label>Select All ({parsedData.length} vehicles)</Label>
                </div>
                <Badge>
                  {selectedRows.length} selected
                </Badge>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-2 text-left"></th>
                        {Object.entries(mappings)
                          .filter(([_, vehicleField]) => vehicleField)
                          .map(([csvField, vehicleField]) => (
                            <th key={csvField} className="p-2 text-left text-sm">
                              {vehicleField}
                              {requiredFields.includes(vehicleField) && <span className="text-red-500">*</span>}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t hover:bg-muted/10">
                          <td className="p-2">
                            <Checkbox 
                              checked={selectedRows.includes(rowIndex)}
                              onCheckedChange={() => toggleSelectRow(rowIndex)}
                            />
                          </td>
                          {Object.entries(mappings)
                            .filter(([_, vehicleField]) => vehicleField)
                            .map(([csvField, _]) => (
                              <td key={csvField} className="p-2 text-sm">
                                {row[csvField] || <span className="text-muted-foreground italic">Empty</span>}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setStep('map')}>
                  Back to Mapping
                </Button>
                <Button onClick={handleImport} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {selectedRows.length} Vehicles
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}