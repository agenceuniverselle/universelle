import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { Property } from '@/context/PropertiesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, TrendingUp, Briefcase, Luggage, Home, SlidersHorizontal } from 'lucide-react';
import InvestmentCard from '@/components/properties/InvestmentCard';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

// Cache global pour éviter les appels répétés
let propertiesCache: Property[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const Investir = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [returnFilter, setReturnFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction de parsing optimisée
  const parseRate = useCallback((rateStr: string) => {
    return parseFloat(rateStr?.replace('%', '') || '0') || 0;
  }, []);

  // Chargement optimisé avec cache
useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await axios.get('https://back-qhore.ondigitalocean.app/api/properties');

      const data = response.data?.data || [];

      propertiesCache = data;
      cacheTimestamp = Date.now();
      setProperties(data);
    } catch (err) {
      setError("Erreur lors du chargement des propriétés");
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);

  // Filtrage ultra-optimisé
  const filteredProperties = useMemo(() => {
    if (!properties.length) return [];

    const searchLower = searchTerm.toLowerCase();
    
    return properties.filter((property) => {
      // Early returns pour optimiser
      if (searchTerm && !(
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      )) {
        return false;
      }

      if (typeFilter !== 'all' && property.investmentDetails?.investmentType !== typeFilter) {
        return false;
      }

      if (statusFilter !== 'all' && property.investmentDetails?.projectStatus !== statusFilter) {
        return false;
      }

      if (returnFilter !== 'all') {
        const rate = parseRate(property.investmentDetails?.returnRate || property.return || '0%');
        if (
          (returnFilter === 'low' && rate > 7) ||
          (returnFilter === 'medium' && (rate <= 7 || rate > 9)) ||
          (returnFilter === 'high' && rate <= 9)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [properties, searchTerm, returnFilter, typeFilter, statusFilter, parseRate]);

  const getInvestmentTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'Résidentiel': return <Home className="h-4 w-4" />;
      case 'Commercial': return <Briefcase className="h-4 w-4" />;
      case 'Touristique': return <Luggage className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  }, []);

  // Debounce pour la recherche
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Utiliser le terme débounced pour le filtrage
  const finalFilteredProperties = useMemo(() => {
    if (!properties.length) return [];

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return properties.filter((property) => {
      if (debouncedSearchTerm && !(
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower)
      )) {
        return false;
      }

      if (typeFilter !== 'all' && property.investmentDetails?.investmentType !== typeFilter) {
        return false;
      }

      if (statusFilter !== 'all' && property.investmentDetails?.projectStatus !== statusFilter) {
        return false;
      }

      if (returnFilter !== 'all') {
        const rate = parseRate(property.investmentDetails?.returnRate || property.return || '0%');
        if (
          (returnFilter === 'low' && rate > 7) ||
          (returnFilter === 'medium' && (rate <= 7 || rate > 9)) ||
          (returnFilter === 'high' && rate <= 9)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [properties, debouncedSearchTerm, returnFilter, typeFilter, statusFilter, parseRate]);

  const activeFiltersCount = [returnFilter, typeFilter, statusFilter].filter(f => f !== 'all').length;

  // Skeleton loader pour un affichage immédiat
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border shadow-sm p-6 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4 md:px-6 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Opportunités d'Investissement</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Découvrez notre sélection d'opportunités d'investissement immobilier à travers le Maroc.
            Des projets résidentiels, commerciaux et touristiques soigneusement sélectionnés pour optimiser votre rendement.
          </p>
        </div>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par titre, emplacement ou description..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-in fade-in-0 zoom-in-95 duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taux de rentabilité</label>
                <Select value={returnFilter} onValueChange={setReturnFilter}>
                  <SelectTrigger><SelectValue placeholder="Tous les taux" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les taux</SelectItem>
                    <SelectItem value="low">Jusqu'à 7%</SelectItem>
                    <SelectItem value="medium">7% - 9%</SelectItem>
                    <SelectItem value="high">Plus de 9%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type d'investissement</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="Tous les types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Résidentiel">
                      <div className="flex items-center"><Home className="h-4 w-4 mr-2" />Résidentiel</div>
                    </SelectItem>
                    <SelectItem value="Commercial">
                      <div className="flex items-center"><Briefcase className="h-4 w-4 mr-2" />Commercial</div>
                    </SelectItem>
                    <SelectItem value="Touristique">
                      <div className="flex items-center"><Luggage className="h-4 w-4 mr-2" />Touristique</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut du projet</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Pré-commercialisation">Pré-commercialisation</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </div>
        ) : finalFilteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucune opportunité d'investissement trouvée</h3>
            <p className="mt-2 text-gray-500">
              {properties.length === 0 ? 'Aucune propriété disponible.' : 'Essayez de modifier vos filtres.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {finalFilteredProperties.length} opportunité{finalFilteredProperties.length > 1 ? 's' : ''} trouvée{finalFilteredProperties.length > 1 ? 's' : ''}
                {properties.length > finalFilteredProperties.length && ` sur ${properties.length}`}
              </p>
              <div className="flex gap-2 flex-wrap">
                {typeFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getInvestmentTypeIcon(typeFilter)} {typeFilter}
                  </Badge>
                )}
                {returnFilter !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {returnFilter === 'low' ? 'Jusqu\'à 7%' : returnFilter === 'medium' ? '7-9%' : 'Plus de 9%'}
                  </Badge>
                )}
                {statusFilter !== 'all' && <Badge variant="secondary">{statusFilter}</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {finalFilteredProperties.map((property) => (
                <InvestmentCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Investir;
