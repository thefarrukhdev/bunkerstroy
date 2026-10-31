# 🏛️ BUNKERSTROY YAGONA DIZAYN TIZIMI VA UX/UI SPETSIFIKATSIYASI (SPEC)
**Loyiha:** `BunkerStroy.uz` — O'zbekistonning milliy B2B & B2C qurilish materiallari va og'ir logistika ekotizimi  
**Hujjat versiyasi:** `3.0.0-ENTERPRISE-NEO`  
**Muallif:** Senior Principal UI/UX Architect & Design Systems Lead  
**Holati:** Tasdiqlangan / Amalga oshirishga tayyor  
**Qamrovi:** Monorepo (`apps/web`, `apps/seller`, `apps/admin`, `apps/driver` va `packages/ui`)

---

## 📑 MUNDARIJA
1. [Brend Falsafasi va Yangi Vizual Konsepsiya](#1-brend-falsafasi-va-yangi-vizual-konsepsiya)
2. [Asosiy Dizayn Tokenlari (Design Tokens)](#2-asosiy-dizayn-tokenlari-design-tokens)
   - 2.1. Ranglar palitrasi (Color Palette & Semantic Tokens)
   - 2.2. Tipografiya tizimi (Typography & Tabular Numerics)
   - 2.3. Setka, bo'shliqlar va radiuslar (Spacing, Grid & Elevation)
3. [4 ta Mahsulot Yo'nalishi Bo'yicha Maxsus UI/UX Qoidalari](#3-4-ta-mahsulot-yonalishi-boyicha-maxsus-uiux-qoidalari)
   - 3.1. Tashqi qurilish (Og'ir konstruktiv materiallar)
   - 3.2. Ichki qurilish (Pardozlash va qoplama materiallari)
   - 3.3. Uy ta'mirlash (Interyer, muhandislik va santexnika)
   - 3.4. Texnik uskunalar (Professional asboblar va inventar)
4. [4 ta Ekosistema Panellari Bo'yicha UX/UI Spetsifikatsiyasi](#4-4-ta-ekosistema-panellari-boyicha-uxui-spetsifikatsiyasi)
   - 4.1. `apps/web` (Bunkerstroy.uz — Vitrina, B2B/B2C Marketplace, Smeta)
   - 4.2. `apps/seller` (Seller.bunkerstroy.uz — Zavod va Do'kon POS/CRM, Ombor)
   - 4.3. `apps/admin` (Admin.bunkerstroy.uz — Boshqaruv, STIR, Moliya, Logistika)
   - 4.4. `apps/driver` (Driver.bunkerstroy.uz — Mobil PWA, Kamaz/HOWO/Isuzu Haydovchilari)
5. [Tijoriy va Huquqiy Qoidalar UX Oqimlari](#5-tijoriy-va-huquqiy-qoidalar-ux-oqimlari)
   - 5.1. Narx zinapoyasi va MOQ (Minimal partiya)
   - 5.2. To'lov tizimi: 100% vs 50/50 Escrow mexanikasi
   - 5.3. 12 viloyat logistika kalkulyatori va mashina yuklama indikatori
6. [Komponentlar Standarti (`@bunkerstroy/ui`)](#6-komponentlar-standarti-bunkerstroyui)
7. [Tailwind CSS v4 Konfiguratsiyasi va Kod Shabloni](#7-tailwind-css-v4-konfiguratsiyasi-va-kod-shabloni)
8. [Migratsiya Rejasi va Tavsiyalar](#8-migratsiya-rejasi-va-tavsiyalar)

---

## 1. BREND FALSAFASI VA YANGI VIZUAL KONSEPSIYA

### 1.1. "Bunker" So'zining Qayta Kashf Etilishi
* **Eski noo'rin talqin (Cyberpunk / Fallout Shelter):** Qorong'i zax bunker, qora-ko'k fonlar (`#071326`), sariq qora xavf-xatar lentalari (hazard stripes), sun'iy po'lat vintlar (rivets). Bu uslub B2C xaridorlarni (ayollarni, uy egalarini, dizaynerlarni) cho'chitadi, B2B hisobchilar va moliya xodimlarining esa ko'zini toliqtiradi.
* **Yangi Sanoat-Arxitektura Talqini (Architectural Precision & Capital Fortress):**
  - **Ishonch Qal'asi (Fortress of Reliability):** Yirik quruvchi tashkilotlar (*Murad Buildings*, *Golden House*, *Enter Engineering*) uchun sement va armatura ta'minotidagi uzluksizlik, narxlarning inflyatsiyadan himoyalanganligi va kafolatlangan ombor zaxirasi.
  - **Shaffoflik va Tozalik (Swiss Functionalism):** Toza havo, yorug'lik, aniq chiziqlar, beton va tabiiy toshlarning olijanob teksturasi, arxitektura chizmalaridagi muhandislik aniqligi.

### 1.2. Asosiy Dizayn Tamoyillari (The 5 Tenets)
1. **Shaffof O'qiluvchanlik (Sunlight Legibility & High Contrast):**
   - O'zbekistonning ochiq quyoshli qurilish maydonlarida (planshetda) ham, konditsionerli B2B ofisida ham benuqson ko'rinish.
   - Neytral yorug'lik ustunligi: Light-mode birinchi darajali, toza oq (`#FFFFFF`) va sovuq marmar/ohaktosh fon (`#F8FAFC`).
2. **Matematik va Tabulyar Aniqlik (Tabular Precision):**
   - Barcha narxlar, tonnalar, metr kvadratlar, STIR raqamlari va hisob-fakturalar monospaced tabulyar shriftda (`font-variant-numeric: tabular-nums`).
   - Excel va 1C dan ustun bo'lgan, ammo ulardek ixcham (data-dense) axborot taqdimoti.
3. **Sanoat Aksenti (Architectural Safety Amber / Terracotta):**
   - O'yinchoq neon sariq o'rniga — qurilish texnikalari (Caterpillar, Hilti, og'ir kranlar) va pishiq g'isht rangini eslatuvchi chuqur xavfsizlik terrakotasi (`#D95D1E` / `#EA580C`).
4. **Davlat va Huquqiy Maqom (Institutional Trust):**
   - O'zDSt, GOST, ShNQ sertifikatlari, Davlat Soliq Qo'mitasi STIR/INN tasdig'i va E-IMZO raqamli imzosi interfeysda shunchaki matn emas, rasmiy muhr (badge of authenticity) sifatida aks etishi.
5. **Ergonomik Moslashuvchanlik (Context-Aware Ergonomics):**
   - Har bir panel o'z foydalanuvchisiga mos: Admin uchun zich jadvallar, Haydovchi uchun esa tebranishda ham oson bosiladigan 60px lik tugmalar.

---

## 2. ASOSIY DIZAYN TOKENLARI (DESIGN TOKENS)

### 2.1. Ranglar Palitrasi (Color Palette & Semantic Tokens)

#### A. Neytrallar va Sirtlar (Canvas, Cards & Borders)
Barcha 4 ta panel uchun asosiy yuzalar:
| Token Nomi | Hex Kodi | Tailwind v4 Token | Izoh va Qo'llanilishi |
| :--- | :--- | :--- | :--- |
| `--canvas-bg` | `#F8FAFC` | `bg-slate-50` | Standart sahifa foni, ko'zga yumshoq sovuq neytral |
| `--surface-pure` | `#FFFFFF` | `bg-white` | Kartalar, modallar, yon panellar, ma'lumotlar jadvallari |
| `--surface-raised` | `#FFFFFF` | `bg-white shadow-sm` | Ko'tarilgan kartalar, kassa bloklari, dropdown menyular |
| `--surface-sunken` | `#F1F5F9` | `bg-slate-100` | Input foni, bo'sh holatlar (empty state), jadval sarlavhasi |
| `--surface-hover` | `#E2E8F0` | `bg-slate-200` | Sichqoncha ustiga borgandagi holat (hover) |
| `--border-hairline` | `#E2E8F0` | `border-slate-200` | Asosiy 1px toza chegaralar |
| `--border-strong` | `#CBD5E1` | `border-slate-300` | Faol inputlar, ajratuvchi vertikal chiziqlar |
| `--border-active` | `#0F172A` | `border-slate-900` | Fokus holati va qat'iy chegaralar |

#### B. Matn va Kontrast (Typography Colors)
| Token Nomi | Hex Kodi | Qo'llanilishi |
| :--- | :--- | :--- |
| `--text-primary` | `#0F172A` (Slate-900) | Sarlavhalar, tovar nomlari, yakuniy summa, asosiy matn |
| `--text-secondary` | `#334155` (Slate-700) | Texnik parametrlar, qator izohlari, filtr nomlari |
| `--text-muted` | `#64748B` (Slate-500) | Placeholder, yordamchi sana, o'lchov birliklari (`so'm/t`, `m²`) |
| `--text-disabled` | `#94A3B8` (Slate-400) | Nofaol elementlar, to'liq tugagan zaxiralar |
| `--text-inverted` | `#FFFFFF` | To'q tugmalar va status nishonlaridagi matn |

#### C. Asosiy Brend va Sanoat Ranglari (Brand Accents)
| Segment | Hex Kodi | Nom / Semantika | Vazifasi |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `#D95D1E` / `#C2410C` | `Safety Terracotta` | Asosiy harakat tugmalari (CTA), Savatga qo'shish, Yangi buyurtma |
| **Brand Hover** | `#B43B06` | `Terracotta Dark` | Tugma bosilgandagi / hover holati |
| **Brand Subtle** | `#FFF7ED` | `Terracotta Muted` | Brend nishonlari foni, tanlangan kategoriya foni |
| **Escrow Green** | `#059669` | `Veridian Vault` | 50/50 Escrow kafolati, Muvaffaqiyatli to'lov, Ombor qoldig'i yetarli |
| **Escrow Green Light**| `#ECFDF5` | `Emerald Ice` | Yashil nishonlar foni, xavfsizlik kafolati panellari |
| **Logistics Blue** | `#0284C7` | `Heavy Fleet Sky` | Transport holati (Yo'lda), GPS marshrut, Kamaz/HOWO/Isuzu tanlovi |
| **Logistics Blue Light**| `#F0F9FF` | `Sky Ice` | Transport tafsilotlari foni |
| **Warning / MOQ** | `#D97706` | `Industrial Amber` | Kam qolgan zaxira, MOQ minimal partiya ogohlantirishi |
| **Danger Crimson** | `#DC2626` | `Alert Crimson` | Nizo (Dispute), Rad etilgan buyurtma, E'tiroz, O'chirish |

---

### 2.2. Tipografiya Tizimi (Typography & Tabular Numerics)

1. **Display & Sarlavhalar:** `Plus Jakarta Sans`
   - Geometrik, jiddiy, professional arxitektura byurolari uslubida.
   - Sarlavhalar uchun: `-0.025em` tracking, 700 va 800 og'irlik (weight).
2. **Asosiy Matn va UI Elementlari:** `Inter` yoki `Plus Jakarta Sans`
   - 100% tiniq o'qiluvchanlik, xalqaro veb-standart.
   - 400 (Regular), 500 (Medium), 600 (Semi-bold).
3. **Raqamlar, Narxlar, STIR va Kodlar:** `JetBrains Mono`
   - B2B savdoda raqamlar doimo bir chiziqda turishi shart (`font-variant-numeric: tabular-nums`).
   - Narxlar: `1 250 000 UZS / tonna`, STIR: `308 123 456`, Qabul kodi: `849-201`.

#### Tipografiya Masshtabi (Scale):
* `text-display`: 36px / 44px (Hero sarlavhalar, marketing)
* `text-h1`: 28px / 36px (Panel asosiy sahifa sarlavhalari)
* `text-h2`: 22px / 28px (Bo'limlar va modullar sarlavhasi)
* `text-h3`: 18px / 24px (Karta va modal sarlavhalari)
* `text-body`: 14px / 20px (Standart matn, inputlar, jadvallar)
* `text-caption`: 12px / 16px (Nishonlar, parametr izohlari, sana)
* `text-micro`: 10px / 14px (STIR nishonlari, texnik kodlar)

---

### 2.3. Setka, Bo'shliqlar va Radiuslar (Spacing, Grid & Elevation)

* **Asosiy qadam:** `4px` bazaviy modul (4, 8, 12, 16, 20, 24, 32, 48, 64px).
* **Burchak radiuslari (Border Radius Hierarchy):**
  - `rounded-none` (0px): Maxsus arxitektura chizmalari, jadval to'r chiziqlari.
  - `rounded-lg` (8px): Inputlar, kichik tugmalar, jadval ichidagi nishonlar.
  - `rounded-xl` (12px): Standart tugmalar, dropdownlar, kichik kartalar.
  - `rounded-2xl` (16px): Asosiy mahsulot kartalari, modallar, kassa panellari.
  - `rounded-full` (9999px): Status nishonlari (Badges), avatarlar.
* **Soyalar (Elevation):**
  - Hech qanday og'ir, loyqa kiberpank soyalar ishlatilmaydi.
  - `shadow-xs`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)` (Inputlar va oddiy kartalar).
  - `shadow-sm`: `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)`.
  - `shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)` (Hover va kassa drayveri).
  - `shadow-lg`: `0 10px 15px -3px rgba(15, 23, 42, 0.08)` (Modallar va buyurtma cheki).

---

## 3. 4 TA MAHSULOT YO'NALISHI BO'YICHA MAXSUS UI/UX QOIDALARI

BunkerStroy katalogidagi 4 ta kategoriya har xil xarid xulq-atvoriga ega. Dizayn tizimi har biriga moslashgan maxsus axborot arxitekturasini (Information Architecture) talab qiladi:

### 3.1. Tashqi Qurilish (Heavy Structural & Shell)
* **Mahsulotlar:** Gazoblok (D500/D600), sement M400/M500, po'lat armatura (A500C, Ø12–Ø32), pishiq g'isht, tom yopish / profnastil, yog'och & brus.
* **UX Xususiyatlari:**
  - **Asosiy ko'rsatkichlar:** Og'irlik (tonna), hajm (m³), dona va poddon/bog'lam nisbati.
  - **Sertifikat Muhrlari:** GOST 31108, O'zDSt 990:2008, seysmik chidamlilik darajasi.
  - **MOQ (Minimal buyurtma):** Bosh sahifaning o'zida yirik aks ettiriladi (masalan, `Minimal buyurtma: 5 tonna` yoki `1 fura (22t)`).
  - **Transport Sig'imi Integratsiyasi:** Miqdor oshishi bilan avtomatik HOWO / Shacman mashinalari soni chiqadi (`Yuk og'irligi: 18 tonna → 1 ta HOWO samosvaliga to'liq sig'adi`).

### 3.2. Ichki Qurilish (Finishing & Surfaces)
* **Mahsulotlar:** Kafel & granit, travertin, dekorativ suvoq, gipsokarton, bo'yoq, oboy.
* **UX Xususiyatlari:**
  - **Maydon Hisoblagichi (m² Calculator):** Xaridor devor yoki pol o'lchamini (masalan, 4m x 6m) kiritganda, tizim 10% zaxira (kesishdagi yo'qotish) qo'shib, kerakli qutilar sonini hisoblaydi.
  - **Vizual Tekstura va Rang:** Yuqori aniqlikdagi tekstura zoom (mat/glyanes, relyef), kafel partiyasi (partiya raqami bir xil bo'lishi ogohlantirishi).
  - **Texnik Belgilar:** Suvga chidamlilik, sirpanish klassi (R9–R12), yeyilishga chidamlilik (PEI III, IV).

### 3.3. Uy Ta'mirlash (Interiors, MEP & Fixtures)
* **Mahsulotlar:** Mebel & furnitura, LED yoritish, santexnika, isitish radiatorlari va qozonlar.
* **UX Xususiyatlari:**
  - **O'lchamlar va Ergonomika:** Chizmalar, ulanish diametrlari (1/2", 3/4"), quvvat (Vatt, kVt).
  - **Kafolat va Xizmat Nishoni:** 3–5 yillik rasmiy zavod kafolati, bepul o'rnatish imkoniyati.
  - **Kombinatsiya Bloklari (Cross-sell):** Santexnika tanlanganda mos fitinglar, quvurlar va germetiklar blokini birga taklif qilish ("Ushbu mahsulotga kerak bo'ladi").

### 3.4. Texnik Uskunalar (Power Tools & Jobsite Equipment)
* **Mahsulotlar:** Professional elektr asboblar (perforator, bolgarka, svarka apparatlari), beton qorgichlar, usta anjomlari, maxsus himoya kiyimlari.
* **UX Xususiyatlari:**
  - **Brend Kafolati:** Bosch, DeWalt, Makita, Ingco rasmiy dilerlik muhrlari.
  - **Texnik Taqqoslash (Compare Matrix):** Bir vaqtning o'zida 3 ta asbobni quvvati, akkumulyator sig'imi va zarba kuchi bo'yicha taqqoslash.
  - **Komplektatsiya Ro'yxati:** Qutida nimalar borligi (chamadon, 2 ta akkumulyator, quvvatlagich, patron).

---

## 4. 4 TA EKOSISTEMA PANELLARI BO'YICHA UX/UI SPETSIFIKATSIYASI

### 4.1. `apps/web` (Bunkerstroy.uz — Vitrina, B2B/B2C Marketplace, Smeta)
* **Vazifasi:** Har qanday foydalanuvchi (oddiy usta, uy egasi yoki yirik xarid direktori) uchun oson, ishonchli va tezkor xarid vitrinasi.
* **UX Arxitekturasi:**
  1. **Dual Rejim O'tkazgich (B2C Chakana / B2B Ulgurji):**
     - Yuqori paneldagi bitta tugma orqali butun vitrina moslashadi.
     - *B2C rejim:* Chiroyli rasmlar, 1 qop/1 dona narxi, kartada 100% to'lov.
     - *B2B rejim:* Zavod narxi (tonna/m³), STIR orqali shartnoma, 50/50 Escrow to'lov, hisob-faktura.
  2. **Dual-View Katalog (Grid vs Smeta Matritsasi):**
     - **Visual Grid:** Katta sifatli fotosuratlar, brend, sertifikat nishoni, tezkor savat tugmasi.
     - **Matrix Table (Pudratchilar va ustalar uchun):** Barcha sement va armatura toifalari bir jadvalda. Sichqonchasiz faqat `Tab` va `Enter` bilan tonna kiritiladi, narx avtomatik jamlanadi.
  3. **Interaktiv Smeta Kalkulyatori:**
     - Xaridor o'z obyektini kiritadi (masalan, 2 qavatli kottej yoki 100 m² xonadon).
     - Tizim poydevor, devor va tom uchun zarur sement, g'isht, armatura va profnastil hajmini taxminiy smeta qilib chiqaradi va 1 tugma bilan savatga to'playdi.
  4. **To'lov Tanlovi va Escrow Ishonch Bloki:**
     - Savat bosqichida mijozga shaffof tanlov beriladi: "100% to'lov" (2% keshbek bilan) YOKI "50% depozit + 50% yuk tushirilganda".
     - Yonida rasmiy tushuntirish: *«Pulingiz BunkerStroy Escrow xavfsiz hisobida muzlatiladi. Yukni qabul qilib, kod bilan tasdiqlamaguningizcha pul sotuvchiga o'tmaydi»*.

---

### 4.2. `apps/seller` (Seller.bunkerstroy.uz — Zavod va Do'kon B2B POS/CRM, Ombor)
* **Vazifasi:** Qurilish mollari do'koni va yirik zavod menejeri uchun ombor, savdo, kassa va yetkazib berish boshqaruvi.
* **UX Arxitekturasi:**
  1. **Yagona Onlayn + Oflayn Kassa (Hybrid POS/CRM):**
     - Oflayn xaridor do'konga kelganda tezkor chek urish (`POS rejim`).
     - Onlayn kelgan buyurtmalar alohida bildirishnoma bilan ko'rinadi (`BunkerStroy Online`).
     - Yagona umumiy ombor qoldig'i: do'kondan sement sotilsa, onlayndagi qoldiq bir zumda kamayadi.
  2. **Narx Zinapoyasi va MOQ Boshqaruvi:**
     - Sotuvchi mahsulot qo'shayotganda mustaqil ravishda hajmli chegirma belgilaydi:
       - `1 – 5 tonna`: 1 200 000 so'm
       - `6 – 20 tonna`: 1 150 000 so'm
       - `20+ tonna`: 1 080 000 so'm
       - `MOQ (Minimal buyurtma)`: 2 tonna.
  3. **Buyurtmalar Oqimi va Tezkor Harakatlar (Workflow):**
     - `Yangi (Taymer bilan 15 daqiqa)` ➡️ `Tasdiqlandi` ➡️ `Omborda yig'ilmoqda` ➡️ `Yuklandi (Haydovchiga topshirildi)` ➡️ `Yetkazildi va Mablag' yechildi`.
  4. **Escrow va Moliya Paneli:**
     - Shaffof kassa taqsimoti:
       - *Escrow'dagi pul (Mijoz to'lagan, hali yetkazilmagan)*: 45 000 000 UZS.
       - *Hisobga tushgan (Bankka yechishga tayyor)*: 128 500 000 UZS.
       - *Platforma komissiyasi*: 2% (aniq ko'rsatilgan).
  5. **Master-Detail Slide-Over Drawer:**
     - Tovarni tahrirlash yoki buyurtma tafsilotini ko'rish uchun yangi sahifaga o'tilmaydi. O'ng tomondan 600px li toza panel ochiladi.

---

### 4.3. `apps/admin` (Admin.bunkerstroy.uz — Boshqaruv, STIR, Moliya, Logistika)
* **Vazifasi:** Ekosistema boshqaruvchilari uchun xavfsiz, ma'lumotlarga boy (data-dense) va to'liq audit qilinadigan nazorat markazi.
* **UX Arxitekturasi:**
  1. **Monoxrom Minimalizm (Swiss Enterprise Clean):**
     - Ko'zni charchatuvchi ortiqcha ranglar yo'q. Oq-qora fon, 1px aniq chegaralar, faqat xavf va muvaffaqiyat holatlarida rangli nuqtalar (status dots).
  2. **5 Asosiy Ishchi Bo'lim (Tasdiqlangan Yon Menyu):**
     - **Monitoring (KPI):** Bugungi aylanma, faol buyurtmalar, yo'ldagi yuklar, ochiq nizolar soni.
     - **Ta'minotchilar:** Yangi ro'yxatdan o'tgan korxonalar navbati, STIR/INN avtomatik solishtiruvi (Davlat Soliq Qo'mitasi ma'lumotlari: QQS to'lovchi, korxona holati, direktori), E-IMZO bosh kelishuvi.
     - **Hamkorlar va Integratsiyalar:** To'lov tizimlari (Payme, Click, Bank Escrow), Eskiz SMS, Soliq STIR API va GPS provayderining jonli holati (yashil/qizil indikator).
     - **Logistika Dispecherligi:** Tayinlanmagan buyurtmalar ro'yxati, yaqin atrofdagi bo'sh HOWO/Isuzu mashinalari, yo'nalishlar xaritasi.
     - **Xavfsizlik va Audit Loglar:** Qat'iy o'zgartirib bo'lmaydigan jurnallar: har bir operatsiya (`Operator ID`, `IP manzil`, `Amal`, `Eski qiymat -> Yangi qiymat`).
  3. **Ikki Kishi Qoidasi (Two-Man Rule for Escrow Release):**
     - 50 000 000 so'mdan yuqori qaytarimlar yoki maxsus o'tkazmalar uchun bir vaqtning o'zida operator va bosh moliyachi tasdig'i talab qilinadi.
  4. **Klaviatura Navigatsiyasi:** `Ctrl+K` global qidiruv, `Esc` barcha modallarni yopish, jadvallarda tezkor saralash.

---

### 4.4. `apps/driver` (Driver.bunkerstroy.uz — Mobil PWA, Kamaz/HOWO/Isuzu Haydovchilari)
* **Vazifasi:** Og'ir yuk mashinalari haydovchilari uchun yo'lda, kabinada, chang va tebranish sharoitida bir qo'l bilan boshqariladigan PWA ilovasi.
* **UX Arxitekturasi:**
  1. **Quyosh Nuri va Tebranishga Chidamli Ergonomika:**
     - 100% yuqori kontrastli UI (Ochiq kunda qora matn oq fonda, tunda chuqur xavfsiz rejim).
     - Barcha bosiladigan tugmalar balandligi kamida **56px – 64px** (qo'lqop bilan ham bosish oson).
  2. **Chiziqli 4 Bosqichli Jarayon (Linear Workflow):**
     - Haydovchi oldida faqat bitta asosiy harakat tugmasi turadi:
       - 1-qadam: `[ 🏢 Omborda yuklashga yetib bordim ]`
       - 2-qadam: `[ 📸 Yuklandi — Hujjat va Yuk fotosuratini olish ]`
       - 3-qadam: `[ 🚛 Manzilga yetib bordim ]`
       - 4-qadam: `[ 🔢 6 xonali Qabul Kodini kiritish ]`
  3. **50/50 Rejimdagi To'lov Kutish Taymeri:**
     - Haydovchi manzilga borganda ekranda 15 daqiqalik kutish taymeri yonadi: *"Mijoz ikkinchi 50% to'lovni tasdiqlashi kutilmoqda"*.
     - Agar mijoz naqd to'lamoqchi bo'lsa yoki ilovadan to'lay olmasa, haydovchi bitta tugma bilan ekranda to'lov QR-kodini ochib beradi.
  4. **Katta Raqamli PIN Keypad:**
     - Qabul kodini kiritish uchun tizim klaviaturasi emas, ekranning pastki qismida katta bankomat tugmalari uslubidagi raqamlar paneli (`1 2 3 ...`).
  5. **Mijoz va Dispecherga Tezkor Qo'ng'iroq:**
     - Bir marta bosish bilan mijoz yoki zavod omborchisi bilan to'g'ridan-to'g'ri telefon aloqasi.

---

## 5. TIJORIY VA HUQUQIY QOIDALAR UX OQIMLARI

### 5.1. Narx Zinapoyasi va MOQ (Minimal Partiya)
1. **Vitrinadagi Taqdimot:**
   Mahsulot sahifasida dinamik kalkulyator blok mavjud:
   - Input: `[ 15 ] tonna`
   - O'ng tomonda hisoblangan narx: `1 150 000 UZS / t` (tejalgan summa: `750 000 UZS`).
2. **MOQ Cheklovi (Validation UX):**
   - Agar xaridor MOQ dan kam miqdor kiritsa (masalan, g'isht uchun minimal 5 000 dona bo'lsa-yu, 2 000 kiritilsa), input chegarasi nozik ambra rangiga aylanadi va tushuntirish chiqadi:
   - *"Ushbu zavod uchun minimal partiya 5 000 dona. Kichik hajmda xarid qilish uchun chakana bo'limimizga o'ting"*.

### 5.2. To'lov Tizimi: 100% vs 50/50 Escrow Mexanikasi
| To'lov Usuli | Xarid Jarayoni | Buyurtma Holati | Xavfsizlik Kafolati |
| :--- | :--- | :--- | :--- |
| **A: 100% To'liq Onlayn** | Mijoz Payme / Click / Bank orqali 100% to'laydi. | `PAID` ➡️ Ta'minotchi qabul qiladi ➡️ Haydovchi oladi ➡️ Kod bilan topshiriladi. | Pul Escrow'da turadi, qabul qilingach sotuvchiga tushadi. |
| **B: 50% Depozit + 50% Yetganda** | 50% avans onlayn yechiladi. Yuk manzilga yetib borganda ikkinchi 50% to'lanadi. | `PARTIALLY_PAID` ➡️ Yetib kelganda mijozga SMS va bildirishnoma ➡️ To'liq to'langach `FULLY_PAID` ➡️ Qabul kodi ochiladi. | Haydovchi qabul kodisiz yukni tushirmaydi. Mijoz to'lamasa, yuk qaytadi, avansdan transport xarajati ushlanadi. |

* **Qabul Kodi UX Qoidasi:**
  - 6 xonali qabul kodi mijoz kabinetida faqat ikkinchi 50% to'lov muvaffaqiyatli amalga oshgandan so'ng paydo bo'ladi.
  - Haydovchi kodni kiritgandan keyin mahsulot "Topshirildi" maqomiga o'tadi va sotuvchining hisobiga pul ochiladi.

### 5.3. 12 Viloyat Logistika Kalkulyatori va Yuklama Ko'rsatkichi
1. **O'zbekiston Bo'ylab 12 Ta Viloyat:**
   - Toshkent shahri va viloyati, Samarqand, Buxoro, Navoiy, Farg'ona, Andijon, Namangan, Qashqadaryo, Surxondaryo, Jizzax, Sirdaryo, Xorazm, Qoraqalpog'iston.
2. **Ta'minotchi Transporti vs BunkerStroy Logistika Tarmog'i:**
   - Xaridor buyurtma berishda tanlaydi:
     - `1. Ta'minotchi o'zi yetkazadi` (Sotuvchi belgilagan hududiy tarif bo'yicha).
     - `2. BunkerStroy yuk avtoparki` (PostGIS bo'yicha eng yaqin karyerdan hisoblangan aniq km narxi).
3. **Yuk Mashinasi To'lish Vizualizatori (Truck Payload Bar):**
   - Savat sahifasida HOWO (25t) yoki Isuzu (10t) mashinasining vizual silueti va to'lish foizi ko'rinadi:
   - `[████████████░░░░] 68% to'ldi (17 / 25 tonna)`.
   - Tavsiya: *"Yana 8 tonna sement yoki ohak qo'shsangiz, transport xarajati mahsulot tannarxida 32% ga arzonlashadi"*.

---

## 6. KOMPONENTLAR STANDARTI (`@bunkerstroy/ui`)

Monorepodagi barcha 4 ilova yagona `@bunkerstroy/ui` komponentlar to'plamidan foydalanadi:

### 6.1. Tugmalar (`Button`)
* **Primary (Terracotta CTA):**
  - Rang: `bg-[#D95D1E] hover:bg-[#B43B06] text-white font-semibold shadow-xs`.
  - Radiusi: `rounded-xl`.
  - Bo'ylari: `sm: h-9 px-3.5`, `md: h-11 px-5`, `lg: h-13 px-6` (Mobil va haydovchi uchun).
* **Secondary (Slate Outline):**
  - Rang: `bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-xs`.
* **Ghost (Minimal):**
  - Rang: `hover:bg-slate-100 text-slate-700`.
* **Danger (Bekor qilish va nizo):**
  - Rang: `bg-red-50 hover:bg-red-100 text-red-700 border border-red-200`.

### 6.2. Karta va Konteynerlar (`Card`)
* Fon: `bg-white`, chegara: `border border-slate-200`.
* Soya: `shadow-xs hover:shadow-sm transition-shadow`.
* Radiusi: `rounded-2xl` (16px).
* **Taqiqlangan:** Boltlar, metall gradientlar, qorong'i ko'k fonga sariq matnlar.

### 6.3. Nishonlar (`Badge`)
Kichik, toza ma'lumot elchisi (`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide`):
* **Escrow Himoyasi:** `bg-emerald-50 text-emerald-800 border border-emerald-200/80` (Qulf belgisi bilan).
* **Zavod STIR Tasdiqlangan:** `bg-blue-50 text-blue-800 border border-blue-200/80` (Gerb/Check belgisi bilan).
* **MOQ / Chegirma:** `bg-orange-50 text-orange-800 border border-orange-200/80`.
* **Kutish / Jarayonda:** `bg-amber-50 text-amber-800 border border-amber-200/80`.
* **Xato / Bekor:** `bg-rose-50 text-rose-800 border border-rose-200/80`.

### 6.4. Ma'lumotlar Jadvali (`Table`)
* Sarlavha satri: `bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200`.
* Qatorlar: Balandligi 44px–48px, `hover:bg-slate-50/75 transition-colors border-b border-slate-100`.
* Raqamli ustunlar: Har doim o'ngga tekislangan (`text-right font-mono tabular-nums`).

### 6.5. Qidiruv va Inputlar (`Input`, `Select`)
* Oq fon (`bg-white`), 1px yupqa chegara (`border-slate-200`).
* Fokus holati: `focus:border-[#D95D1E] focus:ring-4 focus:ring-[#D95D1E]/10 outline-none`.
* Matn o'lchami: Mobil qurilmalarda avto-zoom bo'lmasligi uchun kamida `16px`.

---

## 7. TAILWIND CSS V4 KONFIGURATSIYASI VA KOD SHABLONI

Ushbu spetsifikatsiya Tailwind CSS v4 `@theme` arxitekturasi bilan to'liq mos keladi. Barcha ilovalardagi `index.css` uchun yagona shablon:

```css
@import "tailwindcss";

@theme {
  /* Tipografiya */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-heading: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Asosiy Sirtlar va Neytrallar */
  --color-canvas: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F1F5F9;
  --color-surface-muted: #E2E8F0;
  
  --color-border-subtle: #E2E8F0;
  --color-border-strong: #CBD5E1;
  --color-border-focus: #0F172A;

  /* Matn Ranglari */
  --color-text-primary: #0F172A;
  --color-text-secondary: #334155;
  --color-text-muted: #64748B;
  --color-text-inverted: #FFFFFF;

  /* Sanoat va Brend Aksentlari */
  --color-brand-primary: #D95D1E;
  --color-brand-hover: #B43B06;
  --color-brand-subtle: #FFF7ED;

  /* Funksional Status Ranglari */
  --color-escrow: #059669;
  --color-escrow-subtle: #ECFDF5;
  --color-logistics: #0284C7;
  --color-logistics-subtle: #F0F9FF;
  --color-warning: #D97706;
  --color-warning-subtle: #FFFBEB;
  --color-danger: #DC2626;
  --color-danger-subtle: #FEF2F2;
}

@layer base {
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background-color: var(--color-canvas);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
    font-variant-numeric: tabular-nums;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    letter-spacing: -0.02em;
    font-weight: 700;
  }

  code, kbd, samp, pre, .font-mono {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
  }
}

/* Yordamchi Sanoat Klasslari */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}

.touch-target-driver {
  min-height: 56px;
  min-width: 56px;
}
```

---

## 8. MIGRATSIYA REJASI VA TAVSIYALAR

Eski loyihani yangi dizayn tizimiga og'riqsiz o'tkazish uchun 4 bosqichli amaliy reja:

1. **1-Bosqich: Paket darajasida tozalash (`packages/ui`):**
   - `packages/ui/src/industrial.css` dagi sun'iy vintlar (`.industrial-rivet`), qora-sariq lentalar (`.hazard-stripe-sm`) va eski to'q ko'k ranglarni tozalash.
   - Yuqoridagi toza `@theme` tokenlarini `packages/ui` ga kiritish.
2. **2-Bosqich: `apps/web` (Marketplace & Smeta) vitrinasini yangilash:**
   - Qorong'i fonlardan xalos bo'lib, oq va sovuq marmar fonga o'tish.
   - Mahsulot kartalarini 4 toifa bo'yicha boyitish (GOST nishoni, tonna kalkulyatori, 50/50 to'lov bloki).
3. **3-Bosqich: `apps/seller` va `apps/admin` boshqaruv panellarini o'tkazish:**
   - 1C va Excel o'rnini bosa oladigan yuqori kontrastli, oq sirtli jadvallarni o'rnatish.
   - Master-detail yon panelini (SlideOverDrawer) standartlashtirish.
4. **4-Bosqich: `apps/driver` mobil PWA ilovasida kontrast va tugma o'lchamlarini tekshirish:**
   - Haydovchi uchun 4 bosqichli katta tugmalar va bankomat uslubidagi PIN klaviaturasini faollashtirish.

---
*BunkerStroy Design Architecture — 2026. Barcha huquqlar himoyalangan.*
