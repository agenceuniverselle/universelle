import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, User, XCircle, ChevronDown, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { countryCodes, CountryData } from '@/lib/countryCodes';
import { cn } from '@/lib/utils';
import ReactCountryFlag from 'react-country-flag';
import axios from 'axios';

interface ExpertEditData {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_date: string;
  expert: string;
}

interface ExpertEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ExpertEditData | null;
  onSave: (data: ExpertEditData) => Promise<void>;
}

const ExpertEditForm: React.FC<ExpertEditFormProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ExpertEditData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    preferred_date: '',
    expert: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isDetectingIp, setIsDetectingIp] = useState(false); // Changed initial state to false

  // --- Main Effect for Dialog Open/Close and Data Initialization ---
  useEffect(() => {
    console.log("ExpertEditForm useEffect [open, initialData] triggered.");

    if (open) {
      if (initialData) {
        console.log("--- Initial Data Received (on open) ---");
        console.log("initialData object:", initialData);
        console.log("initialData.phone value:", initialData.phone);

        const processedInitialData = { ...initialData };

        // Convert ISO timestamp to YYYY-MM-DD for HTML date input
        if (processedInitialData.preferred_date) {
          try {
            const dateObj = new Date(processedInitialData.preferred_date);
            if (!isNaN(dateObj.getTime())) {
              processedInitialData.preferred_date = dateObj.toISOString().split('T')[0];
              console.log("Processed preferred_date:", processedInitialData.preferred_date);
            } else {
              console.warn("Invalid preferred_date from initialData:", processedInitialData.preferred_date);
              processedInitialData.preferred_date = '';
            }
          } catch (e) {
            console.error("Error parsing preferred_date from initialData:", processedInitialData.preferred_date, e);
            processedInitialData.preferred_date = '';
          }
        }

        setFormData(processedInitialData);
        setFormErrors({});
        setIsLoading(false);

        // --- Phone number parsing and country detection logic for EDIT MODE ---
        let detectedCountryFromPhone: CountryData | null = null;
        if (processedInitialData.phone) {
          console.log("Attempting to parse initialData.phone for country detection:", processedInitialData.phone);
          const phoneNumber = parsePhoneNumberFromString(processedInitialData.phone);

          if (phoneNumber && phoneNumber.country) {
            console.log("Phone number parsed, country detected:", phoneNumber.country, "National number:", phoneNumber.nationalNumber);
            const country = countryCodes.find(c => c.iso2 === phoneNumber.country);
            if (country) {
              console.log("Matching country found in list:", country);
              detectedCountryFromPhone = country;
            } else {
              console.log("Country from phone number not found in our list. Will attempt IP detection.");
            }
          } else {
            console.log("Phone number not parsable or no country detected from it. Will attempt IP detection.");
          }
        } else {
          console.log("Initial phone is empty. Will proceed to IP detection.");
        }

        setSelectedCountry(detectedCountryFromPhone);
        // Only trigger IP detection if no country was determined from the initial phone number.
        setIsDetectingIp(!detectedCountryFromPhone);
        console.log(`Final isDetectingIp set to: ${!detectedCountryFromPhone}. Final selectedCountry: ${detectedCountryFromPhone?.iso2 || "null"}`);

      } else {
        console.warn("Dialog opened but initialData is null. Resetting to empty form.");
        setFormData({ id: '', name: '', email: '', phone: '', message: '', preferred_date: '', expert: '' });
        setFormErrors({});
        setIsLoading(false);
        setSelectedCountry(null);
        setIsDetectingIp(true); // Always true if no initialData for IP detection
      }
    } else {
      console.log("Dialog closed. Resetting all form states for next open.");
      setFormData({
        id: '', name: '', email: '', phone: '', message: '', preferred_date: '', expert: '',
      });
      setFormErrors({});
      setIsLoading(false);
      setSelectedCountry(null);
      setIsDetectingIp(false); // Reset to false, it will be set true by the first useEffect if needed
    }
  }, [open, initialData]);

  // Effect for IP country detection (fallback if phone number didn't provide country initially)
  useEffect(() => {
    const detectCountryByIp = async () => {
      // ONLY RUN IF WE ARE IN THE `isDetectingIp` MODE AND NO COUNTRY IS SELECTED YET
      // AND THE DIALOG IS OPEN
      if (!open || selectedCountry !== null || !isDetectingIp) {
        console.log("Skipping IP detection based on current state. Open:", open, "Selected Country:", selectedCountry?.iso2 || "null", "Is Detecting IP:", isDetectingIp);
        return;
      }

      console.log("Starting IP detection (fallback)...");
      try {
        const response = await axios.get("https://ipinfo.io/json?token=YOUR_IPINFO_TOKEN"); // Replace YOUR_IPINFO_TOKEN
        const data = response.data;
        console.log("IP API response (ipinfo.io):", data);

        let detectedCountry: CountryData | undefined;
        if (data.country) {
          detectedCountry = countryCodes.find((c) => c.iso2 === data.country);
        }

        if (!detectedCountry) {
          console.warn("Detected country not found in list or IP detection failed. Falling back to Morocco (MA).");
          detectedCountry = countryCodes.find((c) => c.iso2 === "MA");
          if (!detectedCountry) {
            console.error("Morocco country code not found in list. Please check countryCodes.ts");
            return;
          }
        }

        setSelectedCountry(detectedCountry);
        console.log("Selected country set to:", detectedCountry.name);

        // Crucial change: Only pre-fill the phone if it's currently empty or doesn't start with a plus sign,
        // suggesting it's not in an international format already.
        // This prevents overwriting a valid phone number from initialData.
        if (!formData.phone.trim() || !formData.phone.startsWith('+')) {
            const newPhoneValue = `+${detectedCountry.code} `;
            console.log("formData.phone was empty/not international. Pre-filling with detected country code:", newPhoneValue);
            setFormData((prev) => ({
                ...prev,
                phone: newPhoneValue,
            }));
        } else {
            console.log("formData.phone is already populated, not pre-filling from IP detection. Current phone:", formData.phone);
        }

      } catch (error) {
        console.error("Error detecting country by IP for ExpertEditForm:", error);
        const morocco = countryCodes.find((c) => c.iso2 === "MA");
        if (morocco) {
          setSelectedCountry(morocco);
          if (!formData.phone.trim() || !formData.phone.startsWith('+')) {
            setFormData((prev) => ({ ...prev, phone: `+${morocco.code} ` }));
          }
        }
      } finally {
        setIsDetectingIp(false);
        console.log("IP detection finished.");
      }
    };

    detectCountryByIp();
  }, [open, selectedCountry, isDetectingIp]); // Removed formData.phone from dependencies here to prevent re-triggering this effect when user types

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let newValue: string = value;

    if (name === 'phone') {
      const formatter = new AsYouType(selectedCountry?.iso2);
      const formattedValue = formatter.input(value);
      newValue = formattedValue;

      if (formattedValue.trim().length > 0) {
        const phoneNumber = parsePhoneNumberFromString(formattedValue, selectedCountry?.iso2);
        if (phoneNumber && phoneNumber.isValid()) {
          setFormErrors(prev => ({ ...prev, phone: '' }));
        } else {
          setFormErrors(prev => ({ ...prev, phone: 'Numéro de téléphone invalide.' }));
        }
      } else {
        setFormErrors(prev => ({ ...prev, phone: '' }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (value && formErrors[name] && name !== 'phone') {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountrySelectChange = (iso2Code: string) => {
    console.log("Country select changed to:", iso2Code);
    const selected = countryCodes.find((c) => c.iso2 === iso2Code);
    if (selected) {
      setSelectedCountry(selected);
      setIsDetectingIp(false); // Explicitly selected, so no longer detecting via IP.

      const currentPhoneValue = formData.phone;
      const parsedCurrentPhone = parsePhoneNumberFromString(currentPhoneValue);

      let newPhoneNumberString = '';
      if (parsedCurrentPhone && parsedCurrentPhone.nationalNumber) {
        // If there's a national number, try to reformat it with the new country code
        const asYouType = new AsYouType(selected.iso2);
        const formattedNationalPart = asYouType.input(parsedCurrentPhone.nationalNumber);
        newPhoneNumberString = `+${selected.code} ${formattedNationalPart.replace(/^\+?\d*/, '').trim()}`;
        newPhoneNumberString = asYouType.input(newPhoneNumberString); // Final pass for full formatting
      } else {
        // If no national number or could not parse, just put the new country code prefix
        newPhoneNumberString = `+${selected.code} `;
      }

      console.log("Updating phone number in formData to:", newPhoneNumberString);
      setFormData((prev) => ({ ...prev, phone: newPhoneNumberString }));

      // Also re-validate the new phone number string immediately
      const phoneNumber = parsePhoneNumberFromString(newPhoneNumberString, selected.iso2);
      if (phoneNumber && phoneNumber.isValid()) {
        setFormErrors((prev) => ({ ...prev, phone: "" }));
      } else {
        setFormErrors((prev) => ({ ...prev, phone: "Numéro de téléphone invalide." }));
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Veuillez entrer votre nom";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email invalide";
    if (!formData.message.trim()) errors.message = "Veuillez entrer un message";
    if (!formData.expert.trim()) errors.expert = "Veuillez choisir un expert";

    if (!formData.phone.trim()) {
      errors.phone = "Le numéro de téléphone est obligatoire.";
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        formData.phone,
        selectedCountry?.iso2 || undefined
      );
      console.log("Validating phone number on submit:", formData.phone, "Parsed:", phoneNumber?.format('E.164') || 'N/A', "isValid:", phoneNumber?.isValid());
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.phone =
          "Veuillez saisir un numéro de téléphone valide et complet.";
      }
    }

    if (!formData.preferred_date.trim()) {
        errors.preferred_date = "Veuillez choisir une date pour le rendez-vous.";
    }

    setFormErrors(errors);
    console.log("Form validation errors:", errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const phoneNumberParsed = parsePhoneNumberFromString(formData.phone, selectedCountry?.iso2);
    const phoneNumberForDb = phoneNumberParsed ? phoneNumberParsed.format('E.164') : formData.phone;

    const payload: ExpertEditData = {
      ...formData,
      phone: phoneNumberForDb,
    };

    console.log("Submitting payload:", payload);

    try {
      await onSave(payload);
      toast({ title: 'Mise à jour réussie', description: 'Les données de l\'expert ont été mises à jour.' });
      onOpenChange(false);
    } catch (error) {
      console.error("Error during save:", error);
      toast({ title: 'Erreur', description: "Impossible de mettre à jour les données de l'expert.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData && open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg dark:bg-white">
          <DialogHeader>
            <DialogTitle className="dark:text-black">Erreur de chargement</DialogTitle>
          </DialogHeader>
          <div className="text-center py-10">
            <p className="text-red-600">Impossible de charger les données de l'expert. Veuillez réessayer.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!initialData) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Modifier l'Expert</DialogTitle>
          <DialogDescription>
            Modifier les informations de l'expert "{initialData?.name || ''}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="name" className="dark:text-white">Nom complet<span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
  id="name"
  name="name"
  className={cn(
    "transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
    "dark:text-white", // This one is already there, consider if it's redundant with "text-black" above
    formErrors.name && "border-red-500"
  )}
  value={formData.name}
  onChange={handleInputChange}
/>
                <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {formErrors.name && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{formErrors.name}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="email" className="dark:text-white">Email<span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                   className={cn(
    "transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
    "dark:text-white", // This one is already there, consider if it's redundant with "text-black" above
    formErrors.name && "border-red-500"
  )}
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{formErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="phone" className="dark:text-white">Téléphone<span className="text-red-500">*</span></Label>
              <div className={cn(
                "mt-1 flex items-center border rounded-md overflow-hidden bg-white",
                formErrors.phone && "border-red-500"
              )}>
                <Select
                  onValueChange={handleCountrySelectChange}
                  value={selectedCountry?.iso2 || ''}
                  disabled={isDetectingIp}
                >
                  <SelectTrigger className="transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
 flex-shrink-0 w-[90px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2">
                    <div className="flex items-center justify-between w-full">
                      {isDetectingIp ? (
                        <span className="animate-pulse text-gray-500 text-sm">Chargement...</span>
                      ) : selectedCountry ? (
                        <span className="flex items-center space-x-1">
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
                  <SelectContent className="max-h-[300px] overflow-y-auto  bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700">
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

                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30"
                  placeholder={selectedCountry ? `ex: ${selectedCountry.code === '212' ? '6XXXXXXXX ou 7XXXXXXXX' : 'Numéro national'}` : "Votre numéro de téléphone"}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.phone && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{formErrors.phone}
                </p>
              )}
            </div>

            <div className="flex-1">
              <Label htmlFor="preferred_date" className="dark:text-white">Date préférée pour RDV<span className="text-red-500">*</span></Label>
              <Input
                 type="date"
  id="preferred_date"
  className={cn(
    "transition-all duration-200",
    "hover:border-luxe-blue/30",
    "focus:scale-[1.01]",
    "bg-white text-black border-gray-300",
    "dark:bg-gray-900 dark:text-white dark:border-gray-700",
    "dark:placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-luxe-blue/50",
    "dark:focus:ring-luxe-blue/30",
    "accent-luxe-blue", // Peut avoir un effet sur certains navigateurs
    formErrors.preferred_date && "border-red-500"
  )}           name="preferred_date"
                value={formData.preferred_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {formErrors.preferred_date && (
                <p className="text-sm text-red-600 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />{formErrors.preferred_date}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expert" className="dark:text-white">Type d'Expert<span className="text-red-500">*</span></Label>
            <Select
              value={formData.expert}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, expert: value }));
                if (formErrors.expert) {
                  setFormErrors(prev => ({ ...prev, expert: '' }));
                }
              }}
            >
              <SelectTrigger id="expert" className={cn(
  "w-full",
  "transition-all duration-200",
  "hover:border-luxe-blue/30",
  "bg-white text-black border-gray-300",
  "dark:bg-gray-900 dark:text-white dark:border-gray-700",
  "focus:outline-none focus:ring-2 focus:ring-luxe-blue/50",
  "dark:focus:ring-luxe-blue/30",
  formErrors.expert && "border-red-500"
)}
>
                <SelectValue placeholder="-- Sélectionnez un type d'expert --" />
              </SelectTrigger>
              <SelectContent className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
                <SelectItem value="Notaire">Notaire</SelectItem>
                <SelectItem value="Avocat spécialisé en immobilier">Avocat spécialisé en immobilier</SelectItem>
                <SelectItem value="Géomètre-expert">Géomètre-expert</SelectItem>
                <SelectItem value="Expert immobilier / évaluateur">Expert immobilier / évaluateur</SelectItem>
                <SelectItem value="Architecte">Architecte</SelectItem>
                <SelectItem value="Conseiller en investissement immobilier">Conseiller en investissement immobilier</SelectItem>
                <SelectItem value="Agent immobilier">Agent immobilier</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.expert && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />{formErrors.expert}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="message" className="dark:text-white">Message / Description<span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              name="message"
              className={cn("dark:text-black  dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 ", formErrors.message && "border-red-500")}
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
            />
            {formErrors.message && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />{formErrors.message}
              </p>
            )}
          </div>

          <DialogFooter className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all hover:scale-102 text-gray-900">
              <XCircle className="h-4 w-4 mr-2 dark:text-black" />
              Annuler
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpertEditForm;