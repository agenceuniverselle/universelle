
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Property } from '@/context/PropertiesContext';
import { 
  MapPin, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Building, 
  Calendar,
  FileText,
  Download,
  CheckCircle2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface InvestmentDetailDialogProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestmentDetailDialog: React.FC<InvestmentDetailDialogProps> = ({
  property,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { investmentDetails } = property;
  const ImageUrl = property.images.length > 0 ? `http://localhost:8000/${property.images}` : undefined;
// Fonction pour télécharger le document

// Fonction pour télécharger le document
const [isDownloading, setIsDownloading] = useState(false); // Un état pour gérer le téléchargement

// Fonction de téléchargement
const handleDownload = (propertyId, documentIndex) => {
  if (isDownloading) return; // Empêche le double clic si le téléchargement est déjà en cours

  setIsDownloading(true); // Marquer le téléchargement comme en cours

  fetch(`http://localhost:8000/api/download/${propertyId}/${documentIndex}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du document');
      }
      return response.blob(); // Récupérer le fichier
    })
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = documentIndex === 0 ? 'Brochure_complète.pdf' : 'Plans_détaillés.pdf';
      link.click();
    })
    .catch((error) => {
      console.error('Erreur de téléchargement', error);
    })
    .finally(() => {
      setIsDownloading(false); // Réinitialiser l'état du téléchargement
    });
};


  const handleDownloadBrochure = () => {
    toast({
      title: "Téléchargement démarré",
      description: "La brochure sera bientôt disponible dans vos téléchargements.",
    });
    // Simulation d'un téléchargement - dans une vraie app, ceci serait un lien vers le PDF
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "La brochure a été téléchargée avec succès.",
      });
    }, 1500);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
          <DialogDescription className="flex items-center text-base mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
            <span className="mx-2">•</span>
            {getStatusBadge(investmentDetails?.projectStatus)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
  <div className="space-y-4">
    {/* Première image affichée en grand */}
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      {property.images.length > 0 ? (
        <img
          src={`http://localhost:8000/${property.images[0]}`} // Première image
          alt={`Image 1`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <Info className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>

    {/* Autres images dans la grille */}
    <div className="grid grid-cols-2 gap-3">
      {property.images.length > 1 ? (
        property.images.slice(1).map((imagePath, index) => (
          <div
            key={index}
            className="aspect-square rounded-md bg-gray-100 flex items-center justify-center hover:opacity-90 cursor-pointer"
          >
            <img
              src={`http://localhost:8000/${imagePath}`} // Construire l'URL avec l'URL de ton serveur
              alt={`Image ${index + 2}`} // Commencer à compter les images à partir de 2
              className="w-full h-full object-cover"
            />
          </div>
        ))
      ) : (
        <div className="aspect-square rounded-md bg-gray-100 flex items-center justify-center">
          <Info className="h-6 w-6 text-gray-400" />
        </div>
      )}
    </div>
  </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Détails de l'investissement</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Prix d'entrée minimum</span>
                </div>
                <span className="font-medium">{investmentDetails?.minEntryPrice || property.price}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-gray-700">Rendement estimé</span>
                </div>
                <span className="font-medium text-green-600">{investmentDetails?.returnRate || property.return}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Durée recommandée</span>
                </div>
                <span className="font-medium">{investmentDetails?.recommendedDuration || "N/A"}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Type d'investissement</span>
                </div>
                <span className="font-medium">{investmentDetails?.type || property.type}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Date de mise en marché</span>
                </div>
                <span className="font-medium">{property.createdAt}</span>
                
              </div>
            </div>

            {investmentDetails?.financingEligibility && (
              <div className="bg-green-50 rounded-md p-3 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm text-green-700">Éligible aux financements spéciaux</span>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {property.description || 
              "Ce projet d'investissement immobilier offre une opportunité exceptionnelle d'obtenir un rendement stable et attractif. Situé dans un emplacement stratégique avec un fort potentiel de croissance, ce bien représente un choix judicieux pour les investisseurs cherchant à diversifier leur portefeuille immobilier."}
          </p>
          
          {investmentDetails?.partners && investmentDetails.partners.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Partenaires:</h4>
              <div className="flex flex-wrap gap-2">
                {investmentDetails.partners.map((partner, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {partner}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Documents disponibles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center justify-between" 
              onClick={() => handleDownload(Number(property.id), 0)} // Pass the actual propertyId and document index
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Brochure complète
              </div>
              <Download className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-between"
              onClick={() => handleDownload(Number(property.id), 1)} // Pass the actual propertyId and document index
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Plans détaillés
              </div>
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
          <Button 
            className="w-full sm:w-auto bg-luxe-blue hover:bg-luxe-blue/90"
            onClick={() => {
              onOpenChange(false);
              toast({
                title: "Contacter un conseiller",
                description: "Un conseiller va vous contacter prochainement pour discuter de cet investissement.",
              });
            }}
          >
            Contacter un conseiller
          </Button>
          <Button 
            className="w-full sm:w-auto bg-gold hover:bg-gold-dark"
          >
            Investir maintenant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDetailDialog;
