
export interface BenefitRow {
  id: string;
  performance: string;
  discount: string;
}

export interface Card {
  id: string;
  name: string;
  condition: string;
  annualFee: string;
  applyUrl: string;
  imageUrl: string;
  benefits: BenefitRow[];
}
