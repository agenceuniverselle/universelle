import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft, MapPin, Bed, Bath, Ruler, Edit, Trash,
  Share, Copy, Power, AlertTriangle, User, Calendar,UtensilsCrossed,
  Snowflake,Landmark,ParkingSquare,Compass,Hammer,CalendarClock,Clock
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext"; // ✅ Importation du contexte d'authentification
import { Bien } from '@/types/bien.types'; // ✅ Import du type Bien

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { bienId } = useParams();
  const [bien, setProperty] = useState<Bien | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bienToDelete, setBienToDelete] = useState<string | null>(null);
  const { permissions } = useAuth(); // ✅ Récupération des permissions de l'utilisateur

  useEffect(() => {
    const fetchBien = async () => {
      if (!bienId) return;
  
      try {
        const res = await axios.get(`https://back-qhore.ondigitalocean.app/api/biens/${bienId}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du bien :", err);
        setProperty(null);
      }
    };
  
    fetchBien();
  }, [bienId]);
  
//delete bien 
const handleDeleteProperty = async (id: string | null) => {
  if (!id) return;

  try {
    setIsDeleting(true);
    
    const token = localStorage.getItem("access_token"); // ✅ Récupérer le token
    if (!token) {
      toast({
        title: "Erreur d'authentification",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    await axios.delete(`https://back-qhore.ondigitalocean.app/api/biens/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Ajout du token dans les headers
      },
    });

    toast({
      title: "Bien supprimé",
      description: "Le bien a été supprimé avec succès.",
    });

    setDeleteConfirmOpen(false);
    setBienToDelete(null);

    // Redirection après suppression
    navigate("/admin/biens");
  } catch (error) {
    console.error("Erreur suppression bien :", error);
    toast({
      title: "Erreur",
      description: error.response?.data?.message || "Impossible de supprimer le bien.",
      variant: "destructive",
    });
  } finally {
    setIsDeleting(false);
  }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'Réservé': return 'bg-blue-100 text-blue-800';
      case 'Vendu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!bien) {
    return (
      <AdminLayout title="Chargement...">
        <p className="text-gray-600">Chargement des données du bien...</p>
      </AdminLayout>
    );
  }
  

  if (!bien) {
    return (
      <AdminLayout title="Bien introuvable">
        <p className="text-red-600 ">Aucun bien trouvé avec l'ID : {bienId}</p>
      
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Détails du bien - ${bien.title}`}>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/biens')} className="mb-6 dark:text-black">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Infos principales */}
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  <CardHeader className="pb-2">
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={getStatusColor(bien.status)}>
            {bien.status}
          </Badge>
          {bien.isFeatured && (
            <Badge variant="outline" className="bg-purple-100 text-purple-800">
              En vedette
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl">{bien.title}</CardTitle>
        <CardDescription className="flex items-center mt-1">
  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
  {bien.location ? bien.location : "Emplacement non spécifié"} 
  {bien.quartier ? `, ${bien.quartier}` : ""}
</CardDescription>
      </div>
      <div className="text-2xl font-bold text-luxe-blue dark:text-gray-400">
        {bien.price} MAD
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4 py-4 border-y">
    {Number(bien.bedrooms) > 0 && (
  <div className="flex flex-col items-center">
    <Bed className="h-4 w-4 text-gray-500 mb-1" />
    <span className="text-sm">Chambres</span>
    <span className="font-semibold">{bien.bedrooms}</span>
  </div>
)}

{Number(bien.bathrooms) > 0 && (
  <div className="flex flex-col items-center">
    <Bath className="h-4 w-4 text-gray-500 mb-1" />
    <span className="text-sm">S. de bain</span>
    <span className="font-semibold">{bien.bathrooms}</span>
  </div>
      )}
      {bien.area && (
      <div className="flex flex-col items-center">
        <Ruler className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Surface</span>
        <span className="font-semibold">{bien.area} m²</span>
      </div>
      )}
      {bien.cuisine  && (
      <div className="flex flex-col items-center">
        <UtensilsCrossed className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Cuisine</span>
        <span className="font-semibold">{bien.cuisine}</span>
      </div>
      )}
      {bien.climatisation  && (
      <div className="flex flex-col items-center">
        <Snowflake className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Climatisation</span>
        <span className="font-semibold">{bien.climatisation}</span>
      </div>
      )}
      {bien.terrasse && (
      <div className="flex flex-col items-center">
        <Landmark className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Terrasse</span>
        <span className="font-semibold">{bien.terrasse}</span>
      </div>
      )}
      {bien.has_parking && (
      <div className="flex flex-col items-center">
        <ParkingSquare className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Places parking</span>
        <span className="font-semibold">
          {bien.has_parking === 'oui' ? `${bien.parking_places} place(s)` : 'Non'}
        </span>
      </div>
      )}
      {bien.exposition && (
      <div className="flex flex-col items-center">
        <Compass className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Exposition</span>
        <span className="font-semibold">{bien.exposition}</span>
      </div>
      )}
      {bien.condition && (
      <div className="flex flex-col items-center">
        <Hammer className="h-4 w-4 text-gray-500 mb-1" />
        <span className="text-sm">Condition</span>
        <span className="font-semibold">{bien.condition}</span>
      </div>
       )}
    </div>
     
    {bien.description && (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Description</h3>
      <p className="text-gray-600">{bien.description }</p>
    </div>
    )}
    {bien.points_forts && (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Points forts</h3>
      <p className="text-gray-600">{bien.points_forts?.join(', ')}</p>
    </div>
    )}
    {bien.proximite && (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Proximité</h3>
      <p className="text-gray-600">{bien.proximite?.join(', ')}</p>
    </div>
    )}
{bien.documents && bien.documents.length > 0 && (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">Plan</h3>
    <a
      href={`https://universelle-images.lon1.cdn.digitaloceanspaces.com/Biens/documents/${bien.documents[0]}`}
      className="flex items-center text-sm text-blue-600 hover:underline"
      download={`Plan_${bien.title.replace(/\s/g, '_')}.pdf`}
    >
      📄 Plan_{bien.title.replace(/\s/g, '_')}.pdf
    </a>
  </div>
)}



  </CardContent>
</Card>


            {/* Images */}
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <CardTitle>Photos du bien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                {Array.isArray(bien.images) && bien.images.length > 0 ? (
  bien.images
    .filter((img: string) => !!img) // ← élimine les falsy (null, "", undefined)
    .map((img: string, index: number) => (
      <div key={index} className="aspect-video bg-gray-100 overflow-hidden rounded-md">
      <img
  src={`https://universelle-images.lon1.cdn.digitaloceanspaces.com/Biens/images/${img}`}
  alt={`Vue ${index + 1}`}
  className="w-full h-full object-cover"
/>

      </div>
    ))
) : (
  <p className="text-sm text-gray-500">Aucune image disponible</p>
)}

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {/*   <Button className="w-full" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button className="w-full" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
                </Button>
                <Button className="w-full" variant="outline">
                  <Power className="h-4 w-4 mr-2" />
                  Publier
                </Button>
                */}
{/* ✅ Card "Actions" avec condition d'affichage */}
<div className="space-y-6">
  {/* ✅ Card "Actions" avec condition d'affichage */}
  {(permissions.includes("edit_properties") || permissions.includes("delete_properties")) && (
    <Card className="w-full md:w-[310px] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* ✅ Bouton "Modifier" avec condition */}
        {permissions.includes("edit_properties") && (
          <Button
            className="w-full bg-luxe-blue hover:bg-luxe-blue/90"
            onClick={() => navigate(`/admin/biens/edit/${bien.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}

        {/* ✅ Bouton "Supprimer" avec condition */}
        {permissions.includes("delete_properties") && (
          <Button
            onClick={() => {
              setBienToDelete(String(bien.id));
              setDeleteConfirmOpen(true);
            }}
            className="w-full text-red-600"
            variant="outline"
          >
            <Trash className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        )}
      </CardContent>
    </Card>
  )}

  {/* ✅ Card "Informations" toujours visible, placée correctement */}
  <Card className="w-full md:w-[310px] mt-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <CardHeader>
      <CardTitle>Informations</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {bien.type && (
        <div>
          <p className="text-sm text-gray-500">Type de bien</p>
          <p className="font-medium">{bien.type}</p>
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">ID du bien</p>
        <p className="font-medium">{bien.id}</p>
      </div>
      {bien.construction_year && (
        <div>
          <p className="text-sm text-gray-500">Année de construction</p>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{bien.construction_year}</p>
          </div>
        </div>
      )}
      {bien.assignedAgent && (
        <div>
          <p className="text-sm text-gray-500">Agent assigné</p>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1 text-gray-500" />
<p className="font-medium">{bien.assignedAgent || 'Non spécifié'}</p>
          </div>
        </div>
      )}
      {bien.created_at && (
        <div>
          <p className="text-sm text-gray-500">Date de publication</p>
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{new Date(bien.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
      {bien.available_date && (
        <div>
          <p className="text-sm text-gray-500">Date de disponibilité</p>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <p className="font-medium">{new Date(bien.available_date).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</div>


            {(bien.owner_name || bien.owner_email || bien.owner_phone || bien.owner_nationality || bien.owner_documents) && (
 <Card className="w-full md:w-[320px] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">

  <CardHeader><CardTitle>Propriétaire</CardTitle></CardHeader>
  <CardContent className="space-y-2 text-sm text-gray-700">
  {bien.owner_name && (  <p><strong>Nom :</strong> {bien.owner_name}</p>)}
  {bien.owner_email && ( <p><strong>Email :</strong> {bien.owner_email}</p>)}
   {bien.owner_phone && ( <p><strong>Téléphone :</strong> {bien.owner_phone}</p>)}
    {bien.owner_nationality && ( <p><strong>Nationalité :</strong> {bien.owner_nationality}</p>)}
    {bien.owner_documents && bien.owner_documents.length > 0 && (
  <div>
    <strong>Documents :</strong>
    <ul className="mt-1 space-y-1 list-disc list-inside text-blue-600">
      {bien.owner_documents.map((docPath: string, index: number) => {
        const fileName = docPath.split('/').pop(); // nom réel du fichier
        return (
          <li key={index}>
           <a
  href={`https://universelle-images.lon1.cdn.digitaloceanspaces.com/Biens/documents/${docPath}`}
  target="_blank"
  rel="noopener noreferrer"
  className="hover:underline"
  download
>
              {fileName}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
)}

  </CardContent>
</Card>
            )}

            {/* Alerte */}
            <Alert className="bg-amber-50 border-amber-200 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Attention</AlertTitle>
              <AlertDescription className="text-amber-700">
                Certaines informations sont manquantes ou incomplètes.
              </AlertDescription>
            </Alert>
       
        </div>
      </div>
       {/* AlertDialog  */}
    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
        Confirmer la suppression
      </AlertDialogTitle>
      <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
        Cette action est irréversible. Le bien sera supprimé définitivement.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="text-gray-700 dark:text-black hover:bg-gray-100 dark:hover:bg-gray-800">
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={() => handleDeleteProperty(bienToDelete)}
        className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
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

export default PropertyDetails;
