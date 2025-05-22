export type Bien = {
  id: number;
  title: string;
  type: string;
  status: string;
  price: string;
  location: string;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  isFeatured?: boolean;
  available_date?: string;
  images?: string[]; // URLs enregistrées
  newImages?: File[];
replacedImages?: { index: number; file: File }[];
  documents?: string[];
  newDocuments?: File[];
  is_draft?: boolean;

  // Champs supplémentaires
  construction_year?: string;
  condition?: string;
  exposition?: string;
  cuisine?: string;
  has_parking?: string;
  parking_places?: string;
  climatisation?: string;
  terrasse?: string;
  points_forts?: string[];
  occupation_rate?: string;
  estimated_valuation?: string;
  estimated_charges?: string;
  monthly_rent?: string;
  quartier?: string;
  proximite?: string[];
  map_link?: string;

  // Propriétaire
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  owner_nationality?: string;
  owner_documents?: string[];
  newOwnerDocuments?: File[];

  // Autres infos (si nécessaire dans ton front)
  created_at?: string;
  assignedAgent?: string;
};
