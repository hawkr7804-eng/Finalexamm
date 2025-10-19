import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import api from './api.js';

const FilterSidebar = ({ onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    author: '',
    priceMin: '',
    priceMax: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filter options (genres and authors) on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const [genreResponse, authorResponse] = await Promise.all([
          api('routes.php?action=getGenres', null, 'GET'),
          api('routes.php?action=getAuthors', null, 'GET'),
        ]);

        if (genreResponse.success) {
          setGenres(genreResponse.data);
        } else {
          setError(genreResponse.error || 'Failed to fetch genres');
        }

        if (authorResponse.success) {
          setAuthors(authorResponse.data);
        } else {
          setError(authorResponse.error || 'Failed to fetch authors');
        }
      } catch (err) {
        setError(err.message || 'Error fetching filter options');
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Handle filter input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      onFilterChange(newFilters); // Notify parent component
      return newFilters;
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = { genre: '', author: '', priceMin: '', priceMax: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-64 h-fit">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading filters...</div>
      ) : (
        <div className="space-y-4">
          {/* Genre Filter */}
          <div>
            <label htmlFor="genre" className="block text-gray-700 text-sm font-medium mb-1">
              Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={filters.genre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <label htmlFor="author" className="block text-gray-700 text-sm font-medium mb-1">
              Author
            </label>
            <select
              id="author"
              name="author"
              value={filters.author}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleInputChange}
                placeholder="Min"
                className="w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleInputChange}
                placeholder="Max"
                className="w-1/2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;