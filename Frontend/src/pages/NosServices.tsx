import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Building, FileText, Key } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import ExpertContactForm from '@/components/ExpertContactForm';

const NosServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleOpenForm = (service: string) => {
    setSelectedService(service);
    setShowForm(true);
  };

  const services = [
    {
      icon: <BookOpen className="text-gold group-hover:text-white transition-all" />,
      title: "Conseil et Stratégie d'Investissement",
      description:
        "Analyse de votre profil investisseur, définition d'objectifs clairs et élaboration d'une stratégie personnalisée pour maximiser votre rentabilité.",
    },
    {
      icon: <Building className="text-gold group-hover:text-white transition-all" />,
      title: "Promotion et Développement Immobilier",
      description:
        "Identification des opportunités de marché, développement de projets immobiliers de standing et commercialisation auprès d'une clientèle premium.",
    },
    {
      icon: <FileText className="text-gold group-hover:text-white transition-all" />,
      title: "Accompagnement Juridique et Financier",
      description:
        "Sécurisation de vos transactions immobilières, optimisation fiscale et montage financier adapté à votre situation patrimoniale.",
    },
    {
      icon: <Key className="text-gold group-hover:text-white transition-all" />,
      title: "Gestion de Vente et Achat",
      description:
        "Prise en charge complète de la gestion de votre bien, accompagnement personnalisé à l’achat et à la vente, avec une stratégie optimisée pour maximiser votre plus-value.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <MainLayout>
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-luxe-blue mb-4 mt-8">
                Nos Services Premium
              </h2>
              <div className="w-20 h-1 bg-gold mx-auto mb-8"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Une offre complète et sur-mesure pour répondre à tous vos besoins d'investissement immobilier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-gold transition-all">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-playfair font-bold text-luxe-blue">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-6 pl-16">{service.description}</p>
                  <div className="pl-16">
                    <Button
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-white transition-all"
                      onClick={() => handleOpenForm(service.title)}
                    >
                      Parlez à un Expert
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </MainLayout>

      {selectedService && (
        <ExpertContactForm
          open={showForm}
          onOpenChange={setShowForm}
          serviceType={selectedService}
        />
      )}
    </div>
  );
};

export default NosServices;
