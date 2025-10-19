<?php

class Database {
    private $host = 'localhost';
    private $dbname = 'comic_store';
    private $username = 'root';
    private $password = '';
    public $pdo;

    public function __construct() {
        try {
            $this->pdo = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
}
function getDatabaseConnection() {
    $db = new Database();
    return $db->pdo;
}

?>
