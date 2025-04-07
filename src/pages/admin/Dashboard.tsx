
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Building, Users, DollarSign, Briefcase } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 400 },
    { name: 'Fév', sales: 300 },
    { name: 'Mar', sales: 550 },
    { name: 'Avr', sales: 420 },
    { name: 'Mai', sales: 380 },
    { name: 'Juin', sales: 620 },
    { name: 'Juil', sales: 700 },
  ];

  const propertyTypeData = [
    { name: 'Appartements', value: 45 },
    { name: 'Villas', value: 25 },
    { name: 'Bureaux', value: 15 },
    { name: 'Terrains', value: 10 },
    { name: 'Autres', value: 5 },
  ];

  return (
    <AdminLayout title="Tableau de bord">
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Biens Immobiliers</p>
                <h3 className="text-2xl font-bold mt-1">128</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% ce mois
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-luxe-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
                <h3 className="text-2xl font-bold mt-1">3,427</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8% ce mois
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue</p>
                <h3 className="text-2xl font-bold mt-1">2.4M MAD</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +18% ce mois
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Transactions</p>
                <h3 className="text-2xl font-bold mt-1">58</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5% ce mois
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="sales" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="sales">Ventes</TabsTrigger>
          <TabsTrigger value="properties">Propriétés</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Tendance des ventes</CardTitle>
              <CardDescription>Vue d'ensemble des ventes pour les 7 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#93c5fd" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des types de biens</CardTitle>
              <CardDescription>Répartition des biens immobiliers par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Activité des utilisateurs</CardTitle>
              <CardDescription>Analyse de l'engagement des utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Données non disponibles pour le moment</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
          <CardDescription>Les dernières actions effectuées sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Nouvel utilisateur inscrit</p>
                <p className="text-xs text-gray-500">Laurent Dupont s'est inscrit sur la plateforme</p>
                <p className="text-xs text-gray-400">Il y a 12 minutes</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="bg-green-100 rounded-full p-2">
                <Building className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Nouvelle propriété ajoutée</p>
                <p className="text-xs text-gray-500">Villa de luxe à Marrakech ajoutée par Admin</p>
                <p className="text-xs text-gray-400">Il y a 1 heure</p>
              </div>
            </li>
            <li className="flex items-start space-x-4">
              <div className="bg-amber-100 rounded-full p-2">
                <DollarSign className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Transaction complétée</p>
                <p className="text-xs text-gray-500">Vente de l'appartement #A125 pour 1.2M MAD</p>
                <p className="text-xs text-gray-400">Il y a 3 heures</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
