import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeads } from "@/context/LeadContext";

const leadFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }).optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, { message: "Le numéro doit contenir au moins 10 chiffres" })
    .optional()
    .or(z.literal("")),
  status: z.string().min(1, { message: "Veuillez sélectionner un statut" }),
  source: z.string().min(1, { message: "Veuillez sélectionner une source" }),
  interestProperty: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
  firstContactDate: z.date({ required_error: "Veuillez sélectionner une date" }),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const previousLeadSources = [
  "Site web", "Appel entrant", "Recommandation", "Réseau social", "Salon immobilier", "Publicité", "Autre"
];

const statusOptions = [
  "Nouveau lead", "Contacté", "Qualifié", "En négociation", "Converti", "Perdu"
];

const propertyTypes = [
  "Appartement", "Maison", "Villa", "Terrain", "Bureau", "Local commercial", "Immeuble"
];

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadAdded: (id: string) => void;
}

const AddLeadDialog: React.FC<AddLeadDialogProps> = ({ open, onOpenChange, onLeadAdded }) => {
  const { addLead } = useLeads();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "Nouveau lead",
      source: "",
      interestProperty: "",
      budget: "",
      notes: "",
      firstContactDate: new Date(),
    },
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handlePropertyChange = (value: string) => {
    form.setValue("interestProperty", value);
    if (value.length > 2) {
      const filtered = propertyTypes.filter(type => 
        type.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (value: string) => {
    form.setValue("interestProperty", value);
    setSelectedProperty(value);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    
    const newLead = addLead({
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      status: data.status as any,
      source: data.source,
      propertyType: data.interestProperty,
      budget: data.budget,
      notes: data.notes,
      lastContact: data.firstContactDate,
      nextAction: "Appel de qualification"
    });
    
    toast({
      title: "Lead et client ajoutés avec succès !",
      description: `${data.name} a été ajouté à vos leads et à votre base clients.`,
      variant: "default",
    });
    
    setIsSubmitting(false);
    
    onLeadAdded(newLead.id);
  };

  const checkForDuplicates = (value: string, field: 'email' | 'phone') => {
    if (!value) return;
    
    const isDuplicate = Math.random() > 0.8;
    
    if (isDuplicate) {
      toast({
        title: "Attention",
        description: `Ce ${field === 'email' ? 'courriel' : 'numéro'} semble déjà exister dans la base de données.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold">Ajouter un nouveau lead</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau lead. Les champs marqués * sont obligatoires.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 py-4 max-h-[70vh] overflow-y-auto">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Nom <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      ref={initialFocusRef}
                      placeholder="Nom complet du contact"
                      className="focus:border-luxe-blue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="email@exemple.com"
                        type="email"
                        className="focus:border-luxe-blue"
                        onBlur={(e) => {
                          field.onBlur();
                          if (e.target.value) checkForDuplicates(e.target.value, 'email');
                        }}
                      />
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
                    <FormLabel className="font-medium">Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="+212 XXXXXXXXX"
                        className="focus:border-luxe-blue"
                        onBlur={(e) => {
                          field.onBlur();
                          if (e.target.value) checkForDuplicates(e.target.value, 'phone');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Statut <span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
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
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">Source <span className="text-red-500">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="D'où vient ce lead?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {previousLeadSources.map(source => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interestProperty"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="font-medium">Bien immobilier d'intérêt</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        placeholder="Type de bien recherché"
                        className="focus:border-luxe-blue"
                        onChange={(e) => handlePropertyChange(e.target.value)}
                      />
                      {showSuggestions && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => selectSuggestion(suggestion)}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Budget estimé</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 500,000 MAD"
                      className="focus:border-luxe-blue"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="firstContactDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-medium">Date de premier contact <span className="text-red-500">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Informations supplémentaires sur ce lead..."
                      className="resize-none focus:border-luxe-blue min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <DialogFooter className="bg-gray-50 px-6 py-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-luxe-blue hover:bg-luxe-blue/90 transition-all ml-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Enregistrer le lead
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadDialog;
