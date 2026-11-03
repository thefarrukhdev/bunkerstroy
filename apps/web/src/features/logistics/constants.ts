import { LogisticsVehicle } from '@bunkerstroy/types';

export const DEFAULT_VEHICLES: LogisticsVehicle[] = [
  {
    id: 'veh-howo-01',
    name: 'HOWO Sinotruk 25t Samosval',
    type: 'DUMP_TRUCK',
    capacityTons: 25,
    volumeM3: 20,
    basePrice: 350000,
    pricePerKm: 18000,
    minDistanceKm: 10,
    plateNumber: '01 842 BBA',
    driverName: 'Dilshod Rahmatov',
    driverPhone: '+998 90 842 11 22',
    isAvailable: true,
    region: 'Toshkent shahri'
  },
  {
    id: 'veh-isuzu-02',
    name: 'Isuzu NPR Bortli / Manipulyator 10t',
    type: 'FLATBED',
    capacityTons: 10,
    volumeM3: 15,
    basePrice: 250000,
    pricePerKm: 14000,
    minDistanceKm: 5,
    plateNumber: '01 319 CBA',
    driverName: 'Sherzod Aliyev',
    driverPhone: '+998 93 319 44 55',
    isAvailable: true,
    region: 'Toshkent viloyati'
  },
  {
    id: 'veh-gazel-03',
    name: 'Gazel Next Bortli 3t',
    type: 'LIGHT_TRUCK',
    capacityTons: 3,
    volumeM3: 10,
    basePrice: 150000,
    pricePerKm: 9000,
    minDistanceKm: 5,
    plateNumber: '01 555 ABA',
    driverName: 'Akbar Norov',
    driverPhone: '+998 94 555 88 99',
    isAvailable: true,
    region: 'Toshkent shahri'
  },
  {
    id: 'veh-shacman-04',
    name: 'Shacman Avtobeton Mikser 10 m³',
    type: 'MIXER',
    capacityTons: 24,
    volumeM3: 10,
    basePrice: 400000,
    pricePerKm: 22000,
    minDistanceKm: 10,
    plateNumber: '01 991 DDA',
    driverName: 'Bobur Jalilov',
    driverPhone: '+998 97 991 33 22',
    isAvailable: true,
    region: 'Toshkent viloyati'
  }
];

export const POPULAR_ROUTES = [
  { origin: 'Bekobod Metallurgiya Kombinati', destination: 'Toshkent sh., Yunusobod', distanceKm: 145 },
  { origin: 'Ohangaron Sement Zavodi', destination: 'Toshkent sh., Sergeli', distanceKm: 65 },
  { origin: 'Keles daryosi shag‘al karyeri', destination: 'Toshkent sh., Olmazor', distanceKm: 22 },
  { origin: 'Chirchiq metall ombori', destination: 'Toshkent City Lot 4', distanceKm: 38 },
];
