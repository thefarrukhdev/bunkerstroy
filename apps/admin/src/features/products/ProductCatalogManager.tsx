import React, { useState, useEffect } from 'react';
import {
  ProductItem,
  INITIAL_PRODUCTS,
  CATEGORIES,
  ProductUnit
} from '../../mocks/productsMock';
import { INITIAL_SUPPLIERS } from '../../mocks/suppliersMock';
import { DataTable, Column } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { KpiStatCard } from '../../components/KpiStatCard';
import { Select } from '../../components/Select';
import { BatchPriceModal } from './BatchPriceModal';
import { ProductFormDrawer } from './ProductFormDrawer';
import { apiClient } from '../../services/apiClient';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  DollarSign,
  AlertTriangle,
  Boxes,
  Layers,
  TrendingDown,
  CheckCircle2,
  Building2,
  CheckSquare,
  Square
} from 'lucide-react';

export const ProductCatalogManager: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Multi-selection for batch updates
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modals & Drawers
  const [isBatchPriceModalOpen, setIsBatchPriceModalOpen] = useState(false);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteModalTarget, setDeleteModalTarget] = useState<ProductItem | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await apiClient.get<any>('/catalog/products');
        if (res && res.data && res.data.length > 0) {
          const mapped: ProductItem[] = res.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            sku: p.sku || `SKU-${p.id.substring(0, 6).toUpperCase()}`,
            categoryId: p.categoryId || 'cat-1',
            supplierId: p.supplierId || 'sup-1',
            supplierName: p.supplier?.companyName || 'BunkerStroy Zavod',
            price: Number(p.basePrice) || Number(p.price) || 0,
            unit: (p.unit || 'TON') as ProductUnit,
            stock: Number(p.stockQuantity) || Number(p.stock) || 0,
            minOrder: Number(p.minOrderQuantity) || 1,
            status: Number(p.stockQuantity || p.stock) > 20 ? 'IN_STOCK' : Number(p.stockQuantity || p.stock) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
            rating: 5.0,
            reviewsCount: 14,
            isVatIncluded: true,
            createdAt: new Date(p.createdAt || Date.now()).toLocaleDateString('uz-UZ')
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.warn('Mahsulotlar katalogini yuklashda xatolik:', err);
      }
    };
    fetchCatalog();
  }, []);

  // Statistics
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.status === 'IN_STOCK').length;
  const lowStockCount = products.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK').length;
  const totalInventoryValue = products.reduce((acc, curr) => acc + curr.price * curr.stock, 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'ALL' || p.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  // Toggle selection
  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map((p) => p.id));
    }
  };

  // Helper for status determination
  const determineStatus = (stock: number, lowThreshold: number): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' => {
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= lowThreshold) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  // Unit Labels map
  const getUnitLabel = (unit: ProductUnit): string => {
    switch (unit) {
      case 'QOP_50KG':
        return 'qop (50 kg)';
      case 'TONNA':
        return 'tonna';
      case 'KV_METR':
        return 'm²';
      case 'KUB_METR':
        return 'm³';
      case 'DONA':
        return 'dona';
    }
  };

  // Save (Create / Edit)
  const handleSaveProduct = (
    data: Omit<ProductItem, 'id' | 'updatedAt' | 'categoryName' | 'supplierName' | 'unitLabel' | 'status'>,
    id?: string
  ) => {
    const category = CATEGORIES.find((c) => c.id === data.categoryId);
    const supplier = INITIAL_SUPPLIERS.find((s) => s.id === data.supplierId);
    const categoryName = category ? category.name : 'Umumiy Material';
    const supplierName = supplier ? supplier.companyName : 'BunkerStroy Hamkori';
    const unitLabel = getUnitLabel(data.unit);
    const status = determineStatus(data.stock, data.lowStockThreshold);
    const now = new Date();
    const dateStr = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (id) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...data,
                categoryName,
                supplierName,
                unitLabel,
                status,
                updatedAt: dateStr
              }
            : item
        )
      );
    } else {
      const newProduct: ProductItem = {
        id: `prod-${Date.now()}`,
        ...data,
        categoryName,
        supplierName,
        unitLabel,
        status,
        updatedAt: dateStr
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // Batch Price Update handler
  const handleApplyBatchUpdate = (updates: { id: string; newPrice: number }[]) => {
    setProducts((prev) =>
      prev.map((item) => {
        const update = updates.find((u) => u.id === item.id);
        if (update) {
          return {
            ...item,
            price: update.newPrice,
            updatedAt: 'Hozir'
          };
        }
        return item;
      })
    );
    setSelectedProductIds([]);
  };

  // Delete product
  const handleDeleteProduct = () => {
    if (!deleteModalTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteModalTarget.id));
    setSelectedProductIds((prev) => prev.filter((id) => id !== deleteModalTarget.id));
    setDeleteModalTarget(null);
  };

  // Selected products list for batch modal
  const selectedProductsForModal =
    selectedProductIds.length > 0
      ? products.filter((p) => selectedProductIds.includes(p.id))
      : filteredProducts;

  // Category filter options
  const categoryOptions = [
    { value: 'ALL', label: 'Barcha kategoriyalar' },
    ...CATEGORIES.map((c) => ({ value: c.id, label: c.name }))
  ];

  const statusOptions = [
    { value: 'ALL', label: 'Barcha zaxiralar' },
    { value: 'IN_STOCK', label: 'Yetarli zaxira (IN_STOCK)' },
    { value: 'LOW_STOCK', label: 'Kam qolgan (LOW_STOCK)' },
    { value: 'OUT_OF_STOCK', label: 'Tugagan (OUT_OF_STOCK)' }
  ];

  // Table Columns
  const columns: Column<ProductItem>[] = [
    {
      key: 'select',
      header: '',
      render: (row) => {
        const isSelected = selectedProductIds.includes(row.id);
        return (
          <button
            type="button"
            onClick={() => handleToggleSelectProduct(row.id)}
            className="p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] transition-colors cursor-pointer"
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-[var(--color-accent-blue)]" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
        );
      }
    },
    {
      key: 'title',
      header: 'Mahsulot Nomi & SKU',
      render: (row) => (
        <div>
          <div className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-1.5">
            <span>{row.title}</span>
            {row.isEscoCertified && (
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] border border-[var(--color-accent-green)]/30">
                ESCO {row.energyRating}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-[var(--color-accent-blue)] font-semibold">
              {row.sku}
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)]">
              • {row.categoryName}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'supplier',
      header: 'Yetkazib Beruvchi (Ta’minotchi)',
      render: (row) => (
        <div className="text-xs">
          <div className="font-medium text-[var(--color-text-primary)] flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
            <span className="line-clamp-1">{row.supplierName}</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Yangilangan: {row.updatedAt}
          </div>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Baza Narxi & Birlik',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-sm text-[var(--color-accent-blue)]">
            {row.price.toLocaleString()} so‘m
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-muted)]">
            1 {row.unitLabel} uchun
          </div>
        </div>
      )
    },
    {
      key: 'stock',
      header: 'Ombor Zaxirasi & MOQ',
      render: (row) => (
        <div>
          <div className="font-mono font-bold text-xs text-[var(--color-text-primary)] flex items-center gap-1">
            <Boxes className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
            <span>
              {row.stock.toLocaleString()} {row.unitLabel}
            </span>
          </div>
          <div className="text-[11px] font-mono text-[var(--color-text-muted)] mt-0.5">
            MOQ: kamida {row.minOrder} {row.unitLabel}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Holati',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Amallar',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setEditingProduct(row);
              setIsFormDrawerOpen(true);
            }}
            title="Tahrirlash"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setDeleteModalTarget(row)}
            title="Tovarni o‘chirish"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-accent-red)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Sahifa sarlavhasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Mahsulotlar Katalogi & Ombor Zaxiralari
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Qurilish mollari ulgurji nomenklaturasi, narxlar indeksatsiyasi va MOQ standartlari
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsBatchPriceModalOpen(true)}
            leftIcon={<DollarSign className="w-4 h-4" />}
          >
            Ommaviy Narx O‘zgartirish {selectedProductIds.length > 0 && `(${selectedProductIds.length})`}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingProduct(null);
              setIsFormDrawerOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Yangi Tovar Qo‘shish
          </Button>
        </div>
      </div>

      {/* KPI Kartochkalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiStatCard
          title="Jami Nomenklatura"
          value={totalProducts}
          icon={<Package className="w-5 h-5" />}
          change={`${CATEGORIES.length} ta asosiy kategoriya`}
          changeType="positive"
        />
        <KpiStatCard
          title="Yetarli Zaxiralar"
          value={inStockCount}
          icon={<CheckCircle2 className="w-5 h-5" />}
          change="Sotuv uchun to‘liq ochiq"
          changeType="positive"
        />
        <KpiStatCard
          title="Kam Qolgan / Tugagan"
          value={lowStockCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          change="Zudlik bilan to‘ldirish zarur"
          changeType={lowStockCount > 0 ? 'negative' : 'positive'}
        />
        <KpiStatCard
          title="Ombor Zaxiralari Bahosi"
          value={`${(totalInventoryValue / 1_000_000_000).toFixed(2)} mlrd`}
          icon={<Boxes className="w-5 h-5" />}
          change="Baza narxlari bo‘yicha jami"
          changeType="positive"
        />
      </div>

      {/* Jadvallar va Filtrlar */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filteredProducts}
          searchPlaceholder="Mahsulot nomi, SKU, kategoriya yoki ta’minotchi bo‘yicha qidiruv..."
          emptyTitle="Hech qanday mahsulot topilmadi"
          emptyDescription="Filtr parametrlarini o‘zgartiring yoki yangi tovar qo‘shing."
          actionsSlot={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                leftIcon={
                  selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[var(--color-accent-blue)]" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )
                }
              >
                {selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0
                  ? 'Barchasini bekor qilish'
                  : 'Barchasini tanlash'}
              </Button>
              <div className="w-48">
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={categoryOptions}
                />
              </div>
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                />
              </div>
            </div>
          }
        />
      </div>

      {/* Ommaviy Narx O'zgartirish Modali */}
      <BatchPriceModal
        isOpen={isBatchPriceModalOpen}
        onClose={() => setIsBatchPriceModalOpen(false)}
        selectedProducts={selectedProductsForModal}
        onApplyBatchUpdate={handleApplyBatchUpdate}
      />

      {/* Mahsulot qo'shish / tahrirlash Drawer */}
      <ProductFormDrawer
        isOpen={isFormDrawerOpen}
        onClose={() => {
          setIsFormDrawerOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />

      {/* Mahsulotni o'chirish tasdiqlash modali */}
      <ConfirmModal
        isOpen={Boolean(deleteModalTarget)}
        title="Mahsulotni katalogdan o‘chirishni tasdiqlaysizmi?"
        description={`«${deleteModalTarget?.title}» tovari katalogdan butunlay o‘chiriladi. Ushbu tovar bo‘yicha yangi buyurtmalarni qabul qilish to‘xtatiladi.`}
        confirmText="Ha, o‘chirilsin"
        cancelText="Bekor qilish"
        isDangerous={true}
        onConfirm={handleDeleteProduct}
        onClose={() => setDeleteModalTarget(null)}
      />
    </div>
  );
};
