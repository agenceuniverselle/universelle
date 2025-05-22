<?php

return [

    'defaults' => [
    'guard' => 'api',
    'passwords' => 'users',
],

'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
        'hash' => false,
    ],
],
'providers' => [
    'users' => [
        'driver' => 'eloquent', // ✅ Utiliser Eloquent pour le modèle User
        'model' => App\Models\User::class, // ✅ Assurez-vous que ce modèle existe
    ],
]
];