
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Sample data for demonstration purposes
const visitData = [
  { month: 'Jan', visits: 1200 },
  { month: 'Feb', visits: 1900 },
  { month: 'Mar', visits: 1500 },
  { month: 'Apr', visits: 2100 },
  { month: 'May', visits: 2400 },
  { month: 'Jun', visits: 1800 },
];

const salesData = [
  { month: 'Jan', sales: 2, revenue: 240000 },
  { month: 'Feb', sales: 3, revenue: 350000 },
  { month: 'Mar', sales: 1, revenue: 120000 },
  { month: 'Apr', sales: 4, revenue: 480000 },
  { month: 'May', sales: 5, revenue: 600000 },
  { month: 'Jun', sales: 3, revenue: 420000 },
];

const propertyTypeData = [
  { name: 'Appartements', value: 45 },
  { name: 'Villas', value: 25 },
  { name: 'Maisons', value: 15 },
  { name: 'Terrains', value: 10 },
  { name: 'Commerces', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

const AdminStats = () => {
  return (
    <AdminLayout title="Statistiques">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Visites du site</CardTitle>
            <CardDescription>Nombre de visites par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ventes par mois</CardTitle>
            <CardDescription>Nombre de biens vendus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Répartition des biens</CardTitle>
            <CardDescription>Par type de propriété</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenus mensuels</CardTitle>
            <CardDescription>En Dirhams (MAD)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} MAD`, 'Revenus']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Statistiques des utilisateurs</CardTitle>
            <CardDescription>Inscriptions mensuelles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Utilisateurs inscrits</span>
                <span className="font-semibold">1,245</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Investisseurs actifs</span>
                <span className="font-semibold">328</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Taux de conversion</span>
                <span className="font-semibold">26.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Temps moyen sur le site</span>
                <span className="font-semibold">3m 42s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;
