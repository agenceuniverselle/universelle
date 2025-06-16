import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  ChevronRight,
  Check,
  ChevronLeft,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';

const formatAmount = (amount: string): string => {
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AddProspectForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    participationType: 'passive',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    address: '',
    comments: '',
    consent: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const slideDirection = useRef(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (value && formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: '',
      });
    }
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.amount) {
          errors.amount = "Veuillez entrer un montant d'investissement";
        }
        if (!formData.participationType) {
          errors.participationType = "Veuillez sélectionner un type de participation";
        }
        break;
      case 2:
        if (!formData.firstName) {
          errors.firstName = "Veuillez entrer le prénom";
        }
        if (!formData.lastName) {
          errors.lastName = "Veuillez entrer le nom";
        }
        if (!formData.email) {
          errors.email = "Veuillez entrer l'email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Veuillez entrer un email valide";
        }
        if (!formData.phone) {
          errors.phone = "Veuillez entrer le numéro de téléphone";
        }
        if (!formData.nationality) {
          errors.nationality = "Veuillez sélectionner la nationalité";
        }
        break;
      case 3:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      slideDirection.current = 1;
      if (step < 3) {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    slideDirection.current = -1;
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateStep()) {
    return;
  }

  setIsLoading(true);

  const formDataToSend = new FormData();
  const rawAmount = formData.amount.replace(/\D/g, ''); // supprime tout sauf chiffres
  formDataToSend.append('montant_investissement', rawAmount);
  formDataToSend.append('type_participation', formData.participationType);
  formDataToSend.append('prenom', formData.firstName);
  formDataToSend.append('nom', formData.lastName);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('telephone', formData.phone);
  formDataToSend.append('nationalite', formData.nationality);
  formDataToSend.append('adresse', formData.address);
  formDataToSend.append('commentaire', formData.comments);
  formDataToSend.append('consent', formData.consent ? '1' : '0');


  try {
  await axios.post(`https://back-qhore.ondigitalocean.app/api/prospects/store`, formDataToSend, {
  headers: {
    'Accept': 'application/json',
  }
});




    toast({
      title: "Prospect ajouté",
      description: "Le prospect a été ajouté avec succès.",
    });

    // Redirect to prospects list
    navigate('/admin/prospects');

  } catch (error) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'ajout du prospect.",
      variant: "destructive",
    });
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const suggestedAmounts = [
    500000,
    750000,
    1000000,
    1500000,
  ];

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
            <div>
              <Label htmlFor="amount" className="text-base font-medium">
                Montant d'investissement souhaité (MAD)
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
                    className={cn("pl-10", formErrors.amount && "border-red-500")}
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.amount ? (
                  <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Montant d'investissement envisagé par le prospect
                  </p>
                )}
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
                    className={cn("h-12 text-base transition-all hover:scale-102", 
                      formData.amount === amount.toLocaleString() ? "bg-luxe-blue shadow-md" : "")}
                    onClick={() => setFormData({...formData, amount: amount.toLocaleString()})}
                  >
                    {formatAmount(amount.toString())} MAD
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={formData.amount === "Autre" ? "default" : "outline"}
                  className={cn(
                    "h-12 text-base transition-all hover:scale-102",
                    formData.amount === "Autre" ? "bg-luxe-blue shadow-md" : ""
                  )}
                  onClick={() => {
                    setFormData({ ...formData, amount: "Autre" });
                  }}
                >
                  Autre
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="participationType" className="text-base font-medium">
                Type de participation recherché
              </Label>
              {formErrors.participationType && (
                <p className="text-sm text-red-500">{formErrors.participationType}</p>
              )}
              <RadioGroup
                value={formData.participationType}
                onValueChange={(value) => handleSelectChange(value, 'participationType')}
                className="mt-2 space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="passive" id="passive" />
                  <Label htmlFor="passive" className="flex-1 cursor-pointer">
                    <div className="font-medium">Investisseur passif</div>
                    <div className="text-sm text-gray-500">Investissement sans implication dans les décisions opérationnelles</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="partner" id="partner" />
                  <Label htmlFor="partner" className="flex-1 cursor-pointer">
                    <div className="font-medium">Partenaire</div>
                    <div className="text-sm text-gray-500">Participation active aux décisions stratégiques du projet</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="coDev" id="coDev" />
                  <Label htmlFor="coDev" className="flex-1 cursor-pointer">
                    <div className="font-medium">Co-développement</div>
                    <div className="text-sm text-gray-500">Implication directe dans le développement du projet</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-base font-medium">
                  Prénom
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="firstName"
                    name="firstName"
                    className={cn("pl-10", formErrors.firstName && "border-red-500")}
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName" className="text-base font-medium">
                  Nom
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="lastName"
                    name="lastName"
                    className={cn("pl-10", formErrors.lastName && "border-red-500")}
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className={cn("pl-10", formErrors.email && "border-red-500")}
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.email && (
                <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-base font-medium">
                Téléphone
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="phone"
                  name="phone"
                  className={cn("pl-10", formErrors.phone && "border-red-500")}
                  placeholder="+212 XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.phone && (
                <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="nationality" className="text-base font-medium">
                Nationalité
              </Label>
              <Select 
                value={formData.nationality} 
                onValueChange={(value) => handleSelectChange(value, 'nationality')}
              >
                <SelectTrigger id="nationality" className={cn(formErrors.nationality && "border-red-500")}>
                  <SelectValue placeholder="Sélectionnez la nationalité" />
                </SelectTrigger>
                <SelectContent>
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
                <p className="text-sm text-red-500 mt-1">{formErrors.nationality}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="address" className="text-base font-medium">
                Adresse
              </Label>
              <Textarea
                id="address"
                name="address"
                className="min-h-24"
                placeholder="Adresse complète"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="mt-6">
              <Label htmlFor="comments" className="text-base font-medium">
                Commentaires (optionnel)
              </Label>
              <Textarea
                id="comments"
                name="comments"
                className="min-h-32 mt-1"
                placeholder="Notes ou commentaires supplémentaires..."
                value={formData.comments}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
      key="step3"
      custom={slideDirection.current}
      initial="enter"
      animate="center"
      exit="exit"
      variants={variants}
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      className="space-y-6 py-2"
    >
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Récapitulatif du prospect</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Nom complet:</span>
            <span>{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Téléphone:</span>
            <span>{formData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Nationalité:</span>
            <span>{formData.nationality}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Montant d'investissement:</span>
            <span>{formData.amount} MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Type de participation:</span>
            <span>
              {formData.participationType === 'passive' && 'Investisseur passif'}
              {formData.participationType === 'partner' && 'Partenaire'}
              {formData.participationType === 'coDev' && 'Co-développement'}
            </span>
          </div>
          {formData.address && (
            <div className="flex justify-between">
              <span className="font-medium">Adresse:</span>
              <span className="text-right max-w-48">{formData.address}</span>
            </div>
          )}
          {formData.comments && (
            <div className="flex justify-between">
              <span className="font-medium">Commentaires:</span>
              <span className="text-right max-w-48">{formData.comments}</span>
            </div>
          )}
        </div>

        {/* ✅ Consentement */}
        <div className="flex items-start space-x-2 mt-6">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            className="w-4 h-4 mt-1 text-luxe-blue accent-luxe-blue"
            checked={formData.consent}
            onChange={(e) =>
              setFormData({ ...formData, consent: e.target.checked })
            }
          />
          <Label htmlFor="consent" className="text-sm font-medium dark:text-black">
            J'accepte les{" "}
            <a
              href="/PrivacyPolicyPage"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              conditions générales et la politique de confidentialité
            </a>.
          </Label>
        </div>

        {formErrors.consent && (
          <p className="text-sm text-red-500 mt-1">
            {formErrors.consent}
          </p>
        )}
      </div>
    </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
      <AdminLayout title="Biens d’investissement">
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/prospects')}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste des prospects
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">Ajouter un nouveau prospect</h1>
        <p className="text-gray-600 mt-2">Complétez les informations du prospect ci-dessous.</p>
      </div>

      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Informations du prospect</CardTitle>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                      stepNumber === step 
                        ? "bg-luxe-blue text-white scale-110 shadow-md"
                        : stepNumber < step
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {stepNumber < step ? <Check className="h-5 w-5" /> : stepNumber}
                  </div>
                  <span className="text-xs mt-1 text-gray-500 hidden sm:block">
                    {stepNumber === 1 && "Investissement"}
                    {stepNumber === 2 && "Informations"}
                    {stepNumber === 3 && "Récapitulatif"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-luxe-blue h-full transition-all duration-500 ease-in-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="pr-4 max-h-100">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait" custom={slideDirection.current}>
                {renderStepContent()}
              </AnimatePresence>
            </form>
          </ScrollArea>
            
          <Separator className="my-4" />
          
          <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-3 mt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="w-full sm:w-auto group"
              >
                <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                Précédent
              </Button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <Button
                type="button"
                className="bg-luxe-blue hover:bg-luxe-blue/90 w-full sm:w-auto group"
                onClick={nextStep}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto transition-all hover:scale-102"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  "Ajouter le prospect"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
};

export default AddProspectForm;
