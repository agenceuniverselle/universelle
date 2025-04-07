
import React from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  purpose: string;
}

interface ContactFormFieldsProps {
  formData: FormData;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  formData,
  loading,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input-field"
            placeholder="Votre nom et prénom"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            placeholder="Votre adresse email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="input-field"
            placeholder="Votre numéro de téléphone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            Objectif de votre recherche *
          </label>
          <select
            id="purpose"
            name="purpose"
            className="input-field"
            value={formData.purpose}
            onChange={handleChange}
            required
          >
            <option value="information">Demande d'informations générales</option>
            <option value="purchase">Achat d'un bien immobilier</option>
            <option value="investment">Investissement immobilier</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget d&apos;investissement *
          </label>
          <select
            id="budget"
            name="budget"
            className="input-field"
            value={formData.budget}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Sélectionnez votre budget</option>
            <option value="100-300k">100,000€ - 300,000€</option>
            <option value="300-500k">300,000€ - 500,000€</option>
            <option value="500-1M">500,000€ - 1,000,000€</option>
            <option value="1M+">Plus de 1,000,000€</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message (optionnel)
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            className="input-field"
            placeholder="Précisez votre projet ou vos questions"
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className={`gold-button w-full flex items-center justify-center ${loading ? 'opacity-80' : ''}`}
            disabled={loading}
            aria-label="Soumettre le formulaire de contact"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </>
            ) : (
              "Recevoir mon plan"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactFormFields;
