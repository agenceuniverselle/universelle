import React, { useState, useEffect } from 'react';
import { AlertCircle, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Property } from '@/context/PropertiesContext'; // Import du type Property
import InvestmentDetailDialog from './properties/InvestmentDetailDialog';
import InvestmentForm from './properties/InvestmentForm';

interface ExclusiveOffer {
  id: number;
  property_id: number;
  current_value: number;
  monthly_rental_income: number;
  annual_growth_rate: number;
  duration_years: number;
  initial_investment: number;
  property: {
    id: number;
    title: string;
    description: string;
    images: string[];
    location: string;
    price: string;
    return: string;
    type: string;
    investmentType: string;
    area: number;
    status: string;
    bedrooms: number;
    bathrooms: number;
    created_at: string;
    date: string;
    returnRate?: string;
    partners?: string[];
    investmentDetails?: {
      minEntryPrice?: string;
      recommendedDuration?: string;
      returnRate?: string;
      type?: string;
      projectStatus?: string;
      financingEligibility?: boolean;
      partners?: string[];
      investmentType?: string;
    };
  };
}

const ExclusiveOffers = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, minutes: 0, seconds: 0 });
  const [offers, setOffers] = useState<ExclusiveOffer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInvestmentFormOpen, setIsInvestmentFormOpen] = useState(false);
  const [selectedPropertyForm, setSelectedPropertyForm] = useState<Property | null>(null);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // États pour le dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fonction pour formater les dates correctement - VERSION AMÉLIORÉE
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mois commence à 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // Fonction pour gérer les erreurs d'image
  const handleImageError = (offerId: number) => {
    setImageError(prev => ({ ...prev, [offerId]: true }));
  };

  // Fonction pour obtenir l'URL de l'image avec gestion d'erreur
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    return imagePath.startsWith('http')
      ? imagePath
      : `http://localhost:8000/${imagePath}`;
  };

  // Fonction pour créer un objet Property à partir d'une ExclusiveOffer
  const createPropertyFromOffer = (offer: ExclusiveOffer): Property => {
    let parsedPartners: string[] = [];
    if (offer.property.partners && typeof offer.property.partners === 'string') {
      try {
        // Attempt to parse the string as JSON
        parsedPartners = JSON.parse(offer.property.partners);
      } catch (e) {
        console.error("Erreur lors du parsing des partenaires:", e);
        // Fallback if parsing fails, e.g., if it's not valid JSON string
        // You might want to split by comma if it's a comma-separated string,
        // or just leave it empty. For now, defaulting to empty array.
        parsedPartners = [];
      }
    } else if (Array.isArray(offer.property.partners)) {
      // If it's already an array (good!), use it directly
      parsedPartners = offer.property.partners;
    }
    return {
      id: offer.property.id.toString(),
      title: offer.property.title,
      description: offer.property.description || '',
      images: offer.property.images.map((imagePath, index) => ({
        id: `${offer.property.id}-${index}`,
        url: imagePath
      })),
      location: offer.property.location,
      price: offer.property.price,
      return: offer.property.return,
      type: offer.property.investmentType,
      area: offer.property.area.toString(),
      status: offer.property.status,
      bedrooms: offer.property.bedrooms,
      bathrooms: offer.property.bathrooms,
      createdAt: formatDate(offer.property.created_at),
      investmentDetails: {
        type: (offer.property.investmentDetails?.type || offer.property.type) as 'Résidentiel' | 'Commercial' | 'Touristique',
        returnRate: offer.property.investmentDetails?.returnRate || offer.property.returnRate,
        minEntryPrice: offer.property.investmentDetails?.minEntryPrice || offer.property.price,
        recommendedDuration: offer.property.investmentDetails?.recommendedDuration || `${offer.duration_years} ans`,
        financingEligibility: offer.property.investmentDetails?.financingEligibility || false,
        partners: parsedPartners,
        projectStatus: (offer.property.investmentDetails?.projectStatus || 'En cours') as 'Pré-commercialisation' | 'En cours' | 'Terminé',
        investmentType: offer.property.investmentDetails?.investmentType || offer.property.type
      }
    };
  };

  // Fonction pour ouvrir le formulaire d'investissement
  const handleReservePlace = (offer: ExclusiveOffer, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent the card's onClick from firing

    const propertyForForm = createPropertyFromOffer(offer);
    setSelectedPropertyForm(propertyForForm);
    setIsInvestmentFormOpen(true);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axios.get('/api/exclusive-offers');
        setOffers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des offres exclusives', error);
      }
    };

    fetchOffers();
  }, []);

  // Fonction pour ouvrir le dialog avec les détails de la propriété
  const handleOpenInvestmentDetails = (offer: ExclusiveOffer) => {
    const propertyForDialog = createPropertyFromOffer(offer);
    console.log('Property for dialog:', propertyForDialog);

    setSelectedProperty(propertyForDialog);
    setIsDialogOpen(true);
  };

  const calculateFinalInvestment = (currentValue: number, rate: number, years: number) => {
    return currentValue * Math.pow(1 + rate / 100, years);
  };

  const calculateAnnualLocatif = (monthlyRental: number) => {
    return monthlyRental * 12;
  };

  const calculateAnnualROI = (initial_investment: number, final_investment: number) => {
    return ((final_investment - initial_investment) / initial_investment) * 100;
  };

  if (!offers.length) {
    return (
      <section id="exclusive" className="py-20 bg-luxe-blue text-white text-center">
        <p>Aucune offre exclusive disponible.</p>
      </section>
    );
  }

  const offer = offers[currentIndex];
  const finalInvestment = calculateFinalInvestment(
    offer.initial_investment,
    offer.annual_growth_rate,
    offer.duration_years
  );

  const roi = calculateAnnualROI(
    offer.initial_investment,
    finalInvestment
  );

  const annualRental = calculateAnnualLocatif(offer.monthly_rental_income);

  const firstImageUrl = offer.property?.images?.[0]
    ? getImageUrl(offer.property.images[0])
    : '';

  return (
    <>
      <section id="exclusive" className="py-20 bg-luxe-blue text-white">
        <div className="container px-6 lg:px-10">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="section-title text-white">
              Offres <span className="text-gold">Exclusives</span>
            </h2>
            <p className="section-subtitle text-white/80 max-w-3xl mx-auto">
              Accédez à nos opportunités limitées avant qu'elles ne soient plus disponibles. Ces biens d'exception sont sélectionnés pour leur potentiel de rendement exceptionnel.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-14">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-4 text-gold">
                <AlertCircle size={20} className="mr-2" />
                <p className="text-lg font-medium">Seulement {offers.length} projets restants pour ce trimestre</p>
              </div>
              <div className="flex space-x-4 sm:space-x-6">
                {['Jours', 'Heures', 'Minutes', 'Secondes'].map((label, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                      {[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][i]}
                    </div>
                    <span className="text-sm mt-2 text-white/60">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Offre */}
          <div
            key={offer.id}
            className="relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden mb-10 transition-all duration-700 cursor-pointer" // Add cursor-pointer here
            onClick={() => handleOpenInvestmentDetails(offer)} // Move onClick to the parent div
          >
            {/* Flèches de navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + offers.length) % offers.length); }} // Add e.stopPropagation()
              className="absolute top-1/2 -left-0 transform -translate-y-1/2 z-10
                            text-white hover:text-gold text-4xl font-bold rounded-full px-3 py-1 transition"
              aria-label="Précédent"
            >
              ‹
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % offers.length); }} // Add e.stopPropagation()
              className="absolute top-1/2 -right-0 transform -translate-y-1/2 z-10
                            text-white hover:text-gold text-4xl font-bold rounded-full px-3 py-1 transition"
              aria-label="Suivant"
            >
              ›
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Image - No longer exclusively clickable, but still shows visual for details */}
              <div
                className="relative h-64 lg:h-auto hover:opacity-90 transition-opacity"
              >
                {firstImageUrl && !imageError[offer.id] ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${firstImageUrl}")` }}
                    />
                    <img
                      src={firstImageUrl}
                      alt={offer.property?.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-0"
                      onError={() => handleImageError(offer.id)}
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).classList.remove('opacity-0');
                      }}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">Image indisponible</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-luxe-blue/70"></div>
                {/* Indicateur cliquable */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>

              {/* Infos */}
              <div className="p-8 lg:p-12">
                <h3
                  className="text-2xl font-bold mb-6 font-playfair hover:text-gold transition-colors"
                >
                  {offer.property?.title || "Titre non disponible"}
                </h3>

                <div className="space-y-4 mb-8">
                  <p className="text-white/80">{offer.property?.description || "Pas de description disponible"}</p>

                 <div className="grid grid-cols-2 gap-4 mt-6">
  <div className="bg-white/10 rounded-lg p-4">
    <h4 className="text-gold font-medium text-sm">Investissement initial</h4>
    <p className="text-2xl font-bold">{formatNumber(offer.initial_investment)} MAD</p>
  </div>

  <div className="bg-white/10 rounded-lg p-4">
    <h4 className="text-gold font-medium text-sm">Valeur actuelle</h4>
    <p className="text-2xl font-bold">{formatNumber(offer.current_value)} MAD</p>
  </div>

  <div className="bg-white/10 rounded-lg p-4">
    <h4 className="text-gold font-medium text-sm">Revenu locatif annuel</h4>
    <p className="text-2xl font-bold">{formatNumber(annualRental)} MAD</p>
  </div>

  <div className="bg-white/10 rounded-lg p-4">
    <h4 className="text-gold font-medium text-sm">ROI annuel estimé</h4>
    <p className="text-2xl font-bold">{formatPercent(roi)}</p>
  </div>
</div>


                    

                <div className="space-y-3">
                  {/* Bouton de réservation */}
                  <button
                    onClick={(event) => handleReservePlace(offer, event)}
                    className="gold-button inline-block w-full text-center"
                  >
                    Réservez votre place
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-sm text-white/70 bg-black/30 rounded-full px-3 py-1 -mt-8">
              {currentIndex + 1} / {offers.length}
            </span>
          </div>
        </div>
      </section>

      {/* Formulaire d'investissement */}
      {selectedPropertyForm && (
        <InvestmentForm
          property={selectedPropertyForm}
          open={isInvestmentFormOpen}
          onOpenChange={setIsInvestmentFormOpen}
        />
      )}

      {/* Dialog des détails d'investissement */}
      {selectedProperty && (
        <InvestmentDetailDialog
          property={selectedProperty}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
};

export default ExclusiveOffers;
