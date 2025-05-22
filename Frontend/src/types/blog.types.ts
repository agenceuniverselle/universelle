
export interface BlogPost {
  author_function ?:string;
  created_at: string | number | Date;
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  status?: string;
  views?: number;
  comments?: number;
  content?: string;
  rating?: number | null; 
  rating_count?: number;
  author_type?: 'interne' | 'externe'; // ✅ Ajout de author_type
  similar_links?: string[]; // ✅ Ajout de similar_links

}

