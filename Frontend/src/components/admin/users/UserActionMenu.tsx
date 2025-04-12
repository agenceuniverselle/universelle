import React, { useState } from 'react';
import { User, Role } from '@/types/users';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  UserCog, 
  Eye, 
  Edit, 
  UserX, 
  UserCheck, 
  ShieldAlert, 
  KeyRound, 
  Lock, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { PasswordResetDialog } from './PasswordResetDialog';

interface UserActionMenuProps {
  user: User;
  currentUserRole: Role;
  onViewProfile: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onChangeRole: (userId: string, newRole: Role) => void;
  onToggleStatus: (userId: string, newStatus: 'Active' | 'Inactive') => void;
  onResetPassword: (userId: string) => void;
  onResetPasswordManually: (userId: string, password: string, options: {forceChange: boolean, sendEmail: boolean}) => void;
  onToggle2FA: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({
  user,
  currentUserRole,
  onViewProfile,
  onEditUser,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onResetPasswordManually,
  onToggle2FA,
  onDelete
}) => {
  // State for confirmation dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Determine access permissions based on current user role and target user
  const canManageUser = (() => {
    if (currentUserRole === 'Super Admin') {
      return true; // Super Admin can manage everyone
    }
    
    if (currentUserRole === 'Administrateur') {
      // Admin can manage everyone except Super Admins
      return user.role !== 'Super Admin';
    }
    
    if (currentUserRole === 'Manager') {
      // Manager can't manage Super Admins, Admins, or other Managers
      return !['Super Admin', 'Administrateur', 'Manager'].includes(user.role);
    }
    
    return false; // Other roles can't manage users
  })();
  
  // Define which roles the current user can assign
  const getAvailableRoles = (): Role[] => {
    switch (currentUserRole) {
      case 'Super Admin':
        return [
          'Super Admin',
          'Administrateur',
          'Manager',
          'Agent Immobilier',
          'Investisseur',
          'Client Acheteur',
          'Comptable',
          'Support Client'
        ];
      case 'Administrateur':
        return [
          'Manager',
          'Agent Immobilier',
          'Investisseur',
          'Client Acheteur',
          'Comptable',
          'Support Client'
        ];
      case 'Manager':
        return [
          'Agent Immobilier',
          'Client Acheteur'
        ];
      default:
        return [];
    }
  };
  
  const availableRoles = getAvailableRoles().filter(role => role !== user.role); // Don't show current role

  // Handle role selection
  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDialogOpen(true);
  };

  // Handle role confirmation
  const handleRoleConfirm = () => {
    if (selectedRole) {
      onChangeRole(user.id, selectedRole);
      setIsRoleDialogOpen(false);
      setSelectedRole(null);
    }
  };
  
  // Handle status confirmation
  const handleStatusConfirm = () => {
    onToggleStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active');
    setIsStatusDialogOpen(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    onDelete(user.id);
    setIsDeleteDialogOpen(false);
  };
  
  // User can't delete themselves
  const isSelfUser = user.id === 'U006'; // Assuming U006 is the current logged in user, in a real app this would be checked properly
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-ring">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions pour {user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions pour {user.name}</DropdownMenuLabel>
          
          <DropdownMenuItem onClick={() => onViewProfile(user.id)} className="cursor-pointer">
            <Eye className="h-4 w-4 mr-2" />
            Voir le profil
          </DropdownMenuItem>
          
          {canManageUser && (
            <>
              <DropdownMenuItem onClick={() => onEditUser(user.id)} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2" />
                Modifier le profil
              </DropdownMenuItem>
            
              <DropdownMenuSeparator />
              
              {availableRoles.length > 0 && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <UserCog className="h-4 w-4 mr-2" />
                    Changer le rôle
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {availableRoles.map(role => (
                        <DropdownMenuItem 
                          key={role} 
                          onClick={() => handleRoleSelect(role)}
                          className="cursor-pointer"
                        >
                          {role}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              )}
              
              {user.status === 'Active' ? (
                <DropdownMenuItem 
                  onClick={() => setIsStatusDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Désactiver le compte
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => onToggleStatus(user.id, 'Active')}
                  className="cursor-pointer"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Activer le compte
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => setIsPasswordResetDialogOpen(true)}
                className="cursor-pointer"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Réinitialiser le mot de passe
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => onToggle2FA(user.id)}
                className="cursor-pointer"
              >
                <Lock className="h-4 w-4 mr-2" />
                {user.twoFactorEnabled ? 'Désactiver' : 'Activer'} 2FA
              </DropdownMenuItem>
              
              {!isSelfUser && canManageUser && (
                ['Super Admin', 'Administrateur'].includes(currentUserRole) && 
                !['Super Admin', 'Administrateur'].includes(user.role) || 
                (currentUserRole === 'Super Admin' && user.role === 'Administrateur')
              ) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 cursor-pointer" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer l'utilisateur
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Password Reset Dialog */}
      <PasswordResetDialog
        user={isPasswordResetDialogOpen ? user : null}
        open={isPasswordResetDialogOpen}
        onClose={() => setIsPasswordResetDialogOpen(false)}
        onReset={onResetPasswordManually}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de supprimer définitivement <strong>{user.name}</strong>. 
              Cette action est irréversible et supprimera toutes les données associées à cet utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Désactiver le compte de {user.name} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              L'utilisateur ne pourra plus se connecter à la plateforme jusqu'à ce que son compte soit réactivé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusConfirm}>
              <UserX className="h-4 w-4 mr-2" />
              Confirmer la désactivation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Change Confirmation Dialog */}
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Changer le rôle de {user.name} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de changer le rôle de cet utilisateur de <strong>{user.role}</strong> à <strong>{selectedRole}</strong>. 
              Cela modifiera ses permissions et son accès aux fonctionnalités.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleConfirm}>
              <UserCog className="h-4 w-4 mr-2" />
              Confirmer le changement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
