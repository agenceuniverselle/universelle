
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, SaveIcon, XIcon } from 'lucide-react';
import { BlogPost } from '@/types/blog.types';
import { toast } from "@/hooks/use-toast";

interface ArticleEditorProps {
  article: BlogPost;
  onSave: (article: BlogPost) => void;
  onCancel: () => void;
}

const ArticleEditor = ({ article, onSave, onCancel }: ArticleEditorProps) => {
  const [editedArticle, setEditedArticle] = useState<BlogPost>({ ...article });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setEditedArticle(prev => ({ ...prev, category: value }));
  };

  const handleSave = () => {
    // Simple validation
    if (!editedArticle.title || !editedArticle.excerpt || !editedArticle.content) {
      toast({
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    onSave(editedArticle);
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Modifier l'article</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={onCancel}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Titre</label>
          <Input 
            id="title"
            name="title"
            value={editedArticle.title}
            onChange={handleChange}
            placeholder="Titre de l'article"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="excerpt" className="text-sm font-medium">Extrait</label>
          <Textarea 
            id="excerpt"
            name="excerpt"
            value={editedArticle.excerpt}
            onChange={handleChange}
            placeholder="Extrait de l'article"
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">Contenu</label>
          <Textarea 
            id="content"
            name="content"
            value={editedArticle.content || ''}
            onChange={handleChange}
            placeholder="Contenu de l'article"
            className="resize-none min-h-[300px]"
            rows={12}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Catégorie</label>
            <Select
              value={editedArticle.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investment">Investissement Immobilier</SelectItem>
                <SelectItem value="market">Marché Immobilier Marocain</SelectItem>
                <SelectItem value="finance">Rentabilité & Financement</SelectItem>
                <SelectItem value="development">Développement & Promotion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium">Auteur</label>
            <Input 
              id="author"
              name="author"
              value={editedArticle.author}
              onChange={handleChange}
              placeholder="Nom de l'auteur"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">URL de l'image</label>
            <Input 
              id="image"
              name="image"
              value={editedArticle.image}
              onChange={handleChange}
              placeholder="URL de l'image"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="readTime" className="text-sm font-medium">Temps de lecture</label>
            <Input 
              id="readTime"
              name="readTime"
              value={editedArticle.readTime}
              onChange={handleChange}
              placeholder="Temps de lecture (ex: 5 min)"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-6 flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={handleSave} className="bg-luxe-blue hover:bg-luxe-blue/90">
          <SaveIcon className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleEditor;
