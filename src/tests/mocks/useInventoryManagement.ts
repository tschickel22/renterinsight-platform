// src/tests/mocks/useInventoryManagement.ts
export function useInventoryManagement() {
  const vehicles = [
    {
      id: 'vehicle1',
      vin: '1HGBH41JXMN109186',
      make: 'Winnebago',
      model: 'Vista',
      year: 2024,
      type: 'Class A',
      status: 'available',
      price: 125000,
      cost: 95000,
      location: 'Lot A',
      mileage: 1250,
      condition: 'new',
      features: ['Generator', 'Solar Panel', 'Awning'],
      createdAt: '2025-05-01T08:00:00Z',
      updatedAt: '2025-06-01T10:30:00Z'
    },
    {
      id: 'vehicle2',
      vin: '1HGBH41JXMN109187',
      make: 'Forest River',
      model: 'Cherokee',
      year: 2023,
      type: 'Travel Trailer',
      status: 'sold',
      price: 35000,
      cost: 28000,
      location: 'Lot B',
      mileage: 0,
      condition: 'new',
      features: ['Slide Out', 'Air Conditioning'],
      createdAt: '2025-04-15T09:00:00Z',
      updatedAt: '2025-06-10T14:20:00Z'
    },
    {
      id: 'vehicle3',
      vin: '1HGBH41JXMN109188',
      make: 'Keystone',
      model: 'Montana',
      year: 2024,
      type: 'Fifth Wheel',
      status: 'reserved',
      price: 68000,
      cost: 52000,
      location: 'Lot A',
      mileage: 0,
      condition: 'new',
      features: ['Fireplace', 'Washer/Dryer Prep', 'Island Kitchen'],
      createdAt: '2025-05-20T11:00:00Z',
      updatedAt: '2025-06-15T16:45:00Z'
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