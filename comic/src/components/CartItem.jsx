import React, { useState } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import auth from './auth.js';
import api from './api.js';

const CartItem = ({ item, onUpdate, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = auth.isAuthenticated();

  // Handle quantity change
  const handleQuantityChange = async (newQuantity) => {
    if (!isAuthenticated) {
      window.location.href = '/authform.html'; // Redirect to login if not authenticated
      return;
    }

    if (newQuantity < 1) return; // Prevent negative or zero quantity

    setLoading(true);
    try {
      const response = await api(
        `routes.php?action=updateCartItem&itemId=${item.id}`,
        { quantity: newQuantity },
        'PUT'
      );
      if (response.success) {
        setQuantity(newQuantity);
        onUpdate(item.id, newQuantity); // Notify parent component
        setError(null);
      } else {
        setError(response.error || 'Failed to update quantity');
      }
    } catch (err) {
      setError(err.message || 'Error updating quantity');
    } finally {
      setLoading(false);
    }
  };

  // Handle remove item
  const handleRemove = async () => {
    if (!isAuthenticated) {
      window.location.href = '/authform.html';
      return;
    }

    if (window.confirm('Are you sure you want to remove this item from the cart?')) {
      setLoading(true);
      try {
        const response = await api(`routes.php?action=removeCartItem&itemId=${item.id}`, null, 'DELETE');
        if (response.success) {
          onRemove(item.id); // Notify parent component
          setError(null);
        } else {
          setError(response.error || 'Failed to remove item');
        }
      } catch (err) {
        setError(err.message || 'Error removing item');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
      <img
        src={item.coverImage || 'https://via.placeholder.com/100'}
        alt={item.title}
        className="w-24 h-32 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="text-gray-600 text-sm">By {item.author || 'Unknown'}</p>
        <p className="text-gray-800 font-medium mt-1">${(item.price || 0).toFixed(2)}</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mt-2 rounded text-sm">{error}</div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={loading || quantity <= 1}
            className={`px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 ${
              loading || quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            -
          </button>
          <span className="text-gray-800">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={loading}
            className={`px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            +
          </button>
        </div>
        <button
          onClick={handleRemove}
          disabled={loading}
          className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;