import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Award,
  Microscope,
  CheckCircle2,
  Download,
  Building2,
  Scale,
  FileText,
  BadgeCheck,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import {
  Badge,
  Card,
  Button,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Alert,
  Modal
} from '@bunkerstroy/ui';

interface LabTestResult {
  id: string;
  material: string;
  parameter: string;
  standardNorm: string;
  actualResult: string;
  deviation: string;
  status: 'PASSED' | 'EXCELLENT';
  testLab: string;
  certNumber: string;
}

export const CertificationsView: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const labResults: LabTestResult[] = [
    {
      id: 'lab-1',
      material: 'Portlandshement M500 D0 (Qizilqum)',
      parameter: '28 kunlik siqilishga mustahkamlik',
      standardNorm: '≥ 49.0 MPa (GOST 31108)',
      actualResult: '52.4 MPa',
      deviation: '+6.9% ortiqcha zaxira',
      status: 'EXCELLENT',
      testLab: 'O‘zstandart Akkreditatsiyalangan Lab. №042',
      certNumber: 'UZ.SMT.01.442.2026-SEM'
    },
    {
      id: 'lab-2',
      material: 'Armatura A500C 16mm (Bekobod)',
      parameter: 'Oquvchanlik chegarasi (Yield Strength)',
      standardNorm: '≥ 500 N/mm² (GOST 5781)',
      actualResult: '542 N/mm²',
      deviation: '+8.4% mustahkamlik',
      status: 'EXCELLENT',
      testLab: 'Respublika Metall Sinov Markazi',
      certNumber: 'UZ.SMT.02.118.2026-MET'
    },
    {
      id: 'lab-3',
      material: 'Avtoklav Gazoblok D500 (Modul 5)',
      parameter: 'Issiqlik o‘tkazuvchanlik koeffitsiyenti (λ)',
      standardNorm: '≤ 0.14 W/(m·K) (ShNQ 2.01.04)',
      actualResult: '0.118 W/(m·K)',
      deviation: '15% yuqori issiqlik saqlash',
      status: 'PASSED',
      testLab: 'Qurilish Fizikasi Ilmiy Tadqiqot Lab.',
      certNumber: 'UZ.SMT.04.502.2026-GAZ'
    },
    {
      id: 'lab-4',
      material: 'Bazalt Mineral Plitalar 100mm (TermoPlast)',
      parameter: 'Yong‘inga chidamlilik darajasi',
      standardNorm: 'Yonmaydigan material (NG sinfi)',
      actualResult: 'NG (1000°C gacha erimaydi)',
      deviation: 'To‘liq yonmaslik standarti',
      status: 'EXCELLENT',
      testLab: 'Favqulodda Vaziyatlar Vazirligi Sinov Markazi',
      certNumber: 'FVV-YONG‘IN-2026-098'
    },
    {
      id: 'lab-5',
      material: 'Pishgan G‘isht M125 (Zangiota)',
      parameter: 'Sovuqqa chidamlilik (Frost Resistance)',
      standardNorm: '≥ F35 tsikl (GOST 530)',
      actualResult: 'F50 tsikl',
      deviation: '+42% sovuqqa bardoshlilik',
      status: 'PASSED',
      testLab: 'Toshkent Viloyat Qurilish Lab.',
      certNumber: 'UZ.SMT.03.882.2026-GSH'
    }
  ];

  const standardsList = [
    {
      code: 'GOST 31108-2020',
      title: 'Umumiy qurilish sementlari uchun texnik shartlar',
      desc: 'Sementning minerologik tarkibi, qotish tezligi va sulfatga chidamliligi bo‘yicha majburiy davlat talablari.'
    },
    {
      code: 'GOST 5781-82 / ASTM A615',
      title: 'Temir-beton konstruksiyalar uchun issiq haddalangan po‘lat',
      desc: 'A500C va A600C markali armaturalarning kimyoviy tarkibi va payvandlanuvchanlik xususiyatlari.'
    },
    {
      code: 'ShNQ 2.01.04-18',
      title: 'Qurilish issiqlik texnikasi (Qurilish Vazirligi)',
      desc: 'Binolarning energiya samaradorligi, devor qatlamlarining minimal issiqlik qarshiligi me’yorlari.'
    },
    {
      code: 'O‘zDSt ISO 9001:2015',
      title: 'Sifat menejmenti tizimi',
      desc: 'Barcha hamkor zavodlar va logistika operatorlari xalqaro sifat kafolati sertifikatiga ega.'
    }
  ];

  const handleOpenDownload = (docName: string) => {
    setSelectedDoc(docName);
    setDownloadModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <Badge variant="warning" isMono className="gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Sifat Boshqaruvi & Davlat Standartlari
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Laboratoriya Sinov Xulosalari & GOST Muvofiqlik Kafolati
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Har bir partiya sement, armatura va qorishmalar O‘zbekiston Respublikasi Qurilish Vazirligi hamda akkreditatsiyalangan davlat laboratoriyalarining sinov dalolatnomalari bilan ta’minlanadi.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="GOST & O‘zDSt Standarti"
          value="100%"
          subtitle="Barcha mahsulotlar sertifikatlangan"
          trend={{ value: 'Davlat nazorati', isPositive: true }}
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="amber"
        />
        <StatCard
          title="Sinov Laboratoriyalari"
          value="4 ta"
          subtitle="Akkreditatsiyalangan mustaqil markazlar"
          trend={{ value: 'Har bir partiya sinovdan o‘tadi', isPositive: true }}
          icon={<Microscope className="w-5 h-5" />}
          variant="cyan"
        />
        <StatCard
          title="Sement Siqilish Mustahkamligi"
          value="52.4"
          unit="MPa"
          subtitle="M500 D0 markasi (norma: ≥49 MPa)"
          trend={{ value: '+6.9% ortiqcha zaxira', isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          variant="green"
        />
        <StatCard
          title="Yuridik Kafolat"
          value="E-IMZO"
          subtitle="Soliq STIR va 12% QQS fakturalari"
          trend={{ value: '100% qonuniy kuch', isPositive: true }}
          icon={<Scale className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* 3. Laboratory Test Results Table */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Microscope className="w-5 h-5 text-orange-600" />
              So‘nggi Partiyalar Bo‘yicha Rasmiy Laboratoriya Sinovlari (Oktabr 2026)
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Sinovlar bosim ostida deformatsiya, cho‘zilish va issiqlik o‘tkazuvchanlik sinov stendlarida o‘tkazilgan.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleOpenDownload('Barcha Sinov Bayonnomalari (ZIP/PDF)')}
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Sinov Xulosalarini Yuklash</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mahsulot & Ishlab Chiqaruvchi</TableHead>
              <TableHead>Tekshirilgan Parametr</TableHead>
              <TableHead>Davlat Standart Normasi</TableHead>
              <TableHead>Haqiqiy Laboratoriya Natijasi</TableHead>
              <TableHead>Xulosa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {labResults.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-slate-900">
                  <div>{item.material}</div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    Lab: {item.testLab}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-700">
                  {item.parameter}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-600">
                  {item.standardNorm}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-slate-900">
                  <div>{item.actualResult}</div>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    {item.deviation}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="success" size="sm" isMono dot>
                    TASDIQLANDI (PASSED)
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* 4. State Standards Grid */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-orange-600" />
          Majburiy Texnik Shartlar va Qoidalar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standardsList.map((std, idx) => (
            <Card key={idx} className="p-5 space-y-2 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between">
                <Badge variant="warning" size="sm" isMono>
                  {std.code}
                </Badge>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{std.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{std.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. Legal Guarantee Callout */}
      <Alert
        variant="info"
        title="100% Yuridik va Moliyaviy Himoya"
        description="BunkerStroy platformasidagi har bir yetkazib berish Davlat Soliq Qo‘mitasi (DSQ) elektron hisob-fakturalari (DIDX.uz) hamda E-IMZO raqamli kaliti orqali qonuniy kuchga ega bo‘ladi. To‘lovlar faqat tovar obyektda qabul qilingandan so‘ng yopiladi."
      />

      {/* Download Certificate Modal */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Rasmiy Laboratoriya Sinov Bayonnomasini Yuklab Olish"
        subtitle={selectedDoc || undefined}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={() => setDownloadModalOpen(false)}>
              Yopish
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert("Sertifikat va sinov dalolatnomalari paketi PDF formatida yuklab olindi.");
                setDownloadModalOpen(false);
              }}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>PDF Hujjatni Saqlash</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            Ushbu hujjatlar to‘plami O‘zbekiston Respublikasi Qurilish Vazirligi akkreditatsiyasidan o‘tgan sinov laboratoriyasining rasmiy muhri va E-IMZO QR-kodi bilan tasdiqlangan.
          </p>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
            <div><strong className="text-slate-800">Hujjat turi:</strong> Laboratoriya Sinov Bayonnomasi & Sifat Pasporti</div>
            <div><strong className="text-slate-800">Format:</strong> PDF (Raqamli muhr bilan)</div>
            <div><strong className="text-slate-800">Qamrov:</strong> Sement M500, Armatura A500C, Gazoblok D500, Bazalt NG</div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
