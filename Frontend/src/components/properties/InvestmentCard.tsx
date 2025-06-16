import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
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
  ExternalLink,
  Wallet,
  ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Lazy loading des composants lourds
const InvestmentDetailDialog = lazy(() => import('./InvestmentDetailDialog'));
const InvestmentForm = lazy(() => import('./InvestmentForm'));

interface InvestmentCardProps {
  property: Property;
  priority?: boolean; // Pour les images prioritaires (above the fold)
}

// Composant d'image optimisé avec lazy loading
const OptimizedImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onError: () => void;
}> = ({ src, alt, className, priority = false, onError }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative w-full h-full">
      {/* Placeholder pendant le chargement */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={cn(
          className,
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />
    </div>
  );
};

const InvestmentCard: React.FC<InvestmentCardProps> = ({ 
  property, 
  priority = false 
}) => {
  const { investmentDetails } = property;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [investFormOpen, setInvestFormOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Mémoisation de l'URL de l'image pour éviter les recalculs
  const firstImageUrl = useMemo(() => {
    if (!property.images || property.images.length === 0) return '';
    
    const firstImage = property.images[0];
    const imagePath = typeof firstImage === 'string' ? firstImage : firstImage.url;
    
    if (!imagePath) return '';
    
    return imagePath.startsWith('http')
      ? imagePath
      : `http://localhost:8000/${imagePath}`;
  }, [property.images]);

  // Mémoisation des icônes pour éviter les re-rendus
  const investmentTypeIcon = useMemo(() => {
    switch (investmentDetails?.investmentType) {
      case 'Résidentiel':
        return <Home className="h-4 w-4" />;
      case 'Commercial':
        return <Briefcase className="h-4 w-4" />;
      case 'Touristique':
        return <Luggage className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  }, [investmentDetails?.investmentType]);

  // Mémoisation du badge de statut
  const statusBadge = useMemo(() => {
    const status = investmentDetails?.projectStatus;
    
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
        return status ? (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Non défini
          </Badge>
        ) : null;
    }
  }, [investmentDetails?.projectStatus]);

  // Callbacks optimisés pour éviter les re-rendus
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleCardClick = useCallback(() => {
    setDetailsOpen(true);
  }, []);

  const handleDetailsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDetailsOpen(true);
  }, []);

  const handleInvestClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setInvestFormOpen(true);
  }, []);

  // Mémoisation des données affichées pour éviter les recalculs
  const displayData = useMemo(() => ({
    hasPrice: Boolean(property.price),
    hasReturn: Boolean(investmentDetails?.returnRate || property.return),
    hasDuration: Boolean(investmentDetails?.recommendedDuration),
    hasMinEntry: Boolean(investmentDetails?.minEntryPrice),
    hasFinancing: Boolean(investmentDetails?.financingEligibility),
    hasPartners: Boolean(investmentDetails?.partners?.length),
    hasLocation: Boolean(property.location),
    hasTitle: Boolean(property.title),
    hasInvestmentType: Boolean(investmentDetails?.investmentType)
  }), [property, investmentDetails]);

  return (
    <>
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Section Image optimisée */}
        <div className="relative h-48 w-full overflow-hidden">
          {firstImageUrl && !imageError ? (
            <OptimizedImage
              src={firstImageUrl}
              alt={property.title || 'Propriété d\'investissement'}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              priority={priority}
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Image indisponible</p>
              </div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Badges en haut */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            {displayData.hasInvestmentType && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-white/90">
                {investmentTypeIcon}
                {investmentDetails.investmentType}
              </Badge>
            )}
            {statusBadge}
          </div>
          
          {/* Titre et localisation */}
          <div className="absolute bottom-3 left-3 right-3">
            {displayData.hasTitle && (
              <h3 className="text-white font-semibold text-lg truncate">
                {property.title}
              </h3>
            )}
            {displayData.hasLocation && (
              <div className="flex items-center text-white/80 text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{property.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contenu optimisé */}
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {displayData.hasPrice && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Prix</span>
                <span className="font-medium flex items-center">
                  <Wallet className="h-4 w-4 mr-1 text-gray-600" />
                  {property.price} MAD
                </span>
              </div>
            )}
            
            {displayData.hasReturn && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Rentabilité</span>
                <span className="font-medium flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {investmentDetails?.returnRate || property.return} %
                </span>
              </div>
            )}
            
            {displayData.hasDuration && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Durée recommandée</span>
                <span className="font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-600" />
                  {investmentDetails.recommendedDuration} Ans
                </span>
              </div>
            )}
            
            {displayData.hasMinEntry && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Prix d'entrée</span>
                <span className="font-medium flex items-center">
                  <Wallet className="h-4 w-4 mr-1 text-gray-600" />
                  {investmentDetails?.minEntryPrice || property.price} MAD
                </span>
              </div>
            )}
          </div>

          {/* Éligibilité financement */}
          {displayData.hasFinancing && (
            <div className="bg-green-50 rounded-md p-2 mb-4 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-700">
                Éligible aux financements spéciaux
              </span>
            </div>
          )}

          {/* Partenaires */}
          {displayData.hasPartners && (
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

        {/* Footer optimisé */}
        <CardFooter className="p-4 bg-gray-50 border-t flex justify-between gap-2">
          <Button
            variant="outline"
            className="w-full group hover:bg-white hover:text-luxe-blue hover:border-luxe-blue transition-all"
            onClick={handleDetailsClick}
          >
            <FileText className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Plus d'infos
            <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button
            className="w-full bg-luxe-blue hover:bg-luxe-blue/90 transition-all hover:shadow-md"
            onClick={handleInvestClick}
          >
            Investir
          </Button>
        </CardFooter>
      </Card>

      {/* Dialogs avec lazy loading */}
      {detailsOpen && (
        <Suspense fallback={<div className="loading-spinner" />}>
          <InvestmentDetailDialog
            property={property}
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
          />
        </Suspense>
      )}
      
      {investFormOpen && (
        <Suspense fallback={<div className="loading-spinner" />}>
          <InvestmentForm
            property={property}
            open={investFormOpen}
            onOpenChange={setInvestFormOpen}
          />
        </Suspense>
      )}
    </>
  );
};

// Export avec React.memo pour éviter les re-rendus inutiles
export default React.memo(InvestmentCard, (prevProps, nextProps) => {
  // Comparaison personnalisée pour optimiser les re-rendus
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.priority === nextProps.priority &&
    JSON.stringify(prevProps.property.investmentDetails) === JSON.stringify(nextProps.property.investmentDetails)
  );
});
