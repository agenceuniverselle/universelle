import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, Search, SlidersHorizontal, User } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import BlogArticle from '@/components/blog/BlogArticle';
import NewArticleForm, { BlogArticleInput } from '@/components/blog/NewArticleForm';
import { BlogPost } from '@/types/blog.types';
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NewsletterSection from '@/components/blog/NewsletterSection';
import { useNavigate } from 'react-router-dom';
import ReadOnlyStars from '@/components/ui/ReadOnlyStars'; // 👈 ajuste selon ton dossier


enum BlogView {
  LIST,
  ARTICLE,
  NEW_ARTICLE
}

const Blog = () => {
  const navigate = useNavigate(); 
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<{ category: string }>({ category: '' });
  const [currentView, setCurrentView] = useState<BlogView>(BlogView.LIST);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [filters, setFilters] = useState<{ author: string }>({ author: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {
  const fetchArticles = async () => {
    try {
      const response = await axios.get('https://back-qhore.ondigitalocean.app/api/blogs');
      console.log('[API Response]', response.data);

      const data: BlogPost[] = response.data?.data || [];

      const formatted = data.map((item) => ({
        ...item,
        category: item.category?.toLowerCase().replace(/\s+/g, '-'),
      }));

      setBlogPosts(formatted);
    } catch (error) {
      console.error('Erreur lors du chargement des articles', error);
    } finally {
      setLoading(false);
    }
  };

  fetchArticles(); // ✅ TU OUBLIES CETTE LIGNE !!
}, []); // ✅ Ajoute cette ligne pour terminer le useEffect



  const filteredPosts = blogPosts.filter(post =>
    (selectedCategory.category === 'all' || !selectedCategory.category || post.category === selectedCategory.category) &&
    (filters.author === 'all' || !filters.author || post.author === filters.author) &&
    (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleArticleClick = (article: BlogPost) => {
    navigate(`/blog/${article.id}`);
  };

  const handleAddArticle = () => {
    setCurrentView(BlogView.NEW_ARTICLE);
    window.scrollTo(0, 0);
  };

  const formatDate = (input: string | number | Date) => {
    const date = new Date(input);
    if (isNaN(date.getTime())) return 'Date invalide';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleNewArticleSubmit = (article: BlogArticleInput) => {
    const div = document.createElement('div');
    div.innerHTML = article.excerpt;
    const firstImage = div.querySelector('img');
    const imageUrl = firstImage?.getAttribute('src') || '';
    const newPost: BlogPost = {
      ...article,
      id: Date.now(),
      image: imageUrl,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      created_at: '',
      author_function: ''
    };
    setBlogPosts((prev) => [newPost, ...prev]);
    setCurrentView(BlogView.LIST);
    toast.success("L'article a été publié avec succès !");
  };

  const handleBackToList = () => {
    setCurrentView(BlogView.LIST);
    setSelectedArticle(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case BlogView.ARTICLE:
        if (!selectedArticle) return null;
        return (
          <BlogArticle
            article={selectedArticle}
            onBack={handleBackToList}
            onSelectArticle={handleArticleClick}
          />
        );
      case BlogView.NEW_ARTICLE:
        return <NewArticleForm onSubmit={handleNewArticleSubmit} onOpenChange={handleBackToList} open={true} />;
      case BlogView.LIST:
      default:
        return (
          <MainLayout>
            <div className="flex flex-col min-h-screen bg-white">
              <Navbar />
              <div className="flex flex-col sm:flex-row gap-4 mt-32 ml-3 mr-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="w-full py-3 px-4 pr-12 rounded-md border-2 border-gray-200 focus:border-black outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="mt-6 flex justify-end w-full">
                <div className="flex gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="bg-white p-4 rounded-md shadow-sm border mb-6 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                      <Select
                        value={selectedCategory.category}
                        onValueChange={(value) => setSelectedCategory({ category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          {Array.from(new Set(blogPosts.map(p => p.category).filter(Boolean))).map((cat, i) => (
                            <SelectItem key={i} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                      <Select
                        value={filters.author}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, author: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les auteurs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les auteurs</SelectItem>
                          <SelectItem value="Agence Universelle">Interne (Agence Universelle)</SelectItem>
                          {[...new Set(blogPosts.map(p => p.author).filter(a => a !== 'Agence Universelle'))].map((author, i) => (
                            <SelectItem key={i} value={author}>{author}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map(post => {
  console.log('article:', post.title, 'rating:', post.rating, 'count:', post.rating_count);

  return (
    <div
      key={post.id}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => handleArticleClick(post)}
    >
      <div className="h-56 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white bg-gold px-3 py-1 rounded-full uppercase font-semibold">
            {post.category}
          </span>
          {post.rating != null && (
  <ReadOnlyStars rating={post.rating} size={20} />
)}

        </div>

        <h3 className="text-xl font-playfair font-bold text-luxe-blue mb-3">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {post.excerpt.replace(/<[^>]+>/g, '').slice(0, 160)}...
        </p>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span className="mr-3">{post.author}</span>
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(post.date)}</span>
          </div>
          <Button variant="link" className="text-gold hover:text-gold-dark">
            Lire l&apos;article
          </Button>
        </div>
      </div>
    </div>
  );
})}

                  </div>

                  {filteredPosts.length === 0 && (
                    <div className="text-center py-16">
                      <h3 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">Aucun article trouvé</h3>
                      <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
                      <Button
                        variant="outline"
                        className="border-gold text-gold hover:bg-gold hover:text-white"
                        onClick={() => {
                          setSelectedCategory({ category: 'all' });
                          setSearchQuery('');
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  )}
                </div>
              </section>

              <NewsletterSection />
            </div>
          </MainLayout>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {renderContent()}
    </div>
  );
};

export default Blog;
