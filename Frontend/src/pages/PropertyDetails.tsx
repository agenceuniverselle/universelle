import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperties } from '@/context/PropertiesContext';
import MainLayout from '@/components/layouts/MainLayout';
import PropertyCard from '@/components/properties/PropertyCard';
import MakeOfferDialog from '@/components/properties/MakeOfferDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { 
  MapPin, 
  Bath, 
  Bed, 
  Ruler, 
  Calendar, 
  DollarSign, 
  FileText, 
  Phone, 
  Mail, 
  Clock, 
  Car, 
  PencilRuler, 
  Maximize, 
  Tag,
  Download,
  Send,
  Video,
  CalendarCheck,
  CheckCircle, 
  ChevronRight,
  ArrowRight,
  Heart,
  Share2,
  MessageCircle,
  X,
  Utensils,
  ShoppingBag 
} from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().min(10, { message: "Numéro de téléphone invalide" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
  contactMethod: z.enum(["email", "phone", "whatsapp"], {
    required_error: "Veuillez sélectionner une méthode de contact",
  }),
  visitType: z.enum(["physical", "virtual", "none"], {
    required_error: "Veuillez sélectionner un type de visite",
  }),
  visitDate: z.string().optional(),
});

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { getPropertyById, properties } = useProperties();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [makeOfferOpen, setMakeOfferOpen] = useState(false);
  const contactFormRef = useRef<HTMLDivElement>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      contactMethod: "email",
      visitType: "none",
      visitDate: "",
    },
  });

  useEffect(() => {
    if (propertyId) {
      const propertyData = getPropertyById(propertyId);
      if (propertyData) {
        setProperty(propertyData);
        
        contactForm.setValue("message", `Bonjour, je suis intéressé par "${propertyData.title}" (réf. ${propertyData.id}) à ${propertyData.location}. J'aimerais obtenir plus d'informations sur ce bien.`);
      } else {
        navigate('/not-found');
      }
    }
    setLoading(false);
  }, [propertyId, getPropertyById, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (property) {
      const findSimilarProperties = () => {
        const allProperties = getPropertyById ? 
          properties.filter(p => 
            p.id !== property.id && (
              p.type === property.type || 
              p.location.split(',')[0] === property.location.split(',')[0] ||
              Math.abs(parseFloat(p.price.replace(/[^0-9.-]+/g, '')) - 
                       parseFloat(property.price.replace(/[^0-9.-]+/g, ''))) < 2000000
            )
          ).slice(0, 3) : [];
        
        setSimilarProperties(allProperties);
      };
      
      findSimilarProperties();
    }
  }, [property, properties]);

  const scrollToContact = () => {
    if (contactFormRef.current) {
      contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onContactSubmit = (data: z.infer<typeof contactFormSchema>) => {
    console.log("Form submission data:", data);
    
    toast("Demande envoyée", {
      description: "Nous vous contacterons dans les plus brefs délais.",
      action: {
        label: "Fermer",
        onClick: () => {}
      }
    });
    
    contactForm.reset({
      name: "",
      email: "",
      phone: "",
      message: `Bonjour, je suis intéressé par "${property.title}" (réf. ${property.id}) à ${property.location}. J'aimerais obtenir plus d'informations sur ce bien.`,
      contactMethod: "email",
      visitType: "none",
      visitDate: "",
    });
  };

  const handleOfferClick = () => {
    setMakeOfferOpen(true);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-20 px-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Bien non trouvé</h1>
          <p className="mb-8">Le bien immobilier que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/nos-biens')}>
            Voir tous nos biens
          </Button>
        </div>
      </MainLayout>
    );
  }

  const mockImages = [
    property?.image,
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop",
  ];

  const statusColors = {
    'Disponible': 'bg-green-500',
    'Réservé': 'bg-amber-500',
    'Vendu': 'bg-gray-500',
  };

  return (
    <MainLayout>
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
        <img 
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 text-white p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${statusColors[property.status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
                {property.status}
              </Badge>
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white">
                {property.type}
              </Badge>
              {property.return && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white">
                  Rendement: {property.return}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              {property.title}
            </h1>
            
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-white/80" />
              <p className="text-lg text-white/90">{property.location}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white/90 mb-6">
              {Number(property.bedrooms) > 0 && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms} chambres</span>
                </div>
              )}
              
              {Number(property.bathrooms) > 0 && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms} salles de bain</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                <span>{property.area}</span>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                <span className="font-bold">{property.price}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={scrollToContact}
                className="bg-gold hover:bg-gold-dark text-white"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contacter l'agence
              </Button>
              
              <Button 
                onClick={handleOfferClick}
                variant="outline"
                className="text-white border-white/50 hover:bg-white/20"
                size="lg"
              >
                <Tag className="h-4 w-4 mr-2" />
                Faire une offre
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {isScrolled && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40 py-3 px-4 md:py-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img 
                src={property.image}
                alt={property.title}
                className="h-12 w-16 object-cover rounded-md hidden sm:block"
              />
              <div>
                <p className="font-semibold text-luxe-blue truncate max-w-[200px] md:max-w-md">
                  {property.title}
                </p>
                <p className="text-gold font-bold">{property.price}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={scrollToContact}
                className="bg-gold hover:bg-gold-dark text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contacter
              </Button>
              
              <Button
                onClick={handleOfferClick}
                variant="outline"
                className="border-luxe-blue text-luxe-blue hover:bg-luxe-blue/10"
              >
                <Tag className="h-4 w-4 mr-2" />
                Offre
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-12 px-4">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Maximize className="h-6 w-6 mr-2 text-luxe-blue" />
            Galerie
          </h2>
          
          <Carousel className="mb-6">
            <CarouselContent>
              {mockImages.map((img, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative h-60 md:h-72 overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`Vue ${index + 1} de ${property.title}`}
                      className="w-full h-full object-cover"
                    />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="absolute bottom-2 right-2 rounded-full bg-white/80 hover:bg-white"
                        >
                          <Maximize className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-[90vw] p-0 bg-black">
                        <img
                          src={img}
                          alt={`Vue ${index + 1} de ${property.title}`}
                          className="w-full h-auto max-h-[80vh] object-contain"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CarouselItem>
              ))}
              
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="relative h-60 md:h-72 overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2070&auto=format&fit=crop"
                    alt="Vidéo de présentation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button 
                      variant="outline" 
                      className="rounded-full bg-white/80 hover:bg-white w-16 h-16 flex items-center justify-center"
                    >
                      <Video className="h-8 w-8 text-luxe-blue" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                    Visite vidéo
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex absolute -left-4" />
            <CarouselNext className="hidden md:flex absolute -right-4" />
          </Carousel>
          
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" className="flex gap-1.5 text-sm">
              <Download className="h-4 w-4" />
              Brochure
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1.5 text-sm">
              <Download className="h-4 w-4" />
              Plan
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1.5 text-sm">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
            <Button variant="outline" size="sm" className="flex gap-1.5 text-sm">
              <Heart className="h-4 w-4" />
              Favori
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="mb-6 bg-gray-100 p-1">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Détails</TabsTrigger>
                <TabsTrigger value="location" className="flex-1">Localisation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-2">
                <h2 className="text-2xl font-bold mb-4 text-luxe-blue">À propos de ce bien</h2>
                
                <div className="prose max-w-none text-gray-700 mb-8">
                  {property.description ? (
                    <p>{property.description}</p>
                  ) : (
                    <>
                      <p>Cette propriété exclusive située dans un quartier recherché de {property.location} offre un mélange parfait de luxe et de confort. Avec ses finitions haut de gamme et ses espaces de vie généreux, cette résidence est idéale pour les personnes exigeantes.</p>
                      
                      <p>La propriété bénéficie d'une exposition optimale garantissant une luminosité naturelle tout au long de la journée. Les matériaux de qualité supérieure ont été soigneusement sélectionnés pour créer une atmosphère à la fois élégante et chaleureuse.</p>
                      
                      <p>Les espaces extérieurs sont aménagés avec goût, offrant un cadre paisible pour se détendre et recevoir. La proximité des commodités et des axes de transport en fait un emplacement stratégique pour concilier vie professionnelle et personnelle.</p>
                    </>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Points forts</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-10">
                  {['Emplacement privilégié', 'Matériaux haut de gamme', 'Excellent état', 'Sécurisé', 'Lumineux', 'Vue dégagée', 'Proche des commodités', 'Stationnement'].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-gold" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-semibold mb-4">Investissement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-luxe-blue">Rendement locatif</h4>
                    <div className="text-3xl font-bold text-gold mb-2">{property.return || '7.5%'}</div>
                    <p className="text-sm text-gray-600">Basé sur le marché locatif actuel</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <h4 className="font-semibold mb-2 text-luxe-blue">Valorisation estimée</h4>
                    <div className="text-3xl font-bold text-gold mb-2">+12%</div>
                    <p className="text-sm text-gray-600">Sur les 5 prochaines années</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <h2 className="text-2xl font-bold mb-6 text-luxe-blue">Caractéristiques détaillées</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <PencilRuler className="h-5 w-5 mr-2 text-luxe-blue" />
                      Spécifications techniques
                    </h3>
                    
                    <ul className="space-y-3">
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Référence</span>
                        <span className="font-medium">{property.id}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Type de bien</span>
                        <span className="font-medium">{property.type}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Surface habitable</span>
                        <span className="font-medium">{property.area}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Année de construction</span>
                        <span className="font-medium">2018</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">État général</span>
                        <span className="font-medium">Excellent</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Exposition</span>
                        <span className="font-medium">Sud-Ouest</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-luxe-blue" />
                      Équipements
                    </h3>
                    
                    <ul className="space-y-3">
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Chambres</span>
                        <span className="font-medium">{property.bedrooms}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Salles de bain</span>
                        <span className="font-medium">{property.bathrooms}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Cuisine</span>
                        <span className="font-medium">Équipée</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Parking</span>
                        <span className="font-medium">2 places</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Climatisation</span>
                        <span className="font-medium">Oui</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Terrasse/Balcon</span>
                        <span className="font-medium">Oui</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-luxe-blue" />
                    Informations financières
                  </h3>
                  
                  <ul className="space-y-3">
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-medium">{property.price}</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Prix au m²</span>
                      <span className="font-medium">12 500 MAD/m²</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Charges estimées</span>
                      <span className="font-medium">1 800 MAD/mois</span>
                    </li>
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Taxe d'habitation</span>
                      <span className="font-medium">2 400 MAD/an</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <Button className="flex items-center gap-2 bg-luxe-blue hover:bg-luxe-blue/90">
                      <FileText className="h-4 w-4" />
                      Télécharger la fiche technique complète
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location">
                <h2 className="text-2xl font-bold mb-6 text-luxe-blue">Localisation</h2>
                
                <div className="rounded-lg overflow-hidden border h-[400px] mb-8">
                  <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-luxe-blue" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-center">Carte interactive non disponible dans cette démo<br/>Emplacement: {property.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Proximité</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 bg-luxe-blue/10 p-1 rounded-full">
                          <Car className="h-4 w-4 text-luxe-blue" />
                        </div>
                        <div>
                          <p className="font-medium">Transports</p>
                          <p className="text-sm text-gray-600">Station de tramway à 5 min, grands axes routiers à proximité</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 bg-luxe-blue/10 p-1 rounded-full">
                          <ShoppingBag className="h-4 w-4 text-luxe-blue" />
                        </div>
                        <div>
                          <p className="font-medium">Commerces</p>
                          <p className="text-sm text-gray-600">Centre commercial à 10 min, commerces de proximité</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 bg-luxe-blue/10 p-1 rounded-full">
                          <Utensils className="h-4 w-4 text-luxe-blue" />
                        </div>
                        <div>
                          <p className="font-medium">Restaurants</p>
                          <p className="text-sm text-gray-600">Nombreux restaurants et cafés dans un rayon de 500m</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quartier</h3>
                    <div className="prose text-gray-700">
                      <p>
                        Le quartier de {property.location.split(',')[0]} est reconnu pour sa qualité de vie exceptionnelle. 
                        Bénéficiant d'infrastructures modernes et d'espaces verts, il offre un cadre de vie idéal 
                        pour les familles et les professionnels.
                      </p>
                      <p>
                        La zone est en plein développement avec plusieurs projets d'urbanisme en cours, 
                        ce qui en fait un investissement prometteur pour l'avenir.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div ref={contactFormRef}>
            <div className="bg-gray-50 rounded-xl border p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-center">Intéressé par ce bien ?</h3>
              
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <FormField
                    control={contactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={contactForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+212 600000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={contactForm.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Méthode de contact préférée</FormLabel>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={field.value === "email" ? "default" : "outline"}
                            className={field.value === "email" ? "bg-luxe-blue" : ""}
                            onClick={() => field.onChange("email")}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "phone" ? "default" : "outline"}
                            className={field.value === "phone" ? "bg-luxe-blue" : ""}
                            onClick={() => field.onChange("phone")}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Téléphone
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "whatsapp" ? "default" : "outline"}
                            className={field.value === "whatsapp" ? "bg-green-600" : ""}
                            onClick={() => field.onChange("whatsapp")}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            WhatsApp
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={contactForm.control}
                    name="visitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de visite</FormLabel>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={field.value === "physical" ? "default" : "outline"}
                            className={field.value === "physical" ? "bg-luxe-blue" : ""}
                            onClick={() => field.onChange("physical")}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Sur place
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "virtual" ? "default" : "outline"}
                            className={field.value === "virtual" ? "bg-luxe-blue" : ""}
                            onClick={() => field.onChange("virtual")}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Virtuelle
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === "none" ? "default" : "outline"}
                            className={field.value === "none" ? "bg-luxe-blue" : ""}
                            onClick={() => field.onChange("none")}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Aucune
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {(contactForm.watch("visitType") === "physical" || contactForm.watch("visitType") === "virtual") && (
                    <FormField
                      control={contactForm.control}
                      name="visitDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de visite souhaitée</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Votre message..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold-dark"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer ma demande
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 flex justify-center">
                <Button variant="link" className="text-luxe-blue">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Ou appelez-nous directement au +212 500 000 000
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">Biens similaires</h2>
            <Button variant="link" className="text-luxe-blue" onClick={() => navigate('/nos-biens')}>
              Voir tous les biens
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProperties.length > 0 ? (
              similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucun bien similaire disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {property && (
        <MakeOfferDialog 
          property={property} 
          open={makeOfferOpen} 
          onOpenChange={setMakeOfferOpen} 
        />
      )}
    </MainLayout>
  );
};

export default PropertyDetails;
