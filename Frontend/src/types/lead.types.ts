
// Define lead types
export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  propertyType?: string;
  budget?: string;
  status: 'Nouveau lead' | 'Contacté' | 'Qualifié' | 'En négociation' | 'Vendu' | 'Perdu';
  source: string;
  createdAt: Date;
  lastContact?: Date;
  notes?: string;
  score?: number;
  assignedTo?: string;
  nextAction?: string;
  clientType?: 'Investisseur' | 'Acheteur' | 'Prospect';
  interestedProperty?: string;
  investmentCriteria?: string;
  formData?: Record<string, any>; // Pour stocker toutes les données du formulaire
}

export interface Client extends Lead {
  clientSince: Date;
  transactions?: Transaction[];
  accountManager?: string;
  preferences?: string[];
}

export interface Transaction {
  id: string;
  type: 'Achat' | 'Vente' | 'Location';
  propertyId?: string;
  propertyName: string;
  amount: number;
  date: Date;
  status: 'En cours' | 'Complétée' | 'Annulée';
}

export interface LeadContextType {
  leads: Lead[];
  clients: Client[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>, clientType?: 'Investisseur' | 'Acheteur' | 'Prospect', propertyInfo?: string) => Lead;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  moveLead: (leadId: string, newStatus: Lead['status']) => void;
  convertToClient: (leadId: string, clientType?: 'Investisseur' | 'Acheteur' | 'Prospect') => void;
  getLeadsByStatus: (status: Lead['status']) => Lead[];
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;
  getLeadById: (id: string) => Lead | undefined;
  getClientById: (id: string) => Client | undefined;
  getClientsByType: (type?: 'Investisseur' | 'Acheteur' | 'Prospect') => Client[];
}
