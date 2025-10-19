<?php
// ✅ Dependencies
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/BookController.php';

// ✅ Initialize controller
$pdo = getDatabaseConnection(); // This now works!
$controller = new BookController($pdo);

// ✅ Determine request method
$method = $_SERVER['REQUEST_METHOD'];
parse_str($_SERVER['QUERY_STRING'] ?? '', $query);
$id = $query['id'] ?? null;

switch ($method) {
    case 'GET':
        $response = $id
            ? $controller->getBook($id)
            : $controller->getAllBooks();
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $response = $controller->createBook($input);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $response = ($id && $input)
            ? $controller->updateBook($id, $input)
            : ['error' => 'Missing book ID or input'];
        break;

    case 'DELETE':
        $response = $id
            ? $controller->deleteBook($id)
            : ['error' => 'Missing book ID'];
        break;

    default:
        $response = ['error' => 'Unsupported request method'];
        break;
}

// ✅ Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
