<?php

class User {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($username, $email, $password, $role = 'user') {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, email, password_hash, role) 
                VALUES (:username, :email, :password_hash, :role)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash,
            'role' => $role
        ]);
    }

    public function findById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByEmail($email) {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, $username, $email, $role) {
        $stmt = $this->pdo->prepare("UPDATE users 
                                     SET username = :username, email = :email, role = :role 
                                     WHERE id = :id");
        return $stmt->execute([
            'id' => $id,
            'username' => $username,
            'email' => $email,
            'role' => $role
        ]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    public function verifyPassword($email, $password) {
        $user = $this->findByEmail($email);
        if ($user && password_verify($password, $user['password_hash'])) {
            unset($user['password_hash']);
            return $user;
        }
        return false;
    }

    // 🧩 STATIC ADMIN CREATOR
    public function createStaticAdmin() {
        $adminEmail = "admin@example.com";
        $existingAdmin = $this->findByEmail($adminEmail);

        if (!$existingAdmin) {
            $username = "admin";
            $password = "admin123"; // you can change this anytime
            $role = "admin";

            $this->create($username, $adminEmail, $password, $role);
            return "✅ Static admin account created successfully!";
        } else {
            return "ℹ️ Admin account already exists.";
        }
    }
}
