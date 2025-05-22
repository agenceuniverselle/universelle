import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  FileText,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import NewArticleForm from '@/components/blog/NewArticleForm';
import TestimonialsForm from './TestimonialsForm';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BlogPost } from '@/types/blog.types';
import { Testimonial } from '@/types/Testimonial';

const AdminContent = () => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [activeView, setActiveView] = useState<'blog' | 'temoignages'>('blog');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const navigate = useNavigate();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<'blog' | 'testimonial' | null>(null);
  const [blogArticles, setBlogArticles] = useState<BlogPost[]>([]);
  const { permissions } = useAuth();
  
  // ✅ Permissions
  const canViewBlogs = permissions.includes("view_blogs");
  const canCreateBlogs = permissions.includes("create_blogs");
  const canEditBlogs = permissions.includes("edit_blogs");
  const canDeleteBlogs = permissions.includes("delete_blogs");

  const canViewTestimonials = permissions.includes("view_testimonials");
  const canCreateTestimonials = permissions.includes("create_testimonials");
  const canEditTestimonials = permissions.includes("edit_testimonials");
  const canDeleteTestimonials = permissions.includes("delete_testimonials");

  useEffect(() => {
    if (activeView === 'blog') {
      axios.get('http://localhost:8000/api/blogs')
        .then((res) => {
          setBlogArticles(res.data);
        })
        .catch((err) => {
          console.error('Erreur lors du chargement des articles du blog:', err);
        });
    }
  }, [activeView]);
  
  const handleDelete = async () => {
    if (!selectedId || !selectedType) return;
  
    try {
      setIsDeleting(true);
  
      // ✅ Récupération du token JWT
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
  
      let deleteUrl = "";
  
      if (selectedType === "testimonial") {
        deleteUrl = `http://localhost:8000/api/testimonials/${selectedId}`;
      } else if (selectedType === "blog") {
        deleteUrl = `http://localhost:8000/api/admin/blogs/${selectedId}`;
      }
  
      if (deleteUrl) {
        await axios.delete(deleteUrl, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Token JWT dans les headers
          },
        });
  
        toast({
          title: "✅ Supprimé",
          description:
            selectedType === "testimonial"
              ? "Témoignage supprimé avec succès."
              : "Article supprimé avec succès.",
        });
  
        // ✅ Mise à jour de l'état local après suppression
        if (selectedType === "testimonial") {
          setTestimonials((prev) => prev.filter((t) => t.id !== selectedId));
        } else if (selectedType === "blog") {
          setBlogArticles((prev) => prev.filter((a) => a.id !== selectedId));
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          toast({
            title: "Erreur d'authentification",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
      }
      toast({
        title: "Erreur",
        description: "La suppression a échoué. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
      setSelectedId(null);
      setSelectedType(null);
    }
  };
  
  
  
  const renderStars = (rating: number) => {
    const rounded = Math.floor(rating);
  
    // ✅ Toujours afficher au moins 1 étoile si rating > 0
    const stars = rating > 0 && rounded === 0 ? 1 : rounded;
  
    return (
      <div className="flex gap-1 text-yellow-500">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>
    );
  };
  
  
  useEffect(() => {
    if (activeView === 'temoignages') {
      axios.get('/api/testimonials')
        .then(res => setTestimonials(res.data))
        .catch(err => console.error('Erreur chargement témoignages', err));
    }
  }, [activeView]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publié':
        return 'bg-green-100 text-green-800';
      case 'Brouillon':
        return 'bg-amber-100 text-amber-800';
      case 'Approuvé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <AdminLayout title="Gestion des contenus">

      {/* BOUTONS BLOG / TÉMOIGNAGE */}
      <div className="flex mb-6 justify-between items-center">
      <div className="flex space-x-2 border p-1 rounded-md bg-white dark:bg-gray-800 shadow-sm">
      <Button
            onClick={() => setActiveView('blog')}
            className={`flex items-center gap-2 transition-all px-4 py-2 ${
              activeView === 'blog'
              ? 'bg-gold text-white hover:bg-gold-dark'
              : 'bg-white text-black hover:bg-gray-100 border border-transparent'
          }`}
        >
            📝 <span className="hidden sm:inline">Blog</span>
          </Button>

          <Button
            onClick={() => setActiveView('temoignages')}
            className={`flex items-center gap-2 transition-all px-4 py-2 ${
              activeView === 'temoignages'
              ? 'bg-gold text-white hover:bg-gold-dark'
              : 'bg-white text-black hover:bg-gray-100 border border-transparent'
          }`}
        >
            💬 <span className="hidden sm:inline">Témoignages</span>
          </Button>
        </div>

        <div className="flex gap-2">
        {canCreateBlogs && activeView === 'blog' && (
          <Button className="bg-luxe-blue hover:bg-luxe-blue/90 dark:bg-blue-500 dark:hover:bg-blue-600" onClick={() => setShowNewForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nouvel article
          </Button>
        )}
        {canCreateTestimonials && activeView === 'temoignages' && (
          <Button className="bg-luxe-blue" onClick={() => setShowTestimonialForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nouveau témoignage
          </Button>
        )}
        </div>
      </div>

      {/* CONTENU DYNAMIQUE */}
      {activeView === 'blog' ? (
  canViewBlogs ? (
            <Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
          <CardHeader>
            <CardTitle  className="dark:text-white" >Articles du blog</CardTitle>
            <CardDescription className="dark:text-gray-300">Gérez les articles du blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
            <Table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
            <TableHeader className="bg-gray-100 dark:bg-gray-700">
    <TableRow>
      <TableHead className="dark:text-gray-200">ID</TableHead>
      <TableHead className="dark:text-gray-200">Titre</TableHead>
      <TableHead className="dark:text-gray-200">Auteur</TableHead>
      <TableHead className="dark:text-gray-200">Fonction</TableHead>
      <TableHead className="dark:text-gray-200">Type</TableHead>
      <TableHead className="dark:text-gray-200">Catégorie</TableHead>
      <TableHead className="dark:text-gray-200">Date</TableHead>
      <TableHead className="dark:text-gray-200">Note</TableHead>
      <TableHead className="text-right dark:text-gray-200">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {blogArticles.length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-gray-500 py-6">
        Aucun article de blog pour le moment.
      </TableCell>
    </TableRow>
  ) : (
    blogArticles.map((article) => (
      <TableRow key={article.id}>
        <TableCell className="font-medium">{article.id}</TableCell>
        <TableCell>
  {article.title 
    ? article.title.length > 5 
      ? article.title.slice(0, 5) + "..." 
      : article.title 
    : '—'}
</TableCell>
        <TableCell>{article.author}</TableCell>
        <TableCell>{article.author_function || '—'}</TableCell>
        <TableCell>{article.author_type === 'interne' ? 'Interne' : 'Externe'}</TableCell>
        <TableCell>{article.category}</TableCell>
        <TableCell>{article.date}</TableCell>
        <TableCell>
  {renderStars(article.rating)}
</TableCell>

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
  onClick={() => navigate(`/admin/blogs/${article.id}`)}
>
  <Eye className="h-4 w-4" />
  Voir
</DropdownMenuItem>
<DropdownMenuItem
  onClick={() => navigate(`/admin/blogs/edit/${article.id}`)} // ← correction ici
  className="flex items-center gap-2 cursor-pointer"
>
  <Pencil className="h-4 w-4" />
  Modifier
</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
  className="flex items-center gap-2 text-red-600"
  onSelect={(e) => {
    e.preventDefault();
    setSelectedId(article.id);
    setSelectedType('blog');
    setConfirmDeleteOpen(true);
  }}
>
  <Trash2 className="h-4 w-4" />
  Supprimer
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
     ) : (
      <div className="flex items-center justify-center h-[60vh] text-center">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Accès refusé</h2>
        <p className="text-gray-600">Vous n'avez pas la permission de voir les biens d'investissement.</p>
        <Button onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
        </div>
    </div>
    )

  ) : activeView === 'temoignages' ? (
    canViewTestimonials ? (
<Card className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <CardHeader>
      <CardTitle className="dark:text-white">Témoignages</CardTitle>
      <CardDescription className="dark:text-gray-300" >Liste des témoignages des clients</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
      <Table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
        <TableHeader className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHead className="dark:text-gray-200">ID</TableHead>
              <TableHead className="dark:text-gray-200">Photo</TableHead>
              <TableHead className="dark:text-gray-200">Nom</TableHead>
              <TableHead className="dark:text-gray-200">Profession</TableHead>
              <TableHead className="dark:text-gray-200">Message</TableHead>
              <TableHead className="dark:text-gray-200">Date de création</TableHead>
              <TableHead className="text-right dark:text-gray-200">Actions</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-6">
                  Aucun témoignage pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((item) => (
                <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>

                  <TableCell>
                    {item.image ? (
                      <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold uppercase">
                      {item.name?.charAt(0)}
                    </div>
                  )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.fonction || '—'}</TableCell>
                  <TableCell>{item.quote}</TableCell>
                  <TableCell>
  {new Date(item.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    year: 'numeric',
    month: 'long',
  })}
</TableCell>
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
  onClick={() => navigate(`/admin/temoignages/edit/${item.id}`)}
>
  <Pencil className="h-4 w-4" />
  Modifier
</DropdownMenuItem>


  <DropdownMenuSeparator />

  <DropdownMenuItem
  className="flex items-center gap-2 text-red-600"
  onSelect={(e) => {
    e.preventDefault();
    setSelectedId(item.id);
    setSelectedType('testimonial'); // 👈 ajoute ceci
    setConfirmDeleteOpen(true);
  }}
>
  <Trash2 className="h-4 w-4" />
  Supprimer
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
) : (
  <div className="flex items-center justify-center h-[60vh] text-center">
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Accès refusé</h2>
    <p className="text-gray-600">Vous n'avez pas la permission de voir les biens d'investissement.</p>
    <Button onClick={() => navigate('/admin')}>Retour au tableau de bord</Button>
    </div>
</div>
)
) : null}


      <NewArticleForm
        open={showNewForm}
        onOpenChange={setShowNewForm}
        onSubmit={(article) => {
          console.log('Nouvel article:', article);
          setShowNewForm(false);
        }}
      />
      <TestimonialsForm
        open={showTestimonialForm}
        onOpenChange={setShowTestimonialForm}
        onTestimonialAdded={() => {
          console.log('Témoignage ajouté !');
          setShowTestimonialForm(false);
        }}
      />
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
  <AlertDialogContent className="
      bg-white dark:bg-gray-800
      text-black dark:text-gray-100
      border border-gray-300 dark:border-gray-700
      rounded-md shadow-lg
      p-6
    "
  >
    <AlertDialogHeader>
      <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
      <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Cette action est irréversible. 
        Voulez-vous vraiment supprimer ce {selectedType === 'blog' ? 'article de blog' : 'témoignage'} ?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel  className="
          bg-gray-200 dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          px-4 py-2 rounded-md
          border border-gray-300 dark:border-gray-600
          transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105
        " >Annuler</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
className="
          bg-red-600 text-white
          hover:bg-red-700
          px-4 py-2 rounded-md
          transition-all duration-200 hover:scale-105
          disabled:opacity-70 disabled:cursor-not-allowed
        "        disabled={isDeleting}
      >
        {isDeleting ? "Suppression..." : "Oui, supprimer"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


    </AdminLayout>
  );
};

export default AdminContent;
