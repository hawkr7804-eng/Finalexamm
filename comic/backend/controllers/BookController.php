<?php

require_once _DIR_ . '/../models/Book.php';

class BookController {
    private $bookModel;
    private $pdo;

    public function __construct($pdo) {
        $this->bookModel = new Book($pdo);
        $this->pdo = $pdo;
    }

    public function getAllBooks() {
        try {
            $books = $this->bookModel->getAll();
            return ['success' => true, 'data' => $books];
        } catch (Exception $e) {
            error_log('Get all books error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to fetch books: ' . $e->getMessage()];
        }
    }

    public function getBook($id) {
        if (!is_numeric($id) || $id <= 0) {
            return ['success' => false, 'error' => 'Invalid book ID'];
        }

        $book = $this->bookModel->findById($id);
        return $book
            ? ['success' => true, 'data' => $book]
            : ['success' => false, 'error' => 'Book not found'];
    }

    public function createBook($input, $file = null) {
        $required = ['title', 'author', 'genre', 'price', 'stock', 'description', 'category_id'];
        foreach ($required as $key) {
            if (!isset($input[$key]) || trim($input[$key]) === '') {
                return ['success' => false, 'error' => "Missing or empty required field: $key"];
            }
        }

        if (!is_numeric($input['price']) || $input['price'] < 0) {
            return ['success' => false, 'error' => 'Price must be a valid non-negative number'];
        }
        if (!is_numeric($input['stock']) || $input['stock'] < 0 || floor($input['stock']) != $input['stock']) {
            return ['success' => false, 'error' => 'Stock must be a valid non-negative integer'];
        }
        if (!is_numeric($input['category_id']) || $input['category_id'] <= 0) {
            return ['success' => false, 'error' => 'Category ID must be a valid positive integer'];
        }

        $input = array_map('trim', $input);

        // Log file details for debugging
        error_log('File input: ' . json_encode($file));
        if (!$file) {
            return ['success' => false, 'error' => 'No file provided in request'];
        }
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return ['success' => false, 'error' => 'File upload failed: No temporary file path'];
        }
        if (!is_uploaded_file($file['tmp_name'])) {
            return ['success' => false, 'error' => 'File upload failed: Not a valid uploaded file'];
        }

        if ($file && isset($file['tmp_name']) && is_uploaded_file($file['tmp_name'])) {
            $uploadDir = _DIR_ . '/../Uploads/';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0777, true)) {
                    return ['success' => false, 'error' => 'Failed to create upload directory'];
                }
            }

            $filename = uniqid() . '_' . basename($file['name']);
            $targetPath = $uploadDir . $filename;

            if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
                return ['success' => false, 'error' => 'Failed to move uploaded image'];
            }
            $input['image_url'] = 'Uploads/' . $filename;
        } else {
            return ['success' => false, 'error' => 'Invalid or missing image file'];
        }

        try {
            $result = $this->bookModel->create($input);
            if ($result) {
                return ['success' => true, 'message' => 'Book created'];
            }
            return ['success' => false, 'error' => 'Failed to create book in database'];
        } catch (Exception $e) {
            error_log('Create book error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to create book: ' . $e->getMessage()];
        }
    }

    public function updateBook($id, $input) {
        if (!is_numeric($id) || $id <= 0) {
            return ['success' => false, 'error' => 'Invalid book ID'];
        }

        $input = array_map('trim', $input);

        if (isset($input['price']) && (!is_numeric($input['price']) || $input['price'] < 0)) {
            return ['success' => false, 'error' => 'Price must be a valid non-negative number'];
        }
        if (isset($input['stock']) && (!is_numeric($input['stock']) || $input['stock'] < 0 || floor($input['stock']) != $input['stock'])) {
            return ['success' => false, 'error' => 'Stock must be a valid non-negative integer'];
        }
        if (isset($input['category_id']) && (!is_numeric($input['category_id']) || $input['category_id'] <= 0)) {
            return ['success' => false, 'error' => 'Category ID must be a valid positive integer'];
        }

        try {
            $result = $this->bookModel->update($id, $input);
            return $result
                ? ['success' => true, 'message' => 'Book updated']
                : ['success' => false, 'error' => 'Failed to update book'];
        } catch (Exception $e) {
            error_log('Update book error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to update book: ' . $e->getMessage()];
        }
    }

    public function deleteBook($id) {
        if (!is_numeric($id) || $id <= 0) {
            return ['success' => false, 'error' => 'Invalid book ID'];
        }

        try {
            $result = $this->bookModel->delete($id);
            return $result
                ? ['success' => true, 'message' => 'Book deleted']
                : ['success' => false, 'error' => 'Failed to delete book'];
        } catch (Exception $e) {
            error_log('Delete book error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to delete book: ' . $e->getMessage()];
        }
    }

    public function getAllCategories() {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM categories");
            $stmt->execute();
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $categories];
        } catch (Exception $e) {
            error_log('Get all categories error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to fetch categories: ' . $e->getMessage()];
        }
    }
}