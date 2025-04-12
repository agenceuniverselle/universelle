import React, { useState } from 'react';
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
import { Property } from '@/context/PropertiesContext';
import { useLeads, LeadProvider } from '@/context/LeadContext';

// Form schema for validation
const formSchema = z.object({
  offer: z.string().min(1, { message: "L'offre doit être renseignée" }),
  firstName: z.string().min(1, { message: "Le prénom est obligatoire" }),
  lastName: z.string().min(1, { message: "Le nom est obligatoire" }),
  email: z.string().email({ message: "L'email n'est pas valide" }),
  phone: z.string().min(8, { message: "Le téléphone doit comporter au moins 8 caractères" }),
  financing: z.enum(["cash", "mortgage", "other"], { required_error: "Le mode de financement est obligatoire" }),
  message: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions générales" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface MakeOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property;
}

// Wrap the content in this component to provide the LeadContext
const MakeOfferDialogWithLeadContext = (props: MakeOfferDialogProps) => {
  return (
    <LeadProvider>
      <MakeOfferDialogContent {...props} />
    </LeadProvider>
  );
};

// Main component content
const MakeOfferDialogContent = ({ open, onOpenChange, property }: MakeOfferDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addLead } = useLeads();
  
  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offer: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      financing: undefined,
      message: '',
     // terms: false as any,
    },
  });
  
  function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    
    // Create lead in CRM as an "Acheteur"
    try {
      addLead({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        budget: `${data.offer} MAD`,
        status: 'Qualifié', // They are qualified since they made an offer
        source: 'Formulaire d\'offre',
        notes: `Mode de financement: ${data.financing === 'cash' ? 'Comptant' : data.financing === 'mortgage' ? 'Crédit bancaire' : 'Autre'}. Message: ${data.message || 'Aucun'}`
      }, 'Acheteur', `Offre sur: ${property.title} (${property.price}). Offre proposée: ${data.offer} MAD`);
      
      console.log('Offre soumise - Lead ajouté au CRM comme Acheteur');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lead:', error);
    }
    
    // Simulate submission with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        onOpenChange(false);
      }, 3000);
    }, 1500);
  }
  
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setIsSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Faire une offre</DialogTitle>
              <DialogDescription>
                Soumettez votre offre pour {property.title}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                      <h3 className="font-medium text-gray-900">Détails du bien</h3>
                      <p className="text-sm text-gray-600">{property.title}</p>
                      <p className="text-sm text-gray-600">{property.location}</p>
                      <p className="text-sm font-semibold text-gray-900">Prix affiché: {property.price}</p>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="offer"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Montant de votre offre (MAD)*</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom*</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input placeholder="exemple@email.com" {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone*</FormLabel>
                        <FormControl>
                          <Input placeholder="+212 XXX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="financing"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Mode de financement*</FormLabel>
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
                      <FormItem className="md:col-span-2">
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
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            J'accepte les conditions générales et la politique de confidentialité*
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Annuler
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
            <div className="flex justify-center">
              <Button variant="outline" className="mr-2" onClick={handleClose}>
                Fermer
              </Button>
              <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
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
