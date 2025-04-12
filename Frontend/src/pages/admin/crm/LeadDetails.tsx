
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Building, Euro, Calendar, Clock, ArrowLeft, Edit, Trash2, UserPlus, FileClock, FileText, MoveRight, Briefcase, Home, User } from 'lucide-react';
import { LeadProvider, useLeads } from '@/context/LeadContext';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const LeadDetailsContent = () => {
  const { id } = useParams<{ id: string }>();
  const { getLeadById, convertToClient, deleteLead } = useLeads();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmConvert, setConfirmConvert] = useState(false);
  const [clientTypeForConversion, setClientTypeForConversion] = useState<'Investisseur' | 'Acheteur' | 'Prospect'>('Prospect');
  
  const lead = getLeadById(id || '');
  
  if (!lead) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-500">Lead non trouvé</CardTitle>
          <CardDescription>
            Le lead que vous recherchez n&apos;existe pas ou a été supprimé.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/crm')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au CRM
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau lead':
        return 'bg-blue-100 text-blue-800';
      case 'Contacté':
        return 'bg-purple-100 text-purple-800';
      case 'Qualifié':
        return 'bg-green-100 text-green-800';
      case 'En négociation':
        return 'bg-amber-100 text-amber-800';
      case 'Vendu':
        return 'bg-emerald-100 text-emerald-800';
      case 'Perdu':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getClientTypeIcon = (type?: string) => {
    switch (type) {
      case 'Investisseur':
        return <Briefcase className="h-4 w-4 text-blue-600 mr-2" />;
      case 'Acheteur':
        return <Home className="h-4 w-4 text-green-600 mr-2" />;
      default:
        return <User className="h-4 w-4 text-gray-600 mr-2" />;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleEdit = () => {
    navigate(`/admin/crm/lead/${id}/edit`);
  };
  
  const handleDelete = () => {
    deleteLead(id || '');
    toast({
      title: "Lead supprimé",
      description: "Le lead a été supprimé avec succès.",
    });
    navigate('/admin/crm');
  };
  
  const handleConvertToClient = () => {
    convertToClient(id || '', clientTypeForConversion);
    toast({
      title: "Lead converti en client",
      description: `${lead.name} a été converti en client ${clientTypeForConversion} avec succès.`,
    });
    navigate('/admin/crm');
  };
  
  // Format les données du formulaire pour l'affichage
  const renderFormData = () => {
    if (!lead.formData || Object.keys(lead.formData).length === 0) {
      return <p className="text-gray-500 italic">Aucune donnée de formulaire disponible.</p>;
    }
    
    return (
      <div className="space-y-3">
        {Object.entries(lead.formData).map(([key, value]) => (
          <div key={key} className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium">{key}</div>
            <div className="text-sm">{value?.toString() || '-'}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/crm')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au CRM
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button 
            variant="outline" 
            className="text-red-500 hover:text-red-700"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
          {lead.status !== 'Vendu' && (
            <Button 
              className="bg-luxe-blue hover:bg-luxe-blue/90"
              onClick={() => setConfirmConvert(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Convertir en client
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="" alt={lead.name} />
                    <AvatarFallback className="text-lg">{getInitials(lead.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{lead.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <Badge variant="outline">{lead.source}</Badge>
                      {lead.clientType && (
                        <Badge variant="outline" className={
                          lead.clientType === 'Investisseur' ? 'bg-blue-100 text-blue-800' : 
                          lead.clientType === 'Acheteur' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }>
                          {getClientTypeIcon(lead.clientType)}
                          {lead.clientType}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {lead.score !== undefined && (
                  <div className="bg-gray-100 p-3 rounded-full h-16 w-16 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        lead.score >= 80 ? "text-green-500" : 
                        lead.score >= 60 ? "text-amber-500" : "text-red-500"
                      }`}>
                        {lead.score}%
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Informations</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="timeline">Historique</TabsTrigger>
                  <TabsTrigger value="formData">Données du formulaire</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Coordonnées</h3>
                      <div className="space-y-3">
                        {lead.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Email</div>
                              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                                {lead.email}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {lead.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Téléphone</div>
                              <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                                {lead.phone}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {lead.clientType && (
                          <div className="flex items-center">
                            {getClientTypeIcon(lead.clientType)}
                            <div>
                              <div className="text-sm font-medium">Type de client</div>
                              <div>{lead.clientType}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Projet immobilier</h3>
                      <div className="space-y-3">
                        {lead.propertyType && (
                          <div className="flex items-center">
                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Type de bien</div>
                              <div>{lead.propertyType}</div>
                            </div>
                          </div>
                        )}
                        
                        {lead.budget && (
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Budget</div>
                              <div>{lead.budget}</div>
                            </div>
                          </div>
                        )}
                        
                        {lead.clientType === 'Investisseur' && lead.investmentCriteria && (
                          <div className="flex items-start">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                            <div>
                              <div className="text-sm font-medium">Critères d'investissement</div>
                              <div>{lead.investmentCriteria}</div>
                            </div>
                          </div>
                        )}
                        
                        {lead.clientType === 'Acheteur' && lead.interestedProperty && (
                          <div className="flex items-start">
                            <Home className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                            <div>
                              <div className="text-sm font-medium">Bien intéressé</div>
                              <div>{lead.interestedProperty}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Suivi</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium">Date de création</div>
                            <div>{format(new Date(lead.createdAt), 'dd/MM/yyyy')}</div>
                          </div>
                        </div>
                        
                        {lead.lastContact && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Dernier contact</div>
                              <div>{format(new Date(lead.lastContact), 'dd/MM/yyyy HH:mm')}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Actions</h3>
                      <div className="space-y-3">
                        {lead.nextAction && (
                          <div className="flex items-start">
                            <FileClock className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium">Prochaine action</div>
                              <div>{lead.nextAction}</div>
                            </div>
                          </div>
                        )}
                        
                        {lead.assignedTo && (
                          <div className="flex items-center">
                            <UserPlus className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium">Responsable</div>
                              <div>{lead.assignedTo}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes">
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                    {lead.notes ? (
                      <div className="whitespace-pre-wrap">{lead.notes}</div>
                    ) : (
                      <div className="text-gray-400 italic">Aucune note pour ce lead.</div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 shrink-0 mr-4">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">Lead créé</div>
                        <div className="text-sm text-gray-500">{format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm')}</div>
                        <div className="text-sm mt-1">
                          Source: {lead.source}
                        </div>
                      </div>
                    </div>
                    
                    {lead.lastContact && lead.lastContact.getTime() !== lead.createdAt.getTime() && (
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 shrink-0 mr-4">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">Dernier contact</div>
                          <div className="text-sm text-gray-500">{format(new Date(lead.lastContact), 'dd/MM/yyyy HH:mm')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="formData">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Données du formulaire</h3>
                    {renderFormData()}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Gérer ce lead efficacement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => window.open(`mailto:${lead.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer un email
              </Button>
              
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.open(`tel:${lead.phone}`)}>
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              
              <Button variant="outline" className="w-full" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier les détails
              </Button>
              
              {lead.status !== 'Vendu' && (
                <Button className="w-full bg-luxe-blue hover:bg-luxe-blue/90" onClick={() => setConfirmConvert(true)}>
                  <MoveRight className="h-4 w-4 mr-2" />
                  Convertir en client
                </Button>
              )}
              
              <Button variant="outline" className="w-full text-red-500 hover:text-red-700" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce lead ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={confirmConvert} onOpenChange={setConfirmConvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convertir en client</DialogTitle>
            <DialogDescription>
              Choisissez le type de client pour {lead.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant={clientTypeForConversion === 'Investisseur' ? 'default' : 'outline'}
                className={clientTypeForConversion === 'Investisseur' ? 'bg-blue-600' : ''}
                onClick={() => setClientTypeForConversion('Investisseur')}
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Investisseur
              </Button>
              <Button 
                variant={clientTypeForConversion === 'Acheteur' ? 'default' : 'outline'}
                className={clientTypeForConversion === 'Acheteur' ? 'bg-green-600' : ''}
                onClick={() => setClientTypeForConversion('Acheteur')}
              >
                <Home className="h-4 w-4 mr-2" />
                Acheteur
              </Button>
              <Button 
                variant={clientTypeForConversion === 'Prospect' ? 'default' : 'outline'}
                onClick={() => setClientTypeForConversion('Prospect')}
              >
                <User className="h-4 w-4 mr-2" />
                Prospect
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmConvert(false)}>Annuler</Button>
            <Button 
              className="bg-luxe-blue hover:bg-luxe-blue/90" 
              onClick={handleConvertToClient}
            >
              <MoveRight className="h-4 w-4 mr-2" /> Convertir en {clientTypeForConversion}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LeadDetails = () => {
  return (
    <AdminLayout title="Détails du lead">
      <LeadProvider>
        <LeadDetailsContent />
      </LeadProvider>
    </AdminLayout>
  );
};

export default LeadDetails;
