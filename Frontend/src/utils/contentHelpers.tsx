
import { Star } from 'lucide-react';
import React from 'react';

export const getCategoryName = (categoryId: string): string => {
  const categories = {
    'investment': 'Investissement Immobilier',
    'market': 'Marché Immobilier Marocain',
    'finance': 'Rentabilité & Financement',
    'development': 'Développement & Promotion'
  };
  return categories[categoryId as keyof typeof categories] || categoryId;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Publié':
      return 'bg-green-100 text-green-800';
    case 'Brouillon':
      return 'bg-amber-100 text-amber-800';
    case 'Approuvé':
      return 'bg-green-100 text-green-800';
    case 'En attente':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const renderStars = (rating: number) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
};
