<?php

class Book {
    private $pdo;
    private $table = 'books';

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // Get all books
    public function getAll() {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Find book by ID
    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new book
    public function create($data) {
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO books (title, author, genre, price, stock, description, image_url, category_id)
                VALUES (:title, :author, :genre, :price, :stock, :description, :image_url, :category_id)
            ");
            $result = $stmt->execute([
                ':title' => $data['title'],
                ':author' => $data['author'],
                ':genre' => $data['genre'],
                ':price' => (float) $data['price'], // Cast to float for DECIMAL
                ':stock' => (int) $data['stock'],   // Cast to int for INT
                ':description' => $data['description'],
                ':image_url' => $data['image_url'],
                ':category_id' => (int) $data['category_id'] // Cast to int for INT
            ]);
            if (!$result) {
                error_log('Book insert failed: No rows affected');
                return false;
            }
            return true;
        } catch (PDOException $e) {
            error_log('Book insert error: ' . $e->getMessage());
            throw new Exception('Database error: ' . $e->getMessage()); // Throw exception to propagate error
        }
    }

    // Update book
    public function update($id, $data) {
        try {
            $stmt = $this->pdo->prepare("
                UPDATE {$this->table}
                SET title = :title,
                    author = :author,
                    genre = :genre,
                    price = :price,
                    stock = :stock,
                    description = :description,
                    image_url = :image_url,
                    category_id = :category_id
                WHERE id = :id
            ");
            return $stmt->execute([
                ':title' => $data['title'],
                ':author' => $data['author'],
                ':genre' => $data['genre'],
                ':price' => (float) $data['price'],
                ':stock' => (int) $data['stock'],
                ':description' => $data['description'],
                ':image_url' => $data['image_url'],
                ':category_id' => (int) $data['category_id'],
                ':id' => $id
            ]);
        } catch (PDOException $e) {
            error_log('Book update error: ' . $e->getMessage());
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }

    // Delete book
    public function delete($id) {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE id = ?");
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            error_log('Book delete error: ' . $e->getMessage());
            throw new Exception('Database error: ' . $e->getMessage());
        }
    }
}