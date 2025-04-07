
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { BlogPost } from '@/types/blog.types';

const categories = [
  { id: 'investment', name: 'Investissement Immobilier' },
  { id: 'market', name: 'Marché Immobilier Marocain' },
  { id: 'finance', name: 'Rentabilité & Financement' },
  { id: 'development', name: 'Développement & Promotion' }
];

interface NewArticleFormProps {
  onSubmit: (article: Partial<BlogPost>) => void;
  onCancel: () => void;
}

const NewArticleForm = ({ onSubmit, onCancel }: NewArticleFormProps) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [readTime, setReadTime] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newArticle: Partial<BlogPost> = {
      id: Date.now(),
      title,
      excerpt,
      category,
      author,
      readTime,
      image: imagePreview || 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=2073&auto=format&fit=crop',
      date: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    onSubmit(newArticle);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Button variant="ghost" onClick={onCancel} className="flex items-center gap-2 mb-6">
        <ArrowLeft size={16} />
        Retour aux articles
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-playfair text-luxe-blue">Créer un nouvel article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'article</Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez le titre de l'article"
                className="text-lg"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Résumé</Label>
              <Textarea 
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Entrez un résumé de l'article"
                className="min-h-[100px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Auteur</Label>
                <Input 
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nom de l'auteur"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="readTime">Temps de lecture</Label>
                <Input 
                  id="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="Ex: 5 min"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image principale</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Aperçu" 
                      className="mx-auto h-64 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview('')}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="py-10">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Cliquez pour télécharger une image</p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG jusqu'à 5MB</p>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                {!imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    Sélectionner une image
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
              <Button type="submit" className="bg-gold hover:bg-gold-dark">Publier l'article</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewArticleForm;
