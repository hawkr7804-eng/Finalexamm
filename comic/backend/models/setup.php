<?php
require_once __DIR__ . '/../config/database.php'; // fixed path
require_once __DIR__ . '/User.php';               // same folder as setup.php

$pdo = getDatabaseConnection(); // <-- Get the PDO from your database.php

$user = new User($pdo);
echo $user->createStaticAdmin();
