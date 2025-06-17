import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StarRating from '@/components/ui/StarRating';
import { ArrowLeft, Calendar, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost } from '@/types/blog.types';
import { Comment } from '@/types/comment.types';
import AddComment from './AddComment';
import CommentItem from './CommentItem';
import NewsletterSection from './NewsletterSection';
import MainLayout from '../layouts/MainLayout';
import { Helmet } from 'react-helmet-async';

interface BlogArticleProps {
  articleId: number; // <- On passe l'ID uniquement
  onBack: () => void;
  onSelectArticle: (article: BlogPost) => void;
}

const BlogArticle = ({ articleId, onBack, onSelectArticle }: BlogArticleProps) => {
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [similarArticles, setSimilarArticles] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [rating, setRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);

  const hasRated = typeof window !== 'undefined' && localStorage.getItem(`rated-stars-${articleId}`);

  useEffect(() => {
    fetchArticle();
    fetchComments();
    fetchSimilar();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`https://back-qhore.ondigitalocean.app/api/blogs/${articleId}`);
      setArticle(res.data);
      setRating(res.data.rating || 0);
      setRatingCount(res.data.rating_count || 0);
    } catch (err) {
      console.error('Erreur lors du chargement de l’article', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://back-qhore.ondigitalocean.app/api/blogs/${articleId}/comments`);
      setComments(res.data.map((comment: Comment) => ({ ...comment, replies: comment.replies ?? [] })));
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires', err);
    }
  };

  const fetchSimilar = async () => {
    try {
      const res = await axios.get(`https://back-qhore.ondigitalocean.app/api/blogs/${articleId}/similaires`);
      setSimilarArticles(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des articles similaires', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.body.scrollHeight;
      if (bottom && !hasRated) {
        setShowRatingPrompt(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [articleId]);

  const formatDate = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const countTotalComments = (comments: Comment[]): number =>
    comments.reduce((total, comment) => total + 1 + (comment.replies ? countTotalComments(comment.replies) : 0), 0);

  if (!article) {
    return <div className="text-center py-10">Chargement de l’article...</div>;
  }

  const cleanedExcerpt = (() => {
    const div = document.createElement('div');
    div.innerHTML = article.excerpt;
    div.querySelector('img')?.remove();
    return div.innerHTML;
  })();

  const firstImageUrl = (() => {
    const div = document.createElement('div');
    div.innerHTML = article.excerpt;
    return div.querySelector('img')?.getAttribute('src') || '';
  })();

  return (
    <MainLayout>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "name": article.title,
            "headline": article.title,
            "author": {
              "@type": "Person",
              "name": article.author,
            },
            "datePublished": isNaN(new Date(article.created_at).getTime())
              ? new Date().toISOString()
              : new Date(article.created_at).toISOString(),
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": rating.toFixed(1),
              "reviewCount": ratingCount,
            },
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mt-20">
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
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="" alt={article.author} />
                <AvatarFallback className="bg-luxe-blue text-white">
                  {article.author?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author}</p>
                <p className="text-xs text-gray-500">
                  {article.author_function || 'Auteur invité'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon"><Share2 size={16} /></Button>
              <Button variant="outline" size="icon"><Bookmark size={16} /></Button>
            </div>
          </div>
        </div>

        {firstImageUrl && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={firstImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none mb-8 [&_img]:w-full [&_img]:rounded-lg [&_img]:shadow-md"
          dangerouslySetInnerHTML={{ __html: cleanedExcerpt }}
        />

        <div className="mt-4 p-4 bg-white rounded-lg shadow text-center">
          <h2 className="text-xl font-bold text-luxe-blue mb-2">Notez cet article</h2>
          <StarRating
            key={article.id}
            articleId={article.id}
            onRate={async (selectedRating) => {
              try {
                const res = await axios.post(`https://back-qhore.ondigitalocean.app/api/blogs/${article.id}/rate`, {
                  rating: selectedRating,
                });
                setRating(res.data.rating);
                setRatingCount(res.data.rating_count);
              } catch (error) {
                console.error("Erreur lors de l'envoi de la note", error);
              }
            }}
          />
        </div>

        <Separator className="my-8" />

        <h3 className="text-xl font-bold text-luxe-blue mb-4">
          Commentaires ({countTotalComments(comments)})
        </h3>

        {comments.length > 0 ? (
          (showAllComments ? comments : comments.slice(0, 3)).map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={article.id}
              fetchComments={fetchComments}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucun commentaire pour le moment.</p>
        )}

        <AddComment articleId={article.id} onCommentAdded={fetchComments} />

        {comments.length > 3 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? 'Réduire les commentaires' : 'Voir tous les commentaires'}
          </Button>
        )}

        <Separator className="my-8" />

        {similarArticles.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-luxe-blue mb-6">Articles similaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similarArticles.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectArticle(item)}
                  className="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-luxe-blue mb-2">
                      {item.title}
                    </h4>
                    <Button
                      variant="link"
                      className="text-gold hover:text-gold-dark p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArticle(item);
                      }}
                    >
                      Lire l'article
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showRatingPrompt && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-300 shadow-lg p-4 rounded-md z-50">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Vous aimez cet article ? Donnez une note !
            </p>
            <StarRating
              articleId={article.id}
              onRate={(selectedRating) => {
                axios.post(`https://back-qhore.ondigitalocean.app/api/blogs/${article.id}/rate`, { rating: selectedRating })
                  .then((res) => {
                    setRating(res.data.rating);
                    setRatingCount(res.data.rating_count);
                  })
                  .catch(() => alert("Erreur lors de l'envoi de votre note"));
              }}
              size={24}
            />
            <Button className="mt-2" onClick={() => setShowRatingPrompt(false)}>
              Fermer
            </Button>
          </div>
        )}

        <NewsletterSection />
      </div>
    </MainLayout>
  );
};

export default BlogArticle;
