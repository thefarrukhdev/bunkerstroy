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
