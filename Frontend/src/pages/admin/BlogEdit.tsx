import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BlogPost } from '@/types/blog.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const [article, setArticle] = useState<Partial<BlogPost>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [authorType, setAuthorType] = useState<'interne' | 'externe'>('interne');
  const [authorFunction, setAuthorFunction] = useState('');
  const [similarLinks, setSimilarLinks] = useState<string[]>([]);
  const [hoveredImage, setHoveredImage] = useState<HTMLImageElement | null>(null);
  const [imageToReplace, setImageToReplace] = useState<HTMLImageElement | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<HTMLImageElement | null>(null);
  
  const excerptRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Position overlay dynamiquement
  useEffect(() => {
    const updatePosition = () => {
      if (!hoveredImage || !overlayRef.current) return;
      const rect = hoveredImage.getBoundingClientRect();
      overlayRef.current.style.top = `${window.scrollY + rect.top}px`;
      overlayRef.current.style.left = `${window.scrollX + rect.left + rect.width - 80}px`;
    };
  
    if (hoveredImage) {
      updatePosition();
      const interval = setInterval(updatePosition, 100); // 👈 assure le suivi dynamique
      return () => clearInterval(interval);
    }
  }, [hoveredImage]);
  

  // Survol d'image
  useEffect(() => {
    const container = excerptRef.current;
    if (!container) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' && container.contains(target)) {
        setHoveredImage(target as HTMLImageElement);
      } else {
        setHoveredImage(null);
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    return () => container.removeEventListener('mouseover', handleMouseOver);
  }, []);

  // Initial fetch & styles
useEffect(() => {
  if (id) {
    axios.get(`https://back-qhore.ondigitalocean.app/api/admin/blogs/${id}`).then((res) => {
      const data = res.data;
      setArticle(data);
      setAuthorType(data.author_type);
      setAuthorFunction(data.author_function || '');
      setSimilarLinks(data.similar_links || []);
      if (excerptRef.current) {
        excerptRef.current.innerHTML = data.excerpt || '';

        // wrap existing images in overlay wrapper
        const imgs = excerptRef.current.querySelectorAll('img');
        imgs.forEach((img) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'relative group inline-block my-4';
          wrapper.contentEditable = 'false';

          img.classList.add('rounded-md', 'max-w-full');

          const overlay = document.createElement('div');
          overlay.className = 'absolute inset-0 bg-black/30 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity';
          overlay.style.pointerEvents = 'none';

          const editBtn = document.createElement('button');
          editBtn.title = 'Remplacer';
          editBtn.className = 'bg-white rounded-md p-2 shadow';
          editBtn.style.pointerEvents = 'auto';
          editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" /></svg>`;
          editBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setImageToReplace(img);
            fileInputRef.current?.click();
            setHasChanges(true);
          };

          const deleteBtn = document.createElement('button');
          deleteBtn.title = 'Supprimer';
          deleteBtn.className = 'bg-red-500 text-white rounded-md p-2 shadow';
          deleteBtn.style.pointerEvents = 'auto';
          deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
          deleteBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setImageToDelete(img);
            setConfirmDeleteOpen(true);
          };

          overlay.appendChild(editBtn);
          overlay.appendChild(deleteBtn);

          img.parentNode?.insertBefore(wrapper, img);
          wrapper.appendChild(img);
          wrapper.appendChild(overlay);
        });
      }
    });
  }

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
    .editor-content img {
      display: block;
      max-width: 100%;
      border-radius: 8px;
      margin: 16px 0;
    }
  `;
  document.head.appendChild(style);

  // ✅ Le cleanup doit être une fonction
  return () => {
    document.head.removeChild(style);
  };
}, [id]);


  const insertImageWithOverlay = (url: string) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative group inline-block my-4';
    wrapper.contentEditable = 'false';
  
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Image insérée';
    img.className = 'rounded-md max-w-full';
  
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center gap-2 transition-opacity';
    overlay.style.pointerEvents = 'none';
  
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'bg-white rounded-full p-1 shadow cursor-pointer';
    editBtn.title = 'Remplacer';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      setImageToReplace(img);
      fileInputRef.current?.click();
    };
    editBtn.style.pointerEvents = 'auto';
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.className = 'bg-white rounded-full p-1 shadow cursor-pointer';
    deleteBtn.title = 'Supprimer';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      wrapper.remove();
    };
    deleteBtn.style.pointerEvents = 'auto';
  
    overlay.appendChild(editBtn);
    overlay.appendChild(deleteBtn);
  
    wrapper.appendChild(img);
    wrapper.appendChild(overlay);
  
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.collapse(false);
      range.insertNode(wrapper);
      range.setStartAfter(wrapper);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      excerptRef.current?.appendChild(wrapper);
    }
  };
  

  const handleInsertOrReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('https://back-qhore.ondigitalocean.app/api/admin/upload', formData);
      const url = res.data.url;

      if (imageToReplace) {
        imageToReplace.src = url;
        setImageToReplace(null);
      } else {
        insertImageWithOverlay(url);
      }
      setHasChanges(true); // 👈 Important pour activer le bouton Enregistrer

      e.target.value = '';
    } catch {
      toast({ title: 'Erreur', description: 'Échec de l’upload', variant: 'destructive' });
    }
  };

  // ✅ Utilisation du type BlogPost (ou votre type d'article spécifique)
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setArticle((prev: Partial<BlogPost>) => ({
    ...prev,
    [name]: value,
  }));
  setHasChanges(true);
};

  const handleSave = async () => {
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append('title', article.title);
    
    const rawExcerpt = excerptRef.current?.innerHTML || '';
    const dom = document.createElement('div');
    dom.innerHTML = rawExcerpt;
  
    // 🔥 Nettoyage des wrappers inutiles autour des images
    dom.querySelectorAll('div[contenteditable="false"]').forEach((wrapper) => {
      const img = wrapper.querySelector('img');
      if (img) {
        const cleanImg = img.cloneNode(true) as HTMLImageElement;
        wrapper.replaceWith(cleanImg); // remplace wrapper par image seule
      }
    });
  
    const cleanedExcerpt = dom.innerHTML;
    formData.append('excerpt', cleanedExcerpt);
    formData.append('category', article.category);
    formData.append('author_type', authorType);
    formData.append('author', authorType === 'interne' ? 'Agence Universelle' : article.author);
  
    if (authorType === 'externe') {
      formData.append('author_function', authorFunction);
    }
  
    similarLinks.forEach((link, i) => {
      formData.append(`similar_links[${i}]`, link);
    });
  
    try {
      // ✅ Récupération du token depuis le localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        toast({
          title: "Erreur d'authentification",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
  
      await axios.post(
        `https://back-qhore.ondigitalocean.app/api/blogs/${id}?_method=PUT`, // simulate PUT via POST
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, // ✅ Ajout du token dans les headers
          },
        }
      );
  
      toast({ title: '✅ Article mis à jour avec succès' });
      navigate('/admin/content');
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error);
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
        title: 'Erreur',
        description: "Impossible d'enregistrer. Vérifiez les données ou réessayez plus tard.",
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleAddLink = () => setSimilarLinks([...similarLinks, '']);
  const handleLinkChange = (value: string, index: number) => {
    const updated = [...similarLinks];
    updated[index] = value;
    setSimilarLinks(updated);
    setHasChanges(true);
  };
  const handleRemoveLink = (index: number) => {
    const updated = similarLinks.filter((_, i) => i !== index);
    setSimilarLinks(updated);
    setHasChanges(true);
  };

  if (!article) return <AdminLayout title="Chargement...">Chargement...</AdminLayout>;

  return (
    <AdminLayout title={`Modifier l'article - ${article.title}`}>
      <div className="space-y-6 relative">
        <Button variant="outline" onClick={() => navigate('/admin/content')}className='dark:text-black'>
          <ChevronLeft className="h-4 w-4 mr-2" /> Retour
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input name="title" value={article.title} onChange={handleInputChange} className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "/>
          </div>
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Input name="category" value={article.category} onChange={handleInputChange} className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "/>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Auteur</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" checked={authorType === 'interne'} onChange={() => setAuthorType('interne')} />
              Interne
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={authorType === 'externe'} onChange={() => setAuthorType('externe')} />
              Externe
            </label>
          </div>
          {authorType === 'externe' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input
  placeholder="Nom"
  value={article.author || ''} // Gérer le cas où l'auteur est undefined
  onChange={(e) =>
    setArticle((prev) => ({
      ...prev,
      author: e.target.value,
    }))
  }
  className="
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
                placeholder="Fonction"
                value={authorFunction}
                onChange={(e) => setAuthorFunction(e.target.value)}
                className="
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

      <div className="space-y-2 relative">
  <Label>Article</Label>

  {/* Toolbar sticky (local à l'éditeur) */}
  <div className="sticky top-0 z-10 bg-muted border border-b-0 rounded-t-md p-2 flex gap-2 flex-wrap dark:bg-gray-800">
    <Button type="button" size="sm" variant="ghost" onClick={() => document.execCommand('bold')}><b>B</b></Button>
    <Button type="button" size="sm" variant="ghost" onClick={() => document.execCommand('italic')}><i>I</i></Button>
    <Button type="button" size="sm" variant="ghost" onClick={() => document.execCommand('underline')}><u>U</u></Button>

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

    <Button type="button" size="sm" variant="ghost" onClick={() => {
      setImageToReplace(null);
      fileInputRef.current?.click();
    }}>
      📷
    </Button>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleInsertOrReplaceImage}
    />

    {/* Couleur texte */}
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
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.color = color;
            span.appendChild(range.extractContents());
            range.insertNode(span);
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            selection.addRange(newRange);
            setHasChanges(true);
          }
          e.target.parentElement!.style.backgroundColor = color;
        }}
        className="opacity-0 absolute inset-0 cursor-pointer"
      />
    </label>

    {/* Structure HTML */}
    <Select
      defaultValue="P"
      onValueChange={(value) => document.execCommand('formatBlock', false, value)}
    >
      <SelectTrigger className="w-[160px] transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Structure HTML" />
      </SelectTrigger>
      <SelectContent  className="
      bg-white text-black
      dark:bg-gray-900 dark:text-white
      border border-gray-200 dark:border-gray-700
    ">
        <SelectItem value="P">Paragraphe</SelectItem>
        <SelectItem value="H1">Titre 1</SelectItem>
        <SelectItem value="H2">Titre 2</SelectItem>
        <SelectItem value="H3">Titre 3</SelectItem>
        <SelectItem value="H4">Titre 4</SelectItem>
        <SelectItem value="H5">Titre 5</SelectItem>
        <SelectItem value="H6">Titre 6</SelectItem>
        <SelectItem value="BLOCKQUOTE">Citation</SelectItem>
        <SelectItem value="ADDRESS">Adresse</SelectItem>
      </SelectContent>
    </Select>

    {/* Police */}
    <Select
      defaultValue="Arial"
      onValueChange={(value) => document.execCommand('fontName', false, value)}
    >
      <SelectTrigger className="w-[200px] transition-all duration-200
      hover:border-luxe-blue/30
      bg-white text-black border-gray-300
      dark:bg-gray-900 dark:text-white dark:border-gray-700
      focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
      dark:focus:ring-luxe-blue/30
    ">
        <SelectValue placeholder="Police" />
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

  {/* Zone éditable */}
  <div
    ref={excerptRef}
    contentEditable
    className="min-h-[200px] max-h-[600px] overflow-y-auto border border-t-0 rounded-b-md p-3 bg-background text-foreground editor-content dark:bg-gray-800 dark:text-gray-100"
    onInput={() => setHasChanges(true)}
  />
</div>

        <div className="space-y-2">
          <Label>Liens similaires</Label>
          {similarLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input value={link} onChange={(e) => handleLinkChange(e.target.value, index)} className="
    transition-all duration-200
    hover:border-luxe-blue/30
    focus:scale-[1.01]
    bg-white text-black border-gray-300
    dark:bg-gray-900 dark:text-white dark:border-gray-700
    dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-luxe-blue/50
    dark:focus:ring-luxe-blue/30
  "/>
              <Button type="button" variant="destructive" onClick={() => handleRemoveLink(index)}>Supprimer</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddLink}className='dark:text-black'>Ajouter un lien</Button>
        </div>

        <div className="flex justify-end pt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sauvegarde...</> : <><Save className="h-4 w-4 mr-2" /> Enregistrer</>}
          </Button>
        </div>

        {hoveredImage && (
          <div
            ref={overlayRef}
            style={{
                position: 'absolute',
                top: 0, // nécessaire pour initialisation
                left: 0,
                zIndex: 1000,
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #ccc',
                padding: '4px 6px',
                borderRadius: '4px',
                display: 'flex',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'top 0.1s, left 0.1s'
              }}
              
          >
            
          </div>
        )}
      </div>
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Supprimer cette image ?</AlertDialogTitle>
      <AlertDialogDescription>
        Cette action supprimera l’image de l’article. Vous pourrez en ajouter une autre plus tard.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => {
          if (imageToDelete) {
            const wrapper = imageToDelete.closest('div[contenteditable="false"]');
            wrapper?.remove();
            setHasChanges(true);
            setImageToDelete(null);
            setConfirmDeleteOpen(false);
          }
        }}
      >
        Supprimer
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

    </AdminLayout>
  );
};

export default BlogEdit;
