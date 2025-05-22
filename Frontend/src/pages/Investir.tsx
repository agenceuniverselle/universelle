import React, { useState, useEffect, useMemo } from 'react';
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

const Investir = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [returnFilter, setReturnFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/properties', {
          params: {
            searchTerm,
            returnFilter,
            typeFilter,
            statusFilter,
          },
        });
        setProperties(response.data.data || []);
      } catch (err) {
        setError("Erreur lors du chargement des propriétés");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchTerm, returnFilter, typeFilter, statusFilter]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const rate = parseFloat((property.investmentDetails?.returnRate || property.return || '0%').replace('%', '')) || 0;

      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesReturn =
        returnFilter === 'all' ? true :
        returnFilter === 'low' ? rate <= 7 :
        returnFilter === 'medium' ? rate > 7 && rate <= 9 :
        rate > 9;

      const matchesType =
        typeFilter === 'all' ? true :
        property.investmentDetails?.investmentType === typeFilter;

      const matchesStatus =
        statusFilter === 'all' ? true :
        property.investmentDetails?.projectStatus === statusFilter;

      return matchesSearch && matchesReturn && matchesType && matchesStatus;
    });
  }, [properties, searchTerm, returnFilter, typeFilter, statusFilter]);

  const getInvestmentTypeIcon = (type: string) => {
    switch (type) {
      case 'Résidentiel': return <Home className="h-4 w-4" />;
      case 'Commercial': return <Briefcase className="h-4 w-4" />;
      case 'Touristique': return <Luggage className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

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
              Filtres
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
          <p className="text-center text-gray-500">Chargement des opportunités...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucune opportunité d'investissement trouvée</h3>
            <p className="mt-2 text-gray-500">Essayez de modifier vos filtres.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProperties.length} opportunité{filteredProperties.length > 1 ? 's' : ''} trouvée{filteredProperties.length > 1 ? 's' : ''}
              </p>
              <div className="flex gap-2">
                {typeFilter !== 'all' && <Badge variant="secondary" className="flex items-center gap-1">{getInvestmentTypeIcon(typeFilter)} {typeFilter}</Badge>}
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
              {filteredProperties.map((property) => (
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
