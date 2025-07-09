// src/tests/mocks/useInventoryManagement.ts
import { Vehicle } from '@/types'

export function useInventoryManagement() {
  const vehicles: Vehicle[] = [
    {
      id: 'vehicle1',
      vin: '1HGBH41JXMN109186',
      make: 'Winnebago',
      model: 'Vista',
      year: 2024,
      type: 'motorhome', // Changed to match VehicleType
      status: 'available',
      price: 125000,
      // cost: 95000, // Removed as it's not in the Vehicle interface
      location: 'Lot A',
      // mileage: 1250, // Removed as it's not in the Vehicle interface
      // condition: 'new', // Removed as it's not in the Vehicle interface
      features: ['Generator', 'Solar Panel', 'Awning'],
      images: [], // Added as it's required by the Vehicle interface
      createdAt: new Date('2025-05-01T08:00:00Z'),
      updatedAt: new Date('2025-06-01T10:30:00Z')
    },
    {
      id: 'vehicle2',
      vin: '1HGBH41JXMN109187',
      make: 'Forest River',
      model: 'Cherokee',
      year: 2023,
      type: 'trailer', // Changed to match VehicleType
      status: 'sold',
      price: 35000,
      // cost: 28000, // Removed as it's not in the Vehicle interface
      location: 'Lot B',
      // mileage: 0, // Removed as it's not in the Vehicle interface
      // condition: 'new', // Removed as it's not in the Vehicle interface
      features: ['Slide Out', 'Air Conditioning'],
      images: [], // Added as it's required by the Vehicle interface
      createdAt: new Date('2025-04-15T09:00:00Z'),
      updatedAt: new Date('2025-06-10T14:20:00Z')
    },
    {
      id: 'vehicle3',
      vin: '1HGBH41JXMN109188',
      make: 'Keystone',
      model: 'Montana',
      year: 2024,
      type: 'fifth-wheel', // Changed to match VehicleType
      status: 'reserved',
      price: 68000,
      // cost: 52000, // Removed as it's not in the Vehicle interface
      location: 'Lot A',
      // mileage: 0, // Removed as it's not in the Vehicle interface
      // condition: 'new', // Removed as it's not in the Vehicle interface
      features: ['Fireplace', 'Washer/Dryer Prep', 'Island Kitchen'],
      images: [], // Added as it's required by the Vehicle interface
      createdAt: new Date('2025-05-20T11:00:00Z'),
      updatedAt: new Date('2025-06-15T16:45:00Z')
    }
  ]

  return {
    vehicles,
    loading: false,
    error: null,
    addVehicle: () => Promise.resolve(),
    updateVehicle: () => Promise.resolve(),
    deleteVehicle: () => Promise.resolve(),
    searchVehicles: () => vehicles,
    getVehiclesByStatus: (status: string) => vehicles.filter(v => v.status === status)
  }
}
