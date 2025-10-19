import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
import FilterSidebar from './filtersidebar.jsx';
import BookCard from './bookcard.jsx';
import Pagination from './pagination.jsx';
import auth from './auth.js';
import api from './api.js';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ genre: '', author: '', priceMin: '', priceMax: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [userRole, setUserRole] = useState(auth.getUserRole());

  // Fetch books based on filters and page
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          action: 'getBooks',
          page: currentPage,
          limit: 12, // Display 12 books per page
          ...(filters.genre && { genreId: filters.genre }),
          ...(filters.author && { authorId: filters.author }),
          ...(filters.priceMin && { priceMin: filters.priceMin }),
          ...(filters.priceMax && { priceMax: filters.priceMax }),
        }).toString();
        const response = await api(`routes.php?${query}`, null, 'GET');
        if (response.success) {
          setBooks(response.data);
          setTotalPages(response.totalPages || 1);
        } else {
          setError(response.error || 'Failed to fetch books');
        }
      } catch (err) {
        setError(err.message || 'Error fetching books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [filters, currentPage]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle logout
  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.reload(); // Refresh to update UI
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mangamori</h1>
          <nav className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <a href="/cart" className="hover:underline">
                  Cart
                </a>
                {userRole === 'admin' && (
                  <a href="/admin" className="hover:underline">
                    Admin Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/authform" className="hover:underline">
                  Login
                </a>
                <a href="/authform" className="hover:underline">
                  Register
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto p-4">
        {/* Filter Sidebar */}
        <div className="w-64 mr-4">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Book List */}
        <div className="flex-1">
          {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
          {loading ? (
            <div className="text-center text-gray-600">Loading books...</div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Manga Collection</h2>
              {books.length === 0 ? (
                <p className="text-gray-600">No books found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<Home />, document.getElementById('root'));

export default Home;