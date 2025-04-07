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
import { MoreHorizontal, Plus, Search, Building, Filter, Loader2, X, MapPin, Euro, Home, Calendar, Check, Eye, Pencil, Trash, FileText, FileDown, Printer, Download, AlertCircle, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddPropertyDialog from '@/components/properties/AddPropertyDialog';
import { toast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { exportToCsv, exportToPdf, printProperties } from '@/utils/exportUtils';
import { useProperties } from '@/context/PropertiesContext';

const AdminBiens = () => {
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState<'csv' | 'pdf' | 'print' | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishPropertyId, setPublishPropertyId] = useState<string | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const { properties, removeProperty, publishProperty } = useProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
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
        filtered = filtered.filter(property => property.isDraft === statusMap[activeTab]);
      } else {
        filtered = filtered.filter(property => 
          property.status === statusMap[activeTab] && !property.isDraft
        );
      }
    }
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.id.toLowerCase().includes(lowercasedTerm) ||
        property.title.toLowerCase().includes(lowercasedTerm) ||
        property.location.toLowerCase().includes(lowercasedTerm) ||
        property.type.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }
    
    if (filters.city) {
      filtered = filtered.filter(property => property.location.includes(filters.city));
    }
    
    if (filters.minBedrooms) {
      filtered = filtered.filter(property => {
        const bedroomCount = typeof property.bedrooms === 'string' 
          ? parseInt(property.bedrooms, 10) 
          : property.bedrooms;
        
        return !isNaN(bedroomCount) && bedroomCount >= parseInt(filters.minBedrooms);
      });
    }
    
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(property => {
        const numPrice = parseInt(property.price.replace(/[^\d]/g, ''));
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
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const results = properties.filter(property => 
      property.id.toLowerCase().includes(term) ||
      property.title.toLowerCase().includes(term) ||
      property.location.toLowerCase().includes(term) ||
      property.type.toLowerCase().includes(term)
    ).slice(0, 5);
    
    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchTerm, properties]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const selectSearchResult = (result: any) => {
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
    
    const contentElement = document.querySelector('.property-content');
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

  const getStatusDisplay = (property: any) => {
    if (property.isDraft) {
      return "Brouillon";
    }
    return property.status;
  };

  const handleAddProperty = () => {
    setIsAddingProperty(true);
    setTimeout(() => {
      setIsAddingProperty(false);
      setAddPropertyOpen(true);
    }, 300);
  };

  const handlePropertyAdded = (propertyId: string) => {
    setAddPropertyOpen(false);
    toast({
      title: "Bien ajouté avec succès",
      description: "Vous pouvez maintenant le voir dans la liste des biens",
      variant: "default",
    });
  };

  const handleViewDetails = (propertyId: string) => {
    const rowElement = document.getElementById(`property-row-${propertyId}`);
    if (rowElement) {
      rowElement.classList.add('bg-blue-50', 'transition-colors', 'duration-300');
    }
    
    setTimeout(() => {
      navigate(`/admin/biens/${propertyId}`);
    }, 150);
  };

  const handleEditProperty = (propertyId: string) => {
    toast({
      title: "Mode édition",
      description: "Chargement du formulaire d'édition...",
      variant: "default",
    });
    
    setTimeout(() => {
      navigate(`/admin/biens/edit/${propertyId}`);
    }, 300);
  };

  const confirmDelete = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteProperty = () => {
    if (!propertyToDelete) return;
    
    setIsDeleting(true);
    
    const rowElement = document.getElementById(`property-row-${propertyToDelete}`);
    if (rowElement) {
      rowElement.classList.add('opacity-50', 'scale-98', 'transition-all', 'duration-300');
    }
    
    setTimeout(() => {
      removeProperty(propertyToDelete);
      
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setPropertyToDelete(null);
      
      toast({
        title: "Bien supprimé",
        description: "Le bien a été supprimé avec succès",
        variant: "default",
      });
    }, 500);
  };

  const confirmPublish = (propertyId: string) => {
    setPublishPropertyId(propertyId);
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

  const handleExportCSV = () => {
    setIsExporting('csv');
    
    setTimeout(() => {
      try {
        exportToCsv(filteredProperties);
        toast({
          title: "Export CSV",
          description: "Fichier CSV généré avec succès",
          variant: "default",
        });
      } catch (error) {
        console.error("Error exporting to CSV:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'exportation",
          variant: "destructive",
        });
      } finally {
        setIsExporting(null);
      }
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
        console.error("Error exporting to PDF:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'exportation",
          variant: "destructive",
        });
      } finally {
        setIsExporting(null);
      }
    }, 500);
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
                      className="pl-10 pr-10 w-full transition-all duration-200 bg-white focus:ring-2 focus:ring-luxe-blue/20 focus:border-luxe-blue focus:shadow-[0_0_0_2px_rgba(10,37,64,0.05)] focus:scale-[1.01] cursor-text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
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
            </div>

            <Popover open={advancedFiltersOpen} onOpenChange={setAdvancedFiltersOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`${Object.values(filters).some(v => v !== '') ? 'bg-luxe-blue text-white hover:bg-luxe-blue/90' : ''} transition-colors duration-200 hover:scale-105 active:scale-95`}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Filtres avancés</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type de bien</label>
                    <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous types</SelectItem>
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Bureau">Bureau</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Riad">Riad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ville</label>
                    <Select value={filters.city} onValueChange={(value) => updateFilter('city', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes villes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes villes</SelectItem>
                        <SelectItem value="Casablanca">Casablanca</SelectItem>
                        <SelectItem value="Rabat">Rabat</SelectItem>
                        <SelectItem value="Marrakech">Marrakech</SelectItem>
                        <SelectItem value="Tanger">Tanger</SelectItem>
                        <SelectItem value="Agadir">Agadir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prix (MAD)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        value={filters.minPrice}
                        onChange={(e) => updateFilter('minPrice', e.target.value)}
                      />
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chambres (min)</label>
                    <Input 
                      type="number" 
                      placeholder="Nombre minimum" 
                      value={filters.minBedrooms}
                      onChange={(e) => updateFilter('minBedrooms', e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={resetFilters}>
                      Réinitialiser
                    </Button>
                    <Button size="sm" onClick={() => setAdvancedFiltersOpen(false)} className="bg-luxe-blue hover:bg-luxe-blue/90">
                      Appliquer
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="hidden md:flex md:ml-2">
              <ToggleGroup type="single" value={activeTab} onValueChange={value => value && handleTabChange(value)}>
                <ToggleGroupItem 
                  value="all" 
                  aria-label="Tous les biens" 
                  className="flex items-center gap-1 transition-all duration-200 hover:bg-gray-100 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Tous</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="draft" 
                  aria-label="Brouillons" 
                  className="flex items-center gap-1 transition-all duration-200 hover:bg-amber-50/80 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Brouillons</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="available" 
                  aria-label="Biens disponibles" 
                  className="flex items-center gap-1 transition-all duration-200 hover:bg-green-50/80 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Disponibles</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="reserved" 
                  aria-label="Biens réservés" 
                  className="flex items-center gap-1 transition-all duration-200 hover:bg-blue-50/80 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Réservés</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="sold" 
                  aria-label="Biens vendus" 
                  className="flex items-center gap-1 transition-all duration-200 hover:bg-gray-50/80 data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700 data-[state=active]:scale-[1.02] data-[state=active]:shadow-sm"
                >
                  <Euro className="h-4 w-4" />
                  <span className="hidden sm:inline">Vendus</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          <Button 
            className={`bg-luxe-blue hover:bg-luxe-blue/90 transition-all duration-300 ${isAddingProperty ? 'opacity-80 scale-95' : ''}`}
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
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Liste des biens immobiliers</CardTitle>
                <CardDescription>Gérez votre portfolio de biens immobiliers</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2 group transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-luxe-blue" />
                        <span>Exportation...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 group-hover:text-luxe-blue transition-colors" />
                        <span>Exporter</span>
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-in fade-in-0 zoom-in-95">
                  <DropdownMenuLabel>Options d'export</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleExportCSV}
                    disabled={isExporting !== null}
                    className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-100"
                  >
                    {isExporting === 'csv' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-luxe-blue" />
                    ) : (
                      <FileText className="h-4 w-4 text-green-600" />
                    )}
                    <span>Exporter en CSV</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleExportPDF}
                    disabled={isExporting !== null}
                    className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-100"
                  >
                    {isExporting === 'pdf' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-luxe-blue" />
                    ) : (
                      <FileDown className="h-4 w-4 text-red-600" />
                    )}
                    <span>Exporter en PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handlePrint}
                    disabled={isExporting !== null}
                    className="flex items-center gap-2 cursor-pointer transition-colors hover:bg-gray-100"
                  >
                    {isExporting === 'print' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-luxe-blue" />
                    ) : (
                      <Printer className="h-4 w-4 text-blue-600" />
                    )}
                    <span>Imprimer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="property-content animate-in fade-in-50 duration-300">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Bien</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <TableRow 
                        key={property.id} 
                        id={`property-row-${property.id}`}
                        className={`animate-in fade-in-50 duration-300 group ${property.isDraft ? 'bg-amber-50/30' : ''}`}
                      >
                        <TableCell className="font-medium">{property.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                              {property.image ? (
                                <img 
                                  src={property.image} 
                                  alt={property.title} 
                                  className="h-10 w-10 object-cover rounded-md"
                                />
                              ) : (
                                <Building className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {property.title}
                                {property.isDraft && (
                                  <span className="ml-2 text-xs text-amber-600 font-normal">
                                    (Brouillon)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {property.bedrooms > 0 ? `${property.bedrooms} ch, ` : ''}
                                {property.area}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.price}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(property.status, property.isDraft)}>
                            {getStatusDisplay(property)}
                          </Badge>
                        </TableCell>
                        <TableCell>{property.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {property.isDraft && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => confirmPublish(property.id)}
                                className="text-green-600 hover:text-green-800 hover:bg-green-50 transition-all duration-200 hover:scale-110"
                                title="Publier"
                              >
                                <Power className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewDetails(property.id)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 hover:scale-110"
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditProperty(property.id)}
                              className="text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition-all duration-200 hover:scale-110"
                              title="Modifier"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => confirmDelete(property.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 hover:scale-110"
                              title="Supprimer"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
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
        <AlertDialogContent className="animate-in fade-in-0 zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bien immobilier ?
              Cette action est irréversible et toutes les données associées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="transition-all duration-200 hover:scale-105">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProperty}
              className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:scale-105"
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
