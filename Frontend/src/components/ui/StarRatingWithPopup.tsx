import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  articleId: number;
  onRated: (rating: number, count: number) => void;
}

const StarRatingPopup: React.FC<Props> = ({ articleId, onRated }) => {
  const [selected, setSelected] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);
  const [visible, setVisible] = useState(false);

  // Scroll trigger
  useEffect(() => {
    const rated = localStorage.getItem(`rated-stars-${articleId}`);
    if (rated) {
      setHasRated(true);
    }

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (atBottom && !rated) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [articleId]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`/api/blogs/${articleId}/rate`, { rating: selected });
      localStorage.setItem(`rated-stars-${articleId}`, String(selected));
      setHasRated(true);
      setVisible(false);
      onRated(res.data.rating, res.data.rating_count);
    } catch (err) {
      alert("Erreur lors de l'envoi de votre note.");
    }
  };

  if (!visible || hasRated) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4 z-50 w-72">
      <p className="font-semibold text-sm mb-2">Vous aimez cet article ? Notez-le !</p>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            onClick={() => setSelected(i)}
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill={i <= selected ? '#facc15' : 'none'}
            stroke="#d1d5db"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            style={{ cursor: 'pointer' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.143 4.345 4.798.696a.562.562 0 01.311.959l-3.47 3.382.819 4.771a.562.562 0 01-.816.592L12 16.347l-4.305 2.268a.562.562 0 01-.816-.592l.82-4.77-3.47-3.383a.562.562 0 01.31-.96l4.799-.695 2.142-4.345z"
            />
          </svg>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-1 py-1 text-sm bg-gold text-white rounded hover:bg-gold-dark"
        disabled={selected === 0}
      >
        Envoyer {selected} étoile{selected > 1 ? 's' : ''}
      </button>
    </div>
  );
};

export default StarRatingPopup;
