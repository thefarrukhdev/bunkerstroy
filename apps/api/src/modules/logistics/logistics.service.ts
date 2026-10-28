import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import crypto from 'crypto';
import { LogisticsVehicle } from '@bunkerstroy/types';
import { Role, OrderStatus, PaymentMode, Prisma } from '@bunkerstroy/db';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { AuditLogService } from '../admin/audit-log.service';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { timingSafePinCompare } from '../../common';
import {
  CalculateQuoteDto,
  DispatchOrderDto,
  DispatchStatusType,
  DriverMarkLoadedDto,
  DriverVerifyCodeDto,
  DriverReportIssueDto,
} from './dto/logistics.dto';

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogService: AuditLogService,
    private readonly redis: RedisService,
  ) {}

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
          type: v.type as LogisticsVehicle['type'],
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Prisma LogisticsService getVehicles warning: ${message}`);
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

  async dispatchOrder(dto: DispatchOrderDto, currentUser?: CurrentUserPayload) {
    const vehicle = await this.prisma.logisticsVehicle.findFirst({
      where: {
        OR: [{ id: dto.vehicleId }, { name: dto.vehicleId }],
      },
    });

    const basePrice = vehicle ? Number(vehicle.basePrice) : 450000;
    const pricePerKm = vehicle ? Number(vehicle.pricePerKm) : 18000;
    const totalCost = basePrice + dto.distanceKm * pricePerKm;

    let order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: dto.orderId }, { orderNumber: dto.orderId }],
      },
    });

    if (!order) {
      if (
        dto.orderId === 'EXPRESS' ||
        dto.orderId?.startsWith('EXPRESS') ||
        dto.orderId?.startsWith('BS-EXP') ||
        !dto.orderId
      ) {
        const fallbackUserId = currentUser?.id;
        const dbUser = fallbackUserId
          ? await this.prisma.user.findUnique({ where: { id: fallbackUserId } })
          : await this.prisma.user.findFirst();

        if (dbUser) {
          order = await this.prisma.order.create({
            data: {
              orderNumber: `BS-EXP-${Date.now().toString(36).toUpperCase()}-${crypto.randomInt(1000, 10000)}`,
              buyerId: dbUser.id,
              totalAmount: totalCost,
              deliveryFee: totalCost,
              finalAmount: totalCost,
              status: 'ASSIGNED_TO_FLEET',
              deliveryRegion: dto.destination.split(',')[0] || 'Toshkent shahri',
              deliveryDistrict: dto.destination.split(',')[1] || 'Toshkent',
              deliveryStreet: dto.destination,
              vehicleType: vehicle?.name || 'Maxsus transport',
            },
          });
        }
      }
    }

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi: ${dto.orderId}`);
    }

    const targetOrderId = order.id;
    const orderNumber = order.orderNumber;

    const dispatch = await this.prisma.$transaction(async (tx) => {
      const createdDispatch = await tx.logisticsDispatch.create({
        data: {
          orderId: targetOrderId,
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
          driver: true,
        },
      });

      await tx.order.update({
        where: { id: targetOrderId },
        data: { status: 'ASSIGNED_TO_FLEET' },
      });

      if (vehicle?.id) {
        await tx.logisticsVehicle.update({
          where: { id: vehicle.id },
          data: { isAvailable: false },
        });
      }

      return createdDispatch;
    });

    await this.auditLogService.logAction({
      actorId: dto.driverId || currentUser?.id || null,
      action: 'LOGISTICS_DISPATCH',
      category: 'LOGISTICS',
      details: `Buyurtmaga (${orderNumber}) maxsus texnika biriktirildi. Narx: ${totalCost} so'm`,
      level: 'INFO',
    });

    return dispatch;
  }

  async getDispatches(currentUser: CurrentUserPayload) {
    const where: Prisma.LogisticsDispatchWhereInput = {};
    if (currentUser.role === Role.LOGISTICS_DRIVER) {
      where.driverId = currentUser.id;
    }

    return this.prisma.logisticsDispatch.findMany({
      where,
      include: {
        order: true,
        vehicle: true,
        driver: true,
      },
      orderBy: { dispatchedAt: 'desc' },
    });
  }

  async updateDispatchStatus(
    dispatchId: string,
    status: DispatchStatusType,
    currentUser: CurrentUserPayload,
  ) {
    const dispatch = await this.prisma.logisticsDispatch.findUnique({
      where: { id: dispatchId },
      include: { order: true },
    });

    if (!dispatch) {
      throw new NotFoundException(
        `Dispetcherlik buyurtmasi topilmadi (ID: ${dispatchId})`,
      );
    }

    if (
      currentUser.role === Role.LOGISTICS_DRIVER &&
      dispatch.driverId &&
      dispatch.driverId !== currentUser.id
    ) {
      throw new ForbiddenException(
        "Faqat o'zingizga biriktirilgan dispetcherlik holatini o'zgartirishingiz mumkin",
      );
    }

    const dataToUpdate: Prisma.LogisticsDispatchUpdateInput = { status };
    if (status === 'DELIVERED') {
      dataToUpdate.deliveredAt = new Date();
    }

    const updatedDispatch = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.logisticsDispatch.update({
        where: { id: dispatchId },
        data: dataToUpdate,
        include: {
          order: true,
          vehicle: true,
          driver: true,
        },
      });

      if (status === 'IN_TRANSIT') {
        await tx.order.update({
          where: { id: dispatch.orderId },
          data: { status: OrderStatus.IN_TRANSIT },
        });
      } else if (status === 'DELIVERED') {
        await tx.order.update({
          where: { id: dispatch.orderId },
          data: { status: OrderStatus.DELIVERED },
        });
        if (dispatch.vehicleId) {
          await tx.logisticsVehicle.updateMany({
            where: { id: dispatch.vehicleId },
            data: { isAvailable: true },
          });
        }
      }

      return updated;
    });

    await this.auditLogService.logAction({
      actorId: currentUser.id,
      action: 'LOGISTICS_DISPATCH_STATUS_UPDATED',
      category: 'LOGISTICS',
      details: `Dispetcherlik (${dispatchId}) holati ${dispatch.status} dan ${status} ga o'zgartirildi`,
      level: 'INFO',
    });

    return updatedDispatch;
  }

  async driverMarkLoaded(
    dispatchId: string,
    dtoOrPhotoUrl: DriverMarkLoadedDto | string | undefined,
    currentUser: CurrentUserPayload
  ) {
    const dispatch = await this.prisma.logisticsDispatch.findUnique({
      where: { id: dispatchId },
      include: { order: true },
    });
    if (!dispatch) throw new NotFoundException('Dispetcherlik topilmadi');

    if (
      currentUser.role === Role.LOGISTICS_DRIVER &&
      dispatch.driverId &&
      dispatch.driverId !== currentUser.id
    ) {
      throw new ForbiddenException(
        "Faqat o'zingizga biriktirilgan dispetcherlik vazifasini yangilashingiz mumkin"
      );
    }

    const photoUrl =
      typeof dtoOrPhotoUrl === 'string'
        ? dtoOrPhotoUrl
        : dtoOrPhotoUrl?.photoUrl;

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedDispatch = await tx.logisticsDispatch.update({
        where: { id: dispatchId },
        data: {
          status: 'IN_TRANSIT',
          loadedAt: new Date(),
          loadingPhotoUrl: photoUrl || null,
        },
      });

      await tx.order.update({
        where: { id: dispatch.orderId },
        data: { status: OrderStatus.IN_TRANSIT },
      });

      return updatedDispatch;
    });

    await this.auditLogService.logAction({
      actorId: currentUser.id,
      action: 'DRIVER_CARGO_LOADED',
      category: 'LOGISTICS',
      details: `Haydovchi yukni ortdi va yo‘lga chiqdi. Dispetcherlik: ${dispatchId}`,
      level: 'INFO',
    });

    return updated;
  }

  async driverMarkArrived(dispatchId: string, currentUser: CurrentUserPayload) {
    const dispatch = await this.prisma.logisticsDispatch.findUnique({
      where: { id: dispatchId },
      include: { order: true },
    });
    if (!dispatch) throw new NotFoundException('Dispetcherlik topilmadi');

    if (
      currentUser.role === Role.LOGISTICS_DRIVER &&
      dispatch.driverId &&
      dispatch.driverId !== currentUser.id
    ) {
      throw new ForbiddenException(
        "Faqat o'zingizga biriktirilgan dispetcherlik vazifasini yangilashingiz mumkin"
      );
    }

    const waitingDeadline = new Date(Date.now() + 30 * 60 * 1000); // 30 min timer

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedDispatch = await tx.logisticsDispatch.update({
        where: { id: dispatchId },
        data: {
          status: 'ARRIVED',
          arrivedAt: new Date(),
          waitingTimerExpiresAt: waitingDeadline,
        },
      });

      await tx.order.update({
        where: { id: dispatch.orderId },
        data: {
          status: OrderStatus.ARRIVED,
          arrivedAt: new Date(),
          waitingDeadline,
          isAcceptanceCodeRevealed:
            dispatch.order.paymentMode === PaymentMode.FULL_100 || dispatch.order.isSecondPaid,
        },
      });

      return updatedDispatch;
    });

    await this.auditLogService.logAction({
      actorId: currentUser.id,
      action: 'DRIVER_ARRIVED_AT_DESTINATION',
      category: 'LOGISTICS',
      details: `Haydovchi manzilga yetib keldi. Buyurtma: ${dispatch.order.orderNumber}. 30 daqiqalik taymer boshlandi`,
      level: 'INFO',
    });

    return updated;
  }

  async driverVerifyAcceptanceCode(
    dispatchId: string,
    dtoOrCode: DriverVerifyCodeDto | string,
    photoUrlOrUser?: string | CurrentUserPayload,
    maybeUser?: CurrentUserPayload
  ) {
    const dispatch = await this.prisma.logisticsDispatch.findUnique({
      where: { id: dispatchId },
      include: { order: true },
    });
    if (!dispatch) throw new NotFoundException('Dispetcherlik topilmadi');

    let code: string;
    let photoUrl: string | undefined;
    let currentUser: CurrentUserPayload;

    if (typeof dtoOrCode === 'string') {
      code = dtoOrCode;
      photoUrl = typeof photoUrlOrUser === 'string' ? photoUrlOrUser : undefined;
      currentUser = (maybeUser || photoUrlOrUser) as CurrentUserPayload;
    } else {
      code = dtoOrCode?.code ?? '';
      photoUrl = dtoOrCode?.photoUrl;
      currentUser = photoUrlOrUser as CurrentUserPayload;
    }

    if (
      currentUser?.role === Role.LOGISTICS_DRIVER &&
      dispatch.driverId &&
      dispatch.driverId !== currentUser.id
    ) {
      throw new ForbiddenException(
        "Faqat o'zingizga biriktirilgan dispetcherlik vazifasini yangilashingiz mumkin"
      );
    }

    // PIN brute force protection via Redis (5 failed attempts locks for 15 minutes)
    const attemptsKey = `pin_failed_attempts:${dispatch.order.id}`;
    const failedAttemptsStr = await this.redis.get(attemptsKey);
    const failedAttempts = failedAttemptsStr ? parseInt(failedAttemptsStr, 10) : 0;

    if (failedAttempts >= 5) {
      throw new BadRequestException(
        'PIN kod ketma-ket 5 marta noto‘g‘ri kiritildi. Xavfsizlik yuzasidan buyurtma 15 daqiqaga bloklandi!'
      );
    }

    const trimmedCode = code ? code.trim() : '';
    if (!trimmedCode) {
      throw new BadRequestException('Mijoz qabul kodi kiritilishi shart');
    }

    if (
      dispatch.order.paymentMode === PaymentMode.SPLIT_50_50 &&
      !dispatch.order.isSecondPaid
    ) {
      throw new BadRequestException(
        'Ikkinchi 50% to‘lov hali to‘lanmagan. Yukni topshirish mumkin emas!'
      );
    }

    const isPinValid = timingSafePinCompare(dispatch.order.acceptanceCode || '', trimmedCode);

    if (!isPinValid) {
      const newAttempts = failedAttempts + 1;
      await this.redis.set(attemptsKey, newAttempts.toString(), 900); // 15 mins TTL

      if (newAttempts >= 5) {
        throw new BadRequestException(
          'PIN kod ketma-ket 5 marta noto‘g‘ri kiritildi. Xavfsizlik yuzasidan buyurtma 15 daqiqaga bloklandi!'
        );
      }

      throw new BadRequestException(
        'Mijoz taqdim etgan qabul kodi xato! Iltimos, mijozdan tasdiqlangan PIN kodni oling.'
      );
    }

    // Successful PIN verification -> clear failed attempts counter
    await this.redis.del(attemptsKey);

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedDispatch = await tx.logisticsDispatch.update({
        where: { id: dispatchId },
        data: {
          status: 'DELIVERED',
          acceptanceCode: trimmedCode,
          acceptancePhotoUrl: photoUrl || null,
          deliveredAt: new Date(),
        },
      });

      // Update Order to COMPLETED and mark SubOrders
      await tx.order.update({
        where: { id: dispatch.orderId },
        data: { status: OrderStatus.COMPLETED },
      });

      await tx.subOrder.updateMany({
        where: { orderId: dispatch.orderId },
        data: {
          status: OrderStatus.COMPLETED,
          completedAt: new Date(),
        },
      });

      // Release vehicle availability
      if (dispatch.vehicleId) {
        await tx.logisticsVehicle.updateMany({
          where: { id: dispatch.vehicleId },
          data: { isAvailable: true },
        });
      }

      return updatedDispatch;
    });

    await this.auditLogService.logAction({
      actorId: currentUser?.id || 'DRIVER',
      action: 'DRIVER_CODE_VERIFIED_AND_DELIVERED',
      category: 'ESCROW',
      details: `Haydovchi qabul kodini muvaffaqiyatli tasdiqladi. Yuk topshirildi va Escrow ajratildi: ${dispatch.order.orderNumber}`,
      level: 'INFO',
    });

    return updated;
  }

  async driverReportIssue(
    dispatchId: string,
    dtoOrReason: DriverReportIssueDto | string,
    photoUrlOrUser?: string | CurrentUserPayload,
    maybeUser?: CurrentUserPayload
  ) {
    const dispatch = await this.prisma.logisticsDispatch.findUnique({
      where: { id: dispatchId },
      include: { order: true },
    });
    if (!dispatch) throw new NotFoundException('Dispetcherlik topilmadi');

    let reason: string;
    let photoUrl: string | undefined;
    let currentUser: CurrentUserPayload;

    if (typeof dtoOrReason === 'string') {
      reason = dtoOrReason;
      photoUrl = typeof photoUrlOrUser === 'string' ? photoUrlOrUser : undefined;
      currentUser = (maybeUser || photoUrlOrUser) as CurrentUserPayload;
    } else {
      reason = dtoOrReason?.reason ?? '';
      photoUrl = dtoOrReason?.photoUrl;
      currentUser = photoUrlOrUser as CurrentUserPayload;
    }

    if (
      currentUser?.role === Role.LOGISTICS_DRIVER &&
      dispatch.driverId &&
      dispatch.driverId !== currentUser.id
    ) {
      throw new ForbiddenException(
        "Faqat o'zingizga biriktirilgan dispetcherlik vazifasini yangilashingiz mumkin"
      );
    }

    const updated = await this.prisma.logisticsDispatch.update({
      where: { id: dispatchId },
      data: {
        issueReason: reason,
        issuePhotoUrl: photoUrl || null,
      },
    });

    await this.auditLogService.logAction({
      actorId: currentUser?.id || 'DRIVER',
      action: 'DRIVER_ISSUE_REPORTED',
      category: 'LOGISTICS',
      details: `Haydovchi muammo qayd etdi: "${reason}". Buyurtma: ${dispatch.order.orderNumber}`,
      level: 'WARN',
    });

    return updated;
  }
}
