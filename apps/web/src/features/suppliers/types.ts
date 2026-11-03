export interface FactoryPartner {
  id: string;
  name: string;
  brandName: string;
  inn: string;
  region: string;
  address: string;
  category: 'sement' | 'metall' | 'gisht' | 'izolyatsiya';
  categoryLabel: string;
  annualCapacity: string;
  standards: string[];
  mainProducts: string[];
  director: string;
  phone: string;
  contractStatus: 'VERIFIED' | 'STRATEGIC_PARTNER';
  vatPayer: boolean;
  description: string;
}

export interface GlobalPartner {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  category: string;
  materials: string[];
  capacity: string;
  transitTime: string;
  deliveryMethod: string;
  customsStation: string;
}
