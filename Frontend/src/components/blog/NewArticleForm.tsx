import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { X, Upload, Loader2, Power } from 'lucide-react';
import { toast } from '@/hooks/use-toast'; // ou depuis shadcn ou ton fichier local
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface BlogArticleInput {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  images: string[];
  similar_links: string[];
  newsletter_email?: string;
}

const categorySuggestions = [
  'Investissement Immobilier',
  'Guide d’Achat / Vente',
  'Marché Immobilier au Maroc',
  'Conseils d’Experts',
  'Construction & Développement',
  'Crowdfunding Immobilier'
];

interface NewArticleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (article: BlogArticleInput) => void;
}

const NewArticleForm = ({ open, onOpenChange, onSubmit }: NewArticleFormProps) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [authorType, setAuthorType] = useState<'interne' | 'externe'>('interne');
  const [author, setAuthor] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [similarLinks, setSimilarLinks] = useState<string[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [excerptInitialized, setExcerptInitialized] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [authorFunction, setAuthorFunction] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!excerptInitialized && excerptRef.current) {
      excerptRef.current.innerHTML = excerpt;
      setExcerptInitialized(true);
    }
  }, [excerpt, excerptInitialized]);
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .editor-content blockquote {
        border-left: 4px solid #ccc;
        padding-left: 1rem;
        margin: 1rem 0;
        font-style: italic;
        background-color: #f9f9f9;
        color: #555;
      }
  
      .editor-content h1 {
        font-size: 2rem;
        font-weight: bold;
        margin: 1rem 0 0.5rem;
      }
  
      .editor-content h2 {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 1rem 0 0.5rem;
      }
  
      .editor-content h3 {
        font-size: 1.25rem;
        font-weight: bold;
        margin: 0.75rem 0 0.5rem;
      }
  
      .editor-content address {
        font-style: italic;
        color: #777;
        margin: 0.5rem 0;
      }
  
      .editor-content pre {
        background: #f5f5f5;
        padding: 0.75rem;
        font-family: monospace;
        overflow-x: auto;
        border-radius: 6px;
        margin: 1rem 0;
      }
    `;
    document.head.appendChild(style);
  }, []);
  
  const excerptRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleInsertImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
  
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      const res = await axios.post('https://back-qhore.ondigitalocean.app/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      const imageUrl = res.data.url;
  
      const div = excerptRef.current;
      if (!div) return;
  
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = 'image';
      img.style.maxWidth = '100%';
      img.style.margin = '16px 0';
      img.style.borderRadius = '8px';
      img.style.display = 'block';
  
      const br = document.createElement('br');
      const selection = window.getSelection();
  
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(br.cloneNode());
        range.insertNode(img);
        range.insertNode(br.cloneNode());
  
        const newRange = document.createRange();
        newRange.setStartAfter(img);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        div.appendChild(br.cloneNode());
        div.appendChild(img);
        div.appendChild(br.cloneNode());
      }
  
      e.target.value = '';
    } catch (error) {
      console.error('Erreur lors de l\'upload d\'image', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'uploader l\'image.',
        variant: 'destructive',
      });
    }
  };
  
  const handleAddSimilarLink = () => setSimilarLinks([...similarLinks, '']);
  const handleChangeSimilarLink = (value: string, index: number) => {
    const updated = [...similarLinks];
    updated[index] = value;
    setSimilarLinks(updated);
  };
  const handleRemoveSimilarLink = (index: number) => {
    const updated = similarLinks.filter((_, i) => i !== index);
    setSimilarLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true); // 🔥 Active le chargement
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('excerpt', excerptRef.current?.innerHTML || '');
    formData.append('category', category);
    formData.append('author_type', authorType); // ✅ important
    formData.append('author', authorType === 'interne' ? 'Agence Universelle' : author);
  
    if (authorType === 'externe') {
      formData.append('author_function', authorFunction);
    }
  
    similarLinks.forEach((link, i) => {
      formData.append(`similar_links[${i}]`, link);
    });
  
    try {
      // ✅ Récupération du token depuis le localStorage
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
  
      // ✅ Requête sécurisée avec le token
      const res = await axios.post('https://back-qhore.ondigitalocean.app/api/admin/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ✅ Ajout du token dans les headers
        },
      });
  
      console.log('🟢 Article créé :', res.data);
      toast({
        title: '✅ Article publié avec succès',
        description: 'Votre article a été ajouté et enregistré dans la base de données.',
      });
      onSubmit(res.data);
      onOpenChange(false);
    } catch (err) {
      console.error('❌ Erreur lors de l’envoi :', err);
      toast({
        title: "Erreur de publication",
        description: "Impossible de publier l'article. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false); // ✅ Désactive le chargement même en cas d’erreur
    }
  };
  
  

  const filterSuggestions = (input: string) =>
    input.length >= 3 ? categorySuggestions.filter(cat => cat.toLowerCase().includes(input.toLowerCase())) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-luxe-blue dark:text-gray-100">Créer un nouvel article</DialogTitle>
          <DialogDescription>Remplissez les informations pour publier votre article de blog.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 ml-4">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required  className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
    w-80
  " 
/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} list="suggestions" required  className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
    w-80
  " 
/>
              <datalist id="suggestions">
                {filterSuggestions(category).map((s, i) => <option key={i} value={s} />)}
              </datalist>
            </div>
          </div>

          <div className="space-y-2 ml-4">
            <Label>Auteur</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={authorType === 'interne'} onChange={() => setAuthorType('interne')}  className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
/> Interne (Agence)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={authorType === 'externe'} onChange={() => setAuthorType('externe')}  className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 
/> Externe
              </label>
            </div>
            {authorType === 'externe' && (
              <div className="flex flex-col sm:flex-row gap-4">
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nom de l'auteur"
                required
                  className="flex-1
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 

              />
              <Input
                value={authorFunction}
                onChange={(e) => setAuthorFunction(e.target.value)}
                placeholder="Fonction de l'auteur (ex: Expert Immobilier)"
                required
                
                 className="flex-1
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  " 

              />
            </div>
            )}
          </div>

        <div className="space-y-1 ml-4">
  <Label>Résumé</Label>

  {/* Toolbar */}
  <div className="sticky top-0 z-10  max-w-[700px] bg-gray-100 border border-b-0 rounded-t-md p-2 flex gap-2 items-center dark:bg-gray-800">
  {/* Boutons de mise en forme */}
  <Button type="button" size="sm" variant="ghost" onClick={() => document.execCommand('bold')}>
    <b>B</b>
  </Button>
  <Button type="button" size="sm" variant="ghost" onClick={() => document.execCommand('italic')}>
    <i>I</i>
  </Button>
  <Button type="button" size="sm" variant="ghost" onClick={() => document.execCommand('underline')}>
    <u>U</u>
  </Button>

  <Button
    type="button"
    size="sm"
    variant="ghost"
    onClick={() => {
      const url = prompt("Entrez l'URL du lien :");
      if (url) document.execCommand('createLink', false, url);
    }}
  >
    🔗
  </Button>

  {/* Bouton image */}
  <Button type="button" size="sm" variant="ghost" onClick={handleInsertImage}>
    <Upload size={16} />
  </Button>
  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleInsertImageFile}
  />

  {/* Couleur du texte */}
  <label
    htmlFor="textColorPicker"
    className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer overflow-hidden relative mt-1"
    style={{ backgroundColor: "#000000" }}
    title="Couleur du texte"
  >
    <input
      type="color"
      id="textColorPicker"
      onChange={(e) => {
        const color = e.target.value;
        document.execCommand('foreColor', false, color);
        e.target.parentElement!.style.backgroundColor = color;
      }}
      className="opacity-0 absolute inset-0 cursor-pointer"
    />
  </label>

  {/* Selects côte à côte */}
  <Select
    defaultValue="P"
    onValueChange={(value) => document.execCommand("formatBlock", false, value)}
  >
    <SelectTrigger className="w-[160px] text-sm transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30">
      Structure HTML
    </SelectTrigger>
     <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
      <SelectItem value="P">Paragraphe</SelectItem>
      <SelectItem value="H1">Titre 1 (h1)</SelectItem>
      <SelectItem value="H2">Titre 2 (h2)</SelectItem>
      <SelectItem value="H3">Titre 3 (h3)</SelectItem>
      <SelectItem value="H4">Titre 4 (h4)</SelectItem>
      <SelectItem value="H5">Titre 5 (h5)</SelectItem>
      <SelectItem value="H6">Titre 6 (h6)</SelectItem>
      <SelectItem value="BLOCKQUOTE">Citation (blockquote)</SelectItem>
      <SelectItem value="ADDRESS">Adresse</SelectItem>
    </SelectContent>
  </Select>

  <Select
    defaultValue="Arial"
    onValueChange={(value) => document.execCommand("fontName", false, value)}
  >
    <SelectTrigger className="w-[160px] text-sm transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30">
      Police
    </SelectTrigger>
     <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
      <SelectItem value="Arial">Arial</SelectItem>
      <SelectItem value="Helvetica">Helvetica</SelectItem>
      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
      <SelectItem value="Courier New">Courier New</SelectItem>
      <SelectItem value="Georgia">Georgia</SelectItem>
      <SelectItem value="Verdana">Verdana</SelectItem>
      <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
      <SelectItem value="Impact">Impact</SelectItem>
      <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
      <SelectItem value="Tahoma">Tahoma</SelectItem>
      <SelectItem value="Palatino Linotype">Palatino Linotype</SelectItem>
      <SelectItem value="Lucida Console">Lucida Console</SelectItem>
    </SelectContent>
  </Select>
</div>

  {/* Zone d’édition */}
  <div
    ref={excerptRef}
    contentEditable
    className="min-h-[120px] border-t-0 border rounded-b-md p-3 bg-white editor-content transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
    max-w-[700px]

"
    onInput={(e) => setExcerpt((e.target as HTMLDivElement).innerHTML)}
  />
</div>




    

          <div className="space-y-2 ml-4">
            <Label>Liens similaires</Label>
            {similarLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input type="url" value={link} onChange={(e) => handleChangeSimilarLink(e.target.value, index)} />
                <Button type="button" variant="destructive" onClick={() => handleRemoveSimilarLink(index)}>
                  Supprimer
                </Button>
              </div>
            ))}
            <Button type="button" className='dark:text-black' variant="outline" onClick={handleAddSimilarLink}>Ajouter un lien</Button>
          </div>

          

          <div className="flex justify-end space-x-4 pt-4 mr-8">
            <Button type="button" variant="outline" className='dark:text-black' onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button
  type="submit"
  className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto transition-all duration-200 hover:scale-105 flex items-center justify-center"
  disabled={isPublishing}
>
  {isPublishing ? (
    <>
      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      Publication...
    </>
  ) : (
    <>
      <Power className="h-5 w-5 mr-2" />
      Publier
    </>
  )}
</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewArticleForm;
