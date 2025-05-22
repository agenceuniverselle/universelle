import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Property } from '@/context/PropertiesContext';
import { 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  FileText,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Check,
  ChevronLeft,
  Calendar,
  Download,
  Loader2
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';

interface InvestmentFormProps {
  property: Property;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatAmount = (amount: string): string => {
  return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


const AddInvestisseur: React.FC<InvestmentFormProps> = ({
  property,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
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
    documentsUploaded: false,
    paymentMethod: 'bank',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fileNameIdentite, setFileNameIdentite] = useState('');
  const [fileNameDomicile, setFileNameDomicile] = useState('');
  const [fileNameReleve, setFileNameReleve] = useState('');

  // Gestion des fichiers pour chaque section
  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'identite') {
        setFileNameIdentite(file.name);
      } else if (type === 'domicile') {
        setFileNameDomicile(file.name);
      } else if (type === 'releve') {
        setFileNameReleve(file.name);
      }
    }
  };
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

  useEffect(() => {
    if (open) {
      setStep(1);
      setFormData({
        amount: '',
        participationType: 'passive',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationality: '',
        address: '',
        comments: '',
        documentsUploaded: false,
        paymentMethod: 'bank',
      });
      setFormErrors({});
    }
  }, [open]);

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
          errors.firstName = "Veuillez entrer votre prénom";
        }
        if (!formData.lastName) {
          errors.lastName = "Veuillez entrer votre nom";
        }
        if (!formData.email) {
          errors.email = "Veuillez entrer votre email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Veuillez entrer un email valide";
        }
        if (!formData.phone) {
          errors.phone = "Veuillez entrer votre numéro de téléphone";
        }
        if (!formData.nationality) {
          errors.nationality = "Veuillez sélectionner votre nationalité";
        }
        break;
      case 3:
        break;
      case 4:
        
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      slideDirection.current = 1;
      if (step < 4) {
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

  const addLeadToCRM = async () => {
    return new Promise<void>((resolve) => {
      console.log("Adding lead to CRM:", {
        type: "investment_lead",
        property: property.title,
        propertyId: property.id,
        amount: formData.amount,
        participationType: formData.participationType,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        address: formData.address,
        comments: formData.comments,
        paymentMethod: formData.paymentMethod,
        status: "Nouveau",
        createdAt: new Date().toISOString(),
      });
      
      setTimeout(resolve, 1000);
    });
  };
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
      const fetchCsrfToken = async () => {
          const response = await fetch('/api/init');
          const data = await response.json();
          setCsrfToken(data.csrf_token);
      };

      fetchCsrfToken();
  }, []);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateStep()) {
    return;
  }

  setIsLoading(true);

  const formDataToSend = new FormData();
  formDataToSend.append('montant_investissement', formData.amount);
  formDataToSend.append('type_participation', formData.participationType);
  formDataToSend.append('prenom', formData.firstName);
  formDataToSend.append('nom', formData.lastName);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('telephone', formData.phone);
  formDataToSend.append('nationalite', formData.nationality);
  formDataToSend.append('adresse', formData.address);
  formDataToSend.append('comments', formData.comments);
  //formDataToSend.append('methode_paiement', formData.paymentMethod);

// Ajout fichiers s’ils existent

{/* if (formData.documentsUploaded['pieceIdentite']) {
    formDataToSend.append('piece_identite', formData.documentsUploaded['pieceIdentite']);
  }
  if (formData.documentsUploaded['justificatifDomicile']) {
    formDataToSend.append('justificatif_domicile', formData.documentsUploaded['justificatifDomicile']);
  }
  if (formData.documentsUploaded['releveBancaire']) {
    formDataToSend.append('releve_bancaire', formData.documentsUploaded['releveBancaire']);
  }
*/}
  try {
    await axios.post(`/api/investors/${property.id}/store`, formDataToSend, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        // 'Authorization': `Bearer ${token}`, // Si nécessaire, ajouter un token
    },
      withCredentials: true, // pour que les cookies soient transmis si nécessaire
    });

    toast({
      title: "Demande envoyée",
      description: "Votre demande a été soumise avec succès.",
    });

    // Reset form
    onOpenChange(false);
    setStep(1);
    setFormData({
      amount: '',
      participationType: 'passive',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nationality: '',
      address: '',
      comments: '',
      documentsUploaded: false,
      paymentMethod: 'bank',
    });

  } catch (error) {
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'envoi.",
      variant: "destructive",
    });
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  

  const MinEntryPrice = property.investmentDetails?.minEntryPrice || '500,000 MAD';
  const numericPrice = parseInt(MinEntryPrice.replace(/[^0-9]/g, ''));
  const suggestedAmounts = [
    numericPrice,
    numericPrice * 1.*5,
    numericPrice * 2,
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
                    className={cn("pl-10", formErrors.amount && "border-red-500")}
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.amount ? (
                  <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">
                    Montant minimum d'entrée: {MinEntryPrice}
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
                Type de participation
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
                  placeholder="votre@email.com"
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
                  <SelectValue placeholder="Sélectionnez votre nationalité" />
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
                placeholder="Votre adresse complète"
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
                placeholder="Questions ou commentaires supplémentaires..."
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
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
                <Check className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">Merci pour votre intérêt !</h3>
                <p className="text-gray-700 text-base">
                Au nom de toute l’équipe Universelle, nous vous remercions sincèrement pour le temps que vous avez consacré à compléter vos informations.
                Un conseiller vous contactera sous 24 à 48 heures afin de discuter de votre investissement et convenir d’un rendez-vous pour organiser la suite du processus.
                </p>
                
              </div>
            </motion.div>
          );
        
  
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-white dark:bg-white text-gray-800 dark:text-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Investir dans {property.title}</DialogTitle>
          <DialogDescription className="text-base">
            Complétez le formulaire ci-dessous pour démarrer votre investissement.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, ].map((stepNumber) => (
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
                  {stepNumber === 1 && "Montant"}
                  {stepNumber === 2 && "Informations"}
                  {stepNumber === 3 && "Finalisation"}
                  {/* {stepNumber === 4 && "Paiement"} */}
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
        
        <ScrollArea className="pr-4 max-h-[60vh]">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" custom={slideDirection.current}>
              {renderStepContent()}
            </AnimatePresence>
          </form>
        </ScrollArea>
          
        <Separator className="my-4" />
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between w-full gap-3 mt-4">
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
              className="bg-gold hover:bg-gold-dark w-full sm:w-auto transition-all hover:scale-102"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                "Finaliser l'investissement"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestisseur;

