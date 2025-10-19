
import { createContext, useState, useCallback } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  // useState: Manage wishlist items
  const [wishlist, setWishlist] = useState([]);

  // useCallback: Add item to wishlist
  const addToWishlist = useCallback((item) => {
    setWishlist((prev) => {
      const existingItem = prev.find((wishlistItem) => wishlistItem.id === item.id);
      if (existingItem) {
        return prev; // Item already in wishlist
      }
      return [...prev, item];
    });
  }, []);

  // useCallback: Remove item from wishlist
  const removeFromWishlist = useCallback((itemId) => {
    setWishlist((prev) => prev.filter((wishlistItem) => wishlistItem.id !== itemId));
  }, []);

  const value = { wishlist, addToWishlist, removeFromWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
