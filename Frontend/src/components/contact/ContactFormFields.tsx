import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Phone, ChevronDown, AlertCircle } from "lucide-react"; // Added Phone, ChevronDown, AlertCircle
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input'; // Assuming you have Input component from shadcn
import { Label } from '@/components/ui/label'; // Assuming you have Label component from shadcn
import { Textarea } from '@/components/ui/textarea'; // Assuming you have Textarea component from shadcn
import ReactCountryFlag from 'react-country-flag';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { countryCodes, CountryData, detectCountryFromPhone } from '@/lib/countryCodes'; // Make sure this path is correct
import { cn } from '@/lib/utils'; // Assuming you have cn utility for conditional classnames
import { motion } from 'framer-motion'; // For error animation, ensure framer-motion is installed
import { Link } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
  purpose: string;
  consent: boolean;
}

interface ContactFormFieldsProps {
  onSuccess: () => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
    purpose: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isDetectingIp, setIsDetectingIp] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Effect for IP detection on initial component mount
  useEffect(() => {
    const detectCountryByIp = async () => {
      try {
        const response = await axios.get('https://ip-api.com/json'); // Use HTTPS for production
        const data = response.data;

        if (data.status === 'success' && data.countryCode) {
          const foundCountry = countryCodes.find(
            c => c.iso2 === data.countryCode
          );
          if (foundCountry) {
            setSelectedCountry(foundCountry);
            setFormData(prev => ({ ...prev, phone: `+${foundCountry.code} ` }));
          } else {
            console.warn(`Country code ${data.countryCode} from IP-API not found in your countryCodes list. Falling back to Morocco.`);
            setSelectedCountry(countryCodes.find(c => c.iso2 === "MA") || null); // Fallback to Morocco
          }
        } else {
          console.warn("IP-API call failed or returned no country code. Falling back to Morocco.");
          setSelectedCountry(countryCodes.find(c => c.iso2 === "MA") || null); // Fallback to Morocco
        }
      } catch (error) {
        console.error("Error detecting country by IP for ContactFormFields:", error);
        setSelectedCountry(countryCodes.find(c => c.iso2 === "MA") || null); // Fallback to Morocco on error
      } finally {
        setIsDetectingIp(false); // IP detection is complete
      }
    };

    detectCountryByIp();
  }, []); // Run only once on component mount

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }

    if (name === 'phone') {
      const formatter = new AsYouType(selectedCountry?.iso2);
      const formattedValue = formatter.input(value);
      newValue = formattedValue;

      if (formattedValue.length > 0) {
        const phoneNumber = parsePhoneNumberFromString(formattedValue, selectedCountry?.iso2);
        if (phoneNumber && phoneNumber.isValid()) {
          setFormErrors(prev => ({ ...prev, phone: '' }));
        } else {
          setFormErrors(prev => ({ ...prev, phone: 'Numéro de téléphone invalide.' }));
        }
      } else {
        setFormErrors(prev => ({ ...prev, phone: '' })); // Clear error if input is empty
      }
    } else {
      // Clear error for other fields when user types
      if (value && formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCountrySelectChange = (iso2Code: string) => {
    const selected = countryCodes.find(c => c.iso2 === iso2Code);
    if (selected) {
      setSelectedCountry(selected);

      let newPhoneNumberString = '';
      const currentPhoneNumber = parsePhoneNumberFromString(formData.phone);

      if (currentPhoneNumber && currentPhoneNumber.countryCallingCode === selected.code) {
          // If the existing number already matches the new country code, keep its international format
          newPhoneNumberString = currentPhoneNumber.formatInternational();
      } else {
          // Otherwise, construct a new number string with the new country code
          if (currentPhoneNumber && currentPhoneNumber.nationalNumber) {
              newPhoneNumberString = `+${selected.code}${currentPhoneNumber.nationalNumber}`;
          } else {
              // If no valid national number, just put the new country code
              newPhoneNumberString = `+${selected.code} `;
          }
      }

      // Format and validate the new phone number string immediately
      const phoneNumber = parsePhoneNumberFromString(newPhoneNumberString, selected.iso2);
      if (phoneNumber && phoneNumber.isValid()) {
        setFormData(prev => ({ ...prev, phone: phoneNumber.formatInternational() }));
        setFormErrors(prev => ({ ...prev, phone: '' }));
      } else {
          setFormData(prev => ({ ...prev, phone: `+${selected.code} ` }));
          setFormErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Veuillez entrer votre nom complet.";
    }
    if (!formData.email.trim()) {
      errors.email = "Veuillez entrer votre email.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Veuillez entrer une adresse email valide.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Veuillez entrer votre numéro de téléphone.";
    } else {
      const phoneNumber = parsePhoneNumberFromString(formData.phone, selectedCountry?.iso2);
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.phone = 'Veuillez saisir un numéro de téléphone valide et complet.';
      }
    }

    if (!formData.purpose) {
      errors.purpose = "Veuillez sélectionner votre objectif.";
    }
    if (!formData.budget) {
      errors.budget = "Veuillez sélectionner votre budget.";
    }

   

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Échouée",
        description: (
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500 w-5 h-5" />
            <span>Veuillez corriger les erreurs dans le formulaire.</span>
          </div>
        ),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    // Format phone number to E.164 before sending
    const phoneNumberParsed = parsePhoneNumberFromString(formData.phone, selectedCountry?.iso2);
    const phoneNumberForDb = phoneNumberParsed ? phoneNumberParsed.format('E.164') : formData.phone;

    try {
      const response = await axios.post('/api/vip-contact', { ...formData, phone: phoneNumberForDb });

      toast({
        title: "Succès",
        description: (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500 w-5 h-5" />
              <span>Votre message a bien été envoyé.</span>
            </div>
            <small className="text-black-600">
              Notre équipe va vous contacter sous 48 heures maximum.
            </small>
          </div>
        ),
        duration: 5000,
      });
      onSuccess();

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        budget: '',
        message: '',
        purpose: '',
        consent: true,
      });
      setFormErrors({}); // Clear errors on success
      setSelectedCountry(countryCodes.find(c => c.iso2 === "MA") || null); // Reset country, defaulting to MA
      setIsDetectingIp(true); // Reset IP detection state for next form open/render
    } catch (err) {
      toast({
        title: "Erreur",
        description: (
          <div className="flex items-center gap-2">
            <XCircle className="text-red-500 w-5 h-5" />
            <span>Une erreur est survenue.</span>
          </div>
        ),
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Nom complet */}
            <div className="w-full md:w-1/2">
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                className={cn("input-field", formErrors.name && "border-red-500")}
                placeholder="Votre nom et prénom"
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formErrors.name}
                </motion.p>
              )}
            </div>

            {/* Téléphone with Flag Selector */}
            <div className="w-full md:w-1/2">
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </Label>
              <div className={cn(
                "mt-1 flex items-center border rounded-md overflow-hidden bg-white",
                formErrors.phone && "border-red-500"
              )}>
                {/* Country Code Selector (Dropdown) */}
                <Select onValueChange={handleCountrySelectChange} value={selectedCountry?.iso2 || ''} disabled={isDetectingIp}>
                  <SelectTrigger className="flex-shrink-0 w-[90px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2">
                    <div className="flex items-center justify-between w-full">
                      {isDetectingIp ? (
                        <span className="animate-pulse text-gray-500 text-sm">Chargement...</span>
                      ) : selectedCountry ? (
                        <span className="flex items-center">
                          <ReactCountryFlag
                            countryCode={selectedCountry.iso2}
                            svg
                            style={{ width: '2.25em', height: '1.25em' }}
                            className="!rounded-none"
                          />
                        </span>
                      ) : (
                        <span className="text-gray-500">Choisir</span>
                      )}
                    </div>
                  </SelectTrigger>
                 <SelectContent className="max-h-[300px] overflow-y-auto z-[9999]"> {/* Add a high z-index here */}
  {countryCodes.map((country) => (
    <SelectItem key={country.iso2} value={country.iso2}>
      <span className="flex items-center">
        <ReactCountryFlag
          countryCode={country.iso2}
          svg
          style={{ width: '1.25em', height: '1.25em' }}
          className="mr-2 !rounded-none"
        />
        {country.name} (+{country.code})
      </span>
    </SelectItem>
  ))}
</SelectContent>
                </Select>

                {/* Phone Input */}
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="flex-1 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={selectedCountry ? `ex: ${selectedCountry.code === '212' ? '6XXXXXXXX ou 7XXXXXXXX' : 'Numéro national'}` : "Votre numéro de téléphone"}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {formErrors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formErrors.phone}
                </motion.p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              className={cn("input-field", formErrors.email && "border-red-500")}
              placeholder="Votre adresse email"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1 flex items-center"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {formErrors.email}
              </motion.p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Objectif */}
            <div className="w-full md:w-1/2">
              <Label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Objectif de votre recherche <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleChange({ target: { name: 'purpose', value, type: 'select-one' } } as React.ChangeEvent<HTMLSelectElement>)} value={formData.purpose}>
                <SelectTrigger id="purpose" name="purpose" className={cn("input-field", formErrors.purpose && "border-red-500")}>
                  <SelectValue placeholder="Sélectionnez votre Objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="information">Demande d'informations générales</SelectItem>
                  <SelectItem value="purchase">Achat d'un bien immobilier</SelectItem>
                  <SelectItem value="investment">Investissement immobilier</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.purpose && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formErrors.purpose}
                </motion.p>
              )}
            </div>

            {/* Budget */}
            <div className="w-full md:w-1/2">
              <Label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                Budget d&apos;investissement <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => handleChange({ target: { name: 'budget', value, type: 'select-one' } } as React.ChangeEvent<HTMLSelectElement>)} value={formData.budget}>
                <SelectTrigger id="budget" name="budget" className={cn("input-field", formErrors.budget && "border-red-500")}>
                  <SelectValue placeholder="Sélectionnez votre budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100-300k">100,000 MAD - 300,000 MAD</SelectItem>
                  <SelectItem value="300-500k">300,000 MAD - 500,000 MAD</SelectItem>
                  <SelectItem value="500-1M">500,000 MAD - 1,000,000 MAD</SelectItem>
                  <SelectItem value="1M+">Plus de 1,000,000 MAD</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.budget && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-1 flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formErrors.budget}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message (optionnel)
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={3}
              className="input-field" // Keep original input-field styling for now
              placeholder="Précisez votre projet ou vos questions"
              value={formData.message}
              onChange={handleChange}
            />
          </div>
          {/* Consent Checkbox */}
          <div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="consent"
    name="consent"
    className="w-4 h-4 text-luxe-blue bg-gray-100 accent-luxe-blue"
    checked={formData.consent}
    onChange={handleChange}
  />
  <Label htmlFor="consent" className="text-sm font-medium dark:text-black">
    J'accepte les{' '}
    <Link
      to="/PrivacyPolicyPage"
      className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
    >
      conditions générales et la politique de confidentialité
    </Link>
  </Label>
</div>

          {formErrors.consent && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500 mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {formErrors.consent}
            </motion.p>
          )}
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
                "Envoyer"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactFormFields;
