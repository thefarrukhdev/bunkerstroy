import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './sections/HeroSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { AudienceSection } from './sections/AudienceSection';
import { TradeModelSection } from './sections/TradeModelSection';
import { CrmSection } from './sections/CrmSection';
import { DeliverySection } from './sections/DeliverySection';
import { ConcreteCalculatorSection } from './sections/ConcreteCalculatorSection';
import { PartnerCallToActionSection } from './sections/PartnerCallToActionSection';

interface LandingViewProps {
  onNavigateToCatalog: () => void;
  onOpenAuth?: () => void;
}

/**
 * BunkerStroy B2B & B2C Marketplace Landing Page
 * Production-ready modular architecture decomposed into single-responsibility sections.
 */
export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToCatalog
}) => {
  const navigate = useNavigate();

  const handleNavigateToSellerPanel = () => {
    navigate('/seller-panel');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8 text-slate-100 font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Asosiy Hero & Platforma Taqdimoti */}
      <HeroSection
        onNavigateToCatalog={onNavigateToCatalog}
        onNavigateToSellerPanel={handleNavigateToSellerPanel}
      />

      {/* 2. Assortiment & 4 Asosiy Qurilish Yo'nalishi */}
      <CategoriesSection onNavigateToCatalog={onNavigateToCatalog} />

      {/* 3. B2B & B2C Ekotizim Ishtirokchilari */}
      <AudienceSection
        onNavigateToCatalog={onNavigateToCatalog}
        onNavigateToSellerPanel={handleNavigateToSellerPanel}
      />

      {/* 4. Kafolatlangan Savdo Modeli & 50/50 Escrow */}
      <TradeModelSection />

      {/* 5. Onlayn va Oflayn Savdo Uchun Zamonaviy CRM */}
      <CrmSection onNavigateToSellerPanel={handleNavigateToSellerPanel} />

      {/* 6. Respublika Bo'ylab Yetkazib Berish & Logistika */}
      <DeliverySection />

      {/* 7. Ustalar Uchun Poydevor & Beton Smeta Kalkulyatori */}
      <ConcreteCalculatorSection onNavigateToCatalog={onNavigateToCatalog} />

      {/* 8. Hamkorlikka Taklif & Interaktiv Ariza Topshirish */}
      <PartnerCallToActionSection onNavigateToCatalog={onNavigateToCatalog} />
    </div>
  );
};
