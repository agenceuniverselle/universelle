
import React from 'react';

const ContactFormSidebar: React.FC = () => {
  return (
    <div className="bg-luxe-blue p-8 lg:p-12 text-white flex flex-col">
      <h3 className="text-2xl font-bold mb-6 font-playfair">Pourquoi Nous Contacter ?</h3>
      
      <div className="space-y-6 flex-grow">
        <div>
          <h4 className="font-medium text-gold mb-2">Expertise Locale</h4>
          <p className="text-white/80 text-sm">
            Notre équipe possède une connaissance approfondie du marché marocain et des opportunités d&apos;investissement les plus rentables.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gold mb-2">Accompagnement Personnalisé</h4>
          <p className="text-white/80 text-sm">
            De la sélection du bien à sa gestion, nous vous accompagnons tout au long de votre projet d&apos;investissement.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gold mb-2">Sélection Exclusive</h4>
          <p className="text-white/80 text-sm">
            Accédez à des biens immobiliers haut de gamme, souvent non disponibles sur le marché public.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gold mb-2">Rentabilité Garantie</h4>
          <p className="text-white/80 text-sm">
            Nos investisseurs bénéficient d&apos;un rendement moyen de 8%, bien supérieur aux placements traditionnels.
          </p>
        </div>
      </div>
      
      <div className="mt-auto pt-8 border-t border-white/20">
        <p className="font-medium text-lg mb-2">Besoin d&apos;une réponse immédiate ?</p>
        <a 
          href="https://wa.me/212665944626" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gold hover:text-gold-light text-xl flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          +212 665-944626
        </a>
      </div>
    </div>
  );
};

export default ContactFormSidebar;
