
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  MessageSquare, 
  Eye, 
  Pencil, 
  Trash,
  MoreHorizontal 
} from 'lucide-react';
import { BlogPost } from '@/types/blog.types';

interface BlogTabProps {
  blogArticles: BlogPost[];
  handleCreateArticle: () => void;
  handleViewArticle: (article: BlogPost) => void;
  handleEditArticle: (article: BlogPost) => void;
  handlePublishToggle: (article: BlogPost) => void;
  handleManageComments: (article: BlogPost) => void;
  confirmDeleteArticle: (articleId: number) => void;
  getStatusColor: (status: string) => string;
  getCategoryName: (categoryId: string) => string;
}

const BlogTab: React.FC<BlogTabProps> = ({
  blogArticles,
  handleCreateArticle,
  handleViewArticle,
  handleEditArticle,
  handlePublishToggle,
  handleManageComments,
  confirmDeleteArticle,
  getStatusColor,
  getCategoryName
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = searchTerm 
    ? blogArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.author.toLowerCase().includes(searchTerm.toLowerCase()))
    : blogArticles;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Rechercher un article..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="ml-2">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="bg-luxe-blue hover:bg-luxe-blue/90" onClick={handleCreateArticle}>
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
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{`B${String(article.id).padStart(3, '0')}`}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                          {article.image ? (
                            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            <button 
                              onClick={() => handleViewArticle(article)}
                              className="hover:text-luxe-blue transition-colors text-left"
                            >
                              {article.title}
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            {article.comments} commentaires
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{getCategoryName(article.category)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(article.status || '')}>
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.date}</TableCell>
                    <TableCell>{article.views?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewArticle(article)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir l'article
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditArticle(article)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handlePublishToggle(article)}>
                            {article.status === 'Brouillon' ? (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publier
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2 text-gray-400" />
                                Dépublier
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageComments(article)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Gérer les commentaires
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => confirmDeleteArticle(article.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
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
    </>
  );
};

export default BlogTab;
