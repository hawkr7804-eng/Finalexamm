import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useId,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { validateInput } from '../utils/validateInput';
import auth from '../services/auth';

const Login = ({ setNotification }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const formId = useId();

  const validationRules = {
    email: (value) => validateInput('email', value),
    password: (value) => validateInput('password', value),
  };

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    validationRules,
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = useCallback(
    async (formValues) => {
      setIsLoggingIn(true);
      try {
        const response = await auth.login({
          email: formValues.email,
          password: formValues.password,
        });

        if (response.success && response.data) {
          const { id, username, email, role } = response.data;
          login({ id, username, email, role });

          setNotification({
            message: `Login successful! Welcome ${role === 'admin' ? 'Admin' : 'User'}`,
            type: 'success',
          });
        } else {
          setNotification({
            message: response.error || 'Login failed',
            type: 'error',
          });
        }
      } catch (error) {
        setNotification({ message: `Login failed: ${error.message}`, type: 'error' });
      } finally {
        setIsLoggingIn(false);
      }
    },
    [login, setNotification]
  );

  useEffect(() => {
    if (user && user.role) {
      navigate(user.role === 'admin' ? '/admin' : '/shop');
    }
  }, [user, navigate]);

  const pageStyle = {
    backgroundColor: '#0d0d0d',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Poppins', sans-serif",
  };

  const containerStyle = {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 0 25px rgba(255, 105, 180, 0.6)',
    width: '100%',
    maxWidth: '400px',
  };

  const titleStyle = {
    color: '#ff69b4',
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    color: '#ffb6c1',
    fontSize: '0.9rem',
    marginBottom: '6px',
    fontWeight: '500',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ff69b4',
    backgroundColor: '#111',
    color: '#fff',
    outline: 'none',
    transition: '0.3s',
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#ff1493',
    border: 'none',
    color: '#fff',
    fontWeight: '600',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: '0.3s',
  };

  const buttonHover = {
    backgroundColor: '#ff69b4',
  };

  const linkStyle = {
    color: '#ff69b4',
    textDecoration: 'none',
    fontWeight: '500',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Login</h2>
        {errors.form && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {errors.form}
          </p>
        )}
        <form onSubmit={handleSubmit(handleLogin)}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor={`${formId}-email`} style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              id={`${formId}-email`}
              name="email"
              value={values.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
            />
            {touched.email && errors.email && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>{errors.email}</p>
            )}
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label htmlFor={`${formId}-password`} style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              id={`${formId}-password`}
              name="password"
              value={values.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              ...buttonStyle,
              ...(isLoggingIn ? { backgroundColor: '#b30059' } : {}),
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#ff1493')}
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#ccc' }}>
          Don’t have an account?{' '}
          <a href="/register" style={linkStyle}>
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
