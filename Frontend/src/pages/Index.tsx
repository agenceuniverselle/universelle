import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainLayout from '@/components/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import InvestmentOpportunities from '@/components/InvestmentOpportunities';
import Testimonials from '@/components/Testimonials';
import ExclusiveOffers from '@/components/ExclusiveOffers';
import ContactForm from '@/components/ContactForm';
import LocationMap from '@/components/LocationMap';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <>
      {/* HEAD: GTM Script */}
      <Helmet>
        <script>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PZG78T3W');
          `}
        </script>
      </Helmet>

      {/* BODY: GTM noscript */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PZG78T3W"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        ></iframe>
      </noscript>

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
    </>
  );
};

export default Index;
