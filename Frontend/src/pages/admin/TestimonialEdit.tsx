import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, Save, X, Loader2,Trash,Pencil ,Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Testimonial } from '@/types/Testimonial';

const TestimonialEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
const [testimonial, setTestimonial] = useState<Testimonial>({
  id: 0,               
  name: '',
  fonction: '',
  quote: '',
  image: undefined,    
  created_at: '',     
  newImage: null,
  removeImage: false,
});

  
    const [preview, setPreview] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
  
    useEffect(() => {
      const fetchTestimonial = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/testimonials/${id}`);
          const data = res.data;
          setTestimonial({
            ...data,
            newImage: null,
            removeImage: false,
          });
  
          if (data.image) {
            setPreview(`http://localhost:8000/storage/${data.image}`);
          }
        } catch (err) {
          console.error(err);
          toast({ title: "Erreur", description: "Chargement du témoignage impossible", variant: "destructive" });
        }
      };
  
      if (id) fetchTestimonial();
    }, [id]);
  
    const handleSave = async () => {
        if (!id || !testimonial) return;
      
        try {
          setIsSaving(true);
      
          // ✅ Récupération du token JWT
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
      
          const formData = new FormData();
          formData.append('name', testimonial.name);
          formData.append('fonction', testimonial.fonction || '');
          formData.append('quote', testimonial.quote);
      
          // ✅ Image ajoutée ou mise à jour
          if (testimonial.newImage instanceof File) {
            formData.append('image', testimonial.newImage);
          }
      
          // ✅ Suppression de l'image (optionnel)
          if (testimonial.removeImage === true) {
            formData.append('remove_image', '1');
          }
      
          // ✅ Requête sécurisée avec Token JWT
          await axios.post(`http://localhost:8000/api/testimonials/${id}?_method=PUT`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`, // ✅ Ajout du Token JWT
            },
          });
      
          toast({ title: '✅ Succès', description: 'Témoignage mis à jour avec succès.' });
          navigate('/admin/content');
        } catch (error) {
          console.error("❌ Erreur de mise à jour :", error);
      
          if (error.response?.status === 401) {
            toast({
              title: "Erreur d'authentification",
              description: "Votre session a expiré. Veuillez vous reconnecter.",
              variant: "destructive",
            });
            navigate("/login");
          } else {
            toast({
              title: 'Erreur',
              description: 'Impossible de mettre à jour le témoignage.',
              variant: 'destructive',
            });
          }
        } finally {
          setIsSaving(false);
        }
      };
      
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      setTestimonial(prev => ({
        ...prev,
        newImage: file,
        removeImage: false,
      }));
  
      setPreview(URL.createObjectURL(file));
      setHasChanges(true);
    };
  
    const handleDelete = async () => {
        if (!testimonial.id) return;
      
        try {
          await axios.delete(`http://localhost:8000/api/testimonials/${testimonial.id}/image`);
          toast({ title: 'Image supprimée', description: 'L’image a été supprimée avec succès.' });
          setHasChanges(true);

          setTestimonial(prev => ({
            ...prev,
            image: null,
            newImage: null,
          }));
          setPreview(null);
        } catch (error) {
          console.error(error);
          toast({
            title: 'Erreur',
            description: "Impossible de supprimer l'image.",
            variant: 'destructive',
          });
        }
      };
      
  if (!testimonial) {
    return (
      <AdminLayout title="Chargement...">
        <p className="text-gray-600">Chargement du témoignage...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Modifier un témoignage">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/admin/content')}className='dark:text-black
'>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/content')}className='dark:text-black
'>
            <X className="mr-2 h-4 w-4" />
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-luxe-blue text-white hover:bg-luxe-blue/90"
          >
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement...</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Enregistrer</>
            )}
          </Button>
        </div>
      </div>

       <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <CardHeader>
          <CardTitle>Informations du témoignage</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4">
          <div>
            <Label>Nom</Label>
            <Input
              type="text"
              value={testimonial.name}
              onChange={(e) => {
                setTestimonial({ ...testimonial, name: e.target.value });
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
            <Label>Profession</Label>
            <Input
              type="text"
              value={testimonial.fonction || ''}
              onChange={(e) => {
                setTestimonial({ ...testimonial, fonction: e.target.value });
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
            <Label>Témoignage</Label>
            <Textarea
              value={testimonial.quote}
              onChange={(e) => {
                setTestimonial({ ...testimonial, quote: e.target.value });
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
          <div className="space-y-2">
            <Label>Image</Label>
            {preview ? (
              <div className="relative w-32 h-32">
                <img src={preview} className="w-32 h-32 object-cover rounded-md border" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-0 hover:bg-opacity-40 transition">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => document.getElementById("replace-image")?.click()}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                                      size="icon"
  variant="destructive"
  onClick={() => setConfirmDeleteOpen(true)}
>
  <Trash className=" h-4 w-4" />
</Button>

                </div>
              </div>
            ) : (
              <label
                htmlFor="replace-image"
                className="cursor-pointer inline-flex items-center gap-2 border border-dashed p-3 rounded-md text-sm text-gray-500 hover:bg-gray-50 dark:bg-gray-800"
              >
                <Upload className="h-4 w-4" />
                Ajouter une image
              </label>
            )}

            <input
              id="replace-image"
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
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

        </CardContent>
      </Card>

      <div className="text-right mt-4">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-luxe-blue text-white hover:bg-luxe-blue/90"
        >
          Enregistrer
        </Button>
      </div>
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
      <AlertDialogDescription>
        Cette action est irréversible. Veux-tu vraiment supprimer ce témoignage ?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-red-600 text-white hover:bg-red-700"
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

export default TestimonialEdit;
