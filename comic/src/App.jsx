import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ThemeToggle from './components/ThemeToggle';
import Notification from './components/Notification';
import Shop from './pages/Shop';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/profile" replace />;

  return children;
};

const App = () => {
  const [notification, setNotification] = useState(null);
  const themeToggleRef = useRef(null);
  const { user } = useContext(AuthContext);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const routes = useMemo(() => [
    { path: '/shop', element: <Shop setNotification={showNotification} /> },
    { path: '/book/:id', element: <BookDetails setNotification={showNotification} /> },
    { path: '/cart', element: <ProtectedRoute><Cart setNotification={showNotification} /></ProtectedRoute> },
    { path: '/wishlist', element: <ProtectedRoute><Wishlist setNotification={showNotification} /></ProtectedRoute> },
    { path: '/profile', element: <ProtectedRoute><Profile setNotification={showNotification} /></ProtectedRoute> },
    { path: '/admin', element: <ProtectedRoute requiredRole="admin"><Admin setNotification={showNotification} /></ProtectedRoute> },
    {
      path: '/login',
      element: user ? <Navigate to={user.role === 'admin' ? '/admin' : '/shop'} replace /> : <Login setNotification={showNotification} />,
    },
    { path: '/register', element: <Register setNotification={showNotification} /> },
  ], [showNotification, user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <Layout setNotification={showNotification}>
              <div className="max-w-screen-xl mx-auto w-full px-4">
                <Routes>
                  {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                  ))}
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>

                <ThemeToggle ref={themeToggleRef} />

                {notification && (
                  <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                  />
                )}
              </div>
            </Layout>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
