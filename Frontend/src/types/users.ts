// Type représentant une permission (comme dans ta base Laravel)
export interface Permission {
  id:number;
  name: string;          // ex: 'view_users'
  description?: string;  // description optionnelle
}

// Type représentant un rôle avec une liste de permissions (par leurs noms)
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: string[];  // liste des noms de permissions (ex: ['view_users', 'edit_users'])
  isDefault?: boolean;
}

// Type utilisateur, avec un rôle complet (contenant ses permissions)
export interface User {
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  permissions: string[]; // permissions spécifiques à l'utilisateur, en plus de celles du rôle
  status: string;
  phone: string;
  id: string;
  name: string;
  email: string;
  role: Role;        // un seul rôle par utilisateur (objet complet)
  // ou 
  // role_id: number;  // juste l'ID du rôle
  lastActivity?: string;
  createdAt: string;
  lastLogin?: string;
  password?: string;
}

