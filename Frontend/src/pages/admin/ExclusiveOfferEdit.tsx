import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, Save, X, Loader2 } from 'lucide-react';
import { ExclusiveOffer } from '@/types/exclusiveOffer.types';
import { InvestmentProperty } from '@/types/Property.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ExclusiveOfferEdit = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<ExclusiveOffer | null>(null);
// ✅ Utiliser le type Property au lieu de any[]
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offerRes, propertiesRes] = await Promise.all([
          axios.get(`https://back-qhore.ondigitalocean.app/api/exclusive-offers/${offerId}`),
          axios.get('https://back-qhore.ondigitalocean.app/api/properties')
        ]);

        setOffer(offerRes.data.data ?? offerRes.data);
        setProperties(propertiesRes.data.data ?? []);
      } catch (err) {
        console.error(err);
        toast({ title: "Erreur", description: "Chargement des données impossible.", variant: "destructive" });
      }
    };

    if (offerId) fetchData();
  }, [offerId]);

 const handleSave = async () => {
  if (!offerId || !offer) return;

  try {
    setIsSaving(true);

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

    // ✅ Requête de mise à jour avec le token
    await axios.put(
      `https://back-qhore.ondigitalocean.app/api/exclusive-offers/${offerId}`,
      {
        property_id: offer.property_id.toString(), // ✅ Convertir en string
        current_value: offer.current_value ? offer.current_value.toString() : "0", // ✅ Convertir en string
        initial_investment: offer.initial_investment ? offer.initial_investment.toString() : "0", // ✅ Convertir en string
        monthly_rental_income: offer.monthly_rental_income ? offer.monthly_rental_income.toString() : "0", // ✅ Convertir en string
        annual_growth_rate: offer.annual_growth_rate ? offer.annual_growth_rate.toString() : "0", // ✅ Convertir en string
        duration_years: offer.duration_years ? offer.duration_years.toString() : "0", // ✅ Convertir en string
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token ajouté dans les headers
        },
      }
    );

    toast({ 
      title: "Offre mise à jour", 
      description: "Les modifications ont été enregistrées." 
    });
    navigate('/admin/investissements');
  } catch (err) {
    console.error(err);
    toast({ 
      title: "Erreur", 
      description: "Échec de l'enregistrement.", 
      variant: "destructive" 
    });
  } finally {
    setIsSaving(false);
  }
};

  
  if (!offer) {
    return (
      <AdminLayout title="Chargement...">
        <p className="text-gray-600">Chargement de l’offre exclusive...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Modifier une offre exclusive">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/admin/investissements')} className='dark:text-black'>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/investissements')}className='dark:text-black'>
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
          <CardTitle>Informations sur l'offre exclusive</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Bien associé</Label>
           <Select
  value={offer.property_id?.toString() || ''}
  onValueChange={(value) => {
    setOffer({ ...offer, property_id: Number(value) });
    setHasChanges(true);
  }}
>
  <SelectTrigger
    className="
      transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
      rounded-md
    "
  >
    <SelectValue placeholder="Sélectionner..." />
  </SelectTrigger>

  <SelectContent
    className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    "
  >
    {properties.map((p) => (
      <SelectItem
        key={p.id}
        value={p.id.toString()}
        className="hover:bg-white dark:hover:bg-gray-800"
      >
        {p.title}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
          </div>

          <div>
            <Label>Valeur actuelle (MAD)</Label>
            <Input
              type="number"
              value={offer.current_value}
              onChange={(e) => {
setOffer({ ...offer, current_value: parseFloat(e.target.value) || 0 });
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
            <Label>Investissement initial (MAD)</Label>
            <Input
              type="number"
              value={offer.initial_investment}
              onChange={(e) => {
setOffer({ 
  ...offer, 
  initial_investment: parseFloat(e.target.value) || 0 
});
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
            <Label>Revenu locatif mensuel (MAD)</Label>
            <Input
              type="number"
              value={offer.monthly_rental_income}
              onChange={(e) => {
setOffer({ 
  ...offer, 
  monthly_rental_income: parseFloat(e.target.value) || 0 
});
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
            <Label>Taux de croissance annuel (%)</Label>
            <Input
              type="number"
              value={offer.annual_growth_rate}
              onChange={(e) => {
setOffer({ 
  ...offer, 
  annual_growth_rate: parseFloat(e.target.value) || 0 
});
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
            <Label>Durée (années)</Label>
            <Input
              type="number"
              value={offer.duration_years}
              onChange={(e) => {
setOffer({ 
  ...offer, 
  duration_years: parseInt(e.target.value, 10) || 0 
});
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
        </CardContent>
      </Card>
      <div className="text-right mt-4">
  <Button 
    onClick={handleSave} 
    disabled={!hasChanges} 
    className="bg-luxe-blue text-white hover:bg-luxe-blue/90"
  >
    Enregistrer
  </Button>
</div>

    </AdminLayout>
  );
};

export default ExclusiveOfferEdit;
