
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ChevronLeft,
  Building,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Edit,
  Trash,
  Share,
  Copy,
  Power,
  AlertTriangle,
  User,
  Calendar
} from 'lucide-react';

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  
  // This would normally come from an API call
  const property = {
    id: propertyId || 'P001',
    title: 'Villa de luxe avec piscine',
    location: 'Casablanca, Anfa',
    price: '5,200,000 MAD',
    type: 'Villa',
    status: 'Disponible',
    bedrooms: 5,
    bathrooms: 4,
    area: '450 m²',
    date: '15/03/2024',
    description: 'Magnifique villa de luxe située dans le quartier prisé d\'Anfa à Casablanca. Ce bien d\'exception dispose de 5 chambres spacieuses, 4 salles de bain, un salon double, une cuisine entièrement équipée, une piscine privée et un jardin paysager. Parfait pour une famille exigeante à la recherche de confort et d\'élégance.',
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ],
    isFeatured: true,
    createdAt: new Date().toLocaleDateString('fr-FR'),
    assignedAgent: 'Sophie Martin'
  };

  const getStatusColor = (status: string) => {
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

  return (
    <AdminLayout title={`Détails du bien - ${property.title}`}>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/biens')}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                      {property.isFeatured && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          En vedette
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{property.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <div className="text-2xl font-bold text-luxe-blue">
                    {property.price}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 py-4 border-y">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">Chambres</span>
                    </div>
                    <span className="font-semibold">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Bath className="h-4 w-4 mr-1" />
                      <span className="text-sm">S. de bain</span>
                    </div>
                    <span className="font-semibold">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Ruler className="h-4 w-4 mr-1" />
                      <span className="text-sm">Surface</span>
                    </div>
                    <span className="font-semibold">{property.area}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Property Images */}
            <Card>
              <CardHeader>
                <CardTitle>Photos du bien</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {property.images.map((image, index) => (
                    <div key={index} className="rounded-md overflow-hidden aspect-video bg-gray-100">
                      <img
                        src={image}
                        alt={`Vue du bien ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-luxe-blue hover:bg-luxe-blue/90">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button className="w-full" variant="outline">
                  <Share className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button className="w-full" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Dupliquer
                </Button>
                <Button className="w-full" variant="outline">
                  <Power className="h-4 w-4 mr-2" />
                  Publier sur le site
                </Button>
                <Button className="w-full text-red-600" variant="outline">
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </CardContent>
            </Card>
            
            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Type de bien</p>
                  <p className="font-medium">{property.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ID du bien</p>
                  <p className="font-medium">{property.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{property.createdAt}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Agent assigné</p>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    <p className="font-medium">{property.assignedAgent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Attention box */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Attention</AlertTitle>
              <AlertDescription className="text-amber-700">
                Certaines informations sont manquantes. Complétez le profil du bien pour une meilleure visibilité.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PropertyDetails;
