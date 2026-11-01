-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPPLIER', 'CONTRACTOR', 'LOGISTICS_DRIVER', 'ESCO_AUDITOR', 'CLIENT');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INDIVIDUAL', 'LEGAL_ENTITY');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('DRAFT', 'PENDING_PAYMENT', 'PAID', 'ACCEPTED', 'PACKING', 'ASSIGNED', 'IN_TRANSIT', 'ARRIVED', 'FULLY_PAID', 'RECEIVED', 'COMPLETED', 'CANCELLED', 'DISPUTE', 'RETURN_REQUESTED', 'RETURNED', 'PENDING', 'CONFIRMED', 'ASSIGNED_TO_FLEET', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYME', 'CLICK', 'UZUM', 'BANK_TRANSFER', 'CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PREAUTHORIZED', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('FULL_100', 'SPLIT_50_50');

-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('LOCAL', 'GLOBAL');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('DUMP_TRUCK_SAMOSVAL', 'CONCRETE_MIXER', 'CRANE_MANIPULATOR', 'GAZEL_LIGHT_TRUCK', 'SEMI_TRAILER_FURA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "userType" "UserType" NOT NULL DEFAULT 'INDIVIDUAL',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "supplierType" "SupplierType" NOT NULL DEFAULT 'LOCAL',
    "isAllowedSplitPayment" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "inn" VARCHAR(9),
    "companyName" TEXT,
    "region" TEXT,
    "district" TEXT,
    "mahalla" TEXT,
    "contractNumber" TEXT,
    "eimzoSerialNumber" TEXT,
    "eimzoVerifiedAt" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "inn" VARCHAR(9) NOT NULL,
    "companyName" TEXT NOT NULL,
    "shortName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "statusDescription" TEXT NOT NULL DEFAULT 'Faol korxona',
    "director" TEXT,
    "address" TEXT,
    "region" TEXT,
    "district" TEXT,
    "registrationDate" TIMESTAMP(3),
    "activityType" TEXT,
    "vatPayer" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("inn")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "icon" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleRu" TEXT,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "price" DECIMAL(14,2) NOT NULL,
    "b2bPrice" DECIMAL(14,2),
    "unit" TEXT NOT NULL DEFAULT 'dona',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "minOrder" INTEGER NOT NULL DEFAULT 1,
    "energyEfficiencyRating" TEXT NOT NULL DEFAULT 'STANDARD',
    "isEscoCertified" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "descriptionRu" TEXT,
    "itemType" TEXT NOT NULL DEFAULT 'MATERIAL',
    "repairType" TEXT NOT NULL DEFAULT 'UNIVERSAL',
    "region" TEXT,
    "district" TEXT,
    "certificateUrl" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "warranty" TEXT,
    "hasDelivery" BOOLEAN NOT NULL DEFAULT true,
    "hasBonus" BOOLEAN NOT NULL DEFAULT false,
    "bonusDescription" TEXT,
    "bonusThreshold" DECIMAL(14,2),
    "bonusAmount" DECIMAL(14,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTieredPrice" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "minQty" INTEGER NOT NULL,
    "maxQty" INTEGER,
    "price" DECIMAL(14,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTieredPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "color" TEXT,
    "size" TEXT,
    "weight" TEXT,
    "length" TEXT,
    "priceDelta" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "totalAmount" DECIMAL(14,2) NOT NULL,
    "deliveryFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "finalAmount" DECIMAL(14,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'FULL_100',
    "firstPaymentAmount" DECIMAL(14,2),
    "secondPaymentAmount" DECIMAL(14,2),
    "isFirstPaid" BOOLEAN NOT NULL DEFAULT false,
    "isSecondPaid" BOOLEAN NOT NULL DEFAULT false,
    "acceptanceCode" TEXT,
    "isAcceptanceCodeRevealed" BOOLEAN NOT NULL DEFAULT false,
    "arrivedAt" TIMESTAMP(3),
    "waitingDeadline" TIMESTAMP(3),
    "deliveryRegion" TEXT NOT NULL,
    "deliveryDistrict" TEXT NOT NULL,
    "deliveryStreet" TEXT,
    "deliveryLandmark" TEXT,
    "deliveryLat" DOUBLE PRECISION,
    "deliveryLng" DOUBLE PRECISION,
    "vehicleType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "subTotal" DECIMAL(14,2) NOT NULL,
    "deliveryFee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "acceptanceCode" TEXT,
    "arrivedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "driverId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "subOrderId" TEXT,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "totalPrice" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL DEFAULT 'FULL',
    "amount" DECIMAL(14,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "qrReceiptUrl" TEXT,
    "rawWebhookData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "openedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "evidenceUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "resolutionNote" TEXT,
    "refundAmount" DECIMAL(14,2),
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerIntegration" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPERATIONAL',
    "contractEnd" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartnerIntegration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsVehicle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "plateNumber" TEXT,
    "capacityTons" DOUBLE PRECISION NOT NULL,
    "basePrice" DECIMAL(12,2) NOT NULL,
    "pricePerKm" DECIMAL(12,2) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "driverName" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "currentLocationName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogisticsVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogisticsDispatch" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "vehicleId" TEXT,
    "driverId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "acceptanceCode" TEXT,
    "acceptancePhotoUrl" TEXT,
    "loadedAt" TIMESTAMP(3),
    "loadingPhotoUrl" TEXT,
    "arrivedAt" TIMESTAMP(3),
    "waitingTimerExpiresAt" TIMESTAMP(3),
    "issueReason" TEXT,
    "issuePhotoUrl" TEXT,
    "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "LogisticsDispatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscoAudit" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "buildingType" TEXT NOT NULL,
    "areaM2" DOUBLE PRECISION NOT NULL,
    "currentEnergyUsageKwh" DOUBLE PRECISION NOT NULL,
    "estimatedSavingsPct" DOUBLE PRECISION NOT NULL,
    "annualSavingsSum" DECIMAL(14,2) NOT NULL,
    "paybackYears" DOUBLE PRECISION NOT NULL,
    "co2ReductionTons" DOUBLE PRECISION NOT NULL,
    "recommendations" TEXT[],
    "insulationAdvice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscoAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "previousState" JSONB,
    "newState" JSONB,
    "ipAddress" TEXT,
    "level" TEXT NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_inn_idx" ON "User"("inn");

-- CreateIndex
CREATE INDEX "User_supplierType_idx" ON "User"("supplierType");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId");

-- CreateIndex
CREATE INDEX "Product_region_idx" ON "Product"("region");

-- CreateIndex
CREATE INDEX "ProductTieredPrice_productId_idx" ON "ProductTieredPrice"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_buyerId_idx" ON "Order"("buyerId");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_paymentMode_idx" ON "Order"("paymentMode");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_buyerId_createdAt_idx" ON "Order"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "SubOrder_orderId_idx" ON "SubOrder"("orderId");

-- CreateIndex
CREATE INDEX "SubOrder_supplierId_idx" ON "SubOrder"("supplierId");

-- CreateIndex
CREATE INDEX "SubOrder_driverId_idx" ON "SubOrder"("driverId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_subOrderId_idx" ON "OrderItem"("subOrderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_transactionId_key" ON "PaymentTransaction"("transactionId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_orderId_idx" ON "PaymentTransaction"("orderId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE INDEX "Dispute_orderId_idx" ON "Dispute"("orderId");

-- CreateIndex
CREATE INDEX "Dispute_openedById_idx" ON "Dispute"("openedById");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerIntegration_code_key" ON "PartnerIntegration"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LogisticsVehicle_plateNumber_key" ON "LogisticsVehicle"("plateNumber");

-- CreateIndex
CREATE INDEX "LogisticsDispatch_orderId_idx" ON "LogisticsDispatch"("orderId");

-- CreateIndex
CREATE INDEX "LogisticsDispatch_vehicleId_idx" ON "LogisticsDispatch"("vehicleId");

-- CreateIndex
CREATE INDEX "LogisticsDispatch_driverId_idx" ON "LogisticsDispatch"("driverId");

-- CreateIndex
CREATE INDEX "LogisticsDispatch_status_idx" ON "LogisticsDispatch"("status");

-- CreateIndex
CREATE INDEX "LogisticsDispatch_dispatchedAt_idx" ON "LogisticsDispatch"("dispatchedAt");

-- CreateIndex
CREATE INDEX "EscoAudit_clientId_idx" ON "EscoAudit"("clientId");

-- CreateIndex
CREATE INDEX "EscoAudit_createdAt_idx" ON "EscoAudit"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_category_idx" ON "AuditLog"("category");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inn_fkey" FOREIGN KEY ("inn") REFERENCES "Company"("inn") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTieredPrice" ADD CONSTRAINT "ProductTieredPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOrder" ADD CONSTRAINT "SubOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOrder" ADD CONSTRAINT "SubOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubOrder" ADD CONSTRAINT "SubOrder_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_subOrderId_fkey" FOREIGN KEY ("subOrderId") REFERENCES "SubOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsDispatch" ADD CONSTRAINT "LogisticsDispatch_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsDispatch" ADD CONSTRAINT "LogisticsDispatch_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "LogisticsVehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogisticsDispatch" ADD CONSTRAINT "LogisticsDispatch_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscoAudit" ADD CONSTRAINT "EscoAudit_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

