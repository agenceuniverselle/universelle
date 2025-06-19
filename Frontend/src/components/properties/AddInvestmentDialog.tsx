import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Ruler, 
  Building as BuildingIcon, 
  Image, 
  Upload, 
  X, 
  Save, 
  Power, 
  Loader2,
  TrendingUp,
  Clock,
  FileText,
  CheckCircle2,
  Briefcase,
  Luggage
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useProperties } from '@/context/PropertiesContext';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Bien } from '@/types/bien.types';

const formSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  type: z.string().min(1, { message: "Veuillez entrer un type de bien." }),
  status: z.string().min(1, { message: "Veuillez sélectionner un statut." }),
  price: z.string().min(1, { message: "Veuillez entrer un prix." }),
  location: z.string().min(3, { message: "Veuillez entrer une localisation." }),
  area: z.string().min(1, { message: "Veuillez entrer une superficie." }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  isFeatured: z.boolean().default(false),
  availableDate: z.date().optional(),
  investmentType: z.string().min(1, { message: "Veuillez sélectionner un type d'investissement." }),
  returnRate: z.string().min(1, { message: "Veuillez entrer un taux de rentabilité." }),
  minEntryPrice: z.string().min(1, { message: "Veuillez entrer un prix d'entrée minimum." }),
  recommendedDuration: z.string().min(1, { message: "Veuillez entrer une durée recommandée." }),
  financingEligibility: z.boolean().default(false),
  partners: z.string().optional(),
  projectStatus: z.string().min(1, { message: "Veuillez sélectionner un statut du projet." }),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface AddInvestmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyAdded: (propertyId: string) => void;
}

const AddInvestmentDialog: React.FC<AddInvestmentDialogProps> = ({ 
  open, 
  onOpenChange,
  onPropertyAdded 
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const { addProperty } = useProperties();
  const navigate = useNavigate();
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      status: "Disponible",
      price: "",
      location: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      description: "",
      isFeatured: false,
      investmentType: "Résidentiel",
      returnRate: "",
      minEntryPrice: "",
      recommendedDuration: "",
      financingEligibility: false,
      partners: "",
      projectStatus: "En cours",
    }
  });

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      setImages(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      setImages(prev => [...prev, ...selectedFiles]);
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  const { user } = useAuth(); // Utiliser le contexte Auth

  const onSubmit = async (data: PropertyFormValues, publish = false) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("Aucun token d'accès trouvé.");
      return;
    }
  
    if (publish) {
  setIsPublishing(true);
} else {
  setIsSubmitting(true);
}

    try {
      const formData = new FormData();
      const {
        title, type, price, status, location, area, bedrooms, bathrooms,
        description, isFeatured, investmentType, projectStatus,
        returnRate, minEntryPrice, recommendedDuration,
        partners, financingEligibility
      } = data;
  
      // ✅ Ajout des champs principaux
      formData.append('title', title);
      formData.append('type', type);
      formData.append('price', price);
      formData.append('status', status);
      formData.append('location', location);
      formData.append('area', area);
      formData.append('bedrooms', bedrooms ? bedrooms.toString() : "0");
      formData.append('bathrooms', bathrooms ? bathrooms.toString() : "0");
      formData.append('description', description);
      formData.append('isFeatured', isFeatured ? "1" : "0");
      formData.append('investmentType', investmentType);
      formData.append('projectStatus', projectStatus);
      formData.append('returnRate', (returnRate !== undefined && returnRate !== null) ? returnRate.toString() : "0");
      formData.append('minEntryPrice', minEntryPrice);
      formData.append('recommendedDuration', recommendedDuration);
      formData.append('financingEligibility', financingEligibility ? "1" : "0");
  
      // ✅ Partenaires (convertir en chaîne si tableau)
      const partnersValue = Array.isArray(partners) ? partners.join(",") : partners;
      formData.append('partners', partnersValue || "");
  
      // ✅ Ajout des images
      images.forEach(image => formData.append("images[]", image));
  
      // ✅ Ajout des documents
      documents.forEach(doc => formData.append("documents[]", doc));
  
      // ✅ Debug des données envoyées
      console.log("=== Données à envoyer via axios.post ===");
      [...formData.entries()].forEach(([key, value]) => {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      });
  
      // ✅ Envoi de la requête
      const response = await axios.post('https://back-qhore.ondigitalocean.app/api/admin/properties', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
  
      const result = response.data;
      console.log("✅ Bien ajouté avec succès:", result);
  
      if (publish) {
        setIsPublishing(false);
        onOpenChange(false);
        toast({
          title: "Bien publié avec succès",
          description: "Redirection vers la page d'édition...",
          variant: "default",
        });
       navigate("/admin/investissements", {
  state: { reloadAfterAdd: true }
});
      } else {
        setIsSubmitting(false);
        toast({
          title: "Brouillon enregistré",
          description: "Le bien d'investissement a été ajouté en mode brouillon.",
          variant: "default",
        });
      onPropertyAdded(result.property);
      }
  
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout du bien:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du bien.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsPublishing(false);
    }
  };
  

  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ajouter un bien à investir
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau bien d'investissement.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Informations de base</h3>
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Titre du bien</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: Complexe résidentiel Horizon" 
                        autoFocus
                        {...field} 
                        className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="investmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Type d'investissement</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                      <SelectTrigger className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2">

                          <SelectValue placeholder="Sélectionner un type d'investissement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
        >                        <SelectItem value="Résidentiel">
                          <div className="flex items-center">
                            <Home className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Résidentiel
                          </div>
                        </SelectItem>
                        <SelectItem value="Commercial">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Commercial
                          </div>
                        </SelectItem>
                        <SelectItem value="Touristique">
                          <div className="flex items-center">
                            <Luggage className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Touristique
                          </div>
                        </SelectItem>
                        <SelectItem value="Mixte">
  <div className="flex items-center">
    <BuildingIcon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
    Mixte
  </div>
</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
  control={form.control}
  name="type"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">Type de bien</FormLabel>
      <FormControl>
        <Input placeholder="ex: Maison, Villa..." {...field}className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Prix (MAD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="ex: 2,500,000" 
                          {...field} 
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                      <SelectTrigger className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2">                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
        >
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Réservé">Réservé</SelectItem>
                        <SelectItem value="Vendu">Vendu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-white">Ville</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="ex: Casablanca, Anfa" 
                        {...field} 
                        className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            
           
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Superficie (m²)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 150" 
                          {...field} 
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Chambres</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 3" 
                          {...field}
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Salles de bain</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 2" 
                          {...field} 
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description détaillée du bien..." 
                      {...field} 
                      className="w-full min-h-[120px] pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Détails d'investissement</h3>
              <Separator />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="projectStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Statut du projet</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                      <SelectTrigger className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2">
                      <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100">
                      <SelectItem value="Pré-commercialisation">Pré-commercialisation</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="recommendedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Durée d'investissement recommandée</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 5-7 ans" 
                          {...field} 
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="returnRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Rentabilité estimée (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 8.5" 
                          {...field} 
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="minEntryPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 dark:text-white">Prix d'entrée minimal (MAD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="ex: 500,000" 
                          {...field} 
                          className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
             
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
    control={form.control}
    name="partners"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-800 dark:text-white">Partenaires ou promoteurs associés</FormLabel>
        <FormDescription>Séparés par des virgules</FormDescription>
        <FormControl>
          <Input
            placeholder="ex: Groupe Immobilier Atlas, Banque Populaire"
            {...field}
            onChange={(e) => {
              // Transformer la chaîne saisie en un tableau (séparée par des virgules)
              const value = e.target.value;
              // Conserver la chaîne séparée par des virgules
              field.onChange(value);  // Ne pas convertir en tableau ici, garder une chaîne
              
            }}
            className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"

          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />


              <FormField
                control={form.control}
                name="financingEligibility"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Éligibilité aux financements</FormLabel>
                      <FormDescription>
                        Ce bien est éligible à des avantages fiscaux ou financements spéciaux
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Médias et documents</h3>
  <Separator className="bg-gray-300 dark:bg-gray-600" />
</div>

<div className="space-y-4">
  <FormLabel className="text-gray-800 dark:text-white">Images (glisser-déposer ou sélectionner)</FormLabel>
  <div
    className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    onDragOver={(e) => e.preventDefault()}
    onDrop={handleImageDrop}
    onClick={() => fileInputRef.current?.click()}
  >
    <Image className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Glisser-déposer vos images ici ou cliquer pour sélectionner
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      Formats supportés: JPG, PNG, WEBP
    </p>
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept="image/*"
      multiple
      onChange={handleImageSelect}
    />
  </div>
  
  {images.length > 0 && (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {images.map((image, index) => (
        <div 
          key={index} 
          className="relative group rounded-md overflow-hidden h-24 bg-gray-100 dark:bg-gray-800"
        >
          <img
            src={URL.createObjectURL(image)}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>

<div className="space-y-4">
  <FormLabel className="text-gray-800 dark:text-white">Documents (brochures, analyses, études)</FormLabel>
  <div
    className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    onClick={() => {
      if (documents.length < 5) {
        documentInputRef.current?.click();
      } else {
        alert("Vous avez atteint la limite de 5 documents.");
      }
    }}
  >
    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Cliquer pour ajouter des documents
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      Formats supportés: PDF, DOC, DOCX, XLS, XLSX
    </p>
    <p className="text-xs text-red-500 mt-1">
      {documents.length >= 5 && "Limite de 5 documents atteinte"}
    </p>
    <input
      type="file"
      ref={documentInputRef}
      className="hidden"
      accept=".pdf,.doc,.docx,.xls,.xlsx"
      multiple
      onChange={handleDocumentSelect}
      disabled={documents.length >= 5}
    />
  </div>

  {documents.length > 0 && (
    <div className="space-y-2 mt-4">
      {documents.map((doc, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors"
        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-800 dark:text-white">{doc.name}</span>
          </div>
          <button
            type="button"
            onClick={() => removeDocument(index)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Bien en vedette</FormLabel>
                    <FormDescription>
                      Ce bien sera mis en avant sur la plateforme
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="text-gray-800 dark:text-black border-gray-300 dark:border-gray-600 transition-colors"

              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || isPublishing} 
                className="bg-luxe-blue hover:bg-luxe-blue/90"
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
              <Button
                type="button"
                disabled={isSubmitting || isPublishing}
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  form.handleSubmit((data) => {
                    onSubmit(data, true);
                  })();
                }}
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 mr-2" />
                    Publier
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

export default AddInvestmentDialog;
