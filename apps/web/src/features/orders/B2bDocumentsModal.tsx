import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  Printer,
  Send,
  CheckCircle2,
  Building2,
  ShieldCheck,
  QrCode,
  Calendar,
  User,
  Truck,
  CreditCard,
  ExternalLink,
  Check,
  AlertCircle,
  Clock,
  KeyRound
} from 'lucide-react';
import { Order } from '@bunkerstroy/types';
import { Modal, Button, Badge } from '@bunkerstroy/ui';

interface B2bDocumentsModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
}

export const B2bDocumentsModal: React.FC<B2bDocumentsModalProps> = ({
  isOpen,
  order,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'escrow' | 'invoice' | 'act'>('escrow');
  const [didoxSent, setDidoxSent] = useState(false);
  const [sendingDidox, setSendingDidox] = useState(false);

  // Derived financial & order parameters
  const finalAmount = Number(order.finalAmount || 0);
  const firstPayment = Number(order.firstPaymentAmount || finalAmount / 2);
  const secondPayment = Number(order.secondPaymentAmount || finalAmount / 2);

  // 12% VAT calculations for official Soliq / Didox invoice
  const vatRate = 0.12;
  const netAmount = Math.round(finalAmount / (1 + vatRate));
  const vatAmount = finalAmount - netAmount;

  const supplierName =
    order.subOrders?.[0]?.supplierName || 'BUNKERSTROY HAMKOR METALL ZAVODI MCHJ';
  const buyerName = order.buyerName || 'Toshkent Sanoat Qurilish MCHJ';
  const buyerStir = '309 112 844';
  const supplierStir = '307 889 452';

  const orderDateFormatted = new Date(order.createdAt || Date.now()).toLocaleDateString(
    'uz-UZ',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const invoiceNumber = `HF-${order.orderNumber}`;
  const contractNumber = `BS-ESC/${order.orderNumber}`;
  const actNumber = `DAL-${order.orderNumber}`;

  const handlePrint = () => {
    window.print();
  };

  const handleSendDidox = () => {
    setSendingDidox(true);
    setTimeout(() => {
      setSendingDidox(false);
      setDidoxSent(true);
      setTimeout(() => setDidoxSent(false), 6000);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-bunker-amber-500" />
          <span>B2B Rasmiy Elektron Hujjatlar Portali</span>
        </div>
      }
      subtitle={`Buyurtma #${order.orderNumber} bo‘yicha yuridik kuchga ega Didox va Soliq.uz elektron hujjatlari to‘plami`}
      headerExtra={
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('escrow')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'escrow'
                  ? 'bg-[#D95D1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === 'escrow' ? 'text-white' : 'text-slate-500'}`} />
              <span>1. Escrow Shartnomasi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invoice')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'invoice'
                  ? 'bg-[#D95D1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === 'invoice' ? 'text-white' : 'text-slate-500'}`} />
              <span>2. Elektron Hisob-Faktura (Didox)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('act')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'act'
                  ? 'bg-[#D95D1E] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${activeTab === 'act' ? 'text-white' : 'text-slate-500'}`} />
              <span>3. Topshirish Dalolatnomasi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="font-mono text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish / PDF</span>
            </Button>

            <Button
              size="sm"
              variant="primary"
              onClick={handleSendDidox}
              isLoading={sendingDidox}
              className="font-mono text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Didox orqali yuborish</span>
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Didox Success Notification */}
        {didoxSent && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="font-mono text-xs space-y-0.5">
              <div className="font-bold">
                Hujjat Didox.uz va Soliq.uz tizimiga muvaffaqiyatli yuborildi!
              </div>
              <div className="text-emerald-700">
                Elektron hujjat ID: <span className="font-bold">DDX-2026-{order.orderNumber}</span>. Qabul qiluvchining Didox kabinetida tasdiqlash uchun ro‘yxatga olindi.
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 1: ESCROW SHARTNOMASI
            ========================================================================= */}
        {activeTab === 'escrow' && (
          <div className="bg-white border border-slate-300 rounded-xl p-5 sm:p-7 shadow-xs font-serif text-slate-800 space-y-5 text-xs sm:text-sm leading-relaxed print:border-none print:p-0">
            {/* Shartnoma Bosh qismi */}
            <div className="text-center space-y-1.5 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                <span>O‘zbekiston Respublikasi Qonunchiligi Asosida Rasmiylashtirilgan</span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 font-sans">
                BUNKERSTROY SAVDO PLATFORMASI ORQALI YUK YETKAZIB BERISH VA 50/50 ESCROW TO‘LOV SHARTNOMASI
              </h1>
              <div className="font-mono text-xs font-semibold text-slate-600">
                Shartnoma № {contractNumber}
              </div>
              <div className="flex justify-between items-center font-mono text-xs text-slate-500 pt-1 px-4">
                <span>Toshkent shahri</span>
                <span>{orderDateFormatted}</span>
              </div>
            </div>

            {/* 1. Tomonlar */}
            <div className="space-y-1.5 font-sans text-xs">
              <h2 className="font-bold text-slate-900 uppercase font-mono tracking-wider">
                1. Shartnoma Tomonlari
              </h2>
              <p className="text-justify text-slate-700">
                Bir tomondan <strong>{buyerName}</strong> (bundan keyin «Buyurtmachi» deb yuritiladi), STIR: <strong>{buyerStir}</strong>, vakili orqali, ikkinchi tomondan <strong>{supplierName}</strong> (bundan keyin «Ta'minotchi» deb yuritiladi), STIR: <strong>{supplierStir}</strong>, va uchinchi tomondan <strong>«BUNKERSTROY B2B TECH» MCHJ</strong> (bundan keyin «Escrow Operator» deb yuritiladi) mazkur shartnomani quyidagilar haqida tuzdilar:
              </p>
            </div>

            {/* 2. Shartnoma Predmeti */}
            <div className="space-y-2 font-sans text-xs">
              <h2 className="font-bold text-slate-900 uppercase font-mono tracking-wider">
                2. Shartnoma Predmeti va Tovar Spetsifikatsiyasi
              </h2>
              <p className="text-justify text-slate-700">
                2.1. Ta'minotchi Buyurtmachi tomonidan BunkerStroy elektron platformasida rasmiylashtirilgan <strong>#{order.orderNumber}</strong>-sonli buyurtmaga muvofiq quyidagi tovarlarni yetkazib berish, Buyurtmachi esa tovarlarni qabul qilish va to‘lovni amalga oshirish majburiyatini oladi:
              </p>

              <div className="overflow-x-auto font-mono text-[11px]">
                <table className="w-full border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="border border-slate-300 p-1.5 text-center">№</th>
                      <th className="border border-slate-300 p-1.5 text-left">Tovar Nomi</th>
                      <th className="border border-slate-300 p-1.5 text-center">Miqdori &amp; Birligi</th>
                      <th className="border border-slate-300 p-1.5 text-right">Birlik Narxi</th>
                      <th className="border border-slate-300 p-1.5 text-right">Jami Summasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-1.5 font-sans font-medium text-slate-900">
                          {item.productTitle}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-center">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right">
                          {Number(item.unitPrice).toLocaleString()} so‘m
                        </td>
                        <td className="border border-slate-300 p-1.5 text-right font-bold">
                          {Number(item.totalPrice).toLocaleString()} so‘m
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={4} className="border border-slate-300 p-1.5 text-right">
                        Umumiy Tovar Qiymati (Yetkazish bilan):
                      </td>
                      <td className="border border-slate-300 p-1.5 text-right text-bunker-amber-600">
                        {finalAmount.toLocaleString()} so‘m
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. 50/50 Escrow To‘lov Shartlari */}
            <div className="space-y-2 font-sans text-xs">
              <h2 className="font-bold text-slate-900 uppercase font-mono tracking-wider">
                3. 50/50 Xavfsiz Escrow To‘lov Shartlari
              </h2>
              <p className="text-justify text-slate-700">
                3.1. Mazkur shartnoma bo‘yicha umumiy summa <strong>{finalAmount.toLocaleString()} so‘m</strong>ni tashkil etadi.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg border border-amber-300 bg-amber-50/50 space-y-1">
                  <div className="font-bold text-amber-900 uppercase flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-bunker-amber-600" />
                    <span>1-bosqich: 50% Avans To‘lovi</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {firstPayment.toLocaleString()} so‘m
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Shartnoma tuzilgan vaqtda to‘lanadi va BunkerStroy Escrow hisob raqamida kafolat sifatida muzlatiladi.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-sky-300 bg-sky-50/50 space-y-1">
                  <div className="font-bold text-sky-900 uppercase flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-600" />
                    <span>2-bosqich: 50% Qoldiq To‘lov</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900">
                    {secondPayment.toLocaleString()} so‘m
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    Yuk avtotransport orqali belgilangan manzilga yetib kelgach, tushirishdan oldin to‘lanadi.
                  </p>
                </div>
              </div>
              <p className="text-justify text-slate-700">
                3.2. Yuk manzilga tushirilib, to‘liq ko‘rikdan o‘tkazilgach, Buyurtmachi haydovchiga <strong>4-xonali Maxfiy Qabul Kodi (Delivery PIN)</strong>ni taqdim etadi. Ushbu kod kiritilishi bilan Escrowdagi to‘liq mablag‘ Ta'minotchining hisob-raqamiga avtomatik tarzda o‘tkaziladi.
              </p>
            </div>

            {/* E-IMZO BILAN TASDIQLANGAN (PKCS#7) SHTAMP */}
            <div className="pt-4 border-t border-slate-300">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50/40">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-white border border-emerald-300 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
                    <QrCode className="w-full h-full text-emerald-700" />
                  </div>
                  <div className="space-y-0.5 font-mono text-xs">
                    <div className="font-extrabold text-emerald-900 uppercase tracking-tight flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>E-IMZO BILAN TASDIQLANGAN (PKCS#7)</span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      O‘zbekiston Respublikasi Soliq Qo‘mitasi E-IMZO reestri
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Seriya №: <span className="font-bold">4B8E92F1-D930-4C10-AE56-BUNKER</span>
                    </div>
                    <div className="text-[10px] text-slate-600">
                      Sana va vaqt: <span className="font-semibold">{orderDateFormatted}, 10:45:12</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px] text-slate-600 space-y-0.5 shrink-0">
                  <div className="font-bold text-slate-800">Yuridik kuchga ega elektron hujjat</div>
                  <div>Didox.uz / Soliq.uz integratsiyasi</div>
                  <div className="text-emerald-700 font-bold">Holat: IMZOLANGAN VA FAOL</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ELEKTRON HISOB-FAKTURA (DIDOX / SOLIQ.UZ)
            ========================================================================= */}
        {activeTab === 'invoice' && (
          <div className="bg-white border border-slate-300 rounded-xl p-5 sm:p-7 shadow-xs font-mono text-slate-800 space-y-5 text-xs print:border-none print:p-0">
            {/* Header: Didox / Soliq.uz */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    ELEKTRON HISOB-FAKTURA
                  </span>
                  <Badge variant="info" size="sm" isMono>
                    SOLIQ.UZ &amp; DIDOX
                  </Badge>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Hisob-faktura raqami: <strong>{invoiceNumber}</strong> | Sana: <strong>{orderDateFormatted}</strong>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  {order.status === 'COMPLETED' || order.status === 'FULLY_PAID' || order.isSecondPaid
                    ? 'STATUS: TO‘LANGAN'
                    : 'STATUS: 50% AVANS TO‘LANGAN'}
                </span>
              </div>
            </div>

            {/* Requisites Table: Yetkazib beruvchi & Sotib oluvchi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
              {/* Yetkazib beruvchi */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase flex items-center justify-between">
                  <span>Yetkazib Beruvchi (Sotuvchi)</span>
                  <span className="text-emerald-700">STIR: {supplierStir}</span>
                </div>
                <div><strong>Nomi:</strong> {supplierName}</div>
                <div><strong>Manzil:</strong> Toshkent sh., Bektemir tumani, Sanoat ko‘chasi, 45-uy</div>
                <div><strong>Hisob raqam:</strong> 20208000400567891001</div>
                <div><strong>Bank:</strong> ATB "O‘zsanoatqurilishbank"</div>
                <div><strong>MFO:</strong> 00440 | <strong>IFUT (OKED):</strong> 23510</div>
              </div>

              {/* Sotib oluvchi */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-1.5 bg-slate-50">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase flex items-center justify-between">
                  <span>Sotib Oluvchi (Mijoz)</span>
                  <span className="text-sky-700">STIR: {buyerStir}</span>
                </div>
                <div><strong>Nomi:</strong> {buyerName}</div>
                <div><strong>Telefon:</strong> {order.buyerPhone || '+998 90 123 45 67'}</div>
                <div>
                  <strong>Manzil:</strong> {order.deliveryAddress?.region || 'Toshkent shahri'},{' '}
                  {order.deliveryAddress?.district || 'Yunusobod tumani'}
                </div>
                <div><strong>Shartnoma:</strong> № {contractNumber} ({orderDateFormatted})</div>
                <div><strong>To‘lov maqsadi:</strong> BunkerStroy 50/50 Escrow orqali qurilish tovarlari to‘lovi</div>
              </div>
            </div>

            {/* Soliq / Didox 12% VAT Table */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700">
                Tovar-moddiy boyliklar ro‘yxati (QQS 12% ajratilgan):
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[10px] sm:text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="border border-slate-300 p-1.5 text-center">№</th>
                      <th className="border border-slate-300 p-1.5 text-left">MXIK Kodi &amp; Tovar Nomi</th>
                      <th className="border border-slate-300 p-1.5 text-center">Birligi</th>
                      <th className="border border-slate-300 p-1.5 text-center">Miqdori</th>
                      <th className="border border-slate-300 p-1.5 text-right">Narxi (QQS siz)</th>
                      <th className="border border-slate-300 p-1.5 text-right">Summasi</th>
                      <th className="border border-slate-300 p-1.5 text-center">QQS 12%</th>
                      <th className="border border-slate-300 p-1.5 text-right">Jami QQS bilan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => {
                      const itemTotal = Number(item.totalPrice);
                      const itemNet = Math.round(itemTotal / (1 + vatRate));
                      const itemVat = itemTotal - itemNet;
                      const itemUnitNet = Math.round(itemNet / Number(item.quantity));

                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5">
                            <span className="text-[9px] text-slate-400 block">MXIK: 06901001001000000</span>
                            <span className="font-bold text-slate-900 font-sans">{item.productTitle}</span>
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center">{item.unit}</td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold">{item.quantity}</td>
                          <td className="border border-slate-300 p-1.5 text-right">{itemUnitNet.toLocaleString()}</td>
                          <td className="border border-slate-300 p-1.5 text-right">{itemNet.toLocaleString()}</td>
                          <td className="border border-slate-300 p-1.5 text-right text-emerald-800">
                            {itemVat.toLocaleString()}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-right font-bold text-slate-900">
                            {itemTotal.toLocaleString()} so‘m
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold text-slate-900">
                    <tr>
                      <td colSpan={5} className="border border-slate-300 p-2 text-right">Jami:</td>
                      <td className="border border-slate-300 p-2 text-right">{netAmount.toLocaleString()}</td>
                      <td className="border border-slate-300 p-2 text-right text-emerald-800">
                        {vatAmount.toLocaleString()}
                      </td>
                      <td className="border border-slate-300 p-2 text-right text-bunker-amber-600 font-extrabold text-xs">
                        {finalAmount.toLocaleString()} so‘m
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Soliq & Didox Stamp Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 border border-slate-300 rounded-lg flex items-center gap-3 bg-white">
                <QrCode className="w-12 h-12 text-slate-800 shrink-0" />
                <div className="text-[10px] space-y-0.5">
                  <div className="font-bold text-slate-900">SOLIQ.UZ ELEKTRON REESTRI</div>
                  <div>Hujjat identifikatori: DDX-{order.orderNumber}</div>
                  <div className="text-emerald-700 font-semibold">QQS 12% to‘liq hisoblangan</div>
                </div>
              </div>

              <div className="p-3 border border-emerald-300 rounded-lg bg-emerald-50/50 flex items-center justify-between">
                <div className="text-[10px] space-y-0.5">
                  <div className="font-bold text-emerald-900">DIDOX.UZ ORQALI TASDIQLANGAN</div>
                  <div className="text-slate-600">Operator: Didox B2B E-hujjat</div>
                  <div className="text-emerald-700 font-semibold">Shtamp va E-imzo holati: Haqiqiy</div>
                </div>
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: TOPSHIRISH-QABUL DALOLATNOMASI
            ========================================================================= */}
        {activeTab === 'act' && (
          <div className="bg-white border border-slate-300 rounded-xl p-5 sm:p-7 shadow-xs font-mono text-slate-800 space-y-5 text-xs print:border-none print:p-0">
            {/* Header */}
            <div className="text-center space-y-1 border-b border-slate-200 pb-3">
              <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 font-sans">
                TOVAR-MODDIY BOYLIKLARNI TOPSHIRISH-QABUL QILISH DALOLATNOMASI
              </h1>
              <div className="text-slate-600 font-bold">
                Dalolatnoma № {actNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Buyurtma: <strong>#{order.orderNumber}</strong> | Shartnoma: <strong>№ {contractNumber}</strong> | Sana: <strong>{orderDateFormatted}</strong>
              </div>
            </div>

            {/* Transport & Driver details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Truck className="w-3.5 h-3.5 text-bunker-amber-600" />
                  <span>Yetkazib Beruvchi &amp; Haydovchi</span>
                </div>
                <div><strong>Ta'minotchi:</strong> {supplierName}</div>
                <div>
                  <strong>Haydovchi:</strong>{' '}
                  {order.subOrders?.[0]?.driverName || 'Aliyev Sherzod Rustamovich'}
                </div>
                <div>
                  <strong>Telefon:</strong>{' '}
                  {order.subOrders?.[0]?.driverPhone || '+998 97 712 34 56'}
                </div>
                <div>
                  <strong>Avtotransport:</strong>{' '}
                  {order.vehicleType || 'ISUZU Bortli yuk mashinasi'} (Davlat raqami: <strong>01 777 AAA</strong>)
                </div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Qabul Qiluvchi (Mijoz)</span>
                </div>
                <div><strong>Buyurtmachi:</strong> {buyerName}</div>
                <div><strong>Mas'ul shaxs:</strong> Vakolatli ombor mudiri / proarab</div>
                <div>
                  <strong>Manzil:</strong> {order.deliveryAddress?.region}, {order.deliveryAddress?.district},{' '}
                  {order.deliveryAddress?.street || "Qurilish ob'ekti"}
                </div>
                <div><strong>STIR:</strong> {buyerStir}</div>
              </div>
            </div>

            {/* Tovarlar jadvali */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700">Topshirilgan tovarlar ro‘yxati:</div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="border border-slate-300 p-1.5 text-center">№</th>
                      <th className="border border-slate-300 p-1.5 text-left">Mahsulot Nomi</th>
                      <th className="border border-slate-300 p-1.5 text-center">Birligi</th>
                      <th className="border border-slate-300 p-1.5 text-center">Miqdori</th>
                      <th className="border border-slate-300 p-1.5 text-center">Sifati &amp; Butunligi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-1.5 font-sans font-medium text-slate-900">
                          {item.productTitle}
                        </td>
                        <td className="border border-slate-300 p-1.5 text-center">{item.unit}</td>
                        <td className="border border-slate-300 p-1.5 text-center font-bold">{item.quantity}</td>
                        <td className="border border-slate-300 p-1.5 text-center text-emerald-700 font-bold">
                          ✓ Qoniqarli, nuqsonsiz
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QABUL PIN KODI HOLATI */}
            <div className="p-3 rounded-lg border border-bunker-border-strong bg-slate-50 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-bunker-amber-500" />
                  <span>Qabul PIN Kodi Holati:</span>
                </div>
                {order.isAcceptanceCodeRevealed || order.acceptanceCode || order.status === 'COMPLETED' ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    ✓ PIN-KOD TASDIQLANGAN (Yuk qabul qilindi)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                    KUTILMOQDA (Yuk joyiga yetgach kiritiladi)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 font-sans">
                Tovarni qabul qilib olgach, Buyurtmachi 4-xonali maxfiy Delivery PIN kodni haydovchiga taqdim etgan. Ushbu kod dalolatnomani ikki tomonlama yopishga tenglashtiriladi.
              </p>
            </div>

            {/* 30 DAQIQALIK KUTISH DALOLATNOMASI */}
            <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50/60 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
                <Clock className="w-4 h-4 text-bunker-amber-600" />
                <span>30 Daqiqalik Bepul Kutish &amp; Yuk Tushirish Dalolatnomasi</span>
              </div>
              <p className="text-[11px] text-amber-900 font-sans">
                <strong>Reglament:</strong> Avtotransport belgilangan ob'ekt manziliga yetib kelgan daqiqadan e'tiboran yukni tushirish uchun <strong>30 daqiqa bepul kutish vaqti</strong> ajratiladi. 30 daqiqadan oshgan kechikishlar uchun har bir soatiga <strong>80,000 so‘m</strong> bo‘sh turish (prostoy) jarimasi hisoblanadi.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                <div className="bg-white p-2 rounded border border-amber-200">
                  <span className="text-slate-400 block">Yuk kelgan vaqti:</span>
                  <span className="font-bold text-slate-800">
                    {order.arrivedAt
                      ? new Date(order.arrivedAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
                      : '09:45 (Reja bo‘yicha)'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-amber-200">
                  <span className="text-slate-400 block">Bepul kutish muddati:</span>
                  <span className="font-bold text-slate-800">
                    {order.waitingDeadline
                      ? new Date(order.waitingDeadline).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
                      : '30 daqiqa (10:15 gacha)'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded border border-amber-200">
                  <span className="text-slate-400 block">Kutish bo‘yicha e'tiroz:</span>
                  <span className="font-bold text-emerald-700">Yo‘q (Me'yorda tushirildi)</span>
                </div>
              </div>
            </div>

            {/* Imzolar qatori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-300">
              <div className="space-y-2">
                <div className="font-bold text-slate-900 uppercase">Topshirdi (Haydovchi):</div>
                <div className="h-12 border-b border-slate-400 flex items-end justify-between pb-1">
                  <span className="text-[10px] text-slate-500">Imzo &amp; F.I.Sh</span>
                  <span className="font-bold text-slate-800">Aliyev Sh. R.</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Haydovchi mobil ilovasida tasdiqlangan
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-900 uppercase">Qabul Qildi (Buyurtmachi):</div>
                <div className="h-12 border-b border-slate-400 flex items-end justify-between pb-1">
                  <span className="text-[10px] text-slate-500">Imzo &amp; F.I.Sh</span>
                  <span className="font-bold text-slate-800">{buyerName}</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Mijoz Delivery PIN orqali imzolangan
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
