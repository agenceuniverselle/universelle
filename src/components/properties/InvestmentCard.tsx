
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/context/PropertiesContext';
import { 
  MapPin, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Building, 
  Home, 
  Briefcase, 
  Luggage,
  FileText,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import InvestmentDetailDialog from './InvestmentDetailDialog';
import InvestmentForm from './InvestmentForm';

interface InvestmentCardProps {
  property: Property;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({ property }) => {
  const { investmentDetails } = property;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [investFormOpen, setInvestFormOpen] = useState(false);
  
  const getInvestmentTypeIcon = (type?: string) => {
    switch (type) {
      case 'Résidentiel':
        return <Home className="h-4 w-4" />;
      case 'Commercial':
        return <Briefcase className="h-4 w-4" />;
      case 'Touristique':
        return <Luggage className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Pré-commercialisation':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pré-commercialisation</Badge>;
      case 'En cours':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">En cours</Badge>;
      case 'Terminé':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Terminé</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Non défini</Badge>;
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            <Badge variant="secondary" className="flex items-center gap-1 bg-white/90">
              {getInvestmentTypeIcon(investmentDetails?.type)}
              {investmentDetails?.type || "Non spécifié"}
            </Badge>
            {getStatusBadge(investmentDetails?.projectStatus)}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-semibold text-lg truncate">{property.title}</h3>
            <div className="flex items-center text-white/80 text-sm">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Prix</span>
              <span className="font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-600" />
                {property.price}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Rentabilité</span>
              <span className="font-medium flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {investmentDetails?.returnRate || property.return || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Durée recommandée</span>
              <span className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-600" />
                {investmentDetails?.recommendedDuration || "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Prix d'entrée</span>
              <span className="font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-gray-600" />
                {investmentDetails?.minEntryPrice || property.price}
              </span>
            </div>
          </div>
          
          {investmentDetails?.financingEligibility && (
            <div className="bg-green-50 rounded-md p-2 mb-4 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-700">Éligible aux financements spéciaux</span>
            </div>
          )}
          
          {investmentDetails?.partners && investmentDetails.partners.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Partenaires:</p>
              <div className="flex flex-wrap gap-2">
                {investmentDetails.partners.map((partner, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {partner}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 bg-gray-50 border-t flex justify-between gap-2">
          <Button 
            variant="outline" 
            className="w-full group hover:bg-white hover:text-luxe-blue hover:border-luxe-blue transition-all"
            onClick={() => setDetailsOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Plus d'infos
            <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button 
            className="w-full bg-luxe-blue hover:bg-luxe-blue/90 transition-all hover:shadow-md"
            onClick={() => setInvestFormOpen(true)}
          >
            Investir
          </Button>
        </CardFooter>
      </Card>

      {/* Detail Dialog */}
      <InvestmentDetailDialog 
        property={property}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Investment Form Dialog */}
      <InvestmentForm
        property={property}
        open={investFormOpen}
        onOpenChange={setInvestFormOpen}
      />
    </>
  );
};

export default InvestmentCard;
