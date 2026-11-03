import fs from 'node:fs';
import path from 'node:path';

const entries = [
  // ==========================================
  // Brand & Navigation
  // ==========================================
  // brand.*
  {
    key: 'brand.name',
    uz: 'BunkerStroy',
    ru: 'BunkerStroy',
    en: 'BunkerStroy'
  },
  {
    key: 'brand.tagline',
    uz: 'Sanoat va qurilish materiallarining milliy raqamli ekotizimi',
    ru: 'Национальная цифровая экосистема промышленных и строительных материалов',
    en: 'National Digital Ecosystem for Industrial & Construction Materials'
  },
  {
    key: 'brand.description',
    uz: 'O‘zbekiston bo‘ylab ta‘minotchi zavodlar, ulgurji dilerlar, qurilish ob‘ektlari va og‘ir maxsus texnika parklarini yagona xavfsiz B2B platformada birlashtiramiz.',
    ru: 'Центральная B2B-платформа, объединяющая заводы-производители, оптовых дилеров, строительные объекты и парки тяжелой спецтехники Узбекистана.',
    en: 'Central B2B platform connecting manufacturers, wholesale dealers, construction sites, and heavy fleet operators across Uzbekistan.'
  },
  {
    key: 'brand.shortDescription',
    uz: 'B2B Qurilish Mollari & Og‘ir Logistika Hub',
    ru: 'B2B Маркетплейс Стройматериалов и Тяжелой Логистики',
    en: 'B2B Construction Materials & Heavy Logistics Hub'
  },
  {
    key: 'brand.legalEntity',
    uz: '«BUNKER STROY HOLDING» MCHJ',
    ru: 'ООО «BUNKER STROY HOLDING»',
    en: 'LLC "BUNKER STROY HOLDING"'
  },
  {
    key: 'brand.inn',
    uz: 'STIR / INN: 309887712',
    ru: 'ИНН: 309887712',
    en: 'Tax ID (INN): 309887712'
  },
  {
    key: 'brand.copyright',
    uz: '© 2026 BunkerStroy. Barcha huquqlar himoyalangan.',
    ru: '© 2026 BunkerStroy. Все права защищены.',
    en: '© 2026 BunkerStroy. All rights reserved.'
  },
  {
    key: 'brand.license',
    uz: 'O‘zbekiston Respublikasi Qurilish vazirligi va ShNQ standartlariga muvofiq sertifikatlangan',
    ru: 'Сертифицировано в соответствии со стандартами Минстроя РУз и ШНК',
    en: 'Certified compliant with Ministry of Construction of Uzbekistan and ShNQ standards'
  },
  {
    key: 'brand.supportPhone',
    uz: '+998 (95) 082-1336',
    ru: '+998 (95) 082-1336',
    en: '+998 (95) 082-1336'
  },
  {
    key: 'brand.supportEmail',
    uz: 'info@bunkerstroy.uz',
    ru: 'info@bunkerstroy.uz',
    en: 'info@bunkerstroy.uz'
  },

  // nav.*
  {
    key: 'nav.home',
    uz: 'Asosiy',
    ru: 'Главная',
    en: 'Home'
  },
  {
    key: 'nav.catalog',
    uz: 'Mahsulotlar Katalogi',
    ru: 'Каталог товаров',
    en: 'Product Catalog'
  },
  {
    key: 'nav.suppliers',
    uz: 'Zavodlar va Ta‘minotchilar',
    ru: 'Заводы и поставщики',
    en: 'Factories & Suppliers'
  },
  {
    key: 'nav.logistics',
    uz: 'Og‘ir Logistika & Texnika',
    ru: 'Тяжелая логистика и техника',
    en: 'Heavy Logistics & Fleet'
  },
  {
    key: 'nav.calculators',
    uz: 'Muhandislik Kalkulyatorlari',
    ru: 'Инженерные калькуляторы',
    en: 'Engineering Calculators'
  },
  {
    key: 'nav.tenders',
    uz: 'B2B Tenderlar',
    ru: 'Корпоративные тендеры',
    en: 'Corporate Tenders'
  },
  {
    key: 'nav.orders',
    uz: 'Mening buyurtmalarim',
    ru: 'Мои заказы',
    en: 'My Orders'
  },
  {
    key: 'nav.cart',
    uz: 'Savat',
    ru: 'Корзина',
    en: 'Shopping Cart'
  },
  {
    key: 'nav.cabinet',
    uz: 'Shaxsiy Kabinet',
    ru: 'Личный кабинет',
    en: 'Dashboard'
  },
  {
    key: 'nav.sellerPortal',
    uz: 'Hamkor & Sotuvchi Portali',
    ru: 'Портал партнеров',
    en: 'Partner & Seller Portal'
  },
  {
    key: 'nav.contact',
    uz: 'Aloqa va Qo‘llab-quvvatlash',
    ru: 'Контакты и поддержка',
    en: 'Contact & Support'
  },
  {
    key: 'nav.about',
    uz: 'Biz haqimizda',
    ru: 'О платформе',
    en: 'About Us'
  },
  {
    key: 'nav.faq',
    uz: 'Ko‘p beriladigan savollar',
    ru: 'Частые вопросы (FAQ)',
    en: 'Frequently Asked Questions'
  },
  {
    key: 'nav.terms',
    uz: 'Foydalanish shartlari',
    ru: 'Условия использования',
    en: 'Terms of Service'
  },
  {
    key: 'nav.privacy',
    uz: 'Maxfiylik siyosati',
    ru: 'Политика конфиденциальности',
    en: 'Privacy Policy'
  },
  {
    key: 'nav.regionSelect',
    uz: 'Hududni tanlang',
    ru: 'Выберите регион',
    en: 'Select Region'
  },
  {
    key: 'nav.allRegions',
    uz: 'Barcha viloyatlar',
    ru: 'Все регионы',
    en: 'All Regions'
  },
  {
    key: 'nav.searchPlaceholder',
    uz: 'Tovar, zavod yoki GOST bo‘yicha qidiring...',
    ru: 'Поиск по товару, заводу или ГОСТу...',
    en: 'Search by product, factory, or GOST...'
  },
  {
    key: 'nav.callCenter',
    uz: '24/7 Call-markaz',
    ru: 'Круглосуточный колл-центр',
    en: '24/7 Call Center'
  },
  {
    key: 'nav.openMenu',
    uz: 'Menyu ochish',
    ru: 'Открыть меню',
    en: 'Open Menu'
  },
  {
    key: 'nav.closeMenu',
    uz: 'Menyuni yopish',
    ru: 'Закрыть меню',
    en: 'Close Menu'
  },
  {
    key: 'nav.telegramChannel',
    uz: 'Rasmiy Telegram kanal',
    ru: 'Официальный Telegram-канал',
    en: 'Official Telegram Channel'
  },
  {
    key: 'nav.notifications',
    uz: 'Bildirishnomalar',
    ru: 'Уведомления',
    en: 'Notifications'
  },
  {
    key: 'nav.profile',
    uz: 'Profil',
    ru: 'Профиль',
    en: 'Profile'
  },

  // cabinets.*
  {
    key: 'cabinets.client.title',
    uz: 'Mijoz Kabineti',
    ru: 'Кабинет покупателя',
    en: 'Buyer Dashboard'
  },
  {
    key: 'cabinets.client.subtitle',
    uz: 'Buyurtmalar, Hisob-faktura va Escrow holati',
    ru: 'Заказы, счета-фактуры и статус эскроу',
    en: 'Orders, Invoices & Escrow Status'
  },
  {
    key: 'cabinets.client.badge',
    uz: 'XARIDOR',
    ru: 'ПОКУПАТЕЛЬ',
    en: 'BUYER'
  },
  {
    key: 'cabinets.seller.title',
    uz: 'Hamkor & Sotuvchi Kabineti',
    ru: 'Кабинет партнера и продавца',
    en: 'Partner & Seller Dashboard'
  },
  {
    key: 'cabinets.seller.subtitle',
    uz: 'Zavodlar ulgurji savdosi, Do‘kon Kassa / POS CRM',
    ru: 'Оптовые продажи заводов, касса магазина / POS CRM',
    en: 'Factory Wholesale, Store POS & CRM'
  },
  {
    key: 'cabinets.seller.badge',
    uz: 'ZAVOD & DO‘KON',
    ru: 'ЗАВОД И МАГАЗИН',
    en: 'FACTORY & STORE'
  },
  {
    key: 'cabinets.admin.title',
    uz: 'Admin Kabineti',
    ru: 'Панель администратора',
    en: 'Superadmin Console'
  },
  {
    key: 'cabinets.admin.subtitle',
    uz: 'BunkerStroy markaziy monitoring & nazorat',
    ru: 'Центральный мониторинг и управление системой',
    en: 'Central System Monitoring & Governance'
  },
  {
    key: 'cabinets.admin.badge',
    uz: 'ROOT ADMIN',
    ru: 'ROOT ADMIN',
    en: 'ROOT ADMIN'
  },
  {
    key: 'cabinets.driver.title',
    uz: 'Haydovchi Kabineti',
    ru: 'Кабинет водителя',
    en: 'Driver Terminal'
  },
  {
    key: 'cabinets.driver.subtitle',
    uz: 'Reyslar, GPS marshrut va yuk topshirish dalolatnomalari',
    ru: 'Рейсы, GPS-маршруты и акты передачи груза',
    en: 'Freight Trips, GPS Routing & Delivery Manifests'
  },
  {
    key: 'cabinets.driver.badge',
    uz: 'LOGISTIKA',
    ru: 'ЛОГИСТИКА',
    en: 'LOGISTICS FLEET'
  },
  {
    key: 'cabinets.switchCabinet',
    uz: 'Kabinetni almashtirish',
    ru: 'Сменить кабинет',
    en: 'Switch Dashboard'
  },
  {
    key: 'cabinets.currentCabinet',
    uz: 'Faol kabinet',
    ru: 'Текущий кабинет',
    en: 'Active Dashboard'
  },
  {
    key: 'cabinets.loginRequired',
    uz: 'Kabinetga kirish uchun tizimga kiring',
    ru: 'Войдите в систему для доступа к кабинету',
    en: 'Log in to access the dashboard'
  },
  {
    key: 'cabinets.dedicatedApp',
    uz: 'Alohida ilovada ochiladi',
    ru: 'Открывается в отдельном приложении',
    en: 'Opens in dedicated application'
  },

  // ==========================================
  // Hero & Value propositions
  // ==========================================
  // hero.*
  {
    key: 'hero.badge',
    uz: 'Sanoat va B2B Qurilish Platformasi',
    ru: 'Промышленная B2B-платформа',
    en: 'Industrial B2B Construction Platform'
  },
  {
    key: 'hero.title',
    uz: 'Tashqi va Ichki Qurilish Mahsulotlarining Milliy Marketpleysi',
    ru: 'Национальный маркетплейс наружных и внутренних стройматериалов',
    en: 'National Marketplace for Exterior & Interior Construction Materials'
  },
  {
    key: 'hero.titleHighlight',
    uz: 'Milliy Marketpleysi',
    ru: 'Национальный маркетплейс',
    en: 'National Marketplace'
  },
  {
    key: 'hero.subtitle',
    uz: 'Ta‘minotchi zavodlar, qurilish do‘konlari, usta va xaridorlarni yagona raqamli ekotizim, 50/50 xavfsiz to‘lov hamda bepul CRM boshqaruv tizimida birlashtiramiz.',
    ru: 'Объединяем заводы-производители, базы стройматериалов, подрядчиков и покупателей в единую экосистему с безопасной сделкой 50/50 и бесплатной CRM-системой.',
    en: 'Connecting manufacturing plants, building material suppliers, contractors, and buyers in a unified ecosystem with 50/50 escrow protection and free CRM management.'
  },
  {
    key: 'hero.ctaCatalog',
    uz: 'Katalogga O‘tish',
    ru: 'Перейти в каталог',
    en: 'Browse Catalog'
  },
  {
    key: 'hero.ctaPartner',
    uz: 'Hamkor Bo‘lish (Do‘kon & Zavod)',
    ru: 'Стать партнером (Завод и Магазин)',
    en: 'Become a Partner (Factory & Store)'
  },
  {
    key: 'hero.ctaLogistics',
    uz: 'Og‘ir Texnika Buyurtma Qilish',
    ru: 'Заказ тяжелой техники',
    en: 'Book Heavy Freight'
  },
  {
    key: 'hero.ctaTenders',
    uz: 'Tenderlarda Qatnashish',
    ru: 'Участвовать в тендерах',
    en: 'Participate in Tenders'
  },
  {
    key: 'hero.statSuppliers',
    uz: '150+ Akkreditatsiyadan o‘tgan zavodlar',
    ru: '150+ Аккредитованных заводов',
    en: '150+ Accredited Factories'
  },
  {
    key: 'hero.statLogistics',
    uz: '2 400+ Og‘ir samosval va mikserlar',
    ru: '2 400+ Самосвалов и автобетоносмесителей',
    en: '2,400+ Dump Trucks & Concrete Mixers'
  },
  {
    key: 'hero.statCoverage',
    uz: '14 Hudud & To‘liq O‘zbekiston qamrovi',
    ru: '14 Регионов: полное покрытие Узбекистана',
    en: '14 Regions: Complete Uzbekistan Coverage'
  },
  {
    key: 'hero.statEscrow',
    uz: '100% Kafolatlangan 50/50 Escrow hisob',
    ru: '100% Защита сделок: 50/50 Эскроу',
    en: '100% Protected 50/50 Escrow Settlement'
  },
  {
    key: 'hero.uspEscrowTitle',
    uz: '50/50 Xavfsiz To‘lov (Escrow)',
    ru: 'Безопасная сделка 50/50 (Эскроу)',
    en: '50/50 Secure Escrow Payment'
  },
  {
    key: 'hero.uspEscrowDesc',
    uz: '50% boshlang‘ich to‘lov, qolgan 50% faqat yuk obyektga yetib kelib, qabul qilingandan so‘ng o‘tkaziladi.',
    ru: '50% предоплата, остальные 50% перечисляются только после прибытия и приемки груза на объекте.',
    en: '50% advance deposit; remaining 50% released only after freight delivery and physical inspection on site.'
  },
  {
    key: 'hero.uspFactoryDirectTitle',
    uz: 'Zavoddan To‘g‘ridan-to‘g‘ri Narxlar',
    ru: 'Прямые заводские цены',
    en: 'Direct Factory Pricing'
  },
  {
    key: 'hero.uspFactoryDirectDesc',
    uz: 'Vositachilar va ortiqcha ustamalarsiz, ishlab chiqaruvchining rasmiy GOST narxlarida xarid qiling.',
    ru: 'Без посредников и лишних наценок — закупайте напрямую по официальным заводским прайсам и ГОСТам.',
    en: 'Zero middlemen markups — purchase directly at verified factory gate rates compliant with GOST standards.'
  },
  {
    key: 'hero.uspLogisticsTitle',
    uz: 'Avtomatlashtirilgan Og‘ir Logistika',
    ru: 'Автоматизированная логистика',
    en: 'Automated Heavy Fleet Dispatch'
  },
  {
    key: 'hero.uspLogisticsDesc',
    uz: 'GPS monitoringli HOWO samosvallari, mikserlar va kranlar eng yaqin bazadan obyektga yo‘naltiriladi.',
    ru: 'Самосвалы HOWO, миксеры и манипуляторы с GPS-мониторингом направляются на объект с ближайшей базы.',
    en: 'GPS-tracked HOWO dump trucks, concrete mixers, and cranes dispatched directly from the nearest depot.'
  },
  {
    key: 'hero.uspCrmTitle',
    uz: 'Bepul Kassa & Ombor CRM',
    ru: 'Бесплатная CRM для кассы и склада',
    en: 'Free POS & Warehouse CRM'
  },
  {
    key: 'hero.uspCrmDesc',
    uz: 'Do‘kon va bazalar uchun kassa apparati, tovar qoldiqlari va nasiya monitoringi mutlaqo bepul.',
    ru: 'Кассовый терминал, складской учет остатков и контроль дебиторской задолженности — бесплатно для партнеров.',
    en: 'Point of Sale terminal, real-time inventory ledger, and credit receivables tracking completely free for partners.'
  },
  {
    key: 'hero.rule1Title',
    uz: '01-Qoida: Erkin Narx',
    ru: 'Правило 01: Свободные цены',
    en: 'Rule 01: Free Pricing'
  },
  {
    key: 'hero.rule1Desc',
    uz: 'Narxni ta‘minotchi o‘zi mustaqil belgilaydi va o‘z minimal partiyasini (MOQ) shakllantiradi.',
    ru: 'Цены и минимальный объем заказа (MOQ) устанавливаются производителем без ограничений.',
    en: 'Prices and Minimum Order Quantities (MOQ) are established independently by each supplier.'
  },
  {
    key: 'hero.rule2Title',
    uz: '02-Qoida: Uzluksiz Savdo',
    ru: 'Правило 02: Непрерывные продажи',
    en: 'Rule 02: Continuous Sales'
  },
  {
    key: 'hero.rule2Desc',
    uz: 'Butun O‘zbekiston bo‘ylab 24/7 onlayn buyurtmalar qabuli va 12 ta viloyatdan doimiy xaridorlar oqimi.',
    ru: 'Круглосуточный прием заказов со всех 12 областей Узбекистана через единую цифровую витрину.',
    en: '24/7 order intake across all 12 regions of Uzbekistan through a unified digital marketplace showcase.'
  },
  {
    key: 'hero.rule3Title',
    uz: '03-Qoida: Moslashuvchan To‘lov',
    ru: 'Правило 03: Гибкая оплата',
    en: 'Rule 03: Flexible Settlement'
  },
  {
    key: 'hero.rule3Desc',
    uz: '100% to‘liq onlayn yoki mijoz xohishiga ko‘ra 50% oldindan + 50% yuk yetib borgach to‘lash kafolati.',
    ru: '100% онлайн-оплата либо схема 50% аванс + 50% при выгрузке на строительной площадке.',
    en: '100% full online settlement or flexible 50% advance deposit + 50% upon freight discharge at job site.'
  },

  // ==========================================
  // Catalog & Marketplace
  // ==========================================
  // catalog.*
  {
    key: 'catalog.title',
    uz: 'Qurilish Materiallari Bo‘yicha B2B & Chakana Katalog',
    ru: 'Каталог строительных материалов (B2B и розница)',
    en: 'B2B & Retail Construction Materials Catalog'
  },
  {
    key: 'catalog.subtitle',
    uz: 'Zavodlardan to‘g‘ridan-to‘g‘ri ulgurji partiyalar va sertifikatlangan GOST tovarlar',
    ru: 'Прямые оптовые партии с заводов и сертифицированная продукция по ГОСТ',
    en: 'Direct factory wholesale consignments and certified products compliant with GOST'
  },
  {
    key: 'catalog.allProducts',
    uz: 'Barcha mahsulotlar',
    ru: 'Все товары',
    en: 'All Products'
  },
  {
    key: 'catalog.filterBy',
    uz: 'Filtrlash',
    ru: 'Фильтры',
    en: 'Filter By'
  },
  {
    key: 'catalog.category',
    uz: 'Kategoriya',
    ru: 'Категория',
    en: 'Category'
  },
  {
    key: 'catalog.manufacturer',
    uz: 'Ishlab chiqaruvchi',
    ru: 'Производитель',
    en: 'Manufacturer'
  },
  {
    key: 'catalog.gost',
    uz: 'GOST / Standart',
    ru: 'ГОСТ / Стандарт',
    en: 'GOST / Industry Standard'
  },
  {
    key: 'catalog.priceRange',
    uz: 'Narx oralig‘i',
    ru: 'Диапазон цен',
    en: 'Price Range'
  },
  {
    key: 'catalog.minPrice',
    uz: 'Minimal narx',
    ru: 'Мин. цена',
    en: 'Min Price'
  },
  {
    key: 'catalog.maxPrice',
    uz: 'Maksimal narx',
    ru: 'Макс. цена',
    en: 'Max Price'
  },
  {
    key: 'catalog.sortBy',
    uz: 'Saralash',
    ru: 'Сортировка',
    en: 'Sort By'
  },
  {
    key: 'catalog.sortPriceAsc',
    uz: 'Narx: Arzondan qimmatga',
    ru: 'Цена: по возрастанию',
    en: 'Price: Low to High'
  },
  {
    key: 'catalog.sortPriceDesc',
    uz: 'Narx: Qimmatdan arzonga',
    ru: 'Цена: по убыванию',
    en: 'Price: High to Low'
  },
  {
    key: 'catalog.sortPopular',
    uz: 'Ommabopligi bo‘yicha',
    ru: 'По популярности',
    en: 'Most Popular'
  },
  {
    key: 'catalog.sortNewest',
    uz: 'Eng yangilari',
    ru: 'Сначала новые',
    en: 'Newest First'
  },
  {
    key: 'catalog.inStockOnly',
    uz: 'Faqat omborda mavjudlar',
    ru: 'Только в наличии',
    en: 'In Stock Only'
  },
  {
    key: 'catalog.wholesaleOnly',
    uz: 'Ulgurji partiyalar (Optom)',
    ru: 'Только оптовые партии',
    en: 'Wholesale Lots Only'
  },
  {
    key: 'catalog.withDelivery',
    uz: 'Yetkazib berish xizmati bilan',
    ru: 'С доставкой на объект',
    en: 'Delivery Available'
  },
  {
    key: 'catalog.resetFilters',
    uz: 'Filtrlarni tozalash',
    ru: 'Сбросить фильтры',
    en: 'Reset Filters'
  },
  {
    key: 'catalog.applyFilters',
    uz: 'Filtrlarni qo‘llash',
    ru: 'Применить фильтры',
    en: 'Apply Filters'
  },
  {
    key: 'catalog.foundCount',
    uz: 'Topilgan mahsulotlar soni:',
    ru: 'Найдено товаров:',
    en: 'Products found:'
  },
  {
    key: 'catalog.notFound',
    uz: 'Qidiruv natijasida hech narsa topilmadi',
    ru: 'По вашему запросу ничего не найдено',
    en: 'No products found matching your criteria'
  },
  {
    key: 'catalog.notFoundDesc',
    uz: 'Qidiruv so‘zini o‘zgartiring yoki filtrlarni qayta sozlang',
    ru: 'Попробуйте изменить поисковый запрос или сбросить фильтры',
    en: 'Try adjusting your search query or reset filters'
  },
  {
    key: 'catalog.quickView',
    uz: 'Tezkor ko‘rish',
    ru: 'Быстрый просмотр',
    en: 'Quick View'
  },
  {
    key: 'catalog.viewDetails',
    uz: 'Batafsil ma‘lumot',
    ru: 'Подробнее о товаре',
    en: 'View Details'
  },
  {
    key: 'catalog.specifications',
    uz: 'Texnik xarakteristikalari',
    ru: 'Технические характеристики',
    en: 'Technical Specifications'
  },
  {
    key: 'catalog.description',
    uz: 'Mahsulot tavsifi',
    ru: 'Описание продукции',
    en: 'Product Description'
  },
  {
    key: 'catalog.tieredPricing',
    uz: 'Hajmga qarab ulgurji narxlar jadvali',
    ru: 'Оптовые цены в зависимости от объема',
    en: 'Tiered Volume Pricing'
  },
  {
    key: 'catalog.minOrderQty',
    uz: 'Minimal buyurtma miqdori (MOQ):',
    ru: 'Минимальная партия (MOQ):',
    en: 'Minimum Order Quantity (MOQ):'
  },
  {
    key: 'catalog.unitOfMeasure',
    uz: 'O‘lchov birligi',
    ru: 'Единица измерения',
    en: 'Unit of Measurement'
  },
  {
    key: 'catalog.deliveryLeadTime',
    uz: 'Yetkazib berish muddati:',
    ru: 'Срок отгрузки:',
    en: 'Delivery Lead Time:'
  },
  {
    key: 'catalog.leadTimeValue',
    uz: '24-48 soat ichida',
    ru: 'В течение 24-48 часов',
    en: 'Within 24-48 hours'
  },
  {
    key: 'catalog.qualityCert',
    uz: 'Sifat sertifikati mavjud',
    ru: 'Сертификат соответствия в наличии',
    en: 'Quality Certificate Verified'
  },
  {
    key: 'catalog.downloadCert',
    uz: 'Sertifikatni yuklab olish (PDF)',
    ru: 'Скачать сертификат (PDF)',
    en: 'Download Certificate (PDF)'
  },
  {
    key: 'catalog.sellerLocation',
    uz: 'Ombordan jo‘natish manzili:',
    ru: 'Адрес отгрузки со склада:',
    en: 'Warehouse Dispatch Location:'
  },

  // product.*
  {
    key: 'product.sku',
    uz: 'Artikul (SKU)',
    ru: 'Артикул (SKU)',
    en: 'SKU'
  },
  {
    key: 'product.price',
    uz: 'Narxi',
    ru: 'Цена',
    en: 'Price'
  },
  {
    key: 'product.unit',
    uz: 'O‘lchov birligi',
    ru: 'Ед. изм.',
    en: 'Unit'
  },
  {
    key: 'product.inStock',
    uz: 'Omborda mavjud',
    ru: 'В наличии на складе',
    en: 'In Stock'
  },
  {
    key: 'product.outOfStock',
    uz: 'Vaqtincha tugagan',
    ru: 'Нет в наличии',
    en: 'Out of Stock'
  },
  {
    key: 'product.lowStock',
    uz: 'Qoldiq oz qoldi',
    ru: 'Заканчивается',
    en: 'Low Stock'
  },
  {
    key: 'product.stockQuantity',
    uz: 'Qoldiq:',
    ru: 'Остаток:',
    en: 'Available Stock:'
  },
  {
    key: 'product.addToCart',
    uz: 'Savatga qo‘shish',
    ru: 'Добавить в корзину',
    en: 'Add to Cart'
  },
  {
    key: 'product.buyNow',
    uz: 'Bir klikda xarid',
    ru: 'Купить в один клик',
    en: 'Instant Buy'
  },
  {
    key: 'product.quantity',
    uz: 'Miqdori',
    ru: 'Количество',
    en: 'Quantity'
  },
  {
    key: 'product.subtotal',
    uz: 'Oraliq summa',
    ru: 'Промежуточная сумма',
    en: 'Subtotal'
  },
  {
    key: 'product.gostCert',
    uz: 'GOST Standarti',
    ru: 'Стандарт ГОСТ',
    en: 'GOST Standard'
  },
  {
    key: 'product.brand',
    uz: 'Brend / Zavod',
    ru: 'Бренд / Завод',
    en: 'Brand / Factory'
  },
  {
    key: 'product.originCountry',
    uz: 'Ishlab chiqarilgan mamlakat',
    ru: 'Страна производства',
    en: 'Country of Origin'
  },
  {
    key: 'product.warranty',
    uz: 'Kafolat muddati',
    ru: 'Гарантийный срок',
    en: 'Warranty Period'
  },
  {
    key: 'product.packaging',
    uz: 'Qadoqlanishi',
    ru: 'Фасовка и упаковка',
    en: 'Packaging & Delivery Unit'
  },
  {
    key: 'product.weightKg',
    uz: 'Og‘irligi (kg)',
    ru: 'Вес (кг)',
    en: 'Weight (kg)'
  },
  {
    key: 'product.volumeM3',
    uz: 'Hajmi (m³)',
    ru: 'Объем (м³)',
    en: 'Volume (m³)'
  },
  {
    key: 'product.share',
    uz: 'Havolani ulashish',
    ru: 'Поделиться товаром',
    en: 'Share Product'
  },
  {
    key: 'product.rating',
    uz: 'Reyting',
    ru: 'Рейтинг',
    en: 'Rating'
  },
  {
    key: 'product.reviews',
    uz: 'Xaridorlar fikrlari',
    ru: 'Отзывы покупателей',
    en: 'Customer Reviews'
  },
  {
    key: 'product.noReviews',
    uz: 'Hozircha sharhlar yo‘q',
    ru: 'Отзывов пока нет',
    en: 'No reviews yet'
  },
  {
    key: 'product.viewOnSite',
    uz: 'Ishlab chiqaruvchi saytida ko‘rish',
    ru: 'На сайте производителя',
    en: 'Manufacturer Link'
  },
  {
    key: 'product.calcRequired',
    uz: 'Kerakli miqdorni hisoblash',
    ru: 'Рассчитать требуемое количество',
    en: 'Calculate Required Quantity'
  },

  // categories.*
  {
    key: 'categories.all',
    uz: 'Barcha toifalar',
    ru: 'Все категории',
    en: 'All Categories'
  },
  {
    key: 'categories.heavy_construction',
    uz: 'Tashqi va Og‘ir Qurilish',
    ru: 'Наружное и тяжелое строительство',
    en: 'Heavy Exterior Construction'
  },
  {
    key: 'categories.foundation_walls',
    uz: 'Poydevor va Devor Materiallari',
    ru: 'Фундамент и стеновые материалы',
    en: 'Foundation & Wall Materials'
  },
  {
    key: 'categories.cement_concrete',
    uz: 'Sement va Tayyor Beton',
    ru: 'Цемент и товарный бетон',
    en: 'Cement & Ready-Mix Concrete'
  },
  {
    key: 'categories.rebar_metal',
    uz: 'Armatura va Prokat Metall',
    ru: 'Арматура и сортовой металлопрокат',
    en: 'Rebar & Structural Steel'
  },
  {
    key: 'categories.bricks_blocks',
    uz: 'G‘isht, Gazoblok va Shlakoblok',
    ru: 'Кирпич, газоблок и шлакоблок',
    en: 'Bricks, Aerated Concrete & Blocks'
  },
  {
    key: 'categories.roofing',
    uz: 'Tom Qoplamalari va Profnastil',
    ru: 'Кровля и профнастил',
    en: 'Roofing & Corrugated Sheets'
  },
  {
    key: 'categories.lumber_timber',
    uz: 'Yog‘och, Brus va Qolip Taxtalar',
    ru: 'Пиломатериалы, брус и опалубка',
    en: 'Timber, Lumber & Formwork'
  },
  {
    key: 'categories.dry_mixes',
    uz: 'Quruq Qurilish Qorishmalari',
    ru: 'Сухие строительные смеси',
    en: 'Dry Mortars & Plasters'
  },
  {
    key: 'categories.insulation_esco',
    uz: 'Issiqlik Izolyatsiyasi & ESCO',
    ru: 'Теплоизоляция и ЭСКО материалы',
    en: 'Thermal Insulation & ESCO'
  },
  {
    key: 'categories.finishing_interior',
    uz: 'Ichki Pardozlash va Bezak',
    ru: 'Внутренняя отделка и декор',
    en: 'Interior Finishing & Surfaces'
  },
  {
    key: 'categories.tiles_granite',
    uz: 'Kafel, Granit va Keramogranit',
    ru: 'Кафель, керамогранит и натуральный камень',
    en: 'Ceramic Tiles, Granite & Porcelain'
  },
  {
    key: 'categories.paints_coatings',
    uz: 'Bo‘yoq, Lak va Grunt Qoplamalar',
    ru: 'Краски, лаки и грунтовки',
    en: 'Paints, Coatings & Primers'
  },
  {
    key: 'categories.plasterboard',
    uz: 'Gipsokarton va Profil Tizimlari',
    ru: 'Гипсокартон и профильные системы',
    en: 'Drywall & Ceiling Metal Studs'
  },
  {
    key: 'categories.plumbing_sanitary',
    uz: 'Santexnika va Isitish Tizimlari',
    ru: 'Сантехника и системы отопления',
    en: 'Plumbing, Valves & Hydronic Heating'
  },
  {
    key: 'categories.electrical',
    uz: 'Elektr Jihozlari va Kabel Mahsulotlari',
    ru: 'Электрика и кабельная продукция',
    en: 'Electrical Supplies & Cabling'
  },
  {
    key: 'categories.tools_hardware',
    uz: 'Professional Uskunalar va Furnitura',
    ru: 'Профессиональный инструмент и крепеж',
    en: 'Power Tools & Fasteners'
  },
  {
    key: 'categories.heavy_machinery',
    uz: 'Og‘ir Texnika Ijarasi',
    ru: 'Аренда тяжелой спецтехники',
    en: 'Heavy Machinery & Crane Rental'
  },

  // ==========================================
  // Accredited Suppliers & Factories
  // ==========================================
  // suppliers.*
  {
    key: 'suppliers.title',
    uz: 'Akkreditatsiyadan O‘tgan Ishlab Chiqaruvchilar',
    ru: 'Аккредитованные заводы и производители',
    en: 'Accredited Manufacturers & Industrial Plants'
  },
  {
    key: 'suppliers.subtitle',
    uz: 'O‘zbekiston va mintaqaning yirik sement, metallurgiya va gazoblok korxonalari',
    ru: 'Ведущие цементные, металлургические и блочные заводы Узбекистана и региона',
    en: 'Leading cement, metallurgy, and masonry production plants in Uzbekistan & Central Asia'
  },
  {
    key: 'suppliers.accreditedBadge',
    uz: 'BunkerStroy Akkreditatsiyasi',
    ru: 'Проверенный поставщик BunkerStroy',
    en: 'BunkerStroy Verified Supplier'
  },
  {
    key: 'suppliers.directContract',
    uz: 'To‘g‘ridan-to‘g‘ri zavod shartnomasi',
    ru: 'Прямой заводской договор',
    en: 'Direct Factory Contract'
  },
  {
    key: 'suppliers.factoryCapacity',
    uz: 'Yillik ishlab chiqarish quvvati:',
    ru: 'Годовая производственная мощность:',
    en: 'Annual Production Capacity:'
  },
  {
    key: 'suppliers.establishedYear',
    uz: 'Faoliyat boshlagan yili:',
    ru: 'Год основания:',
    en: 'Established Year:'
  },
  {
    key: 'suppliers.qualityLab',
    uz: 'Maxsus laboratoriya nazorati',
    ru: 'Собственная лаборатория контроля качества',
    en: 'In-house Quality Testing Laboratory'
  },
  {
    key: 'suppliers.requestQuote',
    uz: 'Ulgurji narx so‘rash (Tijorat taklifi)',
    ru: 'Запросить коммерческое предложение',
    en: 'Request Wholesale Quote (RFQ)'
  },
  {
    key: 'suppliers.becomeSupplier',
    uz: 'Zavodni tizimga qo‘shish',
    ru: 'Подключить завод к платформе',
    en: 'Onboard Production Plant'
  },
  {
    key: 'suppliers.verifiedInn',
    uz: 'STIR tekshirilgan va soliq qarzdorligi yo‘q',
    ru: 'ИНН верифицирован, налоговая задолженность отсутствует',
    en: 'Tax ID (INN) verified, no tax arrears'
  },
  {
    key: 'suppliers.fleetAvailable',
    uz: 'Shaxsiy temir yo‘l tarmog‘i va samosvallar mavjud',
    ru: 'Собственный Ж/Д тупик и автопарк',
    en: 'Dedicated railway siding & truck fleet'
  },
  {
    key: 'suppliers.catalogue',
    uz: 'Zavod tovarlari ro‘yxati',
    ru: 'Каталог продукции завода',
    en: 'Factory Product Line'
  },
  {
    key: 'suppliers.minimumBatch',
    uz: 'Minimal vagon yoki fura partiyasi:',
    ru: 'Минимальная партия отгрузки:',
    en: 'Minimum Shipping Lot:'
  },
  {
    key: 'suppliers.location',
    uz: 'Zavod joylashuvi',
    ru: 'Локация завода',
    en: 'Plant Location'
  },
  {
    key: 'suppliers.contactPerson',
    uz: 'B2B bo‘limi mas‘ul xodimi',
    ru: 'Ответственный менеджер B2B',
    en: 'B2B Commercial Representative'
  },

  // contracts.*
  {
    key: 'contracts.title',
    uz: 'B2B Yuridik Shartnomalar',
    ru: 'Корпоративные B2B-договоры',
    en: 'Corporate B2B Contracts'
  },
  {
    key: 'contracts.eimzoVerified',
    uz: 'E-IMZO orqali imzolangan (PKCS#7)',
    ru: 'Подписано через ЭЦП E-IMZO (PKCS#7)',
    en: 'Legally Signed via E-IMZO (PKCS#7)'
  },
  {
    key: 'contracts.contractNumber',
    uz: 'Shartnoma raqami',
    ru: 'Номер договора',
    en: 'Contract Number'
  },
  {
    key: 'contracts.signDate',
    uz: 'Imzolangan sana',
    ru: 'Дата подписания',
    en: 'Signing Date'
  },
  {
    key: 'contracts.parties',
    uz: 'Tomonlar',
    ru: 'Стороны договора',
    en: 'Parties Involved'
  },
  {
    key: 'contracts.buyerCompany',
    uz: 'Xaridor tashkilot',
    ru: 'Организация-покупатель',
    en: 'Buyer Organization'
  },
  {
    key: 'contracts.supplierCompany',
    uz: 'Sotuvchi zavod',
    ru: 'Завод-поставщик',
    en: 'Supplier Entity'
  },
  {
    key: 'contracts.totalAmount',
    uz: 'Shartnomaning umumiy qiymati',
    ru: 'Общая сумма договора',
    en: 'Total Contract Value'
  },
  {
    key: 'contracts.downloadPdf',
    uz: 'Shartnomani yuklab olish (PDF)',
    ru: 'Скачать договор с ЭЦП (PDF)',
    en: 'Download Signed Contract (PDF)'
  },
  {
    key: 'contracts.status',
    uz: 'Shartnoma holati',
    ru: 'Статус договора',
    en: 'Contract Status'
  },
  {
    key: 'contracts.statusActive',
    uz: 'Kuchga kirgan',
    ru: 'Действует',
    en: 'Active & Binding'
  },
  {
    key: 'contracts.statusPendingSign',
    uz: 'E-IMZO imzosi kutilmoqda',
    ru: 'Ожидает подписания ЭЦП',
    en: 'Awaiting Digital Signature'
  },
  {
    key: 'contracts.statusFulfilled',
    uz: 'Majburiyatlar to‘liq bajarildi',
    ru: 'Исполнен в полном объеме',
    en: 'Fully Fulfilled'
  },
  {
    key: 'contracts.specifications',
    uz: 'Mahsulot texnik spetsifikatsiyasi',
    ru: 'Техническая спецификация',
    en: 'Technical Specification Annex'
  },
  {
    key: 'contracts.paymentSchedule',
    uz: 'To‘lov va yetkazib berish jadvali',
    ru: 'График оплаты и поставок',
    en: 'Payment & Delivery Schedule'
  },

  // ==========================================
  // Heavy Logistics & Fleets
  // ==========================================
  // logistics.*
  {
    key: 'logistics.title',
    uz: 'Og‘ir Qurilish Logistikasi va Maxsus Texnika',
    ru: 'Тяжелая строительная логистика и спецтехника',
    en: 'Heavy Freight Logistics & Special Fleet'
  },
  {
    key: 'logistics.subtitle',
    uz: 'Karyerdan obyektgacha shag‘al, sement, beton va armatura tashish xizmati',
    ru: 'Доставка щебня, песка, бетона и арматуры с карьеров и заводов на стройплощадку',
    en: 'Bulk delivery of aggregate, cement, ready-mix concrete, and rebar from quarries to job sites'
  },
  {
    key: 'logistics.routeCalculator',
    uz: 'Marshrut va Narx Hisoblagichi',
    ru: 'Расчет маршрута и стоимости рейса',
    en: 'Route Distance & Freight Cost Estimator'
  },
  {
    key: 'logistics.origin',
    uz: 'Yuk ortish manzili (Karyer / Zavod / Ombor)',
    ru: 'Точка погрузки (Карьер / Завод / Склад)',
    en: 'Origin Point (Quarry / Plant / Warehouse)'
  },
  {
    key: 'logistics.destination',
    uz: 'Yetkazib berish manzili (Qurilish obyekti)',
    ru: 'Точка выгрузки (Строительный объект)',
    en: 'Destination (Job Site Address)'
  },
  {
    key: 'logistics.distance',
    uz: 'Masofa (km)',
    ru: 'Расстояние (км)',
    en: 'Distance (km)'
  },
  {
    key: 'logistics.estimatedTime',
    uz: 'Taxminiy yetib borish vaqti',
    ru: 'Расчетное время в пути',
    en: 'Estimated Transit Time'
  },
  {
    key: 'logistics.cargoWeight',
    uz: 'Yuk og‘irligi (tonna)',
    ru: 'Вес груза (тонн)',
    en: 'Cargo Weight (tons)'
  },
  {
    key: 'logistics.cargoVolume',
    uz: 'Yuk hajmi (m³)',
    ru: 'Объем груза (м³)',
    en: 'Cargo Volume (m³)'
  },
  {
    key: 'logistics.recommendedVehicle',
    uz: 'Tavsiya etilgan texnika turi',
    ru: 'Рекомендуемый тип техники',
    en: 'Recommended Vehicle Class'
  },
  {
    key: 'logistics.baseRate',
    uz: 'Dastlabki bazaviy narx',
    ru: 'Базовая стоимость рейса',
    en: 'Base Booking Tariff'
  },
  {
    key: 'logistics.perKmRate',
    uz: 'Har bir kilometr uchun narx',
    ru: 'Тариф за километр',
    en: 'Per Kilometer Rate'
  },
  {
    key: 'logistics.totalTransportCost',
    uz: 'Jami transport xarajati',
    ru: 'Итоговая стоимость доставки',
    en: 'Total Freight Fee'
  },
  {
    key: 'logistics.bookDispatch',
    uz: 'Mashinani bron qilish va haydovchi chaqirish',
    ru: 'Заказать спецтехнику',
    en: 'Confirm Vehicle Dispatch'
  },
  {
    key: 'logistics.liveGps',
    uz: 'Jonli GPS xaritasida kuzatuv',
    ru: 'Отслеживание по GPS на карте',
    en: 'Live GPS Fleet Tracking'
  },
  {
    key: 'logistics.fleetStatus',
    uz: 'Texnika holati',
    ru: 'Статус транспорта',
    en: 'Fleet Availability'
  },
  {
    key: 'logistics.driverAssignedNotice',
    uz: 'Reysga sertifikatlangan haydovchi biriktiriladi',
    ru: 'На рейс назначается сертифицированный водитель',
    en: 'Certified driver assigned to freight dispatch'
  },
  {
    key: 'logistics.unloadingTime',
    uz: 'Obyektda tushirish me‘yori (2 soat)',
    ru: 'Норматив времени на разгрузку (2 часа)',
    en: 'Standard unloading window (2 hours)'
  },

  // vehicles.*
  {
    key: 'vehicles.types.dumpTruck',
    uz: 'HOWO / Shacman Samosval (25–35 tonna)',
    ru: 'Самосвал HOWO / Shacman (25–35 тонн)',
    en: 'Dump Truck HOWO / Shacman (25–35 tons)'
  },
  {
    key: 'vehicles.types.concreteMixer',
    uz: 'Avtobeton Mikser (10–12 m³)',
    ru: 'Автобетоносмеситель (10–12 м³)',
    en: 'Concrete Transit Mixer (10–12 m³)'
  },
  {
    key: 'vehicles.types.craneManipulator',
    uz: 'Kran-Manipulyator (10–15 tonna)',
    ru: 'Кран-манипулятор (10–15 тонн)',
    en: 'Crane Truck & Manipulator (10–15 tons)'
  },
  {
    key: 'vehicles.types.flatbedSemi',
    uz: 'Uzun o‘lchamli Fura / Bortli shatak (20–25 tonna)',
    ru: 'Бортовая фура / Длинномер (20–25 тонн)',
    en: 'Flatbed Semi-Trailer / Long-Bed (20–25 tons)'
  },
  {
    key: 'vehicles.types.lightTruck',
    uz: 'Gazel Next / Isuzu Bortli (3–5 tonna)',
    ru: 'Газель / Isuzu бортовой (3–5 тонн)',
    en: 'Light Cargo Truck (Gazelle / Isuzu 3–5 tons)'
  },
  {
    key: 'vehicles.plateNumber',
    uz: 'Davlat raqami',
    ru: 'Гос. номер',
    en: 'License Plate'
  },
  {
    key: 'vehicles.driver',
    uz: 'Haydovchi',
    ru: 'Водитель',
    en: 'Driver'
  },
  {
    key: 'vehicles.capacity',
    uz: 'Yuk ko‘tarish quvvati',
    ru: 'Грузоподъемность',
    en: 'Payload Capacity'
  },
  {
    key: 'vehicles.statusAvailable',
    uz: 'Reysga tayyor (Bo‘sh)',
    ru: 'Свободен (Готов к рейсу)',
    en: 'Available for Dispatch'
  },
  {
    key: 'vehicles.statusBusy',
    uz: 'Reysda (Band)',
    ru: 'В пути (Занят)',
    en: 'En Route (Occupied)'
  },
  {
    key: 'vehicles.statusMaintenance',
    uz: 'Texnik ko‘rikda',
    ru: 'На техобслуживании',
    en: 'Under Maintenance'
  },
  {
    key: 'vehicles.location',
    uz: 'Hozirgi joylashuvi',
    ru: 'Текущая геопозиция',
    en: 'Current Geolocation'
  },

  // dispatch.*
  {
    key: 'dispatch.id',
    uz: 'Yo‘l varaqasi (Reys ID)',
    ru: 'Путевой лист (ID рейса)',
    en: 'Dispatch Waybill ID'
  },
  {
    key: 'dispatch.assignedDriver',
    uz: 'Biriktirilgan haydovchi',
    ru: 'Назначенный водитель',
    en: 'Assigned Driver'
  },
  {
    key: 'dispatch.driverPhone',
    uz: 'Haydovchi telefoni',
    ru: 'Телефон водителя',
    en: 'Driver Contact'
  },
  {
    key: 'dispatch.eta',
    uz: 'Taxminiy yetib kelish:',
    ru: 'Расчетное время прибытия:',
    en: 'Estimated Time of Arrival:'
  },
  {
    key: 'dispatch.statusPending',
    uz: 'Haydovchi tayinlanmoqda',
    ru: 'Подбор спецтехники',
    en: 'Dispatching Fleet'
  },
  {
    key: 'dispatch.statusEnRoute',
    uz: 'Yuk ortildi va yo‘lda',
    ru: 'Груз загружен, в пути',
    en: 'Loaded & En Route'
  },
  {
    key: 'dispatch.statusArrived',
    uz: 'Obyektga yetib keldi',
    ru: 'Прибыл на объект',
    en: 'Arrived at Site'
  },
  {
    key: 'dispatch.statusUnloading',
    uz: 'Yuk tushirilmoqda',
    ru: 'Идет разгрузка',
    en: 'Unloading in Progress'
  },
  {
    key: 'dispatch.statusCompleted',
    uz: 'Reys muvaffaqiyatli yakunlandi',
    ru: 'Рейс успешно завершен',
    en: 'Trip Completed'
  },
  {
    key: 'dispatch.waybillDownload',
    uz: 'Elektron tovar-transport yukxati (TTN)',
    ru: 'Электронная транспортная накладная (ТТН)',
    en: 'Digital Consignment Note (Waybill)'
  },
  {
    key: 'dispatch.sealNumber',
    uz: 'Plomba raqami',
    ru: 'Номер пломбы',
    en: 'Freight Seal Number'
  },
  {
    key: 'dispatch.confirmUnload',
    uz: 'Yuk to‘liq tushirilganligini tasdiqlash',
    ru: 'Подтвердить выгрузку',
    en: 'Confirm Full Unloading'
  },

  // ==========================================
  // Engineering Calculators
  // ==========================================
  // calc.*
  {
    key: 'calc.title',
    uz: 'Sanoat Muhandislik Kalkulyatorlari',
    ru: 'Промышленные инженерные калькуляторы',
    en: 'Industrial Engineering Calculators'
  },
  {
    key: 'calc.subtitle',
    uz: 'GOST va ShNQ standartlari bo‘yicha materiallar va energiya sarfini hisoblang',
    ru: 'Расчет потребности стройматериалов и энергоэффективности по стандартам ШНК и ГОСТ',
    en: 'Precise material consumption and energy efficiency estimates based on ShNQ and GOST codes'
  },
  {
    key: 'calc.tabConcrete',
    uz: 'Beton va Sement',
    ru: 'Бетон и цемент',
    en: 'Concrete & Cement'
  },
  {
    key: 'calc.tabBrick',
    uz: 'G‘isht va Gazoblok',
    ru: 'Кирпич и блоки',
    en: 'Brick & Aerated Blocks'
  },
  {
    key: 'calc.tabRebar',
    uz: 'Po‘lat Armatura',
    ru: 'Стальная арматура',
    en: 'Steel Reinforcing Bar'
  },
  {
    key: 'calc.tabEsco',
    uz: 'ESCO Bino Energiya Auditi',
    ru: 'ЭСКО Энергоаудит зданий',
    en: 'ESCO Energy Efficiency Audit'
  },
  {
    key: 'calc.calculateBtn',
    uz: 'Hisoblash',
    ru: 'Рассчитать',
    en: 'Calculate'
  },
  {
    key: 'calc.resetBtn',
    uz: 'Boshlang‘ich holatga qaytarish',
    ru: 'Сбросить параметры',
    en: 'Reset Inputs'
  },
  {
    key: 'calc.orderMaterialsBtn',
    uz: 'Materiallarni Savatga Qo‘shish',
    ru: 'Заказать рассчитанные материалы',
    en: 'Add Calculated Materials to Cart'
  },
  {
    key: 'calc.estimatedTotal',
    uz: 'Taxminiy umumiy tannarx:',
    ru: 'Ориентировочная стоимость:',
    en: 'Estimated Material Cost:'
  },
  {
    key: 'calc.engineeringDisclaimer',
    uz: 'Hisob-kitoblar GOST standartlari va o‘rtacha me‘yorlar asosida taxminiy shakllantirilgan.',
    ru: 'Расчеты носят инженерно-ориентировочный характер согласно ГОСТ и ШНК.',
    en: 'Calculations are engineering estimates based on prevailing GOST and ShNQ norms.'
  },

  // calc.concrete.*
  {
    key: 'calc.concrete.title',
    uz: 'Beton va Poydevor Hisoblagichi',
    ru: 'Калькулятор бетона и фундамента',
    en: 'Foundation & Concrete Mix Calculator'
  },
  {
    key: 'calc.concrete.modeVolume',
    uz: 'Hajm bo‘yicha (m³)',
    ru: 'По готовому объему (м³)',
    en: 'By Total Volume (m³)'
  },
  {
    key: 'calc.concrete.modeArea',
    uz: 'Maydon va qalinlik bo‘yicha',
    ru: 'По площади и толщине слоя',
    en: 'By Surface Area & Slab Thickness'
  },
  {
    key: 'calc.concrete.volume',
    uz: 'Beton hajmi (m³)',
    ru: 'Объем бетона (м³)',
    en: 'Concrete Volume (m³)'
  },
  {
    key: 'calc.concrete.area',
    uz: 'Poydevor maydoni (m²)',
    ru: 'Площадь заливки (м²)',
    en: 'Pouring Area (m²)'
  },
  {
    key: 'calc.concrete.thickness',
    uz: 'Qatlam qalinligi (sm)',
    ru: 'Толщина слоя (см)',
    en: 'Slab Thickness (cm)'
  },
  {
    key: 'calc.concrete.grade',
    uz: 'Beton markasi (GOST)',
    ru: 'Марка прочности бетона',
    en: 'Concrete Strength Grade'
  },
  {
    key: 'calc.concrete.gradeDesc',
    uz: 'M150 (pol tayyorlash), M200 (yengil lenta), M250/M300 (kapital poydevor), M350 (monolit karkas)',
    ru: 'М150 (стяжка), М200 (ленточный), М250/М300 (капитальный фундамент), М350 (монолитный каркас)',
    en: 'M150 (blinding/sub-base), M200 (light footing), M250/M300 (structural foundation), M350 (high-strength columns)'
  },
  {
    key: 'calc.concrete.cementNeeded',
    uz: 'Sement M500 miqdori',
    ru: 'Потребность в цементе М500',
    en: 'Required M500 Cement'
  },
  {
    key: 'calc.concrete.cementBags',
    uz: 'Qoplar soni (50 kg)',
    ru: 'Мешков по 50 кг',
    en: '50 kg Cement Sacks'
  },
  {
    key: 'calc.concrete.sandNeeded',
    uz: 'Qum miqdori (tonna)',
    ru: 'Песок строительный (тонн)',
    en: 'Building Sand Required (tons)'
  },
  {
    key: 'calc.concrete.gravelNeeded',
    uz: 'Shag‘al / Sheben (tonna)',
    ru: 'Щебень фракционный (тонн)',
    en: 'Crushed Stone / Gravel (tons)'
  },
  {
    key: 'calc.concrete.waterNeeded',
    uz: 'Suv miqdori (litr)',
    ru: 'Вода затворения (литров)',
    en: 'Batch Water Volume (liters)'
  },
  {
    key: 'calc.concrete.mixersCount',
    uz: 'Talab qilinadigan mikserlar soni (10 m³ reyslar)',
    ru: 'Требуемое число рейсов автомиксера (по 10 м³)',
    en: 'Required Concrete Mixer Trips (10 m³ each)'
  },

  // calc.brick.*
  {
    key: 'calc.brick.title',
    uz: 'Devor G‘ishti va Gazoblok Hisoblagichi',
    ru: 'Калькулятор кирпичной кладки и газоблока',
    en: 'Masonry Wall & Aerated Block Calculator'
  },
  {
    key: 'calc.brick.wallLength',
    uz: 'Devor uzunligi (m)',
    ru: 'Общая длина стен (м)',
    en: 'Total Wall Length (m)'
  },
  {
    key: 'calc.brick.wallHeight',
    uz: 'Devor balandligi (m)',
    ru: 'Высота стен (м)',
    en: 'Wall Height (m)'
  },
  {
    key: 'calc.brick.openingsArea',
    uz: 'Eshik va deraza o‘rinlari maydoni (m²)',
    ru: 'Площадь оконных и дверных проемов (м²)',
    en: 'Window & Door Openings (m²)'
  },
  {
    key: 'calc.brick.material',
    uz: 'Material turi',
    ru: 'Тип кладочного материала',
    en: 'Masonry Material Type'
  },
  {
    key: 'calc.brick.standardBrick',
    uz: 'Pishiq pishgan qizil g‘isht (250x120x65 mm)',
    ru: 'Стандартный обожженный кирпич (250х120х65 мм)',
    en: 'Standard Red Clay Brick (250x120x65 mm)'
  },
  {
    key: 'calc.brick.gasblock300',
    uz: 'D500 Gazoblok (600x300x200 mm)',
    ru: 'Газоблок автоклавный D500 (600х300х200 мм)',
    en: 'Autoclaved Aerated Concrete D500 (600x300x200 mm)'
  },
  {
    key: 'calc.brick.gasblock200',
    uz: 'D500 Gazoblok (600x200x200 mm)',
    ru: 'Газоблок автоклавный D500 (600х200х200 мм)',
    en: 'Autoclaved Aerated Concrete D500 (600x200x200 mm)'
  },
  {
    key: 'calc.brick.wallThickness',
    uz: 'Devor qalinligi',
    ru: 'Толщина кладки',
    en: 'Wall Laying Thickness'
  },
  {
    key: 'calc.brick.thicknessHalf',
    uz: 'Yarim g‘isht (12 sm)',
    ru: 'В полкирпича (12 см)',
    en: 'Half Brick (12 cm)'
  },
  {
    key: 'calc.brick.thicknessSingle',
    uz: 'Bir g‘isht (25 sm)',
    ru: 'В один кирпич (25 см)',
    en: 'Single Brick (25 cm)'
  },
  {
    key: 'calc.brick.thicknessOneAndHalf',
    uz: 'Bir yarim g‘isht (38 sm)',
    ru: 'В полтора кирпича (38 см)',
    en: 'One and a Half Brick (38 cm)'
  },
  {
    key: 'calc.brick.netArea',
    uz: 'Sof terish maydoni',
    ru: 'Чистая площадь кладки',
    en: 'Net Masonry Area'
  },
  {
    key: 'calc.brick.totalUnits',
    uz: 'Jami g‘isht / blok soni (5% zaxira bilan)',
    ru: 'Итоговое число кирпичей / блоков (с запасом 5%)',
    en: 'Total Units (incl. 5% safety margin)'
  },
  {
    key: 'calc.brick.mortarM3',
    uz: 'Qorishma hajmi (m³)',
    ru: 'Объем кладочного раствора (м³)',
    en: 'Masonry Mortar Volume (m³)'
  },
  {
    key: 'calc.brick.glueBags',
    uz: 'Maxsus kley qoplari (25 kg)',
    ru: 'Мешков клея для газоблока (25 кг)',
    en: 'Thin-Bed Adhesive Bags (25 kg)'
  },

  // calc.rebar.*
  {
    key: 'calc.rebar.title',
    uz: 'Metall Armatura va Prokat Hisoblagichi',
    ru: 'Калькулятор стальной арматуры и проката',
    en: 'Steel Rebar & Structural Steel Calculator'
  },
  {
    key: 'calc.rebar.diameter',
    uz: 'Armatura diametri (mm)',
    ru: 'Диаметр арматуры (мм)',
    en: 'Rebar Diameter (mm)'
  },
  {
    key: 'calc.rebar.length',
    uz: 'Jami uzunlik (metr)',
    ru: 'Общая длина прутков (метров)',
    en: 'Total Rebar Length (meters)'
  },
  {
    key: 'calc.rebar.steelGrade',
    uz: 'Po‘lat sinfi (A500C / A400)',
    ru: 'Класс стали (А500С / А400)',
    en: 'Steel Strength Class (A500C / A400)'
  },
  {
    key: 'calc.rebar.linearMass',
    uz: '1 metr chiziqli massasi (kg/m)',
    ru: 'Теоретический вес 1 пог. м (кг/м)',
    en: 'Linear Mass per Meter (kg/m)'
  },
  {
    key: 'calc.rebar.totalWeightKg',
    uz: 'Jami og‘irligi (kg)',
    ru: 'Итоговый вес (кг)',
    en: 'Total Weight (kg)'
  },
  {
    key: 'calc.rebar.totalWeightTons',
    uz: 'Jami og‘irligi (tonna)',
    ru: 'Итоговый тоннаж (т)',
    en: 'Total Tonnage (metric tons)'
  },
  {
    key: 'calc.rebar.bars117m',
    uz: 'Standart 11.7 metrlik novdalar soni',
    ru: 'Количество стандартных хлыстов (11.7 м)',
    en: 'Standard 11.7 m Bar Count'
  },
  {
    key: 'calc.rebar.tonPrice',
    uz: '1 tonna o‘rtacha zavod narxi',
    ru: 'Средняя цена за тонну с завода',
    en: 'Average Mill Gate Price per Ton'
  },

  // calc.esco.*
  {
    key: 'calc.esco.title',
    uz: 'ESCO Energiya Tejamkorlik va Bazalt Izolyatsiyasi',
    ru: 'ЭСКО Калькулятор энергоэффективности и утепления',
    en: 'ESCO Energy Conservation & Insulation Audit'
  },
  {
    key: 'calc.esco.heatedArea',
    uz: 'Bino isitiladigan umumiy maydoni (m²)',
    ru: 'Отапливаемая площадь здания (м²)',
    en: 'Total Heated Floor Area (m²)'
  },
  {
    key: 'calc.esco.insulationThickness',
    uz: 'Bazalt plitalari qalinligi (mm)',
    ru: 'Толщина базальтового утеплителя (мм)',
    en: 'Basalt Wool Insulation Thickness (mm)'
  },
  {
    key: 'calc.esco.standardCode',
    uz: 'Standart: ShNQ 2.01.04-18 «Qurilish issiqlik texnikasi»',
    ru: 'Стандарт: ШНК 2.01.04-18 «Строительная теплотехника»',
    en: 'Code: ShNQ 2.01.04-18 "Building Thermal Engineering"'
  },
  {
    key: 'calc.esco.heatLossReduction',
    uz: 'Issiqlik yo‘qotilishining kamayishi:',
    ru: 'Снижение теплопотерь здания:',
    en: 'Heat Loss Reduction:'
  },
  {
    key: 'calc.esco.annualGasSavings',
    uz: 'Yillik gaz va elektr energiyasi tejalishi (so‘m):',
    ru: 'Годовая экономия на отоплении (сум):',
    en: 'Annual Heating Energy Savings (UZS):'
  },
  {
    key: 'calc.esco.co2Reduction',
    uz: 'CO₂ karbonat angidrid chiqindisi kamayishi (tonna/yil):',
    ru: 'Снижение выбросов CO₂ (тонн/год):',
    en: 'Annual CO₂ Emission Abatement (tons/year):'
  },
  {
    key: 'calc.esco.basaltVolume',
    uz: 'Zaruriy bazalt mineral plitalari hajmi (m³):',
    ru: 'Необходимый объем базальтовой ваты (м³):',
    en: 'Required Basalt Wool Volume (m³):'
  },
  {
    key: 'calc.esco.paybackPeriod',
    uz: 'Kiritilgan investitsiyaning o‘zini oqlash muddati (yil):',
    ru: 'Срок окупаемости вложений (лет):',
    en: 'Investment Payback Period (years):'
  },

  // ==========================================
  // B2B Corporate Tenders
  // ==========================================
  // tenders.*
  {
    key: 'tenders.title',
    uz: 'Yirik Pudratchilar va Korporativ Tenderlar',
    ru: 'Корпоративные строительные тендеры',
    en: 'B2B Construction Tenders & Procurement'
  },
  {
    key: 'tenders.subtitle',
    uz: 'Davlat va xususiy investitsiya loyihalari uchun ulgurji ta‘minot auksionlari',
    ru: 'Оптовые поставки для государственных и частных девелоперских проектов',
    en: 'Bulk material procurement auctions for commercial & public infrastructure projects'
  },
  {
    key: 'tenders.openTenders',
    uz: 'Ochiq tenderlar',
    ru: 'Активные тендеры',
    en: 'Active Tenders'
  },
  {
    key: 'tenders.underReview',
    uz: 'Ko‘rib chiqilmoqda',
    ru: 'На рассмотрении комиссии',
    en: 'Under Committee Review'
  },
  {
    key: 'tenders.awarded',
    uz: 'G‘olib aniqlangan',
    ru: 'Завершен (Победитель выбран)',
    en: 'Awarded & Finalized'
  },
  {
    key: 'tenders.tenderNumber',
    uz: 'Tender №',
    ru: 'Номер тендера',
    en: 'Tender ID'
  },
  {
    key: 'tenders.projectName',
    uz: 'Loyiha nomi',
    ru: 'Название строительного объекта',
    en: 'Project Name'
  },
  {
    key: 'tenders.buyerCompany',
    uz: 'Buyurtmachi kompaniya',
    ru: 'Компания-заказчик',
    en: 'Procuring Entity'
  },
  {
    key: 'tenders.buyerInn',
    uz: 'Buyurtmachi STIR',
    ru: 'ИНН заказчика',
    en: 'Buyer Tax ID (INN)'
  },
  {
    key: 'tenders.volumeSpec',
    uz: 'Talab qilinayotgan hajm va spetsifikatsiya',
    ru: 'Требуемый объем и спецификация',
    en: 'Required Volume & Specifications'
  },
  {
    key: 'tenders.estimatedBudget',
    uz: 'Rejalashtirilgan byudjet',
    ru: 'Заложенный бюджет закупки',
    en: 'Estimated Procurement Budget'
  },
  {
    key: 'tenders.deliveryLocation',
    uz: 'Obyekt joylashuvi',
    ru: 'Локация объекта поставки',
    en: 'Delivery Job Site'
  },
  {
    key: 'tenders.submissionDeadline',
    uz: 'Taklif topshirish muddati',
    ru: 'Срок подачи предложений',
    en: 'Bid Submission Deadline'
  },
  {
    key: 'tenders.participants',
    uz: 'Ishtirokchilar soni',
    ru: 'Число участников',
    en: 'Participating Bidders'
  },
  {
    key: 'tenders.submitBid',
    uz: 'Tijorat Taklifi Berish (Bid)',
    ru: 'Подать коммерческое предложение',
    en: 'Submit Commercial Bid'
  },
  {
    key: 'tenders.viewTender',
    uz: 'Tender talablarini ko‘rish',
    ru: 'Ознакомиться с ТЗ тендера',
    en: 'View Tender Terms'
  },
  {
    key: 'tenders.createTender',
    uz: 'Yangi Tender E‘lon Qilish',
    ru: 'Разместить новый тендер',
    en: 'Publish New Tender'
  },
  {
    key: 'tenders.category',
    uz: 'Tender yo‘nalishi',
    ru: 'Категория закупки',
    en: 'Tender Category'
  },
  {
    key: 'tenders.noTenders',
    uz: 'Hozircha tanlangan toifada faol tenderlar yo‘q',
    ru: 'В выбранной категории нет активных тендеров',
    en: 'No active tenders in selected category'
  },

  // bids.*
  {
    key: 'bids.title',
    uz: 'Tender Taklifi Topshirish',
    ru: 'Подача тендерного предложения',
    en: 'Tender Bid Submission'
  },
  {
    key: 'bids.bidderCompany',
    uz: 'Ishtirokchi korxona nomi',
    ru: 'Название организации-поставщика',
    en: 'Bidder Company Name'
  },
  {
    key: 'bids.bidderInn',
    uz: 'Ishtirokchi STIR',
    ru: 'ИНН участника',
    en: 'Bidder Tax ID (INN)'
  },
  {
    key: 'bids.bidderPhone',
    uz: 'Mas‘ul shaxs telefoni',
    ru: 'Телефон контактного лица',
    en: 'Contact Person Phone'
  },
  {
    key: 'bids.pricePerUnit',
    uz: 'Taklif etilayotgan narx (QQS bilan)',
    ru: 'Предлагаемая цена (с НДС)',
    en: 'Proposed Bid Price (incl. VAT)'
  },
  {
    key: 'bids.deliveryDays',
    uz: 'Yetkazib berish muddati (kun)',
    ru: 'Срок поставки (дней)',
    en: 'Delivery Schedule (days)'
  },
  {
    key: 'bids.comment',
    uz: 'Qo‘shimcha shartlar va transport imkoniyatlari',
    ru: 'Дополнительные условия и логистика',
    en: 'Additional Logistics & Commercial Terms'
  },
  {
    key: 'bids.attachProposal',
    uz: 'Rasmiy tijorat taklifi (PDF/Excel)',
    ru: 'Прикрепить официальное КП (PDF/Excel)',
    en: 'Attach Official Commercial Offer (PDF/Excel)'
  },
  {
    key: 'bids.submitSuccess',
    uz: 'Taklifingiz muvaffaqiyatli qabul qilindi va tender komissiyasiga yuborildi',
    ru: 'Ваше предложение успешно зарегистрировано и отправлено комиссии',
    en: 'Your bid was successfully registered and sent to the procurement committee'
  },
  {
    key: 'bids.statusPending',
    uz: 'Ko‘rib chiqilmoqda',
    ru: 'На рассмотрении',
    en: 'Under Review'
  },
  {
    key: 'bids.statusAccepted',
    uz: 'G‘olib deb topildi',
    ru: 'Принято (Победитель)',
    en: 'Accepted (Winner)'
  },
  {
    key: 'bids.statusRejected',
    uz: 'Rad etildi',
    ru: 'Отклонено',
    en: 'Rejected'
  },

  // ==========================================
  // Cart, Escrow & Checkout
  // ==========================================
  // cart.*
  {
    key: 'cart.title',
    uz: 'Savatingiz',
    ru: 'Ваша корзина',
    en: 'Your Shopping Cart'
  },
  {
    key: 'cart.empty',
    uz: 'Savatingiz bo‘sh',
    ru: 'Ваша корзина пуста',
    en: 'Your cart is currently empty'
  },
  {
    key: 'cart.emptyDesc',
    uz: 'Mahsulotlar katalogiga o‘ting va kerakli materiallarni tanlang',
    ru: 'Перейдите в каталог и выберите необходимые строительные материалы',
    en: 'Browse the catalog to select the building supplies you need'
  },
  {
    key: 'cart.itemsCount',
    uz: 'Mahsulotlar soni:',
    ru: 'Количество позиций:',
    en: 'Line items:'
  },
  {
    key: 'cart.totalWeight',
    uz: 'Jami taxminiy yuk vazni:',
    ru: 'Общий расчетный вес груза:',
    en: 'Total Estimated Cargo Weight:'
  },
  {
    key: 'cart.totalAmount',
    uz: 'Jami tovarlar summasi:',
    ru: 'Итоговая стоимость товаров:',
    en: 'Total Merchandise Amount:'
  },
  {
    key: 'cart.clearCart',
    uz: 'Savatni tozalash',
    ru: 'Очистить корзину',
    en: 'Clear Cart'
  },
  {
    key: 'cart.continueShopping',
    uz: 'Xaridni davom ettirish',
    ru: 'Продолжить покупки',
    en: 'Continue Shopping'
  },
  {
    key: 'cart.proceedCheckout',
    uz: 'Rasmiylashtirishga o‘tish',
    ru: 'Перейти к оформлению',
    en: 'Proceed to Checkout'
  },

  // checkout.*
  {
    key: 'checkout.title',
    uz: 'Buyurtmani Rasmiylashtirish',
    ru: 'Оформление заказа',
    en: 'Order Checkout'
  },
  {
    key: 'checkout.deliveryMethod',
    uz: 'Yetkazib berish usuli',
    ru: 'Способ получения',
    en: 'Fulfillment Method'
  },
  {
    key: 'checkout.methodCourier',
    uz: 'Obyektgacha yetkazib berish (BunkerStroy Fleets)',
    ru: 'Доставка на стройплощадку автопарком',
    en: 'Job Site Freight Delivery'
  },
  {
    key: 'checkout.methodPickup',
    uz: 'Ombordan o‘zi olib ketish (Samovivoz)',
    ru: 'Самовывоз со склада производителя',
    en: 'Warehouse Self-Pickup'
  },
  {
    key: 'checkout.customerInfo',
    uz: 'Buyurtmachi ma‘lumotlari',
    ru: 'Данные заказчика',
    en: 'Purchaser Information'
  },
  {
    key: 'checkout.fullName',
    uz: 'F.I.Sh. yoki Mas‘ul vakil',
    ru: 'Ф.И.О. или ответственный представитель',
    en: 'Full Name / Representative'
  },
  {
    key: 'checkout.phoneNumber',
    uz: 'Asosiy telefon raqami',
    ru: 'Основной номер телефона',
    en: 'Primary Phone Number'
  },
  {
    key: 'checkout.secondaryPhone',
    uz: 'Qo‘shimcha telefon raqami',
    ru: 'Дополнительный номер телефона',
    en: 'Secondary Phone Number'
  },
  {
    key: 'checkout.companyInn',
    uz: 'Tashkilot STIR (yuridik shaxslar uchun)',
    ru: 'ИНН организации (для юр. лиц)',
    en: 'Company Tax ID (INN, for corporate buyers)'
  },
  {
    key: 'checkout.deliveryAddress',
    uz: 'Yetkazib berish manzili',
    ru: 'Адрес разгрузки',
    en: 'Delivery Site Address'
  },
  {
    key: 'checkout.region',
    uz: 'Viloyat / viloyat markazi',
    ru: 'Область / регион',
    en: 'Province / Region'
  },
  {
    key: 'checkout.district',
    uz: 'Tuman / shahar',
    ru: 'Район / город',
    en: 'District / City'
  },
  {
    key: 'checkout.street',
    uz: 'Ko‘cha va bino / obyekt nomi',
    ru: 'Улица, номер дома / ориентир объекта',
    en: 'Street Address & Site Identification'
  },
  {
    key: 'checkout.landmark',
    uz: 'Mo‘ljal (karyer, chorraha yoki bino)',
    ru: 'Ориентир для водителя',
    en: 'Driver Navigational Landmark'
  },
  {
    key: 'checkout.saveSite',
    uz: 'Ushbu manzilni kelgusi buyurtmalar uchun saqlab qo‘yish',
    ru: 'Сохранить этот объект для будущих заказов',
    en: 'Save this construction site for future deliveries'
  },
  {
    key: 'checkout.siteName',
    uz: 'Obyekt nomi (masalan: «Chilonzor Bino 14»)',
    ru: 'Название объекта (напр. «ЖК Чиланзар 14»)',
    en: 'Site Nickname (e.g., "Yunusabad Tower Block B")'
  },
  {
    key: 'checkout.orderSummary',
    uz: 'Buyurtma tafsilotlari',
    ru: 'Сводка заказа',
    en: 'Order Summary'
  },
  {
    key: 'checkout.deliveryFee',
    uz: 'Yetkazib berish xizmati narxi:',
    ru: 'Стоимость грузовой доставки:',
    en: 'Freight Delivery Fee:'
  },
  {
    key: 'checkout.grandTotal',
    uz: 'Jami to‘lov summasi:',
    ru: 'Общая сумма к оплате:',
    en: 'Grand Total Payable:'
  },
  {
    key: 'checkout.confirmOrder',
    uz: 'Buyurtmani Tasdiqlash va To‘lash',
    ru: 'Подтвердить заказ и оплатить',
    en: 'Confirm Order & Proceed to Payment'
  },

  // escrow.*
  {
    key: 'escrow.title',
    uz: '50/50 Kafolatlangan Escrow Hisob-kitob',
    ru: 'Гарантированный эскроу-расчет 50/50',
    en: '50/50 Protected Escrow Settlement'
  },
  {
    key: 'escrow.modeSplit',
    uz: '50% Oldindan + 50% Obyektda qabul qilinganda',
    ru: '50% предоплата + 50% при приемке на объекте',
    en: '50% Initial Deposit + 50% Upon Site Inspection'
  },
  {
    key: 'escrow.modeFull',
    uz: '100% To‘liq oldindan to‘lov',
    ru: '100% Полная предоплата',
    en: '100% Full Prepayment'
  },
  {
    key: 'escrow.howItWorks',
    uz: '50/50 Escrow qanday ishlaydi?',
    ru: 'Как работает эскроу 50/50?',
    en: 'How does 50/50 Escrow work?'
  },
  {
    key: 'escrow.step1',
    uz: 'Siz birinchi 50% to‘lovni amalga oshirasiz. Mablag‘ BunkerStroy neytral escrow hisobida xavfsiz muzlatiladi.',
    ru: 'Вы вносите первые 50% предоплаты. Средства замораживаются на защищенном эскроу-счете BunkerStroy.',
    en: 'You deposit the initial 50%. Funds are securely held in BunkerStroy neutral escrow.'
  },
  {
    key: 'escrow.step2',
    uz: 'Ta‘minotchi zavod tovarni sifat nazorati bilan yuklaydi va HOWO/Fura transportida obyektga jo‘natadi.',
    ru: 'Завод комплектует заказ, проверяет качество и отправляет спецтранспортом на ваш объект.',
    en: 'The supplier manufactures and loads the cargo, dispatching it via heavy freight to your site.'
  },
  {
    key: 'escrow.step3',
    uz: 'Mahsulot obyektga yetib kelgach, sifat va miqdorni tekshirasiz, qolgan 50% to‘lovni bajarasiz va dalolatnomani tasdiqlaysiz.',
    ru: 'По прибытии груза вы осматриваете товар, оплачиваете оставшиеся 50% и подтверждаете акт приема.',
    en: 'Once the cargo arrives, you physically inspect quantity & quality, release the remaining 50%, and sign off.'
  },
  {
    key: 'escrow.guaranteeTitle',
    uz: '100% Moliyaviy Xavfsizlik Kafolati',
    ru: '100% Финансовая гарантия безопасности',
    en: '100% Financial Protection Guarantee'
  },
  {
    key: 'escrow.guaranteeDesc',
    uz: 'Agar tovar shikastlangan bo‘lsa yoki talabga javob bermasa, nizo ochiladi va mablag‘ingiz to‘liq qaytariladi.',
    ru: 'При несоответствии качества или повреждении груза открывается арбитраж, и средства возвращаются покупателю.',
    en: 'In case of defect or non-conformance, a dispute is initiated and your escrow deposit is safeguarded.'
  },

  // payment.*
  {
    key: 'payment.method',
    uz: 'To‘lov usulini tanlang',
    ru: 'Выберите способ оплаты',
    en: 'Select Payment Method'
  },
  {
    key: 'payment.payme',
    uz: 'Payme (Bank kartasi orqali)',
    ru: 'Payme (Банковской картой)',
    en: 'Payme (Uzcard / Humo)'
  },
  {
    key: 'payment.click',
    uz: 'Click (Click Up / USSD)',
    ru: 'Click (Click Up / USSD)',
    en: 'Click (Click Up / USSD)'
  },
  {
    key: 'payment.uzum',
    uz: 'Uzum Bank / Uzum Pay',
    ru: 'Uzum Bank / Uzum Pay',
    en: 'Uzum Bank / Uzum Pay'
  },
  {
    key: 'payment.bankTransfer',
    uz: 'Korporativ Bank O‘tkazmasi (Hisob-raqam / MFO)',
    ru: 'Банковский перевод по реквизитам (счет / МФО)',
    en: 'Corporate Wire Transfer (Bank Account / MFO)'
  },
  {
    key: 'payment.cashOnDelivery',
    uz: 'Yetkazilganda naqd yoki terminal orqali',
    ru: 'Оплата на месте (Наличными или терминалом)',
    en: 'Cash / Terminal on Delivery'
  },
  {
    key: 'payment.depositAmount',
    uz: 'Hozir to‘lanadigan 50% miqdor:',
    ru: 'Сумма предоплаты 50% к оплате сейчас:',
    en: '50% Advance Deposit Due Now:'
  },
  {
    key: 'payment.balanceAmount',
    uz: 'Obyektda to‘lanadigan qoldiq 50%:',
    ru: 'Остаток 50% к оплате при приемке:',
    en: 'Remaining 50% Due Upon Site Inspection:'
  },
  {
    key: 'payment.secureNotice',
    uz: 'Barcha to‘lovlar O‘zbekiston Respublikasi Markaziy Banki litsenziyasiga ega shlyuzlar orqali amalga oshiriladi.',
    ru: 'Все платежи защищены протоколами безопасности ЦБ РУз.',
    en: 'All transactions are processed through Central Bank of Uzbekistan licensed payment gateways.'
  },
  {
    key: 'payment.invoiceDownload',
    uz: 'To‘lov uchun hisob-faktura (Invoys)',
    ru: 'Счет на оплату для юр. лиц (Инвойс)',
    en: 'Pro-Forma Payment Invoice (PDF)'
  },

  // ==========================================
  // Customer Orders & Cabinet
  // ==========================================
  // orders.*
  {
    key: 'orders.title',
    uz: 'Buyurtmalar Tarixi va Monitoring',
    ru: 'История и мониторинг заказов',
    en: 'Order History & Dispatch Tracking'
  },
  {
    key: 'orders.orderNumber',
    uz: 'Buyurtma №',
    ru: 'Номер заказа',
    en: 'Order Number'
  },
  {
    key: 'orders.date',
    uz: 'Buyurtma berilgan sana',
    ru: 'Дата заказа',
    en: 'Order Date'
  },
  {
    key: 'orders.status',
    uz: 'Holat',
    ru: 'Статус',
    en: 'Status'
  },
  {
    key: 'orders.items',
    uz: 'Buyurtma qilingan mahsulotlar',
    ru: 'Список товаров',
    en: 'Order Items'
  },
  {
    key: 'orders.total',
    uz: 'Jami qiymat',
    ru: 'Общая сумма',
    en: 'Total Amount'
  },
  {
    key: 'orders.paidAmount',
    uz: 'To‘langan summa',
    ru: 'Оплачено',
    en: 'Paid Amount'
  },
  {
    key: 'orders.remainingAmount',
    uz: 'To‘lanishi kerak bo‘lgan qoldiq',
    ru: 'Остаток к доплате',
    en: 'Remaining Balance'
  },
  {
    key: 'orders.destinationSite',
    uz: 'Yetkazib berish manzili',
    ru: 'Объект доставки',
    en: 'Delivery Destination'
  },
  {
    key: 'orders.driverAssigned',
    uz: 'Tayinlangan haydovchi',
    ru: 'Водитель на рейсе',
    en: 'Assigned Driver'
  },
  {
    key: 'orders.trackShipment',
    uz: 'Yukni Xaritada Kuzatish',
    ru: 'Отследить рейс на карте',
    en: 'Track Freight on Map'
  },
  {
    key: 'orders.confirmReceipt',
    uz: 'Qabul qilib oldim (50% qoldiqni to‘lash)',
    ru: 'Принять груз (Оплатить остаток 50%)',
    en: 'Confirm Receipt & Settle Balance'
  },
  {
    key: 'orders.openDispute',
    uz: 'Nizo Ochish (E‘tiroz bildirish)',
    ru: 'Открыть спор (Претензия)',
    en: 'Open Formal Dispute'
  },
  {
    key: 'orders.viewDocs',
    uz: 'B2B Hujjatlar va E-IMZO',
    ru: 'Документы и ЭЦП',
    en: 'B2B Documents & E-IMZO'
  },
  {
    key: 'orders.repeatOrder',
    uz: 'Buyurtmani takrorlash',
    ru: 'Повторить заказ',
    en: 'Re-order Items'
  },
  {
    key: 'orders.cancelOrder',
    uz: 'Buyurtmani bekor qilish',
    ru: 'Отменить заказ',
    en: 'Cancel Order'
  },

  // orders.status.*
  {
    key: 'orders.status.draft',
    uz: 'Savatda',
    ru: 'Черновик',
    en: 'Draft'
  },
  {
    key: 'orders.status.pendingPayment',
    uz: 'To‘lov kutilmoqda',
    ru: 'Ожидает оплаты',
    en: 'Awaiting Payment'
  },
  {
    key: 'orders.status.paid',
    uz: '1-bosqich to‘landi (Tasdiqlandi)',
    ru: 'Предоплата внесена (Подтвержден)',
    en: 'Deposit Paid (Confirmed)'
  },
  {
    key: 'orders.status.accepted',
    uz: 'Ta‘minotchi zavod tasdiqladi',
    ru: 'Принят заводом-изготовителем',
    en: 'Accepted by Manufacturer'
  },
  {
    key: 'orders.status.packing',
    uz: 'Omborda yig‘ilmoqda',
    ru: 'Комплектуется на складе',
    en: 'Packing & Assembly'
  },
  {
    key: 'orders.status.assigned',
    uz: 'Haydovchi va transport biriktirildi',
    ru: 'Спецтранспорт и водитель назначены',
    en: 'Fleet & Driver Dispatched'
  },
  {
    key: 'orders.status.inTransit',
    uz: '🚚 Yuk ortildi va yo‘lda',
    ru: '🚚 В пути к объекту',
    en: '🚚 Freight En Route'
  },
  {
    key: 'orders.status.arrived',
    uz: 'Obyektga yetib keldi',
    ru: 'Прибыл на стройплощадку',
    en: 'Arrived at Construction Site'
  },
  {
    key: 'orders.status.fullyPaid',
    uz: 'To‘liq to‘landi (100%)',
    ru: 'Оплачен полностью (100%)',
    en: 'Fully Paid (100%)'
  },
  {
    key: 'orders.status.received',
    uz: 'Yuk tekshirildi va qabul qilindi',
    ru: 'Груз проверен и принят',
    en: 'Goods Inspected & Received'
  },
  {
    key: 'orders.status.completed',
    uz: 'Yakunlandi (Escrow mablag‘i ajratildi)',
    ru: 'Завершен (Эскроу средства переведены)',
    en: 'Completed (Escrow Funds Released)'
  },
  {
    key: 'orders.status.cancelled',
    uz: 'Bekor qilingan',
    ru: 'Отменен',
    en: 'Cancelled'
  },
  {
    key: 'orders.status.dispute',
    uz: 'Ochiq nizo (Ekspertiza jarayonida)',
    ru: 'Открыт спор (На арбитраже)',
    en: 'Under Active Dispute Arbitration'
  },
  {
    key: 'orders.status.returnRequested',
    uz: 'Qaytarish so‘rovi berildi',
    ru: 'Запрошен возврат',
    en: 'Return Requested'
  },
  {
    key: 'orders.status.returned',
    uz: 'Tovar qaytarildi',
    ru: 'Товар возвращен',
    en: 'Returned to Supplier'
  },

  // dispute.*
  {
    key: 'dispute.modalTitle',
    uz: 'Buyurtma Bo‘yicha Nizo Ochish',
    ru: 'Открытие арбитражного спора',
    en: 'Open Arbitration Dispute'
  },
  {
    key: 'dispute.orderRef',
    uz: 'Buyurtma:',
    ru: 'По заказу:',
    en: 'Concerning Order:'
  },
  {
    key: 'dispute.reason',
    uz: 'E‘tiroz sababi (sifat, yetishmovchilik, nosozlik)',
    ru: 'Причина претензии (качество, недостача, брак)',
    en: 'Reason for Dispute (defects, shortages, damage)'
  },
  {
    key: 'dispute.reasonPlaceholder',
    uz: 'Masalan: 5 ta qop sement yirtilgan yoki armatura GOST spetsifikatsiyasiga mos kelmadi...',
    ru: 'Например: 5 мешков цемента повреждены или арматура не соответствует ГОСТу...',
    en: 'E.g.: 5 cement sacks arrived punctured or steel rebar grade fails GOST spec...'
  },
  {
    key: 'dispute.evidenceUrl',
    uz: 'Foto yoki video dalil havolasi (ixtiyoriy)',
    ru: 'Ссылка на фото/видео подтверждение (необязательно)',
    en: 'Photo/Video Evidence Link (optional)'
  },
  {
    key: 'dispute.submitBtn',
    uz: 'Nizoni Arbitrajga Yuborish',
    ru: 'Отправить претензию в арбитраж',
    en: 'Submit Dispute to Arbitration'
  },
  {
    key: 'dispute.cancelBtn',
    uz: 'Bekor qilish',
    ru: 'Отмена',
    en: 'Cancel'
  },
  {
    key: 'dispute.submittedSuccess',
    uz: 'Sizning e‘tirozingiz qabul qilindi. 24 soat ichida BunkerStroy komissiyasi va ekspertlar bog‘lanadi.',
    ru: 'Претензия принята. Арбитражная комиссия BunkerStroy рассмотрит ее в течение 24 часов.',
    en: 'Dispute successfully registered. The BunkerStroy arbitration committee will review it within 24 hours.'
  },
  {
    key: 'dispute.frozenNotice',
    uz: 'Nizo hal bo‘lmaguncha escrow mablag‘i sotuvchiga o‘tkazilmaydi.',
    ru: 'Средства на эскроу-счете заморожены до вынесения решения комиссии.',
    en: 'Escrow funds remain frozen until arbitration reaches a final resolution.'
  },

  // ==========================================
  // Partner & Seller Portal
  // ==========================================
  // partner.*
  {
    key: 'partner.portalTitle',
    uz: 'BunkerStroy Sotuvchi va Ishlab Chiqaruvchi Portali',
    ru: 'Портал продавцов и производителей BunkerStroy',
    en: 'BunkerStroy Seller & Manufacturer Portal'
  },
  {
    key: 'partner.dashboard',
    uz: 'Boshqaruv Paneli',
    ru: 'Панель управления',
    en: 'Partner Dashboard'
  },
  {
    key: 'partner.welcome',
    uz: 'Xush kelibsiz',
    ru: 'Добро пожаловать',
    en: 'Welcome'
  },
  {
    key: 'partner.totalRevenue',
    uz: 'Jami tushum',
    ru: 'Общая выручка',
    en: 'Total Revenue'
  },
  {
    key: 'partner.pendingOrders',
    uz: 'Yangi buyurtmalar',
    ru: 'Новые заказы',
    en: 'Pending Orders'
  },
  {
    key: 'partner.activeProducts',
    uz: 'Sotuvdagi mahsulotlar',
    ru: 'Активные товары',
    en: 'Active Catalog Items'
  },
  {
    key: 'partner.escrowBalance',
    uz: '50/50 Escrow hisobidagi mablag‘',
    ru: 'Средства на счете 50/50 Эскроу',
    en: 'Pending Escrow Balance'
  },
  {
    key: 'partner.payoutAvailable',
    uz: 'Yechib olishga tayyor balans',
    ru: 'Доступно к выплате на расчетный счет',
    en: 'Available for Settlement Payout'
  },
  {
    key: 'partner.requestPayout',
    uz: 'Hisob-raqamga yechish',
    ru: 'Запросить вывод средств',
    en: 'Request Settlement Payout'
  },
  {
    key: 'partner.quickActions',
    uz: 'Tezkor amallar',
    ru: 'Быстрые действия',
    en: 'Quick Actions'
  },
  {
    key: 'partner.addNewProduct',
    uz: '+ Yangi tovar qo‘shish',
    ru: '+ Добавить новый товар',
    en: '+ Add New Product'
  },

  // partner.role.*
  {
    key: 'partner.role.factory',
    uz: 'Ishlab Chiqaruvchi Zavod',
    ru: 'Завод-производитель',
    en: 'Manufacturing Plant'
  },
  {
    key: 'partner.role.factoryDesc',
    uz: 'Katta tonnajli ulgurji savdo, vagon va furalarda jo‘natish',
    ru: 'Оптовые отгрузки вагонами и фурами напрямую с завода',
    en: 'Large-scale bulk wholesale, railcar and truckload freight shipments'
  },
  {
    key: 'partner.role.store',
    uz: 'Qurilish Mollari Do‘koni',
    ru: 'Магазин / База стройматериалов',
    en: 'Building Materials Store / Yard'
  },
  {
    key: 'partner.role.storeDesc',
    uz: 'Hududiy chakana va kichik ulgurji savdo, kassa POS CRM',
    ru: 'Локальная розница и мелкий опт, кассовый учет POS',
    en: 'Local retail and trade counter sales, POS CRM integration'
  },
  {
    key: 'partner.role.distributor',
    uz: 'Rasmiy Distribyutor',
    ru: 'Официальный дистрибьютор',
    en: 'Authorized Regional Distributor'
  },
  {
    key: 'partner.role.distributorDesc',
    uz: 'Viloyat markaziy ombori va dilerlik tarmog‘i ta‘minoti',
    ru: 'Центральный склад региона и снабжение дилерской сети',
    en: 'Regional hub warehouse and dealer supply network'
  },

  // partner.pos.*
  {
    key: 'partner.pos.title',
    uz: 'Do‘kon Kassa Tizimi (POS CRM)',
    ru: 'Кассовый терминал магазина (POS CRM)',
    en: 'Store Point of Sale Terminal (POS CRM)'
  },
  {
    key: 'partner.pos.scanBarcode',
    uz: 'Shtrix-kod skanerlang yoki tovar nomini yozing...',
    ru: 'Сканируйте штрих-код или введите наименование...',
    en: 'Scan barcode or type product name...'
  },
  {
    key: 'partner.pos.cashDesk',
    uz: 'Kassa №1',
    ru: 'Касса №1',
    en: 'Register #1'
  },
  {
    key: 'partner.pos.cartEmpty',
    uz: 'Chek bo‘sh. Tovar qo‘shing.',
    ru: 'Чек пуст. Добавьте товары.',
    en: 'Register slip is empty. Add products.'
  },
  {
    key: 'partner.pos.checkoutCash',
    uz: 'Naqd to‘lov',
    ru: 'Оплата наличными',
    en: 'Cash Tender'
  },
  {
    key: 'partner.pos.checkoutCard',
    uz: 'Terminal / Karta',
    ru: 'Банковская карта',
    en: 'Terminal / Card'
  },
  {
    key: 'partner.pos.checkoutDebt',
    uz: 'Nasiya (Qarz daftari)',
    ru: 'В долг (Дебиторка)',
    en: 'On Credit (Accounts Receivable)'
  },
  {
    key: 'partner.pos.printReceipt',
    uz: 'Chek chiqarish (58/80 mm)',
    ru: 'Печать чека',
    en: 'Print Receipt'
  },
  {
    key: 'partner.pos.dailyReport',
    uz: 'Kunlik kassa hisoboti (Z-hisobot)',
    ru: 'Z-отчет за смену',
    en: 'Daily Shift Reconciliation (Z-Report)'
  },
  {
    key: 'partner.pos.totalCash',
    uz: 'Naqd tushum',
    ru: 'Наличные в кассе',
    en: 'Total Cash Collected'
  },
  {
    key: 'partner.pos.totalCard',
    uz: 'Terminal tushumi',
    ru: 'Оплата по картам',
    en: 'Total Card Payments'
  },
  {
    key: 'partner.pos.totalDebt',
    uz: 'Nasiyaga berilgan',
    ru: 'Отпущено в долг',
    en: 'Total Dispatched on Credit'
  },

  // partner.inventory.*
  {
    key: 'partner.inventory.title',
    uz: 'Ombor va Qoldiqlar Boshqaruvi',
    ru: 'Управление складом и остатками',
    en: 'Warehouse & Stock Management'
  },
  {
    key: 'partner.inventory.productName',
    uz: 'Tovar nomi',
    ru: 'Наименование товара',
    en: 'Product Name'
  },
  {
    key: 'partner.inventory.currentStock',
    uz: 'Joriy qoldiq',
    ru: 'Текущий остаток',
    en: 'On-Hand Stock'
  },
  {
    key: 'partner.inventory.reserved',
    uz: 'Rezerv qilingan',
    ru: 'В резерве (заказы)',
    en: 'Reserved for Orders'
  },
  {
    key: 'partner.inventory.incoming',
    uz: 'Yo‘ldagi partiya',
    ru: 'В пути на склад',
    en: 'Incoming Shipments'
  },
  {
    key: 'partner.inventory.reorderPoint',
    uz: 'Minimal ogohlantirish nuqtasi',
    ru: 'Порог неснижаемого остатка',
    en: 'Safety Stock Level'
  },
  {
    key: 'partner.inventory.updateStock',
    uz: 'Qoldiqni yangilash',
    ru: 'Обновить количество',
    en: 'Adjust Stock Quantity'
  },
  {
    key: 'partner.inventory.stockIn',
    uz: 'Kirim qilish',
    ru: 'Оприходовать партию',
    en: 'Receive Goods'
  },
  {
    key: 'partner.inventory.stockOut',
    uz: 'Chiqim qilish',
    ru: 'Списание со склада',
    en: 'Write-Off / Transfer'
  },
  {
    key: 'partner.inventory.history',
    uz: 'Qoldiqlar harakati tarixi',
    ru: 'История складских перемещений',
    en: 'Stock Movement Ledger'
  },

  // partner.b2b.*
  {
    key: 'partner.b2b.title',
    uz: 'Zavodlardan Ulgurji Xarid (B2B Hub)',
    ru: 'Оптовые закупки с заводов (B2B Hub)',
    en: 'Direct Factory Procurement (B2B Hub)'
  },
  {
    key: 'partner.b2b.directFactoryPrices',
    uz: 'Zavod tannarxida vositachisiz to‘g‘ridan-to‘g‘ri xarid qiling',
    ru: 'Закупайте по заводской себестоимости без наценок посредников',
    en: 'Procure directly at mill-gate prices with zero broker commissions'
  },
  {
    key: 'partner.b2b.requestConsignment',
    uz: 'Konsignatsiya yoki nasiya shartnomasi',
    ru: 'Запрос на факторинг / отсрочку платежа',
    en: 'Request Deferred Payment / Consignment'
  },
  {
    key: 'partner.b2b.railwayDelivery',
    uz: 'Temir yo‘l vagonlarida yetkazib berish',
    ru: 'Ж/Д доставка вагонами',
    en: 'Railcar Freight Delivery'
  },
  {
    key: 'partner.b2b.contractDraft',
    uz: 'Shartnoma loyihasi',
    ru: 'Проект договора поставки',
    en: 'Draft Supply Agreement'
  },
  {
    key: 'partner.b2b.applyForCredit',
    uz: 'B2B Tovarlarni muddatli to‘lovga olish',
    ru: 'Оформить товарный кредит для бизнеса',
    en: 'Apply for Trade Credit Line'
  },

  // ==========================================
  // Common UI Actions & Feedback
  // ==========================================
  // common.*
  {
    key: 'common.loading',
    uz: 'Yuklanmoqda...',
    ru: 'Загрузка данных...',
    en: 'Loading...'
  },
  {
    key: 'common.save',
    uz: 'Saqlash',
    ru: 'Сохранить',
    en: 'Save'
  },
  {
    key: 'common.cancel',
    uz: 'Bekor qilish',
    ru: 'Отмена',
    en: 'Cancel'
  },
  {
    key: 'common.confirm',
    uz: 'Tasdiqlash',
    ru: 'Подтвердить',
    en: 'Confirm'
  },
  {
    key: 'common.delete',
    uz: 'O‘chirish',
    ru: 'Удалить',
    en: 'Delete'
  },
  {
    key: 'common.edit',
    uz: 'Tahrirlash',
    ru: 'Редактировать',
    en: 'Edit'
  },
  {
    key: 'common.back',
    uz: 'Orqaga',
    ru: 'Назад',
    en: 'Back'
  },
  {
    key: 'common.next',
    uz: 'Keyingisi',
    ru: 'Далее',
    en: 'Next'
  },
  {
    key: 'common.search',
    uz: 'Qidirish',
    ru: 'Поиск',
    en: 'Search'
  },
  {
    key: 'common.filter',
    uz: 'Filtr',
    ru: 'Фильтр',
    en: 'Filter'
  },
  {
    key: 'common.all',
    uz: 'Hammasi',
    ru: 'Все',
    en: 'All'
  },
  {
    key: 'common.yes',
    uz: 'Ha',
    ru: 'Да',
    en: 'Yes'
  },
  {
    key: 'common.no',
    uz: 'Yo‘q',
    ru: 'Нет',
    en: 'No'
  },
  {
    key: 'common.status',
    uz: 'Holat',
    ru: 'Статус',
    en: 'Status'
  },
  {
    key: 'common.actions',
    uz: 'Amallar',
    ru: 'Действия',
    en: 'Actions'
  },
  {
    key: 'common.date',
    uz: 'Sana',
    ru: 'Дата',
    en: 'Date'
  },
  {
    key: 'common.time',
    uz: 'Vaqt',
    ru: 'Время',
    en: 'Time'
  },
  {
    key: 'common.details',
    uz: 'Tafsilotlar',
    ru: 'Подробности',
    en: 'Details'
  },
  {
    key: 'common.sum',
    uz: 'so‘m',
    ru: 'сум',
    en: 'UZS'
  },
  {
    key: 'common.perUnit',
    uz: 'dona',
    ru: 'шт.',
    en: 'pcs'
  },
  {
    key: 'common.ton',
    uz: 'tonna',
    ru: 'т',
    en: 'tons'
  },
  {
    key: 'common.meter',
    uz: 'metr',
    ru: 'м',
    en: 'meters'
  },
  {
    key: 'common.m2',
    uz: 'm²',
    ru: 'м²',
    en: 'm²'
  },
  {
    key: 'common.m3',
    uz: 'm³',
    ru: 'м³',
    en: 'm³'
  },
  {
    key: 'common.kg',
    uz: 'kg',
    ru: 'кг',
    en: 'kg'
  },
  {
    key: 'common.km',
    uz: 'km',
    ru: 'км',
    en: 'km'
  },
  {
    key: 'common.hour',
    uz: 'soat',
    ru: 'ч',
    en: 'hrs'
  },
  {
    key: 'common.day',
    uz: 'kun',
    ru: 'дн.',
    en: 'days'
  },
  {
    key: 'common.requiredField',
    uz: 'Ushbu maydon to‘ldirilishi shart',
    ru: 'Обязательное поле для заполнения',
    en: 'This field is mandatory'
  },
  {
    key: 'common.noData',
    uz: 'Ma‘lumot mavjud emas',
    ru: 'Данные отсутствуют',
    en: 'No data available'
  },

  // button.*
  {
    key: 'button.submit',
    uz: 'Yuborish',
    ru: 'Отправить',
    en: 'Submit'
  },
  {
    key: 'button.saveChanges',
    uz: 'O‘zgarishlarni saqlash',
    ru: 'Сохранить изменения',
    en: 'Save Changes'
  },
  {
    key: 'button.close',
    uz: 'Yopish',
    ru: 'Закрыть',
    en: 'Close'
  },
  {
    key: 'button.apply',
    uz: 'Qo‘llash',
    ru: 'Применить',
    en: 'Apply'
  },
  {
    key: 'button.reset',
    uz: 'Tozalash',
    ru: 'Сбросить',
    en: 'Reset'
  },
  {
    key: 'button.download',
    uz: 'Yuklab olish',
    ru: 'Скачать',
    en: 'Download'
  },
  {
    key: 'button.upload',
    uz: 'Yuklash',
    ru: 'Загрузить',
    en: 'Upload'
  },
  {
    key: 'button.copy',
    uz: 'Nusxalash',
    ru: 'Скопировать',
    en: 'Copy'
  },
  {
    key: 'button.copied',
    uz: 'Nusxalandi!',
    ru: 'Скопировано!',
    en: 'Copied!'
  },
  {
    key: 'button.refresh',
    uz: 'Yangilash',
    ru: 'Обновить',
    en: 'Refresh'
  },
  {
    key: 'button.logout',
    uz: 'Tizimdan chiqish',
    ru: 'Выйти из аккаунта',
    en: 'Log Out'
  },
  {
    key: 'button.login',
    uz: 'Kirish',
    ru: 'Войти',
    en: 'Sign In'
  },
  {
    key: 'button.register',
    uz: 'Ro‘yxatdan o‘tish',
    ru: 'Регистрация',
    en: 'Register'
  },
  {
    key: 'button.viewMore',
    uz: 'Yana ko‘rsatish',
    ru: 'Показать еще',
    en: 'View More'
  },
  {
    key: 'button.showLess',
    uz: 'Qisqartirish',
    ru: 'Свернуть',
    en: 'Show Less'
  },

  // alert.*
  {
    key: 'alert.success',
    uz: 'Muvaffaqiyatli bajarildi!',
    ru: 'Успешно выполнено!',
    en: 'Operation completed successfully!'
  },
  {
    key: 'alert.error',
    uz: 'Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.',
    ru: 'Произошла ошибка. Пожалуйста, повторите попытку.',
    en: 'An error occurred. Please try again.'
  },
  {
    key: 'alert.warning',
    uz: 'Diqqat! Ushbu amalni tekshiring.',
    ru: 'Внимание! Проверьте введенные данные.',
    en: 'Attention! Please verify your action.'
  },
  {
    key: 'alert.info',
    uz: 'Ma‘lumot uchun',
    ru: 'К сведению',
    en: 'Information note'
  },
  {
    key: 'alert.networkError',
    uz: 'Server bilan aloqa uzildi. Internetni tekshiring.',
    ru: 'Ошибка сети. Проверьте подключение к интернету.',
    en: 'Network connection failed. Please check your connection.'
  },
  {
    key: 'alert.validationError',
    uz: 'Shaklda xatoliklar mavjud. Maydonlarni to‘g‘ri to‘ldiring.',
    ru: 'Форма содержит ошибки. Пожалуйста, проверьте заполнение.',
    en: 'The form contains errors. Please check all fields.'
  },
  {
    key: 'alert.savedSuccess',
    uz: 'Ma‘lumotlar muvaffaqiyatli saqlandi.',
    ru: 'Данные успешно сохранены.',
    en: 'Data was successfully saved.'
  },
  {
    key: 'alert.orderCreated',
    uz: 'Buyurtmangiz qabul qilindi va tizimda ro‘yxatga olindi.',
    ru: 'Ваш заказ успешно сформирован и зарегистрирован.',
    en: 'Your order has been placed and registered in the system.'
  },
  {
    key: 'alert.unauthorized',
    uz: 'Tizimga kirish huquqingiz tasdiqlanmadi. Qayta kiring.',
    ru: 'Сессия истекла или недостаточно прав. Авторизуйтесь заново.',
    en: 'Session expired or unauthorized. Please log in again.'
  }
];

// Helper to escape single quotes in strings
function escapeStr(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

// Generate file content
function generateLocaleTs(lang, varName, langComment) {
  let out = `/**\n * BunkerStroy Industrial Localization Dictionary: ${langComment}\n * 100% strictly typed, complete parity across all 3 languages.\n */\n\n`;
  out += `export const ${varName}: Record<string, string> = {\n`;

  let currentPrefix = '';
  for (const entry of entries) {
    const prefix = entry.key.split('.')[0];
    if (prefix !== currentPrefix) {
      if (currentPrefix !== '') {
        out += '\n';
      }
      currentPrefix = prefix;
      out += `  // --- ${prefix.toUpperCase()} ---\n`;
    }
    const val = entry[lang];
    out += `  '${entry.key}': '${escapeStr(val)}',\n`;
  }

  out += `};\n`;
  return out;
}

// Generate index.ts
function generateIndexTs() {
  return `/**
 * BunkerStroy Core Internationalization & Localization Module
 * Exports complete dictionaries for Uzbek (uz), Russian (ru), and English (en).
 */

import { uz } from './uz.js';
import { ru } from './ru.js';
import { en } from './en.js';

export type TranslationDictionary = Record<string, string>;
export type LocaleKey = keyof typeof uz;
export type SupportedLocale = 'uz' | 'ru' | 'en';

export { uz, ru, en };

export const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  uz,
  ru,
  en
};

export const defaultLocale: SupportedLocale = 'uz';

export const supportedLocales: SupportedLocale[] = ['uz', 'ru', 'en'];

/**
 * Type-safe lookup helper
 */
export function getTranslation(locale: SupportedLocale, key: string, fallback?: string): string {
  const dict = dictionaries[locale] || dictionaries[defaultLocale];
  return dict[key] ?? fallback ?? key;
}
`;
}

// Verification function
function verifyParityAndStats() {
  const uzKeys = new Set();
  const ruKeys = new Set();
  const enKeys = new Set();

  let uzWords = 0;
  let ruWords = 0;
  let enWords = 0;

  for (const item of entries) {
    if (!item.key) throw new Error('Missing key in entry');
    if (!item.uz || item.uz.trim() === '') throw new Error(`Empty UZ for key: ${item.key}`);
    if (!item.ru || item.ru.trim() === '') throw new Error(`Empty RU for key: ${item.key}`);
    if (!item.en || item.en.trim() === '') throw new Error(`Empty EN for key: ${item.key}`);

    if (uzKeys.has(item.key)) throw new Error(`Duplicate key: ${item.key}`);
    uzKeys.add(item.key);
    ruKeys.add(item.key);
    enKeys.add(item.key);

    uzWords += item.uz.split(/\s+/).filter(Boolean).length;
    ruWords += item.ru.split(/\s+/).filter(Boolean).length;
    enWords += item.en.split(/\s+/).filter(Boolean).length;
  }

  console.log(`Parity check passed!`);
  console.log(`Total Keys: ${entries.length}`);
  console.log(`Word Count UZ: ${uzWords}`);
  console.log(`Word Count RU: ${ruWords}`);
  console.log(`Word Count EN: ${enWords}`);
  console.log(`Total Words across all languages: ${uzWords + ruWords + enWords}`);

  return {
    totalKeys: entries.length,
    uzWords,
    ruWords,
    enWords,
    totalWords: uzWords + ruWords + enWords
  };
}

// Write files
const targetDir = path.resolve('packages/i18n/src/locales');
fs.mkdirSync(targetDir, { recursive: true });

const uzContent = generateLocaleTs('uz', 'uz', 'O‘zbek tili (Lotin alifbosi)');
const ruContent = generateLocaleTs('ru', 'ru', 'Русский язык (Деловой и промышленный стиль)');
const enContent = generateLocaleTs('en', 'en', 'English (International B2B & Heavy Logistics)');
const indexContent = generateIndexTs();

fs.writeFileSync(path.join(targetDir, 'uz.ts'), uzContent, 'utf-8');
fs.writeFileSync(path.join(targetDir, 'ru.ts'), ruContent, 'utf-8');
fs.writeFileSync(path.join(targetDir, 'en.ts'), enContent, 'utf-8');
fs.writeFileSync(path.join(targetDir, 'index.ts'), indexContent, 'utf-8');

const stats = verifyParityAndStats();
fs.writeFileSync(path.join(targetDir, 'stats.json'), JSON.stringify(stats, null, 2), 'utf-8');
console.log('Successfully generated all locale files in ' + targetDir);
