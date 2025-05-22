// ✅ types/Property.ts
export interface InvestmentDetails {
  investmentType?: string;
  investmentValue?: number;
  returnRate?: number;
  minEntryPrice?: number;
  recommendedDuration?: string;
  financingEligibility?: boolean;
  partners?: string[];
  documents?: string[];
  projectStatus?: string;

}

export interface InvestmentProperty {
  id: number;
  title: string;
  type: string;
  location?: string;
  price?: number;
  status?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  isFeatured?: boolean;
  images?: string[];
  created_at?: string;
  updated_at?: string;
  isDraft?: boolean; 
  investmentDetails?: InvestmentDetails;
}
