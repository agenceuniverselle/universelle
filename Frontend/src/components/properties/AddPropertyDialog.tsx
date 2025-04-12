import React, { useState, useRef } from 'react';
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
  Loader2 
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useProperties } from '@/context/PropertiesContext';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

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

  const onSubmit = (data: PropertyFormValues, publish = false) => {
    if (publish) {
      setIsPublishing(true);
    } else {
      setIsSubmitting(true);
    }
    
    const bedroomsValue = data.bedrooms ? parseInt(data.bedrooms) : 0;
    const bathroomsValue = data.bathrooms ? parseInt(data.bathrooms) : 0;
    
    let imageUrl = '';
    if (images.length > 0) {
      imageUrl = URL.createObjectURL(images[0]);
    }

    const propertyId = 'P' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const newProperty = {
      id: propertyId,
      title: data.title,
      type: data.type,
      status: data.status,
      price: data.price + ' MAD',
      location: data.location,
      area: data.area,
      bedrooms: bedroomsValue,
      bathrooms: bathroomsValue,
      description: data.description,
      isFeatured: data.isFeatured,
      date: format(new Date(), 'dd/MM/yyyy'),
      image: imageUrl || undefined,
      isDraft: !publish,
      isInvestment: false,
      createdAt: format(new Date(), 'dd/MM/yyyy'),

    };
    
    setTimeout(() => {
      addProperty(newProperty);
      
      if (publish) {
        setIsPublishing(false);
        onOpenChange(false);
        
        toast({
          title: "Bien publié avec succès",
          description: "Redirection vers la page d'édition...",
          variant: "default",
        });
        
        setTimeout(() => {
          navigate(`/admin/biens/edit/${propertyId}`);
        }, 300);
      } else {
        setIsSubmitting(false);
        
        toast({
          title: "Brouillon enregistré",
          description: "Le bien a été ajouté en mode brouillon et est visible dans le dashboard.",
          variant: "default",
          action: (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-luxe-blue hover:bg-luxe-blue/90"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => {
                  navigate(`/admin/biens/edit/${propertyId}`);
                }, 300);
              }}
            >
              Éditer
            </Button>
          ),
        });
        
        onPropertyAdded(propertyId);
      }
    }, 1500);
  };

  const autoGenerateDescription = () => {
    const { title, type, location, bedrooms, bathrooms, area } = form.getValues();
    
    let description = `Magnifique ${type || 'bien immobilier'} situé à ${location || '[localisation]'}. `;
    
    if (bedrooms) {
      description += `Ce bien dispose de ${bedrooms} chambre${parseInt(bedrooms) > 1 ? 's' : ''} `;
    }
    
    if (bathrooms) {
      description += `et ${bathrooms} salle${parseInt(bathrooms) > 1 ? 's' : ''} de bain. `;
    }
    
    description += `D'une superficie de ${area || '[superficie]'}, ce bien offre confort et élégance dans un cadre exceptionnel.`;
    
    form.setValue('description', description);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BuildingIcon className="h-5 w-5" />
            Ajouter un nouveau bien
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour ajouter un nouveau bien immobilier.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du bien</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="ex: Villa de luxe avec piscine" 
                        autoFocus
                        {...field} 
                      />
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
                    <FormLabel>Type de bien</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormLabel>Prix (MAD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 2,500,000" 
                          className="pl-10" 
                          {...field} 
                        />
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
                    <FormLabel>Statut</FormLabel>
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
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="ex: Casablanca, Anfa" 
                        className="pl-10" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Superficie (m²)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 150" 
                          className="pl-10" 
                          {...field} 
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
                    <FormLabel>Chambres</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 3" 
                          className="pl-10" 
                          {...field} 
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
                    <FormLabel>Salles de bain</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input 
                          placeholder="ex: 2" 
                          className="pl-10" 
                          {...field} 
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
              name="availableDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de disponibilité</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
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
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Description</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
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
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormLabel>Images (glisser-déposer ou sélectionner)</FormLabel>
              <div
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Glisser-déposer vos images ici ou cliquer pour sélectionner
                </p>
                <p className="text-xs text-gray-400 mt-1">
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

export default AddPropertyDialog;
