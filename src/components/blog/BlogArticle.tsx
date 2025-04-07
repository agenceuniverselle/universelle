
import React from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost } from '@/types/blog.types';

interface BlogArticleProps {
  article: BlogPost;
  onBack: () => void;
}

const BlogArticle = ({ article, onBack }: BlogArticleProps) => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-4">
          <ArrowLeft size={16} />
          Retour aux articles
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-luxe-blue mb-6">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="text-sm text-white bg-gold px-3 py-1 rounded-full uppercase font-semibold">
            {article.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{article.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>{article.readTime}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="" alt={article.author} />
              <AvatarFallback className="bg-luxe-blue text-white">{article.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{article.author}</p>
              <p className="text-xs text-gray-500">Expert Immobilier</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 size={16} />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-8 rounded-lg overflow-hidden h-[400px]">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="prose prose-lg max-w-none mb-8">
        <p className="text-lg mb-4">
          {article.excerpt}
        </p>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, 
          dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. 
          Maecenas ligula massa, varius a, semper congue, euismod non, mi.
        </p>
        <h2 className="text-2xl font-playfair font-bold text-luxe-blue my-4">
          Les points clés à retenir
        </h2>
        <p className="mb-4">
          Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. 
          Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Point important concernant le marché immobilier actuel</li>
          <li className="mb-2">Stratégies d'investissement recommandées par nos experts</li>
          <li className="mb-2">Facteurs clés pour maximiser votre retour sur investissement</li>
          <li className="mb-2">Tendances émergentes à surveiller dans le secteur</li>
        </ul>
        <p className="mb-4">
          Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. 
          Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor.
        </p>
        <blockquote className="border-l-4 border-gold pl-4 italic my-6">
          "L'investissement immobilier reste l'un des moyens les plus sûrs de construire un patrimoine durable 
          et de générer des revenus passifs à long terme." — Expert en investissement immobilier
        </blockquote>
      </div>
      
      <Separator className="my-8" />
      
      <div className="mb-8">
        <h3 className="text-xl font-playfair font-bold text-luxe-blue mb-4">
          Commentaires (5)
        </h3>
        
        <Card className="p-4 mb-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Jean Dupont</h4>
                <span className="text-xs text-gray-500">Il y a 2 jours</span>
              </div>
              <p className="text-sm mt-1">
                Article très instructif, merci pour ces conseils précieux qui vont m'aider dans mon projet d'achat immobilier.
              </p>
              <Button variant="ghost" size="sm" className="mt-2">
                <MessageSquare size={14} className="mr-1" /> Répondre
              </Button>
            </div>
          </div>
        </Card>
        
        <Button variant="outline" className="w-full">Voir tous les commentaires</Button>
      </div>
      
      <Separator className="my-8" />
      
      <div>
        <h3 className="text-xl font-playfair font-bold text-luxe-blue mb-6">
          Articles similaires
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=2073&auto=format&fit=crop" 
                alt="Article similaire" 
                className="w-full h-full object-cover transition-all duration-500 hover:scale-110" 
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-playfair font-bold text-luxe-blue mb-2">
                Comment financer votre premier investissement immobilier
              </h4>
              <Button variant="link" className="text-gold hover:text-gold-dark p-0">
                Lire l'article
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1545159446-d4004b15fb25?q=80&w=2070&auto=format&fit=crop" 
                alt="Article similaire" 
                className="w-full h-full object-cover transition-all duration-500 hover:scale-110" 
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-playfair font-bold text-luxe-blue mb-2">
                Les quartiers en pleine expansion à Casablanca
              </h4>
              <Button variant="link" className="text-gold hover:text-gold-dark p-0">
                Lire l'article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
