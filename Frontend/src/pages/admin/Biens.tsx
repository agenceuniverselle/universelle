import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreHorizontal, Plus, Search, Building, Filter, Loader2, X, MapPin, Coins , Home, Calendar, Check, Eye, Pencil, Trash, FileText, FileDown, Printer, Download, AlertCircle, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { exportToXlsx , exportToPdf, printProperties } from '@/utils/exportUtils';
import { Bien, useBiens } from '@/context/BiensContext';
import { Property } from '@/context/PropertiesContext';
import AddPropertyDialog from '@/components/properties/AddBienDialog';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // ✅ Importer AuthContext

const AdminBiens = () => {
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [bienToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState<'csv' | 'pdf' | 'print' | 'xlsx' | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishPropertyId, setPublishPropertyId] = useState<string | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const { permissions } = useAuth(); // ✅ Récupérer les permissions de l'utilisateur connecté

  const { biens: properties, loading, error, removeBien: removeProperty, publishBien: publishProperty } = useBiens();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredProperties, setFilteredProperties] = useState<Bien[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    city: '',
  });

  // ✅ Permissions
  const canViewProperties = permissions.includes("view_properties");
  const canCreateProperties = permissions.includes("create_properties");
  const canEditProperties = permissions.includes("edit_properties");
  const canDeleteProperties = permissions.includes("delete_properties");
  const canExportProperties = permissions.includes("export_properties");
  useEffect(() => {
    let filtered = [...properties];
    
    if (activeTab !== 'all') {
      const statusMap: Record<string, string | boolean> = {
        'available': 'Disponible',
        'reserved': 'Réservé',
        'sold': 'Vendu',
        'draft': true
      };

      if (activeTab === 'draft') {
        filtered = filtered.filter(bien => bien.isDraft === statusMap[activeTab]);
      } else {
        filtered = filtered.filter(bien => 
          bien.status === statusMap[activeTab] && !bien.isDraft
        );
      }
    }
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(bien => 
        String(bien.id).toLowerCase().includes(lowercasedTerm) ||
        bien.title.toLowerCase().includes(lowercasedTerm) ||
        bien.location.toLowerCase().includes(lowercasedTerm) ||
        bien.type.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(bien => bien.type === filters.type);
    }
    
    if (filters.city) {
      filtered = filtered.filter(bien => bien.location.includes(filters.city));
    }
    
    if (filters.minBedrooms) {
      filtered = filtered.filter(bien => {
        const bedroomCount = typeof bien.bedrooms === 'string' 
          ? parseInt(bien.bedrooms, 10) 
          : bien.bedrooms;
        
        return !isNaN(bedroomCount) && bedroomCount >= parseInt(filters.minBedrooms);
      });
    }
    
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(bien => {
        const numPrice = parseInt(bien.price.replace(/[^\d]/g, ''));
        if (filters.minPrice && filters.maxPrice) {
          return numPrice >= parseInt(filters.minPrice) && numPrice <= parseInt(filters.maxPrice);
        } else if (filters.minPrice) {
          return numPrice >= parseInt(filters.minPrice);
        } else if (filters.maxPrice) {
          return numPrice <= parseInt(filters.maxPrice);
        }
        return true;
      });
    }
    
    setFilteredProperties(filtered);
  }, [properties, activeTab, searchTerm, filters]);

 useEffect(() => {
  let filtered = properties.map((bien) => ({
    ...bien,
    bedrooms: typeof bien.bedrooms === 'string' ? parseInt(bien.bedrooms) : bien.bedrooms,
    bathrooms: typeof bien.bathrooms === 'string' ? parseInt(bien.bathrooms) : bien.bathrooms,
  }));

  if (activeTab !== 'all') {
    const statusMap: Record<string, string | boolean> = {
      'available': 'Disponible',
      'reserved': 'Réservé',
      'sold': 'Vendu',
      'draft': true,
    };

    if (activeTab === 'draft') {
      filtered = filtered.filter((bien) => bien.isDraft === statusMap[activeTab]);
    } else {
      filtered = filtered.filter(
        (bien) => bien.status === statusMap[activeTab] && !bien.isDraft
      );
    }
  }

  if (searchTerm) {
    const lowercasedTerm = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (bien) =>
        String(bien.id).toLowerCase().includes(lowercasedTerm) ||
        bien.title.toLowerCase().includes(lowercasedTerm) ||
        bien.location.toLowerCase().includes(lowercasedTerm) ||
        bien.type.toLowerCase().includes(lowercasedTerm)
    );
  }

  setFilteredProperties(filtered);
}, [properties, activeTab, searchTerm, filters]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const selectSearchResult = (result: Property) => {
    setSearchTerm(result.title);
    setShowSearchResults(false);
    
    if (!recentSearches.includes(result.title)) {
      const newRecentSearches = [result.title, ...recentSearches].slice(0, 5);
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentPropertySearches', JSON.stringify(newRecentSearches));
    }
  };

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentPropertySearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const contentElement = document.querySelector('.bien-content');
    if (contentElement) {
      contentElement.classList.remove('animate-in');
      void (contentElement as HTMLElement).offsetWidth; // Fix: Cast to HTMLElement to access offsetWidth
      contentElement.classList.add('animate-in');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      city: '',
    });
    setAdvancedFiltersOpen(false);
  };

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status: string, isDraft: boolean = false) => {
    if (isDraft) {
      return 'bg-amber-100 text-amber-800';
    }
    
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Réservé':
        return 'bg-blue-100 text-blue-800';
      case 'Vendu':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (bien: Property) => {
    if (bien.isDraft) {
      return "Brouillon";
    }
    return bien.status;
  };

  const handleAddProperty = () => {
    setIsAddingProperty(true);
    setTimeout(() => {
      setIsAddingProperty(false);
      setAddPropertyOpen(true);
    }, 300);
  };

  const handlePropertyAdded = (bienId: string) => {
    setAddPropertyOpen(false);
    toast({
      title: "Bien ajouté avec succès",
      description: "Vous pouvez maintenant le voir dans la liste des biens",
      variant: "default",
    });
  };

  const handleViewDetails = (bienId: string) => {
    const rowElement = document.getElementById(`bien-row-${bienId}`);
    if (rowElement) {
      rowElement.classList.add('bg-blue-50', 'transition-colors', 'duration-300');
    }
    
    setTimeout(() => {
      navigate(`/admin/biens/${bienId}`);
    }, 150);
  };

  const handleEditProperty = (bienId: string) => {
    toast({
      title: "Mode édition",
      description: "Chargement du formulaire d'édition...",
      variant: "default",
    });
    
    setTimeout(() => {
      navigate(`/admin/biens/edit/${bienId}`);
    }, 300);
  };

  const confirmDelete = (bienId: string) => {
    setPropertyToDelete(bienId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteProperty = async (id: string | null) => {
    if (!id) return;
  
    try {
      setIsDeleting(true);
  
      const token = localStorage.getItem("access_token"); // ✅ Récupération du token
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
      setPropertyToDelete(null);
      removeProperty(id);
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
  
  const confirmPublish = (bienId: string) => {
    setPublishPropertyId(bienId);
    setPublishConfirmOpen(true);
  };

  const handlePublishProperty = () => {
    if (!publishPropertyId) return;
    
    setIsPublishing(true);
    
    setTimeout(() => {
      publishProperty(publishPropertyId);
      
      setIsPublishing(false);
      setPublishConfirmOpen(false);
      
      toast({
        title: "Bien publié",
        description: "Le bien est maintenant visible sur le site",
        variant: "default",
      });
      
      // Redirection vers la page d'édition
      setTimeout(() => {
        navigate(`/admin/biens/edit/${publishPropertyId}`);
      }, 300);
      
      setPublishPropertyId(null);
    }, 500);
  };
  const handleExportPDF = () => {
    setIsExporting('pdf');
  
    setTimeout(() => {
      try {
        exportToPdf(filteredProperties);
        toast({
          title: "Export PDF",
          description: "Fichier PDF généré avec succès",
          variant: "default",
        });
      } catch (error) {
        console.error("Erreur export PDF :", error);
        toast({
          title: "Erreur",
          description: "Impossible de générer le fichier PDF",
          variant: "destructive",
        });
      } finally {
        setIsExporting(null);
      }
    }, 300);
  };
  
  const handleExportExcel = () => {
    setIsExporting('xlsx');
  
    setTimeout(() => {
      try {
        exportToXlsx(filteredProperties);
        toast({
          title: "Export Excel",
          description: "Fichier .xlsx généré avec succès",
        });
      } catch (error) {
        console.error("Erreur export XLSX :", error);
        toast({
          title: "Erreur",
          description: "Impossible de générer le fichier Excel",
          variant: "destructive",
        });
      } finally {
        setIsExporting(null);
      }
    }, 300);
  };
  const handlePrint = () => {
    setIsExporting('print');
    
    setTimeout(() => {
      try {
        printProperties(filteredProperties);
        toast({
          title: "Impression",
          description: "Page d'impression ouverte",
          variant: "default",
        });
      } catch (error) {
        console.error("Error preparing print view:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la préparation de l'impression",
          variant: "destructive",
        });
      } finally {
        setIsExporting(null);
      }
    }, 500);
  };
  if (!canViewProperties) {
    return (
      <AdminLayout title="Accès refusé">
        <div className="flex items-center justify-center h-[60vh] text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Accès refusé</h2>
            <p className="text-gray-600">
              Vous n'avez pas la permission de voir les biens immobiliers.
            </p>
            <Button onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des biens immobiliers">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center w-full space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative w-full md:w-96 group">
  <Popover open={showSearchResults && isSearchFocused} onOpenChange={setShowSearchResults}>
    <PopoverTrigger asChild>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-luxe-blue transition-colors duration-200" />
        <Input 
          placeholder="Rechercher par titre, ID, type ou lieu..." 
          className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white pl-10 pr-10 w-full transition-all duration-200 bg-white focus:ring-2 focus:ring-luxe-blue/20 focus:border-luxe-blue focus:shadow-[0_0_0_2px_rgba(10,37,64,0.05)] focus:scale-[1.01] cursor-text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
         // onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </PopoverTrigger>
    <PopoverContent className="p-0 w-[calc(100vw-24px)] md:w-[26rem] shadow-lg animate-in fade-in-0 zoom-in-95">
      <Command>
        <CommandList>
          {searchResults.length > 0 ? (
            <CommandGroup heading="Résultats">
              {searchResults.map((result) => (
                <CommandItem 
                  key={result.id} 
                  onSelect={() => selectSearchResult(result)}
                  className="flex items-center gap-2 py-3 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <Building className="h-4 w-4 text-gray-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{result.title}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {result.location}
                    </span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(result.status, result.isDraft)}>
                    {getStatusDisplay(result)}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : searchTerm.length >= 2 ? (
            <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
          ) : recentSearches.length > 0 ? (
            <CommandGroup heading="Recherches récentes">
              {recentSearches.map((term, index) => (
                <CommandItem 
                  key={index} 
                  onSelect={() => setSearchTerm(term)}
                  className="flex items-center py-2 cursor-pointer"
                >
                  <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                  <span>{term}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>

  {/* ✅ ToggleGroup déplacé juste en dessous du champ de recherche */}
  <div className="mt-3 flex justify-start">
  <ToggleGroup
    type="single"
    value={activeTab}
    onValueChange={(value) => value && handleTabChange(value)}
    className="flex gap-3"
  >
    <ToggleGroupItem value="all" aria-label="Tous les biens" className="flex items-center gap-1">
      <Home className="h-4 w-4" />
      <span className="hidden sm:inline">Tous</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="draft" aria-label="Brouillons" className="flex items-center gap-1 text-amber-700">
      <AlertCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Brouillons</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="available" aria-label="Disponibles" className="flex items-center gap-1 text-green-700">
      <Check className="h-4 w-4" />
      <span className="hidden sm:inline">Disponibles</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="reserved" aria-label="Réservés" className="flex items-center gap-1 text-blue-700">
      <Calendar className="h-4 w-4" />
      <span className="hidden sm:inline">Réservés</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="sold" aria-label="Vendus" className="flex items-center gap-1 text-gray-400">
      <Coins className="h-4 w-4" />
      <span className="hidden sm:inline ">Vendus</span>
    </ToggleGroupItem>
  </ToggleGroup>
</div>
</div> 
</div>
{permissions.includes("create_properties") && (
  <Button            

    className={`bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600 ${isAddingProperty ? 'opacity-80 scale-95' : ''}`}
    onClick={handleAddProperty}
    disabled={isAddingProperty}
  >
    {isAddingProperty ? (
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
    ) : (
      <Plus className="h-4 w-4 mr-2" />
    )}
    Ajouter un bien
  </Button>
)}

        </div>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="mb-6 md:hidden">
          <TabsList className="w-full grid grid-cols-5">
            <TabsTrigger value="all" className="transition-all duration-200 hover:bg-gray-100 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm">Tous</TabsTrigger>
            <TabsTrigger value="draft" className="text-amber-700 transition-all duration-200 hover:bg-amber-50 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm">Brouillons</TabsTrigger>
            <TabsTrigger value="available" className="text-green-700 transition-all duration-200 hover:bg-green-50 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm">Disponibles</TabsTrigger>
            <TabsTrigger value="reserved" className="text-blue-700 transition-all duration-200 hover:bg-blue-50 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm">Réservés</TabsTrigger>
            <TabsTrigger value="sold" className="text-gray-700 transition-all duration-200 hover:bg-gray-50 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm">Vendus</TabsTrigger>
          </TabsList>
        </Tabs>
        {(searchTerm || Object.values(filters).some(v => v !== '') || activeTab !== 'all') && (
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <div>
              <span>{filteredProperties.length} bien{filteredProperties.length !== 1 ? 's' : ''} trouvé{filteredProperties.length !== 1 ? 's' : ''}</span>
              {(searchTerm || Object.values(filters).some(v => v !== '')) && (
                <Button variant="link" size="sm" onClick={resetFilters} className="text-luxe-blue p-0 h-auto ml-2">
                  Effacer tous les filtres
                </Button>
              )}
            </div>
          </div>
        )}
        <Card className="bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="dark:text-white">Liste des biens immobiliers</CardTitle>
                <CardDescription className="dark:text-gray-300" >Gérez votre portfolio de biens immobiliers</CardDescription>
              </div>
              {canEditProperties && (
 <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="outline" 
      size="sm"
      className="flex items-center gap-2 group transition-all duration-200 hover:scale-105 active:scale-95 dark:text-gray-100 dark:bg-gray-800 dark:border-gray-700"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-luxe-blue dark:text-white" />
          <span>Exportation...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4 group-hover:text-luxe-blue transition-colors dark:text-white" />
          <span>Exporter</span>
        </>
      )}
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="w-48 animate-in fade-in-0 zoom-in-95">
    <DropdownMenuLabel className="text-gray-700 dark:text-gray-200">Options d'export</DropdownMenuLabel>
    <DropdownMenuSeparator className="border-gray-200 dark:border-gray-600" />

    <DropdownMenuItem
      onClick={handleExportExcel}
      disabled={isExporting !== null}
      className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isExporting === 'xlsx' ? (
        <Loader2 className="h-4 w-4 animate-spin text-luxe-blue dark:text-white" />
      ) : (
        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
      )}
      <span>Exporter en Excel</span>
    </DropdownMenuItem>

    <DropdownMenuItem 
      onClick={handleExportPDF}
      disabled={isExporting !== null}
      className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isExporting === 'pdf' ? (
        <Loader2 className="h-4 w-4 animate-spin text-luxe-blue dark:text-white" />
      ) : (
        <FileDown className="h-4 w-4 text-red-600 dark:text-red-400" />
      )}
      <span>Exporter en PDF</span>
    </DropdownMenuItem>

    <DropdownMenuItem 
      onClick={handlePrint}
      disabled={isExporting !== null}
      className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {isExporting === 'print' ? (
        <Loader2 className="h-4 w-4 animate-spin text-luxe-blue dark:text-white" />
      ) : (
        <Printer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      )}
      <span>Imprimer</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


)}

            </div>
          </CardHeader>
          <CardContent className="bien-content animate-in fade-in-50 duration-300">
    <div className="rounded-md border dark:border-gray-700">
      <Table className="dark:text-gray-100">
      <TableHeader className="dark:bg-gray-700 dark:text-gray-200">
        <TableRow>
          <TableHead className="w-[100px] text-left text-gray-700 dark:text-gray-300">ID</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Bien</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Type</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Ville</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Quartier</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Prix</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Surface</TableHead>
          <TableHead className="text-left text-gray-700 dark:text-gray-300">Statut</TableHead>
          <TableHead className="text-center text-gray-700 dark:text-gray-300 pr-28">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredProperties.length > 0 ? (
          filteredProperties.map((bien) => (
            <TableRow key={bien.id} id={`bien-row-${bien.id}`}className="dark:hover:bg-gray-700">
              <TableCell className="font-medium">{bien.id}</TableCell>
              <TableCell className="flex items-center gap-4">
  <div className="flex items-center space-x-3 w-[100px]"> {/* ✅ Largeur fixe pour "Bien" */}
   {bien.images && bien.images.length > 0 ? (
  <img
    src={`https://back-qhore.ondigitalocean.app/${bien.images[0]}`}
    alt={bien.title}
    className="h-10 w-10 object-cover rounded-md"
  />
) : (
  <Building className="h-5 w-5 text-gray-500 dark:text-gray-300" />
)}

  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
  {bien.title.length > 5 ? bien.title.slice(0, 5) + "..." : bien.title}
</div>

  </div>
</TableCell>

<TableCell className="pl-0">{bien.type}</TableCell> {/* ✅ Espace entre "Bien" et "Type" */}

              <TableCell>{bien.location}</TableCell>
              <TableCell>{bien.quartier || '—'}</TableCell>
              <TableCell>{Number(bien.price).toLocaleString()} MAD</TableCell>
              <TableCell>{bien.area} m²</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(bien.status, bien.isDraft)}>
                  {getStatusDisplay(bien)}
                </Badge>
              </TableCell>
              <TableCell className="text-left">
  <div className="flex justify-start items-center space-x-3"> {/* ✅ Aligner les icônes à gauche */}
    {/* ✅ Voir les détails - Accessible à tous */}
    {permissions.includes("view_properties") && (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => handleViewDetails(bien.id)}
        title="Voir"
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <Eye className="h-4 w-4" />
      </Button>
    )}

    {/* ✅ Modifier - Visible avec permission */}
    {permissions.includes("edit_properties") && (
    <Button 
    variant="ghost" 
    size="icon"
    onClick={() => handleEditProperty(bien.id)}
    className="flex items-center gap-1 text-amber-600 hover:text-amber-800 
               dark:text-amber-500 dark:hover:text-amber-400 
               transition-colors"
    title="Modifier"
  >
    <Pencil className="h-4 w-4 text-amber-600 dark:text-amber-500" />
  </Button>
  
    )}

    {/* ✅ Supprimer - Visible avec permission */}
    {permissions.includes("delete_properties") && (
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => confirmDelete(bien.id)}
        className="text-red-600 hover:text-red-800 flex items-center gap-1"
        title="Supprimer"
      >
        <Trash className="h-4 w-4" />
      </Button>
    )}
  </div>
</TableCell>

            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              Aucun bien trouvé avec ces critères
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</CardContent>

        </Card>
      </div>

      <AddPropertyDialog 
        open={addPropertyOpen}
        onOpenChange={setAddPropertyOpen}
        onPropertyAdded={handlePropertyAdded}
      />

     <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
      <AlertDialogDescription>
        Êtes-vous sûr de vouloir supprimer ce bien immobilier ? Cette action est irréversible et toutes les données associées seront perdues.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="transition-all duration-200 hover:scale-105 text-gray-700 dark:text-balck hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-1">
        Annuler
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={() => handleDeleteProperty(bienToDelete)}
        className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:scale-105 rounded-md px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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


      <AlertDialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
        <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la publication</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir publier ce bien immobilier ?
              Il sera visible sur le site public et accessible à tous les visiteurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-all duration-200 hover:scale-105">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePublishProperty}
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publication...
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Oui, publier
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBiens;
