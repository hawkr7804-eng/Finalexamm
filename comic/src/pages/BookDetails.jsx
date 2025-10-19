import { useState, useEffect, useContext, useCallback, useRef, useId } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import useFetchData from '../hooks/useFetchData';
import bookService from '../services/book';

const BookDetails = ({ setNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const { data: book, loading, error } = useFetchData(() => bookService.getById(id));

  const [quantity, setQuantity] = useState(1);
  const quantityRef = useRef(null);
  const bookId = useId();

  const handleAddToCart = useCallback(() => {
    if (!user) {
      setNotification({ message: 'Please log in to add to cart', type: 'error' });
      navigate('/login');
      return;
    }
    if (book) {
      addToCart({ ...book, quantity });
      setNotification({ message: `${book.title} added to cart!`, type: 'success' });
      setQuantity(1);
    }
  }, [user, book, quantity, addToCart, setNotification, navigate]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= (book?.stock || 1)) {
      setQuantity(value);
    }
  }, [book]);

  useEffect(() => {
    if (error) setNotification({ message: `Error: ${error}`, type: 'error' });
  }, [error, setNotification]);

  useEffect(() => {
    quantityRef.current?.focus();
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') handleAddToCart();
  }, [handleAddToCart]);

  const handleFocus = useCallback((e) => e.target.classList.add('custom-focus-glow'), []);
  const handleBlur = useCallback((e) => e.target.classList.remove('custom-focus-glow'), []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!book) return <div className="text-center p-4 text-red-500">Book not found</div>;

  return (
    <div id={bookId} className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{book.title}</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={book.image_url || 'http://localhost/Finalexam/MangaMori/backend/uploads/default-book.png'}
            alt={book.title}
            className="w-full h-auto rounded-lg shadow-md custom-shadow-neon"
          />
        </div>
        <div className="md:w-2/3">
          <p className="text-lg text-gray-600 mb-2"><strong>Author:</strong> {book.author}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>Genre:</strong> {book.genre}</p>
          <p className="text-lg text-gray-600 mb-2"><strong>Price:</strong> ${book.price}</p>
          <p className="text-lg text-gray-600 mb-4"><strong>Stock:</strong> {book.stock}</p>
          <p className="text-gray-700 mb-6">{book.description || 'No description available.'}</p>
          <div className="flex items-center gap-4">
            <label htmlFor={`${bookId}-quantity`} className="text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              id={`${bookId}-quantity`}
              value={quantity}
              onChange={handleQuantityChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              ref={quantityRef}
              min="1"
              max={book.stock}
              className="w-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className={`px-4 py-2 rounded-md text-white font-bold transition duration-200 ${
                book.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 custom-hover-glow'
              }`}
            >
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
