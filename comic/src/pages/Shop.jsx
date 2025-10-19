import {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
  useId,
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import bookService from '../services/book';

const Shop = ({ setNotification }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firstBookRef = useRef(null);
  const shopId = useId();

  useEffect(() => {
    bookService
      .getAll()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        setNotification({ message: `Error: ${err.message}`, type: 'error' });
      });
  }, [setNotification]);

  useEffect(() => {
    firstBookRef.current?.focus();
  }, []);

  const handleAddToCart = useCallback(
    (book) => {
      if (!user) {
        setNotification({ message: 'Please log in to add to cart', type: 'error' });
        navigate('/login');
        return;
      }
      if (book.stock === 0) {
        setNotification({ message: `${book.title} is out of stock`, type: 'error' });
        return;
      }
      addToCart({ ...book, quantity: 1 });
      setNotification({ message: `${book.title} added to cart!`, type: 'success' });
    },
    [user, addToCart, setNotification, navigate]
  );

  const handleKeyPress = useCallback(
    (e, book) => {
      if (e.key === 'Enter') handleAddToCart(book);
    },
    [handleAddToCart]
  );

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#ff69b4',
          backgroundColor: '#0d0d0d',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Loading manga...
      </div>
    );
  }

  if (!Array.isArray(books) || books.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: '#ffb6c1',
          backgroundColor: '#0d0d0d',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>No Manga Available</h2>
        <p>Check back later for new arrivals!</p>
      </div>
    );
  }

  // === Pink & Black Theme ===
  const pageStyle = {
    backgroundColor: '#0d0d0d',
    color: '#fff',
    minHeight: '100vh',
    padding: '40px',
    fontFamily: "'Poppins', sans-serif",
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#ff69b4',
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '40px',
    textShadow: '0 0 15px rgba(255,105,180,0.6)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const cardStyle = {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #ff69b4',
    boxShadow: '0 0 20px rgba(255,105,180,0.3)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const cardHover = {
    transform: 'translateY(-5px)',
    boxShadow: '0 0 25px rgba(255,105,180,0.6)',
  };

  const buttonStyle = (disabled) => ({
    width: '100%',
    backgroundColor: disabled ? '#444' : '#ff1493',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    padding: '10px',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: '10px',
    transition: '0.3s',
  });

  return (
    <div id={shopId} style={pageStyle}>
      <h2 style={titleStyle}>Manga Shop</h2>

      <div style={gridStyle}>
        {books.map((book, index) => (
          <div
            key={book.id}
            ref={index === 0 ? firstBookRef : null}
            tabIndex={0}
            style={cardStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, cardHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, cardStyle)
            }
          >
            <Link
              to={`/book/${book.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img
                src={book.image_url || 'https://via.placeholder.com/150x225?text=Manga+Cover'}
                alt={book.title}
                style={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  boxShadow: '0 0 10px rgba(255,105,180,0.4)',
                }}
              />
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '5px',
                }}
              >
                {book.title}
              </h3>
              <p style={{ color: '#ffb6c1', marginBottom: '4px' }}>By {book.author}</p>
              <p style={{ color: '#ccc', marginBottom: '4px' }}>Price: ${book.price}</p>
              <p
                style={{
                  color: book.stock === 0 ? '#ff4d6d' : '#90ee90',
                  fontWeight: '500',
                }}
              >
                Stock: {book.stock}
              </p>
            </Link>

            <button
              onClick={() => handleAddToCart(book)}
              onKeyPress={(e) => handleKeyPress(e, book)}
              disabled={book.stock === 0}
              style={buttonStyle(book.stock === 0)}
              onMouseOver={(e) =>
                !book.stock === 0 &&
                (e.target.style.backgroundColor = '#ff69b4')
              }
              onMouseOut={(e) =>
                !book.stock === 0 &&
                (e.target.style.backgroundColor = '#ff1493')
              }
            >
              {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
