export interface Comment {
    id: number;
    blog_article_id: number;
    parent_id?: number | null; // ✅ null si c’est un commentaire principal
  
    first_name: string;
    last_name: string;
    email?: string;
    avatar?: string | null;
    content: string;
    created_at: string;
  
    // ✅ Ajouté côté frontend pour organisation hiérarchique
    replies?: Comment[]; // Les réponses à ce commentaire (facultatif, pour affichage)
    reaction_counts?: {
      [emoji: string]: number;
    };
  }
  