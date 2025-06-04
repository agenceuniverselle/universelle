<?php

// config/cors.php
// config/cors.php
return [
    'paths' => ['api/*', 'login', 'logout', 'register'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://universelle.ma','http://localhost:8080','http://localhost:8000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'X-CSRF-Token', 'Authorization', 'Accept'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 0,
    'supports_credentials' => false, // 🚨 Mettre sur false pour JWT (pas de cookies)
];





