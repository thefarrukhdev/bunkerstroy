import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { LogisticsVehicle } from '@bunkerstroy/types';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculateQuoteDto, DispatchOrderDto } from './dto/logistics.dto';

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly defaultVehicles: LogisticsVehicle[] = [
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
      imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800',
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
      imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800',
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
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    },
  ];

  async getVehicles(): Promise<LogisticsVehicle[]> {
    try {
      const dbVehicles = await this.prisma.logisticsVehicle.findMany({
        orderBy: { createdAt: 'desc' },
      });

      if (dbVehicles && dbVehicles.length > 0) {
        return dbVehicles.map((v) => ({
          id: v.id,
          name: v.name,
          type: v.type as any,
          plateNumber: v.plateNumber || '01 777 BSK',
          capacityTons: v.capacityTons,
          basePrice: Number(v.basePrice),
          pricePerKm: Number(v.pricePerKm),
          isAvailable: v.isAvailable,
          driverName: v.driverName,
          driverPhone: v.driverPhone,
          currentLocationName: v.currentLocationName,
          imageUrl: v.imageUrl,
        }));
      }
    } catch (err: any) {
      this.logger.warn(`Prisma LogisticsService getVehicles warning: ${err?.message}`);
    }

    return this.defaultVehicles;
  }

  async calculateQuote(dto: CalculateQuoteDto) {
    const { vehicleId, distanceKm, cargoWeightTons } = dto;
    const vehicles = await this.getVehicles();

    let vehicle = vehicles.find((v) => v.id === vehicleId || v.name === vehicleId);
    if (!vehicle) {
      vehicle =
        vehicles.find((v) => v.capacityTons >= cargoWeightTons) || vehicles[0];
    }

    const baseCost = Number(vehicle.basePrice);
    const distanceCost = distanceKm * Number(vehicle.pricePerKm);
    const totalCost = baseCost + distanceCost;

    return {
      vehicle,
      distanceKm,
      cargoWeightTons,
      baseCost,
      distanceCost,
      totalCost,
      estimatedHours: Math.round((distanceKm / 35) * 10) / 10 + 1,
      currency: "so'm",
    };
  }

  async dispatchOrder(dto: DispatchOrderDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: dto.orderId }, { orderNumber: dto.orderId }],
      },
    });

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${dto.orderId}`);
    }

    const vehicle = await this.prisma.logisticsVehicle.findFirst({
      where: {
        OR: [{ id: dto.vehicleId }, { name: dto.vehicleId }],
      },
    });

    const basePrice = vehicle ? Number(vehicle.basePrice) : 450000;
    const pricePerKm = vehicle ? Number(vehicle.pricePerKm) : 18000;
    const totalCost = basePrice + dto.distanceKm * pricePerKm;

    const dispatch = await this.prisma.logisticsDispatch.create({
      data: {
        orderId: order.id,
        vehicleId: vehicle?.id || null,
        driverId: dto.driverId || null,
        status: 'ASSIGNED',
        origin: dto.origin,
        destination: dto.destination,
        distanceKm: dto.distanceKm,
        totalCost,
      },
      include: {
        order: true,
        vehicle: true,
      },
    });

    // Update order status to ASSIGNED_TO_FLEET
    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'ASSIGNED_TO_FLEET' },
    });

    return dispatch;
  }
}
