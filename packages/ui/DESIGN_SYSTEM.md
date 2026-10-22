# 🏛️ BUNKERSTROY DESIGN SYSTEM: NORDIC INDUSTRIAL ENTERPRISE
**Version:** 2.0.0 (Post-Tactical Redesign)  
**Target:** Enterprise B2B Building Materials, Heavy Fleet Logistics & ESCO Auditing  
**Primary Benchmark:** Procore + Stripe + Flexport + Linear  

---

## 1. 🎯 Falsafa va Konsepsiya (Brand Philosophy)

### 1.1. "Bunker" So'zining Yangi Ma'nosi
* **Eski xato talqin:** Harbiy temir quti, boltlar (rivets), qop-qora kiberpank bunker, xavf-xatar lentalari (hazard stripes).
* **To'g'ri B2B talqin:** **Kapital va ta'minot xavfsizligi (Safe Haven)**. 
  Yirik developerlar (*Murad Buildings*, *Golden House*, *Enter Engineering*) uchun sement va armatura yetkazib berishdagi uzluksizlik, inflyatsiyadan himoyalangan ulgurji narxlar va kafolatlangan ombor zaxiralari.

### 1.2. Asosiy Dizayn Prinsiplari
1. **Zero Gimmicks (Ortiqcha bezaklarsiz):** Hech qanday o'yinchoq sariq lentalar, soxta temir boltlar yoki ortiqcha qorong'ulik yo'q.
2. **Absolute Readability (Benuqson o'qiluvchanlik):** 100% yorug', ko'zni toliqtirmaydigan sovuq oppoq/kulrang fon (`#F8FAFC`). Ochiq quyosh ostidagi planshetda ham, VIP ofisdagi 4K ekranda ham ideal kontrast.
3. **Tabular Precision (Jadval aniqligi):** Monospaced va tabulyar raqamlar (`tabular-nums`), Excel va 1C darajasidagi ma'lumotlar zichligi (high data-density).
4. **Institutional Trust (Davlat va Huquqiy ishonch):** O'zDSt, GOST, ShNQ sertifikatlari, Soliq STIR/INN va E-IMZO raqamli imzo atributlarining shaffof aks etishi.

---

## 2. 🎨 Ranglar Tizimi (Color Tokens)

### 2.1. Neytral Yuzalar (Neutrals & Canvas)
| Token Nomi | Hex Kodi | Tailwind Ekvivalent | Qo'llanilishi |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#F8FAFC` | `bg-slate-50` | Asosiy sahifa foni, ko'zga yoqimli sovuq oq |
| **Surface White** | `#FFFFFF` | `bg-white` | Kartalar, modallar, drayverlar, jadvallar |
| **Surface Hover** | `#F1F5F9` | `bg-slate-100` | Sichqoncha ustiga borgandagi (hover) holati |
| **Surface Muted** | `#E2E8F0` | `bg-slate-200` | Qidiruv kbd, ajratuvchi fonlar, nofaol tugmalar |
| **Hairline Border** | `#E2E8F0` | `border-slate-200` | 1px yupqa, toza chegaralar |
| **Border Strong** | `#CBD5E1` | `border-slate-300` | Aktiv inputlar, ajratuvchi asosiy chiziqlar |

### 2.2. Tipografiya Ranglari (Text & Contrast)
| Token Nomi | Hex Kodi | Qo'llanilishi |
| :--- | :--- | :--- |
| **Text Primary** | `#0F172A` (Slate-900) | Sarlavhalar, asosiy matnlar, yuqori kontrast |
| **Text Secondary** | `#334155` (Slate-700) | Tushuntirishlar, parametrlar, jadval qatorlari |
| **Text Muted** | `#64748B` (Slate-500) | Placeholderlar, yordamchi izohlar, sana |
| **Text Inverted** | `#FFFFFF` | Qorong'i/rangli tugmalardagi matn |

### 2.3. Sanoat va Holat Aksentlari (Functional Accents)
| Segment | Rang & Hex | Maqsadi |
| :--- | :--- | :--- |
| **Primary Brand (Ochre)** | `#C2410C` (Terracotta 700) / `#EA580C` (Orange 600) | Qurilish xavfsizligi, pishiq g'isht va brend harakatlari |
| **ESCO Green** | `#059669` (Emerald 600) | Energiya tejamkorligi, zaxiradagi mahsulotlar, to'langan buyurtmalar |
| **Logistics Sky** | `#0284C7` (Sky 600) | HOWO samosvallari, GPS telemetriya, yo'ldagi yuklar |
| **Global Blue** | `#2563EB` (Blue 600) | Xalqaro import, temir yo'l konteynerlari, portlar |
| **Danger Red** | `#DC2626` (Red 600) | Rad etilgan to'lovlar, zaxirada tugagan tovarlar, xatoliklar |

---

## 3. ✍️ Tipografiya Standartlari (Typography)

* **Display & Headings:** `Plus Jakarta Sans` — Geometrik, zamonaviy va obro'li sarlavhalar (600, 700, 800 weight, `-0.025em` tracking).
* **Body & UI Text:** `Inter` — Dunyo standarti, har qanday zichlikda yuqori o'qiluvchanlik (400, 500, 600 weight).
* **Data, Codes & Prices:** `JetBrains Mono` — B2B xarid narxlari, STIR, GOST raqamlari va o'lchov birliklari uchun tabular raqamlar (`font-variant-numeric: tabular-nums`).

---

## 4. 🧩 Komponentlar Arxitekturasi (Component Guidelines)

### 4.1. Kartalar (`Card`)
* Oq fon (`bg-white`), 1px yupqa chegara (`border border-slate-200`).
* Nozik va sokin soya: `shadow-sm hover:shadow-md transition-shadow`.
* Radiusi: `rounded-2xl` (16px).
* **Taqiqlangan:** Boltlar (rivets), to'q kulrang metall gradiyentlar, o'tkir chamfer burchaklar.

### 4.2. Tugmalar (`Button`)
* **Primary:** `bg-orange-600 hover:bg-orange-700 text-white shadow-sm font-semibold rounded-xl px-4 py-2.5`.
* **Secondary:** `bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm`.
* **Ghost:** `hover:bg-slate-100 text-slate-600 rounded-xl`.

### 4.3. Jadvallar va Inputlar (`Table`, `Input`, `Select`)
* **Input:** `bg-white border-slate-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-600/10 text-slate-900 rounded-xl`.
* **Table:** `border-collapse`, sarlavhalar `bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider`, qatorlar `hover:bg-slate-50/80 border-b border-slate-100`.

### 4.4. Nishonlar (`Badge`)
* Kichik, toza kapsulalar: `rounded-full text-[11px] font-medium px-2.5 py-0.5`.
* Muvaffaqiyat: `bg-emerald-50 text-emerald-700 border border-emerald-200`.
* Brend: `bg-orange-50 text-orange-700 border border-orange-200`.
* Neytral: `bg-slate-100 text-slate-700 border border-slate-200`.

---

## 5. 🏗️ Sahifalar Spetsifikatsiyasi (Module Blueprints)

### 5.1. B2B Marketplace
* **Dual View:** 
  1. *Vizual Grid:* Sement qoplari, armatura bog'lamlari, rasmiy zavod logotipi (*Bekobod Metall*, *Qizilqumsement*), GOST sertifikati nishoni, tonna narxi.
  2. *Smeta Matritsasi (Matrix Table):* Bitta ekranda barcha tovarlar. Tezkor Tab/Enter navigatsiyasi bilan tonna kiritiladi, umumiy smeta va kerakli HOWO mashinalari soni avtomatik chiqadi.

### 5.2. Og'ir Logistika Hub
* Google Maps kumush korporativ xaritasi.
* Faol samosvallar holati, masofa, yo'l qoplamasi va yetkazib berish narxining shaffof formulasi.

### 5.3. ESCO Energiya Auditi
* Muhandislik laboratoriyasi ko'rinishi: O'zbekiston ShNQ 2.01.04-18 qoidalari bo'yicha devor qatlamlari, issiqlik yo'qotilishi grafigi, gaz va elektr tejamkorligi hisoboti hamda "Rasmiy Energo-Pasport Yuklab Olish (PDF)".

### 5.4. Global Bunker
* Xalqaro temir yo'l koridorlari (Lianyungang -> Dostyk -> Toshkent Chukursay), bojxona deklaratsiyasi va INCOTERMS 2020 kafolati.

### 5.5. Buyurtmalar va To'lovlar
* Didox.uz / Soliq.uz uslubidagi rasmiy elektron hisob-faktura, QR-kod, 12% QQS va E-IMZO raqamli imzolash tugmasi.

---
*BunkerStroy Design Architecture — 2026*
