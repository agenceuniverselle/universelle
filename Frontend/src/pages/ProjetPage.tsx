import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Plus, Search, Pencil, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProjectForm from './admin/ProjectForm'; // Assuming ProjectForm is in the same directory under an 'admin' folder

interface Project {
  id: number;
  name: string;
  details: string;
  location: string;
  type: string;
  surface: string;
  status: string;
  images: string[]; // This will now contain full URLs from the API
  created_at: string;
  updated_at: string;
}

const ProjetPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/projects');
      console.log('API Response data:', response.data); // Inspect the full data structure here
      setProjects(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast({
        title: "Erreur",
        description: "Échec du chargement des projets. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProjectClick = () => {
    setEditingProject(null); // No project data for adding
    setIsFormOpen(true);
  };

  const handleEditProjectClick = (project: Project) => {
    setEditingProject(project); // Pass the full project object
    setIsFormOpen(true);
  };

  const handleProjectFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProject(null); // Clear editing project after success
    fetchProjects(); // Re-fetch projects to update the list
    toast({
      title: "Succès",
      description: "Projet enregistré avec succès.",
    });
  };

  const handleDeleteClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProjectId) return;

    try {
        setIsDeleting(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
            toast({
                title: "Erreur d'authentification",
                description: "Votre session a expiré. Veuillez vous reconnecter.",
                variant: "destructive",
            });
            navigate("/admin");
            return;
        }

        const url = `http://localhost:8000/api/projects/${selectedProjectId}`;
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            toast({
                title: "Supprimé",
                description: "Projet supprimé avec succès.",
            });
            fetchProjects(); // Rafraîchir la liste
        } else {
            throw new Error("La suppression a échoué");
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        toast({
            title: "Erreur",
            description: "La suppression du projet a échoué. Veuillez réessayer.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
        setConfirmDeleteOpen(false);
        setSelectedProjectId(null);
    }
};

  const filteredProjects = projects.filter(project => {
    const name = project.name?.toLowerCase() || '';
    const details = project.details?.toLowerCase() || '';
    const location = project.location?.toLowerCase() || '';
    const type = project.type?.toLowerCase() || '';

    return (
      name.includes(searchTerm.toLowerCase()) ||
      details.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase())
    );
  });

  const getShortDescription = (description: string | null) => {
    if (!description) return 'N/A';
    return description.length > 70
      ? description.substring(0, 70) + '...'
      : description;
  };

  const getStatusBadgeClass = (status: string | null) => {
    if (status === 'Livré') {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    } else if (status === 'En cours') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    } else {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <AdminLayout title="Gestion des Projets Réalisés">
      <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold dark:text-white">Projets Réalisés</CardTitle>
            <CardDescription className="dark:text-gray-300">Gérez les projets achevés de l'agence.</CardDescription>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Rechercher un projet..."
                className="pl-9 w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddProjectClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Ajouter un Nouveau Projet
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
            <Table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
              <TableHeader className="bg-gray-100 dark:bg-gray-700">
  <TableRow>
    <TableHead className="dark:text-gray-200">ID</TableHead>
    <TableHead className="dark:text-gray-200">Image</TableHead>
    <TableHead className="dark:text-gray-200">Nom</TableHead> {/* peut être supprimé si intégré dans Nom */}
    <TableHead className="dark:text-gray-200">Surface</TableHead> {/* Nouvelle colonne */}
    <TableHead className="dark:text-gray-200">Type</TableHead>
    <TableHead className="dark:text-gray-200">Statut</TableHead>
    <TableHead className="dark:text-gray-200">Description</TableHead>
    <TableHead className="text-right dark:text-gray-200">Actions</TableHead>
  </TableRow>
</TableHeader>

              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                      Aucun projet trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.id}</TableCell>
                       <TableCell>
                        {/* Display the first image if available */}
                        {project.images && project.images.length > 0 && project.images[0] ? (
                          <img
                            src={project.images[0]} // Use the full URL directly from the API response
                            alt={project.name || 'Image du projet'}
                            className="w-16 h-12 object-cover rounded-md"
                            onError={(e) => {
                              console.error('Erreur de chargement image:', project.images[0], e);
                              e.currentTarget.style.display = 'none'; // Hide broken image icon
                              // Optionally, display a placeholder icon or text here
                            }}
                          />
                        ) : (
                          <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-xs text-center">Aucune image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
  <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
  <div className="text-sm text-gray-500 dark:text-gray-400">{project.location}</div>
</TableCell>

<TableCell>{project.surface} m²</TableCell>
                      <TableCell>{project.type || 'N/A'}</TableCell>
                      
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
                          {project.status || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{getShortDescription(project.details)}</TableCell>
                     
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                           
                            <DropdownMenuItem
                              className="flex items-center gap-2"
                              onClick={() => handleEditProjectClick(project)}
                            >
                              <Pencil className="h-4 w-4" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="flex items-center gap-2 text-red-600"
                              onSelect={(e) => {
                                e.preventDefault(); // Prevent dropdown from closing immediately
                                handleDeleteClick(project.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ProjectForm component */}
      <ProjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingProject} // Pass the project data to the form
        isEditing={!!editingProject} // Set to true if editingProject is not null
        onProjectSuccess={handleProjectFormSuccess}
      />

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Voulez-vous vraiment supprimer ce projet ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Oui, supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ProjetPage;