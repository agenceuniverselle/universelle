import React, { useEffect, useMemo, useState, useCallback } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import BienCard from '@/components/properties/BienCard';
import { Bien } from '@/context/BiensContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

// Cache global pour éviter les appels répétés
let biensCache: Bien[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const NosBiens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Chargement optimisé avec cache
  useEffect(() => {
    const fetchBiens = async () => {
      try {
        // Vérifier le cache d'abord
        const now = Date.now();
        if (biensCache && (now - cacheTimestamp) < CACHE_DURATION) {
          setBiens(biensCache);
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/biens');
        const data = response.data.data || [];
        
        // Mettre à jour le cache
        biensCache = data;
        cacheTimestamp = now;
        
        setBiens(data);
      } catch (err) {
        setError('Erreur lors du chargement des biens');
      } finally {
        setLoading(false);
      }
    };

    fetchBiens();
  }, []);

  // Filtrage des biens non-draft optimisé
  const regularBiens = useMemo(() => 
    biens.filter(bien => !bien.isDraft), 
    [biens]
  );

  // Extraction des options pour les filtres (mémorisée)
  const { locations, types } = useMemo(() => ({
    locations: [...new Set(regularBiens.map(bien => bien.location.split(',')[0].trim()))],
    types: [...new Set(regularBiens.map(bien => bien.type))]
  }), [regularBiens]);

  // Fonction de parsing du prix optimisée
  const parsePrice = useCallback((priceString: string) => {
    return parseFloat(priceString.replace(/[^\d]/g, '')) || 0;
  }, []);

  // Filtrage ultra-optimisé
  const filteredProperties = useMemo(() => {
    if (!regularBiens.length) return [];

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return regularBiens.filter(bien => {
      // Early returns pour optimiser
      if (debouncedSearchTerm && !(
        bien.title.toLowerCase().includes(searchLower) ||
        bien.location.toLowerCase().includes(searchLower) ||
        bien.description?.toLowerCase().includes(searchLower)
      )) {
        return false;
      }

      if (typeFilter !== 'all' && bien.type !== typeFilter) {
        return false;
      }

      if (locationFilter !== 'all' && !bien.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      if (priceFilter !== 'all') {
        const price = parsePrice(bien.price);
        if (
          (priceFilter === 'lowToHigh' && price > 3_000_000) ||
          (priceFilter === 'midRange' && (price <= 3_000_000 || price > 6_000_000)) ||
          (priceFilter === 'highToLow' && price <= 6_000_000)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [regularBiens, debouncedSearchTerm, priceFilter, typeFilter, locationFilter, parsePrice]);

  const activeFiltersCount = [priceFilter, typeFilter, locationFilter].filter(f => f !== 'all').length;

  // Skeleton loader pour un affichage immédiat
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="sticky top-24 z-40 bg-white/95 backdrop-blur-sm shadow-sm py-4 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-in fade-in-0 zoom-in-95 duration-200">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Gamme de prix</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger><SelectValue placeholder="Tous les prix" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les prix</SelectItem>
                    <SelectItem value="lowToHigh">Jusqu'à 3M MAD</SelectItem>
                    <SelectItem value="midRange">3M - 6M MAD</SelectItem>
                    <SelectItem value="highToLow">6M+ MAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type de bien</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="Tous les types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Emplacement</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger><SelectValue placeholder="Tous les emplacements" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les emplacements</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-6 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun bien trouvé</h3>
            <p className="mt-2 text-gray-500">
              {regularBiens.length === 0 ? 'Aucun bien disponible.' : 'Aucun bien ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
                {regularBiens.length > filteredProperties.length && ` sur ${regularBiens.length}`}
              </p>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setPriceFilter('all');
                    setTypeFilter('all');
                    setLocationFilter('all');
                    setSearchTerm('');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((bien) => (
                <BienCard key={bien.id} bien={bien} />
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NosBiens;