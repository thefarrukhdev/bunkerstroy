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
 * BunkerStroy B2B/B2C Landing Page Container
 * Architecturally decomposed into atomic, single-responsibility slide sections
 * mapped directly to the partner presentation (admin.pdf).
 */
export const LandingView: React.FC<LandingViewProps> = ({
  onNavigateToCatalog
}) => {
  const navigate = useNavigate();

  const handleNavigateToSellerPanel = () => {
    navigate('/seller-panel');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-2 sm:py-6 text-slate-100 font-sans">
      {/* Slide 1: Bosh Slayd & Hero Platforma */}
      <HeroSection
        onNavigateToCatalog={onNavigateToCatalog}
        onNavigateToSellerPanel={handleNavigateToSellerPanel}
      />

      {/* Slide 2: Platformada Nimalar Sotiladi */}
      <CategoriesSection onNavigateToCatalog={onNavigateToCatalog} />

      {/* Slide 3: Platformadan Kimlar Foydalanadi */}
      <AudienceSection
        onNavigateToCatalog={onNavigateToCatalog}
        onNavigateToSellerPanel={handleNavigateToSellerPanel}
      />

      {/* Slide 4: Savdo Modeli */}
      <TradeModelSection />

      {/* Slide 5: Onlayn va Oflayn Savdo Uchun CRM Tizimi */}
      <CrmSection onNavigateToSellerPanel={handleNavigateToSellerPanel} />

      {/* Slide 6: Yetkazib Berish Shartlari */}
      <DeliverySection />

      {/* Interaktiv Poydevor & Beton Kalkulyatori Vidjeti */}
      <ConcreteCalculatorSection onNavigateToCatalog={onNavigateToCatalog} />

      {/* Slide 7: Platformada Birinchilardan Bo‘ling & Start 07.11.2026 */}
      <PartnerCallToActionSection onNavigateToCatalog={onNavigateToCatalog} />
    </div>
  );
};
