import React, { useState, useEffect } from 'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js';
import ReactDOM from 'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js';
import auth from './auth.js';
import api from './api.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [userRole, setUserRole] = useState(auth.getUserRole());
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: '' });

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'admin') {
      window.location.href = '/login.html';
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, userRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api('routes.php?action=getAllUsers', null, 'GET');
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await auth.deleteUser(id);
        if (response.success) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        setError(err.message || 'Error deleting user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ username: user.username, email: user.email, role: user.role });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const response = await auth.updateUser(id, formData);
      if (response.success) {
        setUsers(users.map((user) => (user.id === id ? { ...user, ...formData } : user)));
        setEditingUser(null);
        setFormData({ username: '', email: '', role: '' });
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError(err.message || 'Error updating user');
    }
  };

  const handleLogout = () => {
    auth.logout();
    window.location.href = '/login.html';
  };

  if (!isAuthenticated || userRole !== 'admin') return null;

  return (
    <div className="min-h-screen bg-washi custom-japanese-font text-gray-800 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-indigo-950">管理者ダッシュボード (Admin Dashboard)</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 custom-hover-glow"
          >
            Logout
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="custom-card-shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sakura-accent text-sakura">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    {editingUser === user.id ? (
                      <>
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="border rounded px-2 py-1 w-full"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleUpdate(user.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">{user.id}</td>
                        <td className="px-6 py-4">{user.username}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEdit(user)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<AdminDashboard />, document.getElementById('root'));
export default AdminDashboard;
