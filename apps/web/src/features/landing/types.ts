import React from 'react';

export interface ProductCategoryItem {
  id: string;
  title: string;
  badge: string;
  tagline: string;
  itemsSummary: string;
  itemTags: string[];
  icon: React.ElementType;
  color: string;
  bgLight: string;
}

export interface UserSegmentItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  keyPoints: string[];
  targetAudience: string;
  icon: React.ElementType;
  accent: string;
}

export interface TradeModelItem {
  number: number;
  stepLabel: string;
  title: string;
  description: string;
  highlightText: string;
  badgeText: string;
  details: string[];
  icon: React.ElementType;
  accentColor: string;
}

export interface CrmFeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
  icon: React.ElementType;
  accentColor: string;
}

export interface DeliveryFeatureItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: string;
  icon: React.ElementType;
  accentColor: string;
}

export interface ConcreteCalculationResult {
  volume: number;
  totalCementBags: number;
  totalCementTons: number;
  totalSandM3: number;
  totalGravelM3: number;
  approxTotalUzs: number;
}

export interface PartnerLeadFormData {
  fullName: string;
  phoneNumber: string;
  businessType: 'zavod' | 'market' | 'usta' | 'xaridor';
  region: string;
  notes?: string;
}
