import React, { useState, useEffect } from 'react';
import { AlertCircle, ImageIcon } from 'lucide-react';
import axios from 'axios';
import { Property } from '@/context/PropertiesContext';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // ✅ SÉCURISATION DU FORMATAGE
  const formatNumber = (value: unknown): string => {
    const number = typeof value === 'number' ? value : Number(value);
    return !isNaN(number) ? number.toLocaleString() : 'N/A';
  };

  const formatPercent = (value: unknown) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return `${value.toFixed(2)}%`;
    }
    return 'N/A';
  };

  const calculateFinalInvestment = (currentValue: number, rate: number, years: number) => {
    return currentValue * Math.pow(1 + rate / 100, years);
  };

  const calculateAnnualLocatif = (monthlyRental?: number) => {
    return typeof monthlyRental === 'number' ? monthlyRental * 12 : 0;
  };

  const calculateAnnualROI = (initial_investment: number, final_investment: number) => {
    return ((final_investment - initial_investment) / initial_investment) * 100;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleImageError = (offerId: number) => {
    setImageError(prev => ({ ...prev, [offerId]: true }));
  };

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:8000/${imagePath}`;
  };

  const createPropertyFromOffer = (offer: ExclusiveOffer): Property => {
    let parsedPartners: string[] = [];
    if (offer.property.partners && typeof offer.property.partners === 'string') {
      try {
        parsedPartners = JSON.parse(offer.property.partners);
      } catch {
        parsedPartners = [];
      }
    } else if (Array.isArray(offer.property.partners)) {
      parsedPartners = offer.property.partners;
    }

    return {
      id: offer.property.id.toString(),
      title: offer.property.title,
      description: offer.property.description || '',
      images: offer.property.images.map((imagePath, index) => ({
        id: `${offer.property.id}-${index}`,
        url: imagePath,
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
        investmentType: offer.property.investmentDetails?.investmentType || offer.property.type,
      },
    };
  };

  const handleReservePlace = (offer: ExclusiveOffer, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const propertyForForm = createPropertyFromOffer(offer);
    setSelectedPropertyForm(propertyForForm);
    setIsInvestmentFormOpen(true);
  };

  const handleOpenInvestmentDetails = (offer: ExclusiveOffer) => {
    const propertyForDialog = createPropertyFromOffer(offer);
    setSelectedProperty(propertyForDialog);
    setIsDialogOpen(true);
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

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!offers.length) {
    return (
      <section id="exclusive" className="py-20 bg-luxe-blue text-white text-center">
        <p>Aucune offre exclusive disponible.</p>
      </section>
    );
  }

  const offer = offers[currentIndex];
  const finalInvestment = calculateFinalInvestment(offer.initial_investment, offer.annual_growth_rate, offer.duration_years);
  const roi = calculateAnnualROI(offer.initial_investment, finalInvestment);
  const annualRental = calculateAnnualLocatif(offer.monthly_rental_income);
  const firstImageUrl = offer.property.images?.[0] ? getImageUrl(offer.property.images[0]) : '';

  return (
    <>
      {/* ...TON RESTE DU RENDU HTML COMME TU L'AS FAIT... */}
      {/* Remplace toutes les utilisations de formatNumber avec une vérification sécurisée */}

      {/* Ex. : */}
      <p className="text-2xl font-bold">{formatNumber(annualRental ?? 0)} MAD</p>

      {/* ...et ainsi de suite pour les autres champs similaires */}

      {selectedPropertyForm && (
        <InvestmentForm
          property={selectedPropertyForm}
          open={isInvestmentFormOpen}
          onOpenChange={setIsInvestmentFormOpen}
        />
      )}
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
