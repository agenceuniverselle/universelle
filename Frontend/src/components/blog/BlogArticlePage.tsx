import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BlogPost } from '@/types/blog.types';
import BlogArticle from './BlogArticle';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://back-qhore.ondigitalocean.app/api/blogs/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement de l’article', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!article) return <p>Article non trouvé</p>;

  return (
    <BlogArticle
      article={article}
      onBack={() => navigate(-1)}
      onSelectArticle={(selectedArticle) => navigate(`/blog/${selectedArticle.id}`)}
    />
  );
};

export default BlogDetailPage;
