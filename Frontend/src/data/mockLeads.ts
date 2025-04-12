
import { Lead } from "@/types/lead.types";

// Initial mock data for leads
export const initialLeads: Lead[] = [
  {
    id: 'L001',
    name: 'Émilie Laurent',
    email: 'emilie.laurent@example.com',
    phone: '+212 6 12 34 56 78',
    propertyType: 'Appartement 3 pièces',
    budget: '450,000 MAD',
    status: 'Nouveau lead',
    source: 'Site web',
    createdAt: new Date(),
    lastContact: new Date(),
    score: 85,
    nextAction: 'Appel de qualification',
  },
  {
    id: 'L002',
    name: 'Marc Dubois',
    email: 'marc.dubois@example.com',
    phone: '+212 6 23 45 67 89',
    propertyType: 'Villa avec piscine',
    budget: '2,500,000 MAD',
    status: 'Contacté',
    source: 'Référence',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    score: 65,
    nextAction: 'Envoyer documentation',
  },
  {
    id: 'L003',
    name: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    phone: '+212 6 34 56 78 90',
    propertyType: 'Duplex moderne',
    budget: '820,000 MAD',
    status: 'Qualifié',
    source: 'Salon immobilier',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastContact: new Date(Date.now() - 5 * 60 * 60 * 1000),
    score: 90,
    nextAction: 'Planifier visite',
  }
];
