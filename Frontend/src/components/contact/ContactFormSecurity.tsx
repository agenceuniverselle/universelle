
import React from 'react';
import { Check, Shield } from 'lucide-react';

const ContactFormSecurity: React.FC = () => {
  return (
    <div className="mt-6 flex items-center justify-center space-x-8 pt-4 border-t border-gray-100">
      <div className="flex items-center text-sm text-gray-500">
        <Shield className="w-4 h-4 text-gold mr-2" />
        <span>Données sécurisées</span>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <Check className="w-4 h-4 text-gold mr-2" />
        <span>Consultation offerte</span>
      </div>
    </div>
  );
};

export default ContactFormSecurity;
