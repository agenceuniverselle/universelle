
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Search, Filter, Image, FileText, Star, MessageSquare } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AdminContent = () => {
  // Mock data for blog articles
  const blogArticles = [
    {
      id: 'B001',
      title: 'Les meilleures villes pour investir au Maroc en 2024',
      author: 'Ahmed Berrada',
      category: 'Investissement',
      status: 'Publié',
      date: '10/03/2024',
      views: 1250,
      comments: 15
    },
    {
      id: 'B002',
      title: 'Guide complet pour les investisseurs étrangers',
      author: 'Sophie Martin',
      category: 'Conseils',
      status: 'Brouillon',
      date: '08/03/2024',
      views: 0,
      comments: 0
    },
    {
      id: 'B003',
      title: 'Tendances du marché immobilier de luxe',
      author: 'Karim Alaoui',
      category: 'Marché',
      status: 'Publié',
      date: '01/03/2024',
      views: 980,
      comments: 8
    },
    {
      id: 'B004',
      title: 'Comment financer votre bien immobilier',
      author: 'Leila Benjelloun',
      category: 'Financement',
      status: 'Publié',
      date: '25/02/2024',
      views: 1750,
      comments: 23
    },
  ];

  // Mock data for testimonials
  const testimonials = [
    {
      id: 'T001',
      client: 'Jean Dupont',
      rating: 5,
      content: "J'ai eu une expérience exceptionnelle avec l'Agence Universelle. Leur professionnalisme et leur expertise m'ont permis de trouver la villa de mes rêves à Marrakech.",
      status: 'Approuvé',
      date: '12/03/2024'
    },
    {
      id: 'T002',
      client: 'Marie Leclerc',
      rating: 4,
      content: "Très satisfaite de l'accompagnement fourni pendant tout le processus d'achat. L'équipe est réactive et à l'écoute.",
      status: 'En attente',
      date: '08/03/2024'
    },
    {
      id: 'T003',
      client: 'Robert Martin',
      rating: 5,
      content: "Un service de qualité exceptionnelle. Je recommande vivement cette agence pour tous vos projets immobiliers au Maroc.",
      status: 'Approuvé',
      date: '01/03/2024'
    },
  ];

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

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Gestion des contenus">
      <Tabs defaultValue="blog" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher un article..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon" className="ml-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Articles du blog</CardTitle>
                  <CardDescription>Gérez les articles du blog et leur contenu</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Titre</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vues</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                              <FileText className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="font-medium">{article.title}</div>
                              <div className="text-xs text-gray-500">
                                {article.comments} commentaires
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{article.date}</TableCell>
                        <TableCell>{article.views.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Voir l'article</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {article.status === 'Brouillon' ? (
                                <DropdownMenuItem>Publier</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Dépublier</DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Gérer les commentaires</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="testimonials">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher un témoignage..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un témoignage
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Témoignages clients</CardTitle>
                  <CardDescription>Gérez les avis et témoignages de vos clients</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Évaluation</TableHead>
                      <TableHead>Témoignage</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell className="font-medium">{testimonial.id}</TableCell>
                        <TableCell>{testimonial.client}</TableCell>
                        <TableCell>{renderStars(testimonial.rating)}</TableCell>
                        <TableCell>
                          <p className="truncate max-w-xs">{testimonial.content}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(testimonial.status)}>
                            {testimonial.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{testimonial.date}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                              <DropdownMenuItem>Modifier</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {testimonial.status === 'En attente' ? (
                                <DropdownMenuItem>Approuver</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Masquer</DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher une page..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="bg-luxe-blue hover:bg-luxe-blue/90">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle page
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pages du site</CardTitle>
                  <CardDescription>Gérez les pages statiques et leur contenu</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Dernière modification</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Accueil</TableCell>
                      <TableCell>/</TableCell>
                      <TableCell>15/03/2024</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">À propos</TableCell>
                      <TableCell>/a-propos</TableCell>
                      <TableCell>10/03/2024</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Nos Services</TableCell>
                      <TableCell>/nos-services</TableCell>
                      <TableCell>05/03/2024</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Contact</TableCell>
                      <TableCell>/contact</TableCell>
                      <TableCell>01/03/2024</TableCell>
                      <TableCell>Admin</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminContent;
