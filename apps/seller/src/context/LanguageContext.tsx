import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Language = 'uz' | 'ru';

export type TranslationDictionary = Record<string, string>;

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  uz: {
    // Brand & Header
    'brand.sub': 'Sanoat Xaridlari',
    'nav.catalog': 'Katalog',
    'nav.catalog.desc': 'Barcha qurilish mollari va materiallar',
    'nav.suppliers': 'Do‘konlar & Zavodlar',
    'nav.suppliers.desc': 'Tasdiqlangan ishlab chiqaruvchilar',
    'nav.orders': 'Buyurtmalarim',
    'nav.orders.desc': 'Xaridlar va yetkazib berish holati',
    'nav.seller_cabinet': 'Sotuvchi Kabineti',
    'nav.seller_cabinet.desc': 'Sotuvchi va ishlab chiqaruvchi kabineti',
    'nav.sell_product': '+ Mahsulot sotish',
    'nav.sell_product.desc': 'Sotuvchi va ishlab chiqaruvchi kabineti',
    'nav.logistics': 'Logistika',
    'nav.logistics.desc': 'Og‘ir yuk tashish va maxsus texnikalar',
    'nav.driver': 'Haydovchi',
    'nav.driver.desc': 'Haydovchi mobil kabineti va reyslar',
    'nav.cart': 'Savat',
    'nav.login': 'B2B Kirish',
    'nav.logout': 'Chiqish',
    'nav.sections': 'Platforma Bo‘limlari',
    'nav.support': '24/7 B2B Qo‘llab-quvvatlash',

    // Direct Navbar strings
    'Katalog': 'Katalog',
    'Do‘konlar': 'Do‘konlar',
    'Do‘konlar & Zavodlar': 'Do‘konlar & Zavodlar',
    'Buyurtmalarim': 'Buyurtmalarim',
    'Sotuvchi Kabineti': 'Sotuvchi Kabineti',
    'Logistika': 'Logistika',
    'Haydovchi': 'Haydovchi',

    // Order Statuses
    'order.status.DRAFT': 'Qoralama',
    'order.status.PENDING_PAYMENT': 'To‘lov kutilmoqda',
    'order.status.PAID': 'To‘landi (Escrow)',
    'order.status.ACCEPTED': 'Qabul qilindi',
    'order.status.PACKING': 'Omborda Yig‘ildi (Packing)',
    'order.status.ASSIGNED': 'Haydovchi biriktirildi',
    'order.status.IN_TRANSIT': 'Yo‘lda (Yetkazilmoqda)',
    'order.status.ARRIVED': 'Manzilga yetib keldi',
    'order.status.FULLY_PAID': 'To‘liq to‘landi',
    'order.status.RECEIVED': 'Qabul qilindi',
    'order.status.COMPLETED': 'Yetkazildi & Yakunlandi',
    'order.status.CANCELLED': 'Bekor qilindi',
    'order.status.DISPUTE': 'E‘tiroz (Nizo)',
    'order.status.RETURN_REQUESTED': 'Qaytarish so‘raldi',
    'order.status.RETURNED': 'Qaytarildi',
    'order.status.PENDING': 'Kutilmoqda',
    'order.status.CONFIRMED': 'Tasdiqlandi',
    'order.status.ASSIGNED_TO_FLEET': 'Texnikaga biriktirildi',
    'order.status.DELIVERED': 'Yetkazildi',

    // Escrow & Payment Labels
    '100% Oldindan to‘lov': '100% Oldindan to‘lov',
    '50/50 Bo‘lib to‘lash': '50/50 Bo‘lib to‘lash',
    'Qabul kodi': 'Qabul kodi',
    'payment.mode.FULL_100': '100% Oldindan to‘lov',
    'payment.mode.SPLIT_50_50': '50/50 Bo‘lib to‘lash',
    'payment.acceptance_code': 'Qabul kodi',
    'payment.escrow_badge': 'Escrow Xavfsiz To‘lov',
    'payment.escrow_guarantee': 'Mablag‘lar tovar qabul qilinmaguncha xavfsiz escrow hisobida saqlanadi.',

    // Escrow & Finance KPIs
    'Escrowda Bloklangan': 'Escrowda Bloklangan',
    'Ajratilgan / Yechib Olishga Tayyor': 'Ajratilgan / Yechib Olishga Tayyor',
    'Platforma Komissiyasi (1.5%)': 'Platforma Komissiyasi (1.5%)',
    'Jami Savdo Aylanmasi': 'Jami Savdo Aylanmasi',
    'escrow.locked': 'Escrowda Bloklangan',
    'escrow.locked.desc': 'Xaridor qabul kodini tasdiqlashi bilan hisobingizga o‘tadi',
    'escrow.available': 'Ajratilgan / Yechib Olishga Tayyor',
    'escrow.available.desc': 'Bank hisob raqamiga (UZCARD/HUMO/Hisob-kitob) yechib olish mumkin',
    'escrow.commission': 'Platforma Komissiyasi (1.5%)',
    'escrow.commission.desc': 'Barcha xavfsiz bitimlar va escrow kafolati uchun',
    'escrow.turnover': 'Jami Savdo Aylanmasi',
    'escrow.turnover.desc': 'Sotuvchi orqali o‘tgan umumiy tovar aylanmasi',
    'escrow.payout_request': 'Hisob raqamga yechish',

    // Common Buttons
    'Savatga': 'Savatga',
    'Buyurtma berish': 'Buyurtma berish',
    'Yangilash': 'Yangilash',
    'button.addToCart': 'Savatga',
    'button.checkout': 'Buyurtma berish',
    'button.refresh': 'Yangilash',
    'button.save': 'Saqlash',
    'button.cancel': 'Bekor qilish',
    'button.confirm': 'Tasdiqlash',
    'button.accept': 'Buyurtmani Qabul Qilish',
    'button.packing': 'Omborda Yig‘ildi (Packing)',
    'button.reject': 'Bekor qilish / Rad etish',
    'button.edit': 'Tahrirlash',
    'button.delete': 'O‘chirish',
    'button.addTier': '+ Zinapoya qo‘shish',
    'button.back': 'Orqaga',
    'button.viewCatalog': 'Vitrinda ko‘rish',

    // Common Fields
    'common.price': 'Narxi',
    'common.quantity': 'Miqdor',
    'common.stock': 'Ombordagi zaxira soni',
    'common.unit': 'O‘lchov birligi',
    'common.total': 'Jami to‘lov',
    'common.certificate': 'O‘zDSt / GOST Sertifikati raqami va havola',
  },
  ru: {
    // Brand & Header
    'brand.sub': 'Промышленные закупки',
    'nav.catalog': 'Каталог',
    'nav.catalog.desc': 'Все стройматериалы и промышленное сырье',
    'nav.suppliers': 'Поставщики & Заводы',
    'nav.suppliers.desc': 'Проверенные заводы и производители',
    'nav.orders': 'Мои заказы',
    'nav.orders.desc': 'История покупок и отслеживание доставки',
    'nav.seller_cabinet': 'Кабинет продавца',
    'nav.seller_cabinet.desc': 'Центр управления поставщика и завода',
    'nav.sell_product': '+ Продать товар',
    'nav.sell_product.desc': 'Кабинет продавца и производителя',
    'nav.logistics': 'Логистика',
    'nav.logistics.desc': 'Тяжелые грузоперевозки и спецтехника',
    'nav.driver': 'Водитель',
    'nav.driver.desc': 'Мобильный кабинет водителя и рейсы',
    'nav.cart': 'Корзина',
    'nav.login': 'B2B Вход',
    'nav.logout': 'Выход',
    'nav.sections': 'Разделы Платформы',
    'nav.support': '24/7 B2B Поддержка',

    // Direct Navbar strings
    'Katalog': 'Каталог',
    'Do‘konlar': 'Поставщики',
    'Do‘konlar & Zavodlar': 'Поставщики & Заводы',
    'Buyurtmalarim': 'Мои заказы',
    'Sotuvchi Kabineti': 'Кабинет продавца',
    'Logistika': 'Логистика',
    'Haydovchi': 'Водитель',

    // Order Statuses
    'order.status.DRAFT': 'Черновик',
    'order.status.PENDING_PAYMENT': 'Ожидает оплаты',
    'order.status.PAID': 'Оплачено (Эскроу)',
    'order.status.ACCEPTED': 'Принят продавцом',
    'order.status.PACKING': 'Скомплектовано на складе (Packing)',
    'order.status.ASSIGNED': 'Водитель назначен',
    'order.status.IN_TRANSIT': 'В пути (Доставка)',
    'order.status.ARRIVED': 'Прибыл на объект',
    'order.status.FULLY_PAID': 'Полностью оплачен',
    'order.status.RECEIVED': 'Принят заказчиком',
    'order.status.COMPLETED': 'Доставлен & Завершен',
    'order.status.CANCELLED': 'Отменен',
    'order.status.DISPUTE': 'Спор (Претензия)',
    'order.status.RETURN_REQUESTED': 'Запрос возврата',
    'order.status.RETURNED': 'Возвращен',
    'order.status.PENDING': 'В ожидании',
    'order.status.CONFIRMED': 'Подтвержден',
    'order.status.ASSIGNED_TO_FLEET': 'Назначен на спецтехнику',
    'order.status.DELIVERED': 'Доставлен',

    // Escrow & Payment Labels
    '100% Oldindan to‘lov': '100% Предоплата',
    '50/50 Bo‘lib to‘lash': 'Оплата 50/50',
    'Qabul kodi': 'Код подтверждения',
    'payment.mode.FULL_100': '100% Предоплата',
    'payment.mode.SPLIT_50_50': 'Оплата 50/50',
    'payment.acceptance_code': 'Код подтверждения',
    'payment.escrow_badge': 'Безопасная сделка Эскроу',
    'payment.escrow_guarantee': 'Средства заблокированы на счете эскроу до подтверждения приемки.',

    // Escrow & Finance KPIs
    'Escrowda Bloklangan': 'Заблокировано в Эскроу',
    'Ajratilgan / Yechib Olishga Tayyor': 'Выделено / Готово к выводу',
    'Platforma Komissiyasi (1.5%)': 'Комиссия платформы (1.5%)',
    'Jami Savdo Aylanmasi': 'Общий оборот продаж',
    'escrow.locked': 'Заблокировано в Эскроу',
    'escrow.locked.desc': 'Поступит на ваш счет сразу после подтверждения кода приемки покупателем',
    'escrow.available': 'Выделено / Готово к выводу',
    'escrow.available.desc': 'Доступно для вывода на расчетный счет или корпоративную карту',
    'escrow.commission': 'Комиссия платформы (1.5%)',
    'escrow.commission.desc': 'Комиссия за безопасность расчетов и гарантию Эскроу',
    'escrow.turnover': 'Общий оборот продаж',
    'escrow.turnover.desc': 'Суммарный объем продаж через платформу BunkerStroy',
    'escrow.payout_request': 'Вывести на расчетный счет',

    // Common Buttons
    'Savatga': 'В корзину',
    'Buyurtma berish': 'Оформить заказ',
    'Yangilash': 'Обновить',
    'button.addToCart': 'В корзину',
    'button.checkout': 'Оформить заказ',
    'button.refresh': 'Обновить',
    'button.save': 'Сохранить',
    'button.cancel': 'Отмена',
    'button.confirm': 'Подтвердить',
    'button.accept': 'Принять заказ',
    'button.packing': 'Скомплектовано на складе (Packing)',
    'button.reject': 'Отменить / Отклонить заказ',
    'button.edit': 'Редактировать',
    'button.delete': 'Удалить',
    'button.addTier': '+ Добавить ступень',
    'button.back': 'Назад',
    'button.viewCatalog': 'Смотреть на витрине',

    // Common Fields
    'common.price': 'Цена',
    'common.quantity': 'Количество',
    'common.stock': 'Остаток на складе',
    'common.unit': 'Единица измерения',
    'common.total': 'Итоговая сумма',
    'common.certificate': 'Номер и ссылка на сертификат O‘zDSt / ГОСТ',
  }
};

export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  getOrderStatusText: (status: string) => string;
}

const STORAGE_KEY = 'bunkerstroy_lang';

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'uz' || saved === 'ru') {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'uz';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'uz' ? 'ru' : 'uz');
  }, [language, setLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const currentDict = TRANSLATIONS[language];
      if (currentDict && key in currentDict) {
        return currentDict[key];
      }
      // Check uz dictionary as primary fallback
      if (language !== 'uz' && TRANSLATIONS.uz && key in TRANSLATIONS.uz) {
        return TRANSLATIONS.uz[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  const getOrderStatusText = useCallback(
    (status: string): string => {
      const statusKey = `order.status.${status}`;
      return t(statusKey, status);
    },
    [t]
  );

  const contextValue: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    getOrderStatusText,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
