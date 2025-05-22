<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run()
    {
        // ✅ Créer le rôle Super Admin dans la table roles
        $role = Role::firstOrCreate(
            ['name' => 'Super Admin'], 
            ['description' => 'Super Administrateur avec tous les privilèges']
        );

        // ✅ Créer ou mettre à jour l'utilisateur Super Admin
        $user = User::updateOrCreate(
            ['email' => 'contact@universelle.ma'], 
            [
                'name' => 'Mohamed Jaaouan',
                'email' => 'contact@universelle.ma',
                'phone' => '+212 808604195',
                'password' => Hash::make(env('SUPER_ADMIN_PASSWORD', 'Universelle!P@ssword2025')),
                'two_factor_enabled' => false,
            ]
        );

        // ✅ Associer le rôle Super Admin à l'utilisateur
        $user->roles()->sync([$role->id]);

        // ✅ Récupérer toutes les permissions existantes
        $allPermissions = Permission::pluck('id')->toArray();

        // ✅ Associer toutes les permissions à ce rôle Super Admin
        foreach ($allPermissions as $permissionId) {
            // ✅ Ajouter la permission au rôle Super Admin s'il ne l'a pas déjà
            \DB::table('role_permissions')->updateOrInsert(
                ['role_id' => $role->id, 'permission_id' => $permissionId]
            );
        }

        $this->command->info('✅ Super Admin créé ou mis à jour avec toutes les permissions.');
    }
}
