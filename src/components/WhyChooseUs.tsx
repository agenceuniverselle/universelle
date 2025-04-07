
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

        {/* Testimonial preview */}
        <div className="mt-16 text-center">
          <p className="italic text-xl font-playfair text-gray-700 max-w-3xl mx-auto">
            "L'investissement au Maroc a été la meilleure décision financière de ma vie. Le retour sur investissement a dépassé toutes mes attentes."
          </p>
          <div className="mt-4">
            <span className="font-medium text-luxe-blue">Jean Dupont</span>
            <span className="text-gray-500"> — Investisseur depuis 2019</span>
          </div>
          <a 
            href="#testimonials" 
            className="mt-6 inline-block text-gold hover:text-gold-dark font-medium transition-colors"
          >
            Voir tous les témoignages →
          </a>
        </div>

        {/* Partners logos */}
        <div className="mt-20">
          <h3 className="text-center text-gray-400 text-sm uppercase tracking-wider mb-8">Nos partenaires de confiance</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="w-32 h-16 flex items-center justify-center">
              <img 
                src="/lovable-uploads/Logo_Small_SVG.svg" 
                alt="Logo Agence Universelle" 
                className="max-h-full max-w-full"
              />
            </div>
            {/* <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">Logo 3</div>
            <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">Logo 4</div>
            <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">Logo 5</div>
           */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
