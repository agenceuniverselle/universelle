
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Save, X, AlertTriangle, Upload, Trash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PropertyEdit = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [hasChanges, setHasChanges] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Mock property data - in a real app this would come from an API
  const [property, setProperty] = useState({
    id: propertyId || '',
    title: 'Villa de luxe avec piscine',
    description: 'Magnifique villa de luxe située dans le quartier prisé d\'Anfa à Casablanca. Ce bien d\'exception dispose de 5 chambres spacieuses, 4 salles de bain, un salon double, une cuisine entièrement équipée, une piscine privée et un jardin paysager. Parfait pour une famille exigeante à la recherche de confort et d\'élégance.',
    location: 'Casablanca, Anfa',
    price: '5200000',
    type: 'Villa',
    status: 'Disponible',
    bedrooms: '5',
    bathrooms: '4',
    area: '450',
    isFeatured: true,
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ]
  });

  useEffect(() => {
    // This would be an API call in a real application
    console.log(`Loading property data for ID: ${propertyId}`);
    
    // Simulate loading period
    const timer = setTimeout(() => {
      console.log('Property data loaded');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [propertyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | 
    { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSelectChange = (name: string, value: string) => {
    setProperty(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProperty(prev => ({ ...prev, [name]: checked }));
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!property.title.trim()) errors.push('Le titre est requis');
    if (!property.location.trim()) errors.push('L\'emplacement est requis');
    if (!property.price || isNaN(Number(property.price))) errors.push('Le prix doit être un nombre valide');
    if (!property.type.trim()) errors.push('Le type de bien est requis');
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setActiveTab('main');
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs avant de sauvegarder",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Modifications enregistrées",
        description: "Les informations du bien ont été mises à jour avec succès",
        variant: "default",
      });
      
      setHasChanges(false);
      
      // Redirect to the property details page after a short delay
      setTimeout(() => {
        navigate(`/admin/biens/${propertyId}`);
      }, 300);
    } catch (error) {
      console.error('Error saving property:', error);
      toast({
        title: "Erreur lors de la sauvegarde",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter ?')) {
        navigate(`/admin/biens/${propertyId}`);
      }
    } else {
      navigate(`/admin/biens/${propertyId}`);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDeleteImage = (index: number) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  return (
    <AdminLayout title={`Modifier le bien - ${property.title}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/biens/${propertyId}`)}
            className="transition-all duration-200 hover:bg-gray-100 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux détails
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className={`bg-luxe-blue hover:bg-luxe-blue/90 transition-all duration-200 ${hasChanges ? 'hover:scale-105 active:scale-95' : 'opacity-70'}`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
        
        {formErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6 animate-in fade-in-0 zoom-in-95 slide-in-from-top-5">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreurs de validation</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="main" className="transition-all duration-200 data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
              Informations principales
            </TabsTrigger>
            <TabsTrigger value="details" className="transition-all duration-200 data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
              Détails supplémentaires
            </TabsTrigger>
            <TabsTrigger value="media" className="transition-all duration-200 data-[state=active]:scale-[1.03] data-[state=active]:shadow-sm">
              Médias
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription>Modifiez les informations essentielles du bien immobilier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre<span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      name="title"
                      value={property.title}
                      onChange={handleInputChange}
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de bien<span className="text-red-500">*</span></Label>
                    <Select 
                      value={property.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type" className="transition-all duration-200 hover:border-luxe-blue/30">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Maison">Maison</SelectItem>
                        <SelectItem value="Bureau">Bureau</SelectItem>
                        <SelectItem value="Terrain">Terrain</SelectItem>
                        <SelectItem value="Riad">Riad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (MAD)<span className="text-red-500">*</span></Label>
                    <Input
                      id="price"
                      name="price"
                      value={property.price}
                      onChange={handleInputChange}
                      type="number"
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut<span className="text-red-500">*</span></Label>
                    <Select 
                      value={property.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="status" className="transition-all duration-200 hover:border-luxe-blue/30">
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Réservé">Réservé</SelectItem>
                        <SelectItem value="Vendu">Vendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Emplacement<span className="text-red-500">*</span></Label>
                    <Input
                      id="location"
                      name="location"
                      value={property.location}
                      onChange={handleInputChange}
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={property.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="resize-none transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Détails supplémentaires</CardTitle>
                <CardDescription>Ajoutez des informations détaillées sur les caractéristiques du bien</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Nombre de chambres</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      value={property.bedrooms}
                      onChange={handleInputChange}
                      type="number"
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Nombre de salles de bain</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      value={property.bathrooms}
                      onChange={handleInputChange}
                      type="number"
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="area">Surface (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      value={property.area}
                      onChange={handleInputChange}
                      type="number"
                      className="transition-all duration-200 hover:border-luxe-blue/30 focus:scale-[1.01]"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={property.isFeatured}
                    onChange={(e) => handleCheckboxChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-luxe-blue focus:ring-luxe-blue"
                  />
                  <Label htmlFor="isFeatured" className="text-sm font-medium leading-none cursor-pointer">
                    Mettre ce bien en vedette sur la page d'accueil
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="media" className="animate-in fade-in-50 duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Photos et médias</CardTitle>
                <CardDescription>Gérez les photos et autres médias associés à ce bien</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {property.images.map((image, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border">
                      <img
                        src={image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => handleDeleteImage(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full py-8 border-dashed border-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all duration-200">
                  <Upload className="h-5 w-5 mr-2" />
                  Ajouter une nouvelle image
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className={`bg-luxe-blue hover:bg-luxe-blue/90 transition-all duration-200 ${hasChanges ? 'hover:scale-105 active:scale-95' : 'opacity-70'}`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PropertyEdit;
