// src/types/vehicle.ts
export enum VehicleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  SERVICE = 'service',
  DELIVERED = 'delivered'
}

export enum VehicleType {
  RV = 'rv',
  MOTORHOME = 'motorhome',
  TRAVEL_TRAILER = 'travel_trailer',
  FIFTH_WHEEL = 'fifth_wheel',
  TOY_HAULER = 'toy_hauler',
  SINGLE_WIDE = 'single_wide',
  DOUBLE_WIDE = 'double_wide',
  TRIPLE_WIDE = 'triple_wide',
  PARK_MODEL = 'park_model',
  MODULAR_HOME = 'modular_home'
}