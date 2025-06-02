import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  Check,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for IP detection
import ReactCountryFlag from 'react-country-flag'; // Import ReactCountryFlag

// Import the necessary phone number utilities and country data
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { countryCodes, CountryData, detectCountryFromPhone } from '@/lib/countryCodes'; // Assuming you have this file

interface ConseillerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: number | null;
  contactId?: number | null;
  initialData?: {
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    property_id?: number | null;
    consent?: boolean;
  };
  onSuccess?: () => void;
}

const ConseillerForm: React.FC<ConseillerFormProps> = ({
  open,
  onOpenChange,
  propertyId,
  contactId,
  initialData,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    status: 'new',
    propertyId: propertyId || null,
    consent: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // State for country selection
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isDetectingIp, setIsDetectingIp] = useState(true); // For initial IP detection

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Effect for IP detection on initial component mount or dialog open
  useEffect(() => {
    const detectCountryByIp = async () => {
      try {
        const response = await axios.get('http://ip-api.com/json');
        const data = response.data;

        if (data.status === 'success' && data.countryCode) {
          const foundCountry = countryCodes.find(
            c => c.iso2 === data.countryCode
          );
          if (foundCountry) {
            setSelectedCountry(foundCountry);
            // Optionally: Pre-fill the phone input with the country code
            setFormData(prev => ({ ...prev, phone: `+${foundCountry.code} ` }));
          } else {
            console.warn(`Country code ${data.countryCode} from IP-API not found in your countryCodes list.`);
          }
        }
      } catch (error) {
        console.error("Error detecting country by IP for ConseillerForm:", error);
      } finally {
        setIsDetectingIp(false); // IP detection is complete
      }
    };

    if (open && !contactId) { // Only run IP detection in creation mode
      detectCountryByIp();
    } else if (open && contactId && initialData) {
        // If in edit mode and initialData has a phone, try to set the flag based on that
        const detectedFromInitialPhone = detectCountryFromPhone(initialData.phone);
        if (detectedFromInitialPhone) {
            setSelectedCountry(detectedFromInitialPhone);
        } else {
            setSelectedCountry(null); // Clear if no country can be detected from initial phone
        }
        setIsDetectingIp(false); // No IP detection needed in edit mode
    }

    // When dialog opens, reset form state
    if (open) {
      if (contactId && initialData) {
        setFormData({
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone,
          message: initialData.message,
          status: initialData.status,
          propertyId: initialData.property_id || propertyId || null,
          consent: initialData.consent ?? true,
        });
      } else {
        // Mode création - réinitialiser le formulaire
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          status: 'new',
          propertyId: propertyId || null,
          consent: true,
        });
        // IP detection will handle setting selectedCountry and phone for new forms
      }
      setFormErrors({});
    }
  }, [open, contactId, initialData, propertyId]);


 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue: string | boolean = value;

    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      newValue = e.target.checked;
    }

    if (name === 'phone') {
      // Use AsYouType formatter from libphonenumber-js for real-time formatting
      const formatter = new AsYouType(selectedCountry?.iso2);
      const formattedValue = formatter.input(value);

      newValue = formattedValue; // Set newValue to formatted string

      // Client-side validation for phone as user types (remains)
      if (formattedValue.length > 0) {
        const phoneNumber = parsePhoneNumberFromString(formattedValue, selectedCountry?.iso2);
        if (phoneNumber && phoneNumber.isValid()) {
          setFormErrors(prev => ({ ...prev, phone: '' }));
        } else {
          if (formattedValue.trim().length > 0) {
            setFormErrors(prev => ({ ...prev, phone: 'Numéro de téléphone invalide.' }));
          } else {
            setFormErrors(prev => ({ ...prev, phone: '' }));
          }
        }
      } else {
        setFormErrors(prev => ({ ...prev, phone: '' }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear generic errors if input is being filled
    if (value && formErrors[name] && name !== 'phone') { // Avoid clearing phone error too aggressively
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  // New: Country Selection Change Handler for the dropdown
  const handleCountrySelectChange = (iso2Code: string) => {
    const selected = countryCodes.find(c => c.iso2 === iso2Code);
    if (selected) {
      setSelectedCountry(selected);

      // Adjust the phone input value to match the new country code
      const currentPhoneDigits = formData.phone.replace(/\D/g, ''); // Get only digits from current input

      let newPhoneNumberString = '';
      const currentPhoneNumber = parsePhoneNumberFromString(formData.phone);

      if (currentPhoneNumber && currentPhoneNumber.countryCallingCode === selected.code) {
          // If the existing number already matches the new country code, keep it
          newPhoneNumberString = currentPhoneNumber.formatInternational();
      } else {
          // Otherwise, add the new country code and potentially the national number
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
          // If the number is still invalid after auto-adjusting, clear error and set new code
          setFormData(prev => ({ ...prev, phone: `+${selected.code} ` }));
          setFormErrors(prev => ({ ...prev, phone: '' }));
      }
    }
  };


  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Veuillez entrer votre nom";
    }

    if (!formData.email.trim()) {
      errors.email = "Veuillez entrer votre email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Veuillez entrer un email valide";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Veuillez entrer votre numéro de téléphone";
    } else {
      // **IMPORTANT: Final validation for phone number using libphonenumber-js**
      const phoneNumber = parsePhoneNumberFromString(formData.phone, selectedCountry?.iso2);
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.phone = 'Veuillez saisir un numéro de téléphone valide et complet.';
      }
    }

    if (!formData.message.trim()) {
      errors.message = "Veuillez entrer votre message";
    }
    if (!formData.consent) {
        errors.consent = "Vous devez accepter les conditions générales.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Échouée",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Format phone number to E.164 before sending
    const phoneNumberParsed = parsePhoneNumberFromString(formData.phone, selectedCountry?.iso2);
    const phoneNumberForDb = phoneNumberParsed ? phoneNumberParsed.format('E.164') : formData.phone;

    try {
      const url = contactId
        ? `/api/advisor-requests/${contactId}`
        : '/api/advisor-requests';

      const method = contactId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          propertyId: formData.propertyId,
          name: formData.name,
          email: formData.email,
          phone: phoneNumberForDb, // Use the E.164 formatted number
          message: formData.message,
          status: formData.status,
          consent: formData.consent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        toast({
          title: contactId ? "Mise à jour réussie" : "Message envoyé",
          description: data.message ||
            (contactId
              ? "La demande a été mise à jour avec succès."
              : "Votre demande a été envoyée avec succès. Un conseiller vous contactera bientôt."),
        });
        if (onSuccess) onSuccess();
      } else {
        const errorMessage = data.message || "Une erreur est survenue. Veuillez réessayer.";
        const errors = data.errors || {};

        setFormErrors(errors);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion.",
        variant: "destructive",
      });
      console.error("Erreur réseau ou inattendue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        status: 'new',
        propertyId: propertyId || null,
        consent: true,
      });
      setFormErrors({});
      setSelectedCountry(null); // Reset selected country on close
      setIsDetectingIp(true); // Reset IP detection state for next open
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
  <DialogContent className={`max-w-2xl max-h-[90vh] overflow-auto ${contactId ? 'bg-gray-900 dark:bg-gray-900 text-white dark:text-white' : 'bg-white dark:bg-white text-gray-800 dark:text-gray-800'}`}>
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-center">
        {contactId ? 'Modifier la demande' : 'Contactez un Conseiller'}
      </DialogTitle>
      <DialogDescription className={`text-base text-center ${contactId ? 'text-gray-300' : ''}`}>
        {contactId
          ? 'Modifiez les informations de cette demande de contact.'
          : 'Remplissez le formulaire ci-dessous et un conseiller vous contactera dans les plus brefs délais.'}
      </DialogDescription>
    </DialogHeader>

    <Separator className="my-4" />

    <ScrollArea className="pr-4 max-h-[60vh]">
      {!isSubmitted ? (
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Nom et Prénom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-base font-medium">
                Nom <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="name"
                  name="name"
                  className={cn(
                    "pl-10", 
                    formErrors.name && "border-red-500",
                    contactId && "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  )}
                  placeholder="Nom"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
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

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="text-base font-medium">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className={cn(
                    "pl-10", 
                    formErrors.email && "border-red-500",
                    contactId && "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  )}
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
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
          </div>

          {/* Téléphone with Flag Selector */}
          <div>
            <Label htmlFor="phone" className="text-base font-medium">
              Téléphone <span className="text-red-500">*</span>
            </Label>
            <div className={cn(
              "mt-1 flex items-center border rounded-md overflow-hidden",
              formErrors.phone && "border-red-500",
              contactId ? "bg-gray-800 border-gray-600" : "bg-white"
            )}>
              {/* Country Code Selector (Dropdown) */}
              <Select onValueChange={handleCountrySelectChange} value={selectedCountry?.iso2 || ''} disabled={isDetectingIp}>
                <SelectTrigger className={cn(
                  "flex-shrink-0 w-[90px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2",
                  contactId && "bg-gray-800 text-white border-gray-600"
                )}>
                  {isDetectingIp ? (
                    <span className={`animate-pulse text-sm ${contactId ? 'text-gray-400' : 'text-gray-500'}`}>Chargement...</span>
                  ) : selectedCountry ? (
                    <span className="flex items-center space-x-1">
                      <ReactCountryFlag
                        countryCode={selectedCountry.iso2}
                        svg
                        style={{ width: '2.25em', height: '2.25em' }}
                        className="!rounded-none"
                      />
                    </span>
                  ) : (
                    <span className={contactId ? "text-gray-400" : "text-gray-500"}>Choisir</span>
                  )}
                </SelectTrigger>
                <SelectContent className={cn(
                  "max-h-[300px] overflow-y-auto",
                  contactId && "bg-gray-800 border-gray-600"
                )}>
                  {countryCodes.map((country) => (
                    <SelectItem 
                      key={country.iso2} 
                      value={country.iso2}
                      className={contactId ? "text-white hover:bg-gray-700" : ""}
                    >
                      <span className="flex items-center">
                        <ReactCountryFlag
                          countryCode={country.iso2}
                          svg
                          style={{ width: '2.25em', height: '1.25em' }}
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
                className={cn(
                  "flex-1 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                  contactId && "bg-gray-800 text-white placeholder-gray-400"
                )}
                placeholder={selectedCountry ? `ex: ${selectedCountry.code === '212' ? '6XXXXXXXX ou 7XXXXXXXX' : 'Numéro national'}` : "Votre numéro de téléphone"}
                value={formData.phone}
                onChange={handleInputChange}
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

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-base font-medium">
              Message <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2 relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </div>
              <Textarea
                id="message"
                name="message"
                className={cn(
                  "min-h-15 pl-10 pt-3", 
                  formErrors.message && "border-red-500",
                  contactId && "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                )}
                placeholder="Décrivez votre demande ou vos questions..."
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>
            {formErrors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 mt-1 flex items-center"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {formErrors.message}
              </motion.p>
            )}
          </div>

          {/* Consent Checkbox - Only show when creating new contact (not editing) */}
          {!contactId && (
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  className="w-4 h-4 text-luxe-blue bg-gray-100 accent-luxe-blue strokeWidth=1"
                  checked={formData.consent}
                  onChange={handleInputChange}
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
            </div>
          )}

          {/* Status (visible seulement en mode édition) */}
          {contactId && (
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-medium">
                Statut <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value,
                  }))
                }
              >
                <SelectTrigger id="status" className="w-full bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="new" className="text-white hover:bg-gray-700">Nouveau</SelectItem>
                  <SelectItem value="in_progress" className="text-white hover:bg-gray-700">En cours</SelectItem>
                  <SelectItem value="completed" className="text-white hover:bg-gray-700">Terminé</SelectItem>
                  <SelectItem value="archived" className="text-white hover:bg-gray-700">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </motion.form>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={variants}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className={`border p-8 rounded-lg ${contactId ? 'bg-gray-800 border-gray-600' : 'bg-green-50 border-green-200'}`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
            </motion.div>
            <h3 className={`text-xl font-semibold mb-2 ${contactId ? 'text-green-400' : 'text-green-800'}`}>
              {contactId ? "Mise à jour réussie" : "Message envoyé avec succès !"}
            </h3>
            <p className={`text-base mb-4 ${contactId ? 'text-gray-300' : 'text-gray-700'}`}>
              {contactId
                ? "La demande a été mise à jour avec succès."
                : "Merci pour votre message. Un de nos conseillers vous contactera dans les plus brefs délais."}
            </p>
            <div className={`p-4 rounded-md border ${contactId ? 'bg-gray-700 border-gray-600' : 'bg-white border-green-100'}`}>
              <p className={`text-sm ${contactId ? 'text-gray-300' : 'text-gray-600'}`}>
                📞 <strong>Délai de réponse :</strong> 24 à 48 heures<br />
                📧 <strong>Email de confirmation :</strong> {formData.email}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </ScrollArea>

    <Separator className="my-4" />

    <DialogFooter className="flex justify-end gap-3">
      {!isSubmitted ? (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className={`transition-all hover:scale-102 ${contactId ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'text-gray-900'}`}
          >
            <XCircle className={`h-4 w-4 mr-2 ${contactId ? 'text-white' : 'dark:text-black'}`} />Annuler
          </Button>
          <Button
            type="submit"
            className="bg-luxe-blue hover:bg-blue-700 transition-all hover:bg-luxe-blue/90"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {contactId ? "Mise à jour..." : "Envoi en cours..."}
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                {contactId ? "Mettre à jour" : "Envoyer le message"}
              </>
            )}
          </Button>
        </>
      ) : (
        <Button
          onClick={handleClose}
          className="bg-green-600 hover:bg-green-700 transition-all hover:scale-102"
        >
          Fermer
        </Button>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
};

export default ConseillerForm;