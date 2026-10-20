export type VehicleType =
  | 'DUMP_TRUCK_SAMOSVAL'
  | 'CONCRETE_MIXER'
  | 'CRANE_MANIPULATOR'
  | 'GAZEL_LIGHT_TRUCK'
  | 'SEMI_TRAILER_FURA';

export type VehicleStatus = 'AVAILABLE' | 'ON_ROUTE' | 'MAINTENANCE';

export interface VehicleItem {
  id: string;
  name: string;
  type: VehicleType;
  typeLabel: string;
  plateNumber: string;
  capacityTons: number;
  capacityVolumeM3?: number;
  basePrice: number;
  pricePerKm: number;
  status: VehicleStatus;
  driverName: string;
  driverPhone: string;
  currentLocationName: string;
  assignedOrderId?: string;
  updatedAt: string;
}

export interface DispatchRecord {
  id: string;
  orderNumber: string;
  clientCompanyName: string;
  destination: string;
  vehicleId: string;
  vehicleName: string;
  plateNumber: string;
  driverName: string;
  driverPhone: string;
  distanceKm: number;
  calculatedFee: number;
  status: 'ASSIGNED' | 'EN_ROUTE' | 'DELIVERED';
  assignedAt: string;
}

export const INITIAL_VEHICLES: VehicleItem[] = [
  {
    id: 'veh-1',
    name: 'HOWO Sinotruk 25t Samosval',
    type: 'DUMP_TRUCK_SAMOSVAL',
    typeLabel: 'Og‘ir Samosval (25t)',
    plateNumber: '01 721 AAA',
    capacityTons: 25,
    capacityVolumeM3: 18,
    basePrice: 500000,
    pricePerKm: 18000,
    status: 'ON_ROUTE',
    driverName: 'Sodiqov Murod',
    driverPhone: '+998901114455',
    currentLocationName: 'Toshkent sh., Yunusobod yo‘nalishida',
    assignedOrderId: '#ORD-9021',
    updatedAt: '2026-10-20 11:20'
  },
  {
    id: 'veh-2',
    name: 'Shacman F3000 Beton Mikser (10 m³)',
    type: 'CONCRETE_MIXER',
    typeLabel: 'Beton Mikser (10m³)',
    plateNumber: '30 450 BBA',
    capacityTons: 28,
    capacityVolumeM3: 10,
    basePrice: 600000,
    pricePerKm: 22000,
    status: 'AVAILABLE',
    driverName: 'Xalilov Bekzod',
    driverPhone: '+998935558899',
    currentLocationName: 'Samarqand Beton Zavodi Bazasi',
    updatedAt: '2026-10-20 13:00'
  },
  {
    id: 'veh-3',
    name: 'HOWO A7 Og‘ir Samosval 30t',
    type: 'DUMP_TRUCK_SAMOSVAL',
    typeLabel: 'Og‘ir Samosval (30t)',
    plateNumber: '01 888 CCC',
    capacityTons: 30,
    capacityVolumeM3: 22,
    basePrice: 550000,
    pricePerKm: 20000,
    status: 'AVAILABLE',
    driverName: 'Karimov Rustam',
    driverPhone: '+998973332211',
    currentLocationName: 'Sergeli Logistika Parki',
    updatedAt: '2026-10-20 12:45'
  },
  {
    id: 'veh-4',
    name: 'Kamaz Kran-Manipulyator (12t kran / 15t bort)',
    type: 'CRANE_MANIPULATOR',
    typeLabel: 'Kran-Manipulyator',
    plateNumber: '10 112 DDA',
    capacityTons: 15,
    basePrice: 450000,
    pricePerKm: 16000,
    status: 'AVAILABLE',
    driverName: 'Ergashev Sherzod',
    driverPhone: '+998994441122',
    currentLocationName: 'Toshkent viloyati, Zangiota Bazasi',
    updatedAt: '2026-10-20 10:15'
  },
  {
    id: 'veh-5',
    name: 'Isuzu NPR Gazel-Yuk (5t yengil bort)',
    type: 'GAZEL_LIGHT_TRUCK',
    typeLabel: 'Yengil Yuk Transporti',
    plateNumber: '01 555 EEE',
    capacityTons: 5,
    capacityVolumeM3: 16,
    basePrice: 200000,
    pricePerKm: 8000,
    status: 'MAINTENANCE',
    driverName: 'Yo‘ldoshev Anvar',
    driverPhone: '+998912228899',
    currentLocationName: 'BunkerStroy Avtoservis Parki (Ta’mirda)',
    updatedAt: '2026-10-19 16:30'
  }
];

export const INITIAL_DISPATCHES: DispatchRecord[] = [
  {
    id: 'disp-1',
    orderNumber: '#ORD-9021',
    clientCompanyName: '«GOLDEN HOUSE STROY» MChJ',
    destination: 'Toshkent sh., Yunusobod tumani, Amir Temur 107',
    vehicleId: 'veh-1',
    vehicleName: 'HOWO Sinotruk 25t Samosval',
    plateNumber: '01 721 AAA',
    driverName: 'Sodiqov Murod',
    driverPhone: '+998901114455',
    distanceKm: 38.5,
    calculatedFee: 1200000,
    status: 'EN_ROUTE',
    assignedAt: '2026-10-20 09:30'
  },
  {
    id: 'disp-2',
    orderNumber: '#ORD-9024',
    clientCompanyName: '«CHILONZOR B2B SERVIS» MChJ',
    destination: 'Toshkent sh., Chilonzor tumani, Qatortol 23',
    vehicleId: 'veh-5',
    vehicleName: 'Isuzu NPR Gazel-Yuk (5t)',
    plateNumber: '01 555 EEE',
    driverName: 'Yo‘ldoshev Anvar',
    driverPhone: '+998912228899',
    distanceKm: 18.0,
    calculatedFee: 450000,
    status: 'DELIVERED',
    assignedAt: '2026-10-19 10:15'
  }
];
