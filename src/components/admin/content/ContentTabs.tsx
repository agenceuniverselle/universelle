
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogTab from './tabs/BlogTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import PagesTab from './tabs/PagesTab';
import { BlogPost } from '@/types/blog.types';

interface ContentTabsProps {
  blogArticles: BlogPost[];
  setBlogArticles: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  handleCreateArticle: () => void;
  handleViewArticle: (article: BlogPost) => void;
  handleEditArticle: (article: BlogPost) => void;
  handlePublishToggle: (article: BlogPost) => void;
  handleManageComments: (article: BlogPost) => void;
  confirmDeleteArticle: (articleId: number) => void;
  testimonials: any[];
  getStatusColor: (status: string) => string;
  renderStars: (rating: number) => JSX.Element;
  getCategoryName: (categoryId: string) => string;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  blogArticles,
  setBlogArticles,
  handleCreateArticle,
  handleViewArticle,
  handleEditArticle,
  handlePublishToggle,
  handleManageComments,
  confirmDeleteArticle,
  testimonials,
  getStatusColor,
  renderStars,
  getCategoryName
}) => {
  return (
    <Tabs defaultValue="blog" className="mb-6">
      <TabsList className="mb-6">
        <TabsTrigger value="blog">Blog</TabsTrigger>
        <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
        <TabsTrigger value="pages">Pages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="blog">
        <BlogTab 
          blogArticles={blogArticles}
          handleCreateArticle={handleCreateArticle}
          handleViewArticle={handleViewArticle}
          handleEditArticle={handleEditArticle}
          handlePublishToggle={handlePublishToggle}
          handleManageComments={handleManageComments}
          confirmDeleteArticle={confirmDeleteArticle}
          getStatusColor={getStatusColor}
          getCategoryName={getCategoryName}
        />
      </TabsContent>
      
      <TabsContent value="testimonials">
        <TestimonialsTab 
          testimonials={testimonials}
          getStatusColor={getStatusColor}
          renderStars={renderStars}
        />
      </TabsContent>
      
      <TabsContent value="pages">
        <PagesTab />
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
