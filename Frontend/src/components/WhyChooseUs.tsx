
import React from 'react';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';

const WhyChooseUs = () => {
  const stats = [
    {
      icon: <Users className="w-10 h-10 text-gold" />,
      value: "500+",
      label: "Investisseurs accompagnés avec succès",
      description: "Notre expertise a permis à plus de 500 investisseurs de concrétiser leurs projets immobiliers au Maroc."
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-gold" />,
      value: "8%",
      label: "Rendement moyen sur nos projets",
      description: "Nos investisseurs bénéficient d'un rendement annuel moyen supérieur aux placements traditionnels."
    },
    {
      icon: <Clock className="w-10 h-10 text-gold" />,
      value: "60",
      label: "Jours pour vendre un bien",
      description: "100% de nos biens sont vendus en moins de 60 jours grâce à notre réseau et notre expertise du marché."
    },
    {
      icon: <Award className="w-10 h-10 text-gold" />,
      value: "100%",
      label: "Experts certifiés",
      description: "Notre équipe est composée uniquement d'experts certifiés et de partenaires bancaires solides."
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-gray-50">
      <div className="container px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="section-title">
            Pourquoi <span className="gold-gradient">Investir avec Nous</span> ?
          </h2>
          <p className="section-subtitle">
            L'Agence Universelle d'Investissement Immobilier vous offre un accompagnement d'exception pour maximiser la rentabilité de vos investissements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="stats-card group transition-all duration-300 hover:shadow-lg">
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-playfair font-bold mb-2 text-luxe-blue">{stat.value}</h3>
              <h4 className="text-lg font-medium mb-3 text-gray-800">{stat.label}</h4>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
        {/* Partners logos */}
        <div className="mt-20">
          <h3 className="text-center text-black-400 text-sm uppercase tracking-wider mb-8">Nos partenaires de confiance</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="w-40 h-20 flex items-center justify-center">
            <img 
                src="/lovable-uploads/Logo_Small_SVG.svg" 
                alt="Logo Agence Universelle" 
                className="max-h-full max-w-full"
              />
            </div>
            <div className="w-40 h-20 flex items-center justify-center"> <img 
                src="/EXTRAV.png" 
                alt="Logo EXTRAV" 
                className="max-h-full max-w-full"
              /></div>
            <div className="w-60 h-45 flex items-center justify-center"><img 
                src="/SINMAT.png" 
                alt="SINMAT EXTRAV" 
                className="max-h-full max-w-full"
              /></div>
             <div className="w-40 h-25 flex items-center justify-center"><img 
                src="/sintraS.png" 
                alt="sintraS EXTRAV" 
                className="max-h-full max-w-full"
              /></div>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
