
import { toast } from "@/components/ui/use-toast";
import { Lead, Client } from '@/types/lead.types';

interface LeadOperationsProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export const useLeadOperations = ({ leads, setLeads, clients, setClients }: LeadOperationsProps) => {
  
  // Update a lead
  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...updates, lastContact: new Date() } : lead
    ));
    
    toast({
      title: "Lead mis à jour",
      description: "Les modifications ont été enregistrées.",
    });
  };

  // Delete a lead
  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    
    toast({
      title: "Lead supprimé",
      description: "Le lead a été supprimé avec succès.",
    });
  };

  // Move a lead to a different status
  const moveLead = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus, lastContact: new Date() } : lead
    ));
    
    toast({
      title: "Statut mis à jour",
      description: `Le lead a été déplacé vers "${newStatus}".`,
    });
  };

  // Convert a lead to a client with optional client type
  const convertToClient = (leadId: string, clientType?: 'Investisseur' | 'Acheteur' | 'Prospect') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    const clientId = `C${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const newClient: Client = {
      ...lead,
      id: clientId,
      status: 'Vendu',
      clientSince: new Date(),
      clientType: clientType || 'Acheteur',
    };
    
    setClients(prev => [...prev, newClient]);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    
    toast({
      title: "Lead converti en client",
      description: `${lead.name} a été converti en client ${clientType || 'Acheteur'} avec succès.`,
    });
  };

  // Get leads by status
  const getLeadsByStatus = (status: Lead['status']) => {
    return leads.filter(lead => lead.status === status);
  };

  // Get clients by type
  const getClientsByType = (type?: 'Investisseur' | 'Acheteur' | 'Prospect') => {
    if (!type) return clients;
    return clients.filter(client => client.clientType === type);
  };

  // Update a client
  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, ...updates, lastContact: new Date() } : client
    ));
    
    toast({
      title: "Client mis à jour",
      description: "Les modifications ont été enregistrées.",
    });
  };

  // Delete a client
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
    
    toast({
      title: "Client supprimé",
      description: "Le client a été supprimé avec succès.",
    });
  };

  // Get a lead by ID
  const getLeadById = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  // Get a client by ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  return {
    updateLead,
    deleteLead,
    moveLead,
    convertToClient,
    getLeadsByStatus,
    updateClient,
    deleteClient,
    getLeadById,
    getClientById,
    getClientsByType
  };
};
