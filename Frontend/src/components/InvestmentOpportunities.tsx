
import React from 'react';
import { Home, BarChart, Key } from 'lucide-react';

const InvestmentOpportunities = () => {
  const opportunities = [
    {
      icon: <Home className="w-10 h-10 text-white" />,
      title: "Investissement Clé en Main",
      description: "Vous investissez, on s'occupe du reste. De la sélection du bien à sa gestion locative, nous vous accompagnons à chaque étape.",
      benefits: [
        "Sélection personnalisée selon vos critères",
        "Gestion de l'acquisition et des démarches administratives",
        "Rénovation et ameublement si nécessaire",
        "Gestion locative complète"
      ],
      bgImage: "https://images.unsplash.com/photo-1600607687644-c7531e460c2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      icon: <BarChart className="w-10 h-10 text-white" />,
      title: "Études de Rentabilité & Conseil",
      description: "Investissez intelligemment et sans risque grâce à nos analyses de marché approfondies et nos conseils d'experts.",
      benefits: [
        "Analyse personnalisée de votre capacité d'investissement",
        "Étude de marché détaillée des zones à fort potentiel",
        "Simulation financière et fiscale",
        "Recommandations stratégiques"
      ],
      bgImage: "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
  icon: <Key className="w-10 h-10 text-white" />,
  title: "Vente et Achat Immobilier",
  description: "Trouvez et vendez votre bien immobilier en toute sérénité grâce à notre accompagnement personnalisé.",
  benefits: [
    "Evaluation précise de votre bien",
    "Accompagnement personnalisé tout au long du processus",
    "Large réseau d'acheteurs et de vendeurs qualifiés",
    "Négociation optimisée pour obtenir le meilleur prix"
  ],
  bgImage: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
}

  ];

  return (
    <section id="opportunities" className="py-20">
      <div className="container px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Nos <span className="gold-gradient">Offres d'Investissement</span>
          </h2>
          <p className="section-subtitle">
            Découvrez nos services sur mesure conçus pour répondre à vos besoins d'investissement immobilier au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {opportunities.map((opportunity, index) => (
            <div 
              key={index} 
              className="rounded-xl overflow-hidden group transition-all duration-500 card-shadow hover:shadow-xl relative h-[600px]"
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${opportunity.bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-luxe-blue/80 to-luxe-black/95"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="bg-gold rounded-full p-4 inline-block mb-6 self-start">
                  {opportunity.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 font-playfair">{opportunity.title}</h3>
                <p className="text-white/80 mb-6">{opportunity.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {opportunity.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-gold mr-2">✓</span>
                      <span className="text-white/70 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                 <a
  href={
    opportunity.title === "Vente et Achat Immobilier" ? "/nos-biens" :
    opportunity.title === "Études de Rentabilité & Conseil" ? "#contact" :
    opportunity.title === "Investissement Clé en Main" ? "/investir" :
    "#"
  }
  className="inline-block w-full text-center py-3 px-6 bg-white text-luxe-blue rounded-md font-medium transition-all hover:bg-gold hover:text-white"
>
  En savoir plus
</a>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentOpportunities;
