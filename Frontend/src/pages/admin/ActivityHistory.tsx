import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isValid } from "date-fns";
import CustomPagination from "@/components/ui/CustomPagination"; // ✅ Utilisation de la pagination personnalisée

const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Nombre d'activités par page

  useEffect(() => {
    fetchActivities();
  }, [page, searchTerm, selectedDate]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("Erreur : Token non trouvé. Vous devez être connecté.");
        return;
      }

      const response = await axios.get("https://back-qhore.ondigitalocean.app/api/activities", {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Token ajouté dans les headers
        },
        params: {
          limit,
          page,
          search: searchTerm,
          date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        },
      });

      setActivities(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error("Erreur lors du chargement des activités :", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non définie";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "dd/MM/yyyy HH:mm") : "Date invalide";
  };

  return (
    <AdminLayout title="Historique des Activités">
     <Card className="bg-white dark:bg-gray-800 text-gray-700 dark:text-white transition-colors duration-300">
  <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <CardTitle className="text-gray-800 dark:text-white">Historique des Activités</CardTitle>
      <CardDescription className="text-gray-500 dark:text-gray-400">
        Suivez toutes les activités effectuées dans le système.
      </CardDescription>
    </div>

    <div className="flex items-center gap-4">
      <Input
        placeholder="Rechercher une activité..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-64 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
      />
     <div className="flex items-center">
  <Calendar className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-200" />
  <DatePicker
    selected={selectedDate}
  onChange={(date: Date | null) => setSelectedDate(date)}
    placeholderText="Sélectionner une date"
    className="w-40 px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
    calendarClassName="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 shadow-lg rounded-md"
    dayClassName={(date) =>
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear()
        ? "bg-blue-500 text-white dark:bg-blue-600 rounded-full"
        : "hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 rounded-full"
    }
    weekDayClassName={() => "text-gray-600 dark:text-gray-400"}
    monthClassName={(date) => "text-gray-800 dark:text-white"}
    popperClassName="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 shadow-md rounded-md"
  />
</div>

      <Button 
        onClick={fetchActivities} 
        className="bg-luxe-blue text-white hover:bg-luxe-blue/90 dark:bg-blue-600 dark:hover:bg-blue-500"
      >
        <Search className="mr-2 h-4 w-4" />
        Rechercher
      </Button>
    </div>
  </CardHeader>

  <CardContent className="mt-4">
    <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
      <Table className="w-full text-gray-800 dark:text-white">
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
          <TableRow>
            <TableHead className="text-gray-600 dark:text-gray-300">ID</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300">Type</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300">Description</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300">Utilisateur</TableHead>
            <TableHead className="text-gray-600 dark:text-gray-300">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-700 dark:text-gray-300">
                Chargement...
              </TableCell>
            </TableRow>
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <TableRow 
                key={activity.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <TableCell>{activity.id}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>{activity.user_name || "Utilisateur inconnu"}</TableCell>
                <TableCell>{formatDate(activity.created_at)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-gray-700 dark:text-gray-300">
                Aucun historique trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
 

          {/* ✅ Pagination */}
          <CustomPagination 
            totalPages={totalPages} 
            currentPage={page} 
            onPageChange={setPage} 
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ActivityHistory;
