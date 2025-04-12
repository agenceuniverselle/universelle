
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Copy, Trash2, Eye } from 'lucide-react';
import ReusableForm, { FormConfig } from '@/components/forms/ReusableForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Sample form configurations
const sampleForms: FormConfig[] = [
  {
    id: 'contact-form',
    title: 'Formulaire de contact',
    description: 'Formulaire général pour les demandes de contact',
    submitButtonText: 'Envoyer ma demande',
    successMessage: 'Votre message a été envoyé avec succès!',
    clientType: 'Prospect', // Added client type
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Nom complet',
        placeholder: 'Entrez votre nom',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Téléphone',
        placeholder: '+212 6XX XX XX XX'
      },
      {
        id: 'subject',
        type: 'select',
        label: 'Sujet',
        required: true,
        options: [
          { value: 'information', label: 'Demande d\'information' },
          { value: 'rdv', label: 'Prendre rendez-vous' },
          { value: 'visite', label: 'Visite de propriété' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Écrivez votre message ici...',
        required: true
      }
    ]
  },
  {
    id: 'property-request',
    title: 'Demande de bien immobilier',
    description: 'Formulaire pour les clients recherchant un bien spécifique',
    submitButtonText: 'Soumettre ma demande',
    successMessage: 'Votre demande a été enregistrée. Un conseiller vous contactera prochainement!',
    clientType: 'Acheteur', // Added client type
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Nom complet',
        placeholder: 'Entrez votre nom',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Téléphone',
        placeholder: '+212 6XX XX XX XX',
        required: true
      },
      {
        id: 'propertyType',
        type: 'select',
        label: 'Type de bien',
        required: true,
        options: [
          { value: 'apartment', label: 'Appartement' },
          { value: 'house', label: 'Maison' },
          { value: 'villa', label: 'Villa' },
          { value: 'land', label: 'Terrain' },
          { value: 'commercial', label: 'Local commercial' }
        ]
      },
      {
        id: 'location',
        type: 'text',
        label: 'Emplacement souhaité',
        placeholder: 'Ville, quartier...',
        required: true
      },
      {
        id: 'budget',
        type: 'text',
        label: 'Budget approximatif',
        placeholder: 'Ex: 500,000 MAD',
        required: true
      },
      {
        id: 'bedrooms',
        type: 'select',
        label: 'Nombre de chambres',
        options: [
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4+' }
        ]
      },
      {
        id: 'additionalInfo',
        type: 'textarea',
        label: 'Informations supplémentaires',
        placeholder: 'Précisez vos attentes pour ce bien...'
      }
    ]
  },
  {
    id: 'investment-form',
    title: 'Formulaire d\'investissement',
    description: 'Formulaire pour les clients recherchant des opportunités d\'investissement',
    submitButtonText: 'Envoyer ma demande d\'investissement',
    successMessage: 'Votre demande d\'investissement a été enregistrée. Un conseiller vous contactera prochainement!',
    clientType: 'Investisseur', // Added client type
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Nom complet',
        placeholder: 'Entrez votre nom',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true
      },
      {
        id: 'phone',
        type: 'phone',
        label: 'Téléphone',
        placeholder: '+212 6XX XX XX XX',
        required: true
      },
      {
        id: 'investmentType',
        type: 'select',
        label: 'Type d\'investissement',
        required: true,
        options: [
          { value: 'residential', label: 'Résidentiel' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'touristic', label: 'Touristique' },
          { value: 'land', label: 'Terrain' }
        ]
      },
      {
        id: 'investmentBudget',
        type: 'select',
        label: 'Budget d\'investissement',
        required: true,
        options: [
          { value: '100-300k', label: '100,000€ - 300,000€' },
          { value: '300-500k', label: '300,000€ - 500,000€' },
          { value: '500-1M', label: '500,000€ - 1,000,000€' },
          { value: '1M+', label: 'Plus de 1,000,000€' }
        ]
      },
      {
        id: 'returnExpectation',
        type: 'select',
        label: 'Rendement attendu',
        required: true,
        options: [
          { value: '5-7', label: '5-7%' },
          { value: '7-9', label: '7-9%' },
          { value: '9+', label: '9%+' }
        ]
      },
      {
        id: 'investmentDetails',
        type: 'textarea',
        label: 'Critères d\'investissement',
        placeholder: 'Précisez vos critères d\'investissement...',
        required: true
      }
    ]
  },
  {
    id: 'newsletter-form',
    title: 'Inscription Newsletter',
    description: 'Formulaire pour s\'inscrire à la newsletter',
    submitButtonText: 'S\'inscrire à la newsletter',
    successMessage: 'Votre inscription à la newsletter a été effectuée avec succès!',
    clientType: 'Prospect', // Added client type
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Nom',
        placeholder: 'Entrez votre nom',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'votre@email.com',
        required: true
      },
      {
        id: 'interests',
        type: 'select',
        label: 'Centres d\'intérêt',
        required: true,
        options: [
          { value: 'properties', label: 'Nouvelles propriétés' },
          { value: 'investments', label: 'Opportunités d\'investissement' },
          { value: 'market', label: 'Analyses de marché' },
          { value: 'all', label: 'Tous les sujets' }
        ]
      }
    ]
  }
];

const getClientTypeColor = (type: string) => {
  switch (type) {
    case 'Investisseur':
      return 'bg-purple-100 text-purple-800';
    case 'Acheteur':
      return 'bg-blue-100 text-blue-800';
    case 'Prospect':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const FormManagement = () => {
  const [forms, setForms] = useState<FormConfig[]>(sampleForms);
  const [previewForm, setPreviewForm] = useState<FormConfig | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const { toast } = useToast();
  
  const copyFormCode = (formId: string) => {
    const formConfig = forms.find(form => form.id === formId);
    if (!formConfig) return;
    
    const codeSnippet = `
import ReusableForm from '@/components/forms/ReusableForm';
import { useLeads, LeadProvider } from '@/context/LeadContext';

// Configuration du formulaire
const formConfig = ${JSON.stringify(formConfig, null, 2)};

// Dans votre composant
const YourComponent = () => {
  const { addLead } = useLeads();
  
  const handleSubmit = (data) => {
    // Add lead to CRM with the appropriate client type
    addLead({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      status: 'Nouveau lead',
      source: 'Formulaire web',
      notes: JSON.stringify(data)
    }, '${formConfig.clientType || 'Prospect'}');
  }
  
  return (
    <LeadProvider>
      <ReusableForm formConfig={formConfig} onSubmit={handleSubmit} />
    </LeadProvider>
  );
};

export default YourComponent;
`;
    
    navigator.clipboard.writeText(codeSnippet);
    
    toast({
      title: "Code copié!",
      description: "Le code du formulaire a été copié dans le presse-papier",
    });
  };
  
  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter(form => form.id !== formId));
    toast({
      title: "Formulaire supprimé",
      description: "Le formulaire a été supprimé avec succès",
    });
  };
  
  const handlePreview = (formId: string) => {
    const form = forms.find(form => form.id === formId);
    if (form) {
      setPreviewForm(form);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des formulaires</h2>
          <p className="text-gray-500">Créez et gérez des formulaires réutilisables pour votre CRM</p>
        </div>
        <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Créer un formulaire
        </Button>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Liste des formulaires</TabsTrigger>
          <TabsTrigger value="embed">Intégration</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Formulaires disponibles</CardTitle>
              <CardDescription>Gérez vos formulaires personnalisés pour votre site et CRM</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom du formulaire</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type de client</TableHead>
                    <TableHead>Champs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.title}</TableCell>
                      <TableCell>{form.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getClientTypeColor(form.clientType || 'Prospect')}>
                          {form.clientType || 'Prospect'}
                        </Badge>
                      </TableCell>
                      <TableCell>{form.fields.length} champs</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handlePreview(form.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Aperçu du formulaire</DialogTitle>
                                <DialogDescription>
                                  Visualisez le formulaire tel qu'il apparaîtra sur votre site
                                </DialogDescription>
                              </DialogHeader>
                              {previewForm && (
                                <div className="mt-4">
                                  <ReusableForm formConfig={previewForm} />
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyFormCode(form.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteForm(form.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle>Intégration de formulaires</CardTitle>
              <CardDescription>Instructions pour intégrer vos formulaires dans d'autres pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Comment intégrer un formulaire</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="mb-2 font-medium">1. Importez les composants nécessaires</p>
                  <pre className="bg-gray-800 text-white p-2 rounded text-sm">
                    {`import ReusableForm from '@/components/forms/ReusableForm';
import { useLeads, LeadProvider } from '@/context/LeadContext';`}
                  </pre>
                  
                  <p className="mt-4 mb-2 font-medium">2. Créez la configuration du formulaire ou utilisez un pré-existant</p>
                  <pre className="bg-gray-800 text-white p-2 rounded text-sm overflow-auto">
                    {`// Vous pouvez importer la configuration
import { contactFormConfig } from '@/data/formConfigs';

// Ou créer votre propre configuration
const formConfig = {
  id: 'contact-form',
  title: 'Contactez-nous',
  clientType: 'Prospect', // Type de client: 'Investisseur', 'Acheteur', ou 'Prospect'
  fields: [
    { id: 'name', type: 'text', label: 'Nom', required: true },
    // autres champs...
  ],
  submitButtonText: 'Envoyer',
  successMessage: 'Message envoyé!',
};`}
                  </pre>
                  
                  <p className="mt-4 mb-2 font-medium">3. Utilisez le composant dans votre page</p>
                  <pre className="bg-gray-800 text-white p-2 rounded text-sm">
                    {`const YourComponent = () => {
  const { addLead } = useLeads();
  
  const handleSubmit = (data) => {
    // Ajout dans le CRM avec la catégorie appropriée
    addLead({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      status: 'Nouveau lead',
      source: 'Formulaire web',
      notes: JSON.stringify(data)
    }, formConfig.clientType || 'Prospect');
  }
  
  return (
    <LeadProvider>
      <ReusableForm formConfig={formConfig} onSubmit={handleSubmit} />
    </LeadProvider>
  );
};`}
                  </pre>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setActiveTab('list')}>
                    Voir vos formulaires
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques des formulaires</CardTitle>
              <CardDescription>Analysez la performance de vos formulaires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center text-gray-500">
                <p>Les statistiques seront disponibles prochainement.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormManagement;
