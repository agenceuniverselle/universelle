import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Save, X, AlertTriangle, Upload, Trash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Bien } from '@/types/bien.types';

const PropertyEdit = () => {
  const { bienId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [hasChanges, setHasChanges] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
const [bien, setBien] = useState<Bien>({
  id: 0,
  title: '',
  type: '',
  status: '',
  price: '',
  location: '',
  area: '',
  description: '',
  bedrooms: 0, // optionnel mais on peut initialiser
  bathrooms: 0,
  images: [],
  newImages: [],
  replacedImages: [],
  documents: [],
  newDocuments: [],
  isFeatured: false,
  is_draft: false,
  points_forts: [],
  proximite: [],
  owner_documents: [],
  newOwnerDocuments: [],
});

  const [available_date, setAvailableDate] = useState<Date | undefined>(undefined);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const ownerDocInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [replacedOwnerDocuments, setReplacedOwnerDocuments] = useState<{ index: number; file: File }[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'image' | 'document' | 'ownerDoc';index?: number;}>({ type: 'image' });
  const [isDeleting, setIsDeleting] = useState(false);
  const newOwnerDocInputRef = useRef<HTMLInputElement | null>(null);

  const handleConfirmedDelete = async () => {
  if (!bienId) return;

  try {
    setIsDeleting(true);

    if (deleteTarget.type === 'image' && typeof deleteTarget.index === 'number') {
      await axios.delete(`https://back-qhore.ondigitalocean.app/api/biens/${bienId}/images/${deleteTarget.index}`);
      const updatedImages = [...bien.images];
      updatedImages.splice(deleteTarget.index, 1);
      setBien((prev) => ({ ...prev, images: updatedImages }));
    }

    if (deleteTarget.type === 'document') {
      await axios.delete(`https://back-qhore.ondigitalocean.app/api/biens/${bienId}/document`);
      setBien((prev) => ({ ...prev, documents: [] }));
    }

    if (deleteTarget.type === 'ownerDoc' && typeof deleteTarget.index === 'number') {
      await axios.delete(`https://back-qhore.ondigitalocean.app/api/biens/${bienId}/owner-documents/${deleteTarget.index}`);
      const updatedDocs = [...bien.owner_documents];
      updatedDocs.splice(deleteTarget.index, 1);
      setBien((prev) => ({ ...prev, owner_documents: updatedDocs }));
    }

    setHasChanges(true);
    toast({ title: 'Supprimé avec succès.' });
  } catch (err) {
    toast({
      title: 'Erreur',
      description: 'Échec de la suppression',
      variant: 'destructive',
    });
  } finally {
    setIsDeleting(false);
    setDeleteConfirmOpen(false);
  }
};



  const form = useForm({
    defaultValues: {
      points_forts: [],
      proximite: [],
    },
  });
  
  const { reset } = form;
  
  
useEffect(() => {
  console.log('bienId:', bienId); // ← Ajoute ceci

  const fetchBien = async () => {
    try {
      const response = await axios.get(https://back-qhore.ondigitalocean.app/api/biens/${bienId});
      const data = response.data;

      setBien(data);
      console.log('Bien récupéré :', data);
      reset({
        points_forts: data.points_forts || [],
        proximite: data.proximite || [],
      });
      if (data.available_date) {
        setAvailableDate(new Date(data.available_date));
      }
    } catch (error) {
      console.error("Erreur lors du chargement du bien :", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du bien",
        variant: "destructive",
      });
    }
  };

  if (bienId) {
    fetchBien();
  }
}, [bienId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setBien(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    setBien(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setBien(prev => ({ ...prev, [name]: checked }));
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!bien.title.trim()) errors.push('Le titre est requis');
    if (!bien.location.trim()) errors.push('L\'emplacement est requis');
    if (!bien.price || isNaN(Number(bien.price))) errors.push('Le prix doit être un nombre valide');
    if (!bien.type.trim()) errors.push('Le type de bien est requis');
    
    setFormErrors(errors);
    return errors.length === 0;
  };
  const [replacedDocuments, setReplacedDocuments] = useState<Record<number, File>>({});

const handleReplaceDocument = (indexToReplace: number, file: File) => {
  setBien((prev) => {
    const updated = { ...prev };
    const replaced = [...(prev.replacedDocuments || [])];

    // Vérifie si un document est déjà remplacé à cet index
    const existing = replaced.find((item) => item.index === indexToReplace);

    if (existing) {
      existing.file = file;
    } else {
      replaced.push({ index: indexToReplace, file });
    }

    updated.replacedDocuments = replaced;
    return updated;
  });
};

const handleSave = async () => {
  if (!validateForm()) {
    setActiveTab('main');
    toast({
      title: "Erreur de validation",
      description: "Veuillez corriger les erreurs avant de sauvegarder",
      variant: "destructive",
    });
    return;
  }

  setIsSaving(true);

  const token = localStorage.getItem("access_token");

  if (!token) {
    toast({
      title: "Erreur d'authentification",
      description: "Votre session a expiré. Veuillez vous reconnecter.",
      variant: "destructive",
    });
    navigate("/login");
    return;
  }

  try {
    const formData = new FormData();

    // Champs standards
    for (const key in bien) {
      if (
        ['newImages', 'newDocuments', 'newOwnerDocuments', 'images', 'documents', 'owner_documents', 'replacedImages', 'replacedDocuments'].includes(key)
      ) continue;

      const value = bien[key];

      if (value === null || value === undefined) continue;

      if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (Array.isArray(value)) {
        value.forEach((item, i) => {
          formData.append(${key}[${i}], item);
        });
      } else {
        formData.append(key, value);
      }
    }

    // ✅ Dates
    if (available_date) {
      formData.append("available_date", available_date.toISOString().split("T")[0]);
    }

    // ✅ Ajout nouveaux fichiers
    bien.newImages?.forEach((file: File) => {
      formData.append("images[]", file);
    });

    bien.newDocuments?.forEach((file: File) => {
      formData.append("documents[]", file);
    });

    bien.newOwnerDocuments?.forEach((file: File) => {
      formData.append("owner_documents[]", file);
    });

    // ✅ Remplacement de fichiers spécifiques
    bien.replacedImages?.forEach(({ index, file }: { index: number; file: File }) => {
      formData.append(replace_images[${index}], file);
    });

Object.entries(replacedDocuments).forEach(([index, file]) => {
  formData.append(replacedDocuments[${index}], file);
});
   



    replacedOwnerDocuments?.forEach(({ index, file }: { index: number; file: File }) => {
      formData.append(replace_owner_documents[${index}], file);
    });

    // Debug log
    console.log([...formData.entries()]);

    const response = await axios.post(
      https://back-qhore.ondigitalocean.app/api/biens/${bienId}?_method=PUT,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': Bearer ${token},
        },
      }
    );

    setBien(response.data.data);
    setHasChanges(false);
    setReplacedOwnerDocuments([]);
    toast({
      title: "Modifications enregistrées",
      description: "Les informations du bien ont été mises à jour avec succès",
      variant: "default",
    });

  } catch (error: any) {
    console.error('Erreur lors de la sauvegarde du bien :', error);

    if (error.response?.status === 401) {
      toast({
        title: "Erreur d'authentification",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      toast({
        title: "Erreur lors de la sauvegarde",
        description: error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  } finally {
    setIsSaving(false);
  }
};

  
  
  
  
  
  const handleDeleteDocument = async () => {
    try {
      await axios.delete(https://back-qhore.ondigitalocean.app/api/biens/${bienId}/document);
      setBien(prev => ({
        ...prev,
        documents: [],
      }));
      setHasChanges(true);
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur suppression document :", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document.",
        variant: "destructive",
      });
    }
  };
  
  
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?')) {
        navigate(/admin/biens/${bienId});
      }
    } else {
      navigate(/admin/biens/${bienId});
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDeleteImage = async (index: number) => {
    try {
      await axios.delete(https://back-qhore.ondigitalocean.app/api/biens/${bienId}/images/${index});
  
      setBien(prev => {
        const updatedImages = [...(prev.images || [])];
        updatedImages.splice(index, 1);
  
        return {
          ...prev,
          images: updatedImages
        };
      });
  
      setHasChanges(true);
  
      toast({
        title: "Image supprimée",
        description: "L'image a bien été supprimée de la base de données.",
        variant: "default",
      });
  
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l’image.",
        variant: "destructive",
      });
    }
  };
  
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('bien_id', bienId!);
  
    try {
      const response = await axios.post(https://back-qhore.ondigitalocean.app/api/biens/${bienId}/upload-image, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setBien(prev => ({
        ...prev,
        images: [...(prev.images || []), response.data.path],
      }));
      setHasChanges(true);
    } catch (error) {
      console.error("Erreur upload :", error);
      toast({
        title: "Erreur",
        description: "Échec de l'upload de l'image.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AdminLayout title={Modifier le bien - ${bien.title}}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(/admin/biens/${bienId})}
            className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95 dark:text-black"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux détails
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="transition-all duration-200 hover:scale-105 active:scale-95 dark:text-black"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={bg-luxe-blue hover:bg-luxe-blue/90 transition-all duration-200 ${hasChanges ? 'hover:scale-105 active:scale-95' : 'opacity-70'}}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
        
        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6 animate-in fade-in-0 zoom-in-95 slide-in-from-top-5">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreurs de validation</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 ">
          <TabsList className="grid w-full grid-cols-4 dark:bg-gray-900">
            <TabsTrigger value="main" className="transition-all duration-200 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
              Informations principales
            </TabsTrigger>
            <TabsTrigger value="details" className="transition-all duration-200 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
              Détails supplémentaires
            </TabsTrigger>
            <TabsTrigger value="media" className="transition-all duration-200 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
              Médias
            </TabsTrigger>
            <TabsTrigger value="Propriétaire" className="transition-all duration-200 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
            Propriétaire
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="animate-in fade-in-50 duration-300">
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription>Modifiez les informations essentielles du bien immobilier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre<span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      name="title"
                      value={bien.title || ''}
                      onChange={handleInputChange}
className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de bien<span className="text-red-500">*</span></Label>
                    <Select 
                      value={bien.type || ''} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type" className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Maison">Maison</SelectItem>
                        <SelectItem value="Bureau">Bureau</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Riad">Riad</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (MAD)<span className="text-red-500">*</span></Label>
                    <Input
                      id="price"
                      name="price"
                      value={bien.price || ''}
                      onChange={handleInputChange}
                      type="number"
className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut<span className="text-red-500">*</span></Label>
                    <Select 
                      value={bien.status || ''} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="status"className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Réservé">Réservé</SelectItem>
                        <SelectItem value="Vendu">Vendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 ">
                    <Label htmlFor="location">Ville<span className="text-red-500">*</span></Label>
                    <Input
                      id="location"
                      name="location"
                      value={bien.location || ''}
                      onChange={handleInputChange}
className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "                    />
                  </div>
                  <div className="space-y-2">
    <Label htmlFor="quartier">Quartier<span className="text-red-500">*</span></Label>
    <Input
      id="quartier"
      name="quartier"
      value={bien.quartier || ''}
      onChange={handleInputChange}
      className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "   
    />
  </div>
  <FormProvider {...form}>
  <FormField
  control={form.control}
  name="points_forts"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Points forts</FormLabel>
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
          <label key={item} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.value?.includes(item)}
              onChange={(e) => {
                const checked = e.target.checked;
                const updated = checked
                  ? [...(field.value || []), item]
                  : field.value?.filter((v) => v !== item);

                field.onChange(updated);
                setBien(prev => ({ ...prev, points_forts: updated }));
                setHasChanges(true);
              }}
              className="accent-blue-600  dark:[accent-color:#22c55e]"
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

</FormProvider>
{/* Proximité */}
<FormProvider {...form}>
<FormField
  control={form.control}
  name="proximite"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Proximité</FormLabel>
      <div className="grid grid-cols-1 gap-2">
        {["Transports", "Commerces", "Restaurants", "Écoles"].map((item) => (
          <label key={item} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.value?.includes(item)}
              onChange={(e) => {
                const checked = e.target.checked;
                const updated = checked
                  ? [...(field.value || []), item]
                  : field.value?.filter((v) => v !== item);

                field.onChange(updated);
                setBien(prev => ({ ...prev, proximite: updated }));
                setHasChanges(true);
              }}
              className="accent-blue-600  dark:[accent-color:#22c55e]"
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

    </FormProvider>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={bien.description || '' }
                      onChange={handleInputChange}
                      rows={6}
className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="animate-in fade-in-50 duration-300">
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <CardTitle>Détails supplémentaires</CardTitle>
                <CardDescription>Ajoutez des informations détaillées sur les caractéristiques du bien</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Nombre de chambres</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      value={bien.bedrooms || ''}
                      onChange={handleInputChange}
                      type="number"
                      className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Nombre de salles de bain</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      value={bien.bathrooms || ''}
                      onChange={handleInputChange}
                      type="number"
className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "                     />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Surface (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      value={bien.area || '' }
                      onChange={handleInputChange}
                      type="number"
className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "                     />
                  </div>
                  <div className="space-y-2">
    <Label htmlFor="construction_year">Année de construction</Label>
    <Input
      id="construction_year"
      name="construction_year"
      value={bien.construction_year || ''}
      onChange={handleInputChange}
      className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
    />
  </div>

  {/* Condition */}
  <div className="space-y-2">
    <Label htmlFor="condition">État général</Label>
    <Select
      value={bien.condition || ''}
      onValueChange={(val) => handleSelectChange('condition', val)}
    >
      <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Choisir l'état" />
      </SelectTrigger>
      <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">

        <SelectItem value="excellent">Excellent</SelectItem>
        <SelectItem value="moyen">Moyen</SelectItem>
        <SelectItem value="faible">Faible</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Exposition */}
  <div className="space-y-2">
    <Label htmlFor="exposition">Exposition</Label>
    <Select
      value={bien.exposition || ''}
      onValueChange={(val) => handleSelectChange('exposition', val)}
    >
      <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Choisir une exposition" />
      </SelectTrigger>
      <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">

        <SelectItem value="Sud">Sud</SelectItem>
        <SelectItem value="Nord">Nord</SelectItem>
        <SelectItem value="Est">Est</SelectItem>
        <SelectItem value="Ouest">Ouest</SelectItem>
        <SelectItem value="Sud-Est">Sud-Est</SelectItem>
        <SelectItem value="Sud-Ouest">Sud-Ouest</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Cuisine */}
  <div className="space-y-2">
    <Label htmlFor="cuisine">Cuisine</Label>
    <Select
      value={bien.cuisine || ''}
      onValueChange={(val) => handleSelectChange('cuisine', val)}
    >
      <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    " >
        <SelectValue placeholder="Type de cuisine" />
      </SelectTrigger>
 <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
        <SelectItem value="equipée">Équipée</SelectItem>
        <SelectItem value="non-equipée">Non équipée</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Climatisation */}
  <div className="space-y-2">
    <Label htmlFor="climatisation">Climatisation</Label>
    <Select
      value={bien.climatisation || ''}
      onValueChange={(val) => handleSelectChange('climatisation', val)}
    >
      <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Climatisation ?" />
      </SelectTrigger>
 <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
        <SelectItem value="oui">Oui</SelectItem>
        <SelectItem value="non">Non</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Terrasse */}
  <div className="space-y-2">
    <Label htmlFor="terrasse">Terrasse / Balcon</Label>
    <Select
      value={bien.terrasse || ''}
      onValueChange={(val) => handleSelectChange('terrasse', val)}
    >
      <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Terrasse ou balcon ?" />
      </SelectTrigger>
       <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">

        <SelectItem value="oui">Oui</SelectItem>
        <SelectItem value="non">Non</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Parking */}
  <div className="space-y-2">
    <Label htmlFor="has_parking">Parking</Label>
    <Select
      value={bien.has_parking || ''}
      onValueChange={(val) => handleSelectChange('has_parking', val)}
    >
      <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Y a-t-il un parking ?" />
      </SelectTrigger>
      <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">

        <SelectItem value="oui">Oui</SelectItem>
        <SelectItem value="non">Non</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Places de parking (seulement si oui) */}
  {bien.has_parking === 'oui' && (
    <div className="space-y-2">
      <Label htmlFor="parking_places">Nombre de places</Label>
      <Input
        id="parking_places"
        name="parking_places"
        value={bien.parking_places || ''}
        onChange={handleInputChange}
         className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 

      />
    </div>
  )}

  {/* Taux d'occupation */}
  <div className="space-y-2">
    <Label htmlFor="occupation_rate">Taux d’occupation (%)</Label>
    <Input
      id="occupation_rate"
      name="occupation_rate"
      value={bien.occupation_rate || ''}
      onChange={handleInputChange}
       className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
    />
  </div>

  {/* Valorisation estimée */}
  <div className="space-y-2">
    <Label htmlFor="estimated_valuation">Valorisation estimée (%)</Label>
    <Input
      id="estimated_valuation"
      name="estimated_valuation"
      value={bien.estimated_valuation || ''}
      onChange={handleInputChange}
       className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
    />
  </div>

  {/* Charges estimées */}
  <div className="space-y-2">
    <Label htmlFor="estimated_charges">Charges mensuelles (MAD)</Label>
    <Input
      id="estimated_charges"
      name="estimated_charges"
      value={bien.estimated_charges|| ''}
      onChange={handleInputChange}
       className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
    />
  </div>

  {/* Loyer mensuel */}
  <div className="space-y-2">
    <Label htmlFor="monthly_rent">Loyer mensuel (MAD)</Label>
    <Input
      id="monthly_rent"
      name="monthly_rent"
      value={bien.monthly_rent || ''}
      onChange={handleInputChange}
       className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
    />
  </div>
{/* date de disponibilité mensuel */}
<div className="space-y-2">
  <Label htmlFor="available_date">Date de disponibilité</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="w-full justify-start text-left font-normal dark:bg-gray-800 dark:text-white dark:border-gray-700"

      >
        <CalendarIcon className="mr-2 h-4 w-4 dark:text-white" />
        {available_date ? format(available_date, 'dd/MM/yyyy') : 'Sélectionner une date'}
      </Button>
    </PopoverTrigger>
        <PopoverContent className="w-auto p-0 dark:bg-gray-900 dark:border dark:border-gray-700">
      <Calendar
        mode="single"
        selected={available_date}
        onSelect={(date) => {
          setAvailableDate(date);
          handleInputChange({
            target: {
              name: 'available_date',
              value: date?.toISOString().split('T')[0] || '',
            }
          });
        }}
        initialFocus
        className="dark:bg-gray-900 dark:text-white"
      />
    </PopoverContent>
  </Popover>
</div>
  {/* Lien Google Maps */}
  <div className="space-y-2 md:col-span-2">
    <Label htmlFor="map_link">Lien Google Maps</Label>
    <Input
      id="map_link"
      name="map_link"
      value={bien.map_link || ''}
      onChange={handleInputChange}
       className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
    />
  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                <input
  type="checkbox"
  id="is_featured"
  checked={bien.isFeatured}
  onChange={(e) => handleCheckboxChange('is_featured', e.target.checked)}
    className="accent-blue-600 dark:[accent-color:#22c55e]"

/>
<Label htmlFor="is_featured">Mettre ce bien en vedette</Label>

                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="animate-in fade-in-50 duration-300">
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <CardTitle>Photos et médias</CardTitle>
                <CardDescription>Gérez les photos et autres médias associés à ce bien</CardDescription>
              </CardHeader>
             <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div className="col-span-full">
      <h4 className="text-sm font-medium mb-2">Images existantes :</h4>
    </div>

    {(bien.images || []).map((img: string, index: number) => {
      const replacement = bien.replacedImages?.find(r => r.index === index);
      const src = replacement
        ? URL.createObjectURL(replacement.file)
        : img; // ✅ Corrigé ici

      return (
        <div key={index} className="relative group rounded-md overflow-hidden border">
          <img
            src={src}
            alt={Image ${index + 1}}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedImageIndex(index);
                document.getElementById("imageUpload")?.click();
              }}
            >
              ✏️
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setDeleteTarget({ type: 'image', index });
                setDeleteConfirmOpen(true);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    })}

    <div className="col-span-full">
      <h4 className="text-sm font-medium mt-6 mb-2">Nouvelles images (non enregistrées) :</h4>
    </div>

    {(bien.newImages || []).map((file: File, i: number) => {
      const src = URL.createObjectURL(file);
      const index = (bien.images?.length || 0) + i;

      return (
        <div key={index} className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 group">
          <img
            src={src}
            alt={Nouvelle image ${i + 1}}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center space-x-2">
            <Button variant="outline" size="icon" disabled>
              ✏️
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                const newImages = [...(bien.newImages || [])];
                newImages.splice(i, 1);
                setBien((prev) => ({ ...prev, newImages }));
                setHasChanges(true);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    })}
  </div>

  {/* Hidden input for replacing image */}
  <input
    type="file"
    accept="image/*"
    id="imageUpload"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file || selectedImageIndex === null) return;

      setBien(prev => ({
        ...prev,
        replacedImages: [...(prev.replacedImages || []), { index: selectedImageIndex, file }],
      }));

      setSelectedImageIndex(null);
      setHasChanges(true);
      e.target.value = '';
    }}
    hidden
  />

  {/* Hidden input for new image */}
  <input
    type="file"
    accept="image/*"
    id="newImageUpload"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setBien(prev => ({
        ...prev,
        newImages: [...(prev.newImages || []), file],
      }));

      setHasChanges(true);
      e.target.value = '';
    }}
    hidden
  />

  {/* Add new image button */}
  <label htmlFor="newImageUpload" className="w-full block mt-4">
    <div className="w-full py-8 border-2 border-dashed rounded-md text-center transition-all duration-200
      bg-gray-50 hover:bg-gray-100 text-gray-600
      dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
      dark:border-gray-600
    ">
      <Upload className="h-5 w-5 inline-block mr-2" />
      Ajouter une image
    </div>
  </label>
</CardContent>




            </Card>
            <Card className="mt-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <CardHeader>
    <CardTitle>Plan</CardTitle>
    <CardDescription>Fichiers PDF ou autres documents associés</CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
  {Array.isArray(bien.documents) && bien.documents.length > 0 ? (
    bien.documents.map((doc: string, index: number) => (
      <div
        key={index}
        className="flex items-center justify-between border rounded-md p-3 hover:bg-gray-50 transition"
      >
        <a
          href={https://back-qhore.ondigitalocean.app/api/download/${bien.id}}
          className="flex items-center text-sm text-blue-600 hover:underline"
          download
        >
          📄 {Plan_${bien.title.replace(/\s/g, '_')}.pdf}
        </a>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById(replaceDocUpload-${index})?.click()}

          >
            ✏️
          </Button>
          <Button
  variant="destructive"
  size="icon"
  onClick={() => {
    setDeleteTarget({ type: 'document' });
    setDeleteConfirmOpen(true);
  }}
>
  <Trash className="h-4 w-4" />
</Button>

        </div>
      </div>
    ))
  ) : (
    <>
      <p className="text-sm text-gray-500">Aucun document disponible</p>

      <label htmlFor="docUpload" className="w-full block">
        <Button
          variant="outline"
          className="w-full py-8 border-2 border-dashed rounded-md text-center transition-all duration-200
    bg-gray-50 hover:bg-gray-100 text-gray-600
    dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
    dark:border-gray-600
  "
          asChild
        >
          <div>
            <Upload className="h-4 w-4 mr-2" />
            Ajouter un document
          </div>
        </Button>
      </label>
    </>
  )}

  {/* Afficher temporairement le document ajouté */}
  {bien.newDocuments && bien.newDocuments.length > 0 && (
    <div className="space-y-2">
      {bien.newDocuments.map((file: File, i: number) => (
        <div key={i} className="text-sm text-gray-600">📎 {file.name}</div>
      ))}
    </div>
  )}

  {/* Input fichier pour remplacement ou ajout */}
<input
  type="file"
  id={replaceDocUpload-${index}}
  hidden
  accept=".pdf,.doc,.docx"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReplacedDocuments(prev => ({
        ...prev,
        [index]: file,
      }));
    }
  }}
/>


  <input
    type="file"
    id="docUpload"
    accept=".pdf,.doc,.docx,.xls,.xlsx"
    onChange={(e) => {
      const files = Array.from(e.target.files || []);
      setBien(prev => ({
        ...prev,
        newDocuments: files.slice(0, 1),
      }));
      setHasChanges(true);
    }}
    hidden
  />
</CardContent>

</Card>


          </TabsContent>
          <TabsContent value="Propriétaire" className="animate-in fade-in-50 duration-300">
  <Card className="mt-6 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <CardHeader>
      <CardTitle>Informations du propriétaire</CardTitle>
      <CardDescription>Ajoutez ou modifiez les coordonnées du propriétaire du bien</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="owner_name">Nom du propriétaire</Label>
          <Input
            id="owner_name"
            name="owner_name"
            value={bien.owner_name || ''}
            onChange={handleInputChange}
             className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner_email">Email du propriétaire</Label>
          <Input
            id="owner_email"
            name="owner_email"
            type="email"
            value={bien.owner_email || ''}
            onChange={handleInputChange}
             className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner_phone">Téléphone</Label>
          <Input
            id="owner_phone"
            name="owner_phone"
            type="tel"
            value={bien.owner_phone || ''}
            onChange={handleInputChange}
             className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
          />
        </div>

       <div className="space-y-2">
  <Label htmlFor="owner_nationality">Nationalité</Label>
  <Select
    value={bien.owner_nationality || ''}
    onValueChange={(val) => handleSelectChange('owner_nationality', val)}
  >
    <SelectTrigger
      id="owner_nationality"
      className="
        transition-all duration-200
        hover:border-luxe-blue/30
        bg-white text-black border-gray-300
        dark:bg-gray-900 dark:text-white dark:border-gray-700
        focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
        dark:focus:ring-luxe-blue/30
      "
    >
      <SelectValue placeholder="Sélectionner une nationalité" />
    </SelectTrigger>
    <SelectContent
      className="
        bg-white text-black
        dark:bg-gray-900 dark:text-white
        border border-gray-200 dark:border-gray-700
      "
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
        <SelectItem key={nationality} value={nationality}>
          {nationality}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        <div className="space-y-2 mt-4">
  <Label>Documents du propriétaire</Label>

  {/* Liste des documents existants */}
  {Array.isArray(bien.owner_documents) && bien.owner_documents.length > 0 ? (
  bien.owner_documents.map((doc: string, index: number) => (
    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 border rounded-md">
      <a
        href={https://back-qhore.ondigitalocean.app/storage/${doc.replace('storage/', '')}}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline"
      >
        📄 {doc.split('/').pop()}
      </a>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => ownerDocInputRefs.current[index]?.click()}
        >
          ✏️
        </Button>
        <Button
  variant="destructive"
  size="icon"
  onClick={() => {
    setDeleteTarget({ type: 'ownerDoc', index }); // ou 'image' / 'document'
    setDeleteConfirmOpen(true);
  }}
>
  <Trash className="h-4 w-4" />
</Button>


        {/* input de remplacement fichier */}
        <input
  type="file"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  ref={(el) => (ownerDocInputRefs.current[index] = el)}
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReplacedOwnerDocuments((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex((r) => r.index === index);
      if (existingIndex !== -1) {
        updated[existingIndex] = { index, file };
      } else {
        updated.push({ index, file });
      }
      return updated;
    });

    setHasChanges(true);
  }}
/>

{/* 🔽 AJOUTE CE BLOC ICI */}
{replacedOwnerDocuments.find(r => r.index === index) && (
  <div className="text-xs text-green-600 mt-1">
    ✅ Nouveau document prêt à être enregistré
  </div>
)}


      </div>
    </div>
  ))
) : (
  <div className="text-sm text-gray-500">Aucun document associé au propriétaire.</div>
)}
{/* Bouton d’ajout */}
<Button
  variant="outline"
  className="w-full mt-2 py-8 border-2 border-dashed rounded-md text-center transition-all duration-200
    bg-gray-50 hover:bg-gray-100 text-gray-600
    dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300
    dark:border-gray-600
  "
  onClick={() => newOwnerDocInputRef.current?.click()}
>
  <Upload className="h-4 w-4 mr-2" />
  Ajouter un document du propriétaire
</Button>

<input
  type="file"
  accept=".pdf,.doc,.docx,.xls,.xlsx"
  ref={newOwnerDocInputRef}
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBien((prev) => ({
      ...prev,
      newOwnerDocuments: [...(prev.newOwnerDocuments || []), file],
    }));
    setHasChanges(true);
    e.target.value = '';
  }}
/>

{/* Affichage des fichiers ajoutés */}
{bien.newOwnerDocuments?.length > 0 && (
  <div className="space-y-2 mt-2">
    {bien.newOwnerDocuments.map((file: File, i: number) => (
      <div
        key={i}
        className="flex justify-between items-center bg-gray-50 rounded p-2 border"
      >
        <span className="text-sm text-gray-700 truncate max-w-[75%]">
          📎 {file.name}
        </span>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            const updated = [...bien.newOwnerDocuments];
            updated.splice(i, 1);
            setBien(prev => ({ ...prev, newOwnerDocuments: updated }));
            setHasChanges(true);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
)}

</div>

      </div>
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={bg-luxe-blue hover:bg-luxe-blue/90 transition-all duration-200 ${hasChanges ? 'hover:scale-105 active:scale-95' : 'opacity-70'}}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </div>
       {/* AlertDialog  */}
   <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
      <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
        Cette action est irréversible. Le bien sera supprimé définitivement.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="text-gray-700 dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1">
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleConfirmedDelete}
        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Suppression...
          </>
        ) : (
          <>
            <Trash className="mr-2 h-4 w-4" />
            Oui, supprimer
          </>
        )}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </AdminLayout>
  );
};

export default PropertyEdit;
