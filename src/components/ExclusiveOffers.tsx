
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const ExclusiveOffers = () => {
  // Timer state (3 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
  
  return (
    <section id="exclusive" className="py-20 bg-luxe-blue text-white">
      <div className="container px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="section-title text-white">
            Offres <span className="text-gold">Exclusives</span>
          </h2>
          <p className="section-subtitle text-white/80 max-w-3xl mx-auto">
            Accédez à nos opportunités limitées avant qu'elles ne soient plus disponibles. Ces biens d'exception sont sélectionnés pour leur potentiel de rendement exceptionnel.
          </p>
        </div>
        
        {/* Countdown timer */}
        <div className="mb-14">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-4 text-gold">
              <AlertCircle size={20} className="mr-2" />
              <p className="text-lg font-medium">Seulement 3 projets restants pour ce trimestre</p>
            </div>
            
            <div className="flex space-x-4 sm:space-x-6">
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {timeLeft.days}
                </div>
                <span className="text-sm mt-2 text-white/60">Jours</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {timeLeft.hours}
                </div>
                <span className="text-sm mt-2 text-white/60">Heures</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {timeLeft.minutes}
                </div>
                <span className="text-sm mt-2 text-white/60">Minutes</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {timeLeft.seconds}
                </div>
                <span className="text-sm mt-2 text-white/60">Secondes</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Case study */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image side */}
            <div className="relative h-64 lg:h-auto">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80")' }}
              />
              {/* Before/After slider placeholder */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-luxe-blue/70"></div>
            </div>
            
            {/* Content side */}
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6 font-playfair">Étude de cas : Villa de luxe à Marrakech</h3>
              
              <div className="space-y-4 mb-8">
                <p className="text-white/80">
                  Un de nos clients a investi dans une villa de luxe dans le quartier prisé de La Palmeraie à Marrakech. Voici les résultats obtenus.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">Investissement initial</h4>
                    <p className="text-2xl font-bold">500,000€</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">Valeur actuelle</h4>
                    <p className="text-2xl font-bold">620,000€</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">Revenus locatifs annuels</h4>
                    <p className="text-2xl font-bold">45,000€</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4">
                    <h4 className="text-gold font-medium text-sm">ROI annuel</h4>
                    <p className="text-2xl font-bold">9%</p>
                  </div>
                </div>
              </div>
              
              <a 
                href="#contact" 
                className="gold-button inline-block w-full text-center"
              >
                Réservez votre place
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;
