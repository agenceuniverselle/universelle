export type Role = 
  | 'Super Admin' 
  | 'Administrateur' 
  | 'Manager'
  | 'Agent Immobilier'
  | 'Investisseur' 
  | 'Client Acheteur'
  | 'Comptable'
  | 'Support Client'
  | 'Commercial'
  | 'Gestionnaire CRM'
  | 'Acheteur';

export type Permission = 
  | 'user.create' 
  | 'user.read' 
  | 'user.update' 
  | 'user.delete'
  | 'user.manage_roles'
  | 'property.create'
  | 'property.read'
  | 'property.update'
  | 'property.delete'
  | 'lead.create'
  | 'lead.read'
  | 'lead.update'
  | 'lead.delete'
  | 'lead.assign'
  | 'investment.create'
  | 'investment.read'
  | 'investment.update'
  | 'investment.delete'
  | 'transaction.create'
  | 'transaction.read'
  | 'transaction.update'
  | 'transaction.delete'
  | 'content.manage'
  | 'settings.manage'
  | 'stats.view'
  | 'logs.view'
  | 'team.manage'
  | 'client.read_own'
  | 'client.read_all'
  | 'finance.manage'
  | 'export.data'
  | 'ticket.create'
  | 'ticket.read'
  | 'ticket.update'
  | 'ticket.assign';

export interface RoleDefinition {
  name: Role;
  description: string;
  permissions: Permission[];
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive' | 'En attente';
  lastLogin: string;
  registeredDate: string;
  phone?: string;
  permissions?: Permission[];
  twoFactorEnabled?: boolean;
  lastActivity?: string;
  lastPasswordChange?: string;
  password?: string;
}

export const defaultRoles: RoleDefinition[] = [
  {
    name: 'Super Admin',
    description: 'Accès total à tout le système',
    permissions: [
      'user.create', 'user.read', 'user.update', 'user.delete', 'user.manage_roles',
      'property.create', 'property.read', 'property.update', 'property.delete',
      'lead.create', 'lead.read', 'lead.update', 'lead.delete', 'lead.assign',
      'investment.create', 'investment.read', 'investment.update', 'investment.delete',
      'transaction.create', 'transaction.read', 'transaction.update', 'transaction.delete',
      'content.manage', 'settings.manage', 'stats.view', 'logs.view',
      'team.manage', 'client.read_all', 'finance.manage', 'export.data',
      'ticket.create', 'ticket.read', 'ticket.update', 'ticket.assign'
    ],
    isDefault: true
  },
  {
    name: 'Administrateur',
    description: 'Gestion des biens, des utilisateurs (sauf Super Admin), des ventes et des investissements',
    permissions: [
      'user.create', 'user.read', 'user.update', 'user.delete',
      'property.create', 'property.read', 'property.update', 'property.delete',
      'lead.create', 'lead.read', 'lead.update', 'lead.delete', 'lead.assign',
      'investment.create', 'investment.read', 'investment.update', 'investment.delete',
      'transaction.create', 'transaction.read', 'transaction.update', 'transaction.delete',
      'content.manage', 'stats.view', 'team.manage', 'client.read_all', 'export.data'
    ],
    isDefault: true
  },
  {
    name: 'Manager',
    description: 'Gestion des équipes et du CRM, attribution de leads aux agents',
    permissions: [
      'lead.create', 'lead.read', 'lead.update', 'lead.delete', 'lead.assign',
      'property.read',
      'team.manage', 'client.read_all', 'stats.view',
      'ticket.read', 'ticket.update', 'ticket.assign'
    ],
    isDefault: true
  },
  {
    name: 'Agent Immobilier',
    description: 'Gestion des biens immobiliers et des clients assignés',
    permissions: [
      'property.create', 'property.read', 'property.update',
      'lead.read', 'lead.update',
      'client.read_own', 'transaction.read'
    ],
    isDefault: true
  },
  {
    name: 'Commercial',
    description: 'Vente de biens immobiliers et gestion des clients',
    permissions: [
      'property.read',
      'lead.read', 'lead.update',
      'client.read_own', 'transaction.read'
    ],
    isDefault: true
  },
  {
    name: 'Gestionnaire CRM',
    description: 'Gestion des leads et des prospects dans le CRM',
    permissions: [
      'lead.create', 'lead.read', 'lead.update', 'lead.assign',
      'client.read_all'
    ],
    isDefault: true
  },
  {
    name: 'Investisseur',
    description: 'Accès aux opportunités d\'investissement et suivi des transactions personnelles',
    permissions: [
      'investment.read',
      'transaction.read',
      'client.read_own'
    ],
    isDefault: true
  },
  {
    name: 'Client Acheteur',
    description: 'Recherche et consultation des biens disponibles',
    permissions: [
      'property.read',
      'client.read_own'
    ],
    isDefault: true
  },
  {
    name: 'Acheteur',
    description: 'Recherche et consultation des biens disponibles',
    permissions: [
      'property.read',
      'client.read_own'
    ],
    isDefault: true
  },
  {
    name: 'Comptable',
    description: 'Gestion des finances, paiements et facturation',
    permissions: [
      'transaction.create', 'transaction.read', 'transaction.update',
      'finance.manage', 'export.data'
    ],
    isDefault: true
  },
  {
    name: 'Support Client',
    description: 'Gestion des tickets et assistance aux clients',
    permissions: [
      'ticket.create', 'ticket.read', 'ticket.update', 'ticket.assign',
      'client.read_all'
    ],
    isDefault: true
  }
];

export const permissionDescriptions: Record<Permission, string> = {
  'user.create': 'Créer des utilisateurs',
  'user.read': 'Voir les utilisateurs',
  'user.update': 'Modifier des utilisateurs',
  'user.delete': 'Supprimer des utilisateurs',
  'user.manage_roles': 'Gérer les rôles et permissions',
  'property.create': 'Créer des biens immobiliers',
  'property.read': 'Voir les biens immobiliers',
  'property.update': 'Modifier des biens immobiliers',
  'property.delete': 'Supprimer des biens immobiliers',
  'lead.create': 'Créer des leads',
  'lead.read': 'Voir les leads',
  'lead.update': 'Modifier des leads',
  'lead.delete': 'Supprimer des leads',
  'lead.assign': 'Assigner des leads aux agents',
  'investment.create': 'Créer des investissements',
  'investment.read': 'Voir les investissements',
  'investment.update': 'Modifier des investissements',
  'investment.delete': 'Supprimer des investissements',
  'transaction.create': 'Créer des transactions',
  'transaction.read': 'Voir les transactions',
  'transaction.update': 'Modifier des transactions',
  'transaction.delete': 'Supprimer des transactions',
  'content.manage': 'Gérer le contenu du site',
  'settings.manage': 'Gérer les paramètres globaux',
  'stats.view': 'Voir les statistiques',
  'logs.view': 'Voir les logs d\'activité',
  'team.manage': 'Gérer les équipes',
  'client.read_own': 'Voir ses propres informations client',
  'client.read_all': 'Voir tous les clients',
  'finance.manage': 'Gérer les finances',
  'export.data': 'Exporter des données',
  'ticket.create': 'Créer des tickets de support',
  'ticket.read': 'Voir les tickets de support',
  'ticket.update': 'Mettre à jour les tickets de support',
  'ticket.assign': 'Assigner des tickets de support'
};
