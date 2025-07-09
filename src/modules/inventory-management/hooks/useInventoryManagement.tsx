import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  vin: string
  stockNumber: string
  status: 'available' | 'sold' | 'reserved' | 'service'
  price: number
  mileage: number
  color: string
  transmission: string
  fuelType: string
  features: string[]
  images: string[]
  location: string
  createdAt: string
  updatedAt: string
}

export function useInventoryManagement() {
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `VEH-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setVehicles(prev => [...prev, newVehicle])
    toast({
      title: 'Vehicle Added',
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} has been added to inventory`
    })
  }, [toast])

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id 
        ? { ...vehicle, ...updates, updatedAt: new Date().toISOString() }
        : vehicle
    ))
    toast({
      title: 'Vehicle Updated',
      description: 'Vehicle information has been updated'
    })
  }, [toast])

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id))
    toast({
      title: 'Vehicle Removed',
      description: 'Vehicle has been removed from inventory'
    })
  }, [toast])

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchTerm === '' || 
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return {
    vehicles: filteredVehicles,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    addVehicle,
    updateVehicle,
    deleteVehicle
  }
}