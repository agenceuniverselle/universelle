
import { useState, useEffect } from 'react';
import { Lead, Client } from '@/types/lead.types';
import { initialLeads } from '@/data/mockLeads';
import { initialClients } from '@/data/mockClients';

export const useLeadsState = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const savedLeads = localStorage.getItem('crm-leads');
    return savedLeads ? JSON.parse(savedLeads, (key, value) => {
      if (key === 'createdAt' || key === 'lastContact') return new Date(value);
      return value;
    }) : initialLeads;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('crm-clients');
    return savedClients ? JSON.parse(savedClients, (key, value) => {
      if (key === 'createdAt' || key === 'lastContact' || key === 'clientSince') 
        return new Date(value);
      return value;
    }) : initialClients;
  });

  // Save to localStorage whenever leads or clients change
  useEffect(() => {
    localStorage.setItem('crm-leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm-clients', JSON.stringify(clients));
  }, [clients]);

  return { leads, setLeads, clients, setClients };
};
