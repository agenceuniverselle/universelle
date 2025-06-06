<?php

// app/Http/Controllers/Auth/JwtAuthController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use App\Models\User;

class JwtAuthController extends Controller
{
    public function login(Request $request)
    {
        dd('login ok');

        // ✅ Valider les champs
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        // ✅ Authentification avec JWT
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        // ✅ Mettre à jour la date de dernière connexion
       $user = auth()->user();
if ($user instanceof User) {
    $user->last_login = Carbon::now();
    $user->save(); // ✅ Intelephense recognizes save() after type check
}

        return response()->json([
            'access_token' => $token,
            'user' => auth()->user()
        ]);
    }
        // ✅ Fonction de déconnexion
        public function logout()
        {
            try {
                JWTAuth::invalidate(JWTAuth::getToken()); // ✅ Invalider le token JWT
                return response()->json(['message' => 'Déconnexion réussie.'], 200);
            } catch (\Exception $e) {
                return response()->json(['error' => 'Erreur lors de la déconnexion.'], 500);
            }
        }
        public function testLogin(Request $request)
{
    $credentials = [
        'email' => $request->query('email'),
        'password' => $request->query('password'),
    ];

    if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

     $user = auth()->user();
if ($user instanceof User) {
    $user->last_login = Carbon::now();
    $user->save(); // ✅ Intelephense recognizes save() after type check
}

    return response()->json([
        'access_token' => $token,
        'user' => $user
    ]);
}

}
