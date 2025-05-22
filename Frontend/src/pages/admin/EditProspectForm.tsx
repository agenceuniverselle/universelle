
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { DollarSign, ChevronLeft, Save, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";

const variants = {
  enter: { opacity: 0, x: 100 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

const MinEntryPrice = "10 000";
const suggestedAmounts = [10000, 20000, 50000];
interface FormErrors {
  amount?: string;
  participationType?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  address?: string;
  comment?: string;
  property_id?: string;
}


const EditProspectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const slideDirection = useRef("right");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    participationType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    address: "",
    comment: "",
    property_id: "",
    
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Effectuer la requête pour récupérer les données de l'investisseur lors du chargement
  useEffect(() => {
    const fetchProspectData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/investor-requests/${id}`);
        const prospectData = response.data;
        
        setFormData({
          amount: prospectData.montant_investissement ? prospectData.montant_investissement.toLocaleString() : "",
          participationType: prospectData.type_participation || "",
          firstName: prospectData.prenom || "",
          lastName: prospectData.nom || "",
          email: prospectData.email || "",
          phone: prospectData.telephone || "",
          nationality: prospectData.nationalite || "",
          address: prospectData.adresse || "",
          comment: prospectData.commentaire || "",
        property_id: prospectData.property_id || "", // ← ajout ici
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        toast({ 
          title: "Erreur", 
          description: "Impossible de charger les données du prospect.",
          variant: "destructive" 
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProspectData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSelectChange = (value, key) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const formatAmount = (amount) => {
    return parseInt(amount).toLocaleString();
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?')) {
        navigate('/admin/prospects');
      }
    } else {
      navigate('/admin/prospects');
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

const res = await axios.post(`http://localhost:8000/api/investor-requests/${id}?_method=PUT`, {
montant_investissement: formData.amount.trim(),
        type_participation: formData.participationType,
        prenom: formData.firstName,
        nom: formData.lastName,
        email: formData.email,
        telephone: formData.phone,
        nationalite: formData.nationality,
        adresse: formData.address,
        commentaire: formData.comment,
        propriete_id: parseInt(formData.property_id),
      });

      toast({ 
        title: "Succès", 
        description: "Prospect mis à jour avec succès.",
        variant: "default" 
      });
      navigate(`/admin/prospects`);

    } catch (error) {
      console.error("Erreur lors de la mise à jour du prospect :", error);
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la mise à jour.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
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
            className="space-y-4 py-2"
          >
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <CardTitle>Détails d'investissement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
  <Label htmlFor="property_id">ID de la propriété</Label>
  <Input
    id="property_id"
    name="property_id"
    type="number"
    value={formData.property_id}
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
                <div>
                  <Label htmlFor="amount" className="text-base font-medium">
                    Montant d'investissement (MAD)
                  </Label>
                  <div className="mt-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="amount"
                        name="amount"
                        type="text"
                        placeholder="Entrez le montant..."
                        className={cn(
                          "pl-10 transition-all duration-200 hover:border-luxe-blue/30 focus:scale-101 bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30 ",
                          formErrors.amount && "border-red-500"
                        )}
                        value={formData.amount}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Montant minimum d'entrée: {MinEntryPrice} MAD
                    </p>
                  </div>
                </div>

               <div className="mt-4">
  <Label className="text-base font-medium">Montants suggérés (MAD)</Label>
  <div className="grid grid-cols-2 gap-3 mt-2">
    {suggestedAmounts.map((amount, index) => (
      <Button
        key={index}
        type="button"
        variant={formData.amount === amount.toLocaleString() ? "default" : "outline"}
        className={cn(
          "h-12 text-base transition-all hover:scale-105",
          formData.amount === amount.toLocaleString()
            ? "bg-luxe-blue shadow-md"
            : "dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
        )}
        onClick={() => {
          setFormData({ ...formData, amount: amount.toLocaleString() });
          setHasChanges(true);
        }}
      >
        {formatAmount(amount.toString())} MAD
      </Button>
    ))}
    <Button
      type="button"
      variant={formData.amount === "Autre" ? "default" : "outline"}
      className={cn(
        "h-12 text-base transition-all hover:scale-105",
        formData.amount === "Autre"
          ? "bg-luxe-blue shadow-md"
          : "dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
      )}
      onClick={() => {
        setFormData({ ...formData, amount: "" });
        setHasChanges(true);
      }}
    >
      Autre
    </Button>
  </div>
</div>

                

                <div className="mt-4">
                  <Label htmlFor="participationType" className="text-base font-medium">
                    Type de participation
                  </Label>
                  <RadioGroup
                    value={formData.participationType}
                    onValueChange={(value) => {
                      handleSelectChange(value, 'participationType');
                      setHasChanges(true);
                    }}
                    className="mt-2 space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700">
                      <RadioGroupItem value="passive" id="passive" />
                      <Label htmlFor="passive" className="flex-1 cursor-pointer">
                        <div className="font-medium">Investisseur passif</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Investissement sans implication dans les décisions opérationnelles</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700">
                      <RadioGroupItem value="partner" id="partner" />
                      <Label htmlFor="partner" className="flex-1 cursor-pointer">
                        <div className="font-medium">Partenaire</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Participation active aux décisions stratégiques du projet</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700">
                      <RadioGroupItem value="coDev" id="coDev" />
                      <Label htmlFor="coDev" className="flex-1 cursor-pointer">
                        <div className="font-medium">Co-développement</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Implication directe dans le développement du projet</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
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
            className="space-y-4 py-2"
          >
            <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-base font-medium">
                      Prénom
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-101 bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-base font-medium">
                      Nom
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-101 bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-101 bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-101 bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30"
                    />
                  </div>
                  <div className="space-y-2">
  <Label htmlFor="nationality" className="text-base font-medium">
    Nationalité
  </Label>
  <Select
    value={formData.nationality}
    onValueChange={(value) => handleSelectChange(value, 'nationality')}
  >
   <SelectTrigger
  id="nationality"
  className={cn(
    "transition-all duration-200 hover:border-luxe-blue/30 bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
    formErrors.nationality && "border-red-500"
  )}
>
      <SelectValue placeholder="Sélectionnez votre nationalité" />
    </SelectTrigger>
 <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
      <SelectItem value="marocaine">Marocaine</SelectItem>
      <SelectItem value="française">Française</SelectItem>
      <SelectItem value="algérienne">Algérienne</SelectItem>
      <SelectItem value="tunisienne">Tunisienne</SelectItem>
      <SelectItem value="américaine">Américaine</SelectItem>
      <SelectItem value="canadienne">Canadienne</SelectItem>
      <SelectItem value="autre">Autre</SelectItem>
    </SelectContent>
  </Select>
  {formErrors.nationality && (
    <p className="text-sm text-red-500">{formErrors.nationality}</p>
  )}
</div>
<div>
  <Label htmlFor="address">Adresse</Label>
  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " />
</div>

<div>
  <Label htmlFor="comment">Commentaire</Label>
<Textarea
  id="comment"
  name="comment"
  value={formData.comment}
  onChange={handleInputChange}
  placeholder="Laissez un commentaire ou des précisions..."
 className={cn(
  "resize-none transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01] bg-white text-black border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxe-blue/50 dark:focus:ring-luxe-blue/30",
  formErrors.comment && "border-red-500"
)}

/>
{formErrors.comment && (
  <p className="text-sm text-red-500 mt-1">{formErrors.comment}</p>
)}

</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <AdminLayout title="Modifier un investisseur prospect">
      <div className="max-w-4xl mx-auto mt-6">
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-luxe-blue animate-spin" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/prospects')}
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
                  onClick={handleUpdate} 
                  disabled={!hasChanges || loading}
                  className={`bg-luxe-blue text-white hover:bg-luxe-blue/90 transition-all duration-200 ${hasChanges ? 'hover:scale-105 active:scale-95' : 'opacity-70'}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mise à jour...
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

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
              <div className="mb-6">
                <div className="flex justify-between mb-4">
                 <div className="flex items-center space-x-2">
  <div className={`
    w-8 h-8 rounded-full flex items-center justify-center
    ${step === 1 
      ? 'bg-gray-100 text-black dark:bg-gray-100 dark:text-black' 
      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
  `}>
    1
  </div>
  <span className={`
    text-sm font-medium
    ${step === 1 ? 'text-luxe-blue' : 'text-gray-500'}}
  `}>
    Investissement
  </span>
</div>


                  <div className="h-0.5 bg-gray-200 flex-1 mx-4 self-center"></div>

                <div className="flex items-center space-x-2">
  <div className={`
    w-8 h-8 rounded-full flex items-center justify-center
    ${step === 2
      ? 'bg-gray-100 text-black dark:bg-gray-100 dark:text-black'
      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}
  `}>
    2
  </div>
  <span className={`
    text-sm font-medium
    ${step === 2 ? 'text-luxe-blue' : 'text-gray-100'}
  `}>
    Coordonnées
  </span>
</div>

                </div>
              </div>

              {renderStepContent()}

              <div className="flex justify-between mt-6">
                {step > 1 && (
                  <Button 
                    onClick={() => {
                      slideDirection.current = "left";
                      setStep(step - 1);
                    }} 
                    variant="outline"
                    className="transition-all duration-200 hover:scale-105 active:scale-95 dark:text-black"
                  >
                    Précédent
                  </Button>
                )}
                {step < 2 ? (
                  <Button 
                    onClick={() => {
                      slideDirection.current = "right";
                      setStep(step + 1);
                    }}
                    className="ml-auto bg-luxe-blue text-white hover:bg-luxe-blue/90 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button 
                    onClick={handleUpdate} 
                    disabled={!hasChanges || loading}
                    className="ml-auto bg-luxe-blue text-white hover:bg-luxe-blue/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditProspectForm;