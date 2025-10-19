<?php
require_once __DIR__ . '/../models/User.php';

class UserController {
    private $userModel;

    public function __construct($pdo) {
        $this->userModel = new User($pdo);
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);

            $username = trim($input['username'] ?? '');
            $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
            $password = $input['password'] ?? '';
            $role = $input['role'] ?? 'user';

            if (!$username || !$email || !$password) {
                return ['success' => false, 'error' => 'All fields are required'];
            }

            $existing = $this->userModel->findByEmail($email);
            if ($existing) {
                return ['success' => false, 'error' => 'Email already registered'];
            }

            $created = $this->userModel->create($username, $email, $password, $role);
            return $created
                ? ['success' => true, 'message' => 'User registered successfully']
                : ['success' => false, 'error' => 'Failed to register user'];
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
            $password = $input['password'] ?? '';

            $user = $this->userModel->verifyPassword($email, $password);
            if ($user) {
                return ['success' => true, 'data' => $user];
            } else {
                return ['success' => false, 'error' => 'Invalid email or password'];
            }
        }
    }

    public function getUser($id) {
        $user = $this->userModel->findById($id);
        if ($user) {
            unset($user['password_hash']);
            return ['success' => true, 'data' => $user];
        }
        return ['success' => false, 'error' => 'User not found'];
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $username = trim($input['username'] ?? '');
            $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
            $role = $input['role'] ?? 'user';

            $updated = $this->userModel->update($id, $username, $email, $role);
            return $updated
                ? ['success' => true, 'message' => 'User updated successfully']
                : ['success' => false, 'error' => 'Failed to update user'];
        }
    }

    public function delete($id) {
        $deleted = $this->userModel->delete($id);
        return $deleted
            ? ['success' => true, 'message' => 'User deleted successfully']
            : ['success' => false, 'error' => 'Failed to delete user'];
    }
}
