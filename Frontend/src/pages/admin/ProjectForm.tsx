import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Building, MapPin, Clipboard, Ruler, UploadCloud, AlertCircle, Loader2, XCircle, Trash2, Check, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { Project } from '@/types/project';

interface FormData {
  name: string;
  location: string;
  type: string;
  details: string;
  surface: string;
  status: string;
  images: string[];
}

interface FormErrors {
  name?: string[];
  location?: string[];
  type?: string[];
  details?: string[];
  surface?: string[];
  status?: string[];
  images?: string[];
}

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Project | null;
  isEditing: boolean;
  onProjectSuccess: (project: Project) => void;
}

export function ProjectForm({ 
  open, 
  onOpenChange, 
  initialData, 
  isEditing, 
  onProjectSuccess 
}: ProjectFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    type: '',
    details: '',
    surface: '',
    status: '',
    images: [],
  });
  
  const [newlyUploadedFiles, setNewlyUploadedFiles] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    console.log('Initial data:', initialData);
    if (open) {
      if (isEditing && initialData) {
        setFormData({
          name: initialData.name || '',
          location: initialData.location || '',
          type: initialData.type || '',
          details: initialData.details || '',
          surface: initialData.surface || '',
          status: initialData.status || '',
          images: initialData.images || [],
        });
        setNewlyUploadedFiles([]);
      } else {
        // Reset form
        setFormData({
          name: '',
          location: '',
          type: '',
          details: '',
          surface: '',
          status: '',
          images: [],
        });
        setNewlyUploadedFiles([]);
      }
      setFormErrors({});
      setIsSubmitted(false);
    }
  }, [open, isEditing, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field if it's being corrected
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewlyUploadedFiles((prev) => [...prev, ...files]);
      if (formErrors.images) {
        setFormErrors((prev) => ({ ...prev, images: undefined }));
      }
    }
  };

  const handleRemoveImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewlyUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  // Validation côté client avant envoi
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = ['Le nom du projet est requis'];
    }
    
    if (!formData.location.trim()) {
      errors.location = ['La localisation est requise'];
    }
    
    if (!formData.type.trim()) {
      errors.type = ['Le type de projet est requis'];
    }
    
    if (!formData.details.trim()) {
      errors.details = ['Les détails sont requis'];
    }
    
    if (!formData.surface.trim()) {
      errors.surface = ['La surface est requise'];
    }
    
    if (!formData.status.trim()) {
      errors.status = ['Le statut est requis'];
    }
    
    // Vérifier les images seulement pour un nouveau projet
    if (!isEditing && newlyUploadedFiles.length === 0) {
      errors.images = ['Au moins une image est requise'];
    }
    
    // Pour l'édition, vérifier qu'il y a au moins une image (existante ou nouvelle)
    if (isEditing && formData.images.length === 0 && newlyUploadedFiles.length === 0) {
      errors.images = ['Au moins une image est requise'];
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!validateForm()) {
      console.log('Validation échouée', formErrors);
      return;
    }
    
    setIsLoading(true);
    setFormErrors({});

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      onOpenChange(false);
      setIsLoading(false);
      return;
    }

    try {
      const formPayload = new FormData();
      
      // Debug: afficher les données avant envoi
      console.log('Données à envoyer:', {
        name: formData.name,
        location: formData.location,
        type: formData.type,
        details: formData.details,
        surface: formData.surface,
        status: formData.status,
        existingImages: formData.images,
        newFiles: newlyUploadedFiles.length
      });
      
      // Toujours envoyer les valeurs du formulaire avec trim()
      formPayload.append('name', formData.name.trim());
      formPayload.append('location', formData.location.trim());
      formPayload.append('type', formData.type.trim());
      formPayload.append('details', formData.details.trim());
      formPayload.append('surface', formData.surface.trim());
      formPayload.append('status', formData.status.trim());

      // Gestion des nouvelles images
      newlyUploadedFiles.forEach((file, index) => {
        formPayload.append(`images[${index}]`, file);
      });

      // Pour l'édition, ajouter les images existantes
      if (isEditing && formData.images?.length) {
        formData.images.forEach((image, index) => {
          formPayload.append(`existing_images[${index}]`, image);
        });
      }

      // Debug: afficher le contenu de FormData
   

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      };

  const BASE_API_URL = 'https://back-qhore.ondigitalocean.app/api';

const url = isEditing && initialData?.id
  ? `${BASE_API_URL}/projects/${initialData.id}`
  : `${BASE_API_URL}/projects`;

      
      // Vérification de sécurité pour l'édition
      if (isEditing && !initialData?.id) {
        console.error('ID du projet manquant pour la mise à jour');
        alert('Erreur: ID du projet manquant pour la mise à jour');
        setIsLoading(false);
        return;
      }

      const method = isEditing ? 'put' : 'post';
      
      // Pour les requêtes PUT avec Laravel, utiliser _method
      if (isEditing && initialData?.id) {
        formPayload.append('_method', 'PUT');
        // Utiliser POST avec _method pour les fichiers
        const response = await axios.post(url, formPayload, config);
        console.log('Mise à jour réussie:', response.data);
        setIsSubmitted(true);
        onProjectSuccess(response.data.data || response.data);
      } else if (!isEditing) {
        const response = await axios.post(url, formPayload, config);
        console.log('Création réussie:', response.data);
        setIsSubmitted(true);
        onProjectSuccess(response.data.data || response.data);
      } else {
        throw new Error('Configuration invalide pour la mise à jour');
      }

    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });

      if (error.response?.status === 422) {
        console.log('Erreurs de validation:', error.response.data.errors);
        setFormErrors(error.response.data.errors || {});
      } else if (error.response?.status === 401) {
        alert("Session expirée. Veuillez vous reconnecter.");
        localStorage.removeItem("access_token");
        onOpenChange(false);
      } else {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error ||
                           error.message ||
                           'Une erreur inattendue s\'est produite';
        alert(`Erreur: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form state after closing
    setFormData({
      name: '',
      location: '',
      type: '',
      details: '',
      surface: '',
      status: '',
      images: [],
    });
    setNewlyUploadedFiles([]);
    setFormErrors({});
    setIsLoading(false);
    setIsSubmitted(false);
  };

  // Fonction helper pour obtenir le premier message d'erreur
  const getErrorMessage = (field: keyof FormErrors): string | undefined => {
    const errors = formErrors[field];
    return errors && errors.length > 0 ? errors[0] : undefined;
  };
const handleEditImage = (index: number, isNew: boolean) => {
  // Créez un input file caché
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const newFile = target.files[0];
      
      if (isNew) {
        // Pour les nouvelles images
        setNewlyUploadedFiles(prev => {
          const newFiles = [...prev];
          newFiles[index] = newFile;
          return newFiles;
        });
      } else {
        // Pour les images existantes, nous devons les traiter comme de nouvelles images
        // car nous ne pouvons pas modifier directement les images existantes
        setNewlyUploadedFiles(prev => {
          const newFiles = [...prev];
          newFiles.push(newFile);
          return newFiles;
        });
        // Supprime l'ancienne image
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      }
    }
  };
  
  input.click();
};
  return (
    <Dialog open={open} onOpenChange={handleClose}>
<DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isEditing ? 'Modifier le Projet' : 'Ajouter un Nouveau Projet'}
          </DialogTitle>
          <DialogDescription className="text-base text-center text-gray-800 dark:text-white">
  {isEditing
    ? `Modifiez les informations du projet "${initialData?.name || ''}".`
    : 'Remplissez les détails ci-dessous pour ajouter un nouveau projet.'}
</DialogDescription>

        </DialogHeader>

        <Separator className="my-4" />

        <ScrollArea className="pr-4 max-h-[60vh]">
          {!isSubmitted ? (
           <form onSubmit={handleSubmit} className="space-y-6 text-gray-800 dark:text-white">
              {/* Project Name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-base font-medium">
                  Nom du Projet <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                   className={cn(
  "pl-10 w-full transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  getErrorMessage('name') && "border-red-500",
  isEditing && "bg-gray-800 border-gray-600 text-white"
)}

                    placeholder="Nom du projet"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                {getErrorMessage('name') && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getErrorMessage('name')}
                  </p>
                )}
              </div>

              {/* Location & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Location */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="location" className="text-base font-medium">
                    Localisation <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="location"
                      name="location"
                      className={cn(
  "pl-10 w-full transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  getErrorMessage('location') && "border-red-500",
  isEditing && "bg-gray-800 border-gray-600 text-white"
)}

                      placeholder="Ville, Pays"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  {getErrorMessage('location') && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getErrorMessage('location')}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="type" className="text-base font-medium">
                    Type de Projet <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="type"
                      name="type"
                    className={cn(
  "pl-8 w-full transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  getErrorMessage('type') && "border-red-500",
  isEditing && "bg-gray-800 border-gray-600 text-white"
)}

                      placeholder="Ex: Résidentiel, Commercial"
                      value={formData.type}
                      onChange={handleInputChange}
                    />
                  </div>
                  {getErrorMessage('type') && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getErrorMessage('type')}
                    </p>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="details" className="text-base font-medium">
                  Détails <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Clipboard className="h-4 w-4 text-gray-400" />
                  </div>
                  <Textarea
                    id="details"
                    name="details"
                   className={cn(
  "min-h-15 w-full pl-10 pt-3 transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  getErrorMessage('details') && "border-red-500",
  isEditing && "bg-gray-800 border-gray-600 text-white"
)}

                    placeholder="Description du projet..."
                    value={formData.details}
                    onChange={handleInputChange}
                  />
                </div>
                {getErrorMessage('details') && (
                  <p className="text-sm text-red-500 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {getErrorMessage('details')}
                  </p>
                )}
              </div>

              {/* Surface & Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Surface */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="surface" className="text-base font-medium">
                    Surface <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Ruler className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="surface"
                      name="surface"
                    className={cn(
  "pl-10 w-full transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  getErrorMessage('surface') && "border-red-500",
  isEditing && "bg-gray-800 border-gray-600 text-white"
)}

                      placeholder="Ex: 2,400 m²"
                      value={formData.surface}
                      onChange={handleInputChange}
                    />
                  </div>
                  {getErrorMessage('surface') && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getErrorMessage('surface')}
                    </p>
                  )}
                </div>

                {/* Images */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="images" className="text-base font-medium">
                    Images <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <UploadCloud className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                     className={cn(
  "pl-10 w-full transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  getErrorMessage('images') && "border-red-500",
  isEditing && "bg-gray-800 border-gray-600 text-white"
)}

                      onChange={handleFileChange}
                    />
                  </div>
                  {(formData.images.length > 0 || newlyUploadedFiles.length > 0) && (
  <div className="mt-2 grid grid-cols-2 gap-2">
    <AnimatePresence>
      {formData.images.map((image, index) => (
        <motion.div
          key={`existing-${index}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative group border rounded-md overflow-hidden bg-gray-100 h-20"
        >
          <img src={image} alt={`Image ${index}`} className="object-cover w-full h-full" />

          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700"
              onClick={() => handleEditImage(index, false)}
            >
              <Edit className="h-4 w-4 text-white" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => handleRemoveImage(index, false)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
      {newlyUploadedFiles.map((file, index) => (
        <motion.div
          key={`new-${index}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative group border rounded-md overflow-hidden bg-gray-100 h-20"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`New ${index}`}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700"
              onClick={() => handleEditImage(index, true)}
            >
              <Edit className="h-4 w-4 text-white" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={() => handleRemoveImage(index, true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)}
                  {getErrorMessage('images') && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {getErrorMessage('images')}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
            <div className="flex flex-col space-y-1.5">
  <Label htmlFor="status" className="text-base font-medium">
    Statut <span className="text-red-500">*</span>
  </Label>
  <Select
    value={formData.status}
    onValueChange={handleSelectChange('status')}
  >
    <SelectTrigger
      className={cn(
        "w-full ml-2 flex items-center justify-between rounded-md border px-3 py-2 transition-colors",
        "bg-white text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600",
        isEditing && ""
      )}
    >
      <SelectValue placeholder="Choisir un statut" />
    </SelectTrigger>
    <SelectContent
      className={cn(
        "bg-white text-gray-800 border border-gray-300 rounded-md shadow-lg transition-transform duration-200 transform origin-top scale-95 data-[state=open]:scale-100 max-h-60 overflow-y-auto",
        "dark:bg-gray-800 dark:text-white dark:border-gray-600"
      )}
    >
      {["Livré", "En cours", "A venir"].map((status) => (
        <SelectItem
          key={status}
          value={status}
                      className="cursor-pointer px-3 py-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white"

        >
          {status}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {getErrorMessage('status') && (
    <p className="text-sm text-red-500 mt-1 flex items-center">
      <AlertCircle className="h-3 w-3 mr-1" />
      {getErrorMessage('status')}
    </p>
  )}
</div>


              <DialogFooter className="flex justify-end gap-3 pt-4">
               <Button
  type="button"
  variant="outline"
  onClick={handleClose}
        className="text-black border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800"

>
  <XCircle className="h-4 w-4 mr-2 text-black" /> Annuler
</Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-luxe-blue hover:bg-luxe-blue/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditing ? "Mise à jour..." : "Ajout en cours..."}
                    </>
                  ) : (
                    <>
                      <Building className="h-4 w-4 mr-2" />
                      {isEditing ? "Mettre à jour" : "Ajouter"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>


          ) : (
            <div className="text-center py-8">
              <div className={`border p-8 rounded-lg ${isEditing ? 'bg-gray-800 border-gray-600' : 'bg-green-50 border-green-200'}`}>
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 ${isEditing ? 'text-green-400' : 'text-green-800'}`}>
                  {isEditing ? "Mise à jour réussie !" : "Projet Ajouté !"}
                </h3>
                <p className={`text-base mb-4 ${isEditing ? 'text-gray-300' : 'text-gray-700'}`}>
                  {isEditing
                    ? `Le projet "${formData.name}" a été mis à jour.`
                    : `Le projet "${formData.name}" a été ajouté.`}
                </p>
                <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700">
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ProjectForm;
