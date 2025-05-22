// types/Testimonial.ts
export interface Testimonial {
  id: number;
  name: string;
  fonction?: string;
  quote: string;
  image?: string;
  created_at: string;
  newImage?: File | null;
  removeImage?: boolean;
}
