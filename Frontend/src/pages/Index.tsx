
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import InvestmentOpportunities from '@/components/InvestmentOpportunities';
import Testimonials from '@/components/Testimonials';
import ExclusiveOffers from '@/components/ExclusiveOffers';
import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap'; // Ajoute cette ligne

const Index = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we need to scroll to a specific section after navigation
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Add a small delay to ensure the page has fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <MainLayout>
      <div className="min-h-screen w-full pt-0">
        <HeroSection />
        <WhyChooseUs />
        <InvestmentOpportunities />
        <Testimonials />
        <ExclusiveOffers />
        <ContactForm />
        <LocationMap /> 
      </div>
    </MainLayout>
  );
};

export default Index;
