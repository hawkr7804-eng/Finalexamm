import { useState, useEffect, useContext, useCallback, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useForm from '../hooks/useForm';
import { validateInput } from '../utils/validateInput';

const Profile = ({ setNotification }) => {
  const { user, updateUser: updateAuthUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationRules = {
    username: (value) => validateInput('username', value),
    email: (value) => validateInput('email', value),
  };

  const { values, errors, touched, handleChange, handleSubmit, resetForm } = useForm({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validationRules,
  });

  const usernameRef = useRef(null);
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotification({ message: 'Please log in to view your profile', type: 'error' });
      navigate('/login');
    }
  }, [user, navigate, setNotification]);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleUpdateProfile = useCallback(
    async (formValues) => {
      setIsSubmitting(true);
      try {
        const updatedUser = await updateUser(user.id, {
          username: formValues.username,
          email: formValues.email,
        });
        updateAuthUser(updatedUser);
        setNotification({ message: 'Profile updated successfully!', type: 'success' });
        resetForm();
      } catch (error) {
        setNotification({ message: `Failed to update profile: ${error.message}`, type: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, updateAuthUser, setNotification, resetForm]
  );

  const handleLogout = useCallback(() => {
    logout();
    setNotification({ message: 'Logged out successfully', type: 'success' });
    navigate('/login');
  }, [logout, setNotification, navigate]);

  // === Shared Style Theme from Admin Dashboard ===
  const pageStyle = {
    backgroundColor: '#0d0d0d',
    color: '#fff',
    minHeight: '100vh',
    padding: '40px',
    fontFamily: "'Poppins', sans-serif",
  };

  const cardStyle = {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 0 20px rgba(255, 105, 180, 0.5)',
    marginBottom: '30px',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#ff69b4',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '30px',
  };

  const labelStyle = {
    display: 'block',
    color: '#ffb6c1',
    marginBottom: '5px',
    fontWeight: '500',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ff69b4',
    backgroundColor: '#111',
    color: '#fff',
    marginBottom: '15px',
    outline: 'none',
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

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ff4d6d',
  };

  if (!user) return null;

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>User Profile</h2>

      <div style={cardStyle}>
        {/* Profile Info */}
        <h3 style={{ color: '#ff69b4', fontSize: '1.5rem', marginBottom: '20px' }}>
          Profile Details
        </h3>
        <p style={{ color: '#ccc', marginBottom: '8px' }}>
          <strong style={{ color: '#fff' }}>Username:</strong> {user.username}
        </p>
        <p style={{ color: '#ccc', marginBottom: '8px' }}>
          <strong style={{ color: '#fff' }}>Email:</strong> {user.email}
        </p>
        <p style={{ color: '#ccc', marginBottom: '25px' }}>
          <strong style={{ color: '#fff' }}>Role:</strong> {user.role}
        </p>

        {/* Update Form */}
        <h3 style={{ color: '#ff69b4', fontSize: '1.3rem', marginBottom: '20px' }}>
          Update Profile
        </h3>
        <form onSubmit={handleSubmit(handleUpdateProfile)}>
          <div>
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
              disabled={isSubmitting}
            />
            {touched.username && errors.username && (
              <p style={{ color: '#ff4d6d', fontSize: '0.9rem' }}>{errors.username}</p>
            )}
          </div>

          <div>
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
              disabled={isSubmitting}
            />
            {touched.email && errors.email && (
              <p style={{ color: '#ff4d6d', fontSize: '0.9rem' }}>{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: isSubmitting ? '#ff69b4' : '#ff1493',
              opacity: isSubmitting ? 0.6 : 1,
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#ff69b4')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#ff1493')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </form>

        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#ff6b81')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ff4d6d')}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
