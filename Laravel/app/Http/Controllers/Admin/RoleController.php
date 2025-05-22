<?php

// app/Http/Controllers/Admin/RoleController.php
namespace App\Http\Controllers\Admin;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log; // ✅ Import de Log
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{
    public function store(Request $request)
    {
        Log::info("Utilisateur connecté:", ['user' => Auth::user()]);

        if (!Auth::check()) {
            return response()->json(['error' => 'Non authentifié.'], 401);
        }

        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json(['role' => $role->load('permissions')], 201);
    }


    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json(['roles' => $roles]);
    }
 // ✅ Mettre à jour les permissions d'un rôle
 public function update(Request $request, $id)
 {
     $role = Role::findOrFail($id);

     $request->validate([
         'name' => 'required|string|unique:roles,name,' . $role->id,
         'description' => 'string|nullable',
         'permissions' => 'array',
     ]);

     $role->update([
         'name' => $request->name,
         'description' => $request->description,
     ]);

     if ($request->has('permissions')) {
         $role->permissions()->sync($request->permissions);
     }

     return response()->json(['role' => $role->load('permissions')]);
 }

 // ✅ Supprimer un rôle
 public function destroy($id)
 {
     $role = Role::findOrFail($id);
     $role->permissions()->detach();
     $role->delete();

     return response()->json(['message' => 'Role supprimé avec succès.']);
 }

 // ✅ Récupérer toutes les permissions disponibles
 public function allPermissions()
 {
     $permissions = Permission::all();
     return response()->json(['permissions' => $permissions]);
 }
}