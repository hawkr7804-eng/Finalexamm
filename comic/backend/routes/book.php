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

require_once _DIR_ . '/../config/Database.php';
require_once _DIR_ . '/../controllers/BookController.php';

$database = new Database();
$pdo = $database->pdo;
$bookController = new BookController($pdo);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getAllBooks':
        echo json_encode($bookController->getAllBooks());
        break;

    case 'getBook':
        $id = $_GET['id'] ?? 0;
        echo json_encode($bookController->getBook($id));
        break;

    case 'createBook':
        $input = $_POST;
        $file = $_FILES['image_url'] ?? null;
        $response = $bookController->createBook($input, $file);
        if (!$response['success']) {
            error_log('Create book error: ' . $response['error']);
        }
        echo json_encode($response);
        exit;
        break;

    case 'updateBook':
        $id = $_GET['id'] ?? 0;
        $input = json_decode(file_get_contents('php://input'), true);
        echo json_encode($bookController->updateBook($id, $input));
        break;

    case 'deleteBook':
        $id = $_GET['id'] ?? 0;
        echo json_encode($bookController->deleteBook($id));
        break;

    case 'getAllCategories':
        echo json_encode($bookController->getAllCategories());
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        break;
}