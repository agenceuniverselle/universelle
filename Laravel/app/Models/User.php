<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject; // ✅ Importer l'interface JWTSubject

class User extends Authenticatable implements JWTSubject // ✅ Implémenter JWTSubject
{

    use HasFactory, Notifiable; // ✅ Supprimé HasApiTokens (incompatible avec JWT)

    protected $fillable = [
        'name', 
        'email', 
        'phone',
        'password', 
        'role', 
        'two_factor_enabled', 
        'two_factor_secret'
    ];

    protected $hidden = [
        'password', 
        'remember_token', 
        'two_factor_secret', 
        'two_factor_recovery_codes',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

       // Les rôles associés à l'utilisateur
       public function roles()
       {
           return $this->belongsToMany(Role::class, 'user_roles');
       }
   
       // Vérifier si l'utilisateur a une permission
       public function hasPermission($permission)
       {
           foreach ($this->roles as $role) {
               if ($role->permissions->contains('name', $permission)) {
                   return true;
               }
           }
           return false;
       }
        // ✅ Méthodes JWT requises
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
