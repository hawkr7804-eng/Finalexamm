import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ cartItemCount }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        backgroundColor: '#0d0d0d',
        boxShadow: '0 0 15px rgba(255, 105, 180, 0.4)',
        borderBottom: '1px solid #ff69b4',
        padding: '15px 40px',
        fontFamily: "'Poppins', sans-serif",
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#ff69b4',
            textShadow: '0 0 10px rgba(255,105,180,0.8)',
            letterSpacing: '1px',
            textDecoration: 'none',
            transition: '0.3s',
          }}
          onMouseOver={(e) => (e.target.style.color = '#ff1493')}
          onMouseOut={(e) => (e.target.style.color = '#ff69b4')}
        >
          マンガ森
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link
            to="/shop"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '500',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = '#fff')}
          >
            Shop
          </Link>

          <Link
            to="/cart"
            style={{
              position: 'relative',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '500',
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.color = '#fff')}
          >
            Cart
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  backgroundColor: '#ff1493',
                  color: '#fff',
                  fontSize: '12px',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  boxShadow: '0 0 10px rgba(255,105,180,0.8)',
                }}
              >
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                style={{
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
                onMouseOut={(e) => (e.target.style.color = '#fff')}
              >
                Profile
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: '0.3s',
                  }}
                  onMouseOver={(e) => (e.target.style.color = '#ff69b4')}
                  onMouseOut={(e) => (e.target.style.color = '#fff')}
                >
                  Admin
                </Link>
              )}

              <button
                onClick={logout}
                style={{
                  backgroundColor: '#ff1493',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '600',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#ff69b4')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ff1493')}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  backgroundColor: '#ff1493',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#ff69b4')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ff1493')}
              >
                Login
              </Link>

              <Link
                to="/register"
                style={{
                  backgroundColor: '#ff69b4',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#ff1493')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#ff69b4')}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
