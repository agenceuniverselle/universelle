
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Home, User } from 'lucide-react';

interface LeadFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    propertyType: string;
    budget: string;
    status: string;
    source: string;
    assignedTo: string;
    clientType?: string;
    interestedProperty?: string;
    investmentCriteria?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const LeadFormFields = ({ formData, handleChange, handleSelectChange }: LeadFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="source">Source</Label>
          <Select 
            value={formData.source} 
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Site web">Site web</SelectItem>
              <SelectItem value="Formulaire site">Formulaire site</SelectItem>
              <SelectItem value="Référence">Référence</SelectItem>
              <SelectItem value="Salon immobilier">Salon immobilier</SelectItem>
              <SelectItem value="Appel entrant">Appel entrant</SelectItem>
              <SelectItem value="Partenaire">Partenaire</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="clientType">Type de client</Label>
          <Select 
            value={formData.clientType || 'Prospect'} 
            onValueChange={(value) => handleSelectChange('clientType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Investisseur">
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                  Investisseur
                </div>
              </SelectItem>
              <SelectItem value="Acheteur">
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-green-600" />
                  Acheteur
                </div>
              </SelectItem>
              <SelectItem value="Prospect">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-600" />
                  Prospect
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="propertyType">Type de bien recherché</Label>
          <Input
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nouveau lead">Nouveau lead</SelectItem>
              <SelectItem value="Contacté">Contacté</SelectItem>
              <SelectItem value="Qualifié">Qualifié</SelectItem>
              <SelectItem value="En négociation">En négociation</SelectItem>
              <SelectItem value="Vendu">Vendu</SelectItem>
              <SelectItem value="Perdu">Perdu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="assignedTo">Responsable</Label>
          <Input
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          />
        </div>
        
        {formData.clientType === 'Investisseur' && (
          <div>
            <Label htmlFor="investmentCriteria">Critères d'investissement</Label>
            <Input
              id="investmentCriteria"
              name="investmentCriteria"
              value={formData.investmentCriteria || ''}
              onChange={handleChange}
              placeholder="Ex: Immobilier locatif, rendement 5%+"
            />
          </div>
        )}
        
        {formData.clientType === 'Acheteur' && (
          <div>
            <Label htmlFor="interestedProperty">Bien intéressé</Label>
            <Input
              id="interestedProperty"
              name="interestedProperty"
              value={formData.interestedProperty || ''}
              onChange={handleChange}
              placeholder="Ex: Villa à Marrakech"
            />
          </div>
        )}
      </div>
    </div>
  );
};
