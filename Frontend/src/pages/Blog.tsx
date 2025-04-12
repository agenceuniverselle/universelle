
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, Search, User } from 'lucide-react';
import MainLayout from '@/components/layouts/MainLayout';
import BlogArticle from '@/components/blog/BlogArticle';
import NewArticleForm from '@/components/blog/NewArticleForm';
import { BlogPost } from '@/types/blog.types';
import { toast } from "sonner";
const categories = [
  { id: 'all', name: 'Tous les articles' },
  { id: 'investment', name: 'Investissement Immobilier' },
  { id: 'market', name: 'Marché Immobilier Marocain' },
  { id: 'finance', name: 'Rentabilité & Financement' },
  { id: 'development', name: 'Développement & Promotion' }
];

const initialBlogPosts  = [
  {
    id: 1,
    title: "Les meilleures stratégies d'investissement immobilier en 2024",
    excerpt: "Découvrez les stratégies qui permettent de maximiser votre rendement immobilier dans le contexte économique actuel.",
    image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=2073&auto=format&fit=crop',
    category: 'investment',
    author: 'Mohammed Benali',
    date: '15 mars 2024',
    readTime: '8 min'
  },
  {
    id: 2,
    title: "Guide complet sur l'immobilier de luxe à Marrakech",
    excerpt: "Analyse détaillée du marché de l'immobilier haut de gamme à Marrakech : opportunités, tendances et perspectives.",
    image: 'https://images.unsplash.com/photo-1545159446-d4004b15fb25?q=80&w=2070&auto=format&fit=crop',
    category: 'market',
    author: 'Sophia Karimi',
    date: '28 février 2024',
    readTime: '12 min'
  },
  {
    id: 3,
    title: "Comment financer votre investissement immobilier au Maroc",
    excerpt: "Exploration des différentes options de financement disponibles pour les investisseurs locaux et internationaux.",
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop',
    category: 'finance',
    author: 'Jean Dupont',
    date: '10 février 2024',
    readTime: '10 min'
  },
  {
    id: 4,
    title: "L'impact des nouvelles réglementations sur l'investissement immobilier",
    excerpt: "Analyse des récentes évolutions légales et de leurs conséquences pour les investisseurs immobiliers au Maroc.",
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
    category: 'investment',
    author: 'Amina Khalid',
    date: '25 janvier 2024',
    readTime: '7 min'
  },
  {
    id: 5,
    title: "Les quartiers émergents de Casablanca pour un investissement rentable",
    excerpt: "Découvrez les zones de Casablanca qui offrent le meilleur potentiel de plus-value pour les années à venir.",
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop',
    category: 'market',
    author: 'Karim Benjelloun',
    date: '18 janvier 2024',
    readTime: '9 min'
  },
  {
    id: 6,
    title: "Comment optimiser la gestion locative de votre bien immobilier",
    excerpt: "Conseils pratiques pour maximiser les revenus locatifs et minimiser les tracas de gestion de votre patrimoine.",
    image: 'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?q=80&w=2070&auto=format&fit=crop',
    category: 'finance',
    author: 'Nadia Benomar',
    date: '5 janvier 2024',
    readTime: '6 min'
  }
];
enum BlogView {
  LIST,
  ARTICLE,
  NEW_ARTICLE
}


const Blog = () => {
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<BlogView>(BlogView.LIST);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  
  const filteredPosts = blogPosts.filter(post => 
    (selectedCategory === 'all' || post.category === selectedCategory) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const handleArticleClick = (article: BlogPost) => {
    setSelectedArticle(article);
    setCurrentView(BlogView.ARTICLE);
    window.scrollTo(0, 0);
  };

  const handleAddArticle = () => {
    setCurrentView(BlogView.NEW_ARTICLE);
    window.scrollTo(0, 0);
  };

  const handleNewArticleSubmit = (article: Partial<BlogPost>) => {
    const newBlogPosts = [
      article as BlogPost,
      ...blogPosts
    ];
    
    setBlogPosts(newBlogPosts);
    setCurrentView(BlogView.LIST);
    toast.success("L'article a été publié avec succès!");
  };

  const handleBackToList = () => {
    setCurrentView(BlogView.LIST);
    setSelectedArticle(null);
  };
  
  const renderContent = () => {
    switch(currentView) {
      case BlogView.ARTICLE:
        if (!selectedArticle) return null;
        return <BlogArticle article={selectedArticle} onBack={handleBackToList} />;
      
      case BlogView.NEW_ARTICLE:
        return <NewArticleForm onSubmit={handleNewArticleSubmit} onCancel={handleBackToList} />;
      
      case BlogView.LIST:
      default:
  return (
    <MainLayout>
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col sm:flex-row gap-4 mt-32">
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

              
              <Button className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-md transition-all duration-300">
                Rechercher
              </Button>
            </div>
          
      {/* Blog Categories */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto pb-4 space-x-4 -mx-6 px-6">
            {categories.map(category => (
              <Button 
                key={category.id} 
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={`whitespace-nowrap ${selectedCategory === category.id ? 'bg-gold hover:bg-gold-dark' : 'border-gold text-gold hover:bg-gold/10'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Posts */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <div 
                      key={post.id} 
                      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={() => handleArticleClick(post)}
                    >                <div className="h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-xs text-white bg-gold px-3 py-1 rounded-full uppercase font-semibold">
                      {categories.find(c => c.id === post.category)?.name || 'Divers'}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-playfair font-bold text-luxe-blue mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={14} className="mr-1" />
                      <span className="mr-3">{post.author}</span>
                      <Calendar size={14} className="mr-1" />
                      <span>{post.date}</span>
                    </div>
                    <Button variant="link" className="text-gold hover:text-gold-dark">
                      Lire l&apos;article
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-playfair font-bold text-luxe-blue mb-4">Aucun article trouvé</h3>
              <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
              <Button 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold hover:text-white"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-luxe-blue rounded-lg p-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-playfair font-bold text-white mb-4">
                Ne ratez aucune opportunité
              </h2>
              <p className="text-white/80 mb-8">
                Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et conseils d&apos;experts directement dans votre boîte mail.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 py-3 px-4 rounded-md outline-none"
                />
                <Button className="bg-gold hover:bg-gold-dark text-white px-6 py-3 rounded-md transition-all duration-300">
                  S&apos;inscrire <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
     </MainLayout>
  );
};
}
return (
  <div className="flex flex-col min-h-screen bg-white">
    <Navbar />
    {renderContent()}
  </div>
);
};

export default Blog;
