
import React, { useEffect, useState } from "react";
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Building, Users, DollarSign, Briefcase,FileText,Trash,TrendingUp,BadgePercent, Edit, Plus} from 'lucide-react';
import axios from "axios";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDarkMode } from "@/context/DarkModeContext";
import { Bien } from "@/context/BiensContext";
import { Property } from "@/context/PropertiesContext";

interface Activity {
  id: number;
  type: string;
  description: string;
  user_name: string;
  created_at: string;
}

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
  const [biensCount, setBiensCount] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [exclusiveOffersCount, setExclusiveOffersCount] = useState<number>(0);
  const [activities, setActivities] = useState([]);
  const [investmentCount, setInvestmentCount] = useState<number>(0);
// ✅ Fonction pour récupérer les biens à investir
const fetchInvestments = async () => {
  try {
    const response = await axios.get("https://back-qhore.ondigitalocean.app/api/properties");
    const investments = response.data.data || [];
    setInvestmentCount(investments.length);
  } catch (error) {
    console.error("Erreur lors de la récupération des biens à investir:", error);
  }
};

// ✅ Utiliser useEffect pour charger les biens à investir au démarrage
useEffect(() => {
  fetchInvestments();
}, []);
useEffect(() => {
  fetchExclusiveOffers();
}, []);

const fetchExclusiveOffers = async () => {
  try {
    const response = await axios.get("https://back-qhore.ondigitalocean.app/api/exclusive-offers");
    const offers = response.data || [];
    setExclusiveOffersCount(offers.length);
  } catch (error) {
    console.error("Erreur lors de la récupération des offres exclusives:", error);
  }
};
  useEffect(() => {
    fetchLastThreeActivities();
  }, []);

  const fetchLastThreeActivities = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/activities/latest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivities(response.data);
    } catch (error) {
      console.error("Erreur de chargement des dernières activités :", error);
    }
  };

  

  // ✅ Fonction pour obtenir l'icône et la couleur selon le type d'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'add_user': 
        return <Users className="h-4 w-4" stroke="#2563eb" strokeWidth={2} fill="none" />;
      case 'edit_user': 
        return <Edit className="h-4 w-4" stroke="#2563eb" strokeWidth={2} fill="none" />;
      case 'delete_user': 
        return <Trash className="h-4 w-4" stroke="#dc2626" strokeWidth={2} fill="none" />;
      
      case 'add_property': 
        return <Building className="h-4 w-4" stroke="#16a34a" strokeWidth={2} fill="none" />;
      case 'edit_property': 
        return <Edit className="h-4 w-4" stroke="#16a34a" strokeWidth={2} fill="none" />;
      case 'delete_property': 
        return <Trash className="h-4 w-4" stroke="#dc2626" strokeWidth={2} fill="none" />;
      
      case 'add_investment': 
        return <DollarSign className="h-4 w-4" stroke="#7c3aed" strokeWidth={2} fill="none" />;
      case 'edit_investment': 
        return <Edit className="h-4 w-4" stroke="#7c3aed" strokeWidth={2} fill="none" />;
      case 'delete_investment': 
        return <Trash className="h-4 w-4" stroke="#dc2626" strokeWidth={2} fill="none" />;
      
      case 'add_blog': 
        return <FileText className="h-4 w-4" stroke="#0ea5e9" strokeWidth={2} fill="none" />;
      case 'edit_blog': 
        return <Edit className="h-4 w-4" stroke="#0ea5e9" strokeWidth={2} fill="none" />;
      case 'delete_blog': 
        return <Trash className="h-4 w-4" stroke="#dc2626" strokeWidth={2} fill="none" />;
      
      case 'add_testimonial': 
        return <Plus className="h-4 w-4" stroke="#f59e0b" strokeWidth={2} fill="none" />;
      case 'edit_testimonial': 
        return <Edit className="h-4 w-4" stroke="#f59e0b" strokeWidth={2} fill="none" />;
      case 'delete_testimonial': 
        return <Trash className="h-4 w-4" stroke="#dc2626" strokeWidth={2} fill="none" />;
      
      case 'add_exclusive_offers': 
        return <Plus className="h-4 w-4" stroke="#ec4899" strokeWidth={2} fill="none" />;
      case 'edit_exclusive_offers': 
        return <Edit className="h-4 w-4" stroke="#ec4899" strokeWidth={2} fill="none" />;
      case 'delete_exclusive_offers': 
        return <Trash className="h-4 w-4" stroke="#dc2626" strokeWidth={2} fill="none" />;
      
      default: 
        return <FileText className="h-4 w-4" stroke="#6b7280" strokeWidth={2} fill="none" />;
    }
  };
  
  // ✅ Fonction pour formater la date
  const formatTimeAgo = (dateString: string) => {
    try {
      if (!dateString) return "Date inconnue";
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Date invalide";
      
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
      if (diff < 60) return `${diff} secondes`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} heures`;
      return `${Math.floor(diff / 86400)} jours`;
    } catch {
      return "Date inconnue";
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 10000); // 10 secondes
  
    // ✅ Nettoyage de l'intervalle
    return () => clearInterval(interval);
  }, []);
  
  // ✅ useEffect pour les biens (rechargement toutes les 10 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBiens();
    }, 10000); // 10 secondes
  
    return () => clearInterval(interval);
  }, []);

  // ✅ Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.users) {
        setUsersCount(response.data.users.length);
      } else {
        console.error("La réponse de l'API ne contient pas les utilisateurs.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };
  
  // ✅ Fonction pour récupérer les biens
  // ✅ Typage avec le type Bien
const fetchBiens = async () => {
  try {
    const response = await axios.get("https://back-qhore.ondigitalocean.app/api/biens");
    const biens: Bien[] = response.data.data || [];
    setBiensCount(biens.length);

    // ✅ Calcul de la croissance mensuelle (optionnel)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const biensLastMonth = biens.filter((bien: Bien) => {
      const bienDate = new Date(bien.createdAt);
      return bienDate >= lastMonth;
    });

    const growth = biensLastMonth.length
      ? ((biens.length - biensLastMonth.length) / biensLastMonth.length) * 100
      : 0;

    setGrowthRate(growth);
  } catch (error) {
    console.error("Erreur lors de la récupération des biens:", error);
  }
};

  // ✅ État pour stocker les types de biens et leurs nombres
const [propertyTypeData, setPropertyTypeData] = useState<{ name: string; value: number }[]>([]);

useEffect(() => {
  fetchPropertyTypes();
}, []);

// ✅ Fonction pour récupérer les types de biens de manière dynamique
// ✅ Typage avec le type Bien
const fetchPropertyTypes = async () => {
  try {
    const response = await axios.get("https://back-qhore.ondigitalocean.app/api/biens");
    const biens: Bien[] = response.data.data || [];

    // ✅ Calcul des types de biens dynamiquement
    const typeCount: Record<string, number> = {};

    // ✅ Utilisation du type Bien
    biens.forEach((bien: Bien) => {
      const type = bien.type || "Autres";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // ✅ Transformer en tableau pour le graphique
    const formattedData = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));

    setPropertyTypeData(formattedData);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de biens:", error);
  }
};


  // ✅ État pour stocker les types de biens à investir et leurs nombres
const [investmentTypeData, setInvestmentTypeData] = useState<{ name: string; value: number }[]>([]);

useEffect(() => {
  fetchInvestmentTypes();
}, []);

// ✅ Fonction pour récupérer les types de biens à investir de manière dynamique
// ✅ Typage avec le type Property
const fetchInvestmentTypes = async () => {
  try {
    const response = await axios.get("https://back-qhore.ondigitalocean.app/api/properties");
    const properties: Property[] = response.data.data || [];

    // ✅ Calcul des types de biens d'investissement dynamiquement
    const typeCount: Record<string, number> = {};

    // ✅ Utilisation du type Property
    properties.forEach((property: Property) => {
      if (property.investmentDetails) {
        const type = property.investmentDetails.investmentType || "Autres";
        typeCount[type] = (typeCount[type] || 0) + 1;
      }
    });

    // ✅ Transformer en tableau pour le graphique
    const formattedData = Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
    }));

    setInvestmentTypeData(formattedData);
  } catch (error) {
    console.error("Erreur lors de la récupération des types de biens à investir:", error);
  }
};



  return (
    <AdminLayout title="Tableau de bord">
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Biens Immobiliers</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{biensCount}</h3>
        <p className={`text-xs flex items-center mt-1 ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {growthRate >= 0 ? "+" : ""}
          {growthRate.toFixed(2)}% ce mois
        </p>
      </div>
      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-600 rounded-full flex items-center justify-center">
        <Building className="h-6 w-6 text-luxe-blue dark:text-white" />
      </div>
    </div>
  </CardContent>
</Card>

<Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisateurs</p>
        <h3 className="text-2xl font-bold mt-1">{usersCount.toLocaleString()}</h3>
        <p className={`text-xs flex items-center mt-1 ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {growthRate >= 0 ? "+" : ""}
          {growthRate.toFixed(2)}% ce mois
        </p>
      </div>
      <div className="h-12 w-12 bg-green-100 dark:bg-green-600 rounded-full flex items-center justify-center">
        <Users className="h-6 w-6 text-green-600 dark:text-white" />
      </div>
    </div>
  </CardContent>
</Card>

<Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Biens à Investir</p>
        <h3 className="text-2xl font-bold mt-1">{investmentCount}</h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          {investmentCount > 0 ? "+ " + investmentCount : "Aucun"} bien disponible
        </p>
      </div>
      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-600 rounded-full flex items-center justify-center">
        <TrendingUp className="h-6 w-6 text-blue-600 dark:text-white" />
      </div>
    </div>
  </CardContent>
</Card>


<Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Offres Exclusives</p>
        <h3 className="text-2xl font-bold mt-1">{exclusiveOffersCount}</h3>
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
          <ArrowUpRight className="h-3 w-3 mr-1" />
          +10% ce mois
        </p>
      </div>
      <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-600 rounded-full flex items-center justify-center">
        <BadgePercent className="h-6 w-6 text-yellow-600 dark:text-white" />
      </div>
    </div>
  </CardContent>
</Card>


      </div>
      
      {/* Charts */}
   
   {/*  <TabsTrigger 
      value="sales" 
      className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md transition hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      Ventes
    </TabsTrigger>*/}
   <Tabs defaultValue="properties" className="mb-6 ">
  <TabsList className="mb-4 flex space-x-2 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
    <TabsTrigger 
      value="properties" 
      className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md transition 
                 data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-600 
                 hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      Biens immobiliers
    </TabsTrigger>

    <TabsTrigger 
      value="investments" 
      className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md transition 
                 data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-600 
                 hover:bg-gray-200 dark:hover:bg-gray-600"
    >
      Biens à investir
    </TabsTrigger>
    
  </TabsList>



      {/*  <TabsContent value="sales">
  <Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
    <CardHeader>
      <CardTitle>Tendance des ventes</CardTitle>
      <CardDescription>Vue d'ensemble des ventes pour les 7 derniers mois</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="gray" className="dark:stroke-gray-600" />
            <XAxis 
  dataKey="name" 
  tick={{ fill: isDarkMode ? "#e5e7eb" : "gray" }}  // ✅ Texte gris clair en dark mode
  axisLine={{ stroke: isDarkMode ? "#4b5563" : "gray" }} // ✅ Ligne de l'axe gris foncé en dark mode
  tickLine={{ stroke: isDarkMode ? "#4b5563" : "gray" }} // ✅ Ticks (petites barres) en gris foncé en dark mode
/>
<YAxis 
  tick={{ fill: isDarkMode ? "#e5e7eb" : "gray" }}  // ✅ Texte gris clair en dark mode
  axisLine={{ stroke: isDarkMode ? "#4b5563" : "gray" }} // ✅ Ligne de l'axe gris foncé en dark mode
  tickLine={{ stroke: isDarkMode ? "#4b5563" : "gray" }} // ✅ Ticks (petites barres) en gris foncé en dark mode
/>

            <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", color: "white" }} />
            <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#93c5fd" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</TabsContent>
*/}
        
<TabsContent value="properties"> 
  <Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
    <CardHeader>
      <CardTitle className="text-gray-800 dark:text-white">Distribution des types de biens immobiliers</CardTitle>
      <CardDescription className="text-gray-500 dark:text-gray-400">Répartition des biens immobiliers par catégorie</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={propertyTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="gray" className="dark:stroke-gray-600" />
            <XAxis 
  dataKey="name" 
  tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} // ✅ Texte dynamique (gris clair en dark mode)
  stroke={isDarkMode ? "#6b7280" : "#374151"} // ✅ Ligne de l'axe (gris en dark mode)
/>
<YAxis 
  tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} // ✅ Texte dynamique (gris clair en dark mode)
  stroke={isDarkMode ? "#6b7280" : "#374151"} // ✅ Ligne de l'axe (gris en dark mode)
/>

            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", color: "white" }} 
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            <Bar dataKey="value" fill="#4f46e5" className="dark:fill-indigo-400" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</TabsContent>

<TabsContent value="investments">
  <Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
    <CardHeader>
      <CardTitle className="text-gray-800 dark:text-white">Distribution des types de biens à investir</CardTitle>
      <CardDescription className="text-gray-500 dark:text-gray-400">Répartition des biens d’investissement par type</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={investmentTypeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="gray" className="dark:stroke-gray-600" />
            <XAxis 
  dataKey="name" 
  tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} // ✅ Texte dynamique
  stroke={isDarkMode ? "#6b7280" : "#374151"} // ✅ Ligne de l'axe dynamique
/>
<YAxis 
  tick={{ fill: isDarkMode ? "#e5e7eb" : "#374151" }} // ✅ Texte dynamique
  stroke={isDarkMode ? "#6b7280" : "#374151"} // ✅ Ligne de l'axe dynamique
/>

            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", color: "white" }} 
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            <Bar dataKey="value" fill="#34d399" className="dark:fill-emerald-400" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</TabsContent>


      </Tabs>
      
      {/* Recent activity */}
      <Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white">
  <CardHeader>
    <CardTitle className="text-gray-800 dark:text-white">Activité récente</CardTitle>
    <CardDescription className="text-gray-500 dark:text-gray-400">
      Les dernières actions effectuées sur la plateforme
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <li key={activity.id} className="flex items-start space-x-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-2">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-white">{activity.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.user_name ? activity.user_name : "Utilisateur inconnu"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{formatTimeAgo(activity.created_at)}</p>
            </div>
          </li>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Aucune activité récente</p>
      )}
    </ul>

    <div className="mt-4 flex justify-end">
      <Button 
        variant="link" 
        onClick={() => navigate("/admin/activities")} 
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        Voir plus
      </Button>
    </div>
  </CardContent>
</Card>

    </AdminLayout>
  );
};

export default AdminDashboard;
