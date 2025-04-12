
import React, { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save } from 'lucide-react';
import { useLeads } from '@/context/LeadContext';
import { Lead } from '@/types/lead.types';
import { toast } from '@/components/ui/use-toast';
import { LeadFormFields } from './LeadFormFields';
import { LeadScoreSlider } from './LeadScoreSlider';

interface LeadEditFormProps {
  lead: Lead;
  id: string;
  navigate: NavigateFunction;
}

export const LeadEditForm = ({ lead, id, navigate }: LeadEditFormProps) => {
  const { updateLead } = useLeads();
  
  const [formData, setFormData] = useState({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    propertyType: lead.propertyType || '',
    budget: lead.budget || '',
    status: lead.status || 'Nouveau lead',
    source: lead.source || '',
    notes: lead.notes || '',
    score: lead.score || 0,
    nextAction: lead.nextAction || '',
    assignedTo: lead.assignedTo || '',
    clientType: lead.clientType || 'Prospect',
    interestedProperty: lead.interestedProperty || '',
    investmentCriteria: lead.investmentCriteria || '',
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleScoreChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, score: value[0] }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      updateLead(id, {
        ...formData,
        lastContact: new Date(),
      });
      
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Lead mis à jour",
          description: "Les modifications ont été enregistrées avec succès.",
          variant: "default",
        });
        navigate(`/admin/crm/lead/${id}`);
      }, 500);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du lead:', error);
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du lead.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier les informations du lead</CardTitle>
        <CardDescription>
          Mettez à jour les détails et informations de suivi de ce lead.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <LeadFormFields 
            formData={formData} 
            handleChange={handleChange} 
            handleSelectChange={handleSelectChange} 
          />
          
          <LeadScoreSlider 
            score={formData.score} 
            handleScoreChange={handleScoreChange} 
          />
          
          <div>
            <Label htmlFor="nextAction">Prochaine action</Label>
            <Input
              id="nextAction"
              name="nextAction"
              value={formData.nextAction}
              onChange={handleChange}
              placeholder="Ex: Appeler le 15/05 pour visite"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={5}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate(`/admin/crm/lead/${id}`)}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              className="bg-luxe-blue hover:bg-luxe-blue/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
