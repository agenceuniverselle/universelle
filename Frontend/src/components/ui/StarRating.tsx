import React, { useEffect, useState } from 'react';

interface StarRatingProps {
  onRate: (value: number) => void;
  articleId: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ onRate, articleId, size = 32 }) => {
  const localStorageKey = `rated-stars-${articleId}`;
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      setRating(parseInt(stored, 10));
    }
  }, [articleId]);

  const handleClick = (value: number) => {
    if (rating > 0) return; // ❌ Empêche de voter deux fois
    setRating(value);
    localStorage.setItem(localStorageKey, value.toString());
    onRate(value); // ✅ Envoie au backend
  };

  const isFilled = (index: number) => {
    return hovered !== null ? index <= hovered : index <= rating;
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((value) => (
        <svg
          key={value}
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(null)}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill={isFilled(value) ? '#facc15' : 'none'}
          stroke="#d1d5db"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          style={{
            cursor: rating > 0 ? 'default' : 'pointer',
            opacity: rating > 0 ? 1 : 0.8,
            transition: 'fill 0.2s ease',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.143 4.345 4.798.696a.562.562 0 01.311.959l-3.47 3.382.819 4.771a.562.562 0 01-.816.592L12 16.347l-4.305 2.268a.562.562 0 01-.816-.592l.82-4.77-3.47-3.383a.562.562 0 01.31-.96l4.799-.695 2.142-4.345z"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
