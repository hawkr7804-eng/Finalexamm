const API_BASE_URL = 'http://localhost/Finalexam/comic/backend/routes';

const api = async (endpoint, data = null, method = 'GET') => {
  const url = `${API_BASE_URL}/${endpoint}`;

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Invalid JSON response:', text);
      throw new Error('Invalid JSON response from server');
    }
  } catch (networkError) {
    console.error('Network error:', networkError.message);
    throw new Error('Failed to connect to the server');
  }
};

export default api;
