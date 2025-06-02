
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useLeads } from '@/context/LeadContext';
import ContactFormFields from './ContactFormFields';
import ContactFormSecurity from './ContactFormSecurity';
import ContactFormSidebar from './ContactFormSidebar';

const ContactFormContainer: React.FC = () => {
  const [showVipForm, setShowVipForm] = useState(false);
  const { addLead } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
    purpose: 'information'  // Added purpose field to determine client type
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const budgetMapping: Record<string, string> = {
      '100-300k': '100,000MAD - 300,000MAD',
      '300-500k': '300,000MAD - 500,000MAD',
      '500-1M': '500,000MAD - 1,000,000MAD',
      '1M+': 'Plus de 1,000,000MAD'
    };
    
    // Determine client type based on purpose
    let clientType: 'Investisseur' | 'Acheteur' | 'Prospect' = 'Prospect';
    let propertyInfo = '';
    
    if (formData.purpose === 'investment') {
      clientType = 'Investisseur';
      propertyInfo = `Budget: ${budgetMapping[formData.budget] || formData.budget}. Critères: ${formData.message}`;
    } else if (formData.purpose === 'purchase') {
      clientType = 'Acheteur';
      propertyInfo = `Budget: ${budgetMapping[formData.budget] || formData.budget}. Type de bien souhaité: ${formData.message}`;
    }
    
    try {
      const newLead = addLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        budget: budgetMapping[formData.budget] || formData.budget,
        propertyType: formData.message.includes('appartement') ? 'Appartement' : 
                    formData.message.includes('maison') ? 'Maison' : 
                    formData.message.includes('villa') ? 'Villa' : 'Non spécifié',
        status: 'Nouveau lead',
        source: 'Formulaire site',
        notes: formData.message,
        score: 75
      }, clientType, propertyInfo);
      
      console.log('Lead ajouté avec succès dans le CRM et ajouté en client:', newLead);
      
      setTimeout(() => {
        toast.success("Votre demande a été envoyée avec succès! Un conseiller vous contactera sous 24h.");
        setLoading(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          budget: '',
          message: '',
          purpose: 'information'
        });
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lead et client:', error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 lg:p-12">
        <ContactFormFields onSuccess={() => setShowVipForm(false)} />

          <ContactFormSecurity />
        </div>
        <ContactFormSidebar />
      </div>
    </div>
  );
};

export default ContactFormContainer;
