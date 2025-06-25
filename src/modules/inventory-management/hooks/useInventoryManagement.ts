import { useState, useEffect } from 'react'
import { Vehicle, VehicleStatus, VehicleType } from '@/types'
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils'
import Papa from 'papaparse'

export function useInventoryManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const initializeMockData = () => {
    // Load existing vehicles from localStorage or use mock data
    const savedVehicles = loadFromLocalStorage('renter-insight-vehicles', [
      {
        id: '1',
        vin: '1FDXE4FS8KDC12345',
        make: 'Forest River',
        model: 'Georgetown',
        year: 2024,
        type: VehicleType.MOTORHOME,
        status: VehicleStatus.AVAILABLE,
        price: 125000,
        cost: 95000,
        location: 'Lot A-15',
        features: ['Slide-out', 'Generator', 'Solar Panel'],
        images: ['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
        customFields: {},
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        vin: '1FDXE4FS8KDC67890',
        make: 'Winnebago',
        model: 'View',
        year: 2023,
        type: VehicleType.RV,
        status: VehicleStatus.AVAILABLE,
        price: 89000,
        cost: 72000,
        location: 'Lot B-08',
        features: ['Compact Design', 'Fuel Efficient'],
        images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
        customFields: {},
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '3',
        vin: '1FDXE4FS8KDC11111',
        make: 'Jayco',
        model: 'Eagle',
        year: 2024,
        type: VehicleType.FIFTH_WHEEL,
        status: VehicleStatus.AVAILABLE,
        price: 75000,
        cost: 58000,
        location: 'Lot C-12',
        features: ['Bunk Beds', 'Outdoor Kitchen', 'Fireplace'],
        images: ['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
        customFields: {},
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '4',
        vin: '1FDXE4FS8KDC22222',
        make: 'Airstream',
        model: 'Flying Cloud',
        year: 2024,
        type: VehicleType.TRAVEL_TRAILER,
        status: VehicleStatus.AVAILABLE,
        price: 95000,
        cost: 78000,
        location: 'Lot D-05',
        features: ['Aluminum Construction', 'Premium Interior', 'Smart Technology'],
        images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
        customFields: {},
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: '5',
        vin: '1FDXE4FS8KDC33333',
        make: 'Grand Design',
        model: 'Momentum',
        year: 2023,
        type: VehicleType.TOY_HAULER,
        status: VehicleStatus.AVAILABLE,
        price: 110000,
        cost: 88000,
        location: 'Lot E-18',
        features: ['Garage Space', 'Fuel Station', 'Generator'],
        images: ['https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg'],
        customFields: {},
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: '6',
        vin: 'MH12345678901234',
        make: 'Clayton Homes',
        model: 'Inspiration',
        year: 2024,
        type: VehicleType.DOUBLE_WIDE,
        status: VehicleStatus.AVAILABLE,
        price: 125000,
        cost: 95000,
        location: 'MH Section A-10',
        features: ['3 Bedroom', '2 Bathroom', 'Open Floor Plan', 'Energy Efficient'],
        images: ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg'],
        customFields: {
          length: '76',
          width: '28',
          squareFootage: '2128',
          constructionType: 'Manufactured',
          roofType: 'Shingle',
          exteriorSiding: 'Vinyl',
          insulationRating: 'R-21'
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      }
    ])

    setVehicles(savedVehicles)
  }

  const saveVehiclesToStorage = (updatedVehicles: Vehicle[]) => {
    saveToLocalStorage('renter-insight-vehicles', updatedVehicles)
  }

  const getAvailableVehicles = () => {
    return vehicles.filter(vehicle => vehicle.status === VehicleStatus.AVAILABLE)
  }

  const getVehicleById = (id: string) => {
    return vehicles.find(vehicle => vehicle.id === id)
  }

  const updateVehicleStatus = async (vehicleId: string, status: VehicleStatus) => {
    const updatedVehicles = vehicles.map(vehicle =>
      vehicle.id === vehicleId
        ? { ...vehicle, status, updatedAt: new Date() }
        : vehicle
    )
    setVehicles(updatedVehicles)
    saveVehiclesToStorage(updatedVehicles)
  }

  const deleteVehicle = async (vehicleId: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId)
    setVehicles(updatedVehicles)
    saveVehiclesToStorage(updatedVehicles)
  }

  const createVehicle = async (vehicleData: Partial<Vehicle>) => {
    setLoading(true)
    try {
      const newVehicle: Vehicle = {
        id: Math.random().toString(36).substr(2, 9),
        vin: vehicleData.vin || '',
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        year: vehicleData.year || new Date().getFullYear(),
        type: vehicleData.type || VehicleType.RV,
        status: VehicleStatus.AVAILABLE,
        price: vehicleData.price || 0,
        cost: vehicleData.cost || 0,
        location: vehicleData.location || '',
        features: vehicleData.features || [],
        images: vehicleData.images || [],
        customFields: vehicleData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedVehicles = [...vehicles, newVehicle]
      setVehicles(updatedVehicles)
      saveVehiclesToStorage(updatedVehicles)

      return newVehicle
    } finally {
      setLoading(false)
    }
  }

  const importVehiclesFromCSV = async (file: File) => {
    return new Promise<Partial<Vehicle>[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const importedVehicles = results.data.map((row: any) => {
            return {
              vin: row.vin || '',
              make: row.make || '',
              model: row.model || '',
              year: parseInt(row.year) || new Date().getFullYear(),
              type: row.type as VehicleType || VehicleType.RV,
              status: row.status as VehicleStatus || VehicleStatus.AVAILABLE,
              price: parseFloat(row.price) || 0,
              cost: parseFloat(row.cost) || 0,
              location: row.location || '',
              features: row.features ? row.features.split(',').map((f: string) => f.trim()) : [],
              images: [],
              customFields: {
                exteriorColor: row.exteriorColor || '',
                interiorColor: row.interiorColor || '',
                length: row.length || '',
                weight: row.weight || '',
                sleeps: row.sleeps || '',
                slideouts: row.slideouts || '',
                fuelType: row.fuelType || '',
                mileage: row.mileage || '',
                condition: row.condition || 'New'
              }
            }
          })
          resolve(importedVehicles)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }

  const exportVehiclesToCSV = () => {
    const data = vehicles.map(vehicle => ({
      id: vehicle.id,
      vin: vehicle.vin,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      price: vehicle.price,
      cost: vehicle.cost,
      location: vehicle.location,
      features: vehicle.features.join(', '),
      exteriorColor: vehicle.customFields?.exteriorColor || '',
      interiorColor: vehicle.customFields?.interiorColor || '',
      length: vehicle.customFields?.length || '',
      weight: vehicle.customFields?.weight || '',
      sleeps: vehicle.customFields?.sleeps || '',
      slideouts: vehicle.customFields?.slideouts || '',
      fuelType: vehicle.customFields?.fuelType || '',
      mileage: vehicle.customFields?.mileage || '',
      condition: vehicle.customFields?.condition || ''
    }))

    const csv = Papa.unparse(data)
    return csv
  }

  return {
    vehicles,
    loading,
    getAvailableVehicles,
    getVehicleById,
    updateVehicleStatus,
    createVehicle,
    deleteVehicle,
    importVehiclesFromCSV,
    exportVehiclesToCSV
  }
}