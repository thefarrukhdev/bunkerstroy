import React from 'react';

export interface ProductCategoryItem {
  id: string;
  title: string;
  items: string;
  badge: string;
  icon: React.ElementType;
  color: string;
  bgLight: string;
}

export interface UserSegmentItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  keyPoints: string[];
  icon: React.ElementType;
  accent: string;
}

export interface TradeModelItem {
  number: number;
  title: string;
  description: string;
  highlightText: string;
  badgeText: string;
  icon: React.ElementType;
  accentColor: string;
}

export interface CrmFeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
}

export interface DeliveryFeatureItem {
  title: string;
  description: string;
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
