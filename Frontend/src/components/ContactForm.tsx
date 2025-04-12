
import React from 'react';
import { LeadProvider } from '@/context/LeadContext';
import ContactFormContainer from './contact/ContactFormContainer';

const ContactForm: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Commencez <span className="gold-gradient">Votre Projet</span>
            </h2>
            <p className="section-subtitle text-gray-600">
              Recevez un audit gratuit de votre potentiel d&apos;investissement et découvrez les opportunités qui s&apos;offrent à vous.
            </p>
          </div>
          
          <LeadProvider>
            <ContactFormContainer />
          </LeadProvider>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
