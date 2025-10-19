import React, { useState } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
import auth from './auth.js';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await auth.login({ username: formData.username, password: formData.password });
      } else {
        response = await auth.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      }

      if (response.success) {
        const role = auth.getUserRole();
        const redirectUrl = role === 'admin' ? '/admindashboard.html' : '/dashboard.html';
        window.location.href = redirectUrl;
      } else {
        setError(response.error || 'Operation failed');
      }
    } catch (err) {
      setError(err.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and registration
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '', role: 'user' });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label htmlFor="role" className="block text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleMode}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

// Render the component
ReactDOM.render(<AuthForm />, document.getElementById('root'));

export default AuthForm;