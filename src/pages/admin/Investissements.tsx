import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProperties, Property } from '@/context/PropertiesContext';
import {
  Search,
  Plus,
  TrendingUp,
  Clock,
  DollarSign,
  Building,
  FileText,
  CheckCircle2,
  XCircle,
  Filter,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Power,
  Save,
  Briefcase,
  Home,
  Luggage,
  EuroIcon,
  FileDown
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import AddInvestmentDialog from '@/components/properties/AddInvestmentDialog';
import { Separator } from '@/components/ui/separator';

const AdminInvestissements = () => {
  const { properties, removeProperty, publishProperty } = useProperties();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const investmentProperties = properties.filter(property => property.isInvestment);
  
  const filteredProperties = investmentProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                        (property.investmentDetails && property.investmentDetails.type === filterType);
    
    const matchesStatus = filterStatus === 'all' || 
                          (property.investmentDetails && property.investmentDetails.projectStatus === filterStatus);
    
    const matchesTab = (activeTab === 'all' ||
                       (activeTab === 'drafts' && property.isDraft) ||
                       (activeTab === 'published' && !property.isDraft));
    
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });
  
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = a.date.split('/').reverse().join('-');
      const dateB = b.date.split('/').reverse().join('-');
      return sortOrder === 'asc' ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
    } else if (sortBy === 'price') {
      const priceA = parseFloat(a.price.replace(/[^\d]/g, ''));
      const priceB = parseFloat(b.price.replace(/[^\d]/g, ''));
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    } else if (sortBy === 'return') {
      const returnA = parseFloat(a.return?.replace('%', '') || '0');
      const returnB = parseFloat(b.return?.replace('%', '') || '0');
      return sortOrder === 'asc' ? returnA - returnB : returnB - returnA;
    }
    return 0;
  });

  const handleRemove = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      removeProperty(id);
      toast({
        title: 'Bien supprimé',
        description: 'Le bien d\'investissement a été supprimé avec succès.',
      });
    }
  };

  const handlePublish = (id: string) => {
    publishProperty(id);
    toast({
      title: 'Bien publié',
      description: 'Le bien est maintenant visible sur la page Investir.',
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/biens/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/admin/biens/${id}`);
  };

  const handlePropertyAdded = (propertyId: string) => {
    setAddDialogOpen(false);
    toast({
      title: 'Bien ajouté',
      description: 'Le nouveau bien d\'investissement a été ajouté avec succès.',
    });
  };

  const getInvestmentTypeIcon = (type?: string) => {
    switch (type) {
      case 'Résidentiel':
        return <Home className="h-4 w-4" />;
      case 'Commercial':
        return <Briefcase className="h-4 w-4" />;
      case 'Touristique':
        return <Luggage className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Pré-commercialisation':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pré-commercialisation</Badge>;
      case 'En cours':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">En cours</Badge>;
      case 'Terminé':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Terminé</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Non défini</Badge>;
    }
  };

  return (
    <AdminLayout title="Biens à Investir">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-luxe-blue hover:bg-luxe-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bien à investir
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous les biens</TabsTrigger>
            <TabsTrigger value="published">Publiés</TabsTrigger>
            <TabsTrigger value="drafts">Brouillons</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="filter-type" className="block text-sm font-medium text-gray-700 mb-1">
              Type d'investissement
            </label>
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Touristique">Touristique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status du projet
            </label>
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >
              <SelectTrigger id="filter-status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Pré-commercialisation">Pré-commercialisation</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="return">Rentabilité</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {sortedProperties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <TrendingUp className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">Aucun bien d'investissement trouvé</p>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Ajoutez votre premier bien d'investissement pour qu'il apparaisse ici.
            </p>
            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-luxe-blue hover:bg-luxe-blue/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un bien à investir
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <Card key={property.id} className={property.isDraft ? "border-dashed border-gray-300" : ""}>
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <Badge variant="secondary" className="flex items-center gap-1 bg-white/90">
                    {getInvestmentTypeIcon(property.investmentDetails?.type)}
                    {property.investmentDetails?.type || "Non spécifié"}
                  </Badge>
                  {property.isDraft && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Brouillon
                    </Badge>
                  )}
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <div className="flex items-center text-gray-500 text-sm">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {property.price}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                    <span className="font-medium text-green-600">
                      {property.investmentDetails?.returnRate || property.return || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-blue-600" />
                    <span>{property.investmentDetails?.recommendedDuration || "N/A"}</span>
                  </div>
                  <div>
                    {getStatusBadge(property.investmentDetails?.projectStatus)}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleView(property.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleEdit(property.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Éditer
                  </Button>
                  {property.isDraft ? (
                    <Button 
                      size="sm" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handlePublish(property.id)}
                    >
                      <Power className="h-4 w-4 mr-1" />
                      Publier
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleRemove(property.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <AddInvestmentDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onPropertyAdded={handlePropertyAdded}
      />
    </AdminLayout>
  );
};

export default AdminInvestissements;
