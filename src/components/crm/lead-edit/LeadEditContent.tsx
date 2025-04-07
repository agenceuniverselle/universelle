
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLeads } from '@/context/LeadContext';
import { toast } from '@/components/ui/use-toast';
import { LeadNotFound } from './LeadNotFound';
import { LeadEditForm } from './LeadEditForm';

export const LeadEditContent = () => {
  const { id } = useParams<{ id: string }>();
  const { getLeadById } = useLeads();
  const navigate = useNavigate();
  
  const lead = getLeadById(id || '');
  
  if (!lead) {
    return <LeadNotFound navigate={navigate} />;
  }
  
  const handleGoBack = () => {
    navigate(`/admin/crm/lead/${id}`);
  };
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux détails
        </Button>
      </div>
      
      <LeadEditForm lead={lead} id={id || ''} navigate={navigate} />
    </div>
  );
};
