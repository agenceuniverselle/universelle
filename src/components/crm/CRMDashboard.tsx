
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { 
  AlertCircle, 
  UserPlus, 
  BarChart3, 
  Phone, 
  Mail, 
  Calendar 
} from 'lucide-react';
import { useLeads } from '@/context/LeadContext';
import { format, subMonths, isAfter, isBefore, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const CRMDashboard = () => {
  const { leads, clients } = useLeads();
  
  // Calcul des statistiques basées sur les données réelles
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = subMonths(firstDayOfMonth, 1);
  
  // Leads ce mois
  const leadsThisMonth = leads.filter(lead => 
    isAfter(new Date(lead.createdAt), firstDayOfMonth)
  );
  const leadsLastMonth = leads.filter(lead => 
    isAfter(new Date(lead.createdAt), lastMonth) && 
    isBefore(new Date(lead.createdAt), firstDayOfMonth)
  );
  const leadsGrowth = leadsLastMonth.length ? 
    Math.round((leadsThisMonth.length - leadsLastMonth.length) / leadsLastMonth.length * 100) : 
    100;
  
  // Taux de conversion (leads convertis en clients)
  const convertedLeads = clients.filter(client => 
    isAfter(new Date(client.clientSince), firstDayOfMonth)
  );
  const conversionRate = leadsThisMonth.length ? 
    Math.round((convertedLeads.length / leadsThisMonth.length) * 100) : 
    0;
  
  // Calcul du nombre d'appels et d'emails à faire (simplifié)
  const leadsNeedingCall = leads.filter(lead => 
    lead.status === 'Nouveau lead' || lead.status === 'Contacté'
  ).length;
  
  const leadsNeedingEmail = leads.filter(lead => 
    (lead.status === 'Qualifié' || lead.status === 'En négociation') && 
    lead.email
  ).length;
  
  // Calcul des urgences (leads créés il y a plus de 2 jours sans contact)
  const urgentLeads = leads.filter(lead => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return !lead.lastContact || isBefore(new Date(lead.lastContact), twoDaysAgo);
  }).length;
  
  // Données pour les graphiques
  const leadSourceData = Array.from(
    leads.reduce((acc, lead) => {
      const source = lead.source || 'Autre';
      acc.set(source, (acc.get(source) || 0) + 1);
      return acc;
    }, new Map())
  ).map(([name, value]) => ({ name, value }));
  
  // Données mensuelles (6 derniers mois)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, i);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const monthLeads = leads.filter(lead => {
      const date = new Date(lead.createdAt);
      return isAfter(date, monthStart) && isBefore(date, monthEnd);
    }).length;
    
    const monthConversions = clients.filter(client => {
      const date = new Date(client.clientSince);
      return isAfter(date, monthStart) && isBefore(date, monthEnd);
    }).length;
    
    return {
      name: format(month, 'MMM', { locale: fr }),
      leads: monthLeads,
      conversions: monthConversions
    };
  }).reverse();
  
  // Données du pipeline
  const statuses = ['Nouveau lead', 'Contacté', 'Qualifié', 'En négociation', 'Vendu', 'Perdu'];
  const pipelineData = statuses.map(status => ({
    name: status,
    value: leads.filter(lead => lead.status === status).length
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6B6B'];

  // Événements à venir (approximation basée sur le status des leads)
  const upcomingEvents = leads
    .filter(lead => lead.nextAction)
    .slice(0, 4)
    .map((lead, index) => {
      let type = 'task';
      let date = 'À programmer';
      
      if (lead.status === 'Nouveau lead') {
        type = 'call';
        date = 'Aujourd\'hui';
      } else if (lead.status === 'Contacté') {
        type = 'visit';
        date = 'Dans 2 jours';
      } else if (lead.status === 'En négociation') {
        type = 'meeting';
        date = 'Cette semaine';
      }
      
      return {
        id: lead.id,
        title: lead.nextAction || 'Action à définir',
        client: lead.name,
        date,
        type
      };
    });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'call':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'meeting':
        return <UserPlus className="h-4 w-4 text-purple-600" />;
      case 'task':
        return <Mail className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Leads ce mois</p>
                <h3 className="text-2xl font-bold mt-1">{leadsThisMonth.length}</h3>
                <p className={`text-xs ${leadsGrowth >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                  {leadsGrowth >= 0 ? '+' : ''}{leadsGrowth}% comparé au mois dernier
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Taux de conversion</p>
                <h3 className="text-2xl font-bold mt-1">{conversionRate}%</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  {convertedLeads.length} conversions ce mois
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Appels à passer</p>
                <h3 className="text-2xl font-bold mt-1">{leadsNeedingCall}</h3>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  {urgentLeads} urgents aujourd'hui
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Emails à envoyer</p>
                <h3 className="text-2xl font-bold mt-1">{leadsNeedingEmail}</h3>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  {Math.min(5, leadsNeedingEmail)} suivis de prospects
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Graphiques */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sources des leads</CardTitle>
            <CardDescription>D'où proviennent vos nouveaux prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
            <CardDescription>Leads et conversions par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={last6Months}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="conversions" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Pipeline et événements */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>État du pipeline</CardTitle>
            <CardDescription>Répartition des leads dans le cycle de vente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pipelineData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Événements à venir</CardTitle>
            <CardDescription>Vos prochains rendez-vous et tâches</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <ul className="space-y-4">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-md">
                    <div className="bg-gray-100 rounded-full p-2">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">Client: {event.client}</p>
                      <p className="text-xs text-gray-400">{event.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-gray-400">Aucun événement à venir</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMDashboard;
