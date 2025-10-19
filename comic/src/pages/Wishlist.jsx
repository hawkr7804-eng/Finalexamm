
import { useState, useEffect, useContext, useCallback, useRef, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Wishlist = ({ setNotification }) => {
  // useContext: Access AuthContext, CartContext, and WishlistContext
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  // useNavigate: For redirecting to login or cart
  const navigate = useNavigate();

  // useRef: Reference for first wishlist item
  const firstItemRef = useRef(null);

  // useId: Generate unique ID for accessibility
  const wishlistId = useId();

  // useState: Manage local wishlist state
  const [wishlistItems, setWishlistItems] = useState(wishlist);

  // useEffect: Sync local wishlistItems with WishlistContext
  useEffect(() => {
    setWishlistItems(wishlist);
  }, [wishlist]);

  // useEffect: Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setNotification({ message: 'Please log in to view your wishlist', type: 'error' });
      navigate('/login', { replace: true });
    }
  }, [user, navigate, setNotification]);

  // useEffect: Focus first item on mount
  useEffect(() => {
    firstItemRef.current?.focus();
  }, []);

  // useCallback: Handle add to cart
  const handleAddToCart = useCallback(
    (item) => {
      if (item.stock === 0) {
        setNotification({ message: `${item.title} is out of stock`, type: 'error' });
        return;
      }
      addToCart({ ...item, quantity: 1 });
      setNotification({ message: `${item.title} added to cart!`, type: 'success' });
      removeFromWishlist(item.id);
    },
    [addToCart, removeFromWishlist, setNotification]
  );

  // useCallback: Handle remove from wishlist
  const handleRemoveFromWishlist = useCallback(
    (itemId) => {
      const item = wishlistItems.find((wishlistItem) => wishlistItem.id === itemId);
      removeFromWishlist(itemId);
      setNotification({ message: `${item.title} removed from wishlist`, type: 'success' });
    },
    [wishlistItems, removeFromWishlist, setNotification]
  );

  // Event handlers for accessibility
  const handleKeyPress = useCallback(
    (e, itemId, action) => {
      if (e.key === 'Enter') {
        if (action === 'remove') {
          handleRemoveFromWishlist(itemId);
        } else if (action === 'addToCart') {
          const item = wishlistItems.find((wishlistItem) => wishlistItem.id === itemId);
          handleAddToCart(item);
        }
      }
    },
    [handleRemoveFromWishlist, handleAddToCart, wishlistItems]
  );

  const handleFocus = useCallback((e) => {
    e.target.classList.add('custom-focus-glow');
  }, []);

  const handleBlur = useCallback((e) => {
    e.target.classList.remove('custom-focus-glow');
  }, []);

  if (!wishlistItems.length) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
        <Link to="/shop" className="text-purple-600 hover:underline">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div id={wishlistId} className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow-md custom-shadow-neon"
            ref={index === 0 ? firstItemRef : null}
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <Link to={`/book/${item.id}`}>
              <img
                src={item.image || 'https://via.placeholder.com/150x225?text=Book+Cover'}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
              <p className="text-gray-600 text-sm">By {item.author}</p>
              <p className="text-gray-600 text-sm">Price: ${item.price}</p>
              <p className="text-gray-600 text-sm">Stock: {item.stock}</p>
            </Link>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleAddToCart(item)}
                onKeyPress={(e) => handleKeyPress(e, item.id, 'addToCart')}
                disabled={item.stock === 0}
                className={`flex-1 px-4 py-2 rounded-md text-white font-bold transition duration-200 ${
                  item.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 custom-hover-glow'
                }`}
              >
                {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => handleRemoveFromWishlist(item.id)}
                onKeyPress={(e) => handleKeyPress(e, item.id, 'remove')}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 custom-hover-glow"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
