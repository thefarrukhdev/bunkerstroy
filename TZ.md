# 📋 TEXNIK VAZIFA (TZ) — BunkerStroy Backend Core Ekotizimi

**Loyiha:** `BunkerStroy Enterprise Backend`  
**Yo‘nalish:** B2B Qurilish Mollari Marketplace, Og‘ir Logistika Hub, ESCO Energiya Auditi va AI Platformasi  
**Hujjat versiyasi:** `1.0.0-ENTERPRISE`  
**Mas’ul:** Lead Software Engineer & Solutions Architect  
**Holati:** Tasdiqlangan / Amalga oshirish bosqichida  

---

## 📌 1. Loyihaning Maqsadi va Umumiy Konsepsiyasi

**BunkerStroy Backend** — O‘zbekiston Respublikasi qurilish sanoati, yirik pudratchilar, qurilish mollari ishlab chiqaruvchilari (sement zavodlari, metallurgiya kombinatlari), maxsus og‘ir texnika parklari hamda binolar energiya samaradorligi (ESCO) auditorlari uchun mo‘ljallangan markaziy yuqori yuklamali (high-load) korporativ server tizimidir.

Backendning asosiy maqsadi:
1. **Shaffof B2B Ulgurji Savdo:** Ko‘p tonnali qurilish materiallarini (sement, armatura, g‘isht, bazalt) zaxiralar kafolati va qat'iy narx nazorati bilan sotish.
2. **Aqlli Og‘ir Logistika:** HOWO samosvallari, beton mikserlari va kran-manipulyatorlar marshrutini PostGIS orqali aniq hisoblash va haydovchilar bilan buyurtmalarni bog‘lash.
3. **Davlat va Huquqiy Integratsiyalar:** O‘zbekiston Davlat Soliq Qo‘mitasi (STIR/INN) ochiq bazasi, E-IMZO (PKCS#7) elektron raqamli imzosi va Eskiz.uz SMS shlyuzi orqali 100% verifikatsiyalangan yuridik bitimlar tuzish.
4. **Fintech Xavfsizligi:** Payme (JSON-RPC 2.0 Basic Auth), Click (MD5 hash signature) va B2B to‘lov shartnomalarini avtomatlashtirish.
5. **ESCO Energiya Auditi:** O‘zbekiston iqlim zonasi (SNiP / QMQ talablari) bo‘yicha binolarning issiqlik yo‘qotilishini termodinamik hisoblash va energiya tejamkorlik auditini shakllantirish.

---

## 🛠️ 2. Texnologik Stek va Talablar

| Yo‘nalish | Tanlangan Texnologiya | Versiya | Maqsadi va Vazifasi |
| :--- | :--- | :--- | :--- |
| **Backend Freymvork** | **NestJS** | `11.x` | Modulli, korporativ darajadagi TypeScript REST API & WebSocket tizimi |
| **Dasturlash Tili** | **TypeScript** | `5.8.x` | 100% qat'iy statik tiplashtirish (`strict: true`), Typebox/Zod validatsiyasi |
| **Ma'lumotlar Bazasi** | **PostgreSQL + PostGIS** | `16-3.4` | Relyatsion ma'lumotlar, geofazoviy koordinatalar, masofa va radius qidiruvi |
| **ORM** | **Prisma ORM** | `6.5.x` | Tip-xavfsiz migratsiyalar, tranzaksiyalar va ma'lumotlar modellash |
| **In-Memory & Kesh** | **Redis** | `7.x` | Sessiyalar, OTP cheklovlari (Rate limit), tokenlar qora ro‘yxati (Blacklist) |
| **Raqamli Imzo** | **E-IMZO (PKCS#7)** | `v2 API` | Yuridik shaxslar uchun elektron raqamli imzo tekshiruvi |
| **SMS Provayder** | **Eskiz.uz** | REST API | Tranzaksiyaviy OTP va buyurtma holati xabarnomalari |
| **Hujjatlashtirish** | **Swagger / OpenAPI 3** | `@nestjs/swagger` | Barcha endpointlar, DTO lar va Bearer Auth hujjatlari (`/api/docs`) |

---

## 🏗️ 3. Tizim Arxitekturasi va Backend Modullari

```
apps/api/src/
├── app.module.ts              # Asosiy ildiz moduli
├── main.ts                    # Bootstrap, Swagger, CORS, WebSocket gateway ulanishi
├── common/                    # Umumiy infrastruktura
│   ├── decorators/            # @CurrentUser(), @Roles(), @Public()
│   ├── filters/               # AllExceptionsFilter, PrismaExceptionFilter
│   ├── guards/                # JwtAuthGuard, RolesGuard, RateLimitGuard
│   ├── interceptors/          # LoggingInterceptor, TransformResponseInterceptor
│   └── pipes/                 # Custom ZodValidationPipe
├── config/                    # Zod asosidagi type-safe env konfiguratsiyasi
├── prisma/                    # PrismaService (uLANISh, graceful shutdown)
└── modules/
    ├── auth/                  # STIR Lookup, E-IMZO, Eskiz SMS OTP, Login, Refresh, Me
    ├── catalog/               # Tovarlar, Zaxiralar, Kategoriyalar, MOQ, Filtrlash
    ├── orders/                # Buyurtmalar, Savat, Server-side Narx tekshiruvi (CWE-472)
    ├── logistics/             # HOWO/Shacman parki, PostGIS masofa & narx kalkulyatori
    ├── esco/                  # Bino issiqlik fizikasi va termodinamik energiya auditi
    ├── payments/              # Payme (JSON-RPC 2.0), Click (MD5 Webhook), Uzum
    └── admin/                 # Boshqaruv metrikalari, Ta'minotchilar, AuditLog jurnali
```

---

## 🧩 4. Modullar Bo‘yicha Qat'iy Texnik Talablar

### 4.1. `AuthModule` (Autentifikatsiya va Yuridik Identifikatsiya)
- **STIR (INN) Lookup (`GET /api/auth/stir-lookup`):**
  - Kiruvchi parametr: `inn` (aynan 9 ta raqam, regextan o‘tishi shart).
  - O‘zbekiston DSQ Ochiq Ma'lumotlar bazasiga so‘rov yuborish, natijalarni Redis'da 24 soat keshlashtirish.
- **E-IMZO PKCS#7 Verifikatsiya (`POST /api/auth/eimzo/challenge` va `verify`):**
  - Bir martalik challenge (nonce) yaratish (TTL: 5 daqiqa, Redis'da saqlash).
  - Mijozdan kelgan PKCS#7 base64 imzosini tekshirish, STIR OID (`1.2.860.3.16.1.1`) va yuridik shaxs nomini ajratib olish.
  - Muvaffaqiyatli o‘tganda JWT Access (7d) va Refresh Token (30d) yaratish, `user` obyektini qaytarish.
- **Eskiz.uz SMS OTP (`POST /api/auth/send-otp` va `verify-otp`):**
  - Telefon raqami `+998XXXXXXXXX` formatida tekshiriladi.
  - 6 xonali tasodifiy kod yaratilib, Redis'da 2 daqiqa TTL bilan saqlanadi (1 daqiqada 1 tadan ortiq yuborish taqiqlanadi — rate limit).
  - **Muhim Xavfsizlik Qoidasi:** OTP kod **hech qachon** HTTP JSON javobida mijozga qaytarilmaydi!
- **Sessiyani tiklash (`GET /api/auth/me`):**
  - JWT tokendan foydalanuvchi `id`, `role`, `inn`, `companyName`, `phone` ma'lumotlarini bazadan olib qaytarish.

### 4.2. `CatalogModule` (Qurilish Mollari va Zaxiralar)
- **Katalog ro‘yxati (`GET /api/catalog/products`):**
  - Filtrlash: `category`, `region`, `escoOnly`, `query` (nomi yoki tavsifi bo‘yicha to‘liq matnli qidiruv).
  - Paginatsiya: `page`, `limit` (default: 20, max: 100).
  - Barcha ma'lumotlar Prisma orqali PostgreSQL bazasidan olinadi (`include: { supplier: true, variants: true }`).
- **Zaxiralarni boshqarish:**
  - Har bir tovar uchun minimal buyurtma hajmi (`minOrder`) va o‘lchov birligi (`BAG_50KG`, `TON`, `SQ_METER`, `PIECE`) majburiy.

### 4.3. `OrdersModule` (Buyurtmalar va Kassa Xavfsizligi)
- **Kritik Xavfsizlik Qoidasi (CWE-472 profilaktikasi):**
  - Mijoz faqat `productId` va `quantity` yuboradi. Tovar narxi (`price`) **hech qachon mijozdan qabul qilinmaydi**.
  - Server har bir tovar narxini Prisma orqali bazadan o‘qiydi, `totalPrice = product.price * quantity` ni serverda hisoblaydi.
  - Yetkazib berish narxi masofaga qarab hisoblanadi.
- **Tranzaksion Butunlik (ACID):**
  - Buyurtma yaratish Prisma Interactive Transaction (`prisma.$transaction`) orqali bajariladi: tovar zaxirasi tekshiriladi, buyurtma yoziladi, tovar zaxirasi kamaytiriladi (`stock = stock - quantity`).

### 4.4. `LogisticsModule` (Og‘ir Maxsus Texnika va Marshrutlar)
- **Avtopark boshqaruvi (`GET /api/logistics/vehicles`):**
  - Texnika turlari: `DUMP_TRUCK_SAMOSVAL` (HOWO 25t), `CONCRETE_MIXER` (Shacman 10m³), `CRANE_MANIPULATOR` (Isuzu 10t), `SEMI_TRAILER_FURA`.
- **Kalkulyator (`POST /api/logistics/calculate`):**
  - Yuk og‘irligi (tonna) va masofasi (km) bo‘yicha mos texnikani avtomatik tanlash.
  - Formula: `totalCost = vehicle.basePrice + (distanceKm * vehicle.pricePerKm)`.
  - PostGIS koordinatalari (`ST_DistanceSphere` / `ST_MakePoint`) orqali eng yaqin karyer yoki bazadan mijoz manziliga masofani aniqlash.

### 4.5. `EscoModule` (Binolar Energiya Auditi)
- **Auditorlik kiritish parametrlari:**
  - Bino maydoni (`areaM2`), yillik energiya sarfi (`currentEnergyUsageKwh`), devor materiali, deraza profili.
- **Termodinamik modellashtirish:**
  - O‘zbekiston iqlim zonasi (SNiP / QMQ talablari) asosida tahlil qilish.
  - Metrikalar: `energySavingsPercent`, `paybackYears`, `annualSavingsSum`, `co2ReductionTons`, `recommendedMaterials` qaytarish.

### 4.6. `PaymentsModule` (Fintech To‘lov Shlyuzlari)
- **Payme Webhook (`POST /api/payments/payme`):**
  - Payme JSON-RPC 2.0 spetsifikatsiyasi.
  - **Xavfsizlik:** `Authorization: Basic base64(Paycom:PAYME_SECRET_KEY)` sarlavhasi qat'iy tekshiriladi.
  - Metodlar: `CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction`, `CancelTransaction`, `CheckTransaction`.
  - Tiyin hisobi: 1 so‘m = 100 tiyin.
- **Click Webhook (`POST /api/payments/click`):**
  - **Xavfsizlik:** MD5 hash tekshiruvi: `md5(click_trans_id + service_id + CLICK_SECRET_KEY + merchant_trans_id + amount + action + sign_time)`.
  - Harakatlar: `Prepare` (action = 0) va `Complete` (action = 1).
  - To‘lov tasdiqlanganda bazadagi `Order.status = 'PAID'` holatiga o‘tadi.

### 4.7. `AdminModule` (Boshqaruv, Moliyaviy Tahlil va Audit)
- **Kirish huquqi:** Faqat `ADMIN` roli uchun (`@UseGuards(JwtAuthGuard, RolesGuard)`).
- **AuditLog:** Tizimdagi har bir nozik amal (katalog narxini o‘zgartirish, buyurtmani bekor qilish, E-IMZO tekshiruvi) `AuditLog` jadvaliga yozib boriladi (Actor, IP, Category, Level, Details).
- **PII Himoyasi:** `/api/admin/orders` da mijozlarning shaxsiy ma'lumotlari faqat vakolatli xodimlarga ko‘rinadi.

---

## 🗄️ 5. Ma'lumotlar Bazasi Sxemasi (Prisma Modellar Strukturasi)

Quyidagi modellar PostgreSQL bazasida to‘liq migratsiya qilinishi shart:
1. `User` (id, phone, email, passwordHash, role, userType, inn, companyName, verificationStatus)
2. `Company` (inn, companyName, director, address, region, district, vatPayer, verifiedAt)
3. `Category` (id, name, slug, description, icon)
4. `Product` (id, title, slug, price, unit, stock, minOrder, energyEfficiencyRating, isEscoCertified, images)
5. `ProductVariant` (id, productId, sku, color, size, priceDelta, stock)
6. `Order` (id, orderNumber, buyerId, totalAmount, deliveryFee, finalAmount, status, deliveryAddress)
7. `OrderItem` (id, orderId, productId, quantity, unit, unitPrice, totalPrice)
8. `PaymentTransaction` (id, orderId, provider, transactionId, amount, status, rawWebhookData)
9. `LogisticsVehicle` (id, name, type, capacityTons, basePrice, pricePerKm, isAvailable, driverPhone)
10. `LogisticsDispatch` (id, orderId, vehicleId, driverId, status, distanceKm, totalCost)
11. `EscoAudit` (id, clientId, buildingType, areaM2, estimatedSavingsPct, annualSavingsSum, paybackYears)
12. `AuditLog` (id, actorId, action, category, details, ipAddress, level, createdAt)

---

## 🛡️ 6. Xavfsizlik va Ishonchlilik Standartlari

1. **CORS:** `origin: ['http://localhost:3000', 'http://localhost:3001', 'https://*.bunkerstroy.uz']` (Wildcard `*` qat'iyan man etiladi).
2. **Rate Limiting (Throttler):**
   - Umumiy API: 60 soniyada 100 ta so‘rov.
   - SMS / Auth endpointlari: 60 soniyada 5 ta so‘rov (Brute-force hujumlaridan himoya).
3. **Kiruvchi Ma'lumotlar Validatsiyasi (DTO):**
   - Barcha controllerlar `class-validator` va `class-transformer` orqali qat'iy tekshiriladi (`whitelist: true, forbidNonWhitelisted: true`).
4. **Parollar Shifrlanishi:**
   - `bcrypt` orqali kamida 10 ta salt round bilan xeshlanadi.

---

## 📅 7. Ishlab Chiqish Bosqichlari (Sprintlar Rejasi)

- **Sprint 1 (Baza va Xavfsizlik Poyi):**
  - Docker PostgreSQL (PostGIS) va Redisni ko‘tarish, Prisma migratsiyasini bajarish va seed ma'lumotlarini bazaga quyish.
  - NestJS JwtAuthGuard, RolesGuard va DTO validatsiyalarini o‘rnatish.
- **Sprint 2 (B2B Marketplace & Checkout Engine):**
  - `CatalogService` va `OrdersService` ni 100% Prisma ORM ga o‘tkazish.
  - Server-side narx va zaxira tekshiruvini qat'iy joriy etish.
- **Sprint 3 (Fintech & Davlat Xizmatlari Integratsiyasi):**
  - Payme (Basic Auth) va Click (MD5) webhooklarini to‘liq imzolash.
  - E-IMZO va Eskiz SMS xizmatlarini jonli API ga tayyorlash.
- **Sprint 4 (Og‘ir Logistika & ESCO Energiya Auditi):**
  - PostGIS masofa hisob-kitobini ulash.
  - ESCO termodinamik hisob-kitoblari va audit jurnallashini to‘liq yakunlash.

---
*Ushbu Texnik Vazifa BunkerStroy platformasining barqaror, xavfsiz va kengayuvchan (scalable) arxitekturasini ta'minlash uchun qat'iy dasturilamal hisoblanadi.*
