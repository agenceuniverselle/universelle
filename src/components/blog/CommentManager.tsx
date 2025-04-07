
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckIcon, XIcon, Trash, MessageSquare, Search, Filter } from 'lucide-react';
import { BlogPost } from '@/types/blog.types';
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  status: 'Approuvé' | 'En attente' | 'Rejeté';
}

interface CommentManagerProps {
  article: BlogPost;
  onBack: () => void;
}

const CommentManager = ({ article, onBack }: CommentManagerProps) => {
  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Mohamed El Fassi',
      content: 'Excellent article, merci pour ces informations précieuses sur le marché immobilier marocain !',
      date: '15/03/2024',
      status: 'Approuvé'
    },
    {
      id: 2,
      author: 'Sarah Benani',
      content: "J'envisage d'investir à Marrakech, cet article m'a beaucoup éclairé sur les opportunités.",
      date: '13/03/2024',
      status: 'Approuvé'
    },
    {
      id: 3,
      author: 'Rachid Alaoui',
      content: 'Pourriez-vous détailler davantage les procédures administratives pour les étrangers ?',
      date: '12/03/2024',
      status: 'En attente'
    },
    {
      id: 4,
      author: 'Thomas Laurent',
      content: 'Quelles sont les meilleures zones à Casablanca pour un investissement locatif ?',
      date: '10/03/2024',
      status: 'En attente'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const articleCommentsCount = article.comments || 0;

  const handleApprove = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: 'Approuvé' } 
        : comment
    ));
    
    toast({
      title: "Commentaire approuvé",
      description: "Le commentaire a été approuvé et est maintenant visible.",
    });
  };

  const handleReject = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: 'Rejeté' } 
        : comment
    ));
    
    toast({
      title: "Commentaire rejeté",
      description: "Le commentaire a été rejeté et n'est plus visible.",
    });
  };

  const handleDelete = (commentId: number) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    
    toast({
      title: "Commentaire supprimé",
      description: "Le commentaire a été définitivement supprimé.",
    });
  };

  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    comment.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approuvé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-amber-100 text-amber-800';
      case 'Rejeté':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Commentaires</h2>
          <p className="text-gray-500">
            <span className="font-medium">{article.title}</span>
            <span className="mx-2">•</span>
            <span>{articleCommentsCount} commentaires</span>
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Gestion des commentaires</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher un commentaire..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="ml-2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="approved">Approuvés</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <CommentTable 
                comments={filteredComments}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
              />
            </TabsContent>
            
            <TabsContent value="approved">
              <CommentTable 
                comments={filteredComments.filter(c => c.status === 'Approuvé')}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
              />
            </TabsContent>
            
            <TabsContent value="pending">
              <CommentTable 
                comments={filteredComments.filter(c => c.status === 'En attente')}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
              />
            </TabsContent>
            
            <TabsContent value="rejected">
              <CommentTable 
                comments={filteredComments.filter(c => c.status === 'Rejeté')}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <p className="text-sm text-gray-500">
            Les commentaires approuvés sont affichés publiquement sur votre site.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

interface CommentTableProps {
  comments: Comment[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
  getStatusColor: (status: string) => string;
}

const CommentTable = ({ comments, onApprove, onReject, onDelete, getStatusColor }: CommentTableProps) => {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-lg font-medium">Aucun commentaire</h3>
        <p className="text-sm text-gray-500 mt-1">
          Il n'y a pas de commentaires correspondant à ces critères.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Auteur</TableHead>
            <TableHead>Commentaire</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell className="font-medium">{comment.author}</TableCell>
              <TableCell>
                <p className="max-w-md truncate">{comment.content}</p>
              </TableCell>
              <TableCell>{comment.date}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(comment.status)}>
                  {comment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-1">
                {comment.status !== 'Approuvé' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onApprove(comment.id)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                )}
                {comment.status !== 'Rejeté' && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onReject(comment.id)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(comment.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommentManager;
