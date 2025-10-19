import api from './api';

const auth = {
  login: async (credentials) => {
    return await api('api.php?action=login', credentials, 'POST');
  },

  register: async (userData) => {
    return await api('api.php?action=register', userData, 'POST');
  },

  logout: () => {
    localStorage.removeItem('userId');
  },

  getUser: async (id) => {
    return await api(`getUser.php?action=getUser&id=${id}`, null, 'GET');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('userId');
  },

  getUserRole: async (id) => {
    const response = await auth.getUser(id);
    return response.success ? response.data.role : null;
  },
};

export default auth;
