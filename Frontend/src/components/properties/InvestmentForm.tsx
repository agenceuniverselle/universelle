import React, { useState, useEffect, useRef } from 'react';
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
import { Property } from '@/context/PropertiesContext';
import {
  DollarSign,
  User,
  Mail,
  Phone,
  FileText,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Check,
  ChevronLeft,
  Calendar,
  Download,
  Loader2,
  Wallet,
  XCircle
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import ReactCountryFlag from 'react-country-flag';
// Import the updated country data and phone detection logic
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { countryCodes, CountryData, detectCountryFromPhone } from '@/lib/countryCodes';
interface InvestmentFormProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatAmount = (amount: string): string => {
  // Ensure we're only formatting numbers. If "Autre", return as is.
  if (amount === "Autre") {
    return amount;
  }
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  property,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    participationType: 'passive',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    comments: '',
    consent: true, 
   
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isDetectingIp, setIsDetectingIp] = useState(true); // For initial IP detection

useEffect(() => {
  // Fallback: définir une valeur par défaut si l'IP n'est pas détectable
  const fallbackCountry = countryCodes.find(c => c.iso2 === 'MA'); // Maroc
  if (fallbackCountry) {
    setSelectedCountry(fallbackCountry);
    setFormData(prev => ({
      ...prev,
      phone: `+${fallbackCountry.code} `,
    }));
  }
  setIsDetectingIp(false);
}, []);
// Empty dependency array means this runs once on component mount

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const slideDirection = useRef(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setFormData({
        amount: '',
        participationType: 'passive',
        firstName: '',
        'lastName': '',
        email: '',
        phone: '',
        nationality: '',
        comments: '',
        consent: true,
      });
      setFormErrors({});
    }
  }, [open]);
 // Specific handler for the checkbox
 // Specific handler for the checkbox
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
    // Clear error if checkbox is checked
    if (checked && formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};
     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name === 'phone') {
      // Use AsYouType formatter from libphonenumber-js for real-time formatting
      const formatter = new AsYouType(selectedCountry?.iso2);
      const formattedValue = formatter.input(value);

      setFormData(prev => ({ ...prev, phone: formattedValue }));


      // Client-side validation: Check if the number is potentially valid as typed
      if (value.length > 0) {
        // Parse using the currently selected country as a hint
        const phoneNumber = parsePhoneNumberFromString(value, selectedCountry?.iso2);
        if (phoneNumber && phoneNumber.isValid()) {
          setFormErrors(prev => ({ ...prev, phone: '' })); // Clear error if valid
        } else {
          // Only show error if the number is not empty and not valid
          // This allows users to type without immediate errors before completing the number
          if (value.trim().length > 0) {
            setFormErrors(prev => ({ ...prev, phone: 'Numéro de téléphone invalide.' }));
          } else {
            setFormErrors(prev => ({ ...prev, phone: '' })); // Clear if empty
          }
        }
      } else {
        setFormErrors(prev => ({ ...prev, phone: '' })); // Clear error if input is empty
      }
    } else {
      // Handle other form fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };


    // --- Country Selection Change Handler ---
    const handleCountrySelectChange = (iso2Code: string) => {
        const selected = countryCodes.find(c => c.iso2 === iso2Code);
        if (selected) {
            setSelectedCountry(selected);

            // Adjust the phone input value to match the new country code
            const currentPhoneDigits = formData.phone.replace(/\D/g, ''); // Get only digits from current input

            let newPhoneNumberString = '';
            // If the current digits already start with the new country code, just use them
            if (currentPhoneDigits.startsWith(selected.code)) {
                newPhoneNumberString = `+${currentPhoneDigits}`;
            } else {
                // Otherwise, prepend the new country code to the *national* part of the number.
                // If the number currently has a different country code, remove it first.
                const currentPhoneNumber = parsePhoneNumberFromString(formData.phone);
                if (currentPhoneNumber && currentPhoneNumber.country) {
                    // Extract national number if a country was detected
                    const nationalNumber = currentPhoneNumber.nationalNumber;
                    newPhoneNumberString = `+${selected.code}${nationalNumber}`;
                } else {
                    // If no country was detected from current input, just add new code
                    newPhoneNumberString = `+${selected.code}${currentPhoneDigits}`;
                }
            }
            
            // Format and validate the new phone number string
            const phoneNumber = parsePhoneNumberFromString(newPhoneNumberString, selected.iso2);
            if (phoneNumber && phoneNumber.isValid()) {
                setFormData(prev => ({ ...prev, phone: phoneNumber.formatInternational() }));
                setFormErrors(prev => ({ ...prev, phone: '' }));
            } else {
                // If the existing digits don't form a valid number for the new country, clear input or keep previous
                // For simplicity, we'll just set the new country code and let user type
                setFormData(prev => ({ ...prev, phone: `+${selected.code} ` }));
                setFormErrors(prev => ({ ...prev, phone: '' })); // Clear error temporarily
            }
        }
    };


  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: '',
      });
    }
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.amount) {
          errors.amount = "Veuillez entrer un montant d'investissement";
        }
        if (!formData.participationType) {
          errors.participationType = "Veuillez sélectionner un type de participation";
        }
        break;
      case 2:
        if (!formData.firstName) {
          errors.firstName = "Veuillez entrer votre prénom";
        }
        if (!formData.lastName) {
          errors.lastName = "Veuillez entrer votre nom";
        }
        if (!formData.email) {
          errors.email = "Veuillez entrer votre email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Veuillez entrer un email valide";
        }
        if (!formData.phone) {
          errors.phone = "Veuillez entrer votre numéro de téléphone";
        }
        if (!formData.nationality) {
          errors.nationality = "Veuillez sélectionner votre nationalité";
        }
        break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      slideDirection.current = 1;
      setStep(step + 1); // Only increment if validation passes
    }
  };

  const prevStep = () => {
    slideDirection.current = -1;
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // CSRF token is not strictly necessary for this client-side form logic,
  // but keeping it if your API actually uses it.


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }
// Final validation of the phone number before sending
        const phoneNumber = parsePhoneNumberFromString(formData.phone, selectedCountry?.iso2);
        if (!phoneNumber || !phoneNumber.isValid()) {
            setFormErrors(prev => ({ ...prev, phone: 'Veuillez saisir un numéro de téléphone valide et complet.' }));
            toast({
                title: "Validation Échouée",
                description: "Le numéro de téléphone n'est pas valide ou incomplet.",
                variant: "destructive",
            });
            return; // Stop submission if phone is invalid
        }
    setIsLoading(true);
// Get the phone number in E.164 format for the database
        // E.164 format is '+[CountryCode][SubscriberNumber]' without any spaces or dashes
        const phoneNumberForDb = phoneNumber.format('E.164');
        console.log("Phone number to send to backend (E.164):", phoneNumberForDb);
    const formDataToSend = new FormData();
    formDataToSend.append('montant_investissement', formData.amount);
    formDataToSend.append('type_participation', formData.participationType);
    formDataToSend.append('prenom', formData.firstName);
    formDataToSend.append('nom', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('telephone', phoneNumberForDb);
    formDataToSend.append('nationalite', formData.nationality);
    formDataToSend.append('comments', formData.comments);
    formDataToSend.append('consent', formData.consent ? '1' : '0'); // Add consent

    try {
      // You should send the request to your actual backend endpoint here.
      // Make sure your backend can handle 'multipart/form-data' if you were sending files.
      // Since we removed file uploads, 'application/json' might be more appropriate
      // if your backend supports it, otherwise keep 'multipart/form-data'.
   await axios.post(`https://back-qhore.ondigitalocean.app/api/investors/${property.id}/store`, formDataToSend, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  }
});


      // Show the success toast
   

      // Reset form and close dialog after successful submission
      setIsSubmitted(true)
      
     
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Error submitting investment form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const MinEntryPrice = property.investmentDetails?.minEntryPrice || '500,000 MAD';
  // Attempt to parse the numeric part of MinEntryPrice
  const numericPriceMatch = MinEntryPrice.match(/\d[\d,]*/);
  const numericPrice = numericPriceMatch ? parseInt(numericPriceMatch[0].replace(/,/g, '')) : 500000;

  const suggestedAmounts = [
    numericPrice,
    Math.round(numericPrice * 1.5), // Use Math.round for cleaner numbers
    numericPrice * 2,
  ];

  const renderStepContent = () => {
    
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            custom={slideDirection.current}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="space-y-4 py-2"
          >

            <div>
              <Label htmlFor="amount" className="text-base font-medium">
                Montant d'investissement (MAD)<span className="text-red-500">*</span>
              </Label>
              <div className="mt-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Wallet className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    placeholder="Entrez le montant..."
                    className={cn("pl-10", formErrors.amount && "border-red-500")}
                    value={formData.amount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                      setFormData({ ...formData, amount: formatAmount(value) }); // Format for display
                    }}
                  />
                </div>
                {formErrors.amount ? (
                  <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Montant minimum d'entrée: {MinEntryPrice}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Label className="text-base font-medium">Montants suggérés (MAD)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {suggestedAmounts.map((amount, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={formData.amount === amount.toLocaleString() ? "default" : "outline"}
                    className={cn("h-12 text-base transition-all hover:scale-102",
                      formData.amount === amount.toLocaleString() ? "bg-luxe-blue shadow-md" : "")}
                    onClick={() => setFormData({ ...formData, amount: amount.toLocaleString() })}
                  >
                    {formatAmount(amount.toString())} MAD
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={formData.amount === "Autre" ? "default" : "outline"}
                  className={cn(
                    "h-12 text-base transition-all hover:scale-102",
                    formData.amount === "Autre" ? "bg-luxe-blue shadow-md" : ""
                  )}
                  onClick={() => {
                    setFormData({ ...formData, amount: "Autre" });
                  }}
                >
                  Autre
                </Button>

              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="participationType" className="text-base font-medium">
                Type de participation<span className="text-red-500">*</span>
              </Label>
              {formErrors.participationType && (
                <p className="text-sm text-red-500">{formErrors.participationType}</p>
              )}
              <RadioGroup
                value={formData.participationType}
                onValueChange={(value) => handleSelectChange(value, 'participationType')}
                className="mt-2 space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="passive" id="passive" />
                  <Label htmlFor="passive" className="flex-1 cursor-pointer">
                    <div className="font-medium">Investisseur passif</div>
                    <div className="text-sm text-gray-500">Investissement sans implication dans les décisions opérationnelles</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="partner" id="partner" />
                  <Label htmlFor="partner" className="flex-1 cursor-pointer">
                    <div className="font-medium">Partenaire</div>
                    <div className="text-sm text-gray-500">Participation active aux décisions stratégiques du projet</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="coDev" id="coDev" />
                  <Label htmlFor="coDev" className="flex-1 cursor-pointer">
                    <div className="font-medium">Co-développement</div>
                    <div className="text-sm text-gray-500">Implication directe dans le développement du projet</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            custom={slideDirection.current}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="space-y-4 py-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-base font-medium">
                  Prénom<span className="text-red-500">*</span>
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="firstName"
                    name="firstName"
                    className={cn("pl-10", formErrors.firstName && "border-red-500")}
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-base font-medium">
                  Nom<span className="text-red-500">*</span>
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="lastName"
                    name="lastName"
                    className={cn("pl-10", formErrors.lastName && "border-red-500")}
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email<span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className={cn("pl-10", formErrors.email && "border-red-500")}
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>
<div>
              <Label htmlFor="phone" className="text-base font-medium">
                Téléphone<span className="text-red-500">*</span>
              </Label>
              <div className={cn(
                "mt-1 flex items-center border rounded-md overflow-hidden bg-white",
                formErrors.phone && "border-red-500"
              )}>
                {/* Country Code Selector (Dropdown) */}
                <Select onValueChange={handleCountrySelectChange} value={selectedCountry?.iso2 || ''} disabled={isDetectingIp}>
                  <SelectTrigger className="flex-shrink-0 w-[90px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2">
                    {isDetectingIp ? (
                      <span className="animate-pulse text-gray-500 text-sm">Chargement...</span>
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
                      <span className="text-gray-500">Choisir</span>
                    )}
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {countryCodes.map((country) => (
                      <SelectItem key={country.iso2} value={country.iso2}>
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
                  className="flex-1 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder={selectedCountry ? `ex: ${selectedCountry.code === '212' ? '6XXXXXXXX ou 7XXXXXXXX' : 'Numéro national'}` : "Votre numéro de téléphone"}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.phone && (
                <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

             
        

            <div>
              <Label htmlFor="nationality" className="text-base font-medium">
                Nationalité<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.nationality}
                onValueChange={(value) => handleSelectChange(value, 'nationality')}
              >
                <SelectTrigger id="nationality" className={cn(formErrors.nationality && "border-red-500")}>
                  <SelectValue placeholder="Sélectionnez votre nationalité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marocaine">Marocaine</SelectItem>
                  <SelectItem value="française">Française</SelectItem>
                  <SelectItem value="algérienne">Algérienne</SelectItem>
                  <SelectItem value="tunisienne">Tunisienne</SelectItem>
                  <SelectItem value="américaine">Américaine</SelectItem>
                  <SelectItem value="canadienne">Canadienne</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.nationality && (
                <p className="text-sm text-red-500 mt-1">{formErrors.nationality}</p>
              )}
            </div>

            <div className="mt-6">
              <Label htmlFor="comments" className="text-base font-medium">
                Commentaires (optionnel)
              </Label>
              <Textarea
                id="comments"
                name="comments"
                className="min-h-32 mt-1"
                placeholder="Questions ou commentaires supplémentaires..."
                value={formData.comments}
                onChange={handleInputChange}
              />
            </div>
             {/* Consent Checkbox for Investment Form */}
           <div className="flex items-start space-x-2">
  <input
    type="checkbox"
    id="consent-checkbox"
    name="consent"
    className={cn(
      "w-4 h-4 mt-0.5 text-luxe-blue bg-gray-100 accent-luxe-blue rounded",
      formErrors.consent && "border-red-500 ring-red-500"
    )}
    checked={formData.consent}
    onChange={handleChange}
  />
  <Label htmlFor="consent-checkbox" className="text-sm font-medium text-black ">
    J'accepte les{' '}
    <a
      href="/PrivacyPolicyPage" // ou votre lien Google Doc
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      conditions générales et la politique de confidentialité
    </a>
    <span className="text-red-500">*</span>
  </Label>

                {formErrors.consent && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.consent}</p>
                )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[100vh] overflow-auto bg-white dark:bg-white text-gray-800 dark:text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Investir dans {property.title}</DialogTitle>
          <DialogDescription className="text-base">
            Complétez le formulaire ci-dessous pour démarrer votre investissement.
          </DialogDescription>
        </DialogHeader>

{isSubmitted && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
      <div className="mb-6">
        <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Votre demande a été envoyée avec succès.
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Au nom de toute l'équipe Universelle, nous vous remercions sincèrement pour votre temps. Un conseiller vous contactera sous 24 à 48 heures pour discuter de votre investissement et planifier la suite.
        </p>
      </div>
      <button
        onClick={() => {
          setIsSubmitted(false);
          onOpenChange(false); // Fermer la modal principale
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Fermer
      </button>
    </div>
  </div>
)}
        <div className="my-4">
          <div className="flex justify-between items-center mb-2">
            {[1, 2].map((stepNumber) => ( // Changed from 3 to 2 steps
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    stepNumber === step
                      ? "bg-luxe-blue text-white scale-110 shadow-md"
                      : stepNumber < step
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500"
                  )}
                >
                  {stepNumber < step ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span className="text-xs mt-1 text-gray-500 hidden sm:block">
                  {stepNumber === 1 && "Montant"}
                  {stepNumber === 2 && "Informations"}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div
              className="bg-luxe-blue h-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <ScrollArea className="pr-4 max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={slideDirection.current}>
              {renderStepContent()}
            </AnimatePresence>
          </form>
        </ScrollArea>

        <Separator className="my-4" />

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-3 mt-4">
       
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="w-full sm:w-auto group"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
              Précédent
            </Button>
          )}
          <div className="flex-1" />
          {step < 2 ? ( // Changed from 3 to 2 steps
            <Button
              type="button"
              className="bg-luxe-blue hover:bg-luxe-blue/90 w-full sm:w-auto group"
              onClick={nextStep}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          ) : (
             <>
      {/* Your new Annuler button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)} // This closes the dialog
className="transition-all hover:scale-102 text-gray-900"      >
        <XCircle className="h-4 w-4 mr-2 dark:text-black" />
        Annuler
      </Button>
      <Button
              type="submit"
              className="bg-gold hover:bg-gold-dark w-full sm:w-auto transition-all hover:scale-102"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                "Finaliser l'investissement"
              )}
            </Button>
             </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentForm;
