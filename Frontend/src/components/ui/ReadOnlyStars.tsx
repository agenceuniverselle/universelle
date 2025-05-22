import React from 'react';

interface ReadOnlyStarsProps {
  rating: number;
  size?: number;
}

const ReadOnlyStars: React.FC<ReadOnlyStarsProps> = ({ rating, size = 20 }) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          fill={i <= rounded ? '#facc15' : 'none'}
          stroke="#d1d5db"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
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

export default ReadOnlyStars;
