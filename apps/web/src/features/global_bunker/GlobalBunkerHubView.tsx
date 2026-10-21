import React from 'react';
import { Globe, Train, ShieldCheck, Container, FileText } from 'lucide-react';
import { Badge, Card, Button } from '@bunkerstroy/ui';

export const GlobalBunkerHubView: React.FC = () => {
  const partners = [
    {
      id: 'gp-1',
      name: 'Heidelberg Materials AG',
      country: 'Germaniya (DE)',
      category: 'Sement Klinkeri & Maxsus Bog‘lovchilar',
      materials: ['Portlandshement M600-D0', 'Sulfatga chidamli klinker'],
      capacity: '25,000 tonna / oy',
      transitTime: '12-16 kun',
      deliveryMethod: 'Temir yo‘l hopper vagonlari',
      certified: 'ISO 9001, EN 197-1'
    },
    {
      id: 'gp-2',
      name: 'POSCO Steel Corporation',
      country: 'Janubiy Koreya (KR)',
      category: 'Konstruksion Metall & Yuqori Markali Armatura',
      materials: ['Armatura A500C / A600C', 'Dvuhtavr (Beam)'],
      capacity: '18,000 tonna / oy',
      transitTime: '18-22 kun',
      deliveryMethod: 'Multimodal (Dengiz + TY Container)',
      certified: 'ASTM A615, KS D 3504'
    },
    {
      id: 'gp-3',
      name: 'Saint-Gobain Weber',
      country: 'Fransiya (FR)',
      category: 'Izolyatsiya & Akustik Qoplamalar',
      materials: ['Bazalt mineral plitalar', 'Fasad namlik to‘siqlari'],
      capacity: '12,000 kv.m / oy',
      transitTime: '10-14 kun',
      deliveryMethod: 'TIR Avto-fura va TY vagon',
      certified: 'CE Mark, ISO 14001'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-bunker-border-strong bg-gradient-to-r from-bunker-surface-1 via-bunker-surface-2 to-[#2B2313] p-6 sm:p-10 shadow-2xl">
        <div className="h-1.5 w-full hazard-stripe-sm absolute top-0 left-0" />
        <div className="max-w-3xl space-y-3">
          <Badge variant="info" className="gap-1.5 font-mono">
            <Globe className="w-3.5 h-3.5" />
            Global Bunker — Xalqaro Ta'minot Zanjirlari
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-black text-bunker-text-primary tracking-tight">
            To'g'ridan-to'g'ri xorijiy ishlab chiqaruvchilardan import
          </h1>
          <p className="text-sm text-bunker-text-secondary leading-relaxed">
            Yirik infratuzilma loyihalari uchun Germaniya, Janubiy Koreya, Turkiya va MDH davlatlaridan temir yo‘l va multimodal konteyner orqali kafolatlangan yetkazib berish.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {partners.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="warning">{p.country}</Badge>
                <span className="text-[11px] font-mono text-bunker-text-muted flex items-center gap-1">
                  <Train className="w-3 h-3 text-bunker-amber-500" />
                  {p.transitTime}
                </span>
              </div>

              <div>
                <h3 className="font-black text-bunker-text-primary text-lg">{p.name}</h3>
                <p className="text-xs text-bunker-amber-500 font-mono mt-0.5">{p.category}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-bunker-border-subtle text-xs text-bunker-text-secondary font-mono">
                <div><span className="text-bunker-text-muted">Yetkazish turi:</span> {p.deliveryMethod}</div>
                <div><span className="text-bunker-text-muted">Ta'minot quvvati:</span> {p.capacity}</div>
                <div><span className="text-bunker-text-muted">Sertifikat:</span> {p.certified}</div>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="w-full">
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>B2B Shartnoma So'rash</span>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
