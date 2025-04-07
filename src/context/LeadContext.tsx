
import React, { createContext, useContext, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Lead, Client, LeadContextType } from '@/types/lead.types';
import { useLeadsState } from '@/hooks/useLeadsState';
import { useLeadOperations } from '@/hooks/useLeadOperations';

// Create the context
const LeadContext = createContext<LeadContextType | undefined>(undefined);

// Provider component
export const LeadProvider = ({ children }: { children: ReactNode }) => {
  const { leads, setLeads, clients, setClients } = useLeadsState();

  // Add a new lead with optional client type
  const addLead = (newLeadData: Omit<Lead, 'id' | 'createdAt'>, clientType?: 'Investisseur' | 'Acheteur' | 'Prospect', propertyInfo?: string) => {
    const leadId = `L${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const newLead: Lead = {
      id: leadId,
      ...newLeadData,
      createdAt: new Date(),
      lastContact: new Date(),
    };
    
    setLeads(prev => [...prev, newLead]);
    
    // Automatically add the lead to clients as well with the specified client type
    const clientId = `C${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const newClient: Client = {
      ...newLead,
      id: clientId,
      status: newLead.status,
      clientSince: new Date(),
      clientType: clientType || 'Prospect',
    };
    
    // Add property info based on client type
    if (clientType === 'Acheteur' && propertyInfo) {
      newClient.interestedProperty = propertyInfo;
    } else if (clientType === 'Investisseur' && propertyInfo) {
      newClient.investmentCriteria = propertyInfo;
    }
    
    setClients(prev => [...prev, newClient]);
    
    toast({
      title: "Nouveau lead et client ajoutés",
      description: `${newLead.name} a été ajouté à vos leads et à votre base clients en tant que ${clientType || 'Prospect'}.`,
    });
    
    return newLead;
  };

  // Import the rest of the lead operations from the separate hooks file
  const { 
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
  } = useLeadOperations({ leads, setLeads, clients, setClients });

  return (
    <LeadContext.Provider value={{
      leads,
      clients,
      addLead,
      updateLead,
      deleteLead,
      moveLead,
      convertToClient,
      getLeadsByStatus,
      updateClient,
      deleteClient,
      getLeadById,
      getClientById,
      getClientsByType,
    }}>
      {children}
    </LeadContext.Provider>
  );
};

// Custom hook to use the lead context
export const useLeads = (): LeadContextType => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
