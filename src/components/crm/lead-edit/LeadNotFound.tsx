
import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface LeadNotFoundProps {
  navigate: NavigateFunction;
}

export const LeadNotFound = ({ navigate }: LeadNotFoundProps) => {
  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-500">Lead non trouvé</CardTitle>
        <CardDescription>
          Le lead que vous recherchez n&apos;existe pas ou a été supprimé.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/crm')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au CRM
        </Button>
      </CardFooter>
    </Card>
  );
};
