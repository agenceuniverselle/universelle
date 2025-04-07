
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  status?: string;
  views?: number;
  comments?: number;
  content?: string;
}
