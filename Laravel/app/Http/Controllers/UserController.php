<?php


namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Permission; // ✅ Assurez-vous que cette ligne est présente
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    // ✅ Liste des utilisateurs avec leurs rôles et permissions
  public function index()
{
    $users = User::with(['roles.permissions'])->get();

    // On renvoie chaque utilisateur avec son premier rôle uniquement (si présent)
    $users = $users->map(function ($user) {
        $role = $user->roles->first(); // récupérer le premier rôle
        $user->role = $role; // ajouter un attribut virtuel "role"
        unset($user->roles); // enlever "roles" si tu ne veux pas l'envoyer
                // 🔥 Récupère la dernière connexion depuis le cache
        $user->lastLogin = Cache::get("last_login_user_{$user->id}");

        return $user;
    });

    return response()->json(['users' => $users]);
}

    // ✅ Création d'un utilisateur avec rôle
   // app/Http/Controllers/UserController.php

   public function store(Request $request)
{
    Log::info("✅ Requête de création d'utilisateur:", $request->all());

    try {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'array' // ✅ Ajouter la validation des permissions
        ]);

        Log::info("✅ Données validées:", $validatedData);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'],
            'password' => Hash::make($validatedData['password']),
        ]);

        Log::info("✅ Utilisateur créé:", ['user' => $user]);

        // ✅ Assigner le rôle
        $user->roles()->sync([$validatedData['role_id']]);
        Log::info("✅ Rôle assigné à l'utilisateur:", ['role_id' => $validatedData['role_id']]);

        // ✅ Assigner les permissions
        if (!empty($validatedData['permissions'])) {
            $role = Role::findOrFail($validatedData['role_id']);
            foreach ($validatedData['permissions'] as $permissionName) {
                $permission = Permission::firstOrCreate(['name' => $permissionName]);
                if (!$role->permissions->contains($permission->id)) {
                    $role->permissions()->attach($permission->id);
                }
            }
        }

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user->load('roles.permissions')
        ]);
    } catch (\Exception $e) {
        Log::error("❌ Erreur lors de la création de l'utilisateur:", [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'message' => 'Erreur lors de la création de l\'utilisateur.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    // ✅ Suppression d'un utilisateur
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->roles()->detach();
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
    
    public function getUserPermissions(Request $request)
    {
        $user = auth()->user();
        $permissions = $user->roles->flatMap(function ($role) {
            return $role->permissions->pluck('name');
        })->unique()->values();
    
        return response()->json(['permissions' => $permissions]);
    }
//update 

public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $validatedData = $request->validate([
        'name' => 'required|string',
        'email' => 'required|email',
        'phone' => 'nullable|string',
        'role_id' => 'required|integer|exists:roles,id',
        'permissions' => 'array',
        'permissions.*' => 'string',
        'password' => 'nullable|string|min:6',
    ]);

    $user->name = $validatedData['name'];
    $user->email = $validatedData['email'];
    $user->phone = $validatedData['phone'] ?? null;

    if (!empty($validatedData['password'])) {
        $user->password = Hash::make($validatedData['password']);
    }

    $user->save();

    // Synchroniser le rôle (relation many-to-many)
    $user->roles()->sync([$validatedData['role_id']]);

    // Synchroniser les permissions si nécessaire
    if (!empty($validatedData['permissions'])) {
        // Si vous avez une méthode syncPermissions personnalisée
        if (method_exists($user, 'syncPermissions')) {
            $permissionModels = Permission::whereIn('name', $validatedData['permissions'])->get();
            $user->syncPermissions($permissionModels);
        } else {
            // Alternative: mettre à jour les permissions du rôle
            $role = Role::findOrFail($validatedData['role_id']);
            $permissionIds = Permission::whereIn('name', $validatedData['permissions'])
                ->pluck('id')
                ->toArray();
            $role->permissions()->sync($permissionIds);
        }
    }

    return response()->json(['message' => 'Utilisateur mis à jour avec succès.']);
}


}
