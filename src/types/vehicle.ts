export enum VehicleStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RESERVED = 'reserved',
  SERVICE = 'service',
  DELIVERED = 'delivered'
}

export enum VehicleType {
  RV = 'rv',
  MOTORHOME = 'motorhome',
  TRAILER = 'trailer',
  FIFTH_WHEEL = 'fifth-wheel',
  TOY_HAULER = 'toy_hauler',
  SINGLE_WIDE = 'single_wide',
  DOUBLE_WIDE = 'double_wide',
  TRIPLE_WIDE = 'triple_wide',
  PARK_MODEL = 'park_model',
  MODULAR_HOME = 'modular_home'
}

export type VehicleStatusType = keyof typeof VehicleStatus;
export type VehicleTypeType = keyof typeof VehicleType;