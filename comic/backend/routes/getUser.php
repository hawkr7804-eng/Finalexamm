<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = ['http://localhost:5173', 'http://localhost:5174'];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Session-ID");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/UserController.php';

$pdo = getDatabaseConnection();
$controller = new UserController($pdo);

$id = $_GET['id'] ?? null;
$action = $_GET['action'] ?? '';

if ($action === 'getUser' && $id) {
    $response = $controller->getUser($id);
} else {
    $response = ['success' => false, 'error' => 'Invalid request'];
}

header('Content-Type: application/json');
echo json_encode($response);
