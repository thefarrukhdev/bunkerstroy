import React, { useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  Phone,
  MapPin,
  Package,
  Plus,
  Eye,
  X,
  FileCheck,
  ShieldCheck,
  MoreVertical,
  ExternalLink,
  Ban
} from 'lucide-react';
import { Card, Badge, Button } from '@bunkerstroy/ui';

export interface SupplierItem {
  id: string;
  inn: string;
  companyName: string;
  director: string;
  phone: string;
  region: string;
  productsCount: number;
  totalSalesSum: number;
  rating: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  address: string;
  vatPayer: boolean;
  registrationDate: string;
}

const initialSuppliers: SupplierItem[] = [
  {
    id: 'sup-1',
    inn: '201122334',
    companyName: '«TOSHKENT G\'ISHT VA SEMENT SERVIS» MChJ',
    director: 'Qodirov Alisher',
    phone: '+998 97 111-22-33',
    region: 'Toshkent viloyati',
    productsCount: 14,
    totalSalesSum: 480000000,
    rating: 4.9,
    status: 'ACTIVE',
    address: 'Zangiota tumani, Quruvchilar ko\'chasi 45-uy',
    vatPayer: true,
    registrationDate: '2019-04-12'
  },
  {
    id: 'sup-2',
    inn: '305443211',
    companyName: '«SAMARQAND CEMENT INDUSTRY» QK MChJ',
    director: 'Saidov Bahrom',
    phone: '+998 93 444-55-66',
    region: 'Samarqand viloyati',
    productsCount: 9,
    totalSalesSum: 310000000,
    rating: 4.8,
    status: 'ACTIVE',
    address: 'Pastdarg\'om tumani, Sanoat zonasi 12-bino',
    vatPayer: true,
    registrationDate: '2020-08-25'
  },
  {
    id: 'sup-3',
    inn: '200889912',
    companyName: '«BEKOBOD METALL INVEST» AJ Dileri',
    director: 'Rustamov Sardor',
    phone: '+998 90 987-65-43',
    region: 'Toshkent shahri',
    productsCount: 22,
    totalSalesSum: 520000000,
    rating: 5.0,
    status: 'ACTIVE',
    address: 'Sergeli tumani, Yangi Sergeli ko\'chasi 88',
    vatPayer: true,
    registrationDate: '2018-02-14'
  },
  {
    id: 'sup-4',
    inn: '309998877',
    companyName: '«ECO-PENOPLAST ENERGO» MChJ (ESCO)',
    director: 'Karimova Nargiza',
    phone: '+998 99 822-33-44',
    region: 'Farg\'ona viloyati',
    productsCount: 6,
    totalSalesSum: 125000000,
    rating: 4.7,
    status: 'ACTIVE',
    address: 'Qo\'qon sh., Temiryo\'lchilar 14',
    vatPayer: false,
    registrationDate: '2022-11-05'
  },
  {
    id: 'sup-5',
    inn: '207654321',
    companyName: '«QUVASOY SHIFER & BLOK» MChJ',
    director: 'Toshmatov Jamshid',
    phone: '+998 91 333-22-11',
    region: 'Farg\'ona viloyati',
    productsCount: 8,
    totalSalesSum: 50000000,
    rating: 4.2,
    status: 'SUSPENDED',
    address: 'Quvasoy sh., Kimyogarlar dahasi',
    vatPayer: true,
    registrationDate: '2021-03-30'
  }
];

export const SuppliersTable: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(initialSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New supplier form state
  const [newInn, setNewInn] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDirector, setNewDirector] = useState('');
  const [newPhone, setNewPhone] = useState('+998 ');
  const [newRegion, setNewRegion] = useState('Toshkent viloyati');

  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.inn.includes(searchQuery) ||
      s.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id: string) => {
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInn || !newCompanyName) return;

    const newSup: SupplierItem = {
      id: `sup-${Date.now()}`,
      inn: newInn,
      companyName: newCompanyName,
      director: newDirector || 'Kiritilmagan',
      phone: newPhone,
      region: newRegion,
      productsCount: 0,
      totalSalesSum: 0,
      rating: 5.0,
      status: 'ACTIVE',
      address: 'O\'zbekiston',
      vatPayer: true,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    setSuppliers([newSup, ...suppliers]);
    setIsAddModalOpen(false);
    setNewInn('');
    setNewCompanyName('');
    setNewDirector('');
    setNewPhone('+998 ');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 brushed-steel p-4 rounded-2xl border border-[#33373B]">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#FFB800]" />
            <h1 className="text-xl font-black uppercase tracking-wider text-[#F5F5F2]">
              Hamkor Ta'minotchilar Boshqaruvi
            </h1>
          </div>
          <p className="text-xs text-[#B8B8B3] font-mono mt-0.5">
            B2B Ishlab chiqaruvchilar, dilerlar va yuridik shaxslar reyestri
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 shadow-md"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Yangi Ta'minotchi
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-[#8E9094] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kompaniya, STIR, rahbar yoki viloyat..."
            className="w-full bg-[#1A1D20] border border-[#33373B] rounded-xl pl-10 pr-4 py-2 text-sm text-[#F5F5F2] placeholder-[#8E9094] focus:outline-none focus:border-[#FFB800]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(
            [
              { id: 'ALL', label: 'Barchasi' },
              { id: 'ACTIVE', label: 'Faol' },
              { id: 'SUSPENDED', label: 'To\'xtatilgan' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setStatusFilter(t.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                statusFilter === t.id
                  ? 'bg-[#FFB800] text-[#151719] border-[#FFB800]'
                  : 'bg-[#1A1D20] text-[#B8B8B3] border-[#33373B] hover:text-[#F5F5F2]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Table */}
      <Card className="p-0 overflow-hidden border-[#33373B] bg-[#1A1D20]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#33373B] bg-[#151719] text-[11px] font-mono uppercase tracking-wider text-[#B8B8B3]">
                <th className="py-3 px-4">Kompaniya & STIR</th>
                <th className="py-3 px-4">Rahbar / Telefon</th>
                <th className="py-3 px-4">Viloyat</th>
                <th className="py-3 px-4 text-center">Tovarlar</th>
                <th className="py-3 px-4 text-right">Aylanma (UZS)</th>
                <th className="py-3 px-4 text-center">Reyting</th>
                <th className="py-3 px-4 text-center">Holat</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33373B]/60 text-sm">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#8E9094] font-mono text-xs">
                    Hech qanday ta'minotchi topilmadi
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-[#222528]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F5F5F2] hover:text-[#FFB800] transition-colors">
                        {s.companyName}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-mono text-[#8E9094]">STIR:</span>
                        <span className="text-[11px] font-mono font-bold text-[#FFB800] bg-[#FFB800]/10 px-1.5 py-0.2 rounded">
                          {s.inn}
                        </span>
                        {s.vatPayer && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">
                            QQS 12%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-[#F5F5F2]">{s.director}</div>
                      <div className="text-xs text-[#8E9094] font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        {s.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-[#B8B8B3]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8E9094]" />
                        {s.region}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#F5F5F2] bg-[#292C2F] px-2.5 py-1 rounded-lg border border-[#33373B]">
                        <Package className="w-3 h-3 text-[#FFB800]" />
                        {s.productsCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-xs">
                      {s.totalSalesSum.toLocaleString('uz-UZ')} UZS
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#FFB800]">
                        <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                        {s.rating.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'danger'}>
                        {s.status === 'ACTIVE' ? 'Faol' : 'To\'xtatilgan'}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedSupplier(s)}
                          title="Batafsil ko'rish"
                          className="p-1.5 rounded-lg bg-[#292C2F] hover:bg-[#33373B] text-[#B8B8B3] hover:text-[#F5F5F2] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(s.id)}
                          title={s.status === 'ACTIVE' ? 'To\'xtatish' : 'Faollashtirish'}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            s.status === 'ACTIVE'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {s.status === 'ACTIVE' ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Supplier Details Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#1A1D20] border border-[#33373B] rounded-2xl max-w-lg w-full p-6 text-[#F5F5F2] shadow-2xl relative">
            <button
              onClick={() => setSelectedSupplier(null)}
              className="absolute top-4 right-4 text-[#8E9094] hover:text-[#F5F5F2] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {selectedSupplier.companyName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={selectedSupplier.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {selectedSupplier.status === 'ACTIVE' ? 'Faol Hamkor' : 'To\'xtatilgan'}
                  </Badge>
                  <span className="text-xs font-mono text-[#8E9094]">
                    Ro'yxatdan o'tgan: {selectedSupplier.registrationDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 py-3 border-y border-[#33373B] text-xs">
              <div className="flex justify-between py-1 border-b border-[#33373B]/40">
                <span className="text-[#8E9094] font-mono">Yuridik STIR:</span>
                <span className="font-mono font-bold text-[#FFB800]">{selectedSupplier.inn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#33373B]/40">
                <span className="text-[#8E9094] font-mono">Bosh Direktor:</span>
                <span className="font-semibold text-[#F5F5F2]">{selectedSupplier.director}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#33373B]/40">
                <span className="text-[#8E9094] font-mono">Aloqa Telefoni:</span>
                <span className="font-mono text-[#F5F5F2]">{selectedSupplier.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#33373B]/40">
                <span className="text-[#8E9094] font-mono">Yuridik Manzil:</span>
                <span className="text-[#F5F5F2] text-right max-w-[260px] truncate">
                  {selectedSupplier.address}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#33373B]/40">
                <span className="text-[#8E9094] font-mono">QQS To'lovchisi:</span>
                <span className="text-emerald-400 font-bold">
                  {selectedSupplier.vatPayer ? "Ha (12% QQS guvohnomasi mavjud)" : "Yo'q"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8E9094] font-mono">Katalogdagi Mahsulotlar:</span>
                <span className="font-mono font-bold text-[#F5F5F2]">
                  {selectedSupplier.productsCount} ta tovar pozitsiyasi
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Soliq &amp; E-IMZO tekshiruvidan o'tgan</span>
              </div>

              <Button
                variant={selectedSupplier.status === 'ACTIVE' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => {
                  toggleStatus(selectedSupplier.id);
                  setSelectedSupplier((prev) =>
                    prev
                      ? {
                          ...prev,
                          status: prev.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                        }
                      : null
                  );
                }}
              >
                {selectedSupplier.status === 'ACTIVE' ? "Hamkorlikni To'xtatish" : "Qayta Faollashtirish"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#1A1D20] border border-[#33373B] rounded-2xl max-w-md w-full p-6 text-[#F5F5F2] shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E9094] hover:text-[#F5F5F2] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#FFB800]" />
              Yangi Ta'minotchi Qo'shish
            </h3>
            <p className="text-xs text-[#8E9094] font-mono mb-4">
              Soliq bazasidan STIR bo'yicha integratsiyalangan avtomatik qidiruv
            </p>

            <form onSubmit={handleAddSupplier} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                  Yuridik STIR (9 ta raqam) *
                </label>
                <input
                  type="text"
                  maxLength={9}
                  required
                  value={newInn}
                  onChange={(e) => setNewInn(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masalan: 305123456"
                  className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#FFB800] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                  MChJ / Tashkilot Nomi *
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="«ALMAZ SEMENT SAVDO» MChJ"
                  className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                  Rahbar (F.I.SH)
                </label>
                <input
                  type="text"
                  value={newDirector}
                  onChange={(e) => setNewDirector(e.target.value)}
                  placeholder="Karimov Otabek"
                  className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#FFB800]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#FFB800] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#B8B8B3] mb-1">
                    Viloyat
                  </label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full bg-[#151719] border border-[#33373B] rounded-xl px-3.5 py-2 text-sm text-[#F5F5F2] focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="Toshkent viloyati">Toshkent viloyati</option>
                    <option value="Toshkent shahri">Toshkent shahri</option>
                    <option value="Samarqand viloyati">Samarqand viloyati</option>
                    <option value="Farg'ona viloyati">Farg'ona viloyati</option>
                    <option value="Navoiy viloyati">Navoiy viloyati</option>
                    <option value="Buxoro viloyati">Buxoro viloyati</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-1/2"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="primary" className="w-1/2">
                  Qo'shish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
