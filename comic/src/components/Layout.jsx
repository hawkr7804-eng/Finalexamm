import {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
  useId,
} from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from './Navbar';
import Footer from './Footer';
import Notification from './Notification';
import '../styles/custom.css';

const Layout = ({ children, setNotification }) => {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  const [localNotification, setLocalNotification] = useState(null);
  const mainRef = useRef(null);
  const layoutId = useId();

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const isAuthPage = useMemo(() => {
    return ['/login', '/register'].includes(location.pathname);
  }, [location.pathname]);

  const showNotification = useCallback(
    (message, type = 'info') => {
      setLocalNotification({ message, type });
      setNotification({ message, type });
      setTimeout(() => {
        setLocalNotification(null);
        setNotification(null);
      }, 3000);
    },
    [setNotification]
  );

  useEffect(() => {
    if (user && !isAuthPage) {
      showNotification(`Welcome, ${user.username}!`, 'success');
    }
  }, [user, isAuthPage, showNotification]);

  const handleClick = useCallback(() => {
    console.log('Layout container clicked');
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed in layout');
    }
  }, []);

  const handleFocus = useCallback(() => {
    mainRef.current.classList.add('focus-glow');
  }, []);

  const handleBlur = useCallback(() => {
    mainRef.current.classList.remove('focus-glow');
  }, []);

  return (
    <div
      id={layoutId}
      tabIndex="0"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      className={`min-h-screen flex flex-col ${
        isAuthPage
          ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white'
          : 'bg-gradient-to-br from-indigo-950 via-purple-950 to-indigo-900 text-gray-100'
      }`}
    >
      {!isAuthPage && <Navbar cartItemCount={cartItemCount} />}

      <main
        ref={mainRef}
        className={`flex-grow w-full ${
          isAuthPage
            ? 'flex items-center justify-center'
            : 'max-w-7xl mx-auto px-6 py-6'
        }`}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {localNotification && (
          <Notification
            message={localNotification.message}
            type={localNotification.type}
            onClose={() => setLocalNotification(null)}
          />
        )}
        <div className="bg-gray-900/50 rounded-2xl shadow-lg p-6 w-full backdrop-blur-md border border-gray-700">
          {children}
        </div>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;
