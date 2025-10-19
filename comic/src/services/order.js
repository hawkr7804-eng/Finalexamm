const BASE_URL = 'http://localhost/Finalexam/MangaMori/backend/routes';

export const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}/orders.php`);
  const data = await response.json();
  return data.data || [];
};
