import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  ChevronDown 
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useProperties } from '@/context/PropertiesContext';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext'; 

const formSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  type: z.string().min(1, { message: "Veuillez sélectionner un type de bien." }),
  status: z.string().min(1, { message: "Veuillez sélectionner un statut." }),
  price: z.string().min(1, { message: "Veuillez entrer un prix." }),
  location: z.string().min(3, { message: "Veuillez entrer une localisation." }),
  area: z.string().min(1, { message: "Veuillez entrer une superficie." }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  isFeatured: z.boolean().default(false),
  availableDate: z.date().optional(),
  pointsForts: z.array(z.string()), // ✅ Ajout ici
  constructionYear: z.string().optional(),
  condition: z.string().optional(),
  exposition: z.string().optional(),
  cuisine: z.string().optional(),
  hasParking: z.string().optional(),
  climatisation: z.string().optional(),
  parkingPlaces: z.string().optional(),
  terrasse: z.string().optional(),
  occupationRate: z.string().optional(),
  estimatedValuation: z.string().optional(),
  estimatedCharges: z.string(z.string()).optional(),
  monthlyRent: z.string().optional(),
  quartier: z.string().optional(),
  proximite: z.array(z.string()),
  map_link: z.string().optional(),
  ownerName: z.string().optional(),
  ownerEmail: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerNationality: z.string().optional(), 
  ownerDocuments: z.array(z.any()).optional(),


});

type PropertyFormValues = z.infer<typeof formSchema>;

interface AddPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyAdded: (propertyId: string) => void;
}

const AddPropertyDialog: React.FC<AddPropertyDialogProps> = ({ 
  open, 
  onOpenChange,
  onPropertyAdded 
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const { addProperty } = useProperties();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<File[]>([]);
  const [step, setStep] = useState(1);
  const { logout } = useAuth();
  const slideDirection = useRef(0); // Pour les animations avec AnimatePresence si tu veux les reprendre
  const [ownerDocuments, setOwnerDocuments] = useState<File[]>([]);
  const ownerDocumentInputRef = useRef<HTMLInputElement>(null);
  const handleOwnerDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setOwnerDocuments(prev => [...prev, ...selectedFiles]);
    }
  };
  
  const removeOwnerDocument = (index: number) => {
    setOwnerDocuments(prev => prev.filter((_, i) => i !== index));
  };
    
  // Au début de votre composant
const form = useForm<PropertyFormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    title: '',
    type: '',
    status: 'Disponible',
    price: '',
    location: '',
    quartier: '',
    area: '',
    availableDate: null,
    description: '',
    isFeatured: false,
    constructionYear: '',
    condition: '',
    exposition: '',
    cuisine: '',
    hasParking: 'non',
    parkingPlaces: '',
    climatisation: 'non',
    terrasse: 'non',
    pointsForts: [],
    proximite: [],
    map_link: '',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    ownerNationality: '',
    occupationRate: '',
    estimatedValuation: '',
    estimatedCharges: '',
    monthlyRent: '',
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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
const onSubmit = async (data: PropertyFormValues, publish = false) => {
  if (publish) {
    setIsPublishing(true);
  } else {
    setIsSubmitting(true);
  }

  const formDataToSend = new FormData();

  // Remplir les données du formulaire
  formDataToSend.append("title", data.title);
  formDataToSend.append("type", data.type);
  formDataToSend.append("status", data.status);
  formDataToSend.append("price", data.price);
  formDataToSend.append("location", data.location);
  formDataToSend.append("area", data.area);
  formDataToSend.append("bedrooms", data.bedrooms || "0");
  formDataToSend.append("bathrooms", data.bathrooms || "0");
  formDataToSend.append("description", data.description);
  formDataToSend.append("is_featured", data.isFeatured ? "1" : "0");
  formDataToSend.append("is_draft", publish ? "0" : "1");

  // ✅ Ajouter les images
  images.forEach((image, index) => {
    formDataToSend.append("images[]", image);

  });
// Ajouter les documents
documents.forEach((doc, index) => {
  formDataToSend.append("documents[]", doc);
});

// Ajouter les documents du propriétaire
ownerDocuments.forEach((doc, index) => {
  formDataToSend.append("owner_documents[]", doc);
});

  const token = localStorage.getItem("access_token");

  try {
    const response = await axios.post(
      "https://back-qhore.ondigitalocean.app/api/biens",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const { data: savedProperty } = response;

    toast({
      title: publish ? "Bien publié avec succès" : "Brouillon enregistré",
      description: publish
        ? "Redirection vers la page d'édition..."
        : "Le bien a été enregistré en tant que brouillon.",
    });

    if (publish) {
      onOpenChange(false);
      setTimeout(() => {
        navigate(`/admin/biens`);
      }, 500);
    } else {
      onPropertyAdded(savedProperty.data.id);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du bien :", error);
    if (error.response?.status === 401) {
      toast({
        title: "Erreur d'authentification",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      logout();
      navigate("/login");
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi.",
        variant: "destructive",
      });
    }
  } finally {
    setIsSubmitting(false);
    setIsPublishing(false);
  }
};

  
 const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...selectedFiles]);
    }
  };
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

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  const autoGenerateDescription = () => {
    const { title, type, location, area, quartier } = form.getValues();
  
    let description = `${title || `Ce ${type || 'bien immobilier'}`} est idéalement situé à ${quartier ? quartier + ', ' : ''}${location || '[localisation]'}. `;
    description += `Avec une superficie de ${area || '[superficie]'} m², ce ${type || 'bien'} offre un cadre de vie alliant confort, modernité et élégance. `;
    description += `C’est une opportunité rare pour les personnes à la recherche d’un investissement de qualité ou d’un lieu de vie d’exception.`;
  
    form.setValue('description', description);
  };
  
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
      className="space-y-6 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md shadow-md transition-all duration-300"
      >
  

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-white" >Titre du bien</FormLabel>
              <FormControl>
                <Input placeholder="ex: Villa de luxe avec piscine"            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" autoFocus {...field} value={field.value ?? ''}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel  className="text-gray-800 dark:text-white">Type de bien</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                  <SelectItem value="Appartement">Appartement</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Maison">Maison</SelectItem>
                  <SelectItem value="Riad">Riad</SelectItem>
                  <SelectItem value="Bureau">Bureau</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Terrain">Terrain</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-white">Prix (MAD)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input placeholder="ex: 2,500,000"className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 pl-3"
 {...field} value={field.value ?? ''}/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-white" >Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
                <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="Réservé">Réservé</SelectItem>
                  <SelectItem value="Vendu">Vendu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 dark:text-white">Ville</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input placeholder="ex: Casablanca, Anfa"className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 pl-10"
 {...field} value={field.value ?? ''}/>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
<FormField
        control={form.control}
        name="quartier"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-800 dark:text-white" >Quartier</FormLabel>
            <FormControl>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input placeholder="ex: Malabata, Maarif"className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 pl-10"
 {...field} value={field.value ?? ''}/>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Superficie */}
  <FormField
    control={form.control}
    name="area"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-gray-800 dark:text-white">Superficie (m²)</FormLabel>
        <FormControl>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="ex: 150"className="bg-white pl-10 h-11 dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
 {...field} value={field.value ?? ''}/>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Date de disponibilité */}
  <FormField
  control={form.control}
  name="availableDate"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">
        Date de disponibilité
      </FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full h-11 pl-3 text-left font-normal flex items-center rounded-md transition-colors",
                "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600",
                !field.value && "text-muted-foreground dark:text-gray-400"
              )}
            >
              {field.value
                ? format(field.value, "PPP", { locale: fr })
                : "Sélectionner une date"}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
          align="start"
        >
          <Calendar
            mode="single"
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
            className="p-3 pointer-events-auto dark:bg-gray-800 dark:text-white"
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>

</div>

       

<div className="space-y-2">
  <div className="flex justify-between items-center">
    <FormLabel className="text-gray-800 dark:text-white">
      Description
    </FormLabel>
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="text-gray-800 dark:text-white border-gray-300 dark:bg-gray-600 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      onClick={autoGenerateDescription}
    >
      Auto-générer
    </Button>
  </div>
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Textarea
            placeholder="Description détaillée du bien..."
            className={cn(
              "min-h-[120px] w-full px-3 py-2 border rounded-md",
              "bg-white dark:bg-gray-800 text-gray-800 dark:text-white",
              "border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none focus:ring-offset-0",
              "placeholder-gray-400 dark:placeholder-gray-500"
            )}
            {...field}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</div>

            <div className="space-y-4">
              <FormLabel  className="text-gray-800 dark:text-white" >Images (glisser-déposer ou sélectionner)</FormLabel>
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
                <p className="text-xs text-gray-400 mt-1">
                  Formats supportés: JPG, PNG, WEBP,JPEG
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
                      className="relative group rounded-md overflow-hidden h-24"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4 mt-6">
  <FormLabel className="text-gray-800 dark:text-white">
    Documents (brochures, plans, analyses, études)
  </FormLabel>
  <div
    className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    onClick={() => documentInputRef.current?.click()}
  >
    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Cliquer pour ajouter des documents
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      Formats supportés: PDF, DOC, DOCX, XLS, XLSX
    </p>
    <input
      type="file"
      ref={documentInputRef}
      className="hidden"
      accept=".pdf,.doc,.docx,.xls,.xlsx"
      multiple
      onChange={handleDocumentSelect}
    />
  </div>

  {documents.length > 0 && (
    <div className="space-y-2 mt-4">
      {documents.map((doc, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-800 dark:text-white">{doc.name}</span>
          </div>
          <button
            type="button"
            onClick={() => removeDocument(index)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-800 dark:text-white" />
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
                <FormItem className="flex items-center justify-between rounded-lg border p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
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
                      className="bg-gray-200 dark:bg-gray-700"

                    />
                  </FormControl>
                </FormItem>
              )}
            />
      
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
        className="space-y-6 py-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Année de construction */}
          <FormField
  control={form.control}
  name="constructionYear"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">
        Année de construction
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="ex: 2015"
          {...field}
          value={field.value ?? ''}
          min={1800} // Année minimale (peut être ajustée)
          max={new Date().getFullYear()} // Année maximale (année actuelle)
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

  
          {/* État général */}
          <FormField
  control={form.control}
  name="condition"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">
        État général
      </FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger
            className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
          >
            <SelectValue placeholder="Choisir l'état" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <SelectItem value="excellent" >
            Excellent
          </SelectItem>
          <SelectItem value="moyen">
            Moyen
          </SelectItem>
          <SelectItem value="faible" >
            Faible
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exposition */}
          <FormField
  control={form.control}
  name="exposition"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">
        Exposition
      </FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger
            className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
          >
            <SelectValue placeholder="Choisir une exposition" />
          </SelectTrigger>
        </FormControl>
        <SelectContent 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
        >
          <SelectItem value="Sud" >
            Sud
          </SelectItem>
          <SelectItem value="Nord" >
            Nord
          </SelectItem>
          <SelectItem value="Est" >
            Est
          </SelectItem>
          <SelectItem value="Ouest" >
            Ouest
          </SelectItem>
          <SelectItem value="Sud-Est" >
            Sud-Est
          </SelectItem>
          <SelectItem value="Sud-Ouest" >
            Sud-Ouest
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

  
          {/* Cuisine */}
          <FormField
  control={form.control}
  name="cuisine"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">
        Cuisine
      </FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2">
            <SelectValue placeholder="Type de cuisine" />
          </SelectTrigger>
        </FormControl>
        <SelectContent 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
        >
          <SelectItem value="equipée" >
            Équipée
          </SelectItem>
          <SelectItem value="non-equipée" >
            Non équipée
          </SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chambres */}
          <FormField
  control={form.control}
  name="bedrooms"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">
        Chambres
      </FormLabel>
      <FormControl>
        <Input
          type="number"
          placeholder="ex: 3"
          {...field}
          value={field.value ?? ''}
          min={0}
          className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

  
          {/* Salles de bain */}
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Salles de bain</FormLabel>
                <FormControl>
                  <Input placeholder="ex: 2"className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
 {...field} value={field.value ?? ''}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parking */}
          <FormField
            control={form.control}
            name="hasParking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parking</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors"
                    >
                      <SelectValue placeholder="Y a-t-il un parking ?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
                  >
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("hasParking") === "oui" && (
            <FormField
              control={form.control}
              name="parkingPlaces"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-white">Nombre de places</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 1"className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
{...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Climatisation */}
          <FormField
            control={form.control}
            name="climatisation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Climatisation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2"
                    >
                      <SelectValue placeholder="Climatisation ?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
                  >
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
  
          {/* Terrasse / Balcon */}
          <FormField
            control={form.control}
            name="terrasse"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Terrasse / Balcon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2"
                    >
                      <SelectValue placeholder="Terrasse ou balcon ?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
                  >
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
  
        {/* Points forts - choix multiple */}
        <FormField
          control={form.control}
          name="pointsForts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-800 dark:text-white">Points forts</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Emplacement privilégié",
                  "Matériaux haut de gamme",
                  "Excellent état",
                  "Sécurisé",
                  "Lumineux",
                  "Vue dégagée",
                  "Proche des commodités",
                  "Stationnement",
                  "Ascenseur",
                  "Piscine",
                  "Double vitrage"
                ].map((item) => (
                  <label key={item}className="flex items-center space-x-2 cursor-pointer text-gray-800 dark:text-white"
>
                    <input
                      type="checkbox"
                      checked={field.value?.includes(item)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        field.onChange(
                          checked
                            ? [...(field.value || []), item]
                            : field.value?.filter((v) => v !== item)
                        );
                      }}
                      className="accent-blue-600 dark:accent-green-600 transition-colors duration-200"
                    />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField 
  control={form.control}
  name="proximite"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-gray-800 dark:text-white">Proximité</FormLabel>
      <div className="flex flex-wrap gap-4">
        {[
          "Transports",
          "Commerces",
          "Restaurants",
          "Écoles"
        ].map((item) => (
          <label key={item} className="flex items-center space-x-2 cursor-pointer text-gray-800 dark:text-white">
            <input
              type="checkbox"
              checked={field.value?.includes(item)}
              onChange={(e) => {
                const checked = e.target.checked;
                field.onChange(
                  checked
                    ? [...(field.value || []), item]
                    : field.value?.filter((v) => v !== item)
                );
              }}
              className="accent-blue-600 dark:accent-green-600 transition-colors duration-200"
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="map_link"
  render={({ field }) => (
    <FormItem>
      <FormLabel  className="text-gray-800 dark:text-white">Adresse Google Maps (lien)</FormLabel>
      <FormControl>
        <Input
          placeholder="https://www.google.com/maps/..."
          type="url"
          {...field}
          value={field.value ?? ''}
          className="pl-10 w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

      </motion.div>
    );
  
    case 3:
      return (
        <motion.div
          key="step3"
          custom={slideDirection.current}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="space-y-6 py-2"
        >
          {/* Taux d'habitation + Valorisation estimée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="occupationRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-white">Taux d'habitation (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 85" {...field} value={field.value ?? ''}className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    
            <FormField
              control={form.control}
              name="estimatedValuation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-white">Valorisation estimée (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 12" {...field} value={field.value ?? ''}className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
    
          {/* Charges estimées  */}
<FormField
            control={form.control}
            name="estimatedCharges"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Frais de syndic (MAD/mois)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="ex: 500"  {...field} value={field.value ?? ''}className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
    
          {/* Loyer mensuel */}
          <FormField
            control={form.control}
            name="monthlyRent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Loyer mensuel (MAD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="ex: 6500"  {...field} value={field.value ?? ''}className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      );
    
      case 4:
        return (
          <motion.div
          key="step4"
          custom={slideDirection.current}
          initial="enter"
          animate="center"
          exit="exit"
          variants={variants}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="space-y-6 py-2"
        >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Nom du propriétaire</FormLabel>
                <FormControl>
                  <Input placeholder="Nom complet" {...field} value={field.value ?? ''}className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Email du propriétaire</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} value={field.value ?? ''}className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <FormField
            control={form.control}
            name="ownerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Téléphone du propriétaire</FormLabel>
                <FormControl>
                  <Input placeholder="+212 600000000" {...field} value={field.value ?? ''}className="w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-0 focus:outline-none transition-colors"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownerNationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-800 dark:text-white">Nationalité du propriétaire</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors px-3 py-2"
          >
            <SelectValue placeholder="Sélectionner une nationalité" />
          </SelectTrigger>
        </FormControl>
        <SelectContent 
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100"
        >
          {[
            "Marocaine",
            "Française",
            "Espagnole",
            "Américaine",
            "Canadienne",
            "Italienne",
            "Allemande",
            "Anglaise",
            "Belge",
            "Néerlandaise",
            "Suisse",
            "Chinoise",
            "Japonaise",
            "Indienne",
            "Brésilienne",
            "Australienne",
            "Turque",
            "Saoudienne",
            "Égyptienne",
            "Autre"
          ].map((nationality) => (
            <SelectItem 
              key={nationality} 
              value={nationality}
              
            >
              {nationality}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
                <FormMessage />
              </FormItem>
            )}
          />      
          <div className="space-y-4">
  <FormLabel  className="text-gray-800 dark:text-white" >Documents du propriétaire</FormLabel>
  <div
     className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    onClick={() => ownerDocumentInputRef.current?.click()}
  >
    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2"/>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Cliquez pour ajouter des documents liés au propriétaire
    </p>
    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
      Formats supportés: PDF, DOC, DOCX, XLS, XLSX
    </p>
    <input
      type="file"
      ref={ownerDocumentInputRef}
      className="hidden"
      accept=".pdf,.doc,.docx,.xls,.xlsx"
      multiple
      onChange={handleOwnerDocumentSelect}
    />
  </div>

  {ownerDocuments.length > 0 && (
    <div className="space-y-2 mt-4">
      {ownerDocuments.map((doc, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm transition-colors"        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-800 dark:text-white">{doc.name}</span>
          </div>
          <button
            type="button"
            onClick={() => removeOwnerDocument(index)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-800 dark:text-white" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>
    </div>

        </motion.div>
      );
            default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
<DialogHeader>
    <DialogTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
      <BuildingIcon className="h-5 w-5" />
      Ajouter un nouveau bien
    </DialogTitle>
    <DialogDescription className="text-gray-600 dark:text-gray-400">
      Remplissez les informations ci-dessous pour ajouter un nouveau bien immobilier.
    </DialogDescription>
  </DialogHeader>

  {/* --- Stepper visuel --- */}
  <div className="my-4">
    <div className="flex justify-between items-center mb-2">
      {[1, 2, 3,4].map((stepNumber) => (
        <div key={stepNumber} className="flex flex-col items-center">
          <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
            stepNumber === step
              ? "bg-luxe-blue text-white scale-110 shadow-md"
              : stepNumber < step
              ? "bg-green-100 dark:bg-green-600 text-green-700 dark:text-white border border-green-200 dark:border-green-500"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
          )}
        >
            {stepNumber < step ? <Check className="h-5 w-5" /> : stepNumber}
          </div>
          <span className="text-xs mt-1 text-gray-500 dark:text-gray-400 hidden sm:block">
            {stepNumber === 1 && "Description"}
            {stepNumber === 2 && "Détails"}
            {stepNumber === 3 && "Informations financières"}
            {stepNumber === 4 && "propriétaire"}

            
          </span>
        </div>
      ))}
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden">
    <div
        className="bg-luxe-blue h-full transition-all duration-500 ease-in-out"
        style={{ width: `${(step / 4) * 100}%` }}
      />
    </div>
  </div>

  {/* --- Zone de scroll du contenu du formulaire --- */}
  <ScrollArea className="flex-grow pr-4 overflow-y-auto">
  <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
        <AnimatePresence mode="wait" custom={slideDirection.current}>
          {renderStepContent()}
        </AnimatePresence>
      </form>
    </Form>
  </ScrollArea>

  <Separator className="my-4 dark:border-gray-700" />

  {/* --- Footer navigation --- */}
  <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-3 mt-4">
    {step > 1 && (
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          slideDirection.current = -1;
          setStep(step - 1);
        }}
        className="w-full sm:w-auto group text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
        <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Précédent
      </Button>
    )}

    <div className="flex-1" />

    {step < 4? (
      <Button
      type="button"
      className="w-full sm:w-auto group transition-all text-white 
                 bg-luxe-blue hover:bg-luxe-blue/90 
                 dark:bg-green-600 dark:hover:bg-green-500 
                 rounded-md px-4 py-2 flex items-center justify-center"
      onClick={() => {
        slideDirection.current = 1;
        setStep(step + 1);
      }}
    >
      Suivant
      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
    </Button>
    
    ) : (
      <>
        

        <Button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto transition-all hover:scale-102"
          disabled={isPublishing}
          onClick={() => {
            form.handleSubmit((data) => onSubmit(data, true))();
          }}
        >
          {isPublishing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Publication...
            </>
          ) : (
            <>
              <Power className="h-5 w-5 mr-2" />
              Publier
            </>
          )}
        </Button>
      </>
    )}
  </DialogFooter>
</DialogContent>

    </Dialog>
  );
};

export default AddPropertyDialog;
