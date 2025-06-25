import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'
import { Vehicle, VehicleStatus, VehicleType, VehicleCategory } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface CSVHandlerProps {
  vehicles: Vehicle[]
  onImport: (vehicles: Partial<Vehicle>[]) => Promise<void>
  onExport: () => void
}

export function CSVHandler({ vehicles, onImport, onExport }: CSVHandlerProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    try {
      // Define CSV headers
      const headers = [
        'vin',
        'make',
        'model',
        'year',
        'category',
        'type',
        'status',
        'price',
        'cost',
        'location',
        'features',
        'images',
        'videos',
        'customFields'
      ]

      // Convert vehicles to CSV rows
      const rows = vehicles.map(vehicle => [
        vehicle.vin,
        vehicle.make,
        vehicle.model,
        vehicle.year,
        vehicle.category,
        vehicle.type,
        vehicle.status,
        vehicle.price,
        vehicle.cost,
        vehicle.location,
        JSON.stringify(vehicle.features),
        JSON.stringify(vehicle.images),
        JSON.stringify(vehicle.videos || []),
        JSON.stringify(vehicle.customFields)
      ])

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')

      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: 'Export Successful',
        description: `${vehicles.length} vehicles exported to CSV`,
      })

      onExport()
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the inventory',
        variant: 'destructive'
      })
    }
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const rows = text.split('\n')
      const headers = rows[0].split(',')
      
      const importedVehicles: Partial<Vehicle>[] = []
      
      // Process each row (skip header)
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue
        
        const values = rows[i].split(',')
        const vehicle: Partial<Vehicle> = {}
        
        // Map CSV values to vehicle properties
        headers.forEach((header, index) => {
          if (values[index] !== undefined) {
            switch (header) {
              case 'vin':
              case 'make':
              case 'model':
              case 'location':
                vehicle[header] = values[index]
                break
              case 'year':
              case 'price':
              case 'cost':
                vehicle[header] = parseFloat(values[index])
                break
              case 'category':
                vehicle.category = values[index] as VehicleCategory
                break
              case 'type':
                vehicle.type = values[index] as VehicleType
                break
              case 'status':
                vehicle.status = values[index] as VehicleStatus
                break
              case 'features':
              case 'images':
              case 'videos':
                try {
                  vehicle[header] = JSON.parse(values[index])
                } catch {
                  vehicle[header] = []
                }
                break
              case 'customFields':
                try {
                  vehicle.customFields = JSON.parse(values[index])
                } catch {
                  vehicle.customFields = {}
                }
                break
            }
          }
        })
        
        if (vehicle.vin) {
          importedVehicles.push(vehicle)
        }
      }
      
      if (importedVehicles.length > 0) {
        await onImport(importedVehicles)
        
        toast({
          title: 'Import Successful',
          description: `${importedVehicles.length} vehicles imported from CSV`,
        })
      } else {
        toast({
          title: 'Import Warning',
          description: 'No valid vehicles found in the CSV file',
          variant: 'destructive'
        })
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: 'Import Failed',
        description: 'There was an error importing the CSV file',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="flex space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button variant="outline" onClick={handleImportClick} className="shadow-sm">
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>
      <Button variant="outline" onClick={handleExport} className="shadow-sm">
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
    </div>
  )
}