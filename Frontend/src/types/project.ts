// types/project.ts
export interface Project {
  id?: number;
  name: string;
  location: string;
  type: string;
  details: string;
  surface: string;
  status: string;
  images: string[]; // Changed from string to string[] to match usage
  created_at?: string;
  updated_at?: string;
}