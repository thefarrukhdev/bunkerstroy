export interface UzbekistanRegion {
  key: string;
  match: string[];
  color: string;
  hex: string;
}

export const UZBEKISTAN_REGIONS: UzbekistanRegion[] = [
  { key: 'Toshkent shahri', match: ['toshkent sh', 'tashkent city', 'toshkent shahri'], color: 'bg-[#D95D1E]', hex: '#D95D1E' },
  { key: 'Toshkent viloyati', match: ['toshkent vil', 'chirchiq', 'olmaliq', 'angren', 'bekobod', 'qibray', 'zangiota'], color: 'bg-blue-500', hex: '#3B82F6' },
  { key: 'Samarqand viloyati', match: ['samarqand', 'urgut', 'kattaqo'], color: 'bg-emerald-500', hex: '#10B981' },
  { key: 'Farg‘ona viloyati', match: ['farg', 'qo‘qon', 'qoqon', 'marg‘ilon', 'margilon'], color: 'bg-amber-400', hex: '#FBBF24' },
  { key: 'Andijon viloyati', match: ['andijon', 'asaka', 'shahrixon'], color: 'bg-purple-500', hex: '#A855F7' },
  { key: 'Namangan viloyati', match: ['namangan', 'chust', 'pop'], color: 'bg-cyan-400', hex: '#22D3EE' },
  { key: 'Buxoro viloyati', match: ['buxoro', 'g‘ijduvon', 'kogon'], color: 'bg-rose-500', hex: '#F43F5E' },
  { key: 'Qashqadaryo viloyati', match: ['qashqadaryo', 'qarshi', 'shahrisabz'], color: 'bg-indigo-400', hex: '#818CF8' },
  { key: 'Surxondaryo viloyati', match: ['surxondaryo', 'termiz', 'denov'], color: 'bg-teal-400', hex: '#2DD4BF' },
  { key: 'Navoiy viloyati', match: ['navoiy', 'zarafshon', 'karmana'], color: 'bg-orange-400', hex: '#FB923C' },
  { key: 'Jizzax viloyati', match: ['jizzax', 'zomin'], color: 'bg-lime-400', hex: '#A3E635' },
  { key: 'Sirdaryo viloyati', match: ['sirdaryo', 'guliston', 'yangiyer'], color: 'bg-pink-400', hex: '#F472B6' },
  { key: 'Xorazm viloyati', match: ['xorazm', 'urganch', 'xiva'], color: 'bg-sky-400', hex: '#38BDF8' },
  { key: 'Qoraqalpog‘iston Resp.', match: ['qoraqalpog', 'nukus', 'qo‘ng‘irot', 'beruniy'], color: 'bg-violet-400', hex: '#A78BFA' },
];

export interface ColorOption {
  id: string;
  label: string;
  bg: string;
  border: string;
  text: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  { id: 'oq', label: 'Oq', bg: '#FFFFFF', border: '#cbd5e1', text: '#0f172a' },
  { id: 'kulrang', label: 'Kulrang', bg: '#64748b', border: '#475569', text: '#ffffff' },
  { id: 'qora', label: 'Qora', bg: '#0f172a', border: '#334155', text: '#ffffff' },
  { id: 'qizil', label: 'Qizil / Terracotta', bg: '#dc2626', border: '#b91c1c', text: '#ffffff' },
  { id: 'jigarrang', label: 'Jigarrang', bg: '#78350f', border: '#451a03', text: '#ffffff' },
  { id: 'kok', label: 'Ko‘k', bg: '#2563eb', border: '#1d4ed8', text: '#ffffff' },
  { id: 'yashil', label: 'Yashil', bg: '#16a34a', border: '#15803d', text: '#ffffff' },
  { id: 'sariq', label: 'Sariq', bg: '#eab308', border: '#ca8a04', text: '#000000' },
];

export interface B2BWholesaleOrderRequest {
  id: string;
  buyerSupplierId: string;
  buyerCompanyName: string;
  buyerInn: string;
  buyerDirector: string;
  buyerPhone: string;
  buyerRegion: string;
  buyerAddress?: string;
  manufacturerId?: string;
  manufacturerInn?: string;
  manufacturerCompanyName: string;
  manufacturerPhone?: string;
  manufacturerRegion?: string;
  items: {
    productId: string;
    title: string;
    category: string;
    unit: string;
    quantity: number;
    price: number;
    totalSum: number;
    color?: string;
  }[];
  totalAmount: number;
  status: 'requested' | 'approved_awaiting_payment' | 'paid' | 'preparing' | 'in_transit' | 'delivered';
  bankAccountDetails?: string;
  createdAt: string;
}

// O'zbekiston viloyatlari va ularning shahar / tumanlari ro'yxati
export const REGIONS_AND_DISTRICTS: Record<string, string[]> = {
  'Toshkent shahri': [
    'Yunusobod tumani',
    'Chilonzor tumani',
    'Mirzo Ulug‘bek tumani',
    'Yashnobod tumani',
    'Shayxontohur tumani',
    'Mirobod tumani',
    'Yakkasaroy tumani',
    'Olmazor tumani',
    'Uchtepa tumani',
    'Sergeli tumani',
    'Bektemir tumani',
    'Yangihayot tumani',
  ],
  'Toshkent viloyati': [
    'Chirchiq shahri',
    'Angren shahri',
    'Olmaliq shahri',
    'Bekobod shahri',
    'Nurafshon shahri',
    'Yangiyo‘l tumani',
    'Qibray tumani',
    'Zangiota tumani',
    'Toshkent tumani',
    'Bo‘stonliq tumani',
    'Parkent tumani',
    'O‘rtachirchiq tumani',
    'Quyichirchiq tumani',
    'Yuqorichirchiq tumani',
  ],
  'Samarqand': [
    'Samarqand shahri',
    'Kattaqo‘rg‘on shahri',
    'Samarqand tumani',
    'Pastdarg‘om tumani',
    'Urgut tumani',
    'Toyloq tumani',
    'Bulung‘ur tumani',
    'Jomboy tumani',
    'Oqdaryo tumani',
    'Ishtixon tumani',
    'Payariq tumani',
    'Narpay tumani',
  ],
  'Buxoro': [
    'Buxoro shahri',
    'Kogon shahri',
    'Buxoro tumani',
    'G‘ijduvon tumani',
    'Vobkent tumani',
    'Shofirkon tumani',
    'Romitan tumani',
    'Jondor tumani',
    'Qorako‘l tumani',
    'Olot tumani',
  ],
  'Andijon': [
    'Andijon shahri',
    'Xonobod shahri',
    'Andijon tumani',
    'Asaka tumani',
    'Shahrixon tumani',
    'Oltinko‘l tumani',
    'Baliqchi tumani',
    'Bo‘ston tumani',
    'Izboskan tumani',
    'Xo‘jaobod tumani',
    'Qo‘rg‘ontepa tumani',
  ],
  'Farg‘ona': [
    'Farg‘ona shahri',
    'Marg‘ilon shahri',
    'Qo‘qon shahri',
    'Quvasoy shahri',
    'Oltiariq tumani',
    'Rishton tumani',
    'Bog‘dod tumani',
    'Beshariq tumani',
    'Uchko‘prik tumani',
    'Quva tumani',
    'Toshloq tumani',
  ],
  'Namangan': [
    'Namangan shahri',
    'Chust tumani',
    'Pop tumani',
    'Kosonsoy tumani',
    'To‘raqo‘rg‘on tumani',
    'Uychi tumani',
    'Yangiqo‘rg‘on tumani',
    'Chortoq tumani',
    'Norin tumani',
    'Mingbuloq tumani',
  ],
  'Qashqadaryo': [
    'Qarshi shahri',
    'Shahrisabz shahri',
    'Qarshi tumani',
    'Koson tumani',
    'Kitob tumani',
    'Yakkabog‘ tumani',
    'Chiroqchi tumani',
    'G‘uzor tumani',
    'Nishon tumani',
    'Muborak tumani',
    'Kasbi tumani',
  ],
  'Surxondaryo': [
    'Termiz shahri',
    'Denov tumani',
    'Sherobod tumani',
    'Boysun tumani',
    'Jarqo‘rg‘on tumani',
    'Qumqo‘rg‘on tumani',
    'Sho‘rchi tumani',
    'Sariosiyo tumani',
    'Muzrabot tumani',
    'Angor tumani',
  ],
  'Navoiy': [
    'Navoiy shahri',
    'Zarafshon shahri',
    'Karmana tumani',
    'Qiziltepa tumani',
    'Xatirchi tumani',
    'Navbahor tumani',
    'Nurota tumani',
    'Tomdi tumani',
    'Konimex tumani',
  ],
  'Jizzax': [
    'Jizzax shahri',
    'Sharof Rashidov tumani',
    'Zomin tumani',
    'G‘allaorol tumani',
    'Do‘stlik tumani',
    'Paxtakor tumani',
    'Mirzacho‘l tumani',
    'Zafarobod tumani',
    'Baxmal tumani',
  ],
  'Sirdaryo': [
    'Guliston shahri',
    'Shirin shahri',
    'Yangiyer shahri',
    'Guliston tumani',
    'Boyovut tumani',
    'Sayxunobod tumani',
    'Sirdaryo tumani',
    'Oqoltin tumani',
    'Sardoba tumani',
  ],
  'Xorazm': [
    'Urganch shahri',
    'Xiva shahri',
    'Urganch tumani',
    'Xonqa tumani',
    'Gurlan tumani',
    'Shovot tumani',
    'Qo‘shko‘pir tumani',
    'Bog‘ot tumani',
    'Hazorasp tumani',
    'Yangiariq tumani',
  ],
  'Qoraqalpog‘iston Res.': [
    'Nukus shahri',
    'Xo‘jayli tumani',
    'Chimboy tumani',
    'Qo‘ng‘irot tumani',
    'Beruniy tumani',
    'To‘rtko‘l tumani',
    'Amudaryo tumani',
    'Mo‘ynoq tumani',
    'Taxiatosh shahri',
    'Ellikqala tumani',
    'Taxtako‘pir tumani',
  ],
};

// Tuman va shaharlar bo'yicha MFY ro'yxati
export const DISTRICT_MFY_MAP: Record<string, string[]> = {
  'Yunusobod tumani': [
    'Bodomzor MFY',
    'Minor MFY',
    'Qashqar MFY',
    'Astrobod MFY',
    'Turkiston MFY',
    'Yunusobod MFY',
    'Shahriston MFY',
    'Chinobod MFY',
    'Oqtepa MFY',
    'Sobir Rahimov MFY',
  ],
  'Chilonzor tumani': [
    'Qatortol MFY',
    'Novza MFY',
    'Chilonzor MFY',
    'Lutfiy MFY',
    'Oqtepa MFY',
    'Mehrjon MFY',
    'Beshog‘och MFY',
    'Xalqlar Do‘stligi MFY',
    'Cho‘ponota MFY',
    'Al-Xorazmiy MFY',
  ],
  'Mirzo Ulug‘bek tumani': [
    'Buyuk Ipak Yo‘li MFY',
    'Darxon MFY',
    'Salor MFY',
    'Oqqo‘rg‘on MFY',
    'Feruza MFY',
    'Qorasuv MFY',
    'Yalang‘och MFY',
    'TTZ-1 MFY',
    'Ahmad Yugnakiy MFY',
    'Alpomish MFY',
  ],
  'Yashnobod tumani': [
    'Aviasozlar MFY',
    'Tuzel MFY',
    'Qo‘yliq MFY',
    'Do‘stlik MFY',
    'Ohangaron MFY',
    'Birlashgan MFY',
    'Ma’rifat MFY',
    'Cho‘lpon MFY',
    'Yashnobod MFY',
    'Parvoz MFY',
  ],
  'Shayxontohur tumani': [
    'Chorsu MFY',
    'Labzak MFY',
    'Samarqand Darvoza MFY',
    'Beltepa MFY',
    'Ko‘kcha MFY',
    'Gulobod MFY',
    'Ibn Sino MFY',
    'Obinazir MFY',
    'Xadra MFY',
    'Zafarobod MFY',
  ],
  'Mirobod tumani': [
    'Oybek MFY',
    'Mirobod MFY',
    'Qo‘yliq Ota MFY',
    'Salar MFY',
    'Tong Yulduzi MFY',
    'Farovon MFY',
  ],
};

export function getMfyListForDistrict(district: string): string[] {
  if (!district) return [];
  if (DISTRICT_MFY_MAP[district]) {
    return DISTRICT_MFY_MAP[district];
  }
  const cleanName = district.replace(/\s+(tumani|shahri)$/i, '').trim();
  return [
    `${cleanName} Markaziy MFY`,
    'Yangi Hayot MFY',
    'Navbahor MFY',
    'Do‘stlik MFY',
    'Mustaqillik MFY',
    'Istiqlol MFY',
    'Yoshlik MFY',
    'Tinchlik MFY',
    'Guliston MFY',
    'Obod MFY',
    'Bunyodkor MFY',
    'Navro‘z MFY',
  ];
}

export const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Toshkent shahri': { lat: 41.311081, lng: 69.240562 },
  'Toshkent viloyati': { lat: 41.0245, lng: 69.3496 },
  'Samarqand': { lat: 39.654167, lng: 66.959722 },
  'Buxoro': { lat: 39.774722, lng: 64.428611 },
  'Andijon': { lat: 40.782069, lng: 72.34424 },
  'Farg‘ona': { lat: 40.38421, lng: 71.78432 },
  'Namangan': { lat: 40.9983, lng: 71.67257 },
  'Qashqadaryo': { lat: 38.86056, lng: 65.78905 },
  'Surxondaryo': { lat: 37.22417, lng: 67.27833 },
  'Navoiy': { lat: 40.08444, lng: 65.37917 },
  'Jizzax': { lat: 40.11583, lng: 67.84222 },
  'Sirdaryo': { lat: 40.48972, lng: 68.78417 },
  'Xorazm': { lat: 41.55, lng: 60.63333 },
  'Qoraqalpog‘iston Res.': { lat: 42.45306, lng: 59.61028 },
};

