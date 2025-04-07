
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Building, FileText, Key } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';

const NosServices = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      {/* Services Section */}
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
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-gold transition-all">
                  <BookOpen className="text-gold group-hover:text-white transition-all" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-luxe-blue">Conseil & Stratégie d'Investissement</h3>
              </div>
              <p className="text-gray-700 mb-6 pl-16">
                Analyse de votre profil investisseur, définition d'objectifs clairs et élaboration d'une stratégie personnalisée pour maximiser votre rentabilité.
              </p>
              <div className="pl-16">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white transition-all">
                  Parlez à un Expert
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-gold transition-all">
                  <Building className="text-gold group-hover:text-white transition-all" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-luxe-blue">Promotion & Développement Immobilier</h3>
              </div>
              <p className="text-gray-700 mb-6 pl-16">
                Identification des opportunités de marché, développement de projets immobiliers de standing et commercialisation auprès d'une clientèle premium.
              </p>
              <div className="pl-16">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white transition-all">
                  Parlez à un Expert
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-gold transition-all">
                  <FileText className="text-gold group-hover:text-white transition-all" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-luxe-blue">Accompagnement Juridique & Financier</h3>
              </div>
              <p className="text-gray-700 mb-6 pl-16">
                Sécurisation de vos transactions immobilières, optimisation fiscale et montage financier adapté à votre situation patrimoniale.
              </p>
              <div className="pl-16">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white transition-all">
                  Parlez à un Expert
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-gold transition-all">
                  <Key className="text-gold group-hover:text-white transition-all" />
                </div>
                <h3 className="text-xl font-playfair font-bold text-luxe-blue">Gestion Locative & Revente</h3>
              </div>
              <p className="text-gray-700 mb-6 pl-16">
                Prise en charge complète de la gestion de votre bien, optimisation des revenus locatifs et stratégie de revente pour maximiser votre plus-value.
              </p>
              <div className="pl-16">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-white transition-all">
                  Parlez à un Expert
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
    <Button className="bg-gold hover:bg-gold-dark text-white px-8 py-6 text-lg rounded-md transition-all duration-300 mt-16">
      Découvrez Nos Solutions <ArrowRight className="ml-2" />
    </Button>
  </div>
  
      </section>
      </MainLayout>

    </div>
    
  );
};

export default NosServices;
