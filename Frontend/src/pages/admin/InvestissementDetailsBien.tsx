import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin, ChevronLeft, Trash, Pencil, Loader2
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext'; // ✅ Utiliser le contexte d'authentification
import { InvestmentProperty } from '@/types/Property.types';

const InvestissementDetailsBien = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
const [investmentProperty, setInvestmentProperty] = useState<InvestmentProperty | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { permissions } = useAuth(); // ✅ Récupération des permissions de l'utilisateur
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // ✅ Ajout de deleteTarget

  // ✅ Vérification des permissions
  const canEdit = permissions.includes("edit_properties");
  const canDelete = permissions.includes("delete_properties");

  useEffect(() => {
    const fetchInvestmentProperty = async () => {
      try {
        const res = await axios.get(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}`);
        const data = res.data.data ?? res.data;

        data.partners = Array.isArray(data.partners) ? data.partners : JSON.parse(data.partners || '[]');
        data.images = Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]');
        data.documents = Array.isArray(data.documents) ? data.documents : JSON.parse(data.documents || '[]');
data.investmentDetails = {
        returnRate: data.returnRate,
        minEntryPrice: data.minEntryPrice,
        recommendedDuration: data.recommendedDuration,
        investmentType: data.investmentType,
        projectStatus: data.projectStatus,
        financingEligibility: data.financingEligibility,
        partners: data.partners,
        documents: data.documents
      };
        setInvestmentProperty(data);
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le investmentProperty.",
          variant: "destructive"
        });
      }
    };

    fetchInvestmentProperty();
  }, [propertyId]);

  const handleDeleteInvestmentProperty = async () => {
    try {
      setIsDeleting(true);
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

      await axios.delete(`https://back-qhore.ondigitalocean.app/api/properties/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({ title: "Bien d'investissement supprimé avec succès." });
      navigate("/admin/investissements");
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  

  if (!investmentProperty) {
    return (
      <AdminLayout title="Chargement...">
        <p className="text-gray-600">Chargement des données...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Bien à investir - ${investmentProperty.title}`}>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/investissements')} className="mb-6 dark:text-black">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Détails principaux */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{investmentProperty.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {investmentProperty.location}
                    </CardDescription>
                  </div>
                  <div className="text-2xl font-bold text-luxe-blue whitespace-nowrap dark:text-gray-400">
                    {investmentProperty.price} MAD
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Badge>{investmentProperty?.investmentDetails?.investmentType}</Badge>
                  <Badge>{investmentProperty?.investmentDetails?.projectStatus}</Badge>
                  {investmentProperty.isFeatured && <Badge className="bg-purple-100 text-purple-800">En vedette</Badge>}
                </div>

                <p><strong>Statut :</strong> {investmentProperty.status}</p>
                <p><strong>Surface :</strong> {investmentProperty.area} m²</p>
                <p><strong>Chambres :</strong> {investmentProperty.bedrooms}</p>
                <p><strong>Salles de bain :</strong> {investmentProperty.bathrooms}</p>
                <p><strong>Description :</strong> {investmentProperty.description}</p>
                <p><strong>Taux de rentabilité :</strong> {investmentProperty?.investmentDetails?.returnRate ?? 'N/A'} %</p>
                <p><strong>Prix d'entrée :</strong> {investmentProperty?.investmentDetails?.minEntryPrice} MAD</p>
                <p><strong>Durée recommandée :</strong> {investmentProperty?.investmentDetails?.recommendedDuration}</p>
                <p><strong>Financement :</strong>  {investmentProperty?.investmentDetails?.financingEligibility ? 'Éligible' : 'Non éligible'}</p>

  {investmentProperty?.investmentDetails?.partners?.length > 0 && (
                  <div>
                    <strong>Partenaires :</strong>
                    <ul className="list-disc list-inside">
        {investmentProperty?.investmentDetails?.partners.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            {investmentProperty.images?.length > 0 && (
              <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <CardHeader><CardTitle>Images</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {investmentProperty.images.map((img: string, idx: number) => (
                   <img
  key={idx}
  src={`https://universelle-images.lon1.cdn.digitaloceanspaces.com/properties/images/${img}`}
  alt={`Image ${idx}`}
  className="rounded-md border"
/>

                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar actions */}
          {(canEdit || canDelete) && (
  <div className="space-y-4">
    <Card  className="w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {canEdit && (
          <Button
            className="w-full bg-luxe-blue text-white hover:bg-luxe-blue/90"
            onClick={() => navigate(`/admin/investissements/edit/${investmentProperty.id}`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
           {canDelete && (
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={() => setDeleteConfirmOpen(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              )}
      </CardContent>
    </Card>
  </div>
)}

            {/* Documents */}
            {investmentProperty?.investmentDetails?.documents?.length > 0 && (
  <Card className="w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
    <CardContent>
      <ul className="list-disc list-inside text-blue-600">
        {investmentProperty?.investmentDetails?.documents.map((doc: string, index: number) => {
          const customNames = {
            0: "Brochure complète.pdf",
            1: "Plans détaillés.pdf"
          };
          const displayName = customNames[index] ?? doc.split('/').pop();

          return (
            <li key={index}>
              <a
                href={`https://universelle-images.lon1.cdn.digitaloceanspaces.com/properties/documents/${doc}`}
                download={displayName}
                className="hover:underline"
              >
                {displayName}
              </a>
            </li>
          );
        })}
      </ul>
    </CardContent>
  </Card>
)}

            
          </div>
        </div>
  

      {/* Alert de confirmation de suppression */}
     <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 max-w-lg rounded-lg shadow-md p-6 bg-white dark:bg-gray-900">
    <AlertDialogHeader>
      <AlertDialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        ⚠️ Confirmer la suppression
      </AlertDialogTitle>
      <AlertDialogDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Cette action est irréversible. Le bien sera supprimé définitivement.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="flex justify-end space-x-4 mt-4">
      <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600">
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteInvestmentProperty}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center disabled:opacity-50"
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

export default InvestissementDetailsBien;
