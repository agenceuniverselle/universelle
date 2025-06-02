import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Check,
  Mail,
  Phone,
  User,
  XCircle,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Ajuste ce chemin selon ton projet

// Nouveaux imports pour le téléphone et la détection de pays
import {
  parsePhoneNumberFromString,
  AsYouType,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { countryCodes, CountryData } from "@/lib/countryCodes"; // Assure-toi que ces chemins sont corrects
import { cn } from "@/lib/utils"; // Assuming you have this utility for conditional classes
import ReactCountryFlag from "react-country-flag";
import axios from "axios"; // Pour la détection IP
import { Link } from "react-router-dom";

interface ExpertContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: string;
}

const ExpertContactForm: React.FC<ExpertContactFormProps> = ({
  open,
  onOpenChange,
  serviceType,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
    consent: true,
    expert: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Nouveaux états pour le téléphone et le pays ---
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );
  const [isDetectingIp, setIsDetectingIp] = useState(true);
  // --- FIN Nouveaux états ---

  // Effet pour réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        preferredDate: "",
        consent: true,
        expert: "",
      });
      setFormErrors({});
      setIsSubmitted(false);
      // Réinitialiser les états pour le téléphone et relancer la détection IP
      setSelectedCountry(null);
      setIsDetectingIp(true);
    }
  }, [open]);

  // Effet pour la détection du pays par IP au montage du composant
  useEffect(() => {
    const detectCountryByIp = async () => {
      try {
        const response = await axios.get("http://ip-api.com/json");
        const data = response.data;

        let detectedCountry: CountryData | undefined;

        if (data.status === "success" && data.countryCode) {
          detectedCountry = countryCodes.find(
            (c) => c.iso2 === data.countryCode
          );
        }

        if (!detectedCountry) {
          detectedCountry = countryCodes.find((c) => c.iso2 === "MA"); // Fallback au Maroc
          if (!detectedCountry) {
            console.error(
              "Morocco country code not found in list. Please check countryCodes.ts"
            );
            return;
          }
        }

        setSelectedCountry(detectedCountry);
        // Si le champ téléphone est vide, pré-remplir avec le code pays
        if (!formData.phone.trim()) {
          setFormData((prev) => ({
            ...prev,
            phone: `+${detectedCountry.code} `,
          }));
        }
      } catch (error) {
        console.error(
          "Error detecting country by IP for ExpertContactForm:",
          error
        );
        const morocco = countryCodes.find((c) => c.iso2 === "MA");
        if (morocco) {
          setSelectedCountry(morocco);
          if (!formData.phone.trim()) {
            setFormData((prev) => ({ ...prev, phone: `+${morocco.code} ` }));
          }
        }
      } finally {
        setIsDetectingIp(false);
      }
    };

    // Déclencher la détection IP seulement si le dialogue est ouvert et le pays non encore détecté
    if (open && selectedCountry === null && isDetectingIp) {
      detectCountryByIp();
    }
  }, [open, selectedCountry, isDetectingIp, formData.phone]); // Ajout de formData.phone aux dépendances

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // Determine the 'name' and 'value' based on the input type
    let name: string;
    let value: string | boolean; // Value can be string for text/select or boolean for checkbox

    if (e.target instanceof HTMLInputElement) {
      // It's an HTMLInputElement, so it might be a checkbox
      name = e.target.name;
      if (e.target.type === "checkbox") {
        value = e.target.checked; // Now TypeScript knows 'checked' exists
      } else {
        value = e.target.value;
      }
    } else if (
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      // It's a textarea or select, which only have 'value'
      name = e.target.name;
      value = e.target.value;
    } else {
      // Fallback for any other unexpected element type, though less common with React.ChangeEvent
      console.warn("Unexpected event target type:", e.target);
      return; // Exit if type is not handled
    }

    // Update state based on name and value
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the changed field
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };
  // Handler pour le changement de pays dans le Select
  const handleCountrySelectChange = (iso2Code: string) => {
    const selected = countryCodes.find((c) => c.iso2 === iso2Code);
    if (selected) {
      setSelectedCountry(selected);
      const currentPhoneValue = formData.phone;
      const currentPhoneNumber = parsePhoneNumberFromString(
        currentPhoneValue,
        selectedCountry?.iso2 || undefined
      );

      let newPhoneNumberString = "";
      if (currentPhoneNumber && currentPhoneNumber.nationalNumber) {
        newPhoneNumberString = `+${selected.code}${currentPhoneNumber.nationalNumber}`;
      } else {
        newPhoneNumberString = `+${selected.code} `;
      }
      setFormData((prev) => ({ ...prev, phone: newPhoneNumberString }));
      // Déclencher la validation du téléphone après le changement de pays
      setFormErrors((prev) => ({ ...prev, phone: "" })); // Clear error initially
      // Then re-validate specifically for phone if needed
      // No direct trigger for phone validation here, as it's part of validateForm on submit
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Veuillez entrer votre nom";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email invalide";
    if (!formData.message.trim()) errors.message = "Veuillez entrer un message";
    if (!formData.expert.trim()) errors.expert = "Veuillez choisir un expert";

    // --- Validation du téléphone ---
    if (!formData.phone.trim()) {
      errors.phone = "Le numéro de téléphone est obligatoire.";
    } else {
      const phoneNumber = parsePhoneNumberFromString(
        formData.phone,
        selectedCountry?.iso2 || undefined
      );
      if (!phoneNumber || !phoneNumber.isValid()) {
        errors.phone =
          "Veuillez saisir un numéro de téléphone valide et complet.";
      }
    }
    // --- FIN Validation du téléphone ---

    // Validation de la date préférée si le service le requiert (exemple: 'Rendez-vous')
    if (serviceType === "Rendez-vous" && !formData.preferredDate.trim()) {
      errors.preferredDate = "Veuillez choisir une date pour le rendez-vous.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const phoneNumberParsed = parsePhoneNumberFromString(
      formData.phone,
      selectedCountry?.iso2
    );
    const phoneNumberForDb = phoneNumberParsed
      ? phoneNumberParsed.format("E.164")
      : formData.phone;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: phoneNumberForDb, // Utilise le numéro formaté pour la DB
      message: formData.message,
      preferred_date: formData.preferredDate || null,
      consent: formData.consent,
      expert: formData.expert,
      service_type: serviceType,
    };

    try {
      const response = await fetch("/api/expert-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Demande envoyée",
          description: "Un expert vous contactera prochainement.",
        });
        setIsSubmitted(true);
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Une erreur est survenue.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg dark:bg-white">
        <DialogHeader>
          <DialogTitle className="dark:text-black">
            Parlez à un Expert
          </DialogTitle>
          <DialogDescription>
            Service choisi : <strong>{serviceType}</strong>
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="text-center py-10">
            <Check className="mx-auto text-green-500 w-12 h-12" />
            <p className="mt-4 font-semibold text-luxe-blue">
              Votre demande a été envoyée avec succès.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom et Email sur la même ligne */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="name" className="dark:text-black">
                  Nom complet<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    className="dark:text-black"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {formErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div className="flex-1">
                <Label htmlFor="email" className="dark:text-black">
                  Email<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    className="dark:text-black"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                  />
                  <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                {formErrors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Téléphone avec Select de pays et Date préférée */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="phone" className="dark:text-black">
                  Téléphone<span className="text-red-500">*</span>
                </Label>
                <div
                  className={cn(
                    "mt-1 flex items-center border rounded-md overflow-hidden bg-white",
                    formErrors.phone && "border-red-500" // Ajout de la classe d'erreur
                  )}
                >
                  {/* Country Code Selector (Dropdown) */}
                  <Select
                    onValueChange={handleCountrySelectChange}
                    value={selectedCountry?.iso2 || ""}
                    disabled={isDetectingIp}
                  >
                    {/* IMPORTANT: Changed w-[75px] to w-[90px] to provide more space */}
                    <SelectTrigger className="flex-shrink-0 w-[90px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2">
                      {/* This div uses justify-between to push content to ends */}
                      <div className="flex items-center justify-between w-full">
                        {isDetectingIp ? (
                          <span className="animate-pulse text-gray-500 text-sm">
                            Chargement...
                          </span>
                        ) : selectedCountry ? (
                          <span className="flex items-center space-x-1">
                            {" "}
                            {/* space-x-1 is fine for flag and potential text next to it */}
                            <ReactCountryFlag
                              countryCode={selectedCountry.iso2}
                              svg
                              style={{ width: "2.25em", height: "1.25em" }}
                              className="!rounded-none"
                            />
                            {/* Optional: Add country code text here if desired, space-x-1 will separate it from the flag */}
                            {/* <span className="text-sm">+{selectedCountry.code}</span> */}
                          </span>
                        ) : (
                          <span className="text-gray-500">Choisir</span>
                        )}
                        {/* The ChevronDown icon will be pushed to the right by justify-between */}
                        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />{" "}
                        {/* Added flex-shrink-0 to prevent icon from shrinking */}
                      </div>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.iso2} value={country.iso2}>
                          <span className="flex items-center">
                            <ReactCountryFlag
                              countryCode={country.iso2}
                              svg
                              style={{ width: "1.25em", height: "1.25em" }}
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
                    type="tel"
                    id="phone"
                    name="phone"
                    className="flex-1 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-black"
                    placeholder={
                      selectedCountry
                        ? `ex: ${
                            selectedCountry.code === "212"
                              ? "6XXXXXXXX ou 7XXXXXXXX"
                              : "Numéro national"
                          }`
                        : "Votre numéro de téléphone"
                    }
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Label htmlFor="preferredDate" className="dark:text-black">
                  Date préférée pour RDV<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  id="preferredDate"
                  className="dark:text-black"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]} // Empêche les dates passées
                />
                {formErrors.preferredDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors.preferredDate}
                  </p>
                )}
              </div>
            </div>

            {/* Le reste du formulaire */}
            <div className="space-y-2">
              <Label htmlFor="expert" className="dark:text-black">
                Choisissez un expert<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.expert}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, expert: value }));
                  if (formErrors.expert) {
                    setFormErrors((prev) => ({ ...prev, expert: "" }));
                  }
                }}
              >
                <SelectTrigger
                  id="expert"
                  className="w-full text-black border-gray-300"
                >
                  <SelectValue placeholder="-- Sélectionnez un expert --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Notaire">Notaire</SelectItem>
                  <SelectItem value="Avocat spécialisé en immobilier">
                    Avocat spécialisé en immobilier
                  </SelectItem>
                  <SelectItem value="Géomètre-expert">
                    Géomètre-expert
                  </SelectItem>
                  <SelectItem value="Expert immobilier / évaluateur">
                    Expert immobilier / évaluateur
                  </SelectItem>
                  <SelectItem value="Architecte">Architecte</SelectItem>
                  <SelectItem value="Conseiller en investissement immobilier">
                    Conseiller en investissement immobilier
                  </SelectItem>
                  <SelectItem value="Agent immobilier">
                    Agent immobilier
                  </SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.expert && (
                <p className="text-sm text-red-600 mt-1">{formErrors.expert}</p>
              )}
            </div>

            <div>
              <Label htmlFor="message" className="dark:text-black">
                Message<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                className="dark:text-black"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
              />
              {formErrors.message && (
                <p className="text-sm text-red-600 mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="consent"
                className="w-4 h-4 text-luxe-blue bg-gray-100 accent-luxe-blue strokeWidth=1"
                name="consent"
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
              <p className="text-sm text-red-600 -mt-2">{formErrors.consent}</p>
            )}

            <DialogFooter className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="transition-all hover:scale-102 text-gray-900"
              >
                <XCircle className="h-4 w-4 mr-2 dark:text-black" />
                Annuler
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExpertContactForm;
