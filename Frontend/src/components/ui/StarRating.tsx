import React, { useEffect, useState } from 'react';

interface StarRatingProps {
  onRate: (value: number) => void;
  articleId: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ onRate, articleId, size = 32 }) => {
  const localStorageKey = `rated-stars-${articleId}`;
  const [clickedStars, setClickedStars] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(localStorageKey);
    try {
      const parsed = JSON.parse(stored || '[]');
      setClickedStars(Array.isArray(parsed) ? parsed : []);
    } catch {
      setClickedStars([]);
    }
  }, [articleId]);
  

  const handleClick = (value: number) => {
    if (clickedStars.includes(value)) return; // ⭐ déjà votée
    const updated = [...clickedStars, value];
    setClickedStars(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    onRate(value); // ✅ ENVOIE LA VALEUR RÉELLE
  };
  

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {[1, 2, 3, 4, 5].map((value) => {
        const isClicked = clickedStars.includes(value);
        return (
          <svg
            key={value}
            onClick={() => handleClick(value)}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill={isClicked ? '#facc15' : 'none'}
            stroke="#d1d5db"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            style={{
              cursor: isClicked ? 'default' : 'pointer',
              opacity: isClicked ? 1 : 0.7,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.143 4.345 4.798.696a.562.562 0 01.311.959l-3.47 3.382.819 4.771a.562.562 0 01-.816.592L12 16.347l-4.305 2.268a.562.562 0 01-.816-.592l.82-4.77-3.47-3.383a.562.562 0 01.31-.96l4.799-.695 2.142-4.345z"
            />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
