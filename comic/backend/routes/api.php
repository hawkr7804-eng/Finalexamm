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


// ✅ Dependencies
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../controllers/UserController.php';


// ✅ Initialize controller
$database = new Database();
$pdo = $database->pdo;
$userController = new UserController($pdo);

// ✅ Get action from query string
$action = $_GET['action'] ?? '';

// ✅ Route requests
switch ($action) {
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo json_encode($userController->register());
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case 'login':
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo json_encode($userController->login());
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case 'update':
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $id = (int) ($_GET['id'] ?? 0);
            if ($id > 0) {
                echo json_encode($userController->update($id));
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case 'delete':
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $id = (int) ($_GET['id'] ?? 0);
            if ($id > 0) {
                echo json_encode($userController->delete($id));
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    case 'getUser':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $id = (int) ($_GET['id'] ?? 0);
            if ($id > 0) {
                echo json_encode($userController->getUser($id));
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Invalid user ID']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        break;
}
