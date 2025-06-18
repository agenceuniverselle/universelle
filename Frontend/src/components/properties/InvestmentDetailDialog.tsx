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
import { toast } from 'sonner';

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
  Info,
  Bath,
  Bed,
  Ruler,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { toast as toastSonner } from 'sonner';
import ConseillerForm from './ConseillerForm';
import InvestmentForm from './InvestmentForm';
const formatPrice = (value: number | string | undefined | null) => {
  if (!value) return "N/A";
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('fr-FR').format(number);
};

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
  const { investmentDetails } = property;
  const [isConseillerFormOpen, setIsConseillerFormOpen] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState<number | null>(null);
  const { toast } = useToast();
  const [investFormOpen, setInvestFormOpen] = useState(false);
  // Nouvel état pour l'image principale affichée
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Initialise l'image principale au montage du composant si des images sont disponibles
  React.useEffect(() => {
    if (property.images && property.images.length > 0) {
      setMainImage(
        typeof property.images[0] === 'string'
          ? property.images[0]
          : property.images[0].url
      );
    } else {
      setMainImage(null); // Réinitialiser si pas d'images
    }
  }, [property.images]);

  const handleOpenConseillerForm = () => {
    // Assure-toi que property.id a une valeur et est un nombre
    console.log('Property ID when opening Conseiller Form:', property.id); // Ajoute ce log
    setCurrentPropertyId(Number(property.id)); // Conversion explicite en nombre
    setIsConseillerFormOpen(true);
  };

  const handleCloseConseillerForm = (openConseiller: boolean) => {
    setIsConseillerFormOpen(openConseiller);
    if (!openConseiller) {
      setCurrentPropertyId(null);
      // Optionnel: Si tu veux fermer le dialogue principal après la soumission du conseiller
      // onOpenChange(false);
    }
  };
  // État pour gérer le téléchargement
  const [isDownloading, setIsDownloading] = useState(false);

  const getImageUrl = (imagePath: string): string => {
  if (!imagePath)
    return 'https://via.placeholder.com/600x400?text=Image+indisponible';

  return imagePath.startsWith('http')
    ? imagePath
    : `https://back-qhore.ondigitalocean.app/${imagePath}`;
};


  // Fonction de téléchargement
const handleDownload = async (
  propertyId: number,
  documentIndex: number,
  filename: string
) => {
  try {
    const response = await fetch(
      `https://back-qhore.ondigitalocean.app/api/download/${propertyId}/${documentIndex}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Le téléchargement a échoué. Vérifie que le document existe.');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);

    toast({
      title: 'Téléchargement en cours',
      description: `${filename} a été lancé.`,
    });
  } catch (error) {
    toast({
      title: 'Erreur de téléchargement',
      description: (error as Error).message,
      variant: 'destructive',
    });
    console.error('Erreur:', error);
  }
};



  const handleDownloadBrochure = () => {
    toast({
      title: 'Téléchargement démarré',
      description: 'La brochure sera bientôt disponible dans vos téléchargements.',
    });
    // Simulation d'un téléchargement - dans une vraie app, ceci serait un lien vers le PDF
    setTimeout(() => {
      toast({
        title: 'Téléchargement terminé',
        description: 'La brochure a été téléchargée avec succès.',
      });
    }, 1500);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Pré-commercialisation':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Pré-commercialisation
          </Badge>
        );
      case 'En cours':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            En cours
          </Badge>
        );
      case 'Terminé':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Terminé
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Non défini
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white dark:bg-white text-gray-800 dark:text-gray-800">
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
              {mainImage ? (
                <img
                  src={getImageUrl(mainImage)}
                  alt={`Image principale`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/600x400?text=Image+indisponible';
                  }}
                />
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Info className="h-6 w-6 text-gray-400" />
                  <span className="text-gray-500 ml-2">Aucune image disponible</span>
                </div>
              )}
            </div>

            {/* Autres images dans la grille */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => {
                  const imageUrl =
                    typeof image === 'string' ? getImageUrl(image) : getImageUrl(image.url);
                  return (
                    <div
                      key={typeof image === 'object' && image.id ? image.id : index}
                      className="aspect-square rounded-md bg-gray-100 flex items-center justify-center hover:opacity-90 cursor-pointer"
                      onClick={() =>
                        setMainImage(
                          typeof property.images[index] === 'string'
                            ? property.images[index]
                            : property.images[index].url
                        )
                      }
                    >
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/300x300?text=Image+indisponible';
                        }}
                      />
                    </div>
                  );
                })
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
                  <Wallet className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Prix d'entrée minimum</span>
                </div>
                <span className="font-medium">
  {formatPrice(investmentDetails?.minEntryPrice || property.price)} MAD
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  <span className="text-gray-700">Rendement estimé</span>
                </div>
                <span className="font-medium text-green-600">
                  {investmentDetails?.returnRate || property.return} %
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Durée recommandée</span>
                </div>
                <span className="font-medium">{investmentDetails?.recommendedDuration || 'N/A'} Ans</span>
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Caractéristiques du bien */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h3 className="text-lg font-semibold">Caractéristiques du bien</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 mr-2 text-luxe-blue" />
                  <span className="text-gray-700">Superficie</span>
                </div>
                <span className="font-medium">{property.area} m²</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Badge className="h-5 w-5 mr-2 bg-luxe-blue" />
                  <span className="text-gray-700">Statut</span>
                </div>
                <span className="font-medium">{property.status}</span>
              </div>

              {Number(property.bedrooms) > 0 && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-luxe-blue" />
                    <span className="text-gray-700">Chambres</span>
                  </div>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}

              {Number(property.bathrooms) > 0 && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-luxe-blue" />
                    <span className="text-gray-700">Salles de bain</span>
                  </div>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="w-full lg:w-1/2 space-y-4">
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
        </div>

        <Separator className="my-4" />

      {property.documents && property.documents.length > 0 && (
  <>
    <Separator className="my-4" />
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Documents disponibles</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {property.documents[0] && (
          <Button
            variant="outline"
            className="flex items-center justify-between"
            onClick={() => handleDownload(property.id, 0, 'Brochure_complète.pdf')}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Brochure complète
            </div>
            <Download className="h-4 w-4 ml-2" />
          </Button>
        )}

        {property.documents[1] && (
          <Button
            variant="outline"
            className="flex items-center justify-between"
            onClick={() => handleDownload(property.id, 1, 'Plans_détaillés.pdf')}
          >
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Plans détaillés
            </div>
            <Download className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  </>
)}
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
            onClick={handleOpenConseillerForm}
          >
            Contacter un conseiller
          </Button>
          <ConseillerForm
            open={isConseillerFormOpen}
            onOpenChange={handleCloseConseillerForm}
            propertyId={currentPropertyId}
          />

          <Button
            className="w-full sm:w-auto bg-gold hover:bg-gold-dark"
            onClick={(e) => {
              e.stopPropagation();
              setInvestFormOpen(true);
            }}
          >
            Investir maintenant
          </Button>
          {/* Investment Form Dialog */}
          <InvestmentForm
            property={property}
            open={investFormOpen}
            onOpenChange={setInvestFormOpen}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentDetailDialog;
