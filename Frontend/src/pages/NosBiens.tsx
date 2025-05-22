import React, { useEffect, useMemo, useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import BienCard from '@/components/properties/BienCard';
import { Bien } from '@/context/BiensContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Search, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';

const NosBiens = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/biens')
      .then(res => {
        setBiens(res.data.data || []);
      })
      .catch(() => setError('Erreur lors du chargement des biens'))
      .finally(() => setLoading(false));
  }, []);

  const regularBiens = useMemo(() => biens.filter(bien => !bien.isDraft), [biens]);

  const locations = useMemo(() => [...new Set(regularBiens.map(bien => bien.location.split(',')[0].trim()))], [regularBiens]);
  const types = useMemo(() => [...new Set(regularBiens.map(bien => bien.type))], [regularBiens]);

  const filteredProperties = useMemo(() => {
    return regularBiens.filter(bien => {
      const textMatch = [bien.title, bien.location, bien.description || '']
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

      const price = parseFloat(bien.price.replace(/[^\d]/g, '')) || 0;
      const matchesPrice =
        priceFilter === 'all' ? true :
        priceFilter === 'lowToHigh' ? price <= 3_000_000 :
        priceFilter === 'midRange' ? price > 3_000_000 && price <= 6_000_000 :
        price > 6_000_000;

      const matchesType = typeFilter === 'all' || bien.type === typeFilter;
      const matchesLocation = locationFilter === 'all' || bien.location.toLowerCase().includes(locationFilter.toLowerCase());

      return textMatch && matchesPrice && matchesType && matchesLocation;
    });
  }, [regularBiens, searchTerm, priceFilter, typeFilter, locationFilter]);

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
            <Button variant="outline" className="w-full md:w-auto" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres
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
          <p className="text-center text-gray-500">Chargement des biens...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun bien trouvé</h3>
            <p className="mt-2 text-gray-500">
              Aucun bien ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
            </p>
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
