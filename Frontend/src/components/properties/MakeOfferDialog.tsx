import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Check, Download, XCircle } from 'lucide-react';
import { Bien } from '@/context/BiensContext';
import axios from 'axios';
import { useLeads, LeadProvider } from '@/context/LeadContext';
import { generateOfferRecap } from '@/lib/generateOfferRecap';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import ReactCountryFlag from 'react-country-flag';

import { parsePhoneNumberFromString, AsYouType, isValidPhoneNumber } from 'libphonenumber-js';
import { countryCodes, CountryData } from '@/lib/countryCodes';
import { Link } from 'react-router-dom';

// NO MORE GLOBAL DECLARATION!

// Define the base schema without phone validation initially
// This schema will only ensure `phone` is a string and not empty.
const baseFormSchema = z.object({
  offer: z.string().min(1, { message: "L'offre doit être renseignée" }),
  fullName: z.string().min(1, { message: "Le nom complet est obligatoire" }),
  email: z.string().email({ message: "L'email n'est pas valide" }),
  phone: z.string().trim().min(1, { message: "Le numéro de téléphone est obligatoire." }), // Simple string validation
  financing: z.enum(["cash", "mortgage", "other"], { required_error: "Le mode de financement est obligatoire" }),
  message: z.string().optional(),
  consent: z.boolean().optional(),
});

type FormValues = z.infer<typeof baseFormSchema>;

interface MakeOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bien: Bien;
}

const MakeOfferDialogWithLeadContext = (props: MakeOfferDialogProps) => {
  return (
    <LeadProvider>
      <MakeOfferDialogContent {...props} />
    </LeadProvider>
  );
};

const MakeOfferDialogContent = ({ open, onOpenChange, bien }: MakeOfferDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addLead } = useLeads();

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isDetectingIp, setIsDetectingIp] = useState(true);

  // NO MORE GLOBAL ASSIGNMENT HERE!

  // Define the reactive schema inside the component to access `selectedCountry`
  const reactiveFormSchema = baseFormSchema.superRefine((data, ctx) => {
    // This `superRefine` runs after individual field validations (like `min(1)` for phone).
    // So, if phone is empty, the `min(1)` error will already be caught.
    // This `superRefine` will only run if `phone` is not empty.

    if (data.phone) { // Only validate format if phone is not empty
      const phoneNumber = parsePhoneNumberFromString(
        data.phone,
        selectedCountry?.iso2 || undefined
      );

      if (!phoneNumber || !phoneNumber.isValid()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['phone'], // Crucial: Associate this error with the 'phone' field
          message: "Veuillez saisir un numéro de téléphone valide et complet.",
        });
      }
    }
  });


  const form = useForm<FormValues>({
    // Use the reactive schema here
    resolver: zodResolver(reactiveFormSchema),
    defaultValues: {
      offer: '',
      fullName: '',
      email: '',
      phone: '',
      financing: undefined,
      message: '',
      consent: true,
    },
    mode: "onBlur" // Validate on blur for better UX
  });

  useEffect(() => {
    const detectCountryByIp = async () => {
      try {
        const response = await axios.get('https://ip-api.com/json');
        const data = response.data;

        let detectedCountry: CountryData | undefined;

        if (data.status === 'success' && data.countryCode) {
          detectedCountry = countryCodes.find(
            c => c.iso2 === data.countryCode
          );
        }

        if (!detectedCountry) {
          detectedCountry = countryCodes.find(c => c.iso2 === 'MA');
          if (!detectedCountry) {
              console.error("Morocco country code not found in list. Please check countryCodes.ts");
              return;
          }
        }

        setSelectedCountry(detectedCountry);
        if (!form.getValues('phone').trim()) {
          form.setValue('phone', `+${detectedCountry.code} `, { shouldValidate: false }); // No immediate validation here
        }
      } catch (error) {
        console.error("Error detecting country by IP for MakeOfferDialog:", error);
        const morocco = countryCodes.find(c => c.iso2 === 'MA');
        if (morocco) {
          setSelectedCountry(morocco);
          if (!form.getValues('phone').trim()) {
            form.setValue('phone', `+${morocco.code} `, { shouldValidate: false }); // No immediate validation here
          }
        }
      } finally {
        setIsDetectingIp(false);
      }
    };

    if (open) {
      setIsSuccess(false);
      form.reset({
        offer: '',
        fullName: '',
        email: '',
        phone: '',
        financing: undefined,
        message: '',
        consent: true,
      });
      setSelectedCountry(null);
      setIsDetectingIp(true);
      detectCountryByIp();
    }
  }, [open, form]);


  const handleCountrySelectChange = (iso2Code: string, fieldOnChange: (value: string) => void) => {
    const selected = countryCodes.find(c => c.iso2 === iso2Code);
    if (selected) {
      setSelectedCountry(selected);

      const currentPhoneValue = form.getValues('phone');
      const currentPhoneNumber = parsePhoneNumberFromString(currentPhoneValue, selectedCountry?.iso2 || undefined);

      let newPhoneNumberString = '';
      if (currentPhoneNumber && currentPhoneNumber.nationalNumber) {
        newPhoneNumberString = `+${selected.code}${currentPhoneNumber.nationalNumber}`;
      } else {
        newPhoneNumberString = `+${selected.code} `;
      }
      fieldOnChange(newPhoneNumberString);
      form.trigger('phone'); // Re-validate the phone field to show immediate feedback on country change
    }
  };

  const handleDownloadRecap = () => {
    const data = form.getValues();
    const nameParts = data.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const phoneNumberParsed = parsePhoneNumberFromString(data.phone, selectedCountry?.iso2);
    const phoneNumberForRecap = phoneNumberParsed ? phoneNumberParsed.format('E.164') : data.phone;

    if (!bien) {
      console.error("Bien object is not available for recap generation.");
      return;
    }

    generateOfferRecap({
      firstName: firstName,
      lastName: lastName,
      email: data.email,
      phone: phoneNumberForRecap,
      offer: data.offer,
      financing: data.financing,
      message: data.message,
      bienTitle: bien.title,
      bienPrice: bien.price,
    });
  };


  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (!bien) {
        console.error("Bien object is not available for offer submission.");
        form.setError('root.serverError', {
          type: 'manual',
          message: 'Une erreur interne est survenue. Veuillez actualiser et réessayer.',
        });
        return;
      }

      const nameParts = data.fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const phoneNumberParsed = parsePhoneNumberFromString(data.phone, selectedCountry?.iso2);
      const phoneNumberForDb = phoneNumberParsed ? phoneNumberParsed.format('E.164') : data.phone;

      await axios.post('/api/offers', {
        bien_id: bien.id,
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: phoneNumberForDb,
        offer: data.offer,
        financing: data.financing,
        message: data.message,
        consent: data.consent,
      });

      console.log('Offre soumise - Lead ajouté au CRM comme Acheteur');
      setIsSuccess(true);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lead:', error);
      form.setError('root.serverError', {
        type: 'manual',
        message: 'Une erreur est survenue lors de la soumission de votre offre. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setIsSuccess(false);
      onOpenChange(false);
      setSelectedCountry(null);
      setIsDetectingIp(true);
    }
  };

  const offerValue = form.watch('offer');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto dark:bg-white">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className='dark:text-black'>Faire une offre</DialogTitle>
              <DialogDescription>
                Soumettez votre offre pour {bien.title}
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-0" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <h3 className="font-medium text-gray-900">Détails du bien</h3>
                      <p className="text-sm text-gray-600">{bien.title}</p>
                      <p className="text-sm text-gray-600">{bien.location}</p>
                      <p className="text-sm font-semibold text-gray-900">Prix affiché: {bien.price}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className='dark:text-black'>
                          <FormLabel>Nom Complet <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom et prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="offer"
                      render={({ field }) => (
                        <FormItem className="dark:text-black">
                          <FormLabel>Montant de votre offre (MAD) <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: 1,500,000"
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className='dark:text-black'>
                        <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="exemple@email.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone with Country Selector */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className='dark:text-black'>
                        <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                        <div className={cn(
                          "mt-1 flex items-center border rounded-md overflow-hidden bg-white",
                          form.formState.errors.phone && "border-red-500"
                        )}>
                          {/* Country Code Selector (Dropdown) */}
                          <Select onValueChange={(value) => handleCountrySelectChange(value, field.onChange)} value={selectedCountry?.iso2 || ''} disabled={isDetectingIp}>
                            <SelectTrigger className="flex-shrink-0 w-[75px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2">
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
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px] overflow-y-auto">
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
                            type="tel"
                            className="flex-1 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder={selectedCountry ? `ex: ${selectedCountry.code === '212' ? '6XXXXXXXX ou 7XXXXXXXX' : 'Numéro national'}` : "Votre numéro de téléphone"}
                            value={field.value}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (selectedCountry) {
                                const formatter = new AsYouType(selectedCountry.iso2);
                                const formattedValue = formatter.input(newValue);
                                field.onChange(formattedValue);
                              } else {
                                field.onChange(newValue);
                              }
                            }}
                            onBlur={() => field.onBlur()}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="financing"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 dark:text-black">
                        <FormLabel>Mode de financement <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez votre mode de financement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Comptant</SelectItem>
                            <SelectItem value="mortgage">Crédit bancaire</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 dark:text-black">
                        <FormLabel>Message (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Détails supplémentaires sur votre offre..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Précisez toute information complémentaire sur votre offre
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2 dark:text-black">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              id="make-offer-consent"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-luxe-blue data-[state=checked]:text-white border-gray-300"
                            />
                          </FormControl>
                          <FormLabel htmlFor="make-offer-consent" className="text-sm font-normal">
                           <Label htmlFor="consent" className="text-sm font-medium dark:text-black">
                                             J'accepte les{' '}
                                             <Link
                                               to="/PrivacyPolicyPage"
                                               className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                                             >
                                               conditions générales et la politique de confidentialité
                                             </Link>
                                           </Label>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.formState.errors.root?.serverError && (
                  <p className="text-sm text-red-500 mt-2">
                    {form.formState.errors.root.serverError.message}
                  </p>
                )}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="transition-all hover:scale-102 text-gray-900"
                  >
                    <XCircle className="h-4 w-4 mr-2 dark:text-black" /> Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-luxe-blue hover:bg-luxe-blue/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>Soumettre mon offre</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <div className="py-10 px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Offre envoyée avec succès!</h2>
            <p className="text-gray-600 mb-6">
              Votre offre a bien été soumise. Notre équipe vous contactera dans les 24 heures pour discuter des prochaines étapes.
            </p>
            <div className="flex justify-center text-black">
              <Button variant="outline" className="mr-2" onClick={handleClose}>
                Fermer
              </Button>
              <Button
                className="bg-luxe-blue hover:bg-luxe-blue/90"
                onClick={handleDownloadRecap}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger récapitulatif
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferDialogWithLeadContext;
