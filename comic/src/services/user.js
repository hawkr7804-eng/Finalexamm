const BASE_URL = 'http://localhost/Finalexam/MangaMori/backend/routes';


export const fetchUsers = async () => {
  const response = await fetch(`${BASE_URL}/getUser.php?action=getUser&id`);
  const data = await response.json();
  return data.data || [];
};
