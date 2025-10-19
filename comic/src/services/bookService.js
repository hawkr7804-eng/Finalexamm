// src/services/bookService.js

const BASE_URL = 'http://localhost/Finalexam/comic/backend/routes/book.php';

const getAll = async () => {
  const response = await fetch(
    `${BASE_URL}?action=getAllBooks&_=${Date.now()}`
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch books');
  }
  return result.data;
};

const getById = async (id) => {
  const response = await fetch(`${BASE_URL}?action=getBook&id=${id}`);
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch book');
  }
  return result.data;
};

const create = async (payload) => {
  const response = await fetch(`${BASE_URL}?action=createBook`, {
    method: 'POST',
    body: payload, // FormData, no need for headers
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to create book');
  }
  return result;
};

const update = async (id, payload) => {
  const response = await fetch(`${BASE_URL}?action=updateBook&id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to update book');
  }
  return result;
};

const remove = async (id) => {
  const response = await fetch(`${BASE_URL}?action=deleteBook&id=${id}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete book');
  }
  return result;
};

const getCategories = async () => {
  const response = await fetch(
    `${BASE_URL}?action=getAllCategories&_=${Date.now()}`
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch categories');
  }
  return result.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getCategories,
};
