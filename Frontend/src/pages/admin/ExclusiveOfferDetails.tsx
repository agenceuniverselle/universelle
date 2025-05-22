import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronLeft, Trash, Pencil, Loader2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext'; // ✅ Import AuthContext
import { ExclusiveOffer } from '@/types/exclusiveOffer.types';

const ExclusiveOfferDetails = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
const [offer, setOffer] = useState<ExclusiveOffer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { permissions } = useAuth(); // ✅ Get permissions from context

  // ✅ Define permission variables
// ✅ Correction des permissions
const canEditOffers = permissions.includes("edit_exclusive_offers");
const canDeleteOffers = permissions.includes("delete_exclusive_offers");

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/exclusive-offers/${offerId}`);
        setOffer(res.data.data || res.data);
      } catch (error) {
        toast({ title: "Erreur", description: "Offre introuvable.", variant: "destructive" });
      }
    };

    fetchOffer();
  }, [offerId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
  
      // ✅ Récupération du token depuis le localStorage
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
  
      // ✅ Requête de suppression avec le token
      await axios.delete(`http://localhost:8000/api/exclusive-offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Ajout du token dans les headers
        },
      });
  
      toast({ title: "Offre supprimée" });
      navigate("/admin/investissements");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error); // ✅ Log d'erreur pour le débogage
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
  

  if (!offer) {
    return (
      <AdminLayout title="Chargement...">
        <p className="text-gray-600">Chargement...</p>
      </AdminLayout>
    );
  }

  const { property } = offer;

  return (
    <AdminLayout title={`Offre exclusive - ${property?.title ?? '—'}`}>
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin/investissements')} className="mb-6 dark:text-black">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
 <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{property?.title || '—'}</CardTitle>
                    <p className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {property?.location}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-luxe-blue whitespace-nowrap dark:text-gray-400">
                    {Number(offer.current_value).toLocaleString()} MAD
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {property?.type && <Badge>{property.type}</Badge>}
                  {property?.status && <Badge>{property.status}</Badge>}
                </div>

                <p><strong>Investissement initial :</strong> {Number(offer.initial_investment).toLocaleString()} MAD</p>
                <p><strong>Revenu locatif mensuel :</strong> {Number(offer.monthly_rental_income).toLocaleString()} MAD</p>
                <p><strong>Taux de croissance :</strong> {offer.annual_growth_rate}%</p>
                <p><strong>Durée d'investissement :</strong> {offer.duration_years} ans</p>
                <p><strong>Rendement estimé brut :</strong> {
                  (
                    (offer.monthly_rental_income * 12 * offer.duration_years +
                      (offer.current_value * (offer.annual_growth_rate / 100)) * offer.duration_years) /
                    offer.initial_investment
                  ).toFixed(2)
                }</p>
              </CardContent>
            </Card>

            {property?.images?.length > 0 && (
 <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <CardHeader><CardTitle>Images du bien</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={`http://localhost:8000/${img}`}
                      alt={`Image ${idx}`}
                      className="rounded-md border"
                    />
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          {/* ✅ Sidebar - Actions with Permissions */}
          {(canEditOffers || canDeleteOffers) && (
            <div className="space-y-4">
 <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {canEditOffers && (
                    <Button
                      className="w-full bg-luxe-blue text-white hover:bg-luxe-blue/90"
                      onClick={() => navigate(`/admin/offres-exclusives/edit/${offer.id}`)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </Button>
                  )}

                  {canDeleteOffers && (
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
        </div>
      </div>
     <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <AlertDialogContent
    className="
      bg-white dark:bg-gray-800
      text-black dark:text-gray-100
      border border-gray-300 dark:border-gray-700
      rounded-md shadow-lg
      p-6
    "
  >
    <AlertDialogHeader>
      <AlertDialogTitle className="text-lg font-semibold">
        Supprimer cette offre ?
      </AlertDialogTitle>
      <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Cette action est irréversible.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="mt-6 flex justify-end gap-3">
      <AlertDialogCancel
        className="
          bg-gray-200 dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          px-4 py-2 rounded-md
          border border-gray-300 dark:border-gray-600
          transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105
        "
      >
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        disabled={isDeleting}
        className="
          bg-red-600 text-white
          hover:bg-red-700
          px-4 py-2 rounded-md
          transition-all duration-200 hover:scale-105
          disabled:opacity-70 disabled:cursor-not-allowed
        "
      >
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Suppression...
          </>
        ) : (
          <>Oui, supprimer</>
        )}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </AdminLayout>
  );
};

export default ExclusiveOfferDetails;
