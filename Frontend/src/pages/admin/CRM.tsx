
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, UserPlus, Loader2, Briefcase, Home, Users } from 'lucide-react';
import LeadPipeline from '@/components/crm/LeadPipeline';
import ClientsList from '@/components/crm/ClientsList';
import TasksCalendar from '@/components/crm/TasksCalendar';
import CRMDashboard from '@/components/crm/CRMDashboard';
import { TasksProvider } from '@/context/TasksContext';
import { LeadProvider, useLeads } from '@/context/LeadContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AddLeadDialog from '@/components/crm/AddLeadDialog';
import LeadsList from '@/components/crm/LeadsList';
import FormManagement from '@/components/crm/FormManagement';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CRMContent = () => {
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clientTypeTab, setClientTypeTab] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();
  const { leads } = useLeads();

  // Synchroniser l'onglet actif avec l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const clientType = params.get('clientType');
    
    if (tab && ['dashboard', 'leads', 'pipeline', 'clients', 'tasks', 'forms'].includes(tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      // Si aucun onglet n'est spécifié dans l'URL, définir l'onglet par défaut et mettre à jour l'URL
      navigate(`/admin/crm?tab=dashboard`, { replace: true });
    }
    
    if (clientType && ['all', 'investisseurs', 'acheteurs', 'prospects'].includes(clientType)) {
      setClientTypeTab(clientType);
    }
  }, [location, navigate]);

  // Fonction de changement d'onglet avec mise à jour de l'URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(location.search);
    params.set('tab', value);
    navigate(`/admin/crm?${params.toString()}`, { replace: true });
  };
  
  // Fonction de changement de type de client avec mise à jour de l'URL
  const handleClientTypeChange = (value: string) => {
    setClientTypeTab(value);
    const params = new URLSearchParams(location.search);
    params.set('clientType', value);
    navigate(`/admin/crm?${params.toString()}`, { replace: true });
  };

  // Vérification des nouveaux leads et notification
  useEffect(() => {
    const checkForNewLeads = () => {
      const now = new Date();
      const recentLeads = leads.filter(lead => {
        const createdDate = new Date(lead.createdAt);
        return now.getTime() - createdDate.getTime() < 60 * 60 * 1000;
      });

      if (recentLeads.length > 0) {
        toast({
          title: `${recentLeads.length} nouveau(x) lead(s)!`,
          description: "De nouveaux leads ont été ajoutés depuis le site web.",
          variant: "default",
        });
      }
    };
    
    checkForNewLeads();
    
    const intervalId = setInterval(checkForNewLeads, 60000);
    return () => clearInterval(intervalId);
  }, [leads]);

  const handleAddLead = () => {
    setIsAddingLead(true);
    setTimeout(() => {
      setIsAddingLead(false);
      setAddLeadOpen(true);
    }, 300);
  };

  const handleLeadAdded = (leadId: string) => {
    setAddLeadOpen(false);
    setTimeout(() => {
      navigate(`/admin/crm/lead/${leadId}`);
    }, 500);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  console.log("Current active tab:", activeTab);

  return (
    <>
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="leads">Leads & Prospects</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline de vente</TabsTrigger>
          <TabsTrigger value="clients">Base clients</TabsTrigger>
          <TabsTrigger value="tasks">Tâches & Rappels</TabsTrigger>
          <TabsTrigger value="forms">Formulaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="tab-content">
            <CRMDashboard />
          </div>
        </TabsContent>
        
        <TabsContent value="leads">
          <div className="tab-content">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Rechercher un lead..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Button variant="outline" size="icon" className="ml-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                className={`bg-luxe-blue hover:bg-luxe-blue/90 transition-all duration-300 ${isAddingLead ? 'opacity-80 scale-95' : ''}`}
                onClick={handleAddLead}
                disabled={isAddingLead}
              >
                {isAddingLead ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Ajouter un lead
              </Button>
            </div>
            
            <LeadsList searchTerm={searchTerm} />
          </div>
        </TabsContent>
        
        <TabsContent value="pipeline">
          <div className="tab-content">
            <LeadPipeline />
          </div>
        </TabsContent>
        
        <TabsContent value="clients">
          <div className="tab-content">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Rechercher un client..." 
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon" className="ml-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un client
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle>Catégories de clients</CardTitle>
                <CardDescription>Filtrez les clients par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={clientTypeTab} onValueChange={handleClientTypeChange} className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all" className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-2" />
                      Tous
                    </TabsTrigger>
                    <TabsTrigger value="investisseurs" className="flex items-center justify-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Investisseurs
                    </TabsTrigger>
                    <TabsTrigger value="acheteurs" className="flex items-center justify-center">
                      <Home className="h-4 w-4 mr-2" />
                      Acheteurs
                    </TabsTrigger>
                    <TabsTrigger value="prospects" className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-2" />
                      Prospects
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <TabsContent value="all" className="mt-0">
              <ClientsList type="clients" clientType="all" />
            </TabsContent>
            
            <TabsContent value="investisseurs" className="mt-0">
              <ClientsList type="clients" clientType="Investisseur" />
            </TabsContent>
            
            <TabsContent value="acheteurs" className="mt-0">
              <ClientsList type="clients" clientType="Acheteur" />
            </TabsContent>
            
            <TabsContent value="prospects" className="mt-0">
              <ClientsList type="clients" clientType="Prospect" />
            </TabsContent>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <div className="tab-content">
            <TasksCalendar />
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <div className="tab-content">
            <FormManagement />
          </div>
        </TabsContent>
      </Tabs>

      <AddLeadDialog 
        open={addLeadOpen} 
        onOpenChange={setAddLeadOpen} 
        onLeadAdded={handleLeadAdded} 
      />
    </>
  );
};

const CRM = () => {
  return (
    <AdminLayout title="CRM - Gestion des clients">
      <LeadProvider>
        <TasksProvider>
          <CRMContent />
        </TasksProvider>
      </LeadProvider>
    </AdminLayout>
  );
};

export default CRM;
