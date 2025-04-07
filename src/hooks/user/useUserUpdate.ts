
import { User, Role, Permission, defaultRoles } from '@/types/users';
import { useToast } from '@/hooks/use-toast';
import { sendEmailNotification } from '@/utils/notificationUtils';
import { saveUsersToStorage } from '@/utils/userStorageUtils';

/**
 * Hook for user update functionality
 */
export const useUserUpdate = (users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>) => {
  const { toast } = useToast();

  const updateUser = (userId: string, userData: Partial<User>) => {
    const existingUser = users.find(u => u.id === userId);
    
    if (existingUser && existingUser.email !== userData.email) {
      sendEmailNotification({
        to: existingUser.email,
        subject: 'Modification de votre compte',
        content: {
          title: 'Changement d\'email',
          message: `Votre adresse email a été changée de ${existingUser.email} à ${userData.email}.`,
          callToAction: {
            text: 'Contactez-nous en cas de problème',
            url: `mailto:support@example.com`
          }
        }
      });
      
      if (userData.email) {
        sendEmailNotification({
          to: userData.email,
          subject: 'Confirmation de changement d\'email',
          content: {
            title: 'Email mis à jour',
            message: `Votre adresse email a été mise à jour. Vous pouvez désormais vous connecter avec ${userData.email}.`,
            callToAction: {
              text: 'Se connecter',
              url: `${window.location.origin}/login`
            }
          }
        });
      }
    }
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    );
    
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Utilisateur mis à jour",
        description: `Les informations de ${user.name} ont été mises à jour.`,
      });
      
      console.log(`[LOG] User updated: ${userId} (${user.name}) at ${new Date().toISOString()}`);
    }
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    const user = users.find(u => u.id === userId);
    
    const roleDefinition = defaultRoles.find(role => role.name === newRole);
    const newPermissions = roleDefinition ? roleDefinition.permissions : [];
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, role: newRole, permissions: newPermissions } : user
    );
    
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    if (user) {
      sendEmailNotification({
        to: user.email,
        subject: 'Changement de rôle sur la plateforme',
        content: {
          title: 'Votre rôle a été modifié',
          message: `Votre rôle a été changé de ${user.role} à ${newRole}. Vos permissions ont été mises à jour en conséquence.`,
          callToAction: {
            text: 'Se connecter pour voir vos nouvelles permissions',
            url: `${window.location.origin}/login`
          }
        }
      });
      
      console.log(`[LOG] User role changed: ${userId} from ${user.role} to ${newRole} at ${new Date().toISOString()}`);
    }
  };

  const updateUserPermissions = (userId: string, permissions: Permission[]) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, permissions } : user
    );
    
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Permissions mises à jour",
        description: `Les permissions de ${user.name} ont été modifiées.`,
      });
      
      console.log(`[LOG] User permissions updated: ${userId} at ${new Date().toISOString()}`);
    }
  };

  const updateUserStatus = (userId: string, newStatus: 'Active' | 'Inactive') => {
    const user = users.find(u => u.id === userId);
    
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    if (user) {
      sendEmailNotification({
        to: user.email,
        subject: newStatus === 'Active' ? 'Votre compte a été activé' : 'Votre compte a été désactivé',
        content: {
          title: newStatus === 'Active' ? 'Compte activé' : 'Compte désactivé',
          message: newStatus === 'Active' 
            ? `Votre compte a été activé. Vous pouvez maintenant vous connecter à la plateforme.` 
            : `Votre compte a été désactivé. Vous ne pourrez plus vous connecter à la plateforme jusqu'à sa réactivation.`,
          callToAction: newStatus === 'Active' ? {
            text: 'Se connecter',
            url: `${window.location.origin}/login`
          } : undefined
        }
      });
      
      console.log(`[LOG] User status changed: ${userId} to ${newStatus} at ${new Date().toISOString()}`);
    }
  };

  return {
    updateUser,
    updateUserRole,
    updateUserPermissions,
    updateUserStatus
  };
};
