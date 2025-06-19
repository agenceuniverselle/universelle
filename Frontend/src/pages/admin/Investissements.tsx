import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  BadgePercent,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AddInvestmentDialog from "@/components/properties/AddInvestmentDialog";
import ExclusiveOfferDialog from "./ExclusiveOfferForm";
import { FileText, Trash, Loader2, Home } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ExclusiveOffer } from "@/types/exclusiveOffer.types";
import { InvestmentProperty } from "@/types/Property.types";
import ConseillerForm from "@/components/properties/ConseillerForm";
import ExpertEditForm from "@/components/ExpertEditForm";
interface AdvisorRequest {
  id: string;
  property_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
  rdv_expert_date?: string; // Ajouté
  service_type?: string; // Ajouté
}
interface ExpertRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_date?: string;
  expert?: string;
  service_type?: string;
  consent?: boolean;
  created_at: string;
}
const AdminInvestissements = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [exclusiveDialogOpen, setExclusiveDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeView, setActiveView] = useState<
    "biens" | "offres" | "demandes" | "experts"
  >("biens");
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
  const { permissions } = useAuth();
  const [advisorRequests, setAdvisorRequests] = useState<AdvisorRequest[]>([]);
  const [advisorRequestToDelete, setAdvisorRequestToDelete] = useState<
    string | null
  >(null);
  const [advisorRequestToEdit, setAdvisorRequestToEdit] =useState<AdvisorRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expertRequests, setExpertRequests] = useState<ExpertRequest[]>([]);
  const [filteredExpertRequests, setFilteredExpertRequests] = useState<ExpertRequest[]>([]);
  const [expertRequestToDelete, setExpertRequestToDelete] = useState<string | null>(null);

  // État pour stocker le contact sélectionné
  const [selectedContact, setSelectedContact] = useState(null);
   const [editOpen, setEditOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertRequest | null>(null);
  
  const fetchExpertRequests = async () => {
  try {
    // No 'headers' or 'Authorization' token needed for this specific GET request
    // because your Laravel route for index is not protected by middleware.
    const res = await axios.get("https://back-qhore.ondigitalocean.app/api/expert-contacts");
    setExpertRequests(res.data || []); // Assuming the API returns an array directly
  } catch (error) {
    console.error("Erreur de chargement des demandes d'expert :", error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les demandes d'expert",
      variant: "destructive",
    });
  }
};
  // Fonction pour ouvrir le modal d'édition
  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };
  // Ajout des filtres et tris
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [exclusiveOffers, setExclusiveOffers] = useState<ExclusiveOffer[]>([]);
  const canView = permissions.includes("view_investments");
  const canEdit = permissions.includes("edit_investments");
  const canDelete = permissions.includes("delete_investments");
  const canCreate = permissions.includes("create_investments");
  const hasAnyPermission = canView || canEdit || canDelete || canCreate;
  const [bienToDelete, setBienToDelete] = useState<string | number>(null);

  const canViewOffers = permissions.includes("view_exclusive_offers");
  const canCreateOffers = permissions.includes("create_exclusive_offers");
  const canEditOffers = permissions.includes("edit_exclusive_offers");
  const canDeleteOffers = permissions.includes("delete_exclusive_offers");
  const hasAnyPermissionOffers =
    canViewOffers || canCreateOffers || canEditOffers || canDeleteOffers;
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  // Add status filter for advisor requests
  const [statusFilter, setStatusFilter] = useState("all");

  const [filteredAdvisorRequests, setFilteredAdvisorRequests] = useState<
    AdvisorRequest[]
  >([]);
  useEffect(() => {
    setFilteredExpertRequests(
      expertRequests.filter((request) => {
        const search = searchTerm.toLowerCase();
        return (
          request.name.toLowerCase().includes(search) ||
          request.email.toLowerCase().includes(search) ||
          request.phone.toLowerCase().includes(search) || // Include phone in search
          (request.message && request.message.toLowerCase().includes(search)) ||
          (request.expert && request.expert.toLowerCase().includes(search)) || // Include expert name in search
          (request.service_type &&
            request.service_type.toLowerCase().includes(search)) // Include service type in search
        );
      })
    );
  }, [expertRequests, searchTerm]);
  // Filter advisor requests by status
  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredAdvisorRequests(advisorRequests);
    } else {
      setFilteredAdvisorRequests(
        advisorRequests.filter((request) => request.status === statusFilter)
      );
    }
  }, [advisorRequests, statusFilter]);

  const fetchAdvisorRequests = async () => {
    try {
      const res = await axios.get("https://back-qhore.ondigitalocean.app/api/advisor-requests");
      setAdvisorRequests(res.data || []);
    } catch (error) {
      console.error("Erreur de chargement des demandes de conseiller :", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de conseiller",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpertRequest = async (id: string | null) => {
    if (!id) return;

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

      await axios.delete(https://back-qhore.ondigitalocean.app
/api/expert-contacts/${id}, {
       
      });

      toast({
        title: "Supprimée",
        description: "Demande d'expert supprimée avec succès.",
      });
      fetchExpertRequests(); // Refresh the list
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la demande d'expert",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setExpertRequestToDelete(null);
    }
  };
  const handleDeleteAdvisorRequest = async (id: string | null) => {
    if (!id) return;

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

      await axios.delete(https://back-qhore.ondigitalocean.app
/api/advisor-requests/${id}, {
        headers: {
          Authorization: Bearer ${token},
        },
      });

      toast({
        title: "Supprimée",
        description: "Demande de conseiller supprimée avec succès.",
      });
      fetchAdvisorRequests();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la demande",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setAdvisorRequestToDelete(null);
    }
  };

  const handleSuccess = () => {
    fetchAdvisorRequests();
    setAddDialogOpen(false);
  };

  const handleDeleteExclusiveOffer = async (id: string | null) => {
    if (!id) return;

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
      await axios.delete(https://back-qhore.ondigitalocean.app
/api/exclusive-offers/${id}, {
        headers: {
          Authorization: Bearer ${token}, // ✅ Token ajouté dans les headers
        },
      });

      toast({
        title: "Supprimée",
        description: "Offre exclusive supprimée avec succès.",
      });
      fetchExclusiveOffers();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l’offre",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setOfferToDelete(null);
    }
  };

  useEffect(() => {
  if (activeView === "offres") {
    fetchExclusiveOffers();
  } else if (activeView === "demandes") {
    fetchAdvisorRequests();
  } else if (activeView === "experts") { 
    fetchExpertRequests();
  }
}, [activeView]); 

  const fetchExclusiveOffers = async () => {
    try {
      const res = await axios.get("https://back-qhore.ondigitalocean.app/api/exclusive-offers");
      setExclusiveOffers(res.data || []); // ✅ supprime .data
    } catch (error) {
      console.error("Erreur de chargement des offres exclusives :", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/properties");
      setProperties(response.data.data || []);
    } catch (error) {
      console.error("Erreur de chargement des biens :", error);
    }
  };
  const handleViewDetails = (propertyId: string) => {
    navigate(/admin/investissements/${propertyId});
  };
  const handleEditProperty = (propertyId: string) => {
    toast({
      title: "Mode édition",
      description: "Redirection vers le formulaire d'édition...",
      variant: "default",
    });

    setTimeout(() => {
      navigate(/admin/investissements/edit/${propertyId});
    }, 300);
  };

  const handleDeleteProperty = async (id: string | null) => {
    if (!id) return;

    try {
      setIsDeleting(true);

      // ✅ Récupération du token
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
      await axios.delete(https://back-qhore.ondigitalocean.app
/api/properties/${id}, {
        headers: {
          Authorization: Bearer ${token}, // ✅ Ajout du token dans les headers
        },
      });

      toast({ title: "Supprimé", description: "Bien supprimé avec succès." });
      setDeleteConfirmOpen(false);
      setBienToDelete(null);
      fetchProperties(); // Recharge la liste
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // FILTRAGE & TRI
  const investmentProperties = properties.filter((p) => !!p.investmentDetails);

  const filteredProperties = investmentProperties.filter((property) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      property.title?.toLowerCase().includes(search) ||
      property.location?.toLowerCase().includes(search) ||
      property.type?.toLowerCase().includes(search) ||
      property.investmentDetails?.investmentType
        ?.toLowerCase()
        .includes(search) ||
      property.status?.toLowerCase().includes(search) ||
      property.investmentDetails?.projectStatus?.toLowerCase().includes(search);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "drafts" && property.isDraft) ||
      (activeTab === "published" && !property.isDraft);

    return matchesSearch && matchesTab;
  });

  const filteredExclusiveOffers = exclusiveOffers.filter((offer) => {
    const search = searchTerm.toLowerCase();
    return offer.property?.title?.toLowerCase().includes(search);
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    if (sortBy === "price") {
      return sortOrder === "asc"
        ? (a.price ?? 0) - (b.price ?? 0) // ✅ Utilisation des valeurs par défaut 0 si undefined
        : (b.price ?? 0) - (a.price ?? 0);
    }

    if (sortBy === "return") {
      return sortOrder === "asc"
        ? (a.investmentDetails?.returnRate ?? 0) -
            (b.investmentDetails?.returnRate ?? 0)
        : (b.investmentDetails?.returnRate ?? 0) -
            (a.investmentDetails?.returnRate ?? 0);
    }

    return 0;
  });
  const handleDelete = async (id: string) => {
    if (!window.confirm("Confirmer la suppression ?")) return;

    try {
      await axios.delete(https://back-qhore.ondigitalocean.app
/api/properties/${id});
      toast({ title: "Supprimé", description: "Bien supprimé avec succès." });
      fetchProperties();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  }; 
  return (
    <AdminLayout title="Biens d’investissement">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              activeView === "biens"
                ? "Rechercher un bien..."
                : activeView === "offres"
                ? "Rechercher une offre exclusive..."
                : "Rechercher une demande de conseiller..."
            }
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white pl-10 pr-10 w-full transition-all duration-200 bg-white focus:ring-2 focus:ring-luxe-blue/20 focus:border-luxe-blue focus:shadow-[0_0_0_2px_rgba(10,37,64,0.05)] focus:scale-[1.01] cursor-text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {canCreate && (
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bien
            </Button>
          )}
          {canCreateOffers && (
            <Button
              onClick={() => setExclusiveDialogOpen(true)}
              className="bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une offre exclusive
            </Button>
          )}
        </div>
      </div>
      <div className="flex mb-4">
        <div className="flex space-x-2 border p-1 rounded-md bg-white dark:bg-gray-800 shadow-sm">
          <Button
            onClick={() => setActiveView("biens")}
            className={`flex items-center gap-2 transition-all ${
              activeView === "biens"
                ? "bg-gold text-white hover:bg-gold-dark"
                : "bg-white text-black hover:bg-gray-100 border border-transparent"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Biens à investir</span>
          </Button>

          <Button
            onClick={() => setActiveView("offres")}
            className={`flex items-center gap-2 transition-all ${
              activeView === "offres"
                ? "bg-gold text-white hover:bg-gold-dark"
                : "bg-white text-black hover:bg-gray-100 border border-transparent"
            }`}
          >
            <BadgePercent className="h-4 w-4" />
            <span className="hidden sm:inline">Offres exclusives</span>
          </Button>
          <Button
            onClick={() => setActiveView("demandes")} // Définit la vue sur 'demandes'
            className={`flex items-center gap-2 transition-all ${
              activeView === "demandes"
                ? "bg-gold text-white hover:bg-gold-dark"
                : "bg-white text-black hover:bg-gray-100 border border-transparent"
            }`}
          >
            <Users className="h-4 w-4" />{" "}
            {/* Importez l'icône Users de lucide-react */}
            <span className="hidden sm:inline">Demandes de conseiller</span>
          </Button>
          <Button
            onClick={() => setActiveView("experts")}
            className={`flex items-center gap-2 transition-all ${
              activeView === "experts"
                ? "bg-gold text-white hover:bg-gold-dark"
                : "bg-white text-black hover:bg-gray-100 border border-transparent"
            }`}
          >
            <Users className="h-4 w-4" />{" "}
            {/* Or a more suitable icon for experts */}
            <span className="hidden sm:inline">Demandes d'expert</span>
          </Button>
        </div>
      </div>

      {activeView === "biens" &&
        (hasAnyPermission ? (
          <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Les biens à investir
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Gérez les biens à investir
              </CardDescription>
            </CardHeader>
            <CardContent className="animate-in fade-in-50 duration-300">
              <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                      <TableHead className="w-[100px] text-left text-gray-700 dark:text-gray-300">
                        ID
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Bien
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Ville
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Type d'investissement
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Statut projet
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Prix
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Prix entrée
                      </TableHead>
                      <TableHead className="text-left text-gray-700 dark:text-gray-300">
                        Superficie
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-300 pr-28">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProperties.length > 0 ? (
                      sortedProperties.map((property) => (
                        <TableRow
                          key={property.id}
                          className="dark:hover:bg-gray-700"
                        >
                          {/* ✅ Colonne "Bien" avec Image + Titre aligné */}
                          <TableCell>{property.id}</TableCell>

                      <TableCell>
  <div className="flex items-center gap-3">
    {property.images?.[0] ? (
      <img
        src={property.images[0]}
        alt={property.title}
        className="h-12 w-12 object-cover rounded-md flex-shrink-0"
      />
    ) : (
      <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
        —
      </div>
    )}
    <div className="truncate max-w-[120px]">
      <span className="font-medium truncate">
        {property.title.length > 30
          ? property.title.slice(0, 30) + "..."
          : property.title}
      </span>
    </div>
  </div>
</TableCell>



                          {/* ✅ Colonne Ville avec Espacement */}
                          <TableCell className="pl-12">
                            {property.location}
                          </TableCell>

                          <TableCell>
                            {property.investmentDetails?.investmentType || "—"}
                          </TableCell>
                          <TableCell>
                            {property.investmentDetails?.projectStatus || "—"}
                          </TableCell>
                          <TableCell>
                            {property.price ? `${property.price} MAD` : "—"}
                          </TableCell>
                          <TableCell>
                            {property.investmentDetails?.minEntryPrice
                              ? `${property.investmentDetails.minEntryPrice} MAD`
                              : "—"}
                          </TableCell>
                          <TableCell>
                            {property.area ? `${property.area} m²` : "—"}
                          </TableCell>

                          {/* ✅ Actions */}
                          <TableCell className="text-left">
                            <div className="flex justify-start items-center space-x-3">
                              {canView && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    navigate(
                                      `/admin/investissements/${property.id}`
                                    )
                                  }
                                  title="Voir"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {canEdit && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    navigate(
                                      `/admin/investissements/edit/${property.id}`
                                    )
                                  }
                                  className="flex items-center gap-1 text-amber-600 hover:text-amber-800 
                    dark:text-amber-500 dark:hover:text-amber-400 
                    transition-colors"
                                  title="Modifier"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setBienToDelete(property.id);
                                    setDeleteConfirmOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-gray-500 py-6"
                        >
                          Aucun bien à investir disponible pour le moment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Accès refusé</h2>
              <p className="text-gray-600">
                Vous n'avez pas la permission de voir les biens
                d'investissement.
              </p>
              <Button onClick={() => navigate("/admin")}>
                Retour au tableau de bord
              </Button>
            </div>
          </div>
        ))}
      {activeView === "offres" &&
        (hasAnyPermissionOffers ? (
          <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">
                Les offres exclusives
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                {" "}
                Liste des offres immobilières à rendement prioritaire.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
                <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <TableHeader className="bg-gray-100 dark:bg-gray-700">
                    <TableRow>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Id
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Bien
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Valeur actuelle (MAD)
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Investissement initial
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Revenu locatif (MAD)
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Croissance annuelle (%)
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Durée (ans)
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        Rendement brut estimé
                      </TableHead>
                      <TableHead className="text-center text-gray-700 dark:text-gray-300 pr-34">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredExclusiveOffers.map((offer) => (
                      <TableRow
                        key={offer.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {offer.id}
                        </TableCell>
                        <TableCell>
                          {offer.property?.title
                            ? offer.property.title.length > 5
                              ? offer.property.title.slice(0, 5) + "..."
                              : offer.property.title
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {Number(offer.current_value).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {Number(offer.initial_investment).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {Number(offer.monthly_rental_income).toLocaleString()}
                        </TableCell>
                        <TableCell>{offer.annual_growth_rate}%</TableCell>
                        <TableCell>{offer.duration_years} ans</TableCell>
                        <TableCell>
                          {(
                            (offer.monthly_rental_income *
                              12 *
                              offer.duration_years +
                              offer.current_value *
                                (offer.annual_growth_rate / 100) *
                                offer.duration_years) /
                            offer.initial_investment
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex justify-start items-center space-x-3">
                            {(canViewOffers ||
                              canEditOffers ||
                              canDeleteOffers) && (
                              <div className="flex justify-end gap-2">
                                {canViewOffers && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      navigate(
                                        `/admin/offres-exclusives/${offer.id}`
                                      )
                                    }
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    title="Voir les détails"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}

                                {canEditOffers && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      navigate(
                                        `/admin/offres-exclusives/edit/${offer.id}`
                                      )
                                    }
                                    className="flex items-center gap-1 text-amber-600 hover:text-amber-800 
                    dark:text-amber-500 dark:hover:text-amber-400 
                    transition-colors"
                                    title="Modifier l'offre"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                )}

                                {canDeleteOffers && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedOfferId(Number(offer.id)); // conversion explicite
                                      setDeleteConfirmOpen(true);
                                    }}
                                    title="Supprimer"
                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {exclusiveOffers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center text-gray-500 py-4"
                        >
                          Aucune offre exclusive pour le moment.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-[60vh] text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Accès refusé</h2>
              <p className="text-gray-600">
                Vous n'avez pas la permission de voir les offres exclusives.
              </p>
            </div>
          </div>
        ))}
      {activeView === "demandes" && (
        <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Demandes de Conseiller
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Liste des demandes de prise de contact pour un conseiller.
            </CardDescription>
            <div className="flex gap-2 mt-4 dark:text-black">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                Toutes
              </Button>
              <Button
                variant={statusFilter === "new" ? "default" : "outline"}
                onClick={() => setStatusFilter("new")}
              >
                Nouvelles
              </Button>
              <Button
                variant={statusFilter === "in_progress" ? "default" : "outline"}
                onClick={() => setStatusFilter("in_progress")}
              >
                En cours
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                onClick={() => setStatusFilter("completed")}
              >
                Terminées
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="w-[80px] text-left text-gray-700 dark:text-gray-300">
                      ID
                    </TableHead>
                    <TableHead className="w-[80px] text-left text-gray-700 dark:text-gray-300">
                      ID Bien
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Nom
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Email
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Téléphone
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Statut
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Date
                    </TableHead>
                    <TableHead className="text-center pr-10 text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAdvisorRequests.length > 0 ? (
                    filteredAdvisorRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="font-medium">
                          {request.id}
                        </TableCell>
                        <TableCell>{request.property_id || "—"}</TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.phone}</TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              request.status === "new"
                                ? "default"
                                : request.status === "in_progress"
                                ? "secondary"
                                : request.status === "completed"
                                ? "outline"
                                : "destructive"
                            }
                            className={
                              request.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : ""
                            }
                          >
                            {request.status === "new"
                              ? "Nouveau"
                              : request.status === "in_progress"
                              ? "En cours"
                              : request.status === "completed"
                              ? "Terminé"
                              : request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex justify-start items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(request)}
                              title="Modifier"
                              className="text-amber-600 hover:text-amber-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setAdvisorRequestToDelete(request.id);
                                setDeleteConfirmOpen(true);
                              }}
                              title="Supprimer"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-gray-500 py-4"
                      >
                        Aucune demande de conseiller disponible pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      {activeView === "experts" && (
        <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Demandes d'Expert
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Liste des demandes de contact pour des experts.
            </CardDescription>
            {/* Add status filters here if applicable for expert requests */}
          </CardHeader>
          <CardContent>
            <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="w-[80px] text-left text-gray-700 dark:text-gray-300">
                      ID
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Nom
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Email
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Téléphone
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Message
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Date RDV
                    </TableHead>
                    <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Expert
                    </TableHead>
                     <TableHead className="text-left text-gray-700 dark:text-gray-300">
                      Type de Service 
                    </TableHead>
                    <TableHead className="text-center pr-10 text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExpertRequests.length > 0 ? (
                    filteredExpertRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <TableCell className="font-medium">
                          {request.id}
                        </TableCell>
                        <TableCell>{request.name}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.phone}</TableCell>
                        <TableCell>
                          {request.message.length > 50
                            ? request.message.slice(0, 50) + "..."
                            : request.message}
                        </TableCell>
                        <TableCell>
                          {request.preferred_date
                            ? new Date(
                                request.preferred_date
                              ).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>{request.expert || "—"}</TableCell>
                        <TableCell>{request.service_type || "—"}</TableCell>
                        <TableCell className="text-left">
                          <div className="flex justify-start items-center space-x-3">
                            <Button
  variant="ghost"
  size="icon"
  onClick={() => {
    setSelectedExpert(request); // request contient les données de l'expert actuel
    setEditOpen(true);
  }}
  title="Modifier"
  className="text-amber-600 hover:text-amber-800"
>
  <Pencil className="h-4 w-4" />
</Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setExpertRequestToDelete(request.id);
                                setDeleteConfirmOpen(true);
                              }}
                              title="Supprimer"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center text-gray-500 py-4"
                      >
                        Aucune demande d'expert disponible pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      <ExpertEditForm
  open={editOpen}
  onOpenChange={setEditOpen}
  initialData={selectedExpert ? {
    id: selectedExpert.id,
    name: selectedExpert.name,
    email: selectedExpert.email,
    phone: selectedExpert.phone,
    message: selectedExpert.message,
    preferred_date: selectedExpert.preferred_date || '',
    expert: selectedExpert.expert || '',
  } : null}
  onSave={async (updatedData) => {
    try {
      // Mise à jour via l'API
      await axios.put(`https://back-qhore.ondigitalocean.app
/api/expert-contacts/${updatedData.id}`, updatedData);
      
      // Rafraîchir la liste
      fetchExpertRequests();
      
      // Afficher un message de succès
      toast({
        title: 'Succès',
        description: "Les informations de l'expert ont été mises à jour.",
      });
      
      // Fermer le dialogue
      setEditOpen(false);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: 'destructive',
      });
    }
  }}
/>
      {/* Edit Dialog */}
      <ConseillerForm
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        contactId={selectedContact?.id}
        initialData={selectedContact}
        onSuccess={() => {
          fetchAdvisorRequests();
          setIsEditModalOpen(false);
        }}
      />

      <AddInvestmentDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onPropertyAdded={() => {
          fetchProperties();
          toast({ title: "Ajouté", description: "Bien ajouté avec succès" });
        }}
      />

      <ExclusiveOfferDialog
        open={exclusiveDialogOpen}
        onOpenChange={setExclusiveDialogOpen}
        onOfferAdded={() => {}}
      />
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="
      bg-white dark:bg-gray-800
      text-black dark:text-gray-100
      border border-gray-300 dark:border-gray-700
      rounded-md shadow-lg
      p-6
    ">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteConfirmOpen(false);
                setBienToDelete(null);
                setSelectedOfferId(null); // Keep selectedOfferId if you're using it
                setAdvisorRequestToDelete(null);
                setExpertRequestToDelete(null); // Clear expert request ID
              }}
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
              onClick={() => {
                if (bienToDelete) {
                  handleDeleteProperty(bienToDelete as string);
                } else if (selectedOfferId !== null) {
                  handleDeleteExclusiveOffer(selectedOfferId.toString());
                } else if (advisorRequestToDelete) {
                  handleDeleteAdvisorRequest(advisorRequestToDelete);
                } else if (expertRequestToDelete) {
                  // Handle expert request deletion
                  handleDeleteExpertRequest(expertRequestToDelete);
                }
              }}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminInvestissements;
