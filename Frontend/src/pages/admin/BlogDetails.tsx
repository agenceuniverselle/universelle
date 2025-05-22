import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronLeft,
  Pencil,
  Trash,
  Loader2,
  Star
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { BlogPost } from '@/types/blog.types';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get(`/api/blogs/${id}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement article :", err);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
  
    try {
      setIsDeleting(true);
  
      // ✅ Récupération du token JWT
      const token = localStorage.getItem("access_token");
      console.log("🔑 Token récupéré :", token);
  
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
  
      await axios.delete(`/api/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Ajout du token JWT
        },
      });
  
      toast({ title: "✅ Supprimé", description: "L'article a été supprimé." });
      navigate("/admin/blog");
    } catch (error) {
      console.error("❌ Erreur de suppression :", error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
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
  

  if (loading) {
    return (
      <AdminLayout title="Chargement...">
        <p className="text-gray-600">Chargement des détails de l'article...</p>
      </AdminLayout>
    );
  }

  if (!article) {
    return (
      <AdminLayout title="Article introuvable">
        <p className="text-red-600">Aucun article trouvé avec l'ID {id}.</p>
      
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Article : ${article.title}`}>
      <div className="mb-6 space-y-6">
        <Button variant="outline" onClick={() => navigate('/admin/content')} className='dark:text-black'>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

 <Card className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">       
    <CardHeader>
  <div className="flex items-center justify-between w-full">
    {/* Titre à gauche */}
    <CardTitle className="text-2xl font-semibold">
      {article.title}
    </CardTitle>

    {/* Boutons à droite */}
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={() => navigate(`/admin/blogs/edit/${article.id}`)}
        className="dark:text-black"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Modifier
      </Button>
      <Button
        variant="outline"
        className="text-red-600"
        onClick={() => setConfirmDeleteOpen(true)}
      >
        <Trash className="w-4 h-4 mr-2" />
        Supprimer
      </Button>
    </div>
  </div>
</CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-gray-500">{article.date}</div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-white">
              <div><strong>Auteur :</strong> {article.author}</div>
              <div><strong>Fonction :</strong> {article.author_function || '—'}</div>
              <div><strong>Type :</strong> {article.author_type === 'interne' ? 'Interne' : 'Externe'}</div>
              <div><strong>Catégorie :</strong> {article.category}</div>
              {article.rating > 0 && (
                <div className="flex items-center gap-2">
                  <strong>Note :</strong>
                  {renderStars(article.rating)}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Article:</h3>
              <div
                className="max-w-none"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
            </div>

            {article.similar_links?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Liens similaires</h3>
                <ul className="list-disc pl-5 text-blue-600">
                  {article.similar_links.map((link: string, index: number) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="
          bg-gray-200 dark:bg-gray-700
          text-gray-800 dark:text-gray-200
          px-4 py-2 rounded-md
          border border-gray-300 dark:border-gray-600
          transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105
        " >
          Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="
          bg-red-600 text-white
          hover:bg-red-700
          px-4 py-2 rounded-md
          transition-all duration-200 hover:scale-105
          disabled:opacity-70 disabled:cursor-not-allowed
        "
      
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Oui, supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default BlogDetails;
