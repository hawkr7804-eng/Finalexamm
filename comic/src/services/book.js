const BASE_URL = 'http://localhost/Finalexam/comic/backend/routes';

const getAll = async () => {
  const response = await fetch(`${BASE_URL}/book.php?action=getAllBooks`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch books');
  return data.data || [];
};

const create = async (bookData) => {
  const isFormData = bookData instanceof FormData;

  const response = await fetch(`${BASE_URL}/book.php?action=createBook`, {
    method: 'POST',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? bookData : JSON.stringify(bookData),
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to create book');
  return data;
};


const remove = async (bookId) => {
  const response = await fetch(`${BASE_URL}/book.php?action=deleteBook&id=${bookId}`, {
    method: 'GET',
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || 'Failed to delete book');
  return data;
};

export default {
  getAll,
  create,
  remove,
};
