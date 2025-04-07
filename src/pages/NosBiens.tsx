import React, { useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import PropertyCard from '@/components/properties/PropertyCard';
import { useProperties } from '@/context/PropertiesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Building, MapPin, Filter, SlidersHorizontal } from 'lucide-react';

const NosBiens = () => {
  const { properties } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const regularProperties = properties.filter(property => 
    !property.isInvestment && 
    !property.isDraft
  );
  
  const locations = [...new Set(regularProperties.map(property => property.location.split(',')[0].trim()))];
  const types = [...new Set(regularProperties.map(property => property.type))];
  
  const filteredProperties = regularProperties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' ? true : 
      priceFilter === 'lowToHigh' ? parseFloat(property.price.replace(/[^\d]/g, '')) <= 3000000 :
      priceFilter === 'midRange' ? parseFloat(property.price.replace(/[^\d]/g, '')) > 3000000 && parseFloat(property.price.replace(/[^\d]/g, '')) <= 6000000 :
      parseFloat(property.price.replace(/[^\d]/g, '')) > 6000000;
    
    const matchesType = typeFilter === 'all' ? true : property.type === typeFilter;
    
    const matchesLocation = locationFilter === 'all' ? true : 
      property.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesPrice && matchesType && matchesLocation;
  });

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
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 animate-in fade-in-0 zoom-in-95 duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gamme de prix
                </label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les prix" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les prix</SelectItem>
                    <SelectItem value="lowToHigh">Jusqu'à 3M MAD</SelectItem>
                    <SelectItem value="midRange">3M - 6M MAD</SelectItem>
                    <SelectItem value="highToLow">6M+ MAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de bien
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emplacement
                </label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les emplacements" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les emplacements</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4 md:px-6 mt-10">
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucun bien trouvé</h3>
            <p className="mt-2 text-gray-500">
              Aucun bien ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProperties.length} bien{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NosBiens;
