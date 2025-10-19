import { useContext, useCallback, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { validateInput } from '../utils/validateInput';
import auth from '../services/auth';

const Register = ({ setNotification }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const formId = useId();

  const validationRules = {
    username: (value) => validateInput('username', value),
    email: (value) => validateInput('email', value),
    password: (value) => validateInput('password', value),
  };

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues: { username: '', email: '', password: '' },
    validationRules,
  });

  const handleRegister = useCallback(
    async (formValues) => {
      try {
        const response = await auth.register({
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
        });
        if (response.success) {
          await login({
            email: formValues.email,
            password: formValues.password,
          });
          setNotification({ message: 'Registration successful!', type: 'success' });
          navigate('/login');
        } else {
          throw new Error(response.error || 'Registration failed');
        }
      } catch (error) {
        setNotification({ message: `Registration failed: ${error.message}`, type: 'error' });
        throw new Error(error.message || 'Registration failed');
      }
    },
    [login, setNotification, navigate]
  );

  // === Inline pink & black theme (same as Login) ===
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
        <h2 style={titleStyle}>Register</h2>
        {errors.form && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {errors.form}
          </p>
        )}
        <form onSubmit={handleSubmit(handleRegister)}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor={`${formId}-username`} style={labelStyle}>
              Username
            </label>
            <input
              type="text"
              id={`${formId}-username`}
              name="username"
              value={values.username}
              onChange={handleChange}
              ref={usernameRef}
              style={inputStyle}
              placeholder="Enter your username"
            />
            {touched.username && errors.username && (
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.username}
              </p>
            )}
          </div>

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
              <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '5px' }}>
                {errors.email}
              </p>
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
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#ff1493')}
          >
            Register
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#ccc' }}>
          Already have an account?{' '}
          <a href="/login" style={linkStyle}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
