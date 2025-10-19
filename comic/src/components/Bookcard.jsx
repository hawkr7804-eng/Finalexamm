import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import auth from './auth.js';
import api from './api.js';

const BookCard = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await api(`routes.php?action=checkFavorite&bookId=${book.id}`, null, 'GET');
      if (response.success) {
        setIsFavorite(response.data.isFavorite);
      }
    } catch (err) {
      console.error('Error checking favorite status:', err.message);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      window.location.href = '/authform.html';
      return;
    }

    try {
      const action = isFavorite ? 'removeFavorite' : 'addFavorite';
      const response = await api(`routes.php?action=${action}&bookId=${book.id}`, null, 'POST');
      if (response.success) {
        setIsFavorite(!isFavorite);
        setError(null);
      } else {
        setError(response.error || 'Failed to update favorite status');
      }
    } catch (err) {
      setError(err.message || 'Error updating favorite status');
    }
  };

  const handleViewDetails = () => {
    window.location.href = `/book.html?id=${book.id}`;
  };

  return (
    <div className="custom-card-shadow rounded-lg overflow-hidden max-w-sm mx-auto custom-japanese-font">
      <img
        src={book.coverImage || 'https://via.placeholder.com/150'}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-indigo-950 truncate">{book.title}</h3>
        <p className="text-sakura text-sm mb-2">By {book.author || 'Unknown'}</p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {book.description || 'No description available.'}
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={handleViewDetails}
            className="bg-indigo-950 text-white px-4 py-2 rounded hover:bg-indigo-800 custom-hover-glow"
          >
            詳細を見る (View Details)
          </button>
          <button
            onClick={handleFavorite}
            className={`px-4 py-2 rounded ${
              isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-sakura-accent text-sakura hover:bg-pink-200'
            }`}
          >
            {isFavorite ? 'お気に入り解除' : 'お気に入り追加'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
