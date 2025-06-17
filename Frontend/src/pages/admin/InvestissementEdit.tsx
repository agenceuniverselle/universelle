import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Trash, Upload,ChevronLeft, Save, X,Loader2  } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
interface InvestmentDetails {
  investmentType: string;
  projectStatus: string;
  minEntryPrice: string;
  recommendedDuration: string;
  returnRate: string;
  partners: string[];
  financingEligibility: boolean;
}

interface Property {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  area: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  investmentDetails: InvestmentDetails;
  images: string[];
  newImages: File[];
  replacedImages: { index: number; file: File }[];
  newImagePreviews: string[];
  documents: string[];
  newDocuments: File[];
  replacedDocuments: { index: number; file: File }[];
}

const InvestissementEdit = () => {
  const { propertyId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [bien, setBien] = useState<Property>({
     id: 0,
    title: '',
    location: '',
    type: '',
    price: '',
    area: '',
    status: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    investmentDetails: {
      investmentType: '',
      projectStatus: '',
      minEntryPrice: '',
      recommendedDuration: '',
      returnRate: '',
      partners: [],
      financingEligibility: false,
    },
    images: [],
    newImages: [],
    replacedImages: [],
    newImagePreviews: [], 
    documents: [],
    newDocuments: [],
    replacedDocuments: [],
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const docReplaceRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteDocIndex, setDeleteDocIndex] = useState<number | null>(null);
  const [replacedDocuments, setReplacedDocuments] = useState<{ index: number; file: File }[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'document' | 'image'; index: number | null }>({ type: 'document', index: null });
  const getToken = () => localStorage.getItem("access_token");
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?')) {
        navigate('/admin/investissements');
      }
    } else {
      navigate('/admin/investissements');
    }
  };
  const handleConfirmedDelete = async () => {
    if (!propertyId || deleteTarget.index === null) return;
  
    try {
      setIsDeleting(true);
  
      if (deleteTarget.type === 'document') {
        await axios.delete(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}/document/${deleteTarget.index}`);
        const updated = [...bien.documents];
        updated.splice(deleteTarget.index, 1);
        setBien(prev => ({ ...prev, documents: updated }));
      }
  
      if (deleteTarget.type === 'image') {
        await axios.delete(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}/image/${deleteTarget.index}`);
        const updated = [...bien.images];
        updated.splice(deleteTarget.index, 1);
        setBien(prev => ({ ...prev, images: updated }));
      }
  
      setHasChanges(true);
      toast({ title: "Élément supprimé avec succès" });
  
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast({
        title: "Erreur",
        description: "La suppression a échoué.",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setIsDeleting(false);
      setDeleteTarget({ type: 'document', index: null });
    }
  };
  
  const handleDeleteDocument = async (indexToDelete: number | null) => {
    if (indexToDelete === null || propertyId === undefined) return;
  
    try {
      await axios.delete(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}/document/${indexToDelete}`);
      const updatedDocs = [...bien.documents];
      updatedDocs.splice(indexToDelete, 1);
      setBien(prev => ({
        ...prev,
        documents: updatedDocs,
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
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteDocIndex(null);
    }
  };
  
  //delete image 
  const handleDeleteImage = async (index: number) => {
    if (propertyId === undefined) return;
  
    try {
      await axios.delete(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}/image/${index}`);
      const updatedImages = [...bien.images];
      updatedImages.splice(index, 1);
      setBien(prev => ({ ...prev, images: updatedImages }));
      setHasChanges(true);
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur suppression image :", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'image.",
        variant: "destructive",
      });
    }
  };
  
  useEffect(() => {
    const fetchBien = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error("Non authentifié");
        const res = await axios.get(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        const data = res.data.data ?? res.data;
        console.log("Bien récupéré depuis l'API :", data);

        data.investmentDetails = {
            investmentType: data.investmentType || '',
            projectStatus: data.projectStatus || '',
            minEntryPrice: data.minEntryPrice || '',
            recommendedDuration: data.recommendedDuration || '',
            returnRate: data.returnRate || '',
            partners: data.partners || [],
            financingEligibility: data.financingEligibility ?? false,
          };
          
        // ✅ Vérifie et parse les champs complexes si nécessaire
        data.images = Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]');
        data.documents = Array.isArray(data.documents) ? data.documents : JSON.parse(data.documents || '[]');
        
        data.investmentDetails = data.investmentDetails
  ? (typeof data.investmentDetails === 'string'
      ? JSON.parse(data.investmentDetails)
      : data.investmentDetails)
  : {
      investmentType: '',
      projectStatus: '',
      minEntryPrice: '',
      recommendedDuration: '',
      returnRate: '',
      partners: [],
      financingEligibility: false,
    };

  
        setBien(data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        toast({ title: "Erreur", description: "Impossible de charger le bien", variant: "destructive" });
      }
    };
  
    fetchBien();
  }, [propertyId]);
  
  const handleImageReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedImageIndex === null) return;
  
    const updatedImages = [...bien.images];
    updatedImages[selectedImageIndex] = URL.createObjectURL(file); // remplace l'image affichée
  
    const updatedReplaced = [...(bien.replacedImages || [])];
    updatedReplaced.push({ index: selectedImageIndex, file });
  
    setBien(prev => ({
      ...prev,
      images: updatedImages,
      replacedImages: updatedReplaced,
    }));
  
    setHasChanges(true);
    setSelectedImageIndex(null);
  };
  

  const handleDocumentReplace = (file: File, index: number) => {
    const updated = [...(bien.replacedDocuments || [])];
    const existing = updated.findIndex(d => d.index === index);
    if (existing !== -1) {
      updated[existing] = { index, file };
    } else {
      updated.push({ index, file });
    }

    setBien(prev => ({ ...prev, replacedDocuments: updated }));
    setHasChanges(true);
  };

  const handleDocumentAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if ((bien.documents?.length || 0) + (bien.newDocuments?.length || 0) >= 2) return;

    setBien(prev => ({
      ...prev,
      newDocuments: [...(prev.newDocuments || []), file]
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
  
    // Champs simples
    formData.append('title', bien.title);
    formData.append('location', bien.location);
    formData.append('type', bien.type);
    formData.append('price', bien.price);
    formData.append('area', bien.area);
    formData.append('bedrooms', bien.bedrooms);
    formData.append('bathrooms', bien.bathrooms);
    formData.append('description', bien.description);
    formData.append('status', bien.status || '');

    // Champs d'investissement (flatten)
    formData.append('investmentType', bien.investmentDetails.investmentType || '');
    formData.append('projectStatus', bien.investmentDetails.projectStatus || '');
    formData.append('minEntryPrice', bien.investmentDetails.minEntryPrice || '');
    formData.append('recommendedDuration', bien.investmentDetails.recommendedDuration || '');
    formData.append('returnRate', bien.investmentDetails.returnRate || '');
    formData.append('financingEligibility', bien.investmentDetails.financingEligibility ? '1' : '0');
  
    // Si partners est un tableau
    if (Array.isArray(bien.investmentDetails.partners)) {
      bien.investmentDetails.partners.forEach((partner: string, index: number) => {
        formData.append(`partners[${index}]`, partner);
      });
    }
  
    // Nouvelles images
    bien.newImages?.forEach((file: File) => {
      formData.append('images[]', file);
    });
  
    // Images remplacées
    bien.replacedImages?.forEach(({ index, file }: { index: number; file: File }) => {
        formData.append(`replace_images_${index}`, file); // underscore !

    });
  
    // Nouveaux documents
    bien.newDocuments?.forEach((file: File) => {
      formData.append('documents[]', file);
    });
  
    // Documents remplacés
   
    if (bien.replacedDocuments?.length) {
        bien.replacedDocuments.forEach(({ index, file }) => {
          formData.append(`replace_documents_${index}`, file);

        });
      }
      for (const [key, value] of formData.entries()) {
        console.log(`KEY: ${key}`, value);
      }
      
    try {
        const token = getToken();
        if (!token) throw new Error("Non authentifié");
      const res =   await axios.post(
        `https://back-qhore.ondigitalocean.app/api/properties/${propertyId}?_method=PUT`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        }
      );
  
      toast({ title: 'Bien mis à jour', description: res.data.message });
      navigate('/admin/investissements');
    } catch (err: unknown) {
         if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message || "Erreur inconnue";
    const details = err.response?.data?.errors;
    
        toast({
          title: "Erreur de validation",
          description: details
            ? Object.values(details).flat().join('\n')
            : message,
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <AdminLayout title="Modifier un bien à investir">
      <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
  <Button 
    variant="outline" 
    onClick={() => navigate('/admin/investissements')}
    className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95 dark:text-black"
  >
    <ChevronLeft className="h-4 w-4 mr-2" />
    Retour à la liste
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
      disabled={!hasChanges}
      className={`bg-luxe-blue text-white hover:bg-luxe-blue/90 transition-all duration-200 ${hasChanges ? 'hover:scale-105 active:scale-95' : 'opacity-70'}`}
    >
      <Save className="h-4 w-4 mr-2" />
      Enregistrer les modifications
    </Button>
  </div>
</div>

        {/* Infos générales */}
        <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
          <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label>Titre</Label>
    <Input
      value={bien.title}
      onChange={(e) =>{
      setBien({ ...bien, title: e.target.value });
      setHasChanges(true);  
    }}
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
  <div>
    <Label>Localisation</Label>
    <Input
      value={bien.location}
      onChange={(e) =>{
      setBien({ ...bien, location: e.target.value });
      setHasChanges(true); 
    }}
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

  <div>
    <Label>Type</Label>
    <Input
      value={bien.type}
      onChange={(e) =>{
      setBien({ ...bien, type: e.target.value });
      setHasChanges(true);
    }}
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
  <div>
    <Label>Prix</Label>
    <Input
      type="number"
      value={bien.price}
      onChange={(e) => {
      setBien({ ...bien, price: e.target.value });
      setHasChanges(true);
    }}
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

  <div>
    <Label>Surface (m²)</Label>
    <Input
      type="number"
      value={bien.area}
      onChange={(e) => {
      setBien({ ...bien, area: e.target.value });
      setHasChanges(true);
    }}
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
  <div>
    <Label>Chambres</Label>
    <Input
      type="number"
      value={bien.bedrooms}
      onChange={(e) => {
      setBien({ ...bien, bedrooms: e.target.value });
      setHasChanges(true);
    }}
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

  <div>
    <Label>Salles de bain</Label>
    <Input
      type="number"
      value={bien.bathrooms}
      onChange={(e) =>{
      setBien({ ...bien, bathrooms: e.target.value });
      setHasChanges(true);
    }}
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
  <div>
  <Label>Statut</Label>
  <Select
  value={bien.status || ''}
  onValueChange={(value) => {
    setBien({ ...bien, status: value });
    setHasChanges(true);
  }}
>
  <SelectTrigger className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
    <SelectValue placeholder="Sélectionner..." />
  </SelectTrigger>
  <SelectContent className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
    <SelectItem value="Disponible" className="hover:bg-white">Disponible</SelectItem>
    <SelectItem value="Réservé" className="hover:bg-white">Réservé</SelectItem>
    <SelectItem value="Vendu" className="hover:bg-white">Vendu</SelectItem>
  </SelectContent>
</Select>
</div>
  <div className="col-span-2">
    <Label>Description</Label>
  <textarea
  value={bien.description}
  onChange={(e) => {
    setBien({ ...bien, description: e.target.value });
    setHasChanges(true);
  }}
  rows={4} // tu peux ajuster selon la hauteur souhaitée
  className="
    w-full
    rounded-md
    border
    p-2
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "
  placeholder="Décrivez le bien ici..."
/>
  </div>
</div>

          </CardContent>
        </Card>

        {/* Détails d’investissement */}
               <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <CardHeader><CardTitle>Détails d'investissement</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label>Type d'investissement</Label>
    <Input
      value={bien.investmentDetails?.investmentType || ''}
      onChange={(e) =>{
        setBien(prev => ({
          ...prev,
          investmentDetails: { ...prev.investmentDetails, investmentType: e.target.value }
        }));
        setHasChanges(true);
      }}
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

  <div>
    <Label>Statut projet</Label>
    <Input
      value={bien.investmentDetails?.projectStatus || ''}
      onChange={(e) =>{
        setBien(prev => ({
          ...prev,
          investmentDetails: { ...prev.investmentDetails, projectStatus: e.target.value }
        }));
        setHasChanges(true);
      }}
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

  <div>
    <Label>Prix d'entrée</Label>
    <Input
      type="number"
      value={bien.investmentDetails?.minEntryPrice || ''}
      onChange={(e) =>{
        setBien(prev => ({
          ...prev,
          investmentDetails: { ...prev.investmentDetails, minEntryPrice: e.target.value }
        }));
        setHasChanges(true);
      }}
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

  <div>
    <Label>Durée recommandée</Label>
    <Input
      value={bien.investmentDetails?.recommendedDuration || ''}
      onChange={(e) =>{
        setBien(prev => ({
          ...prev,
          investmentDetails: { ...prev.investmentDetails, recommendedDuration: e.target.value }
        }));
        setHasChanges(true);
      }}
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

  <div>
    <Label>Rentabilité (%)</Label>
    <Input
      type="number"
      value={bien.investmentDetails?.returnRate || ''}
      onChange={(e) =>{
        setBien(prev => ({
          ...prev,
          investmentDetails: { ...prev.investmentDetails, returnRate: e.target.value }
        }));
        setHasChanges(true);
      }}
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
  <div className="col-span-2 space-y-2">
  <Label>Partenaires</Label>
  {bien.investmentDetails.partners.map((partner: string, index: number) => (
    <div key={index} className="flex items-center gap-2">
      <Input
  value={partner}
  onChange={(e) => {
    const updatedPartners = [...bien.investmentDetails.partners];
    updatedPartners[index] = e.target.value;
    setBien(prev => ({
      ...prev,
      investmentDetails: {
        ...prev.investmentDetails,
        partners: updatedPartners
      }
    }));
    setHasChanges(true);
  }}
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

      <Button
        type="button"
        variant="destructive"
        size="icon"
        onClick={() => {
          const updatedPartners = bien.investmentDetails.partners.filter((_, i) => i !== index);
          setBien(prev => ({
            ...prev,
            investmentDetails: {
              ...prev.investmentDetails,
              partners: updatedPartners
            }
          }));
          setHasChanges(true);
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  ))}
  <Button
    type="button"
    onClick={() => {
      setBien(prev => ({
        ...prev,
        investmentDetails: {
          ...prev.investmentDetails,
          partners: [...prev.investmentDetails.partners, '']
        }
      }));
      setHasChanges(true);
    }}
    className="mt-2"
  >
    + Ajouter un partenaire
  </Button>
</div>

</CardContent>

        </Card>

        {/* Documents */}
               <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <CardHeader>
    <CardTitle>Documents d’investissement</CardTitle>
    <CardDescription>Maximum 2 fichiers PDF</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {(bien.documents || []).map((doc: string, index: number) => (
      <div key={index} className="flex items-center justify-between border rounded-md p-3">
        <a
          href={`https://back-qhore.ondigitalocean.app/api/download/${bien.id}/${index}`}
          download
          className="text-blue-600 hover:underline"
        >
          📄 {index === 0 ? "Brochure complète.pdf" : "Plans détaillés.pdf"}
        </a>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => document.getElementById(`replace-document-${index}`)?.click()}
          >
            ✏️
          </Button>
          <Button
  variant="destructive"
  size="icon"
  onClick={() => {
    setDeleteTarget({ type: 'document', index });
    setDeleteConfirmOpen(true);
  }}
>
  <Trash className="h-4 w-4" />
</Button>


          <input
            type="file"
            accept=".pdf"
            hidden
            id={`replace-document-${index}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setBien(prev => {
                const updated = [...(prev.replacedDocuments || [])];
                const existingIndex = updated.findIndex(r => r.index === index);
                if (existingIndex !== -1) {
                  updated[existingIndex] = { index, file };
                } else {
                  updated.push({ index, file });
                }
                return { ...prev, replacedDocuments: updated };
              });
              setHasChanges(true);
            }}
          />
          {bien.replacedDocuments?.find(r => r.index === index) && (
            <span className="text-xs text-green-600">🟢 prêt à enregistrer</span>
          )}
        </div>
      </div>
    ))}

    {bien.newDocuments?.map((file: File, i: number) => (
      <div key={i} className="text-sm text-gray-700">
        📎 {file.name}
      </div>
    ))}

    {((bien.documents?.length || 0) + (bien.newDocuments?.length || 0)) < 2 && (
      <div>
        <Label>Ajouter un document</Label>
        <Input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBien(prev => ({
              ...prev,
              newDocuments: [...(prev.newDocuments || []), file],
            }));
            setHasChanges(true);
          }}
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
  </CardContent>
</Card>


        {/* Images */}
       <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <CardHeader><CardTitle>Images</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(bien.images || []).map((img: string, i: number) => (
              <div key={i} className="relative group">
                
                <img
  src={
    img.startsWith('blob:')
      ? img
      : `https://universelle-images.lon1.cdn.digitaloceanspaces.com/${img}`
  }
  alt={`Image ${i}`}
  className="rounded border object-cover w-full h-40"
/>

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex justify-center items-center gap-2 transition">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedImageIndex(i);
                      document.getElementById("replace-image")?.click();
                    }}
                  >
                    ✏️
                  </Button>
                  <Button
  variant="destructive"
  size="icon"
  onClick={() => {
    setDeleteTarget({ type: 'image', index: i });
    setDeleteConfirmOpen(true);
  }}
>
  <Trash className="h-4 w-4" />
</Button>

                </div>
              </div>
            ))}
            {(bien.newImagePreviews || []).map((preview: string, index: number) => (
  <div key={`new-${index}`} className="relative group">
    <img
      src={preview}
      alt={`Nouvelle image ${index}`}
      className="rounded border object-cover w-full h-40"
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex justify-center items-center gap-2 transition">
      {/* Tu peux ajouter un bouton de suppression si besoin */}
    </div>
  </div>
))}

            <label htmlFor="new-image" className="cursor-pointer border-dashed border-2 border-gray-300 p-4 text-center rounded-md text-sm text-gray-500 hover:bg-gray-400 transition">
              <Upload className="mx-auto mb-1" />
              Ajouter une image
            </label>
            <input
  id="new-image"
  type="file"
  accept="image/*"
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setBien(prev => ({
      ...prev,
      newImages: [...(prev.newImages || []), file],
      newImagePreviews: [...(prev.newImagePreviews || []), preview],
    }));
    setHasChanges(true);
  }}
  className="
  transition-all duration-200
  hover:border-luxe-blue/30
  focus:scale-[1.01]
  bg-white text-black border-gray-300
  dark:bg-gray-900 dark:text-white dark:border-gray-700
  dark:placeholder-gray-400
  focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
  dark:focus:ring-luxe-blue/30
  focus:bg-gray-200
"


/>

          </CardContent>
        </Card>

        <input type="file" accept="image/*" id="replace-image" hidden onChange={handleImageReplace} />

        {/* Bouton enregistrer */}
        <div className="text-right">
          <Button onClick={handleSave} disabled={!hasChanges} className="bg-luxe-blue text-white hover:bg-luxe-blue/90">
            Enregistrer
          </Button>
        </div>
      </div>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 
    bg-white dark:bg-gray-800 dark:border dark:border-gray-700
    text-black dark:text-gray-100
    rounded-md shadow-lg
  ">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-lg font-semibold">
        Confirmer la suppression
      </AlertDialogTitle>
      <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Êtes-vous sûr de vouloir supprimer ce bien immobilier ? Cette action est irréversible et toutes les données associées seront perdues.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="mt-4 flex justify-end gap-3">
      <AlertDialogCancel
        className="transition-all duration-200 hover:scale-105
          bg-gray-200 dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          px-4 py-2 rounded-md
          border border-gray-300 dark:border-gray-600
          hover:bg-gray-300 dark:hover:bg-gray-600
        "
      >
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleConfirmedDelete}
        className="bg-red-600 hover:bg-red-700 text-white
          transition-all duration-200 hover:scale-105
          px-4 py-2 rounded-md
          disabled:opacity-70 disabled:cursor-not-allowed
        "
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


export default InvestissementEdit;
