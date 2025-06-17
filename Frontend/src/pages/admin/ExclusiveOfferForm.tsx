import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Loader2, Save, TrendingUp } from 'lucide-react';
import { Property } from '@/context/PropertiesContext';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Zod Schema
const formSchema = z.object({
  propertyId: z.string().min(1, "Veuillez sélectionner un bien."),
  currentValue: z.string().min(1, "Valeur actuelle requise."),
  monthlyRentalIncome: z.string().min(1, "Revenu locatif mensuel requis."),
  annualGrowthRate: z.string().min(1, "Taux de croissance annuel requis."),
  durationYears: z.string().min(1, "Durée requise."),
  initialInvestment: z.string().min(1, "Investissement initial requis."),
});

type ExclusiveOfferFormValues = z.infer<typeof formSchema>;

interface ExclusiveOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOfferAdded: () => void;
}

const ExclusiveOfferDialog: React.FC<ExclusiveOfferDialogProps> = ({ open, onOpenChange, onOfferAdded }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExclusiveOfferFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId: '',
      currentValue: '',
      monthlyRentalIncome: '',
      annualGrowthRate: '',
      durationYears: '',
      initialInvestment: '',
    },
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get('https://back-qhore.ondigitalocean.app/api/properties');
        setProperties(data.data || []);
      } catch (error) {
        console.error('Erreur récupération propriétés:', error);
      }
    };
    fetchProperties();
  }, []);

  const onSubmit = async (values: ExclusiveOfferFormValues) => {
  setIsSubmitting(true);
  const token = localStorage.getItem('access_token');

  if (!token) {
    alert("Votre session a expiré. Veuillez vous reconnecter.");
    onOpenChange(false);
    setIsSubmitting(false);
    return;
  }

  try {
  const payload = {
  property_id: values.propertyId ? parseInt(values.propertyId, 10) : null,
  current_value: parseFloat(values.currentValue.replace(/,/g, '')) || 0,
  monthly_rental_income: parseFloat(values.monthlyRentalIncome.replace(/,/g, '')) || 0,
  annual_growth_rate: parseFloat(values.annualGrowthRate.replace(/,/g, '')) || 0,
  duration_years: values.durationYears ? parseInt(values.durationYears, 10) : null,
  initial_investment: parseFloat(values.initialInvestment.replace(/,/g, '')) || 0,
};


console.log("Payload envoyé :", payload);


   await axios.post('https://back-qhore.ondigitalocean.app/api/exclusive-offers', payload, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


    toast({
      title: 'Offre ajoutée',
      description: 'Votre offre exclusive a été enregistrée avec succès.',
    });

    onOfferAdded();
    onOpenChange(false);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'offre:", error);
    toast({
      title: 'Erreur',
      description: error.response?.data?.message || error.message || 'Une erreur est survenue',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ajouter une offre exclusive
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bien associé</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2">
                        <SelectValue placeholder="Sélectionner un bien" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100 max-h-60 overflow-y-auto">
                      {properties.map((prop) => (
                        <SelectItem key={prop.id} value={String(prop.id)}>
                          {prop.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investissement initial (MAD)</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 2,000,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valeur actuelle (MAD)</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 2,500,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyRentalIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revenu locatif mensuel (MAD)</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 15,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="annualGrowthRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux de croissance (%)</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée d'investissement (années)</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-gray-800 dark:text-Black border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExclusiveOfferDialog;
