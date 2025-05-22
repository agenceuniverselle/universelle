import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

interface ExclusiveOffer {
  id: number;
  property_id: number;
  current_value: number;
  monthly_rental_income: number;
  annual_growth_rate: number;
  duration_years: number;
  initial_investment: number;
  property: {
    title: string;
    description: string;
    images: string[];
  };
}

const ExclusiveOffers = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, minutes: 0, seconds: 0 });
  const [offers, setOffers] = useState<ExclusiveOffer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const firstImage = offer.property?.images?.[0]
    ? `http://localhost:8000/${offer.property.images[0]}`
    : 'https://via.placeholder.com/600x400?text=Aucune+image';

  return (
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
        <div key={offer.id} className="relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden mb-10 transition-all duration-700">
         {/* ✅ Flèches positionnées dans le conteneur global, pas dans la colonne image */}
  <button
    onClick={() =>
      setCurrentIndex((currentIndex - 1 + offers.length) % offers.length)
    }
    className="absolute top-1/2 -left-0 transform -translate-y-1/2 z-10 
               text-white hover:text-gold text-4xl font-bold  rounded-full px-3 py-1 transition"
    aria-label="Précédent"
  >
    ‹
  </button>

  <button
    onClick={() =>
      setCurrentIndex((currentIndex + 1) % offers.length)
    }
    className="absolute top-1/2 -right-0 transform -translate-y-1/2 z-10 
               text-white hover:text-gold text-4xl font-bold   rounded-full px-3 py-1 transition"
    aria-label="Suivant"
  >
    ›
  </button>

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
            <div className="relative h-64 lg:h-auto">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${firstImage}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-luxe-blue/70"></div>
            </div>

            {/* Infos */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6 font-playfair">{offer.property?.title || "Titre non disponible"}</h3>

              <div className="space-y-4 mb-8">
                <p className="text-white/80">{offer.property?.description || "Pas de description disponible"}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">Investissement initial</h4>
                    <p className="text-2xl font-bold">{offer.initial_investment.toLocaleString()} MAD</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">Valeur actuelle</h4>
                    <p className="text-2xl font-bold">{offer.current_value.toLocaleString()} MAD</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">Revenu locatif annuel</h4>
                    <p className="text-2xl font-bold">{annualRental.toLocaleString()} MAD</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">ROI annuel estimé</h4>
                    <p className="text-2xl font-bold">{roi.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              <a href="#contact" className="gold-button inline-block w-full text-center">
                Réservez votre place
              </a>
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
    
  );
};

export default ExclusiveOffers;
