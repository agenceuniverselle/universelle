<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        $permissions = [
            // Permissions pour les utilisateurs
            ['name' => 'view_users', 'description' => 'Voir la liste des utilisateurs'],
            ['name' => 'create_users', 'description' => 'Créer de nouveaux utilisateurs'],
            ['name' => 'edit_users', 'description' => 'Modifier les utilisateurs'],
            ['name' => 'delete_users', 'description' => 'Supprimer les utilisateurs'],

            // Permissions pour les rôles
            ['name' => 'view_roles', 'description' => 'Voir les rôles'],
            ['name' => 'create_roles', 'description' => 'Créer des rôles'],
            ['name' => 'edit_roles', 'description' => 'Modifier les rôles'],
            ['name' => 'delete_roles', 'description' => 'Supprimer les rôles'],

            // Permissions pour les biens immobiliers
            ['name' => 'view_properties', 'description' => 'Voir les biens immobiliers'],
            ['name' => 'create_properties', 'description' => 'Créer des biens immobiliers'],
            ['name' => 'edit_properties', 'description' => 'Modifier les biens immobiliers'],
            ['name' => 'delete_properties', 'description' => 'Supprimer les biens immobiliers'],

            // Permissions pour les investissements
            ['name' => 'view_investments', 'description' => 'Voir les investissements'],
            ['name' => 'create_investments', 'description' => 'Créer des investissements'],
            ['name' => 'edit_investments', 'description' => 'Modifier les investissements'],
            ['name' => 'delete_investments', 'description' => 'Supprimer les investissements'],

            // Permissions pour les blogs
            ['name' => 'view_blogs', 'description' => 'Voir les blogs'],
            ['name' => 'create_blogs', 'description' => 'Créer des blogs'],
            ['name' => 'edit_blogs', 'description' => 'Modifier les blogs'],
            ['name' => 'delete_blogs', 'description' => 'Supprimer les blogs'],

            // Permissions pour les témoignages
            ['name' => 'view_testimonials', 'description' => 'Voir les témoignages'],
            ['name' => 'create_testimonials', 'description' => 'Créer des témoignages'],
            ['name' => 'edit_testimonials', 'description' => 'Modifier les témoignages'],
            ['name' => 'delete_testimonials', 'description' => 'Supprimer les témoignages'],

            // Permissions pour les messages/contacts
            ['name' => 'view_contacts', 'description' => 'Voir les messages de contact'],
            ['name' => 'reply_contacts', 'description' => 'Répondre aux messages de contact'],

            // Permissions pour les offres exclusives
            ['name' => 'view_exclusive_offers', 'description' => 'Voir les offres exclusives'],
            ['name' => 'create_exclusive_offers', 'description' => 'Créer des offres exclusives'],
            ['name' => 'edit_exclusive_offers', 'description' => 'Modifier les offres exclusives'],
            ['name' => 'delete_exclusive_offers', 'description' => 'Supprimer les offres exclusives'],

        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission['name']], $permission);
        }
    }
}
