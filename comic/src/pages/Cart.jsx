import { useState, useEffect, useContext, useCallback, useRef, useId } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Cart = ({ setNotification }) => {
  const { user } = useContext(AuthContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(cart);
  const firstItemRef = useRef(null);
  const cartId = useId();

  useEffect(() => setCartItems(cart), [cart]);
  useEffect(() => firstItemRef.current?.focus(), []);
  useEffect(() => {
    if (!user) {
      setNotification({ message: 'Please log in to view your cart', type: 'error' });
      navigate('/login');
    }
  }, [user, navigate, setNotification]);

  const handleQuantityChange = useCallback(
    (itemId, newQuantity) => {
      if (newQuantity < 1) return;
      const item = cartItems.find((cartItem) => cartItem.id === itemId);
      if (newQuantity > item.stock) {
        setNotification({
          message: `Cannot exceed stock of ${item.stock} for ${item.title}`,
          type: 'error',
        });
        return;
      }
      addToCart({ ...item, quantity: newQuantity });
    },
    [cartItems, addToCart, setNotification]
  );

  const handleRemoveItem = useCallback(
    (itemId) => {
      const item = cartItems.find((cartItem) => cartItem.id === itemId);
      removeFromCart(itemId);
      setNotification({ message: `${item.title} removed from cart`, type: 'success' });
    },
    [cartItems, removeFromCart, setNotification]
  );

  const handleCheckout = useCallback(() => {
    setNotification({ message: 'Checkout is not implemented yet', type: 'info' });
  }, [setNotification]);

  const handleKeyPress = useCallback(
    (e, itemId) => e.key === 'Enter' && handleRemoveItem(itemId),
    [handleRemoveItem]
  );

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  if (!cartItems.length) {
    return (
      <div
        style={{
          backgroundColor: '#0d0d0d',
          color: '#fff',
          minHeight: '100vh',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <h2 style={{ fontSize: '2rem', color: '#ff69b4', marginBottom: '10px' }}>
          Your Cart is Empty
        </h2>
        <Link
          to="/shop"
          style={{
            color: '#ff69b4',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: '0.3s',
          }}
        >
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div
      id={cartId}
      style={{
        backgroundColor: '#0d0d0d',
        color: '#fff',
        minHeight: '100vh',
        padding: '40px',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#ff69b4',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '30px',
          textShadow: '0 0 10px rgba(255, 105, 180, 0.6)',
        }}
      >
        Your Cart
      </h2>

      <div style={{ display: 'grid', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {cartItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #ff69b4',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 0 15px rgba(255, 105, 180, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src={item.image || 'https://via.placeholder.com/100x150?text=Manga'}
                alt={item.title}
                style={{
                  width: '80px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
                ref={index === 0 ? firstItemRef : null}
              />
              <div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600' }}>
                  {item.title}
                </h3>
                <p style={{ color: '#bbb', fontSize: '0.9rem' }}>By {item.author}</p>
                <p style={{ color: '#ffb6c1', fontSize: '0.9rem' }}>Price: ${item.price}</p>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>Stock: {item.stock}</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <label
                htmlFor={`${cartId}-quantity-${item.id}`}
                style={{ color: '#ffb6c1', fontSize: '0.9rem', fontWeight: '500' }}
              >
                Quantity:
              </label>
              <input
                type="number"
                id={`${cartId}-quantity-${item.id}`}
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value, 10))
                }
                min="1"
                max={item.stock}
                style={{
                  width: '60px',
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid #ff69b4',
                  backgroundColor: '#111',
                  color: '#fff',
                  textAlign: 'center',
                  marginLeft: '10px',
                }}
              />
              <button
                onClick={() => handleRemoveItem(item.id)}
                onKeyPress={(e) => handleKeyPress(e, item.id)}
                style={{
                  display: 'block',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ff4d6d',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '10px',
                  textShadow: '0 0 8px rgba(255, 77, 109, 0.5)',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.color = '#ff8097')}
                onMouseOut={(e) => (e.target.style.color = '#ff4d6d')}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '40px',
          textAlign: 'center',
          borderTop: '1px solid #ff69b4',
          paddingTop: '20px',
        }}
      >
        <h3 style={{ color: '#ffb6c1', fontSize: '1.3rem', marginBottom: '15px' }}>
          Total: ${totalPrice}
        </h3>
        <button
          onClick={handleCheckout}
          style={{
            backgroundColor: '#ff1493',
            border: 'none',
            color: '#fff',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: '0.3s',
            boxShadow: '0 0 15px rgba(255, 105, 180, 0.5)',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#ff69b4')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ff1493')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
