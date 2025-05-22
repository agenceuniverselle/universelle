
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useDarkMode } from "@/context/DarkModeContext";
import { Bien } from '@/types/bien.types';

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


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={COLORS[index % COLORS.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const AdminStats = () => {
  const [propertyTypeData, setPropertyTypeData] = useState<{ name: string; value: number }[]>([]);
const [loading, setLoading] = useState(false);
const { isDarkMode } = useDarkMode();

 // ✅ Charger les données des biens au chargement de la page
 useEffect(() => {
  fetchPropertyTypes();
}, []);

// ✅ Fonction pour récupérer les types de biens de manière dynamique
const fetchPropertyTypes = async () => {
  setLoading(true);
  try {
    const response = await axios.get("http://localhost:8000/api/biens");
    const biens = response.data.data || [];

    // ✅ Compter les types de biens
    const typeCount: Record<string, number> = {};
    biens.forEach((bien: Bien) => {
      const type = bien.type || "Autres";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // ✅ Convertir l'objet en tableau pour le graphique
    const formattedData = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));

    setPropertyTypeData(formattedData);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de biens:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <AdminLayout title="Statistiques">
      <div className="flex flex-wrap gap-4 justify-between">
  {/* ✅ Ligne 1 : Visites du site et Ventes par mois */}
  <Card className="w-full md:w-[48%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
  <CardHeader className="pb-2">
    <CardTitle className="text-lg dark:text-white">Visites du site</CardTitle>
    <CardDescription className="dark:text-gray-300">Nombre de visites par mois</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={visitData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
          />
          <XAxis 
            dataKey="month" 
            stroke={isDarkMode ? "#e5e7eb" : "#374151"} 
          />
          <YAxis 
            stroke={isDarkMode ? "#e5e7eb" : "#374151"} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#e5e7eb" : "#374151",
              borderColor: isDarkMode ? "#374151" : "#e5e7eb"
            }}
          />
          <Legend 
            wrapperStyle={{
              color: isDarkMode ? "#e5e7eb" : "#374151",
            }} 
          />
          <Bar 
            dataKey="visits" 
            fill={isDarkMode ? "#3b82f6" : "#60a5fa"} 
            className="transition-colors duration-300"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


<Card className="w-full md:w-[48%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg dark:text-white">Ventes par mois</CardTitle>
        <CardDescription className="dark:text-gray-300">Nombre de biens vendus</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? "#374151" : "#e5e7eb"} 
              />
              <XAxis 
                dataKey="month" 
                stroke={isDarkMode ? "#e5e7eb" : "#374151"} 
              />
              <YAxis 
                stroke={isDarkMode ? "#e5e7eb" : "#374151"} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb"
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke={isDarkMode ? "#60a5fa" : "#8884d8"} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

  {/* ✅ Ligne 2 : Répartition des biens et Revenus mensuels */}
  <Card className="w-full md:w-[48%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg dark:text-white">Répartition des biens</CardTitle>
        <CardDescription className="dark:text-gray-300">Par type de propriété</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {propertyTypeData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    color: isDarkMode ? "#e5e7eb" : "#374151",
                    borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="w-full md:w-[48%] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg dark:text-white">Revenus mensuels</CardTitle>
        <CardDescription className="dark:text-gray-300">En Dirhams (MAD)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? "#374151" : "#e5e7eb"} // ✅ Grille adaptative 
              />
              <XAxis 
                dataKey="month" 
                stroke={isDarkMode ? "#e5e7eb" : "#374151"} 
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
              />
              <YAxis 
                stroke={isDarkMode ? "#e5e7eb" : "#374151"} 
                tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                  borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                }}
                formatter={(value) => [`${value.toLocaleString()} MAD`, 'Revenus']}
              />
              <Legend 
                wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#374151" }}
              />
              <Bar 
                dataKey="revenue" 
                fill={isDarkMode ? "#34d399" : "#10b981"} // ✅ Couleur adaptative pour les barres
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
</div>

    </AdminLayout>
  );
};

export default AdminStats;
