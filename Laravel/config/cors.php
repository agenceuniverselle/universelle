<?php

return [
    'paths' => ['api/*', 'login', 'logout', 'register'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://frontappproject.netlify.app'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => 0,
    'supports_credentials' => false,
];






