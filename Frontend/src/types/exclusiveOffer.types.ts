
export interface ExclusiveOffer {
    id: number;
    property_id: number;
    current_value: number;
    monthly_rental_income: number;
    annual_growth_rate: number;
    duration_years: number;
    initial_investment?: number; // ✅ Propriété ajoutée
    property: {
    title: string;
    description: string;
    location?: string; // ✅ Propriété location ajoutée
    type?: string;       // ✅ Propriété ajoutée
    status?: string; 
    images?: string[]; // ✅ Propriété ajoutée

  };
  }
  