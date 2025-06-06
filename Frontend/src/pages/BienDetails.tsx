import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import BienCard from '@/components/properties/BienCard';
import MakeOfferDialog from '@/components/properties/MakeOfferDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin, Bath, Bed, Ruler, FileText, Phone, Mail, Clock, Car, PencilRuler,
  Maximize, Tag, Download, Send, Video, CalendarCheck, CheckCircle,
  ChevronRight, MessageCircle, X, Utensils, ShoppingBag, GraduationCap, Wallet, Share2
} from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactCountryFlag from 'react-country-flag';
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import { countryCodes, CountryData } from '@/lib/countryCodes'; // Make sure this path is correct
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
  consent: z.boolean().optional(), 
});
const phoneNumber = "+2128086044195"; // Your phone number

  const handleCallClick = () => {
    // Check if the user is on a mobile device (a simple heuristic)
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // If on mobile, use tel: protocol to initiate a call
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // If on PC, display an alert
      alert(`Pour nous appeler, veuillez utiliser un téléphone.\nNuméro: ${phoneNumber}`);
    }
  };
interface BienType {
  id: number;
  title: string;
  type: string;
  status: string;
  price: string;
  location: string;
  quartier?: string;
  area: string;
  construction_year?: string;
  condition?: string;
  exposition?: string;
  cuisine?: string;
  has_parking?: string;
  parking_places?: string;
  climatisation?: string;
  terrasse?: string;
  estimated_charges?: string;
  monthly_rent?: string;
  estimated_valuation?: string;
  images?: string[];
  documents?: string[];
  proximite?: string[];
  map_link?: string;
  available_date?: string;
  bedrooms?: string;
  bathrooms?: string;
  points_forts?: string[];
  occupation_rate?: string;
}

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY?: number;
    };
  }
}
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}
const BienDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [similarBiens, setSimilarBiens] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [makeOfferOpen, setMakeOfferOpen] = useState(false);
  const contactFormRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isDetectingIp, setIsDetectingIp] = useState(true);
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
      consent: true,
    },
  });
useEffect(() => {
  const detectCountryByIp = async () => {
    try {
      const response = await axios.get('https://ipwho.is');
      const { country_code, success } = response.data;

      if (success && country_code) {
        const foundCountry = countryCodes.find(
          (c) => c.iso2 === country_code
        );
        if (foundCountry) {
          setSelectedCountry(foundCountry);
          contactForm.setValue('phone', `+${foundCountry.code} `);
        } else {
          console.warn(`Code pays ${country_code} non trouvé dans la liste.`);
          // Fallback vers le Maroc
          const morocco = countryCodes.find((c) => c.iso2 === 'MA');
          if (morocco) {
            setSelectedCountry(morocco);
            contactForm.setValue('phone', `+${morocco.code} `);
          }
        }
      } else {
        // Fallback si la détection échoue
        const morocco = countryCodes.find((c) => c.iso2 === 'MA');
        if (morocco) {
          setSelectedCountry(morocco);
          contactForm.setValue('phone', `+${morocco.code} `);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la détection IP :", error);
      // Fallback en cas d'erreur
      const morocco = countryCodes.find((c) => c.iso2 === 'MA');
      if (morocco) {
        setSelectedCountry(morocco);
        contactForm.setValue('phone', `+${morocco.code} `);
      }
    } finally {
      setIsDetectingIp(false);
    }
  };

  detectCountryByIp();

  return () => {
    contactForm.setValue('phone', '');
    setSelectedCountry(null);
    setIsDetectingIp(true);
  };
}, [contactForm]);

  const handleCountrySelectChange = (iso2Code: string, fieldOnChange: (value: string) => void) => {
    const selected = countryCodes.find(c => c.iso2 === iso2Code);
    if (selected) {
      setSelectedCountry(selected);

      const currentPhoneValue = contactForm.getValues('phone');
      const currentPhoneNumber = parsePhoneNumberFromString(currentPhoneValue);

      let newPhoneNumberString = '';
      if (currentPhoneNumber && currentPhoneNumber.nationalNumber) {
        newPhoneNumberString = `+${selected.code}${currentPhoneNumber.nationalNumber}`;
      } else {
        newPhoneNumberString = `+${selected.code} `;
      }
      fieldOnChange(newPhoneNumberString);
      contactForm.trigger('phone'); // Re-validate phone field after change
    }
  };
  useEffect(() => {
    const fetchBien = async () => {
      try {
        const response = await axios.get(`/api/biens/${id}`);
        const data = response.data;
        setBien(data);
        contactForm.setValue(
          "message",
          `Bonjour, je suis intéressé par "${data.title}" (réf. ${data.id}) à ${data.location}. J'aimerais obtenir plus d'informations sur ce bien.`
        );
        // Fetch similar biens
        const resSimilar = await axios.get(`/api/biens/similaires/${data.id}`);
        setSimilarBiens(resSimilar.data || []);
      } catch (err) {
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBien();
  }, [id, contactForm, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    if (contactFormRef.current) {
      contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onContactSubmit = async (data: z.infer<typeof contactFormSchema>) => {
  try {
    // 1. Ensure `bien` exists before trying to access its properties
    if (!bien) {
      toast("Erreur: Les détails du bien ne sont pas disponibles. Veuillez réessayer.");
      return; // Exit if bien is null
    }

    // 2. Parse phone number to E.164 format using selectedCountry as default region
    const phoneNumberParsed = parsePhoneNumberFromString(data.phone, selectedCountry?.iso2);
    // Use the E.164 format if parsing was successful, otherwise use the raw data.phone
    const phoneNumberForDb = phoneNumberParsed ? phoneNumberParsed.format('E.164') : data.phone;

    await axios.post('/api/messages', {
      bien_id: bien.id, // Now it's safe to access bien.id
      name: data.name,
      email: data.email,
      phone: phoneNumberForDb, // Use the E.164 formatted phone number here
      contact_method: data.contactMethod,
      visit_type: data.visitType,
      visit_date: data.visitDate || null,
      message: data.message,
      consent: data.consent,
    });

    toast("Message envoyé avec succès !");

    // Reset the form after successful submission
    contactForm.reset({
      name: "",
      email: "",
      // Reset phone to an empty string, so the useEffect for IP detection
      // can re-initialize it with the correct country code prefix for the next submission.
      phone: "",
      message: `Bonjour, je suis intéressé par "${bien.title}" (réf. ${bien.id}) à ${bien.location}. J'aimerais obtenir plus d'informations sur ce bien.`,
      contactMethod: "email",
      visitType: "none",
      visitDate: "",
    });

    // Reset selectedCountry and isDetectingIp to ensure fresh IP detection on next form use
    setSelectedCountry(null);
    setIsDetectingIp(true);

  } catch (error) {
    console.error("Error submitting contact form:", error);
    // You might want to display a more specific error message based on the error
    toast("Erreur lors de l'envoi du message. Veuillez réessayer.");
  }
};
  
  const handleOfferClick = () => {
    setMakeOfferOpen(true);
  };

const handleDownload = (bienId: number) => {
  if (isDownloading) return;

  setIsDownloading(true);

  toast("Téléchargement démarré", {
    description: "Le plan est en cours de téléchargement.",
    action: {
      label: "Fermer",
      onClick: () => {},
    },
  });
 
  fetch(`http://localhost:8000/api/download/${bienId}`)
  .then((response) => {
      if (!response.ok) throw new Error("Erreur lors du téléchargement");
      return response.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Plan.pdf"; // ton nom personnalisé ici
      link.click();
    })
    .catch((error) => {
      console.error("Erreur de téléchargement", error);
      toast("Échec du téléchargement", {
        description: "Une erreur s'est produite.",
      });
    })
    .finally(() => {
      setIsDownloading(false);
    });
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
  
  const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const handleGeneratePDF = async (bien: BienType) => {
    const doc = new jsPDF();
  
    const logoUrl = "/logo.png"; // ⚠️ doit être dans public
    const logoBase64 = await getBase64FromUrl(logoUrl);
    const qrUrl = "/scan.png";              // ton QR code, aussi dans /public
    const qrBase64 = await getBase64FromUrl(qrUrl);

    const linkToBien = `https://ton-site.com/bien/${bien.id}`;
    const whatsappLink = `https://wa.me/212665944626`;
  
    // ✅ Logo en haut
    doc.addImage(logoBase64, 'PNG',30, 10, 100, 20); // x, y, width, height
    doc.addImage(qrBase64, 'PNG', 160, 5, 35, 35);     // QR code à droite

    const topMargin = 30; // ajustable (ex: 30 au lieu de 10)

// Titre
const formattedId = String(bien.id).padStart(3, '0');
const titreFiche = `Fiche technique du ${bien.title} (ID ${formattedId})`;

doc.setFont('helvetica', 'bold');
doc.setFontSize(18);
doc.text(titreFiche, 105, topMargin + 20, { align: "center" });


    const rendement = bien.monthly_rent && bien.price
      ? ((parseFloat(bien.monthly_rent) * 12 / parseFloat(bien.price.replace(/\s/g, ''))) * 100).toFixed(2)
      : null;
  
    const dataForPdf = [
 { label: 'Titre', value: bien.title },
 { label: 'Type', value: bien.type },
 { label: 'Statut', value: bien.status },
 { label: 'Prix', value: bien.price ? bien.price + ' MAD' : null },
 { label: 'Ville', value: bien.location },
 { label: 'Quartier', value: bien.quartier },
 { label: 'Superficie', value: bien.area ? bien.area + ' m²' : null },
 { label: 'Année de construction', value: bien.construction_year },
 { label: 'État général', value: bien.condition },
 { label: 'Exposition', value: bien.exposition },
 { label: 'Date de disponibilité', value: bien.available_date ? new Date(bien.available_date).toLocaleDateString() : null },
 { label: 'Chambres', value: bien.bedrooms && Number(bien.bedrooms) > 0 ? bien.bedrooms : null },
 { label: 'Salles de bain', value: bien.bathrooms && Number(bien.bathrooms) > 0 ? bien.bathrooms : null },
 { label: 'Cuisine', value: bien.cuisine },
 { label: 'Parking', value: bien.has_parking === 'oui' ? `${bien.parking_places || 'Nombre non spécifié'} place(s)` : (bien.has_parking === 'non' ? 'Non' : null) },
 { label: 'Climatisation', value: bien.climatisation },
 { label: 'Terrasse/Balcon', value: bien.terrasse },
 { label: 'Frais de syndic', value: bien.estimated_charges ? `${bien.estimated_charges} MAD/mois` : null },
{ label: 'Rendement', value: rendement ? `${rendement}%` : null },
 { label: 'Valorisation estimée', value: bien.estimated_valuation ? `+${bien.estimated_valuation}%` : null },
 { label: 'Points forts', value: bien.points_forts?.length ? bien.points_forts.join(', ') : null },
 { label: 'Proximité', value: bien.proximite?.length ? bien.proximite.map(item => proximiteDescriptions[item]?.label || item).join(', ') : null },
 { label: 'Taxe d\'habitation', value: bien.occupation_rate ? `${bien.occupation_rate} MAD/an` : null },
 ];

 // Filtrer les lignes dont la valeur est null ou une chaîne vide
 const filteredRows = dataForPdf
 .filter(row => row.value !== null && row.value !== undefined && String(row.value).trim() !== '' && String(row.value).trim() !== '0')
 .map(row => [row.label, row.value]); // Transformer en format [clé, valeur] pour autoTable

 autoTable(doc, {
 startY: topMargin + 30,
 head: [['Élément', 'Description']],
 body: filteredRows, // Utilise les lignes filtrées ici
 styles: {
 fontSize: 10,
 cellPadding: 2,
 overflow: 'linebreak',
 },
 headStyles: {
 fillColor: [212, 159, 28], // #d49f1c
 textColor: [255, 255, 255],
 fontStyle: 'bold',
 },
 columnStyles: {
 0: { cellWidth: 60 }, // Élément
 1: { cellWidth: 120 }, // Description
 },
margin: { top: 20, bottom: 30 },
 pageBreak: 'auto',
 });
  
    autoTable(doc, {
      startY: topMargin + 30,
      head: [['Élément', 'Description']],
       body: filteredRows, 
      styles: {
        fontSize: 10,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [212, 159, 28], // #d49f1c
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 60 }, // Élément
        1: { cellWidth: 120 }, // Description
      },
      margin: { top: 20, bottom: 30 },
      pageBreak: 'auto',
    });
    const finalY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;
    const iconUrl = "/tap.png"; // nom réel du fichier dans /public
const iconBase64 = await getBase64FromUrl(iconUrl);

// Ligne 1
doc.setFontSize(12);
doc.setTextColor(40, 40, 40);
doc.text("Pour plus de détails sur le bien :", 14, finalY);

const linkText1 = "cliquez ici";
const linkX1 = doc.getTextWidth("Pour plus de détails sur le bien :") + 16;

doc.setTextColor(212, 159, 28); // doré
doc.textWithLink(linkText1, linkX1, finalY, { url: linkToBien });

// ➕ Affichage image lien
doc.addImage(iconBase64, "PNG", linkX1 + doc.getTextWidth(linkText1) + 2, finalY - 4.5, 5, 5);

// Ligne 2
const secondLineY = finalY + 8;
doc.setTextColor(40, 40, 40);
doc.text("Pour nous contacter sur WhatsApp :", 14, secondLineY);

const linkText2 = "cliquez ici";
const linkX2 = doc.getTextWidth("Pour nous contacter sur WhatsApp :") + 16;

doc.setTextColor(212, 159, 28);
doc.textWithLink(linkText2, linkX2, secondLineY, { url: whatsappLink });

// ➕ Image à droite du texte
doc.addImage(iconBase64, "PNG", linkX2 + doc.getTextWidth(linkText2) + 2, secondLineY - 4.5, 5, 5);

    doc.setFontSize(9);
    doc.setTextColor(100);
doc.text("© Agence Universelle - ICE : 003368237000048 - contact@universelle.ma - +212 808604195", 105, 286, { align: "center" });
doc.text("Adresse : IMM17 N°9 Touzine, Complexe Bayt Laatik, Tanger 90000", 105, 289, { align: "center" });   doc.save(`Fiche_${bien.title.replace(/\s/g, '_')}.pdf`);
  };
  
  if (!bien) {
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
  const firstImageUrl = bien.images && bien.images.length > 0
  ? `http://localhost:8000/${bien.images[0]}`
  : undefined;

  const mockImages = Array.isArray(bien.images)
  ? bien.images.map(img => `http://localhost:8000/${img}`)
  : [];

  const proximiteDescriptions: Record<string, { icon: JSX.Element; label: string; description: string }> = {
    Transports: {
      icon: <Car className="h-4 w-4 text-luxe-blue" />,
      label: "Transports",
      description: "Le bien bénéficie d'une excellente accessibilité grâce à la présence de divers moyens de transport à proximité, facilitant vos déplacements au quotidien.",
    },
    Commerces: {
      icon: <ShoppingBag className="h-4 w-4 text-luxe-blue" />,
      label: "Commerces",
      description: "Vous trouverez à proximité une variété de commerces, boutiques et services essentiels répondant à vos besoins quotidiens sans avoir à vous déplacer loin.",
    },
    Restaurants: {
      icon: <Utensils className="h-4 w-4 text-luxe-blue" />,
      label: "Restaurants",
      description: "De nombreux restaurants et cafés sont situés dans les environs, offrant un large choix gastronomique pour vos sorties en couple, en famille ou entre amis.",
    },
    Écoles: {
      icon: <GraduationCap className="h-4 w-4 text-luxe-blue" />,
      label: "Écoles",
      description: "Des établissements scolaires de qualité, allant de la maternelle au lycée, se trouvent à proximité, garantissant un environnement propice à l'éducation de vos enfants.",
    },
  };
  

  const statusColors = {
    'Disponible': 'bg-green-500',
    'Réservé': 'bg-amber-500',
    'Vendu': 'bg-gray-500',
  };
  const rendement = (bien.monthly_rent && bien.price)
  ? ((parseFloat(bien.monthly_rent) * 12 / parseFloat(bien.price.replace(/\s/g, ''))) * 100).toFixed(2)
  : null;
  return (
    <MainLayout>
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
      {firstImageUrl ? (
        <img src={firstImageUrl}
            alt={bien.title}
            className="w-full h-full object-cover "
            loading="lazy"
          />
        ) : (
          <p>No image available</p>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 text-white p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${statusColors[bien.status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
                {bien.status}
              </Badge>
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white">
                {bien.type}
              </Badge>
              {bien.return && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white">
                  Rendement: {bien.return}
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              {bien.title}
            </h1>
            
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2 text-white/80" />
              <p className="text-lg text-white/90">{bien.location},{bien.quartier}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white/90 mb-6">
              {Number(bien.bedrooms) > 0 && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{bien.bedrooms} chambres</span>
                </div>
              )}
              
              {Number(bien.bathrooms) > 0 && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{bien.bathrooms} salles de bain</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                <span>{bien.area}</span>
              </div>
              
              <div className="flex items-center">
                <span className="font-bold">{bien.price} MAD </span>
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
                className="bg-gray text-white hover:bg-gold/20 hover:text-white border border-gold"
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
                src={firstImageUrl}
                alt={bien.title}
                className="h-12 w-16 object-cover rounded-md hidden sm:block"
                loading="lazy"
              />
              <div>
                <p className="font-semibold text-luxe-blue truncate max-w-[200px] md:max-w-md">
                  {bien.title}
                </p>
                <p className="text-gold font-bold">{bien.price}</p>
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
    {mockImages.slice(1).map((img, index) => (
      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        <div className="relative h-60 md:h-72 overflow-hidden rounded-lg">
          <img
            src={img}
            alt={`Vue ${index + 2} de ${bien.title}`} // +2 car on saute la 1ère image
            className="w-full h-full object-cover"
            loading="lazy"
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
                alt={`Vue ${index + 2} de ${bien.title}`}
                className="w-full h-auto max-h-[80vh] object-contain"
                loading="lazy"
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
                    loading="lazy"
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
            
          {bien.documents?.length > 0 && (
  <Button
    variant="outline"
    size="sm"
    className="flex gap-1.5 text-sm"
    onClick={() => handleDownload(bien.id)}
  >
    <div className="flex items-center">
      <Download className="h-4 w-4" />
      Le plan
    </div>
  </Button>
)}

            
    {/*  <Button variant="outline" size="sm" className="flex gap-1.5 text-sm">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>*/}
            
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
                  {bien.description ? (
                    <p>{bien.description}</p>
                  ) : (
                    <>
                      <p>Cette propriété exclusive située dans un quartier recherché de {bien.location} offre un mélange parfait de luxe et de confort. Avec ses finitions haut de gamme et ses espaces de vie généreux, cette résidence est idéale pour les personnes exigeantes.</p>
                      
                      <p>La propriété bénéficie d'une exposition optimale garantissant une luminosité naturelle tout au long de la journée. Les matériaux de qualité supérieure ont été soigneusement sélectionnés pour créer une atmosphère à la fois élégante et chaleureuse.</p>
                      
                      <p>Les espaces extérieurs sont aménagés avec goût, offrant un cadre paisible pour se détendre et recevoir. La proximité des commodités et des axes de transport en fait un emplacement stratégique pour concilier vie professionnelle et personnelle.</p>
                    </>
                  )}
                </div>
                
               {bien.points_forts && bien.points_forts.length > 0 && ( // <-- Condition ajoutée ici
 <div> {/* Ajout d'un div conteneur pour le titre et la liste */}
 <h3 className="text-xl font-semibold mb-4">Points forts</h3>
 <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-10">
 {Array.isArray(bien.points_forts) && bien.points_forts.length > 0 && (
  <ul>
    {bien.points_forts.map((feature, index) => (
      <li key={index}>{feature}</li>
    ))}
  </ul>
)}

</ul>
</div>
)}

                
               {/* START MODIFICATION FOR INVESTISSEMENT */}
 {(rendement || bien.estimated_valuation) && ( // Condition pour masquer tout le bloc
 <div> {/* Conteneur pour le titre et les cartes */}
<h3 className="text-xl font-semibold mb-4">Investissement</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
 {rendement && ( // Affiche la carte du rendement seulement si rendement est disponible
 <div className="bg-gray-50 p-6 rounded-lg border">
 <h4 className="font-semibold mb-2 text-luxe-blue">Rendement locatif</h4>
 <div className="text-3xl font-bold text-gold mb-2"> {rendement}%</div> {/* Plus besoin du ternaire ici */}
 <p className="text-sm text-gray-600">Basé sur le marché locatif actuel</p>
 </div>
 )}
 {bien.estimated_valuation && ( // Affiche la carte de valorisation seulement si bien.estimated_valuation est disponible
 <div className="bg-gray-50 p-6 rounded-lg border">
<h4 className="font-semibold mb-2 text-luxe-blue">Valorisation estimée</h4>
 <div className="text-3xl font-bold text-gold mb-2">+{bien.estimated_valuation}%</div> {/* Plus besoin du ternaire ici */}
 <p className="text-sm text-gray-600">Sur les 5 prochaines années</p>
 </div>
 )}
 </div>
 </div>
 )}
 {/* END MODIFICATION FOR INVESTISSEMENT */}
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
          <span className="font-medium">{bien.id}</span>
        </li>
        <li className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Type de bien</span>
          <span className="font-medium">{bien.type}</span>
        </li>
        {bien.area && (
  <li className="flex justify-between border-b pb-2">
    <span className="text-gray-600">Surface habitable</span>
    <span className="font-medium">{bien.area} m²</span>
  </li>
)}

        {bien.construction_year && (
          <li className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Année de construction</span>
            <span className="font-medium">{bien.construction_year}</span>
          </li>
        )}
        {bien.condition && (
          <li className="flex justify-between border-b pb-2">
            <span className="text-gray-600">État général</span>
            <span className="font-medium">{bien.condition}</span>
          </li>
        )}
        {bien.exposition && (
          <li className="flex justify-between border-b pb-2">
            <span className="text-gray-600">Exposition/Orientation</span>
            <span className="font-medium">{bien.exposition}</span>
          </li>
        )}
      </ul>
    </div>

   {(Number(bien.bedrooms) > 0 ||
 Number(bien.bathrooms) > 0 ||
 bien.cuisine ||
 bien.has_parking ||
 bien.climatisation ||
 bien.terrasse) && (
 <div>
 <h3 className="text-lg font-semibold mb-4 flex items-center">
 <Clock className="h-5 w-5 mr-2 text-luxe-blue" />
 Équipements
 </h3>
<ul className="space-y-3">
 {Number(bien.bedrooms) > 0 && (
 <li className="flex justify-between border-b pb-2">
 <span className="text-gray-600">Chambres</span>
 <span className="font-medium">{bien.bedrooms}</span>
 </li>
 )}
{Number(bien.bathrooms) > 0 && (
 <li className="flex justify-between border-b pb-2">
<span className="text-gray-600">Salles de bain</span>
 <span className="font-medium">{bien.bathrooms}</span>
</li>
)}
{bien.cuisine && (
<li className="flex justify-between border-b pb-2">
 <span className="text-gray-600">Cuisine</span>
 <span className="font-medium">{bien.cuisine}</span>
 </li>
 )}
 {bien.has_parking && (
 <li className="flex justify-between border-b pb-2">
 <span className="text-gray-600">Parking</span>
 <span className="font-medium">
 {bien.has_parking === 'oui'
 ? `${bien.parking_places || '1'} place(s)`
 : 'Non'}
 </span>
 </li>
)}
 {bien.climatisation && (
<li className="flex justify-between border-b pb-2">
<span className="text-gray-600">Climatisation</span>
 <span className="font-medium">{bien.climatisation}</span>
 </li>
 )}
{bien.terrasse && (
 <li className="flex justify-between border-b pb-2">
<span className="text-gray-600">Terrasse/Balcon</span>
<span className="font-medium">{bien.terrasse}</span>
 </li>
 )}
 </ul>
 </div>
 )}
  </div>

  <div className="mt-10">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Wallet className="h-5 w-5 mr-2 text-luxe-blue" />
      Informations financières
    </h3>
    <ul className="space-y-3">
      <li className="flex justify-between border-b pb-2">
        <span className="text-gray-600">Prix</span>
        <span className="font-medium">{bien.price} MAD</span>
      </li>
      {bien.price && bien.area && (
        <li className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Prix au m²</span>
          <span className="font-medium">
            {(parseFloat(bien.price.replace(/\s/g, '')) / parseFloat(bien.area)).toFixed(2)} MAD/m²
          </span>
        </li>
      )}
      {bien.estimated_charges && (
        <li className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Frais de syndic</span>
          <span className="font-medium">{bien.estimated_charges} MAD/mois</span>
        </li>
      )}
      {bien.occupation_rate && (
        <li className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Taxe d'habitation</span>
          <span className="font-medium">{bien.occupation_rate} MAD/an</span>
        </li>
      )}
    </ul>
    <Button
      className="flex items-center gap-2 bg-luxe-blue hover:bg-luxe-blue/90 mt-4"
      onClick={() => handleGeneratePDF(bien)}
    >
      <FileText className="h-4 w-4" />
      Télécharger la fiche technique complète
    </Button>
  </div>
</TabsContent>

              
              <TabsContent value="location">
                <h2 className="text-2xl font-bold mb-6 text-luxe-blue">Localisation</h2>
                
                {bien.map_link ? (
  <div className="rounded-lg overflow-hidden border h-[400px] mb-8">
    <iframe
      src={bien.map_link}
      width="100%"
      height="100%"
      allowFullScreen
      loading="lazy"
      className="border-0 w-full h-full"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
) : (
  <div className="rounded-lg overflow-hidden border h-[400px] mb-8 bg-gray-100 flex items-center justify-center">
    <div className="text-center text-gray-600">
      <MapPin className="mx-auto mb-2 h-8 w-8 text-luxe-blue" />
      <p>Carte non disponible</p>
    </div>
  </div>
)}

                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

 {/* START MODIFICATION FOR PROXIMITÉ - Masque tout si vide */}
 {bien.proximite && bien.proximite.length > 0 && (
 <div>
 <h3 className="text-lg font-semibold mb-4">Proximité</h3>

{Array.isArray(bien.proximite) && bien.proximite.length > 0 && (
   <ul className="space-y-3">
    {bien.proximite.map((item, index) => {
      const data = proximiteDescriptions[item];
      if (!data) return null;
      return (
        <li key={index}>
          {data.label}
        </li>
      );
    })}
  </ul>
)}

 {/* END MODIFICATION FOR PROXIMITÉ */}


 {/* QUARTIER - Reste inchangé, affiche 'inconnu' si bien.quartier est vide */}
 <div>
 <h3 className="text-lg font-semibold mb-4">Quartier</h3>
 <div className="prose text-gray-700">
 <p>
 Le quartier de {bien.quartier ? bien.quartier.split(',')[0] : 'inconnu'} est reconnu pour sa qualité de vie exceptionnelle. 
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
    <FormItem className='dark:text-black'>
      <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
      <div className={cn(
        "mt-1 flex items-center border rounded-md overflow-hidden bg-white",
        contactForm.formState.errors.phone && "border-red-500"
      )}>
        {/* Country Code Selector (Dropdown) */}
        <Select
          onValueChange={(value) => handleCountrySelectChange(value, field.onChange)}
          value={selectedCountry?.iso2 || ''}
          disabled={isDetectingIp}
        >
          {/* ADJUSTED WIDTH HERE: w-[90px] became w-[75px] */}
          <SelectTrigger className="flex-shrink-0 w-[75px] border-y-0 border-l-0 rounded-none focus:ring-0 focus:ring-offset-0 px-2 py-2">
            {isDetectingIp ? (
              <span className="animate-pulse text-gray-500 text-sm">Chargement...</span>
            ) : selectedCountry ? (
              <span className="flex items-center space-x-1">
                <ReactCountryFlag
                  countryCode={selectedCountry.iso2}
                  svg
                  style={{ width: '2.25em', height: '1.25em' }}
                  className="!rounded-none"
                />
              </span>
            ) : (
              <span className="text-gray-500">Choisir</span>
            )}
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {countryCodes.map((country) => (
              <SelectItem key={country.iso2} value={country.iso2}>
                <span className="flex items-center">
                  <ReactCountryFlag
                    countryCode={country.iso2}
                    svg
                    style={{ width: '2.25em', height: '1.25em' }}
                    className="mr-2 !rounded-none"
                  />
                  {country.name} (+{country.code})
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Input */}
        <Input
          type="tel"
          className="flex-1 border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={selectedCountry ? `ex: ${selectedCountry.code === '212' ? '6XXXXXXXX ou 7XXXXXXXX' : 'Numéro national'}` : "Votre numéro de téléphone"}
          value={field.value}
          onChange={(e) => {
            const newValue = e.target.value;
            if (selectedCountry) {
              const formatter = new AsYouType(selectedCountry.iso2);
              const formattedValue = formatter.input(newValue);
              field.onChange(formattedValue);
            } else {
              // If no country is selected (e.g., still detecting IP),
              // just pass the raw value to allow initial typing.
              field.onChange(newValue);
            }
          }}
          onBlur={() => field.onBlur()}
          name={field.name}
          ref={field.ref}
        />
      </div>
      <FormMessage />
    </FormItem>
  )}
/>          </div>
                  
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
    className={`w-[95px] text-sm ${
      field.value === "email" ? "bg-luxe-blue text-white" : ""
    }`}
    onClick={() => field.onChange("email")}
  >
    <Mail className="h-4 w-4 mr-1" />
    Email
  </Button>
  <Button
    type="button"
    variant={field.value === "phone" ? "default" : "outline"}
    className={`w-[115px] text-sm ${
      field.value === "phone" ? "bg-luxe-blue text-white" : ""
    }`}
    onClick={() => field.onChange("phone")}
  >
    <Phone className="h-4 w-4 mr-1" />
    Téléphone
  </Button>
  <Button
    type="button"
    variant={field.value === "whatsapp" ? "default" : "outline"}
    className={`w-[120px] text-sm ${
      field.value === "whatsapp" ? "bg-green-600 text-white" : ""
    }`}
    onClick={() => field.onChange("whatsapp")}
  >
    <MessageCircle className="h-4 w-4 mr-1" />
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
          className={`w-[110px] text-sm ${
            field.value === "physical" ? "bg-luxe-blue text-white" : ""
          }`}
          onClick={() => field.onChange("physical")}
        >
          <MapPin className="h-4 w-4 mr-1" />
          Sur place
        </Button>

        <Button
          type="button"
          variant={field.value === "virtual" ? "default" : "outline"}
          className={`w-[110px] text-sm ${
            field.value === "virtual" ? "bg-luxe-blue text-white" : ""
          }`}
          onClick={() => field.onChange("virtual")}
        >
          <Video className="h-4 w-4 mr-1" />
          Virtuelle
        </Button>

        <Button
          type="button"
          variant={field.value === "none" ? "default" : "outline"}
          className={`w-[110px] text-sm ${
            field.value === "none" ? "bg-luxe-blue text-white" : ""
          }`}
          onClick={() => field.onChange("none")}
        >
          <X className="h-4 w-4 mr-1" />
          Aucune
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

                  {contactForm.watch("visitType") === "physical" && (
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
                  <FormField
                                control={contactForm.control}
                                name="consent"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center space-x-2">
                                            <FormControl>
                                               <Checkbox
    id="contact-consent"
    checked={field.value} // `field.value` will be `true` from defaultValues
    onCheckedChange={field.onChange}
    className="data-[state=checked]:bg-luxe-blue data-[state=checked]:text-white border-gray-300"
/>
                                            </FormControl>
                                            <FormLabel htmlFor="contact-consent" className="text-sm font-normal text-gray-700">
                  J'accepte les{' '}
                  <Link
                    to="/PrivacyPolicyPage"
                    className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                  >
                    conditions générales et la politique de confidentialité
                  </Link>
            
                                            </FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             {contactForm.formState.errors.root?.serverError && (
                                <p className="text-sm text-red-500 mt-2">
                                    {contactForm.formState.errors.root.serverError.message}
                                </p>
                            )}
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
      <Button variant="link" className="text-luxe-blue flex flex-col items-center text-center w-full" onClick={handleCallClick}>
        <div className="flex items-center">
          <CalendarCheck className="h-4 w-4 mr-2" />
          <span>Ou appelez-nous directement au :</span>
        </div>
        <span className="font-semibold mt-1">{phoneNumber}</span>
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
            {similarBiens.length > 0 ? (
              similarBiens.map((prop) => (
                <BienCard key={prop.id} bien={prop} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucun bien similaire disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {bien && (
        <MakeOfferDialog 
        bien={bien} 
        open={makeOfferOpen} 
        onOpenChange={setMakeOfferOpen} 
      />
      )}
    </MainLayout>
  );
};

export default BienDetails;
