import { Injectable } from '@nestjs/common';
import { LogisticsVehicle } from '@bunkerstroy/types';

@Injectable()
export class LogisticsService {
  private vehicles: LogisticsVehicle[] = [
    {
      id: 'veh-1',
      name: 'HOWO Sinotruk Samosval (25t)',
      type: 'DUMP_TRUCK_SAMOSVAL',
      plateNumber: '01 777 BSK',
      capacityTons: 25,
      basePrice: 450000,
      pricePerKm: 18000,
      isAvailable: true,
      driverName: 'Sherzod Baxtiyorov',
      driverPhone: '+998901114455',
      currentLocationName: 'Keles qum-shag‘al karyeri',
      imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800'
    },
    {
      id: 'veh-2',
      name: 'ISUZU Forward Kran-Manipulyator (10t)',
      type: 'CRANE_MANIPULATOR',
      plateNumber: '01 888 BSK',
      capacityTons: 10,
      basePrice: 550000,
      pricePerKm: 16000,
      isAvailable: true,
      driverName: 'Dilshod Rahmatov',
      driverPhone: '+998935552211',
      currentLocationName: 'Toshkent sh., Bekto‘pi bozori',
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800'
    },
    {
      id: 'veh-3',
      name: 'Shacman Beton Mikser (10 m³)',
      type: 'CONCRETE_MIXER',
      plateNumber: '01 999 BSK',
      capacityTons: 24,
      basePrice: 600000,
      pricePerKm: 22000,
      isAvailable: true,
      driverName: 'Ulug‘bek Rustamov',
      driverPhone: '+998943338877',
      currentLocationName: 'Sergeli RBU Zavodi №2',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800'
    }
  ];

  getVehicles() {
    return this.vehicles;
  }

  calculateQuote(vehicleId: string, distanceKm: number, cargoWeightTons: number) {
    let vehicle = this.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) {
      vehicle = this.vehicles.find((v) => v.capacityTons >= cargoWeightTons) || this.vehicles[0];
    }

    const baseCost = vehicle.basePrice;
    const distanceCost = distanceKm * vehicle.pricePerKm;
    const totalCost = baseCost + distanceCost;

    return {
      vehicle,
      distanceKm,
      cargoWeightTons,
      baseCost,
      distanceCost,
      totalCost,
      estimatedHours: Math.round((distanceKm / 35) * 10) / 10 + 1,
      currency: "so'm"
    };
  }
}
